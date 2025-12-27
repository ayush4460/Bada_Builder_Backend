const BaseRepository = require('./BaseRepository');
const User = require('../entities/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async findByUid(uid) {
    return this.findOne({ uid });
  }

  // OTP specific methods could arguably belong to an OtpRepository if we treat OTP as an entity
  // But strictly per user request, we can keep OTP logic separate or here.
  // Let's create an OTP Entity and Repository for strict OOP!
}

module.exports = UserRepository;
