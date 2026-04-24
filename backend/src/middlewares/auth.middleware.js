// src/middlewares/auth.middleware.js
// Middleware para proteger rutas con JWT
const jwtUtil = require('../utils/jwt.util');
const { UnauthorizedError, ForbiddenError } = require('../errors/AppError');

/**
 * Verifica que el usuario esté autenticado
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw UnauthorizedError.create('Token de autenticación requerido');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtUtil.verify(token);
    
    req.user = decoded;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(UnauthorizedError.create('Token inválido'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(UnauthorizedError.create('Token expirado'));
    }
    next(error);
  }
};

/**
 * Verifica que el usuario tenga rol de ADMIN
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(ForbiddenError.create('Acceso denegado. Se requiere rol de administrador'));
  }
  next();
};

/**
 * Verifica que el usuario tenga uno de los roles especificados
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ForbiddenError.create(`Acceso denegado. Roles requeridos: ${roles.join(', ')}`));
    }
    next();
  };
};

module.exports = { requireAuth, requireAdmin, requireRole };
