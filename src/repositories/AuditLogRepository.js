const BaseRepository = require('./BaseRepository');
const AuditLog = require('../entities/AuditLog');

class AuditLogRepository extends BaseRepository {
  constructor() {
    super(AuditLog);
  }

  async log(data) {
    return this.create(data);
  }
}

module.exports = AuditLogRepository;
