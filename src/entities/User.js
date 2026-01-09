const BaseEntity = require('./BaseEntity');

class User extends BaseEntity {
  constructor(data) {
    super(data);
    this.uid = data.uid;
    this.email = data.email;
    this.name = data.name;
    this.user_type = data.user_type || 'individual';
    this.is_subscribed = data.is_subscribed || false;
    this.subscription_expiry = data.subscription_expiry;
    this.property_credits = data.property_credits || 0;
    this.password_hash = data.password_hash;
    this.phone_number = data.phone_number;
    this.is_verified = data.is_verified || false;
    this.profile_photo = data.profile_photo;
  }

  static get tableName() {
    return 'users';
  }

  static get columns() {
    return [
      'uid', 'email', 'name', 'user_type', 'is_subscribed', 
      'subscription_expiry', 'property_credits', 'password_hash', 
      'phone_number', 'is_verified', 'profile_photo', 'created_at', 'updated_at'
    ];
  }
}

module.exports = User;
