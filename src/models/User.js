const pool = require('../config/db');

class UserModel {
  constructor(pool) {
    this.pool = pool;
  }

  async findByEmail(email) {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async findById(uid) {
    const result = await this.pool.query('SELECT uid, email, name, user_type, is_subscribed, property_credits FROM users WHERE uid = $1', [uid]);
    return result.rows[0];
  }

  async create({ uid, email, name, user_type, password_hash, phone_number, is_verified }) {
    const result = await this.pool.query(
      'INSERT INTO users (uid, email, name, user_type, password_hash, phone_number, is_verified) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING uid, email, name, user_type, created_at',
      [uid, email, name, user_type || 'individual', password_hash, phone_number || null, is_verified || false]
    );
    return result.rows[0];
  }

  // OTP Methods
  async saveOtp(email, otpHash, expiresAt) {
    await this.pool.query(
      `INSERT INTO email_verifications (email, otp_hash, expires_at) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) 
       DO UPDATE SET otp_hash = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP`,
      [email, otpHash, expiresAt]
    );
  }

  async getOtp(email) {
    const result = await this.pool.query('SELECT * FROM email_verifications WHERE email = $1', [email]);
    return result.rows[0];
  }

  async deleteOtp(email) {
    await this.pool.query('DELETE FROM email_verifications WHERE email = $1', [email]);
  }
}

module.exports = UserModel;
