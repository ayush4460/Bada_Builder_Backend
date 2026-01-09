const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { uid, email, user_type }
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
         return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    // "admin" should have access to "developer" routes? Or distinct?
    // Let's assume distinct roles for now, or just pass ['admin', 'developer']
    if (!roles.includes(req.user.user_type)) {
      return res.status(403).json({ success: false, message: `Access denied. Role ${req.user.user_type} is not authorized.` });
    }
    next();
  };
};

module.exports = protect;
module.exports.authorize = authorize;
