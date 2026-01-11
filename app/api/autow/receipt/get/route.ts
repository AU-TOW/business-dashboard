import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Receipt ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      const result = await client.query(
        'SELECT * FROM receipts WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
      }

      return NextResponse.json({ receipt: result.rows[0] });
    });

  } catch (error: any) {
    console.error('Error getting receipt:', error);
    return NextResponse.json(
      { error: 'Failed to get receipt', details: error.message },
      { status: 500 }
    );
  }
}
