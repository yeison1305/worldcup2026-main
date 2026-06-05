const auditService = require('../services/audit.service');

function logAudit(req, action, entityType, entityId) {
  auditService.log({
    userId: req.user?.id,
    action,
    entityType,
    entityId: entityId ? parseInt(entityId) : null,
    details: `${req.method} ${req.originalUrl}`,
    ip: req.ip,
    }).catch(err => {
      console.error('[Audit] Error logging:', err.message);
    });
}

module.exports = { logAudit };
