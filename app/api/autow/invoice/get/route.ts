import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT session from cookie
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant context
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      // Get invoice
      const invoiceResult = await client.query(
        'SELECT * FROM invoices WHERE id = $1',
        [id]
      );

      if (invoiceResult.rows.length === 0) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      // Get line items
      const lineItemsResult = await client.query(
        `SELECT * FROM line_items
         WHERE document_type = 'invoice' AND document_id = $1
         ORDER BY sort_order`,
        [id]
      );

      // Get photos
      const photosResult = await client.query(
        `SELECT * FROM document_photos
         WHERE document_type = 'invoice' AND document_id = $1
         ORDER BY sort_order`,
        [id]
      );

      // Get business settings
      const settingsResult = await client.query(
        'SELECT * FROM business_settings WHERE id = 1'
      );

      const invoice = {
        ...invoiceResult.rows[0],
        line_items: lineItemsResult.rows,
        photos: photosResult.rows,
        business_settings: settingsResult.rows[0]
      };

      return NextResponse.json({ invoice });
    });

  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice', details: error.message },
      { status: 500 }
    );
  }
}
