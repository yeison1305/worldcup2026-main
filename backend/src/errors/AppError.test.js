const {
  AppError, ErrorFactory, BadRequestError,
  UnauthorizedError, ForbiddenError, NotFoundError,
  ConflictError, ValidationError, InternalServerError
} = require('./AppError');

describe('Error Factory Pattern', () => {
  it('should create BadRequestError (400)', () => {
    const err = BadRequestError.create('Mensaje inválido');
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(BadRequestError);
    expect(err.statusCode).toBe(400);
    expect(err.status).toBe('fail');
    expect(err.message).toBe('Mensaje inválido');
    expect(err.isOperational).toBe(true);
  });

  it('should create UnauthorizedError (401)', () => {
    const err = UnauthorizedError.create('Token inválido');
    expect(err.statusCode).toBe(401);
  });

  it('should create ForbiddenError (403)', () => {
    const err = ForbiddenError.create('Acceso denegado');
    expect(err.statusCode).toBe(403);
  });

  it('should create NotFoundError (404)', () => {
    const err = NotFoundError.create('No encontrado');
    expect(err.statusCode).toBe(404);
  });

  it('should create ConflictError (409)', () => {
    const err = ConflictError.create('Conflicto');
    expect(err.statusCode).toBe(409);
  });

  it('should create ValidationError (422)', () => {
    const err = ValidationError.create('Error de validación');
    expect(err.statusCode).toBe(422);
  });

  it('should create InternalServerError (500)', () => {
    const err = InternalServerError.create('Error interno');
    expect(err.statusCode).toBe(500);
    expect(err.status).toBe('error');
  });

  it('ErrorFactory should create errors by type', () => {
    const err = ErrorFactory.create('notFound', 'Equipo no encontrado');
    expect(err).toBeInstanceOf(NotFoundError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Equipo no encontrado');
  });

  it('ErrorFactory should create errors via shorthand', () => {
    const err = ErrorFactory.badRequest('Campo requerido');
    expect(err).toBeInstanceOf(BadRequestError);
    expect(err.statusCode).toBe(400);
  });

  it('should serialize to JSON', () => {
    const err = BadRequestError.create('test');
    const json = err.toJSON();
    expect(json.status).toBe('fail');
    expect(json.message).toBe('test');
  });
});
