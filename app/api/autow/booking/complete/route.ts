import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, tenantMutate } from '@/lib/tenant/context';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const rawAuth = request.headers.get('authorization');
    const token = rawAuth ? rawAuth.replace('Bearer ', '') : null;

    if (!verifyToken(token)) {
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

    // Update booking status in tenant schema
    const result = await tenantMutate(
      tenant,
      `UPDATE bookings
       SET status = 'completed', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id`,
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
      message: 'Booking marked as completed'
    });

  } catch (error) {
    console.error('Complete booking error:', error);
    return NextResponse.json(
      { error: 'Failed to complete booking' },
      { status: 500 }
    );
  }
}
