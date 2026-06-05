const express = require('express');
const router = express.Router();
const standingsController = require('../controllers/standings.controller');

/**
 * @swagger
 * /api/standings:
 *   get:
 *     tags: [Standings]
 *     summary: Tabla de posiciones de todos los grupos (público)
 *     responses:
 *       200: { description: Tablas de posiciones de los 12 grupos }
 */
router.get('/', (req, res, next) => standingsController.getAll(req, res, next));

/**
 * @swagger
 * /api/standings/{group}:
 *   get:
 *     tags: [Standings]
 *     summary: Tabla de posiciones de un grupo específico (público)
 *     parameters:
 *       - in: path
 *         name: group
 *         required: true
 *         schema: { type: string, enum: [A, B, C, D, E, F, G, H, I, J, K, L] }
 *     responses:
 *       200: { description: Tabla de posiciones del grupo }
 *       400: { description: Grupo inválido }
 */
router.get('/:group', (req, res, next) => standingsController.getByGroup(req, res, next));

module.exports = router;
