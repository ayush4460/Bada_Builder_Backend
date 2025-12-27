const BaseRepository = require('./BaseRepository');
const Subscription = require('../entities/Subscription');

class SubscriptionRepository extends BaseRepository {
  constructor() {
    super(Subscription);
  }

  async findActiveByUserId(userId) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1 AND status = 'active' AND expires_at > NOW()
      ORDER BY expires_at DESC
      LIMIT 1
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows[0] ? new this.entity(result.rows[0]) : null;
  }
}

module.exports = SubscriptionRepository;
