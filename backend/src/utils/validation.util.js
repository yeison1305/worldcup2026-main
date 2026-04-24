// src/utils/validation.util.js
// Utilidades de validación reutilizables

/**
 * Valida formato de email con regex
 * RFC 5322 simplified - cubre 99.9% de casos válidos
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida que password tenga mínimo 6 caracteres
 */
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Valida que name no esté vacío y tenga longitud razonable
 */
const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

module.exports = { isValidEmail, isValidPassword, isValidName };
