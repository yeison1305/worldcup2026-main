const db = require('../config/database');

class AuditService {
  async log({ userId, userEmail, action, entityType, entityId, details, ip }) {
    try {
      await db.supabase.from('audit_log').insert({
        user_id: userId || null,
        user_email: userEmail || 'sistema',
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        details: details || null,
        ip_address: ip || null,
      });
    } catch (err) {
      console.error('[AuditService] Error logging:', err.message);
    }
  }

  async getRecent(limit = 50) {
    const { data, error } = await db.supabase
      .from('audit_log')
      .select(`
        id, user_email, action, entity_type, entity_id, details, ip_address, created_at,
        user:users(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}

module.exports = new AuditService();
