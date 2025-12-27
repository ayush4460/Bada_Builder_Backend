const bookingService = require('../services/BookingService');

exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = {
      ...req.body,
      user_id: req.user.uid // Ensure user_id comes from auth token
    };
    
    const newBooking = await bookingService.createBooking(bookingData);
    
    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const bookings = await bookingService.getUserBookings(userId);
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    // TODO: Add admin check
    const bookings = await bookingService.getAllBookings(req.query);
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // TODO: Ensure user owns booking or is admin
    const updatedBooking = await bookingService.updateBooking(id, updateData);
    
    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    next(error);
  }
};
