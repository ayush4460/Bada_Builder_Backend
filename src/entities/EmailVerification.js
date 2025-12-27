const BaseEntity = require('./BaseEntity');

class EmailVerification extends BaseEntity {
  constructor(data) {
    super(data);
    this.email = data.email;
    this.otp_hash = data.otp_hash;
    this.expires_at = data.expires_at;
  }

  static get tableName() {
    return 'email_verifications';
  }

  static get columns() {
    return ['email', 'otp_hash', 'expires_at', 'created_at'];
  }
}

module.exports = EmailVerification;
