const db = require('../config/database');
const predictionService = require('./prediction.service');

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const ROUND_PAIRS = {
  ROUND_32: { next: 'ROUND_16', pairsPerGroup: 2 },
  ROUND_16: { next: 'QUARTER', pairsPerGroup: 2 },
  QUARTER:  { next: 'SEMI', pairsPerGroup: 2 },
  SEMI:     { next: 'FINAL', pairsPerGroup: 2 },
};

class BracketService {
  async generateFromGroups() {
    // 1. Get all finished group matches
    const { data: matches } = await db.supabase
      .from('matches')
      .select('home_team_id, away_team_id, home_score, away_score, group_letter')
      .eq('status', 'FINISHED');

    if (!matches || matches.length === 0) throw new Error('No hay partidos de grupo finalizados');

    // 2. Get all teams
    const { data: teams } = await db.supabase.from('teams').select('*');

    // 3. Calculate standings
    const stats = {};
    for (const t of teams) stats[t.id] = { team: t, pts: 0, gf: 0, ga: 0 };

    for (const m of matches) {
      const h = stats[m.home_team_id], a = stats[m.away_team_id];
      if (!h || !a) continue;
      h.gf += m.home_score; a.gf += m.away_score;
      h.ga += m.away_score; a.ga += m.home_score;
      if (m.home_score > m.away_score) h.pts += 3;
      else if (m.home_score < m.away_score) a.pts += 3;
      else { h.pts += 1; a.pts += 1; }
    }

    // 4. Get qualifiers: top 2 per group + 8 best 3rd places
    const winners = [], runnersUp = [], thirdPlaces = [];
    for (const g of GROUPS) {
      const groupTeams = Object.values(stats).filter(t => t.team.group_letter === g);
      groupTeams.sort((a,b) => b.pts - a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf - a.gf);
      if (groupTeams[0]) winners.push(groupTeams[0]);
      if (groupTeams[1]) runnersUp.push(groupTeams[1]);
      if (groupTeams[2]) thirdPlaces.push(groupTeams[2]);
    }
    thirdPlaces.sort((a,b) => b.pts - a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf - a.gf);
    const bestThirds = thirdPlaces.slice(0, 8);

    // 5. All 32 qualified, seeded by points
    const qualified = [...winners, ...runnersUp, ...bestThirds];
    qualified.sort((a,b) => b.pts - a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf - a.gf);

    // 6. Delete existing knockout matches
    await db.supabase.from('matches').delete().neq('phase', 'GROUP');

    // 7. Create R32 matches: 1vs32, 16vs17, 8vs25, etc.
    const venues = [
      { stadium: 'MetLife Stadium', location: 'East Rutherford' },
      { stadium: 'SoFi Stadium', location: 'Inglewood' },
      { stadium: 'AT&T Stadium', location: 'Arlington' },
      { stadium: 'Arrowhead Stadium', location: 'Kansas City' },
      { stadium: 'NRG Stadium', location: 'Houston' },
      { stadium: 'Mercedes-Benz Stadium', location: 'Atlanta' },
      { stadium: 'Lumen Field', location: 'Seattle' },
      { stadium: "Levi's Stadium", location: 'Santa Clara' },
    ];

    let baseDate = new Date('2026-06-28T14:00:00Z');
    for (let i = 0; i < 16; i++) {
      const [a, b] = [qualified[i], qualified[31 - i]];
      const date = new Date(baseDate);
      date.setDate(date.getDate() + Math.floor(i / 4));
      date.setHours([14, 16, 18, 20][i % 4]);
      const v = venues[i % venues.length];

      await db.supabase.from('matches').insert({
        phase: 'ROUND_32',
        round_number: 1,
        match_date: date.toISOString(),
        stadium: v.stadium,
        location: v.location,
        home_team_id: a.team.id,
        away_team_id: b.team.id,
        status: 'SCHEDULED',
        home_score: null,
        away_score: null,
      });
    }

    // 8. Create placeholder matches for later rounds
    const later = [
      { phase: 'ROUND_16', date: '2026-07-04', count: 8 },
      { phase: 'QUARTER', date: '2026-07-10', count: 4 },
      { phase: 'SEMI', date: '2026-07-14', count: 2 },
      { phase: 'THIRD_PLACE', date: '2026-07-18', count: 1 },
      { phase: 'FINAL', date: '2026-07-19', count: 1 },
    ];

    for (const p of later) {
      for (let i = 0; i < p.count; i++) {
        const date = new Date(p.date + 'T19:00:00Z');
        const v = venues[i % venues.length];
        await db.supabase.from('matches').insert({
          phase: p.phase,
          round_number: 2,
          match_date: date.toISOString(),
          stadium: p.phase === 'FINAL' ? 'MetLife Stadium' : v.stadium,
          location: p.phase === 'FINAL' ? 'East Rutherford' : v.location,
          status: 'SCHEDULED',
          home_score: null,
          away_score: null,
        });
      }
    }

    return { generated: true, teams: qualified.length };
  }

  async advanceRound(phase) {
    if (!ROUND_PAIRS[phase]) throw new Error(`La ronda ${phase} no tiene siguiente ronda`);

    const nextPhase = ROUND_PAIRS[phase].next;

    // Get current round matches, sorted by date
    const { data: currentMatches } = await db.supabase
      .from('matches')
      .select('*')
      .eq('phase', phase)
      .order('match_date', { ascending: true });

    const allFinished = currentMatches.every(m => m.status === 'FINISHED');
    if (!allFinished) throw new Error(`No todos los partidos de ${phase} han terminado`);

    // Get next round matches (placeholders)
    const { data: nextMatches } = await db.supabase
      .from('matches')
      .select('id')
      .eq('phase', nextPhase)
      .order('match_date', { ascending: true });

    if (!nextMatches || nextMatches.length === 0) throw new Error(`No hay partidos en ${nextPhase}`);

    // Pair current matches and determine winners
    for (let i = 0; i < nextMatches.length; i++) {
      const m1 = currentMatches[i * 2];
      const m2 = currentMatches[i * 2 + 1];
      const nextMatchId = nextMatches[i].id;

      const winner1 = getWinner(m1);
      const winner2 = m2 ? getWinner(m2) : null;

      if (!winner1) continue;

      await db.supabase.from('matches').update({
        home_team_id: winner1,
        away_team_id: winner2,
      }).eq('id', nextMatchId);
    }

    // After SEMI, assign losers to THIRD_PLACE
    if (phase === 'SEMI') {
      const { data: thirdPlace } = await db.supabase
        .from('matches')
        .select('id')
        .eq('phase', 'THIRD_PLACE')
        .single();

      if (thirdPlace && currentMatches.length >= 2) {
        const loser1 = getLoser(currentMatches[0]);
        const loser2 = getLoser(currentMatches[1]);

        if (loser1 && loser2) {
          await db.supabase.from('matches').update({
            home_team_id: loser1,
            away_team_id: loser2,
          }).eq('id', thirdPlace.id);
        }
      }
    }

    return { advanced: true, from: phase, to: nextPhase, matches: nextMatches.length };
  }

  async simulateMatch(matchId) {
    const { data: match } = await db.supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (!match) throw new Error('Partido no encontrado');
    if (!match.home_team_id || !match.away_team_id) throw new Error('Partido sin equipos asignados');

    let homeScore = Math.floor(Math.random() * 4);
    let awayScore = Math.floor(Math.random() * 4);
    if (homeScore === awayScore) {
      if (Math.random() > 0.5) homeScore++;
      else awayScore++;
    }

    await db.supabase.from('matches').update({
      home_score: homeScore,
      away_score: awayScore,
      status: 'FINISHED',
    }).eq('id', matchId);

    return { matchId, homeScore, awayScore };
  }

  async simulateAllInPhase(phase) {
    const { data: matches } = await db.supabase
      .from('matches')
      .select('id, home_team_id, away_team_id')
      .eq('phase', phase)
      .eq('status', 'SCHEDULED');

    if (!matches || matches.length === 0) return { simulated: 0 };

    const results = [];
    for (const m of matches) {
      if (!m.home_team_id || !m.away_team_id) continue;
      const h = Math.floor(Math.random() * 4);
      const a = Math.floor(Math.random() * 3);
      let homeScore = h, awayScore = a;

      // En eliminatoria no puede haber empate
      if (homeScore === awayScore) {
        if (Math.random() > 0.5) homeScore++;
        else awayScore++;
      }

      await db.supabase.from('matches').update({ home_score: homeScore, away_score: awayScore, status: 'FINISHED' }).eq('id', m.id);
      results.push({ matchId: m.id, homeScore, awayScore });
    }

    return { simulated: results.length, results };
  }

  async generatePredictions(phase) {
    const { data: matches } = await db.supabase
      .from('matches')
      .select(`
        id, home_team_id, away_team_id,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name)
      `)
      .eq('phase', phase)
      .eq('status', 'SCHEDULED');

    if (!matches || matches.length === 0) return { predicted: 0 };

    let count = 0;
    for (const m of matches) {
      const homeName = m.home_team?.name;
      const awayName = m.away_team?.name;
      if (!homeName || !awayName) continue;

      try {
        const prediction = await predictionService.predict(homeName, awayName);
        await db.supabase.from('predictions').upsert({
          match_id: m.id,
          predicted_winner: prediction.predictedWinner,
          home_win_probability: prediction.homeWinProbability,
          away_win_probability: prediction.awayWinProbability,
          draw_probability: prediction.drawProbability,
          confidence: prediction.confidence,
          reasoning: prediction.reasoning,
          model_version: prediction.modelVersion,
        }, { onConflict: 'match_id' });
        count++;
      } catch (err) {
        console.error(`[Bracket] Prediction error for match ${m.id}:`, err.message);
      }
    }

    return { predicted: count };
  }

  async simulateAllGroups() {
    const { data: matches } = await db.supabase
      .from('matches')
      .select('id, home_team_id, away_team_id')
      .eq('phase', 'GROUP')
      .eq('status', 'SCHEDULED');

    if (!matches || matches.length === 0) return { simulated: 0 };

    const results = [];
    for (const m of matches) {
      if (!m.home_team_id || !m.away_team_id) continue;
      const h = Math.floor(Math.random() * 4);
      const a = Math.floor(Math.random() * 3);
      // En grupo SÍ se permiten empates
      await db.supabase.from('matches').update({ home_score: h, away_score: a, status: 'FINISHED' }).eq('id', m.id);
      results.push({ matchId: m.id, homeScore: h, awayScore: a });
    }

    return { simulated: results.length, results };
  }
}

function getWinner(match) {
  if (!match || !match.home_team_id || !match.away_team_id) return null;
  if (match.home_score > match.away_score) return match.home_team_id;
  if (match.away_score > match.home_score) return match.away_team_id;
  return match.home_team_id;
}

function getLoser(match) {
  if (!match || !match.home_team_id || !match.away_team_id) return null;
  if (match.home_score > match.away_score) return match.away_team_id;
  if (match.away_score > match.home_score) return match.home_team_id;
  return match.away_team_id;
}

module.exports = new BracketService();
