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
