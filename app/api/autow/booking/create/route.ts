import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, tenantQuery, tenantMutate } from '@/lib/tenant/context';
import { getSessionFromRequest } from '@/lib/session';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    // Verify JWT session from cookie
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant context from header
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'booked_by', 'booking_date', 'booking_time', 'service_type',
      'customer_name', 'customer_phone', 'vehicle_make', 'vehicle_model',
      'vehicle_reg', 'location_address', 'location_postcode', 'issue_description'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Format the data
    const bookingData = {
      booked_by: data.booked_by,
      booking_date: data.booking_date,
      booking_time: data.booking_time + ':00',
      service_type: data.service_type,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone.replace(/\s+/g, ''),
      customer_email: data.customer_email || null,
      vehicle_make: data.vehicle_make,
      vehicle_model: data.vehicle_model,
      vehicle_reg: data.vehicle_reg.toUpperCase(),
      location_address: data.location_address,
      location_postcode: data.location_postcode.toUpperCase(),
      issue_description: data.issue_description,
      notes: data.notes || null,
      status: 'confirmed',
      estimated_duration: 90
    };

    // Check availability in tenant schema
    const availabilityCheck = await tenantQuery(
      tenant,
      `SELECT * FROM check_availability($1::DATE, $2::TIME, $3)`,
      [bookingData.booking_date, bookingData.booking_time, bookingData.estimated_duration]
    );

    if (!availabilityCheck[0]?.available) {
      return NextResponse.json(
        { success: false, error: 'Time slot unavailable' },
        { status: 400 }
      );
    }

    // Insert booking in tenant schema
    const result = await tenantMutate(
      tenant,
      `INSERT INTO bookings (
        booked_by, booking_date, booking_time, service_type,
        customer_name, customer_phone, customer_email,
        vehicle_make, vehicle_model, vehicle_reg,
        location_address, location_postcode, issue_description,
        notes, status, estimated_duration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        bookingData.booked_by, bookingData.booking_date, bookingData.booking_time,
        bookingData.service_type, bookingData.customer_name, bookingData.customer_phone,
        bookingData.customer_email, bookingData.vehicle_make, bookingData.vehicle_model,
        bookingData.vehicle_reg, bookingData.location_address, bookingData.location_postcode,
        bookingData.issue_description, bookingData.notes, bookingData.status,
        bookingData.estimated_duration
      ]
    );

    // Send Telegram notification (non-blocking)
    sendTelegramNotification(bookingData).catch(err =>
      console.error('Telegram notification failed:', err)
    );

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed!',
      id: result.rows[0].id
    });

  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
