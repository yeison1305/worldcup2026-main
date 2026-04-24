const matchService = require('../services/match.service');

class MatchController {
  async getAll(req, res, next) {
    try {
      const { group, status, round } = req.query;
      let matches;

      if (group || status || round) {
        matches = await matchService.getFiltered({ group, status, round: round ? parseInt(round) : undefined });
      } else {
        matches = await matchService.getAll();
      }

      res.status(200).json({
        status: 'success',
        data: { matches },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const match = await matchService.getById(id);
      res.status(200).json({
        status: 'success',
        data: { match },
      });
    } catch (error) {
      next(error);
    }
  }

  async getByGroup(req, res, next) {
    try {
      const { letter } = req.params;
      const matches = await matchService.getByGroup(letter);
      res.status(200).json({
        status: 'success',
        data: { matches },
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { homeTeamId, awayTeamId, phase, groupLetter, roundNumber, matchDate, stadium, location } = req.body;
      const match = await matchService.create({
        homeTeamId,
        awayTeamId,
        phase,
        groupLetter,
        roundNumber,
        matchDate,
        stadium,
        location,
      });
      res.status(201).json({
        status: 'success',
        data: { match },
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const match = await matchService.update(id, req.body);
      res.status(200).json({
        status: 'success',
        data: { match },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateResult(req, res, next) {
    try {
      const { id } = req.params;
      const { homeScore, awayScore } = req.body;
      const match = await matchService.updateResult(id, homeScore, awayScore);
      res.status(200).json({
        status: 'success',
        data: { match },
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await matchService.delete(id);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MatchController();
