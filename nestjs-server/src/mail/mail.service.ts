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

  async sendJobApplicationConfirmationEmail(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  companyName: string,
): Promise<void> {
  const htmlContent = `
    <p>Dear ${applicantName},</p>
    <p>Thank you for submitting your job application through <strong>OraXINNO</strong>.</p>
    <p>We’ve successfully received your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>, and it has been forwarded to the employer for their review.</p>
    <p>Please note that OraXINNO is a platform facilitating the application process and does not make hiring decisions. The hiring company will contact you directly if your profile is shortlisted for the next stage.</p>
    <p>We appreciate you using OraXINNO and wish you the best in your job search.</p>
    <br/>
    <p>Best regards,<br/>The OraXINNO Team</p>
  `;

  try {
    const info = await this.transporter.sendMail({
      from: `"OraXINNO" <${process.env.SMTP_USER}>`,
      to: applicantEmail,
      subject: 'Your Job Application Has Been Received via OraXINNO',
      html: htmlContent,
    });

    console.log('📬 Job application confirmation email sent:', info.response);
  } catch (error) {
    console.error('❌ Failed to send job application confirmation email:', error);
  }
}

async sendApplicationWithdrawalEmail(
  applicantName: string,
  email: string,
  jobTitle: string,
  companyName: string
): Promise<void> {
  const htmlContent = `
    <p>Dear ${applicantName},</p>
    <p>We would like to confirm that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been withdrawn via OraXINNO.</p>
    <p>If this was intentional, no further action is needed. If you withdrew in error or wish to reapply, please log in to your OraXINNO account or contact support for assistance.</p>
    <p>We appreciate your use of the OraXINNO platform and wish you success in your job search.</p>
    <p>Warm regards,<br/>
    The OraXINNO Team<br/>
    <a href="mailto:support@oraxinno.com">support@oraxinno.com</a><br/>
    <a href="https://www.oraxinno.com" target="_blank">www.oraxinno.com</a></p>
  `;

  try {
    await this.transporter.sendMail({
      from: `"OraXINNO" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Application Has Been Withdrawn – ${jobTitle} at ${companyName}`,
      html: htmlContent,
    });

    console.log(`📬 Withdrawal email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send withdrawal email:', error);
  }
}


}
