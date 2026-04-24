// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const userRepository = require('../repositories/user.repository');
const { isValidEmail, isValidPassword, isValidName } = require('../utils/validation.util');

class AuthController {

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Nombre, email y contraseña son obligatorios'
        });
      }

      if (!isValidName(name)) {
        return res.status(400).json({
          status: 'fail',
          message: 'El nombre debe tener entre 2 y 100 caracteres'
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          status: 'fail',
          message: 'El email no es válido'
        });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({
          status: 'fail',
          message: 'La contraseña debe tener mínimo 6 caracteres'
        });
      }

      const result = await authService.register({ 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        password 
      });

      return res.status(201).json({
        status: 'success',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email y contraseña son obligatorios'
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          status: 'fail',
          message: 'El email no es válido'
        });
      }

      const result = await authService.login({ 
        email: email.toLowerCase().trim(), 
        password 
      });

      return res.status(200).json({
        status: 'success',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req, res, next) {
    try {
      const { googleToken } = req.body;

      if (!googleToken) {
        return res.status(400).json({
          status: 'fail',
          message: 'Token de Google es requerido'
        });
      }

      const result = await authService.googleLogin({ googleToken });

      return res.status(200).json({
        status: 'success',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: 'fail',
          message: 'El email es requerido'
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          status: 'fail',
          message: 'El email no es válido'
        });
      }

      const result = await authService.forgotPassword({ 
        email: email.toLowerCase().trim() 
      });

      return res.status(200).json({
        status: 'success',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          status: 'fail',
          message: 'Token y nueva contraseña son requeridos'
        });
      }

      const result = await authService.resetPassword({ token, newPassword });

      return res.status(200).json({
        status: 'success',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  // Obtener usuario actual (para verificar sesión)
  async me(req, res, next) {
    try {
      const user = await userRepository.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'Usuario no encontrado'
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({
        status: 'success',
        data: { user: userWithoutPassword }
      });

    } catch (error) {
      next(error);
    }
  }

  // Listar usuarios (solo admin)
  async getAllUsers(req, res, next) {
    try {
      const users = await userRepository.findAll();
      
      // Remover passwords
      const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
      
      return res.status(200).json({
        status: 'success',
        data: { users: usersWithoutPasswords }
      });

    } catch (error) {
      next(error);
    }
  }

  // Crear admin (solo para setup inicial, debería protegerse más)
  async createAdmin(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Nombre, email y contraseña son obligatorios'
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          status: 'fail',
          message: 'El email no es válido'
        });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({
          status: 'fail',
          message: 'La contraseña debe tener mínimo 6 caracteres'
        });
      }

      const result = await authService.registerAdmin({ 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        password 
      });

      return res.status(201).json({
        status: 'success',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

}

// Patrón Singleton: exportar una única instancia de la clase
module.exports = new AuthController();
