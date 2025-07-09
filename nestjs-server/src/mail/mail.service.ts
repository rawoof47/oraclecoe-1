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

  async sendResetPasswordEmail(userName: string, email: string, resetLink: string): Promise<void> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <p>Hi ${userName},</p>

      <p>We received a request to reset your password for your account.</p>

      <p>
        Click the button below to set a new password. This link will expire in <strong>15 minutes</strong> for your security.
      </p>

      <p style="text-align: center; margin: 30px 0;">
        <a 
          href="${resetLink}" 
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
          "
          target="_blank"
        >
          Reset Password
        </a>
      </p>

      <p>If you did not request this change, you can safely ignore this email. Your current password will remain unchanged</p>

      <p>Thanks,<br>The Oraxinno Team</p>
    </div>
  `;

  try {
    const info = await this.transporter.sendMail({
      from: `"Oraxinno" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your Password – Link Expires in 15 Minutes',
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
    <p>Warm regards,<br/>The OraXINNO Team</p>
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
async sendShortlistedEmail(
  applicantName: string,
  email: string,
  jobTitle: string,
  companyName: string
): Promise<void> {
  const htmlContent = `
    <p>Dear ${applicantName},</p>
    <p>We’re pleased to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>, submitted via OraXINNO, has been shortlisted by the employer.</p>
    <p>This means your profile has moved forward in the hiring process, and the company may reach out to you shortly for the next steps such as interviews or assessments.</p>
    <p>We’ll continue to keep you updated on any changes to your application status.</p>
    <p>Best of luck!<br/>
    The OraXINNO Team<br/>
    <a href="mailto:support@oraxinno.com">support@oraxinno.com</a><br/>
    <a href="https://www.oraxinno.com" target="_blank">www.oraxinno.com</a></p>
  `;

  try {
    console.log(`📤 Sending shortlisted email to ${email}`);
    await this.transporter.sendMail({
      from: `"OraXINNO" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Application Has Been Shortlisted – ${jobTitle} at ${companyName}`,
      html: htmlContent,
    });

    console.log(`📬 Shortlisted email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send shortlisted email:', error);
  }
}

async sendCandidateWelcomeEmail(email: string): Promise<void> {
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@oraxinno.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <p>Hi there,</p>

      <p>Welcome to <strong>Oraxinno</strong> – your gateway to exciting job opportunities!</p>

      <p>We’re happy to confirm that your account has been successfully created. To unlock the full potential of Oraxinno, the next step is to complete your employee profile.</p>

      <p><strong>Get started by:</strong></p>
      <ul>
        <li>Filling out your profile details</li>
        <li>Uploading your resume/CV</li>
        <li>Browsing job listings tailored to your skills</li>
      </ul>

      <p>If you have any questions or need help, feel free to reach out to us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>

      <p>Thanks for joining Oraxinno – where opportunities meet talent.</p>

      <p>Warm regards,<br>The Oraxinno Team</p>
    </div>
  `;

  try {
    const info = await this.transporter.sendMail({
      from: `"Oraxinno" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Oraxinno – Let’s Get Started!',
      html: htmlContent,
    });

    console.log('📬 Welcome email sent to candidate:', info.response);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
  }
}

async sendRecruiterWelcomeEmail(email: string): Promise<void> {
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@oraxinno.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <p>Hi there,</p>

      <p>Welcome to <strong>Oraxinno</strong> – where top talent meets the right opportunities!</p>

      <p>Your employer account has been successfully created. To unlock the full potential of Oraxinno, the next step is to complete your employer profile.</p>

      <p><strong>Here’s what you can do next:</strong></p>
      <ul>
        <li>Complete your company profile to build trust with applicants</li>
        <li>Post your first job opening</li>
        <li>Review applications and shortlist top talent</li>
      </ul>

      <p>If you need any assistance getting started, feel free to reach out to us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>

      <p>We’re excited to support you on your hiring journey.</p>

      <p>Best regards,<br>The Oraxinno Team</p>
    </div>
  `;

  try {
    const info = await this.transporter.sendMail({
      from: `"Oraxinno" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Oraxinno – Let’s Get Started!',
      html: htmlContent,
    });

    console.log('📬 Welcome email sent to recruiter:', info.response);
  } catch (error) {
    console.error('❌ Failed to send recruiter welcome email:', error);
  }
}



}
