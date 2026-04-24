// src/middlewares/rateLimit.middleware.js
// Protección contra brute force y abuse
const rateLimit = require('express-rate-limit');

/**
 * Rate limiter para login — 5 intentos por 15 minutos
 * Previene brute force attacks
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por ventana
  message: {
    status: 'fail',
    message: 'Demasiados intentos de login. Intente en 15 minutos.'
  },
  standardHeaders: true, // Retorna RateLimit-* headers
  legacyHeaders: false,
  // Skip successful logins from count (solo contar fallidos)
  skipSuccessfulRequests: true,
  // Validación deshabilitada para ambiente de desarrollo
  validate: { xForwardedForHeader: false },
});

/**
 * Rate limiter para registro — 10 registros por hora por IP
 * Previene spam de cuentas
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // 10 registros por hora
  message: {
    status: 'fail',
    message: 'Demasiados intentos de registro. Intente en una hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

module.exports = { loginLimiter, registerLimiter };
