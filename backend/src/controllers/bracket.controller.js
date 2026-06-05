const bracketService = require('../services/bracket.service');

class BracketController {
  async generate(req, res, next) {
    try {
      const result = await bracketService.generateFromGroups();
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async advance(req, res, next) {
    try {
      const { phase } = req.body;
      if (!phase) return res.status(400).json({ status: 'fail', message: 'Se requiere la fase (phase)' });
      const result = await bracketService.advanceRound(phase);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async simulateAll(req, res, next) {
    try {
      const { phase } = req.body;
      if (!phase) return res.status(400).json({ status: 'fail', message: 'Se requiere la fase (phase)' });
      const result = await bracketService.simulateAllInPhase(phase);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async predictAll(req, res, next) {
    try {
      const { phase } = req.body;
      if (!phase) return res.status(400).json({ status: 'fail', message: 'Se requiere la fase (phase)' });
      const result = await bracketService.generatePredictions(phase);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async simulateGroups(req, res, next) {
    try {
      const result = await bracketService.simulateAllGroups();
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BracketController();
