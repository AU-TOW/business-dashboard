import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';
import crypto from 'crypto';

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
        'SELECT id, share_token FROM damage_assessments WHERE id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }

      // Generate new share token
      const shareToken = crypto.randomBytes(32).toString('hex');

      // Update assessment with share token
      await client.query(
        'UPDATE damage_assessments SET share_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [shareToken, id]
      );

      // Build share URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const shareUrl = `${baseUrl}/share/assessment/${shareToken}`;

      return NextResponse.json({
        message: 'Share link generated successfully',
        share_token: shareToken,
        share_url: shareUrl
      });
    });

  } catch (error: any) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { error: 'Failed to generate share link', details: error.message },
      { status: 500 }
    );
  }
}
