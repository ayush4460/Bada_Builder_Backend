const express = require('express');
const router = express.Router();
const adminPropertiesController = require('../controllers/adminPropertiesController');
const protect = require('../middleware/auth'); 
// protect is the default export (function). authorize is attached property.
const { authorize } = protect;

// Apply protection to all admin routes
router.use(protect);

// Allow Admin and Developer to create properties and configure group bookings
// Note: 'developer' user type allows listing properties. 'admin' allows everything.
router.post('/properties', authorize('admin', 'developer'), adminPropertiesController.createProperty);

router.patch('/properties/:id/group-booking', authorize('admin'), adminPropertiesController.configureGroupBooking);

module.exports = router;
