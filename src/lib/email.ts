// Update: src/lib/email.ts
import { Resend } from 'resend';
import { emailTemplates } from './email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Dynamic sender based on environment
const getEmailSender = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return 'Cosbaii Dev <onboarding@resend.dev>'; // Sandbox for development
  } else {
    return 'Cosbaii <noreply@cosbaii.com>'; // Your verified domain for production
  }
};

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const ctaUrl = `${process.env.NEXTAUTH_URL}/dashboard`;
    const { subject, html } = emailTemplates.welcome(userName, ctaUrl);

    console.log("Sending welcome email from:", getEmailSender(), "to:", userEmail);

    const { data, error } = await resend.emails.send({
      from: getEmailSender(), // ✅ Use dynamic sender
      to: [userEmail],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendEmailChangeVerification(userEmail: string, userName: string, token: string) {
  try {
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email-change?token=${token}`;
    const { subject, html } = emailTemplates.emailChange(userName, verifyUrl);

    const { data, error } = await resend.emails.send({
      from: getEmailSender(), // ✅ Use dynamic sender
      to: [userEmail],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Error sending email change verification:', error);
      return { success: false, error };
    }

    console.log('Email change verification sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email change verification:', error);
    return { success: false, error };
  }
}
// ✅ Add more email templates as needed
export async function sendPasswordResetEmail(userEmail: string, userName: string, resetUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Cosbaii <noreply@cosbaii.com>',
      to: [userEmail],
      subject: 'Reset Your Cosbaii Password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎭 Cosbaii</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">You requested to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    console.log('Password reset email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}