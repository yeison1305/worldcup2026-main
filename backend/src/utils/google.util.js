// src/utils/google.util.js
// Verificación de tokens de Google OAuth
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verifica un token de Google y retorna los datos del usuario
 * @param {string} token - El token de ID de Google
 * @returns {Object} - Datos del usuario de Google
 */
async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    return null;
  }
}

module.exports = { verifyGoogleToken };
