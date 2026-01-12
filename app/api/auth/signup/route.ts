import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createTenant, isSlugAvailable, generateSlug } from '@/lib/tenant/provisioning';
import { TradeType, TRADE_DEFAULTS } from '@/lib/tenant/types';

/**
 * Get Supabase admin client (lazy initialization for Next.js build compatibility)
 */
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
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

    // Check if email already exists in Supabase Auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUsers?.users?.some(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in instead.' },
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

    // Get the origin for redirect URL
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Send magic link via Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${origin}/signup/verify?tenant=${slug}`,
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      // Don't expose internal error details
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    // Also send the magic link email via signInWithOtp (for actual email delivery)
    const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/signup/verify?tenant=${slug}`,
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      console.error('OTP error:', otpError);
      // Tenant was created but email failed - log for debugging
      return NextResponse.json(
        { error: 'Account created but email failed. Please try logging in.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Check your email for the magic link',
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

    // Include error details for debugging (remove in production later)
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
