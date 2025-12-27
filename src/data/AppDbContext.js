const UserRepository = require('../repositories/UserRepository');
const EmailVerificationRepository = require('../repositories/EmailVerificationRepository');
const PropertyRepository = require('../repositories/PropertyRepository');
const BookingRepository = require('../repositories/BookingRepository');
const SubscriptionRepository = require('../repositories/SubscriptionRepository');
const LeadRepository = require('../repositories/LeadRepository');
const UnitRepository = require('../repositories/UnitRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');

class AppDbContext {
  constructor() {
    if (!AppDbContext.instance) {
      this.users = new UserRepository();
      this.emailVerifications = new EmailVerificationRepository();
      this.properties = new PropertyRepository();
      this.bookings = new BookingRepository();
      this.leads = new LeadRepository();
      this.subscriptions = new SubscriptionRepository();
      this.units = new UnitRepository();
      this.auditLogs = new AuditLogRepository();
      AppDbContext.instance = this;
    }
    return AppDbContext.instance;
  }
}

const context = new AppDbContext();
module.exports = context;
