import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, markTenantEmailVerified } from '@/lib/db';
import { createSessionToken, getSessionCookieOptions } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const result = await verifyToken(token);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Invalid or expired token',
          tenantSlug: result.tenantSlug,
        },
        { status: 400 }
      );
    }

    // Mark tenant email as verified (for signup tokens)
    if (result.tenantSlug && result.type === 'verification') {
      await markTenantEmailVerified(result.tenantSlug);
    }

    // Create a session token and set cookie
    const sessionToken = await createSessionToken(
      result.email!,
      result.tenantSlug!,
      result.businessName!
    );

    const response = NextResponse.json({
      success: true,
      email: result.email,
      tenantSlug: result.tenantSlug,
      businessName: result.businessName,
      type: result.type,
    });

    // Set the session cookie
    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, sessionToken, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      maxAge: cookieOptions.maxAge,
      path: cookieOptions.path,
    });

    return response;
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during verification',
        debug: {
          message: error?.message || 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
