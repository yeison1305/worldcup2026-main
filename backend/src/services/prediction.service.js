const JAVA_API_URL = process.env.JAVA_API_URL || 'http://localhost:8080/api';
const predictionRepository = require('../repositories/prediction.repository');
const db = require('../config/database');

class PredictionService {
  async predict(homeTeamName, awayTeamName) {
    const response = await fetch(`${JAVA_API_URL}/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homeTeamName, awayTeamName }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Java prediction service error: ${body}`);
    }

    const body = await response.json();
    return body.data;
  }

  async generateAll() {
    const { data: matches, error } = await db.supabase
      .from('matches')
      .select(`
        id,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name)
      `)
      .eq('status', 'SCHEDULED');

    if (error) throw error;

    const results = [];

    for (const match of matches || []) {
      const homeName = match.home_team?.name;
      const awayName = match.away_team?.name;

      if (!homeName || !awayName) continue;

      try {
        const prediction = await this.predict(homeName, awayName);

        await predictionRepository.upsert({
          match_id: match.id,
          predicted_winner: prediction.predictedWinner,
          home_win_probability: prediction.homeWinProbability,
          away_win_probability: prediction.awayWinProbability,
          draw_probability: prediction.drawProbability,
          confidence: prediction.confidence,
          reasoning: prediction.reasoning,
          model_version: prediction.modelVersion,
        });

        results.push({ matchId: match.id, winner: prediction.predictedWinner });
      } catch (err) {
        console.error(`[PredictionService] Error predicting match ${match.id}:`, err.message);
        results.push({ matchId: match.id, error: err.message });
      }
    }

    return { total: matches?.length || 0, predicted: results.filter(r => !r.error).length, results };
  }

  async getByMatch(matchId) {
    return predictionRepository.findByMatchId(matchId);
  }

  async getUpcomingWithPredictions() {
    const { data: matches, error } = await db.supabase
      .from('matches')
      .select(`
        id, home_score, away_score, phase, group_letter, round_number, match_date, stadium, location, status,
        home_team:teams!matches_home_team_id_fkey(id, name, flag_url, group_letter),
        away_team:teams!matches_away_team_id_fkey(id, name, flag_url, group_letter)
      `)
      .eq('status', 'SCHEDULED')
      .order('match_date', { ascending: true })
      .limit(10);

    if (error) throw error;

    const matchIds = (matches || []).map(m => m.id);
    const predictions = matchIds.length > 0
      ? await predictionRepository.findByMultipleMatchIds(matchIds)
      : [];

    const predictionMap = {};
    for (const p of predictions) {
      predictionMap[p.match_id] = p;
    }

    return (matches || []).map(match => ({
      ...match,
      prediction: predictionMap[match.id] || null,
    }));
  }

  async getStats() {
    const { count: totalMatches } = await db.supabase
      .from('matches')
      .select('*', { count: 'exact', head: true });

    const { count: scheduledMatches } = await db.supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'SCHEDULED');

    const { count: finishedMatches } = await db.supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'FINISHED');

    const { count: totalPredictions } = await db.supabase
      .from('predictions')
      .select('*', { count: 'exact', head: true });

    return {
      totalMatches,
      scheduledMatches,
      finishedMatches,
      totalPredictions,
    };
  }

  async getAccuracy() {
    const { data: predictions } = await db.supabase
      .from('predictions')
      .select('match_id, predicted_winner');

    if (!predictions || predictions.length === 0) {
      return { correct: 0, incorrect: 0, total: 0, accuracy: 0 };
    }

    const matchIds = predictions.map(p => p.match_id);

    const { data: finishedMatches } = await db.supabase
      .from('matches')
      .select(`
        id, home_score, away_score, status,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name)
      `)
      .in('id', matchIds)
      .eq('status', 'FINISHED')
      .not('home_score', 'is', null);

    const matchMap = {};
    for (const m of finishedMatches || []) {
      matchMap[m.id] = m;
    }

    let correct = 0;
    let incorrect = 0;
    let total = 0;

    for (const p of predictions) {
      const m = matchMap[p.match_id];
      if (!m) continue;
      if (m.home_score === m.away_score) continue;

      total++;
      const actualWinnerName = m.home_score > m.away_score ? m.home_team?.name : m.away_team?.name;

      const predicted = (p.predicted_winner || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const actual = (actualWinnerName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (predicted === actual) correct++;
      else incorrect++;
    }

    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { correct, incorrect, total, accuracy };
  }

  async getHistory(userId) {
    return predictionRepository.findByUser(userId);
  }

  async predictChampion() {
    const { data: allTeams } = await db.supabase
      .from('teams')
      .select('id, name, group_letter, flag_url');

    const { data: predictions } = await db.supabase
      .from('predictions')
      .select('match_id, predicted_winner, confidence, home_win_probability, away_win_probability');

    const teamPower = {};

    for (const team of allTeams || []) {
      teamPower[team.name] = { team, wins: 0, score: 0 };
    }

    for (const p of predictions || []) {
      const winner = teamPower[p.predicted_winner];
      if (winner) {
        winner.wins++;
        winner.score += p.confidence || 50;
      }
    }

    const ranked = Object.values(teamPower)
      .sort((a, b) => b.score - a.score);

    // Simulate knockout bracket with top 32
    const top32 = ranked.slice(0, 32);

    const simulateKnockout = (teams) => {
      if (teams.length === 1) return teams[0];
      const winners = [];
      for (let i = 0; i < teams.length; i += 2) {
        const a = teams[i];
        const b = teams[i + 1];
        const totalScore = a.score + b.score;
        const aProb = totalScore > 0 ? (a.score / totalScore) * 100 : 50;
        const winner_team = a.score >= b.score ? a : b;
        winners.push(winner_team);
      }
      return simulateKnockout(winners);
    };

    const champion = simulateKnockout(top32);
    const runnerUp = top32.filter(t => t.team.name !== champion.team.name).slice(0, 1)[0];

    const top4 = ranked.slice(0, 4).map(t => ({
      name: t.team.name,
      group: t.team.group_letter,
      score: Math.round(t.score),
    }));

    return {
      champion: { name: champion.team.name, group: champion.team.group_letter, score: Math.round(champion.score) },
      top4,
      reasoning: `Simulación del bracket basada en ${predictions?.length || 0} predicciones de fase de grupos. ${champion.team.name} lidera el ranking de poder con ${Math.round(champion.score)} puntos acumulados de predicciones.`,
    };
  }
}

module.exports = new PredictionService();
