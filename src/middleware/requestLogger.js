const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  console.log(`[INCOMING] ${req.method} ${req.url}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[OUTGOING] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

module.exports = requestLogger;
