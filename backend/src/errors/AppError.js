
// ============================================================
// Factory Pattern:
// ============================================================

/**
 * Clase base para errores controlados de la aplicación
 * También implementa Product interface del Factory Method
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory Method - cada subclase define su propio tipo
  static create(message) {
    throw new Error('Subclass must implement factory method');
  }

  // Helper para serialización
  toJSON() {
    return {
      status: this.status,
      message: this.message,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }
}

/**
 * Concrete Products - Errores específicos predefinidos
 * Cada errorDefine su propio statusCode
 */
class BadRequestError extends AppError {
  static create(message = 'Bad request') {
    return new BadRequestError(message, 400);
  }
}

class UnauthorizedError extends AppError {
  static create(message = 'Unauthorized') {
    return new UnauthorizedError(message, 401);
  }
}

class ForbiddenError extends AppError {
  static create(message = 'Forbidden') {
    return new ForbiddenError(message, 403);
  }
}

class NotFoundError extends AppError {
  static create(message = 'Not found') {
    return new NotFoundError(message, 404);
  }
}

class ConflictError extends AppError {
  static create(message = 'Conflict') {
    return new ConflictError(message, 409);
  }
}

class ValidationError extends AppError {
  static create(message = 'Validation error') {
    return new ValidationError(message, 422);
  }
}

class InternalServerError extends AppError {
  static create(message = 'Internal server error') {
    return new InternalServerError(message, 500);
  }
}

/**
 * ErrorFactory - Factory que crea errores por tipo
 * Patrón: Abstract Factory
 */
const ErrorFactory = {
  badRequest: (msg) => BadRequestError.create(msg),
  unauthorized: (msg) => UnauthorizedError.create(msg),
  forbidden: (msg) => ForbiddenError.create(msg),
  notFound: (msg) => NotFoundError.create(msg),
  conflict: (msg) => ConflictError.create(msg),
  validation: (msg) => ValidationError.create(msg),
  serverError: (msg) => InternalServerError.create(msg),

  // Método genérico - Factory Method
  create: (type, message) => {
    const factoryMethods = {
      badRequest: BadRequestError,
      unauthorized: UnauthorizedError,
      forbidden: ForbiddenError,
      notFound: NotFoundError,
      conflict: ConflictError,
      validation: ValidationError,
      serverError: InternalServerError
    };
    const ErrorClass = factoryMethods[type];
    if (!ErrorClass) {
      return AppError.create(`Unknown error type: ${type}`);
    }
    return ErrorClass.create(message);
  }
};

module.exports = {
  AppError,
  ErrorFactory,
  // Export individual error classes for direct use
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError
};