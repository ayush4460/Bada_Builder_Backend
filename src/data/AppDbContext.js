const UserRepository = require('../repositories/UserRepository');
const EmailVerificationRepository = require('../repositories/EmailVerificationRepository');
const PropertyRepository = require('../repositories/PropertyRepository');

class AppDbContext {
  constructor() {
    if (!AppDbContext.instance) {
      this.users = new UserRepository();
      this.emailVerifications = new EmailVerificationRepository();
      this.properties = new PropertyRepository();
      AppDbContext.instance = this;
    }
    return AppDbContext.instance;
  }
}

const context = new AppDbContext();
module.exports = context;
