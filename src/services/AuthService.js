const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appDbContext = require('../data/AppDbContext');
const otpService = require('./OtpService');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

class AuthService {
  constructor() {
    this.context = appDbContext;
    this.otpService = otpService;
  }

  async register({ email, password, name, user_type, phone_number, otp }) {
    // 1. Verify OTP
    const otpCheck = await this.otpService.verifyOtp(email, otp);
    if (!otpCheck.valid) {
      throw { status: 400, message: otpCheck.message };
    }

    // 2. Check existing
    const existing = await this.context.users.findByEmail(email);
    if (existing) {
      throw { status: 400, message: 'User already exists' };
    }

    // 3. Create
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    const newUser = await this.context.users.create({
      uid, email, name, user_type, password_hash: hashedPassword, phone_number, is_verified: true
    });

    // 4. Cleanup OTP
    await this.otpService.clearOtp(email);

    const token = this.generateToken(newUser);
    return { token, user: newUser };
  }

  async login({ email, password }) {
    const user = await this.context.users.findByEmail(email);
    if (!user) {
      throw { status: 404, message: 'Invalid credentials' }; // Or 400 for security
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw { status: 400, message: 'Invalid credentials' };
    }

    const token = this.generateToken(user);
    delete user.password_hash; // Safety
    return { token, user };
  }

  generateToken(user) {
    return jwt.sign({ uid: user.uid }, JWT_SECRET, { expiresIn: '7d' });
  }

  async getMe(uid) {
    return await this.context.users.findByUid(uid);
  }
}

module.exports = new AuthService();
