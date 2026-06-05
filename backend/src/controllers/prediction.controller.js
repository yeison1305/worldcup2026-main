const predictionService = require('../services/prediction.service');
const syncService = require('../services/sync.service');

class PredictionController {
  async predict(req, res, next) {
    try {
      const { homeTeamName, awayTeamName } = req.body;

      if (!homeTeamName || !awayTeamName) {
        return res.status(400).json({
          status: 'fail',
          message: 'Se requieren homeTeamName y awayTeamName',
        });
      }

      const result = await predictionService.predict(homeTeamName, awayTeamName);

      res.status(200).json({
        status: 'success',
        data: { prediction: result },
      });
    } catch (error) {
      next(error);
    }
  }

  async generateAll(req, res, next) {
    try {
      const result = await predictionService.generateAll();

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByMatch(req, res, next) {
    try {
      const { matchId } = req.params;
      const prediction = await predictionService.getByMatch(matchId);

      res.status(200).json({
        status: 'success',
        data: { prediction },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcoming(req, res, next) {
    try {
      const matches = await predictionService.getUpcomingWithPredictions();

      res.status(200).json({
        status: 'success',
        data: { matches },
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const [stats, accuracy] = await Promise.all([
        predictionService.getStats(),
        predictionService.getAccuracy(),
      ]);

      res.status(200).json({
        status: 'success',
        data: { ...stats, accuracy },
      });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const history = await predictionService.getHistory(req.user.id);

      res.status(200).json({
        status: 'success',
        data: { history },
      });
    } catch (error) {
      next(error);
    }
  }

  async predictChampion(req, res, next) {
    try {
      const result = await predictionService.predictChampion();

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async sync(req, res, next) {
    try {
      const result = await syncService.syncAll();

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PredictionController();
