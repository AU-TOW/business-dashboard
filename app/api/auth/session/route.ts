import { NextRequest, NextResponse } from 'next/server';
import { getSession, getClearSessionCookieOptions } from '@/lib/session';

/**
 * GET /api/auth/session
 * Check if user has a valid session
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
      email: session.email,
      tenantSlug: session.tenantSlug,
      businessName: session.businessName,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({
      authenticated: false,
    });
  }
}

/**
 * DELETE /api/auth/session
 * Logout - clear session cookie
 */
export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear the session cookie
    const cookieOptions = getClearSessionCookieOptions();
    response.cookies.set(cookieOptions.name, '', {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      maxAge: cookieOptions.maxAge,
      path: cookieOptions.path,
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
