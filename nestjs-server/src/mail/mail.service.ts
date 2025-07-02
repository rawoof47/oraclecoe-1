import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465, // ✅ Handles undefined safely
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
  }

  async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
    await this.transporter.sendMail(
  {
    from: `"Oraxinno" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <p>Hello,</p>
      <p>You requested to reset your password. Click the link below:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 15 minutes.</p>
    `,
  },
  (error, info) => {
    if (error) {
      console.error('❌ Email sending failed:', error);
    } else {
      console.log('📬 Email successfully sent:', info.response);
    }
  }
);

}}
