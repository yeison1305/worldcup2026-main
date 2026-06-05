const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/prediction.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/predictions/champion:
 *   get:
 *     tags: [Predictions]
 *     summary: Predicción del campeón del torneo (público)
 *     responses:
 *       200: { description: Campeón predicho y top 4 }
 */
router.get('/champion', (req, res, next) => predictionController.predictChampion(req, res, next));

/**
 * @swagger
 * /api/predictions/upcoming:
 *   get:
 *     tags: [Predictions]
 *     summary: Próximos partidos con predicciones
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de partidos SCHEDULED con predicción }
 */
router.get('/upcoming', requireAuth, (req, res, next) => predictionController.getUpcoming(req, res, next));

/**
 * @swagger
 * /api/predictions/stats:
 *   get:
 *     tags: [Predictions]
 *     summary: Estadísticas del modelo de predicción
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Stats: totalMatches, scheduledMatches, finishedMatches, totalPredictions }
 */
router.get('/stats', requireAuth, (req, res, next) => predictionController.getStats(req, res, next));

/**
 * @swagger
 * /api/predictions/history:
 *   get:
 *     tags: [Predictions]
 *     summary: Historial de predicciones del usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de predicciones con datos del partido }
 */
router.get('/history', requireAuth, (req, res, next) => predictionController.getHistory(req, res, next));

/**
 * @swagger
 * /api/predictions/match/{matchId}:
 *   get:
 *     tags: [Predictions]
 *     summary: Predicción guardada para un partido específico
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Predicción del partido }
 */
router.get('/match/:matchId', requireAuth, (req, res, next) => predictionController.getByMatch(req, res, next));

/**
 * @swagger
 * /api/predictions:
 *   post:
 *     tags: [Predictions]
 *     summary: Generar predicción para un partido específico (usa DeepSeek LLM)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [homeTeamName, awayTeamName]
 *             properties:
 *               homeTeamName: { type: string, example: "Argentina" }
 *               awayTeamName: { type: string, example: "Brazil" }
 *     responses:
 *       200: { description: Predicción generada con razonamiento IA }
 */
router.post('/', requireAuth, (req, res, next) => predictionController.predict(req, res, next));

/**
 * @swagger
 * /api/predictions/generate-all:
 *   post:
 *     tags: [Predictions]
 *     summary: Generar predicciones para TODOS los partidos SCHEDULED (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: N predicciones generadas }
 *       403: { description: Requiere rol ADMIN }
 */
router.post('/generate-all', requireAuth, requireAdmin, (req, res, next) => predictionController.generateAll(req, res, next));

/**
 * @swagger
 * /api/predictions/sync:
 *   post:
 *     tags: [Predictions]
 *     summary: Sincronizar equipos y partidos de Supabase al microservicio Java
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Datos sincronizados }
 */
router.post('/sync', requireAuth, (req, res, next) => predictionController.sync(req, res, next));

module.exports = router;
