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

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      // Verify expense exists
      const expenseCheck = await client.query(
        'SELECT id, invoice_id FROM invoice_expenses WHERE id = $1',
        [id]
      );

      if (expenseCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
      }

      // Delete the expense
      await client.query('DELETE FROM invoice_expenses WHERE id = $1', [id]);

      return NextResponse.json({
        success: true,
        message: 'Expense deleted successfully',
      });
    });

  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense', details: error.message },
      { status: 500 }
    );
  }
}
