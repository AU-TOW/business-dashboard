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
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      const result = await client.query(
        'DELETE FROM jotter_notes WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Note not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Note deleted successfully',
        id: result.rows[0].id
      });
    });

  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note', details: error.message },
      { status: 500 }
    );
  }
}
