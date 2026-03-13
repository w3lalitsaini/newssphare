import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SITE_NAME || 'NewsSphere'}" <${process.env.email}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending mail:', error);
    return { success: false, error };
  }
}

export async function sendOtpMail(email: string, otp: string) {
  const subject = `Your Verification Code - ${process.env.SITE_NAME || 'NewsSphere'}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #e11d48; text-align: center;">Verify Your Account</h2>
      <p>Hello,</p>
      <p>Thank you for joining <strong>${process.env.SITE_NAME || 'NewsSphere'}</strong>. Use the following code to complete your verification process. This code is valid for 10 minutes.</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #1e293b; background: #f1f5f9; padding: 10px 20px; border-radius: 8px; border: 1px solid #cbd5e1;">
          ${otp}
        </span>
      </div>
      <p>If you didn't request this code, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="font-size: 12px; color: #64748b; text-align: center;">
        &copy; ${new Date().getFullYear()} ${process.env.SITE_NAME || 'NewsSphere'}. All rights reserved.
      </p>
    </div>
  `;
  return sendMail({ to: email, subject, html });
}

export async function sendResetPasswordMail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${email}`;
  const subject = `Reset Your Password - ${process.env.SITE_NAME || 'NewsSphere'}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #e11d48; text-align: center;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account on <strong>${process.env.SITE_NAME || 'NewsSphere'}</strong>.</p>
      <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If the button above doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; font-size: 14px; color: #64748b;">${resetUrl}</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="font-size: 12px; color: #64748b; text-align: center;">
        &copy; ${new Date().getFullYear()} ${process.env.SITE_NAME || 'NewsSphere'}. All rights reserved.
      </p>
    </div>
  `;
  return sendMail({ to: email, subject, html });
}
