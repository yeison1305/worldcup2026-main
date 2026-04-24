const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

// Rutas públicas (requieren autenticación pero no admin)
router.get('/', requireAuth, (req, res, next) => matchController.getAll(req, res, next));
router.get('/group/:letter', requireAuth, (req, res, next) => matchController.getByGroup(req, res, next));
router.get('/:id', requireAuth, (req, res, next) => matchController.getById(req, res, next));

// Rutas de administración
router.post('/', requireAuth, requireAdmin, (req, res, next) => matchController.create(req, res, next));
router.put('/:id', requireAuth, requireAdmin, (req, res, next) => matchController.update(req, res, next));
router.patch('/:id/result', requireAuth, requireAdmin, (req, res, next) => matchController.updateResult(req, res, next));
router.delete('/:id', requireAuth, requireAdmin, (req, res, next) => matchController.delete(req, res, next));

module.exports = router;
