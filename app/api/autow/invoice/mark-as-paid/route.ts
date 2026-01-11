import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.AUTOW_STAFF_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant context
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const { id, payment_method, payment_reference, amount_paid } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      const result = await client.query(
        `UPDATE invoices
         SET status = 'paid',
             payment_method = $1,
             payment_reference = $2,
             payment_date = CURRENT_DATE,
             paid_at = NOW(),
             amount_paid = COALESCE($3, total),
             balance_due = 0
         WHERE id = $4
         RETURNING *`,
        [payment_method, payment_reference, amount_paid, id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Invoice marked as paid successfully',
        invoice: result.rows[0]
      });
    });

  } catch (error: any) {
    console.error('Error marking invoice as paid:', error);
    return NextResponse.json({ error: 'Failed to mark invoice as paid', details: error.message }, { status: 500 });
  }
}
