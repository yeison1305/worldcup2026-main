const db = require('../config/database');

class MatchRepository {
  /**
   * Obtiene todos los partidos con información de equipos
   * Usa el SDK de Supabase directamente para JOINs
   */
  async findAll() {
    const { data, error } = await db.supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name, flag_url, group_letter),
        away_team:teams!matches_away_team_id_fkey(id, name, flag_url, group_letter)
      `)
      .order('match_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtiene un partido por ID con información de equipos
   */
  async findById(id) {
    const { data, error } = await db.supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name, flag_url, group_letter),
        away_team:teams!matches_away_team_id_fkey(id, name, flag_url, group_letter)
      `)
      .eq('id', id)
      .single();

if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  /**
   * Obtiene partidos de un grupo específico
   */
  async findByGroup(groupLetter) {
    const { data, error } = await db.supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name, flag_url, group_letter),
        away_team:teams!matches_away_team_id_fkey(id, name, flag_url, group_letter)
      `)
      .eq('group_letter', groupLetter)
      .order('round_number', { ascending: true })
      .order('match_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Verifica si un equipo está asignado a algún partido
   */
  async findByTeamId(teamId) {
    const { data, error } = await db.supabase
      .from('matches')
      .select('id, phase, group_letter, status')
      .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`);

    if (error) throw error;
    return data || [];
  }

  /**
   * Elimina un partido
   */
  async delete(id) {
    const { data, error } = await db.supabase
      .from('matches')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async create(matchData) {
    const { data, error } = await db.supabase
      .from('matches')
      .insert(matchData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await db.supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateResult(id, homeScore, awayScore, status) {
    const { data, error } = await db.supabase
      .from('matches')
      .update({ home_score: homeScore, away_score: awayScore, status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new MatchRepository();
