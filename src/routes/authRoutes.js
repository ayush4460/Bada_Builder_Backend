const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
console.log('[DEBUG] authRoutes loaded. sendOtp type:', typeof authController.sendOtp);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);


module.exports = router;
