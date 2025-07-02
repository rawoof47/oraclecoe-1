import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
    const htmlContent = `
      <p>Hi there,</p>
      <p>You requested to reset your password. Click the button below:</p>
      <p>
        <a 
          href="${resetLink}" 
          style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          "
          target="_blank"
        >
          Reset Your Password
        </a>
      </p>
      <p>This link will expire in 15 minutes.</p>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"Oraxinno" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset your password',
        html: htmlContent,
      });

      console.log('📬 Email successfully sent:', info.response);
    } catch (error) {
      console.error('❌ Email sending failed:', error);
    }
  }
}
