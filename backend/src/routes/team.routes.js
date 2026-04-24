const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', requireAuth, requireAdmin, (req, res, next) => teamController.getAll(req, res, next));
router.get('/:id', requireAuth, requireAdmin, (req, res, next) => teamController.getById(req, res, next));
router.post('/', requireAuth, requireAdmin, (req, res, next) => teamController.create(req, res, next));
router.put('/:id', requireAuth, requireAdmin, (req, res, next) => teamController.update(req, res, next));
router.delete('/:id', requireAuth, requireAdmin, (req, res, next) => teamController.delete(req, res, next));
router.patch('/:id/toggle', requireAuth, requireAdmin, (req, res, next) => teamController.toggleActive(req, res, next));

module.exports = router;
