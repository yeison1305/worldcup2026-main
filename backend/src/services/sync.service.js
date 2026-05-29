const teamRepository = require('../repositories/team.repository');
const db = require('../config/database');

const JAVA_API_URL = 'http://localhost:8080/api';

class SyncService {
  constructor() {
    this.teamMap = {};
  }

  async syncAll() {
    try {
      const teams = await this.syncTeams();
      await this.syncMatches(teams);
      await this.generateStats(teams);
      return { success: true, teamsSynced: Object.keys(teams).length };
    } catch (error) {
      console.error('[SyncService] Error en sincronización:', error.message);
      throw error;
    }
  }

  async syncTeams() {
    const supabaseTeams = await teamRepository.findAll();

    for (const team of supabaseTeams) {
      try {
        const response = await fetch(`${JAVA_API_URL}/teams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: team.name, country: team.name }),
        });

        if (!response.ok) {
          const body = await response.text();
          if (!body.includes('already exists')) {
            console.warn(`[SyncService] No se pudo crear equipo ${team.name}: ${body}`);
          }
        }

        const javaTeams = await this.getJavaTeamByName(team.name);
        if (javaTeams.length > 0) {
          this.teamMap[team.name] = javaTeams[0].id;
        }
      } catch (err) {
        console.warn(`[SyncService] Error creando equipo ${team.name}:`, err.message);
      }
    }

    console.log(`[SyncService] Sincronizados ${Object.keys(this.teamMap).length} equipos`);
    return this.teamMap;
  }

  async getJavaTeamByName(name) {
    const response = await fetch(`${JAVA_API_URL}/teams`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return [];

    const body = await response.json();
    const teams = body.data || [];

    return teams.filter((t) => t.name.toLowerCase() === name.toLowerCase());
  }

  async syncMatches(teamMap) {
    const { data: matches, error } = await db.supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name)
      `)
      .eq('status', 'FINISHED')
      .not('home_score', 'is', null)
      .not('away_score', 'is', null);

    if (error) throw error;

    let synced = 0;

    for (const match of matches || []) {
      const homeName = match.home_team?.name;
      const awayName = match.away_team?.name;

      const homeId = teamMap[homeName];
      const awayId = teamMap[awayName];

      if (!homeId || !awayId) {
        console.warn(`[SyncService] IDs no encontrados para ${homeName} vs ${awayName}`);
        continue;
      }

      try {
        const response = await fetch(`${JAVA_API_URL}/matches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            homeTeamId: homeId,
            awayTeamId: awayId,
            homeScore: match.home_score,
            awayScore: match.away_score,
            matchDate: match.match_date,
          }),
        });

        if (response.ok) synced++;
      } catch (err) {
        console.warn(`[SyncService] Error en match ${homeName} vs ${awayName}:`, err.message);
      }
    }

    console.log(`[SyncService] Sincronizados ${synced} partidos`);
  }

  async generateStats(teamMap) {
    let count = 0;

    for (const [name, id] of Object.entries(teamMap)) {
      try {
        const response = await fetch(`${JAVA_API_URL}/statistics/${id}`);

        if (response.ok) count++;
      } catch (err) {
        console.warn(`[SyncService] Error generando stats para ${name}:`, err.message);
      }
    }

    console.log(`[SyncService] Stats generados para ${count} equipos`);
  }
}

module.exports = new SyncService();
