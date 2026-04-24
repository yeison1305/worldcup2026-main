
// Patrón: Singleton
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

class JwtUtil {
  constructor() {
    // Patrón Singleton: si ya existe una instancia, retornarla
    if (JwtUtil.instance) {
      return JwtUtil.instance;
    }
    // Guardar la primera instancia creada
    JwtUtil.instance = this;
  }

  sign(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  }

  verify(token) {
    return jwt.verify(token, jwtSecret);
  }
}

module.exports = new JwtUtil();
