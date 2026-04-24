const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { loginLimiter, registerLimiter } = require('../middlewares/rateLimit.middleware');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

// Rutas públicas
router.post('/register', registerLimiter, (req, res, next) => authController.register(req, res, next));
router.post('/login', loginLimiter, (req, res, next) => authController.login(req, res, next));
router.post('/google', (req, res, next) => authController.googleLogin(req, res, next));
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));

// Rutas protegidas
router.get('/me', requireAuth, (req, res, next) => authController.me(req, res, next));

// Rutas solo para admin
router.get('/users', requireAuth, requireAdmin, (req, res, next) => authController.getAllUsers(req, res, next));
router.post('/admin', (req, res, next) => authController.createAdmin(req, res, next));

module.exports = router;
