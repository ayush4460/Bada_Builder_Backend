const BaseEntity = require('./BaseEntity');

class AuditLog extends BaseEntity {
  constructor(data) {
    super(data);
    this.user_id = data.user_id;
    this.action = data.action;
    this.resource_type = data.resource_type;
    this.resource_id = data.resource_id;
    this.metadata = data.metadata;
  }

  static get tableName() {
    return 'audit_logs';
  }

  static get columns() {
    return ['id', 'user_id', 'action', 'resource_type', 'resource_id', 'metadata', 'created_at'];
  }
}

module.exports = AuditLog;
