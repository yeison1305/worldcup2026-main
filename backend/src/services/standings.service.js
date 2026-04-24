const standingsRepository = require('../repositories/standings.repository');
const { BadRequestError } = require('../errors/AppError');

const VALID_GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

class StandingsService {
  /**
   * Obtiene la tabla de posiciones de un grupo
   * @param {string} groupLetter
   */
  async getByGroup(groupLetter) {
    const letter = groupLetter.toUpperCase();
    if (!VALID_GROUPS.includes(letter)) {
      throw BadRequestError.create('Grupo inválido. Use A-H');
    }

    const standings = await standingsRepository.calculateByGroup(letter);
    return {
      group: letter,
      standings,
    };
  }

  /**
   * Obtiene las tablas de posiciones de todos los grupos
   */
  async getAll() {
    const results = {};

    for (const group of VALID_GROUPS) {
      const standings = await standingsRepository.calculateByGroup(group);
      if (standings.length > 0) {
        results[group] = standings;
      }
    }

    return results;
  }
}

module.exports = new StandingsService();
