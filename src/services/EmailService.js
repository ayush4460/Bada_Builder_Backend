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
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563EB;">Bada Builder Verification</h2>
          <p>Your One-Time Password (OTP) for email verification is:</p>
          <h1 style="background: #f3f4f6; padding: 10px 20px; display: inline-block; letter-spacing: 5px; border-radius: 8px;">${otp}</h1>
          <p>This code is valid for <strong>3 minutes</strong>.</p>
          <p>If you did not request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">&copy; ${new Date().getFullYear()} Bada Builder. All rights reserved.</p>
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
}

module.exports = new EmailService();
