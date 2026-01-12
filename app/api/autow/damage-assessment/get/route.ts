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

    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      const result = await client.query(
        'SELECT * FROM damage_assessments WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }

      return NextResponse.json({ assessment: result.rows[0] });
    });

  } catch (error: any) {
    console.error('Error fetching damage assessment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch damage assessment', details: error.message },
      { status: 500 }
    );
  }
}
