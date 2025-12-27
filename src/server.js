const app = require('./app');
const logger = require('./utils/logger');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Print all registered routes for debugging
  const printRoutes = (stack, parentPath = '') => {
    stack.forEach(layer => {
      if (layer.route) {
        Object.keys(layer.route.methods).forEach(method => {
          console.log(`[ROUTE] ${method.toUpperCase()} ${parentPath}${layer.route.path}`);
        });
      } else if (layer.name === 'router' && layer.handle.stack) {
        // Express routers behave a bit differently with regex
        let path = '';
        if (layer.regexp) {
           const str = layer.regexp.toString();
           // Basic cleanup for simple regex paths
           if (str.startsWith('/^\\') && str.endsWith('\\/?(?=\\/|$)/i')) {
             path = str.slice(3, -15).replace(/\\/g, '');
           }
        }
        printRoutes(layer.handle.stack, parentPath + path);
      }
    });
  };
  
  if (app._router && app._router.stack) {
    console.log('--- REGISTERED ROUTES ---');
    printRoutes(app._router.stack);
    console.log('------------------------');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
