const appDbContext = require('../data/AppDbContext');

class SubscriptionService {
  constructor() {
    this.context = appDbContext;
  }

  async createSubscription(userId, data) {
    const { plan_id, payment_id, amount, currency, duration_months } = data;

    const startsAt = new Date();
    const expiresAt = new Date(startsAt);
    expiresAt.setMonth(startsAt.getMonth() + (duration_months || 1));

    // Create Subscription Record
    const subscription = await this.context.subscriptions.create({
      user_id: userId,
      plan_id: plan_id,
      payment_id: payment_id,
      amount: amount,
      status: 'active',
      starts_at: startsAt,
      expires_at: expiresAt,
      currency: currency || 'INR'
    });

    // Update User Profile
    await this.context.users.update({ uid: userId }, {
      is_subscribed: true,
      subscription_expiry: expiresAt,
      property_credits: 999 
    });

    return subscription.id;
  }
  
  async getMySubscription(userId) {
      return await this.context.subscriptions.findActiveByUserId(userId);
  }
}

module.exports = new SubscriptionService();
