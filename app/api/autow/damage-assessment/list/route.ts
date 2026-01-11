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

    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    return await withTenantSchema(tenant, async (client) => {
      let query = `
        SELECT da.*,
          COUNT(*) OVER() as total_count
        FROM damage_assessments da
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status) {
        params.push(status);
        query += ` AND da.status = $${params.length}`;
      }

      query += ` ORDER BY da.created_at DESC, da.id DESC`;
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      return NextResponse.json({
        assessments: result.rows,
        total: result.rows[0]?.total_count || 0,
        limit,
        offset
      });
    });

  } catch (error: any) {
    console.error('Error fetching damage assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch damage assessments', details: error.message },
      { status: 500 }
    );
  }
}
