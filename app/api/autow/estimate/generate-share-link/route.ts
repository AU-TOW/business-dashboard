import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';
import { getSessionFromRequest } from '@/lib/session';
import { randomUUID } from 'crypto';

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

    const { estimate_id } = await request.json();

    if (!estimate_id) {
      return NextResponse.json({ error: 'Estimate ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      // Check if estimate exists
      const estimateResult = await client.query(
        'SELECT id, share_token FROM estimates WHERE id = $1',
        [estimate_id]
      );

      if (estimateResult.rows.length === 0) {
        return NextResponse.json({ error: 'Estimate not found' }, { status: 404 });
      }

      const estimate = estimateResult.rows[0];

      // Generate new share token if one doesn't exist
      let shareToken = estimate.share_token;
      if (!shareToken) {
        shareToken = randomUUID();

        // Update estimate with new share token
        await client.query(
          'UPDATE estimates SET share_token = $1 WHERE id = $2',
          [shareToken, estimate_id]
        );
      }

      // Build share URL
      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://booking.autow-services.co.uk'}/share/estimate/${shareToken}`;

      return NextResponse.json({
        success: true,
        share_token: shareToken,
        share_url: shareUrl
      });
    });

  } catch (error) {
    console.error('[Share Link] ERROR:', error);
    console.error('[Share Link] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({
      error: 'Failed to generate share link',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
