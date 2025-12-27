const bcrypt = require('bcryptjs');
const appDbContext = require('../data/AppDbContext');
const emailService = require('./EmailService');

class OtpService {
  constructor() {
    this.context = appDbContext;
    this.emailService = emailService;
  }

  async generateAndSendOtp(email) {
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);
    
    // Set expiry (3 minutes)
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    // Persist
    await this.context.emailVerifications.upsertOtp(email, otpHash, expiresAt);

    // Send
    const sent = await this.emailService.sendOtpEmail(email, otp);
    return sent;
  }

  async verifyOtp(email, otp) {
    const record = await this.context.emailVerifications.findByEmail(email);
    if (!record) return { valid: false, message: 'OTP not sent or expired' };

    const isExpired = new Date() > new Date(record.expires_at);
    if (isExpired) return { valid: false, message: 'OTP has expired' };

    const isMatch = await bcrypt.compare(otp, record.otp_hash);
    if (!isMatch) return { valid: false, message: 'Invalid OTP' };

    return { valid: true };
  }

  async clearOtp(email) {
    await this.context.emailVerifications.deleteByEmail(email);
  }
}

module.exports = new OtpService();
