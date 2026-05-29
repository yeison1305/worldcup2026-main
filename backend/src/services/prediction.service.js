const JAVA_API_URL = 'http://localhost:8080/api';
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
}

module.exports = new PredictionService();
