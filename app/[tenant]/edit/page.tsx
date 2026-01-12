'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Booking } from '@/lib/types';
import { useTenant, useTenantPath, useBranding } from '@/lib/tenant/TenantProvider';
import { colors, shadows } from '@/lib/theme';

function EditBookingContent() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const branding = useBranding();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    service_type: '',
    booking_date: '',
    booking_time: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    vehicle_reg: '',
    vehicle_make: '',
    vehicle_model: '',
    location_address: '',
    location_postcode: '',
    issue_description: '',
    notes: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('bd_logged_in');
    if (!token) {
      router.push(paths.welcome);
      return;
    }

    if (!bookingId) {
      router.push(paths.dashboard);
      return;
    }

    fetchBooking();
  }, [router, bookingId, paths.welcome, paths.dashboard]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/autow/booking/get?id=${bookingId}`, {
        headers: {
          'X-Tenant-Slug': tenant.slug,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);

        setFormData({
          service_type: data.booking.service_type,
          booking_date: data.booking.booking_date.split('T')[0],
          booking_time: data.booking.booking_time.substring(0, 5),
          customer_name: data.booking.customer_name,
          customer_phone: data.booking.customer_phone,
          customer_email: data.booking.customer_email || '',
          vehicle_reg: data.booking.vehicle_reg,
          vehicle_make: data.booking.vehicle_make,
          vehicle_model: data.booking.vehicle_model,
          location_address: data.booking.location_address,
          location_postcode: data.booking.location_postcode,
          issue_description: data.booking.issue_description,
          notes: data.booking.notes || '',
        });

        setLoading(false);
      } else {
        router.push(paths.dashboard);
      }
    } catch (err) {
      console.error('Failed to fetch booking:', err);
      router.push(paths.dashboard);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/autow/booking/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({
          id: bookingId,
          calendar_event_id: booking?.calendar_event_id,
          ...formData,
          booking_time: formData.booking_time + ':00',
        }),
      });

      if (response.ok) {
        setSuccessMessage('✓ Booking updated successfully!');
        setTimeout(() => {
          router.push(paths.dashboard);
        }, 1000);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update booking');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ color: colors.primary, fontSize: '24px', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={styles.container}>
        <div style={{ color: colors.error, fontSize: '24px', textAlign: 'center' }}>Booking not found</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          {branding.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={branding.businessName}
              style={styles.logo}
            />
          ) : (
            <div style={styles.logoPlaceholder}>
              {branding.businessName?.charAt(0) || 'B'}
            </div>
          )}
          <h1 style={styles.title}>Edit Booking</h1>
          <p style={styles.subtitle}>Booking #{booking.id}</p>
        </div>

        {successMessage && (
          <div style={styles.successMessage}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Service Type *</label>
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="Mobile Mechanic">Mobile Mechanic</option>
              <option value="Garage Service">Garage Service</option>
              <option value="Vehicle Recovery">Vehicle Recovery</option>
              <option value="ECU Remapping">ECU Remapping</option>
            </select>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Booking Date *</label>
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Booking Time *</label>
              <input
                type="time"
                name="booking_time"
                value={formData.booking_time}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Customer Name *</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              placeholder="John Smith"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number *</label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              required
              placeholder="07123456789"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="customer@email.com"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Vehicle Registration *</label>
            <input
              type="text"
              name="vehicle_reg"
              value={formData.vehicle_reg}
              onChange={handleChange}
              required
              placeholder="AB12 CDE"
              style={{ ...styles.input, textTransform: 'uppercase' }}
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Vehicle Make *</label>
              <input
                type="text"
                name="vehicle_make"
                value={formData.vehicle_make}
                onChange={handleChange}
                required
                placeholder="Ford"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Vehicle Model *</label>
              <input
                type="text"
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                required
                placeholder="Focus"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location/Address *</label>
            <textarea
              name="location_address"
              value={formData.location_address}
              onChange={handleChange}
              required
              rows={2}
              placeholder="Street address"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Postcode *</label>
            <input
              type="text"
              name="location_postcode"
              value={formData.location_postcode}
              onChange={handleChange}
              required
              placeholder="SW1A 1AA"
              style={{ ...styles.input, textTransform: 'uppercase' }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Issue Description *</label>
            <textarea
              name="issue_description"
              value={formData.issue_description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe the issue"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Special Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Additional notes"
              style={styles.textarea}
            />
          </div>

          <div style={styles.buttons}>
            <button
              type="submit"
              style={{
                ...styles.btnSave,
                ...(submitting ? styles.btnDisabled : {})
              }}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push(paths.dashboard)}
              style={styles.btnCancel}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: colors.background,
    minHeight: '100vh',
    padding: '20px',
  },
  formContainer: {
    maxWidth: '700px',
    margin: '0 auto',
    background: colors.cardBackground,
    borderRadius: '24px',
    padding: '40px',
    boxShadow: shadows.card,
    border: `1px solid ${colors.borderLight}`,
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  logo: {
    width: '60px',
    height: '60px',
    margin: '0 auto 20px',
    borderRadius: '12px',
    display: 'block',
    objectFit: 'contain' as const,
  },
  logoPlaceholder: {
    width: '60px',
    height: '60px',
    margin: '0 auto 20px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '700' as const,
    color: '#fff',
  },
  title: {
    color: colors.textHeading,
    fontSize: '28px',
    marginBottom: '5px',
    margin: '0 0 5px 0',
    fontWeight: '700' as const,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: '14px',
    margin: '0',
  },
  successMessage: {
    background: `linear-gradient(135deg, ${colors.success} 0%, #059669 100%)`,
    color: '#fff',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontWeight: '600' as const,
    boxShadow: `0 4px 16px rgba(16, 185, 129, 0.4)`,
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    display: 'block',
    fontWeight: '600' as const,
    marginBottom: '8px',
    color: colors.textHeading,
    fontSize: '13px',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '14px',
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    transition: 'all 0.3s',
    background: 'rgba(255, 255, 255, 0.9)',
    color: colors.textPrimary,
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '14px',
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.9)',
    color: colors.textPrimary,
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    transition: 'all 0.3s',
    background: 'rgba(255, 255, 255, 0.9)',
    color: colors.textPrimary,
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  buttons: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  btnSave: {
    flex: 1,
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700' as const,
    cursor: 'pointer',
    transition: 'all 0.3s',
    letterSpacing: '0.5px',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    color: '#fff',
    boxShadow: shadows.button,
  },
  btnCancel: {
    flex: 1,
    padding: '16px',
    border: `2px solid rgba(239, 68, 68, 0.3)`,
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700' as const,
    cursor: 'pointer',
    background: 'rgba(239, 68, 68, 0.1)',
    color: colors.error,
    transition: 'all 0.3s',
  },
  btnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
};

export default function EditBookingPage() {
  return (
    <Suspense fallback={
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: colors.background,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{ color: colors.primary, fontSize: '24px', textAlign: 'center' }}>Loading...</div>
      </div>
    }>
      <EditBookingContent />
    </Suspense>
  );
}
