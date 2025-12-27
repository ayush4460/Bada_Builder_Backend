const pool = require('../config/db');

exports.getHealth = async (req, res, next) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'UP',
      timestamp: new Date(),
      database: {
        status: 'CONNECTED',
        serverTime: dbResult.rows[0].now
      }
    });
  } catch (error) {
    next(error);
  }
};
