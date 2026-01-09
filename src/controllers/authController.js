const authService = require('../services/AuthService');
const otpService = require('../services/OtpService');

exports.sendOtp = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const sent = await otpService.generateAndSendOtp(email);
    
    if (sent) {
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send OTP email' });
    }
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  const { email, password, name, user_type, phone_number, otp } = req.body;
  
  if (!email || !password || !name || !otp) {
    return res.status(400).json({ success: false, message: 'Name, Email, Password and OTP are required' });
  }

  try {
    const { token, user } = await authService.register({ email, password, name, user_type, phone_number, otp });
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    // Basic error handling for service thrown errors
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and Password are required' });
  }

  try {
    const { token, user } = await authService.login({ email, password });
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.uid);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'phone_number', 'profile_photo', 'location'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await authService.updateUser(req.user.uid, updates);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};


exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const result = await authService.forgotPassword(email);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token, id, password } = req.body;

  if (!token || !id || !password) {
    return res.status(400).json({ success: false, message: 'Token, User ID, and Password are required' });
  }

  try {
    const result = await authService.resetPassword({ uid: id, token, newPassword: password });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.initiateEmailChange = async (req, res, next) => {
  const { newEmail } = req.body;
  if (!newEmail) return res.status(400).json({ success: false, message: 'New email is required' });

  try {
    const result = await authService.initiateEmailChange(req.user.uid, newEmail);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.verifyEmailChange = async (req, res, next) => {
  const { newEmail, otp } = req.body;
  if (!newEmail || !otp) return res.status(400).json({ success: false, message: 'New email and OTP are required' });

  try {
    const result = await authService.verifyAndChangeEmail(req.user.uid, newEmail, otp);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.sendLoginOtp = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const result = await authService.sendLoginOtp(email);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.loginWithOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

  try {
    const result = await authService.loginWithOtp(email, otp);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    next(error);
  }
};
