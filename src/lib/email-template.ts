// Update: src/lib/email-template.ts
export const emailTemplates = {
  emailChange: (userName: string, verifyUrl: string) => ({
    subject: 'Verify Your New Email Address - Cosbaii',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎭 Cosbaii</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">You recently requested to change your email address on Cosbaii.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Verify New Email Address
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't request this change, please ignore this email.
          </p>
        </div>
      </div>
    `
  }),

  // ✅ Add welcome email template
 // Update: src/lib/email-template.ts (welcome template)
welcome: (name: string, ctaUrl: string) => ({
  subject: 'Welcome to Cosbaii - Start Your Cosplay Journey! 🎭',
  html: `
    <div style="background-color: #f6f9fc; padding: 24px;">
      <div style="background-color: #ffffff; border-radius: 8px; padding: 24px; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div>
          <div>
            <div style="text-align: center; margin-bottom: 16px;">
              <h1 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 32px; font-weight: bold; margin: 0;">🎭 Cosbaii</h1>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            
            <h2 style="font-size: 22px; margin: 16px 0; color: #1f2937;">Welcome, ${name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin: 16px 0;">
              Thanks for joining Cosbaii — we're excited to have you on your cosplay journey! Below is a quick way to get started and explore our amazing community.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${ctaUrl || process.env.NEXTAUTH_URL + '/dashboard'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block; 
                        font-size: 16px;">
                Get Started Now! ✨
              </a>
            </div>
            
            <div style="margin: 24px 0; padding: 16px; background: #fef3c7; border-radius: 6px; border: 1px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                🎭 <strong>Pro Tip:</strong> Complete your profile within the first 7 days to earn your "Early Bird" badge!
              </p>
            </div>

            <div style="margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 6px; border: 1px solid #0ea5e9;">
              <p style="margin: 0; color: #0369a1; font-size: 14px;">
                <strong>Need help getting started?</strong><br/>
                Check out our <a href="${process.env.NEXTAUTH_URL}/help" style="color: #0369a1; text-decoration: underline;">quick start guide</a> or join our community Discord for tips and support!
              </p>
            </div>

            <p style="color: #6b7280; font-size: 13px; margin-top: 18px; line-height: 1.4;">
              If you didn't sign up for this account, please ignore this email or <a href="mailto:support@cosbaii.com" style="color: #667eea; text-decoration: none;">contact our support team</a>.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0 16px 0;" />
            
            <div style="text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                © ${new Date().getFullYear()} Cosbaii. All rights reserved.
              </p>
              <div style="margin-top: 8px;">
                <a href="${process.env.NEXTAUTH_URL}/privacy" style="color: #9ca3af; text-decoration: none; font-size: 12px; margin: 0 8px;">Privacy Policy</a>
                <a href="${process.env.NEXTAUTH_URL}/terms" style="color: #9ca3af; text-decoration: none; font-size: 12px; margin: 0 8px;">Terms of Service</a>
                <a href="${process.env.NEXTAUTH_URL}/unsubscribe" style="color: #9ca3af; text-decoration: none; font-size: 12px; margin: 0 8px;">Unsubscribe</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}),
};