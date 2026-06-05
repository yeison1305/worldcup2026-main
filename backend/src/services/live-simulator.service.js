const db = require('../config/database');

const TEAM_GENERIC_NAMES = {
  GOAL: (name) => `${name} anota`,
  YELLOW_CARD: (name) => `Amonestado: ${name}`,
  RED_CARD: (name) => `Expulsado: ${name}`,
  SUBSTITUTION: (name) => `Sustitución: ${name}`,
  PENALTY: (name) => `Penal para ${name}`,
  HALFTIME: () => 'Medio tiempo',
  FULLTIME: () => 'Final del partido',
};

class LiveSimulator {
  constructor() {
    this.activeMatches = new Map();
  }

  async startMatch(matchId) {
    const { data: match, error: matchErr } = await db.supabase
      .from('matches')
      .select('id, home_team_id, away_team_id')
      .eq('id', matchId)
      .single();

    if (matchErr || !match) throw new Error(matchErr?.message || 'Partido no encontrado');

    const { data: homeTeam } = await db.supabase.from('teams').select('name').eq('id', match.home_team_id).single();
    const { data: awayTeam } = await db.supabase.from('teams').select('name').eq('id', match.away_team_id).single();

    await db.supabase.from('matches').update({ status: 'LIVE', home_score: 0, away_score: 0 }).eq('id', matchId);

    const state = {
      matchId,
      homeName: homeTeam?.name || 'Local',
      awayName: awayTeam?.name || 'Visitante',
      homeScore: 0,
      awayScore: 0,
      minute: 0,
      _halftimeDone: false,
      interval: null,
    };

    this.activeMatches.set(matchId, state);
    this._simulate(matchId);

    return state;
  }

  async stopMatch(matchId) {
    const state = this.activeMatches.get(matchId);
    if (!state) return null;

    clearInterval(state.interval);
    this.activeMatches.delete(matchId);

    // Forzar ganador en eliminatoria (no puede haber empate)
    let finalHome = state.homeScore;
    let finalAway = state.awayScore;
    if (finalHome === finalAway) {
      if (Math.random() > 0.5) finalHome++;
      else finalAway++;
    }

    await db.supabase.from('matches').update({
      status: 'FINISHED',
      home_score: finalHome,
      away_score: finalAway,
    }).eq('id', matchId);

    await this._addEvent(matchId, 'FULLTIME', '', state.minute, 'Final del partido');

    return { homeScore: finalHome, awayScore: finalAway, events: state.minute };
  }

  async _simulate(matchId) {
    const state = this.activeMatches.get(matchId);
    if (!state) return;

    state.interval = setInterval(async () => {
      try {
        state.minute += Math.floor(Math.random() * 3) + 2;

      if (state.minute >= 45 && !state._halftimeDone) {
        state._halftimeDone = true;
        await this._addEvent(matchId, 'HALFTIME', '', 45, 'Medio tiempo');
      }

      if (state.minute >= 92) {
        await this.stopMatch(matchId);
        return;
      }

      const r = Math.random();

      if (r < 0.12) {
        const isHome = Math.random() > 0.5;
        const scorer = `Jugador ${state.minute}`;

        if (isHome) state.homeScore++;
        else state.awayScore++;

        await db.supabase.from('matches').update({
          home_score: state.homeScore,
          away_score: state.awayScore,
        }).eq('id', matchId);

        await this._addEvent(matchId, 'GOAL', isHome ? state.homeName : state.awayName, state.minute, `¡GOAL de ${isHome ? state.homeName : state.awayName}! ${scorer} marca el ${state.homeScore}-${state.awayScore}`);
      } else if (r < 0.25) {
        const team = Math.random() > 0.5 ? state.homeName : state.awayName;
        await this._addEvent(matchId, 'YELLOW_CARD', team, state.minute, `Tarjeta amarilla para ${team}`);
      } else if (r < 0.27) {
        const team = Math.random() > 0.5 ? state.homeName : state.awayName;
        await this._addEvent(matchId, 'SUBSTITUTION', team, state.minute, `Cambio en ${team}`);
      }

      this.activeMatches.set(matchId, state);
      } catch (err) {
        console.error('[LiveSimulator] Tick error:', err.message);
      }
    }, 2000);
  }

  async _addEvent(matchId, eventType, teamName, minute, description) {
    await db.supabase.from('live_events').insert({
      match_id: matchId,
      event_type: eventType,
      team_name: teamName,
      player_name: '',
      minute,
      description,
    });
  }

  getActiveMatches() {
    return Array.from(this.activeMatches.values());
  }

  async getEvents(matchId) {
    const { data, error } = await db.supabase
      .from('live_events')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

module.exports = new LiveSimulator();
