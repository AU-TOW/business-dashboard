import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'bd_session';
const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'business-dashboard-secret-key-change-in-production'
);

interface SessionPayload {
  email: string;
  tenantSlug: string;
  businessName: string;
  iat: number;
  exp: number;
}

/**
 * Create a session token
 */
export async function createSessionToken(
  email: string,
  tenantSlug: string,
  businessName: string
): Promise<string> {
  const token = await new SignJWT({
    email,
    tenantSlug,
    businessName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Session valid for 7 days
    .sign(SESSION_SECRET);

  return token;
}

/**
 * Verify and decode a session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Get session from cookies (for server components and API routes)
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return verifySessionToken(sessionCookie.value);
}

/**
 * Set session cookie in response
 */
export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };
}

/**
 * Clear session cookie
 */
export function getClearSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  };
}
