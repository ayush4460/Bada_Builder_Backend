class AuditLogModel {
  constructor(pool) {
    this.pool = pool;
  }

  async log({ user_id, action, resource_type, resource_id, metadata }) {
    await this.pool.query(
      `INSERT INTO audit_logs (
        user_id, action, resource_type, resource_id, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [user_id, action, resource_type, resource_id, metadata]
    );
  }

  async findByResource(resourceType, resourceId) {
    const result = await this.pool.query(
      'SELECT * FROM audit_logs WHERE resource_type = $1 AND resource_id = $2 ORDER BY created_at DESC',
      [resourceType, resourceId]
    );
    return result.rows;
  }

  async findByUser(userId) {
    const result = await this.pool.query(
      'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }
}

module.exports = AuditLogModel;
