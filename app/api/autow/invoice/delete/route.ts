import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';

export async function POST(request: NextRequest) {
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

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      try {
        await client.query('BEGIN');

        await client.query('DELETE FROM line_items WHERE document_type = $1 AND document_id = $2', ['invoice', id]);
        await client.query('DELETE FROM document_photos WHERE document_type = $1 AND document_id = $2', ['invoice', id]);

        const result = await client.query('DELETE FROM invoices WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        await client.query('COMMIT');

        return NextResponse.json({ message: 'Invoice deleted successfully' });

      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    });

  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Failed to delete invoice', details: error.message }, { status: 500 });
  }
}
