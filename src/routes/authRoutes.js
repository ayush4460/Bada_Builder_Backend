const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', auth, authController.getMe);
router.put('/update', auth, authController.updateProfile);
router.post('/initiate-email-change', auth, authController.initiateEmailChange);
router.post('/verify-email-change', auth, authController.verifyEmailChange);


module.exports = router;
