const db = require('../config/database');

class PredictionRepository {
  async findByMatchId(matchId) {
    const { data, error } = await db.supabase
      .from('predictions')
      .select('*')
      .eq('match_id', matchId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async upsert(prediction) {
    const { data, error } = await db.supabase
      .from('predictions')
      .upsert(prediction, { onConflict: 'match_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findByUser(userId) {
    const { data, error } = await db.supabase
      .from('predictions')
      .select(`
        id,
        match_id,
        predicted_winner,
        home_win_probability,
        away_win_probability,
        draw_probability,
        confidence,
        reasoning,
        model_version,
        created_at,
        match:matches (
          id, home_score, away_score, phase, group_letter, status, match_date, stadium,
          home_team:teams!matches_home_team_id_fkey(name, flag_url),
          away_team:teams!matches_away_team_id_fkey(name, flag_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  }

  async findByMultipleMatchIds(matchIds) {
    const { data, error } = await db.supabase
      .from('predictions')
      .select('*')
      .in('match_id', matchIds);

    if (error) throw error;
    return data || [];
  }
}

module.exports = new PredictionRepository();
