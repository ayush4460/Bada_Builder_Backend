const express = require('express');
const router = express.Router({ mergeParams: true }); // Allow access to propertyId params from parent
const unitsController = require('../controllers/unitsController');
const auth = require('../middleware/auth');

// Get all units for a property (Public or Auth?) - usually public for viewing
router.get('/', unitsController.getUnits);

// Seed units (Admin/Owner only ideally)
router.post('/seed', auth, unitsController.seedUnits);

// Update unit (Booking/Holding) - Auth required
router.put('/:id', auth, unitsController.updateUnit);

module.exports = router;
