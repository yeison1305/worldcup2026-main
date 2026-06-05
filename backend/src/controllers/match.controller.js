const matchService = require('../services/match.service');
const liveSimulator = require('../services/live-simulator.service');
const { logAudit } = require('../middlewares/audit.middleware');
const userRepository = require('../repositories/user.repository');
const emailService = require('../utils/email.util');

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
      logAudit(req, 'CREATE', 'match', match.id);
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
      logAudit(req, 'UPDATE', 'match', id);
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
      logAudit(req, 'UPDATE_RESULT', 'match', id);
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
      logAudit(req, 'DELETE', 'match', id);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async startSimulation(req, res, next) {
    try {
      const { id } = req.params;
      const state = await liveSimulator.startMatch(parseInt(id));

      // Disparar notificación por email (async, no bloquea la respuesta)
      sendStartNotification(state).catch(err => console.error('Notify error:', err.message));

      res.status(200).json({
        status: 'success',
        data: {
          matchId: state.matchId,
          homeName: state.homeName,
          awayName: state.awayName,
          homeScore: state.homeScore,
          awayScore: state.awayScore,
          minute: state.minute,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async stopSimulation(req, res, next) {
    try {
      const { id } = req.params;
      const result = await liveSimulator.stopMatch(parseInt(id));
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getEvents(req, res, next) {
    try {
      const { id } = req.params;
      const events = await liveSimulator.getEvents(parseInt(id));
      res.status(200).json({ status: 'success', data: { events } });
    } catch (error) {
      next(error);
    }
  }

  async getLiveStatus(req, res, next) {
    try {
      const active = liveSimulator.getActiveMatches();
      const clean = active.map(({ matchId, homeName, awayName, homeScore, awayScore, minute }) => ({
        matchId, homeName, awayName, homeScore, awayScore, minute,
      }));
      res.status(200).json({ status: 'success', data: { active: clean } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MatchController();

async function sendStartNotification(state) {
  try {
    const users = await userRepository.findAll();
    const emails = users.map(u => u.email).filter(Boolean);
    if (emails.length === 0) return;
    await emailService.sendMatchStartNotification(emails, {
      homeName: state.homeName,
      awayName: state.awayName,
    });
  } catch (err) {
    console.error('Email notification error:', err.message);
  }
}
