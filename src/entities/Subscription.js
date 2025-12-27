const BaseEntity = require('./BaseEntity');

class Subscription extends BaseEntity {
  constructor(data) {
    super(data);
    this.user_id = data.user_id;
    this.plan_id = data.plan_id;
    this.payment_id = data.payment_id;
    this.amount = data.amount;
    this.status = data.status; // active, expired, cancelled
    this.starts_at = data.starts_at;
    this.expires_at = data.expires_at;
    this.currency = data.currency;
  }

  static get tableName() {
    return 'subscriptions';
  }

  static get columns() {
    return [
      'id', 'user_id', 'plan_id', 'payment_id', 'amount', 
      'status', 'starts_at', 'expires_at', 'currency',
      'created_at', 'updated_at'
    ];
  }
}

module.exports = Subscription;
