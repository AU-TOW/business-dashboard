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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    return await withTenantSchema(tenant, async (client) => {
      // Build query
      let query = `
        SELECT e.*,
          COUNT(*) OVER() as total_count
        FROM estimates e
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status) {
        params.push(status);
        query += ` AND e.status = $${params.length}`;
      }

      query += ` ORDER BY e.estimate_date DESC, e.id DESC`;
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      // Get line items for each estimate
      const estimateIds = result.rows.map(r => r.id);
      let lineItems: any[] = [];

      if (estimateIds.length > 0) {
        const lineItemsResult = await client.query(
          `SELECT * FROM line_items
           WHERE document_type = 'estimate' AND document_id = ANY($1)
           ORDER BY document_id, sort_order`,
          [estimateIds]
        );
        lineItems = lineItemsResult.rows;
      }

      // Attach line items to estimates
      const estimates = result.rows.map(estimate => ({
        ...estimate,
        line_items: lineItems.filter(li => li.document_id === estimate.id)
      }));

      return NextResponse.json({
        estimates,
        total: result.rows[0]?.total_count || 0,
        limit,
        offset
      });
    });

  } catch (error: any) {
    console.error('Error fetching estimates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch estimates', details: error.message },
      { status: 500 }
    );
  }
}
