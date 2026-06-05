const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/teams:
 *   get:
 *     tags: [Teams]
 *     summary: Listar todos los equipos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de equipos }
 *   post:
 *     tags: [Teams]
 *     summary: Crear equipo (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Argentina" }
 *               flagUrl: { type: string }
 *               groupLetter: { type: string, example: "J" }
 *     responses:
 *       201: { description: Equipo creado }
 *       403: { description: Requiere rol ADMIN }
 */
router.get('/', requireAuth, (req, res, next) => teamController.getAll(req, res, next));
router.post('/', requireAuth, requireAdmin, (req, res, next) => teamController.create(req, res, next));

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     tags: [Teams]
 *     summary: Obtener equipo por ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Datos del equipo }
 *   put:
 *     tags: [Teams]
 *     summary: Actualizar equipo (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               flagUrl: { type: string }
 *               groupLetter: { type: string }
 *     responses:
 *       200: { description: Equipo actualizado }
 *   delete:
 *     tags: [Teams]
 *     summary: Eliminar equipo (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Equipo eliminado }
 */
router.get('/:id', requireAuth, (req, res, next) => teamController.getById(req, res, next));
router.put('/:id', requireAuth, requireAdmin, (req, res, next) => teamController.update(req, res, next));
router.delete('/:id', requireAuth, requireAdmin, (req, res, next) => teamController.delete(req, res, next));

/**
 * @swagger
 * /api/teams/{id}/toggle:
 *   patch:
 *     tags: [Teams]
 *     summary: Activar/desactivar equipo (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Estado del equipo actualizado }
 */
router.patch('/:id/toggle', requireAuth, requireAdmin, (req, res, next) => teamController.toggleActive(req, res, next));

module.exports = router;
