import { NextRequest, NextResponse } from 'next/server';
import { createTenant, isSlugAvailable, generateSlug } from '@/lib/tenant/provisioning';
import { createVerificationToken } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { TradeType, TRADE_DEFAULTS } from '@/lib/tenant/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, businessName, tradeType, phone, slug: providedSlug } = body;

    // Validation
    if (!email || !businessName) {
      return NextResponse.json(
        { error: 'Email and business name are required' },
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

    // Validate trade type
    const validTradeTypes: TradeType[] = ['car_mechanic', 'plumber', 'electrician', 'builder', 'general'];
    if (tradeType && !validTradeTypes.includes(tradeType)) {
      return NextResponse.json(
        { error: 'Invalid trade type' },
        { status: 400 }
      );
    }

    // Generate or use provided slug
    const slug = providedSlug || generateSlug(businessName);

    // Check slug availability
    const slugAvailable = await isSlugAvailable(slug);
    if (!slugAvailable) {
      return NextResponse.json(
        { error: 'This business name is already taken. Please choose a different name.' },
        { status: 409 }
      );
    }

    // Create the tenant (with trial status)
    const tenant = await createTenant({
      slug,
      businessName,
      tradeType: tradeType || 'general',
      email,
      phone: phone || undefined,
    });

    // Create verification token
    const token = await createVerificationToken(email, slug, businessName);

    // Send verification email
    const emailSent = await sendVerificationEmail(email, businessName, token);

    if (!emailSent) {
      console.error('Failed to send verification email');
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: 'Account created! Email delivery failed. Try logging in at /autow',
        tenant: {
          slug: tenant.slug,
          businessName: tenant.businessName,
        },
      });
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      message: 'Check your email for the verification link',
      tenant: {
        slug: tenant.slug,
        businessName: tenant.businessName,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);

    // Handle specific database errors
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'This business is already registered' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'An error occurred during signup. Please try again.',
        debug: {
          message: error?.message || 'Unknown error',
          code: error?.code,
          name: error?.name,
        }
      },
      { status: 500 }
    );
  }
}
