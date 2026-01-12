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
      return NextResponse.json({ error: 'Estimate ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      // Get estimate
      const estimateResult = await client.query(
        'SELECT * FROM estimates WHERE id = $1',
        [id]
      );

      if (estimateResult.rows.length === 0) {
        return NextResponse.json({ error: 'Estimate not found' }, { status: 404 });
      }

      // Get line items
      const lineItemsResult = await client.query(
        `SELECT * FROM line_items
         WHERE document_type = 'estimate' AND document_id = $1
         ORDER BY sort_order`,
        [id]
      );

      // Get photos
      const photosResult = await client.query(
        `SELECT * FROM document_photos
         WHERE document_type = 'estimate' AND document_id = $1
         ORDER BY sort_order`,
        [id]
      );

      // Get business settings
      const settingsResult = await client.query(
        'SELECT * FROM business_settings WHERE id = 1'
      );

      const estimate = {
        ...estimateResult.rows[0],
        line_items: lineItemsResult.rows,
        photos: photosResult.rows,
        business_settings: settingsResult.rows[0]
      };

      return NextResponse.json({ estimate });
    });

  } catch (error: any) {
    console.error('Error fetching estimate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch estimate', details: error.message },
      { status: 500 }
    );
  }
}
