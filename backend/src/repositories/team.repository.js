const db = require('../config/database');

const DB_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
};

class TeamRepository {
  async findAll() {
    const result = await db.query(
      'SELECT id, name, flag_url, group_letter, is_active, created_at, updated_at FROM teams ORDER BY group_letter, name'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await db.query(
      'SELECT id, name, flag_url, group_letter, is_active, created_at, updated_at FROM teams WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByGroup(groupLetter) {
    const result = await db.query(
      'SELECT id, name, flag_url, group_letter, is_active FROM teams WHERE group_letter = $1 AND is_active = true ORDER BY name',
      [groupLetter]
    );
    return result.rows;
  }

  async create({ name, flagUrl = null, groupLetter }) {
    try {
      const result = await db.query(
        `INSERT INTO teams (name, flag_url, group_letter, is_active)
         VALUES ($1, $2, $3, true)
         RETURNING id, name, flag_url, group_letter, is_active, created_at, updated_at`,
        [name, flagUrl, groupLetter]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
        error.isUniqueViolation = true;
      }
      throw error;
    }
  }

  async update(id, { name, flagUrl, groupLetter, isActive }) {
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      params.push(name);
    }
    if (flagUrl !== undefined) {
      updates.push(`flag_url = $${paramIndex++}`);
      params.push(flagUrl);
    }
    if (groupLetter !== undefined) {
      updates.push(`group_letter = $${paramIndex++}`);
      params.push(groupLetter);
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      params.push(isActive);
    }

    if (updates.length === 0) return this.findById(id);

    params.push(id);
    const result = await db.query(
      `UPDATE teams 
       SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING id, name, flag_url, group_letter, is_active, created_at, updated_at`,
      params
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await db.query(
      'DELETE FROM teams WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = new TeamRepository();
module.exports.DB_ERROR_CODES = DB_ERROR_CODES;
