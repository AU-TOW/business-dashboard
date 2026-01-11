import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      // Check if assessment exists
      const checkResult = await client.query(
        'SELECT id, photos FROM damage_assessments WHERE id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }

      // Delete the assessment (photos cleanup can be added later if using storage)
      await client.query('DELETE FROM damage_assessments WHERE id = $1', [id]);

      return NextResponse.json({
        message: 'Damage assessment deleted successfully'
      });
    });

  } catch (error: any) {
    console.error('Error deleting damage assessment:', error);
    return NextResponse.json(
      { error: 'Failed to delete damage assessment', details: error.message },
      { status: 500 }
    );
  }
}
