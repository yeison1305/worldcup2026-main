const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const jwtUtil = require('../utils/jwt.util');
const { verifyGoogleToken } = require('../utils/google.util');
const emailService = require('../utils/email.util');
const {
  AppError,
  ErrorFactory,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError
} = require('../errors/AppError');

class AuthService {

  async register({ name, email, password }) {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      const existing = await userRepository.findByEmail(normalizedEmail);
      if (existing) {
        throw BadRequestError.create('El email ya está registrado');
      }

      const hashedPassword = await hashPassword(password);

      const user = await userRepository.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
      });

      const token = jwtUtil.sign({ id: user.id, role: user.role });

      return { user, token };

    } catch (error) {
      if (error.isUniqueViolation) {
        throw BadRequestError.create('El email ya está registrado');
      }
      throw error;
    }
  }

  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw UnauthorizedError.create('Credenciales inválidas');
    }

    if (user.google_id && !user.password) {
      throw UnauthorizedError.create('Esta cuenta usa Google Sign-In. Iniciá sesión con Google.');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw UnauthorizedError.create('Credenciales inválidas');
    }

    const token = jwtUtil.sign({ id: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async googleLogin({ googleToken }) {
    const googleUser = await verifyGoogleToken(googleToken);

    if (!googleUser) {
      throw UnauthorizedError.create('Token de Google inválido');
    }

    if (!googleUser.emailVerified) {
      throw BadRequestError.create('El email de Google no está verificado');
    }

    const normalizedEmail = googleUser.email.toLowerCase().trim();

    let user = await userRepository.findByGoogleId(googleUser.googleId);

    if (!user) {
      user = await userRepository.findByEmail(normalizedEmail);

      if (user) {
        user = await userRepository.linkGoogleAccount(
          user.id,
          googleUser.googleId
        );
      } else {
        user = await userRepository.create({
          name: googleUser.name,
          email: normalizedEmail,
          password: null,
          role: 'USER',
          googleId: googleUser.googleId,
        });
      }
    }

    const token = jwtUtil.sign({ id: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async forgotPassword({ email }) {
    const normalizedEmail = email.toLowerCase().trim();

    // Buscar usuario (no revelar si existe o no por seguridad)
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      // No revelar si el email existe - igual retornar success
      console.log(`Forgot password requested for non-existent email: ${normalizedEmail}`);
      return { message: 'Si el email existe, recibirás un enlace de recuperación' };
    }

    // No permitir reset en cuentas de Google sin password
    if (user.google_id && !user.password) {
      throw BadRequestError.create('Esta cuenta usa Google Sign-In. Iniciá sesión con Google.');
    }

    // Generar token de reset (válido 1 hora)
    const resetToken = emailService.generateResetToken();
    const expiresDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en DB
    await userRepository.setResetToken(normalizedEmail, resetToken, expiresDate);

    // Enviar email
    const emailSent = await emailService.sendPasswordResetEmail(normalizedEmail, resetToken);

    if (!emailSent) {
      throw InternalServerError.create('Error al enviar el email. Intentá más tarde.');
    }

    return { message: 'Si el email existe, recibirás un enlace de recuperación' };
  }

  async resetPassword({ token, newPassword }) {
    // Validar que el password cumpla requisitos
    if (!newPassword || newPassword.length < 6) {
      throw BadRequestError.create('La contraseña debe tener mínimo 6 caracteres');
    }

    // Buscar usuario con token válido
    const user = await userRepository.findByResetToken(token);

    if (!user) {
      throw BadRequestError.create('Token inválido o expirado');
    }

    // Hashear nuevo password
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar password y limpiar token
    await userRepository.resetPassword(token, hashedPassword);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async registerAdmin({ name, email, password }) {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      const existing = await userRepository.findByEmail(normalizedEmail);
      if (existing) {
        throw BadRequestError.create('El email ya está registrado');
      }

      const hashedPassword = await hashPassword(password);

      const user = await userRepository.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'ADMIN',
      });

      const token = jwtUtil.sign({ id: user.id, role: user.role });

      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };

    } catch (error) {
      if (error.isUniqueViolation) {
        throw BadRequestError.create('El email ya está registrado');
      }
      throw error;
    }
  }

}

// Patrón Singleton: exportar una única instancia de la clase
module.exports = new AuthService();
