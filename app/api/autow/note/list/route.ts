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
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    return await withTenantSchema(tenant, async (client) => {
      let query = `
        SELECT *,
          COUNT(*) OVER() as total_count
        FROM jotter_notes
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status && status !== 'all') {
        params.push(status);
        query += ` AND status = $${params.length}`;
      }

      query += ` ORDER BY note_date DESC, id DESC`;
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      return NextResponse.json({
        notes: result.rows,
        total: result.rows[0]?.total_count || 0,
        limit,
        offset
      });
    });

  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes', details: error.message },
      { status: 500 }
    );
  }
}
