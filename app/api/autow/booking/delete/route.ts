import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, tenantMutate } from '@/lib/tenant/context';
import { getSessionFromRequest } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Verify JWT session from cookie
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant context from header
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Delete booking from tenant schema
    const result = await tenantMutate(
      tenant,
      'DELETE FROM bookings WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
