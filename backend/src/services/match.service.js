const matchRepository = require('../repositories/match.repository');
const teamRepository = require('../repositories/team.repository');
const { ErrorFactory, NotFoundError, BadRequestError } = require('../errors/AppError');
const { MatchCollection } = require('../iterators/MatchCollection');

class MatchService {
  async getAll() {
    const matches = await matchRepository.findAll();
    return matches;
  }

  /**
   * Obtiene partidos filtrados usando el Iterator Pattern
   * @param {object} filters - { group, status, round }
   */
  async getFiltered(filters = {}) {
    const allMatches = await matchRepository.findAll();
    const collection = new MatchCollection(allMatches);

    let iterator = collection[Symbol.iterator]();

    if (filters.group) {
      iterator = collection.filterByGroup(filters.group);
    }
    if (filters.status) {
      iterator = iterator.filterByStatus
        ? iterator.filterByStatus(filters.status)
        : collection.filterByStatus(filters.status);
    }
    if (filters.round) {
      iterator = iterator.filterByRound
        ? iterator.filterByRound(filters.round)
        : collection.filterByRound(filters.round);
    }

    return iterator.toArray();
  }

  async getById(id) {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw NotFoundError.create('Partido no encontrado');
    }
    return match;
  }

  async getByGroup(groupLetter) {
    const validGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    if (!validGroups.includes(groupLetter.toUpperCase())) {
      throw BadRequestError.create('Grupo inválido. Use A-H');
    }
    return matchRepository.findByGroup(groupLetter.toUpperCase());
  }

  async create({ homeTeamId, awayTeamId, phase, groupLetter, roundNumber, matchDate, stadium, location }) {
    if (!homeTeamId || !awayTeamId) {
      throw BadRequestError.create('Se requieren ambos equipos');
    }

    if (homeTeamId === awayTeamId) {
      throw BadRequestError.create('Un equipo no puede jugar contra sí mismo');
    }

    // Verificar que los equipos existen
    const homeTeam = await teamRepository.findById(homeTeamId);
    const awayTeam = await teamRepository.findById(awayTeamId);

    if (!homeTeam) throw NotFoundError.create('Equipo local no encontrado');
    if (!awayTeam) throw NotFoundError.create('Equipo visitante no encontrado');

    return matchRepository.create({
      homeTeamId,
      awayTeamId,
      phase: phase || 'GROUP',
      groupLetter,
      roundNumber,
      matchDate,
      stadium,
      location,
    });
  }

  async update(id, updates) {
    const existing = await matchRepository.findById(id);
    if (!existing) {
      throw NotFoundError.create('Partido no encontrado');
    }
    return matchRepository.update(id, updates);
  }

  async updateResult(id, homeScore, awayScore) {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw NotFoundError.create('Partido no encontrado');
    }

    if (homeScore < 0 || awayScore < 0) {
      throw BadRequestError.create('Los marcadores no pueden ser negativos');
    }

    const result = await matchRepository.updateResult(id, homeScore, awayScore, 'FINISHED');

    console.log(`[MatchService] Resultado actualizado: Partido #${id} → ${homeScore}-${awayScore}`);

    return result;
  }

  async delete(id) {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw NotFoundError.create('Partido no encontrado');
    }
    await matchRepository.delete(id);
    return { message: 'Partido eliminado correctamente' };
  }
}

module.exports = new MatchService();
