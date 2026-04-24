const teamService = require('../services/team.service');

class TeamController {
  async getAll(req, res, next) {
    try {
      const teams = await teamService.getAll();
      res.status(200).json({
        status: 'success',
        data: { teams }
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const team = await teamService.getById(id);
      res.status(200).json({
        status: 'success',
        data: { team }
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name, flagUrl, groupLetter } = req.body;
      const team = await teamService.create({ name, flagUrl, groupLetter });
      res.status(201).json({
        status: 'success',
        data: { team }
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, flagUrl, groupLetter, isActive } = req.body;
      const team = await teamService.update(id, { name, flagUrl, groupLetter, isActive });
      res.status(200).json({
        status: 'success',
        data: { team }
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await teamService.delete(id);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleActive(req, res, next) {
    try {
      const { id } = req.params;
      const team = await teamService.toggleActive(id);
      res.status(200).json({
        status: 'success',
        data: { team }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamController();
