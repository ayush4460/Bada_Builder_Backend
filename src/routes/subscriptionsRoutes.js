const express = require('express');
const router = express.Router();
const subscriptionsController = require('../controllers/subscriptionsController');
const auth = require('../middleware/auth');

router.post('/', auth, subscriptionsController.createSubscription);
router.get('/me', auth, subscriptionsController.getMySubscription);

module.exports = router;
