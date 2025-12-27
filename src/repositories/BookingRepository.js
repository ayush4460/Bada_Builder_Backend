const BaseRepository = require('./BaseRepository');
const Booking = require('../entities/Booking');

class BookingRepository extends BaseRepository {
  constructor() {
    super(Booking);
  }
}

module.exports = BookingRepository;
