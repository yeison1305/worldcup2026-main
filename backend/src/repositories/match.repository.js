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
   * Crea un nuevo partido
   */
  async create({ homeTeamId, awayTeamId, phase, groupLetter, roundNumber, matchDate, stadium, location }) {
    const { data, error } = await db.supabase
      .from('matches')
      .insert({
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        phase: phase || 'GROUP',
        group_letter: groupLetter,
        round_number: roundNumber,
        match_date: matchDate,
        stadium,
        location,
        status: 'SCHEDULED',
        home_score: 0,
        away_score: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Actualiza un partido existente
   */
  async update(id, updates) {
    const updateData = {};

    if (updates.homeTeamId !== undefined) updateData.home_team_id = updates.homeTeamId;
    if (updates.awayTeamId !== undefined) updateData.away_team_id = updates.awayTeamId;
    if (updates.phase !== undefined) updateData.phase = updates.phase;
    if (updates.groupLetter !== undefined) updateData.group_letter = updates.groupLetter;
    if (updates.roundNumber !== undefined) updateData.round_number = updates.roundNumber;
    if (updates.matchDate !== undefined) updateData.match_date = updates.matchDate;
    if (updates.stadium !== undefined) updateData.stadium = updates.stadium;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.homeScore !== undefined) updateData.home_score = updates.homeScore;
    if (updates.awayScore !== undefined) updateData.away_score = updates.awayScore;

    updateData.updated_at = new Date().toISOString();

    if (Object.keys(updateData).length === 1) return this.findById(id);

    const { data, error } = await db.supabase
      .from('matches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data || null;
  }

  /**
   * Registra resultado de un partido
   */
  async updateResult(id, homeScore, awayScore, status = 'FINISHED') {
    const { data, error } = await db.supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data || null;
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
}

module.exports = new MatchRepository();
