import nodemailer from 'nodemailer';

const FROM_EMAIL = process.env.EMAIL_FROM || 'Business Dashboard <support@autow-services.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Generate HTML email template for verification
 */
export function getVerificationEmailHTML(verificationLink: string, businessName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Business Dashboard</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; background-color: #f0f7ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 50%, #f5f5f5 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.15);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="font-size: 32px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
                      Business Dashboard
                    </div>
                    <div style="font-size: 14px; color: rgba(255, 255, 255, 0.8);">
                      Your All-in-One Business Management Platform
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color: #1e40af; font-size: 24px; font-weight: 700; padding-bottom: 20px;">
                    Welcome to Business Dashboard!
                  </td>
                </tr>
                <tr>
                  <td style="color: #1e293b; font-size: 16px; line-height: 1.6; padding-bottom: 20px;">
                    Hi <strong>${businessName}</strong>,
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 16px; line-height: 1.6; padding-bottom: 30px;">
                    Thanks for signing up for Business Dashboard! Your 7-day free trial is ready. To get started, please verify your email address by clicking the button below.
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);">
                      Verify Email & Start Trial
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="color: #64748b; font-size: 14px; line-height: 1.6; padding-top: 30px; padding-bottom: 20px;">
                    Or copy and paste this link into your browser:
                  </td>
                </tr>
                <tr>
                  <td style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 12px; word-break: break-all;">
                    <a href="${verificationLink}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                      ${verificationLink}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="color: #94a3b8; font-size: 14px; line-height: 1.6; padding-top: 30px;">
                    This verification link will expire in 24 hours for security purposes.
                  </td>
                </tr>

                <tr>
                  <td style="color: #94a3b8; font-size: 14px; line-height: 1.6; padding-top: 20px;">
                    If you didn't create an account with Business Dashboard, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: rgba(59, 130, 246, 0.05); border-top: 1px solid rgba(59, 130, 246, 0.1); padding: 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color: #1e40af; font-size: 14px; font-weight: 600; padding-bottom: 15px;">
                    What's Included in Your Free Trial:
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px; line-height: 1.8;">
                    <span style="color: #3b82f6;">✓</span> Unlimited bookings<br>
                    <span style="color: #3b82f6;">✓</span> Customer management<br>
                    <span style="color: #3b82f6;">✓</span> Invoice generation<br>
                    <span style="color: #3b82f6;">✓</span> Telegram bot integration<br>
                    <span style="color: #3b82f6;">✓</span> Business analytics
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <hr style="border: none; border-top: 1px solid rgba(59, 130, 246, 0.1); margin: 0;">
                  </td>
                </tr>
                <tr>
                  <td style="color: #94a3b8; font-size: 12px; padding-top: 20px; text-align: center;">
                    © 2025 AUTOW Services. All rights reserved.<br>
                    Need help? Contact us at <a href="mailto:support@autow-services.com" style="color: #3b82f6; text-decoration: none;">support@autow-services.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate magic login link email HTML
 */
export function getMagicLinkEmailHTML(magicLink: string, businessName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In to Business Dashboard</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; background-color: #f0f7ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 50%, #f5f5f5 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.15);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="font-size: 32px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
                      Business Dashboard
                    </div>
                    <div style="font-size: 14px; color: rgba(255, 255, 255, 0.8);">
                      Your All-in-One Business Management Platform
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color: #1e40af; font-size: 24px; font-weight: 700; padding-bottom: 20px;">
                    Sign In to Your Dashboard
                  </td>
                </tr>
                <tr>
                  <td style="color: #1e293b; font-size: 16px; line-height: 1.6; padding-bottom: 20px;">
                    Hi <strong>${businessName}</strong>,
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 16px; line-height: 1.6; padding-bottom: 30px;">
                    Click the button below to securely sign in to your Business Dashboard. No password required!
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${magicLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);">
                      Sign In to Dashboard
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="color: #64748b; font-size: 14px; line-height: 1.6; padding-top: 30px; padding-bottom: 20px;">
                    Or copy and paste this link into your browser:
                  </td>
                </tr>
                <tr>
                  <td style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 12px; word-break: break-all;">
                    <a href="${magicLink}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                      ${magicLink}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="color: #94a3b8; font-size: 14px; line-height: 1.6; padding-top: 30px;">
                    This magic link will expire in 1 hour for security purposes.
                  </td>
                </tr>

                <tr>
                  <td style="color: #94a3b8; font-size: 14px; line-height: 1.6; padding-top: 20px;">
                    If you didn't request this sign-in link, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: rgba(59, 130, 246, 0.05); border-top: 1px solid rgba(59, 130, 246, 0.1); padding: 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color: #94a3b8; font-size: 12px; text-align: center;">
                    © 2025 AUTOW Services. All rights reserved.<br>
                    Need help? Contact us at <a href="mailto:support@autow-services.com" style="color: #3b82f6; text-decoration: none;">support@autow-services.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send verification email for new signup
 */
export async function sendVerificationEmail(
  email: string,
  businessName: string,
  token: string
): Promise<boolean> {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('❌ SMTP not configured - missing SMTP_USER or SMTP_PASSWORD env vars');
      console.error('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'MISSING');
      console.error('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'SET' : 'MISSING');
      return false;
    }

    const verificationLink = `${APP_URL}/signup/verify?token=${token}`;
    console.log('📧 Sending verification email to:', email);
    console.log('📧 Verification link:', verificationLink);

    const htmlContent = getVerificationEmailHTML(verificationLink, businessName);

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Business Dashboard - Verify Your Email',
      html: htmlContent,
    });

    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending verification email:', error?.message || error);
    console.error('❌ Error code:', error?.code);
    console.error('❌ Error response:', error?.response);
    return false;
  }
}

/**
 * Send magic link email for login
 */
export async function sendMagicLinkEmail(
  email: string,
  businessName: string,
  token: string
): Promise<boolean> {
  try {
    const magicLink = `${APP_URL}/auth/verify?token=${token}`;
    const htmlContent = getMagicLinkEmailHTML(magicLink, businessName);

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Sign In to Business Dashboard',
      html: htmlContent,
    });

    console.log(`✅ Magic link email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending magic link email:', error);
    return false;
  }
}
