import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'bd_session';
const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'business-dashboard-secret-key-change-in-production'
);

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/pricing',
  '/signup',
  '/signup/verify',
  '/login',
  '/auth/verify',
  '/autow', // Legacy login page
];

// Route patterns that are always public
const publicPatterns = [
  /^\/share\//, // Share links
  /^\/api\/share\//, // Share API routes
  /^\/api\/auth\//, // Auth API routes
  /^\/_next\//, // Next.js internals
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
];

// Tenant routes that require authentication
const protectedTenantPatterns = [
  /^\/[^\/]+\/dashboard/,
  /^\/[^\/]+\/booking/,
  /^\/[^\/]+\/estimates/,
  /^\/[^\/]+\/invoices/,
  /^\/[^\/]+\/receipts/,
  /^\/[^\/]+\/notes/,
  /^\/[^\/]+\/jotter/,
  /^\/[^\/]+\/assessments/,
  /^\/[^\/]+\/settings/,
];

// Routes that are allowed without full session (onboarding, login)
const semiProtectedPatterns = [
  /^\/[^\/]+\/onboarding/,
  /^\/[^\/]+\/login/,
  /^\/[^\/]+\/welcome/,
];

/**
 * Check for our custom session cookie
 */
async function checkCustomSession(request: NextRequest): Promise<{ valid: boolean; tenantSlug?: string }> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return { valid: false };
  }

  try {
    const { payload } = await jwtVerify(sessionCookie.value, SESSION_SECRET);
    return {
      valid: true,
      tenantSlug: payload.tenantSlug as string,
    };
  } catch {
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Skip public routes
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Skip public patterns
    if (publicPatterns.some((pattern) => pattern.test(pathname))) {
      return NextResponse.next();
    }

    // Create a response to potentially modify
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Check if this is a protected tenant route
    const isProtectedRoute = protectedTenantPatterns.some((pattern) =>
      pattern.test(pathname)
    );

    // Check if this is a semi-protected route (onboarding, login, welcome)
    const isSemiProtected = semiProtectedPatterns.some((pattern) =>
      pattern.test(pathname)
    );

    // For protected routes, check for session
    if (isProtectedRoute) {
      // First check our custom session cookie
      const customSession = await checkCustomSession(request);

      if (customSession.valid) {
        // User has valid custom session
        return response;
      }

      // Fall back to Supabase session if available
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { createServerClient } = await import('@supabase/ssr');

        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          {
            cookies: {
              getAll() {
                return request.cookies.getAll().map((cookie) => ({
                  name: cookie.name,
                  value: cookie.value,
                }));
              },
              setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                  request.cookies.set(name, value);
                  response = NextResponse.next({
                    request: {
                      headers: request.headers,
                    },
                  });
                  response.cookies.set(name, value, options);
                });
              },
            },
          }
        );

        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          return response;
        }
      }

      // No valid session - redirect to login
      const tenantSlug = pathname.split('/')[1];
      const loginUrl = new URL(`/${tenantSlug}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For semi-protected routes, we allow access but the page can check session
    // This enables onboarding flow to work right after magic link verification

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // On any error, allow the request through to avoid blocking the site
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
