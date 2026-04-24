// src/config/env.js
require('dotenv').config();

// Origins permitidos — desarrollo y producción
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(o => o.trim());

module.exports = {
  port:          process.env.PORT || 3000,
  jwtSecret:     process.env.JWT_SECRET,
  jwtExpiresIn:  process.env.JWT_EXPIRES_IN || '24h',
  allowedOrigins,
  // Email config
  emailUser:     process.env.EMAIL_USER,
  emailPass:     process.env.EMAIL_PASS,
  emailFrom:     process.env.EMAIL_FROM || 'World Cup 2026 <noreply@worldcup2026.com>',
};
