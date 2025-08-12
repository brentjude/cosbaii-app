// Update: src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailVerificationOptions {
  email: string;
  token: string;
  type: 'email-change' | 'signup';
  userName?: string;
}

export const sendEmailVerification = async ({
  email,
  token,
  type,
  userName
}: EmailVerificationOptions) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/api/auth/verify-email-change?token=${token}`;
  
  const subject = type === 'email-change' 
    ? 'Verify Your New Email Address - Cosbaii'
    : 'Verify Your Email Address - Cosbaii';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
            .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background: #007bff; 
                color: white; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎭 Cosbaii</h1>
            </div>
            
            <h2>Hello ${userName || 'there'}!</h2>
            
            <p>You recently requested to change your email address on Cosbaii.</p>
            
            <p>Please click the button below to verify your new email address:</p>
            
            <div style="text-align: center;">
                <a href="${verifyUrl}" class="button">Verify New Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
                ${verifyUrl}
            </p>
            
            <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
            
            <div class="footer">
                <p>If you didn't request this email change, please ignore this message or contact support.</p>
                <p>This is an automated message from Cosbaii. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `Cosbaii <${process.env.RESEND_FROM_EMAIL}>`, // e.g., 'Cosbaii <noreply@yourdomain.com>'
      to: [email],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
    return data;
    
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    throw error;
  }
};