const express = require('express');
const router = express.Router();
const standingsController = require('../controllers/standings.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

// Ambas rutas requieren autenticación pero no admin
router.get('/', requireAuth, (req, res, next) => standingsController.getAll(req, res, next));
router.get('/:group', requireAuth, (req, res, next) => standingsController.getByGroup(req, res, next));

module.exports = router;
