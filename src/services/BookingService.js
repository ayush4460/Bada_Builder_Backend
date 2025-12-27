const appDb = require('../data/AppDbContext');

class BookingService {
  async createBooking(data) {
    // Validate data if needed
    // Assuming data is validated or partial validation in controller
    
    // Set defaults
    if (!data.payment_status) data.payment_status = 'pending';
    if (!data.status) data.status = 'pending';

    const booking = await appDb.bookings.create(data);
    return booking;
  }

  async getBookingById(id) {
    return await appDb.bookings.findOne({ id });
  }

  async getUserBookings(userId) {
    return await appDb.bookings.findAll({ user_id: userId });
  }

  async getAllBookings(filters = {}) {
    return await appDb.bookings.findAll(filters);
  }

  async updateBooking(id, updateData) {
    return await appDb.bookings.update({ id }, updateData);
  }
}

module.exports = new BookingService();
