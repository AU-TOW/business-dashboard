import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, tenantQuery } from '@/lib/tenant/context';
import { getSessionFromRequest } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT session from cookie
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant context from session or header
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    // Query tenant schema
    const bookings = await tenantQuery(
      tenant,
      `SELECT * FROM bookings
       WHERE booking_date >= CURRENT_DATE
       ORDER BY booking_date, booking_time`
    );

    return NextResponse.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('List bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
