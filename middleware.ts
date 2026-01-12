import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/pricing',
  '/signup',
  '/signup/verify',
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

    // If Supabase env vars are not set, allow request through
    // (avoids crash during build or if env vars are missing)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables not set - skipping auth check');
      return NextResponse.next();
    }

  // Create a response to potentially modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client with cookie handling
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

  // Refresh session if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if this is a protected tenant route
  const isProtectedRoute = protectedTenantPatterns.some((pattern) =>
    pattern.test(pathname)
  );

  // Check if this is a semi-protected route (onboarding, login, welcome)
  const isSemiProtected = semiProtectedPatterns.some((pattern) =>
    pattern.test(pathname)
  );

  // If it's a protected route and no session, redirect to login
  if (isProtectedRoute && !session) {
    // Extract tenant slug from path
    const tenantSlug = pathname.split('/')[1];

    // Redirect to tenant login
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
