// Supabase Server Client
// For use in Server Components, Route Handlers, and Server Actions

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// For middleware - uses request/response cookies
export function createMiddlewareClient(
  request: Request,
  response: Response
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookies(request.headers.get('cookie') || '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.headers.append(
              'Set-Cookie',
              serializeCookie(name, value, options)
            );
          });
        },
      },
    }
  );

  return supabase;
}

// Helper to parse cookie string
function parseCookies(cookieString: string): { name: string; value: string }[] {
  if (!cookieString) return [];
  return cookieString.split(';').map((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    return { name, value: rest.join('=') };
  });
}

// Helper to serialize cookie
function serializeCookie(name: string, value: string, options?: CookieOptions): string {
  let cookie = `${name}=${value}`;

  if (options?.path) cookie += `; Path=${options.path}`;
  if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options?.domain) cookie += `; Domain=${options.domain}`;
  if (options?.secure) cookie += `; Secure`;
  if (options?.httpOnly) cookie += `; HttpOnly`;
  if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`;

  return cookie;
}
