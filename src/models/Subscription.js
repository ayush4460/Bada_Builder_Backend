class SubscriptionModel {
  constructor(pool) {
    this.pool = pool;
  }

  async create(data) {
    const { id, user_id, plan_id, payment_id, amount, status, starts_at, expires_at } = data;
    
    const result = await this.pool.query(
      `INSERT INTO subscriptions (
         id, user_id, plan_id, payment_id, amount, status, starts_at, expires_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [id, user_id, plan_id, payment_id, amount, status, starts_at, expires_at]
    );
    return result.rows[0];
  }

  async findByUserId(userId) {
    // Get active subscription
    const result = await this.pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return result.rows[0];
  }

  async updateStatus(id, status, paymentId = null) {
    const result = await this.pool.query(
      `UPDATE subscriptions SET status = $2, payment_id = COALESCE($3, payment_id), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, status, paymentId]
    );
    // Also update User's is_subscribed flag if status is active? 
    // Usually logic goes in controller or service, but we can check here.
    return result.rows[0];
  }
}

module.exports = SubscriptionModel;
