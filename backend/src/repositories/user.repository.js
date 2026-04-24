// Patrón: Repository — abstrae el acceso a la base de datos
const db = require('../config/database');

// PostgreSQL error codes para manejo específico
const DB_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
};

class UserRepository {

  async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findById(id) {
    const result = await db.query(
      'SELECT id, name, email, role, google_id, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByGoogleId(googleId) {
    const result = await db.query(
      'SELECT * FROM users WHERE google_id = $1',
      [googleId]
    );
    return result.rows[0] || null;
  }

  async findByResetToken(token) {
    const result = await db.query(
      `SELECT * FROM users 
       WHERE reset_token = $1 
       AND reset_token_expires > NOW()`,
      [token]
    );
    return result.rows[0] || null;
  }

  async findAll() {
    const result = await db.query(
      `SELECT id, name, email, role, google_id, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async create({ name, email, password, role = 'USER', googleId = null }) {
    try {
      const result = await db.query(
        `INSERT INTO users (name, email, password, role, google_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, role, google_id, created_at`,
        [name, email, password, role, googleId]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
        error.isUniqueViolation = true;
      }
      throw error;
    }
  }

  async linkGoogleAccount(userId, googleId) {
    const result = await db.query(
      `UPDATE users 
       SET google_id = $1
       WHERE id = $2
       RETURNING id, name, email, role, google_id, created_at`,
      [googleId, userId]
    );
    return result.rows[0];
  }

  async setResetToken(email, resetToken, expiresDate) {
    const result = await db.query(
      `UPDATE users 
       SET reset_token = $1, reset_token_expires = $2
       WHERE email = $3
       RETURNING id, name, email`,
      [resetToken, expiresDate, email]
    );
    return result.rows[0] || null;
  }

  async resetPassword(token, hashedPassword) {
    const result = await db.query(
      `UPDATE users 
       SET password = $1, reset_token = NULL, reset_token_expires = NULL
       WHERE reset_token = $2 AND reset_token_expires > NOW()
       RETURNING id, name, email`,
      [hashedPassword, token]
    );
    return result.rows[0] || null;
  }

  async clearResetToken(userId) {
    await db.query(
      `UPDATE users 
       SET reset_token = NULL, reset_token_expires = NULL
       WHERE id = $1`,
      [userId]
    );
  }

}

// Patrón Singleton: exportar una única instancia de la clase
module.exports = new UserRepository();
module.exports.DB_ERROR_CODES = DB_ERROR_CODES;
