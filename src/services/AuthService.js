const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appDbContext = require('../data/AppDbContext');
const otpService = require('./OtpService');

const emailService = require('./EmailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

class AuthService {
  constructor() {
    this.context = appDbContext;
    this.otpService = otpService;
    this.emailService = emailService;
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

  async updateUser(uid, updateData) {
    // Prevent updating critical fields directly if needed, e.g. uid, email (unless specific flow)
    // For now, allow updating passed fields.
    const user = await this.context.users.findByUid(uid);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const updatedUser = await this.context.users.update({ uid }, updateData);
    delete updatedUser.password_hash;
    return updatedUser;
  }

  async forgotPassword(email) {
    const user = await this.context.users.findByEmail(email);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const secret = JWT_SECRET + user.password_hash;
    const payload = {
      uid: user.uid,
      purpose: 'reset_password'
    };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl}/reset-password?token=${token}&id=${user.uid}`;

    await this.emailService.sendPasswordResetEmail(email, resetLink, user.name);

    return { message: 'Password reset link sent to email' };
  }

  async resetPassword({ uid, token, newPassword }) {
    const user = await this.context.users.findByUid(uid);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const secret = JWT_SECRET + user.password_hash;
    try {
        const payload = jwt.verify(token, secret);
        if (payload.uid !== uid || payload.purpose !== 'reset_password') {
             throw { status: 400, message: 'Invalid token' };
        }
    } catch (err) {
        throw { status: 400, message: 'Invalid or expired token' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.context.users.update({ uid }, { password_hash: hashedPassword });

    return { message: 'Password updated successfully' };
  }

  async initiateEmailChange(uid, newEmail) {
    const existing = await this.context.users.findByEmail(newEmail);
    if (existing) {
      throw { status: 400, message: 'Email already in use' };
    }
    
    // Send OTP to the NEW email
    await this.otpService.generateAndSendOtp(newEmail);
    return { message: 'OTP sent to new email' };
  }

  async verifyAndChangeEmail(uid, newEmail, otp) {
    // Verify OTP for the NEW email
    const verification = await this.otpService.verifyOtp(newEmail, otp);
    if (!verification.valid) {
      throw { status: 400, message: verification.message };
    }

    // Update User
    const updatedUser = await this.context.users.update({ uid }, { email: newEmail });
    delete updatedUser.password_hash;
    
    // Clear OTP
    await this.otpService.clearOtp(newEmail);

    return { message: 'Email updated successfully', user: updatedUser };
  }
}

module.exports = new AuthService();
