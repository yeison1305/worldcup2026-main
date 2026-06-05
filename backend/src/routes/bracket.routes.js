const express = require('express');
const router = express.Router();
const bracketController = require('../controllers/bracket.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

router.post('/generate', requireAuth, requireAdmin, (req, res, next) => bracketController.generate(req, res, next));
router.post('/advance', requireAuth, requireAdmin, (req, res, next) => bracketController.advance(req, res, next));
router.post('/simulate', requireAuth, requireAdmin, (req, res, next) => bracketController.simulateAll(req, res, next));
router.post('/simulate-groups', requireAuth, requireAdmin, (req, res, next) => bracketController.simulateGroups(req, res, next));
router.post('/predict', requireAuth, requireAdmin, (req, res, next) => bracketController.predictAll(req, res, next));

module.exports = router;
