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

    const { invoice_id } = await request.json();

    if (!invoice_id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      // Check if invoice exists
      const invoiceResult = await client.query(
        'SELECT id, share_token FROM invoices WHERE id = $1',
        [invoice_id]
      );

      if (invoiceResult.rows.length === 0) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      const invoice = invoiceResult.rows[0];

      // Generate new share token if one doesn't exist
      let shareToken = invoice.share_token;
      if (!shareToken) {
        shareToken = randomUUID();

        // Update invoice with new share token
        await client.query(
          'UPDATE invoices SET share_token = $1 WHERE id = $2',
          [shareToken, invoice_id]
        );
      }

      // Build share URL
      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://booking.autow-services.co.uk'}/share/invoice/${shareToken}`;

      return NextResponse.json({
        success: true,
        share_token: shareToken,
        share_url: shareUrl
      });
    });

  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json({ error: 'Failed to generate share link' }, { status: 500 });
  }
}
