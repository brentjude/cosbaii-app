// src/lib/email-template.ts
export const emailTemplates = {
  // ✅ Add verification code template
  verificationCode: (userName: string, code: string) => ({
    subject: "Verify Your Cosbaii Account",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px;">🎭 Cosbaii</h1>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Cosbaii, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Thank you for signing up! Please verify your email address by entering the verification code below:
          </p>
          
          <div style="background: #f5f5f5; border: 2px dashed #F17305; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
            <p style="color: #666; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
            <div style="font-size: 48px; font-weight: bold; color: #F17305; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            This code will expire in <strong>10 minutes</strong>. If you didn't create an account with Cosbaii, please ignore this email.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `,
  }),

  welcome: (userName: string, ctaUrl: string) => ({
    subject: "Welcome to Cosbaii!",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎭 Welcome to Cosbaii!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">Your account has been verified! You're now part of the Cosbaii community.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${ctaUrl}" style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  emailChange: (userName: string, verifyUrl: string) => ({
    subject: "Verify Your New Email Address",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎭 Cosbaii</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">You requested to change your email address. Click the button below to verify your new email:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Verify Email
            </a>
          </div>
        </div>
      </div>
    `,
  }),
};