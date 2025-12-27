const pool = require('../config/db');
const UserModel = require('./User');
const PropertyModel = require('./Property');
const SubscriptionModel = require('./Subscription');
const AuditLogModel = require('./AuditLog');

class AppDB {
  constructor() {
    this.pool = pool;
    this.users = new UserModel(pool);
    this.properties = new PropertyModel(pool);
    this.subscriptions = new SubscriptionModel(pool);
    this.auditLogs = new AuditLogModel(pool);
  }

  // Method to check DB health
  async healthCheck() {
    const result = await this.pool.query('SELECT NOW()');
    return result.rows[0];
  }
}

// Export a singleton instance
const appDb = new AppDB();
module.exports = appDb;
