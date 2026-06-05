const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { loginLimiter, registerLimiter } = require('../middlewares/rateLimit.middleware');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Juan Pérez" }
 *               email: { type: string, format: email, example: "user@example.com" }
 *               password: { type: string, minLength: 6, example: "password123" }
 *     responses:
 *       201: { description: Usuario registrado exitosamente }
 *       400: { description: Datos inválidos }
 */
router.post('/register', registerLimiter, (req, res, next) => authController.register(req, res, next));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión con email y contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@wc2026.com" }
 *               password: { type: string, example: "admin2026!!" }
 *     responses:
 *       200: { description: Login exitoso, devuelve JWT token y datos de usuario }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', loginLimiter, (req, res, next) => authController.login(req, res, next));

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión con Google OAuth
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleToken: { type: string }
 *     responses:
 *       200: { description: Login con Google exitoso }
 */
router.post('/google', (req, res, next) => authController.googleLogin(req, res, next));

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Solicitar enlace de recuperación de contraseña
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { description: Si el email existe, se envía enlace de recuperación }
 */
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Restablecer contraseña con token de recuperación
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string, minLength: 6 }
 *     responses:
 *       200: { description: Contraseña actualizada }
 */
router.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener datos del usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Datos del usuario }
 *       401: { description: No autenticado }
 */
router.get('/me', requireAuth, (req, res, next) => authController.me(req, res, next));

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     tags: [Auth]
 *     summary: Cambiar contraseña del usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string, minLength: 6 }
 *     responses:
 *       200: { description: Contraseña actualizada }
 *       400: { description: Contraseña actual incorrecta o nueva inválida }
 */
router.put('/change-password', requireAuth, (req, res, next) => authController.changePassword(req, res, next));

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     tags: [Auth]
 *     summary: Listar todos los usuarios (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de usuarios }
 *       403: { description: Requiere rol ADMIN }
 */
router.get('/users', requireAuth, requireAdmin, (req, res, next) => authController.getAllUsers(req, res, next));

/**
 * @swagger
 * /api/auth/admin:
 *   post:
 *     tags: [Auth]
 *     summary: Crear usuario administrador
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: Admin creado }
 */
router.post('/admin', registerLimiter, requireAuth, requireAdmin, (req, res, next) => authController.createAdmin(req, res, next));

/**
 * @swagger
 * /api/auth/audit:
 *   get:
 *     tags: [Auth]
 *     summary: Ver registro de auditoría (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de registros de auditoría }
 *       403: { description: Requiere rol ADMIN }
 */
router.get('/audit', requireAuth, requireAdmin, (req, res, next) => authController.getAuditLog(req, res, next));

module.exports = router;
