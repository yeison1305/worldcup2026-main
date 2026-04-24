// Patrón: Chain of Responsibility — manejo centralizado de errores
const AppError = require('../errors/AppError');

const errorMiddleware = (err, req, res, next) => {
  // Error controlado (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Error inesperado — no exponer detalles
  console.error('ERROR:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Algo salió mal, intente más tarde'
  });
};

module.exports = errorMiddleware;