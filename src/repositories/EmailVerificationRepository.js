const BaseRepository = require('./BaseRepository');
const EmailVerification = require('../entities/EmailVerification');

class EmailVerificationRepository extends BaseRepository {
  constructor() {
    super(EmailVerification);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async upsertOtp(email, otpHash, expiresAt) {
    const query = `
      INSERT INTO email_verifications (email, otp_hash, expires_at) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (email) 
      DO UPDATE SET otp_hash = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP
    `;
    await this.pool.query(query, [email, otpHash, expiresAt]);
  }

  async deleteByEmail(email) {
    await this.pool.query('DELETE FROM email_verifications WHERE email = $1', [email]);
  }
}

module.exports = EmailVerificationRepository;
