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
    const month = searchParams.get('month'); // e.g., '2026-01'
    const supplier = searchParams.get('supplier');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    return await withTenantSchema(tenant, async (client) => {
      let query = 'SELECT * FROM receipts WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (month) {
        query += ` AND gdrive_folder_path = $${paramIndex}`;
        params.push(month);
        paramIndex++;
      }

      if (supplier) {
        query += ` AND LOWER(supplier) LIKE LOWER($${paramIndex})`;
        params.push(`%${supplier}%`);
        paramIndex++;
      }

      if (category) {
        query += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (status) {
        query += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      query += ' ORDER BY receipt_date DESC, created_at DESC';

      const result = await client.query(query, params);

      // Also get summary stats
      const statsResult = await client.query(`
        SELECT
          COUNT(*) as total_count,
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(DISTINCT gdrive_folder_path) as month_count
        FROM receipts
      `);

      return NextResponse.json({
        receipts: result.rows,
        stats: statsResult.rows[0]
      });
    });

  } catch (error: any) {
    console.error('Error listing receipts:', error);
    return NextResponse.json(
      { error: 'Failed to list receipts', details: error.message },
      { status: 500 }
    );
  }
}
