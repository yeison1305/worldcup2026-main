const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/prediction.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/upcoming', requireAuth, (req, res, next) => predictionController.getUpcoming(req, res, next));
router.get('/stats', requireAuth, (req, res, next) => predictionController.getStats(req, res, next));
router.get('/match/:matchId', requireAuth, (req, res, next) => predictionController.getByMatch(req, res, next));
router.post('/', requireAuth, (req, res, next) => predictionController.predict(req, res, next));
router.post('/generate-all', requireAuth, requireAdmin, (req, res, next) => predictionController.generateAll(req, res, next));
router.post('/sync', requireAuth, (req, res, next) => predictionController.sync(req, res, next));

module.exports = router;
