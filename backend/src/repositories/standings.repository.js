const matchRepository = require('./match.repository');
const teamRepository = require('./team.repository');
const { MatchCollection } = require('../iterators/MatchCollection');

class StandingsRepository {
  /**
   * Calcula la tabla de posiciones de un grupo usando el Iterator Pattern.
   * Recorre solo los partidos FINISHED del grupo indicado.
   * @param {string} groupLetter
   * @returns {Promise<object[]>} Tabla de posiciones ordenada
   */
  async calculateByGroup(groupLetter) {
    const allMatches = await matchRepository.findAll();
    const collection = new MatchCollection(allMatches);

    // Primero: incluir TODOS los equipos activos del grupo directamente desde teams
    const groupTeams = await teamRepository.findByGroup(groupLetter);
    const statsMap = {};

    for (const team of groupTeams) {
      statsMap[team.id] = this._createEmptyStats(team.id, team);
    }

    // Segundo: procesar partidos finalizados para actualizar estadísticas
    const finishedIterator = collection
      .filterByGroup(groupLetter)
      .filterByStatus('FINISHED');

    // Recorrer con el iterator
    for (const match of finishedIterator) {
      const homeId = match.home_team_id;
      const awayId = match.away_team_id;
      const homeScore = match.home_score || 0;
      const awayScore = match.away_score || 0;

      // Inicializar equipo local si no existe
      if (!statsMap[homeId]) {
        statsMap[homeId] = this._createEmptyStats(homeId, match.home_team);
      }
      // Inicializar equipo visitante si no existe
      if (!statsMap[awayId]) {
        statsMap[awayId] = this._createEmptyStats(awayId, match.away_team);
      }

      // Actualizar estadísticas
      statsMap[homeId].played++;
      statsMap[awayId].played++;
      statsMap[homeId].goalsFor += homeScore;
      statsMap[homeId].goalsAgainst += awayScore;
      statsMap[awayId].goalsFor += awayScore;
      statsMap[awayId].goalsAgainst += homeScore;

      if (homeScore > awayScore) {
        // Victoria local
        statsMap[homeId].won++;
        statsMap[homeId].points += 3;
        statsMap[awayId].lost++;
      } else if (homeScore < awayScore) {
        // Victoria visitante
        statsMap[awayId].won++;
        statsMap[awayId].points += 3;
        statsMap[homeId].lost++;
      } else {
        // Empate
        statsMap[homeId].drawn++;
        statsMap[homeId].points += 1;
        statsMap[awayId].drawn++;
        statsMap[awayId].points += 1;
      }
    }

    // Calcular diferencia de goles
    const standings = Object.values(statsMap).map((stat) => ({
      ...stat,
      goalDifference: stat.goalsFor - stat.goalsAgainst,
    }));

    // Ordenar según reglas FIFA: Puntos → Diferencia de goles → Goles a favor
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if ((b.goalsFor - b.goalsAgainst) !== (a.goalsFor - a.goalsAgainst)) {
        return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
      }
      return b.goalsFor - a.goalsFor;
    });

    // Agregar posición
    return standings.map((stat, index) => ({
      position: index + 1,
      ...stat,
    }));
  }

  /**
   * Crea un objeto de estadísticas vacío para un equipo
   */
  _createEmptyStats(teamId, teamInfo) {
    return {
      teamId,
      teamName: teamInfo?.name || 'Desconocido',
      teamFlagUrl: teamInfo?.flag_url || null,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  }
}

module.exports = new StandingsRepository();
