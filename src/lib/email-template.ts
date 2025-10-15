export const emailTemplates = {
  // ✅ Add verification code template
  verificationCode: (userName: string, code: string) => ({
    subject: "Verify Your Cosbaii Account",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="background: white; display: inline-block; padding: 25px 50px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <img src="https://cosbaii.com/images/cosbaii-logo-white-bg.png" alt="Cosbaii Logo" width="160" height="auto" style="display: block; margin: 0; background: white; padding: 10px;" />
          </div>
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
    subject: "Welcome to Cosbaii! 🎉",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="background: white; display: inline-block; padding: 25px 50px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin: 0 auto;">
            <img src="https://cosbaii.com/images/cosbaii-logo-white-bg.png" alt="Cosbaii Logo" width="140" height="auto" style="display: block; margin: 0; background: white; padding: 10px;" />
          </div>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px; text-align: center;">🎉 Welcome, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; text-align: center; font-size: 16px;">
            Your account has been verified! You're now part of the Cosbaii community.
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${ctaUrl}" style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(241, 115, 5, 0.3); font-size: 16px;">
              Go to Dashboard
            </a>
          </div>
          
          <div style="background: #f5f5f5; border-left: 4px solid #F17305; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.8;">
              <strong style="color: #333; font-size: 15px;">What's next?</strong><br/>
              • Complete your profile<br/>
              • Upload your first cosplay<br/>
              • Connect with the community
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; text-align: center; line-height: 1.6;">
              This is an automated message, please do not reply to this email.<br/>
              If you have questions, contact us at <a href="mailto:cosbaii.cebu@gmail.com" style="color: #F17305; text-decoration: none;">cosbaii.cebu@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    `,
  }),

  emailChange: (userName: string, verifyUrl: string) => ({
    subject: "Verify Your New Email Address - Cosbaii",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="background: white; display: inline-block; padding: 25px 50px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <img src="https://cosbaii.com/images/cosbaii-logo-white-bg.png" alt="Cosbaii Logo" width="140" height="auto" style="display: block; margin: 0; background: white; padding: 10px;" />
          </div>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            You requested to change your email address. Click the button below to verify your new email:
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #F17305 0%, #FF8C42 100%); color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(241, 115, 5, 0.3); font-size: 16px;">
              Verify Email
            </a>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
              <strong>⚠️ Security Notice:</strong><br/>
              If you didn't request this email change, please ignore this email and contact our support team immediately.
            </p>
          </div>
          
          <p style="color: #999; font-size: 13px; line-height: 1.6; text-align: center;">
            This verification link will expire in <strong>24 hours</strong> for security reasons.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; text-align: center; line-height: 1.6;">
              This is an automated message, please do not reply to this email.<br/>
              If you have questions, contact us at <a href="mailto:cosbaii.cebu@gmail.com" style="color: #F17305; text-decoration: none;">cosbaii.cebu@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    `,
  }),
};