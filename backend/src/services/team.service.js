const teamRepository = require('../repositories/team.repository');
const matchRepository = require('../repositories/match.repository');
const { NotFoundError, BadRequestError } = require('../errors/AppError');

class TeamService {
  async getAll() {
    return teamRepository.findAll();
  }

  async getById(id) {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw NotFoundError.create('Equipo no encontrado');
    }
    return team;
  }

  async create({ name, flagUrl, groupLetter }) {
    if (!name || !groupLetter) {
      throw BadRequestError.create('Nombre y grupo son requeridos');
    }

    const existingTeams = await teamRepository.findByGroup(groupLetter);
    if (existingTeams.length >= 4) {
      throw BadRequestError.create(`El grupo ${groupLetter} ya tiene 4 equipos registrados`);
    }

    const team = await teamRepository.create({ name, flagUrl, groupLetter });
    return team;
  }

  async update(id, { name, flagUrl, groupLetter, isActive }) {
    const team = await teamRepository.update(id, { name, flagUrl, groupLetter, isActive });
    if (!team) {
      throw NotFoundError.create('Equipo no encontrado');
    }
    return team;
  }

  async delete(id) {
    const relatedMatches = await matchRepository.findByTeamId(id);
    if (relatedMatches.length > 0) {
      throw BadRequestError.create('No se puede eliminar un equipo que está en un partido');
    }

    const team = await teamRepository.delete(id);
    if (!team) {
      throw NotFoundError.create('Equipo no encontrado');
    }
    return { message: 'Equipo eliminado correctamente' };
  }

  async toggleActive(id) {
    const currentTeam = await teamRepository.findById(id);
    if (!currentTeam) {
      throw NotFoundError.create('Equipo no encontrado');
    }

    const newActiveStatus = !currentTeam.is_active;
    const team = await teamRepository.update(id, { isActive: newActiveStatus });
    return team;
  }
}

module.exports = new TeamService();
