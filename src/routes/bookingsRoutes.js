const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const auth = require('../middleware/auth');

router.post('/', auth, bookingsController.createBooking);
router.get('/my', auth, bookingsController.getMyBookings);
router.get('/', auth, bookingsController.getAllBookings); // Admin only ideally
router.put('/:id', auth, bookingsController.updateBooking);

module.exports = router;
