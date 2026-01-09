const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtpEmail(email, otp) {
    const mailOptions = {
        from: `"Bada Builder" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: 'Bada Builder - Email Verification OTP',
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #1a1a1a; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #58335e; font-weight: 600;">Bada Builder Verification</h2>
          <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6;">Your One-Time Password (OTP) for email verification is:</p>
          <div style="background: #f8f7f9; padding: 15px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: 700; letter-spacing: 6px; color: #1a1a1a;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #666;">This code is valid for <strong>3 minutes</strong>.</p>
          <p style="font-size: 13px; color: #666;">If you did not request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
          <p style="font-size: 11px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} Bada Builder. All rights reserved.</p>
        </div>
      `,
    };

    try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
  }

  async sendPasswordResetEmail(email, resetLink, userName) {
    const mailOptions = {
      from: `"Bada Builder" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Reset Your Password - Bada Builder',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 20px; color: #1a1a1a; max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 60px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #1a1a1a; font-weight: 700; margin: 0; font-size: 24px;">Password Reset Request</h2>
            <p style="font-size: 14px; color: #666; margin-top: 8px;">Hello ${userName || 'User'},</p>
          </div>
          
          <p style="font-size: 15px; color: #4a4a4a; line-height: 1.6; text-align: center; margin-bottom: 30px;">
            We received a request to reset the password associated with this email address. If you made this request, please click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${resetLink}" style="background-color: #0a0a0a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; display: inline-block; transition: background-color 0.3s;">
              Reset Password
            </a>
          </div>

          <p style="font-size: 13px; color: #888; text-align: center; line-height: 1.5; margin-bottom: 0;">
            If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.
          </p>
          
          <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="font-size: 11px; color: #aaa; margin: 0;">&copy; ${new Date().getFullYear()} Bada Builder Platform</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Reset Password Email sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending reset email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
