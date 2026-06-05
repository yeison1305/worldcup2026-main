const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/matches:
 *   get:
 *     tags: [Matches]
 *     summary: Listar todos los partidos (público)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [SCHEDULED, LIVE, FINISHED] }
 *       - in: query
 *         name: group
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de partidos }
 *   post:
 *     tags: [Matches]
 *     summary: Crear partido (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               homeTeamId: { type: integer }
 *               awayTeamId: { type: integer }
 *               phase: { type: string, example: "GROUP" }
 *               groupLetter: { type: string }
 *               roundNumber: { type: integer }
 *               matchDate: { type: string, format: date-time }
 *               stadium: { type: string }
 *               location: { type: string }
 *     responses:
 *       201: { description: Partido creado }
 */
router.get('/', (req, res, next) => matchController.getAll(req, res, next));

/**
 * @swagger
 * /api/matches/group/{letter}:
 *   get:
 *     tags: [Matches]
 *     summary: Listar partidos por grupo (público)
 *     parameters:
 *       - in: path
 *         name: letter
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Partidos del grupo }
 */
router.get('/group/:letter', (req, res, next) => matchController.getByGroup(req, res, next));

/**
 * @swagger
 * /api/matches/live/status:
 *   get:
 *     tags: [Matches]
 *     summary: Estado de partidos en vivo (público)
 *     responses:
 *       200: { description: Lista de partidos activos con minuto y score }
 */
router.get('/live/status', (req, res, next) => matchController.getLiveStatus(req, res, next));

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     tags: [Matches]
 *     summary: Obtener partido por ID (público)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Datos del partido }
 *   put:
 *     tags: [Matches]
 *     summary: Actualizar partido (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Partido actualizado }
 *   delete:
 *     tags: [Matches]
 *     summary: Eliminar partido (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Partido eliminado }
 */
router.get('/:id', (req, res, next) => matchController.getById(req, res, next));
router.put('/:id', requireAuth, requireAdmin, (req, res, next) => matchController.update(req, res, next));
router.delete('/:id', requireAuth, requireAdmin, (req, res, next) => matchController.delete(req, res, next));

/**
 * @swagger
 * /api/matches/{id}/result:
 *   patch:
 *     tags: [Matches]
 *     summary: Registrar resultado oficial (solo admin)
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
 *               homeScore: { type: integer }
 *               awayScore: { type: integer }
 *     responses:
 *       200: { description: Resultado registrado }
 */
router.patch('/:id/result', requireAuth, requireAdmin, (req, res, next) => matchController.updateResult(req, res, next));

/**
 * @swagger
 * /api/matches/{id}/simulate/start:
 *   post:
 *     tags: [Matches]
 *     summary: Iniciar simulación en vivo (solo admin). Envía email a todos los usuarios.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Simulación iniciada }
 */
router.post('/:id/simulate/start', requireAuth, requireAdmin, (req, res, next) => matchController.startSimulation(req, res, next));

/**
 * @swagger
 * /api/matches/{id}/simulate/stop:
 *   post:
 *     tags: [Matches]
 *     summary: Detener simulación en vivo (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Simulación detenida, resultado final registrado }
 */
router.post('/:id/simulate/stop', requireAuth, requireAdmin, (req, res, next) => matchController.stopSimulation(req, res, next));

/**
 * @swagger
 * /api/matches/{id}/events:
 *   get:
 *     tags: [Matches]
 *     summary: Obtener eventos de un partido en vivo (goles, tarjetas, cambios)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Lista de eventos del partido }
 */
router.get('/:id/events', (req, res, next) => matchController.getEvents(req, res, next));

module.exports = router;
