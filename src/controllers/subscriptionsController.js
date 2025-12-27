const subscriptionService = require('../services/SubscriptionService');

exports.createSubscription = async (req, res, next) => {
  try {
    const { plan_id, amount, currency, duration_months, payment_id } = req.body;
    const userId = req.user.uid;

    if (!plan_id || !amount || !payment_id) {
       return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const subscriptionId = await subscriptionService.createSubscription(userId, {
        plan_id,
        amount,
        currency,
        duration_months,
        payment_id
    });

    res.status(201).json({ success: true, subscriptionId });
  } catch (error) {
    next(error);
  }
};

exports.getMySubscription = async (req, res, next) => {
    try {
        const sub = await subscriptionService.getMySubscription(req.user.uid);
        res.status(200).json({ success: true, subscription: sub });
    } catch (error) {
        next(error);
    }
};
