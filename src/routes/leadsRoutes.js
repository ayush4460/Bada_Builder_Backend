const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController');
const auth = require('../middleware/auth');

// Public endpoint for submitting leads
router.post('/', leadsController.createLead);

// Admin only endpoint to view leads
router.get('/', auth, leadsController.getAllLeads);

module.exports = router;
