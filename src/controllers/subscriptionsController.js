const pool = require('../config/db');

exports.createSubscription = async (req, res, next) => {
  const { plan_id, plan_name, amount, payment_id } = req.body;
  const user_id = req.user.uid;

  try {
    const query = `
      INSERT INTO subscriptions (
        user_id, plan_id, plan_name, amount, payment_id, starts_at, expires_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW() + INTERVAL '30 days')
      RETURNING *
    `;
    const values = [user_id, plan_id, plan_name, amount, payment_id];
    const result = await pool.query(query, values);

    // Update user subscription status
    await pool.query('UPDATE users SET is_subscribed = true, subscription_expiry = NOW() + INTERVAL \'30 days\' WHERE uid = $1', [user_id]);

    res.status(201).json({ success: true, subscription: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.getMySubscription = async (req, res, next) => {
  const user_id = req.user.uid;
  try {
    const result = await pool.query('SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [user_id]);
    res.status(200).json({ success: true, subscription: result.rows[0] || null });
  } catch (error) {
    next(error);
  }
};
