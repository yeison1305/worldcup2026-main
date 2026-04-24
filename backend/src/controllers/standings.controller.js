const standingsService = require('../services/standings.service');

class StandingsController {
  async getAll(req, res, next) {
    try {
      const standings = await standingsService.getAll();
      res.status(200).json({
        status: 'success',
        data: { standings },
      });
    } catch (error) {
      next(error);
    }
  }

  async getByGroup(req, res, next) {
    try {
      const { group } = req.params;
      const result = await standingsService.getByGroup(group);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StandingsController();
