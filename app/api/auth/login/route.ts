import { NextRequest, NextResponse } from 'next/server';
import { getTenantByEmail, createMagicLinkToken } from '@/lib/db';
import { sendMagicLinkEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Find tenant by email
    const tenant = await getTenantByEmail(email.toLowerCase());

    if (!tenant) {
      // Don't reveal that email doesn't exist - show same message
      // This prevents email enumeration attacks
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a sign-in link.',
      });
    }

    // Create magic link token
    const token = await createMagicLinkToken(
      tenant.email,
      tenant.slug,
      tenant.businessName
    );

    // Send magic link email
    const emailSent = await sendMagicLinkEmail(
      tenant.email,
      tenant.businessName,
      token
    );

    if (!emailSent) {
      console.error('Failed to send magic link email');
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent! Check your email.',
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred. Please try again.',
        debug: {
          message: error?.message || 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
