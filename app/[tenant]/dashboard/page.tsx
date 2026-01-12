'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Booking } from '@/lib/types';
import { useTenant, useTenantPath, useBranding } from '@/lib/tenant/TenantProvider';
import { colors, shadows, baseStyles, animations } from '@/lib/theme';

export default function DashboardPage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const branding = useBranding();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ today: 0, pending: 0, completed: 0, total: 0 });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/autow/booking/list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('autow_token')}`,
          'X-Tenant-Slug': tenant.slug,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);

        const today = new Date().toISOString().split('T')[0];
        const todayList = (data.bookings || []).filter((b: Booking) =>
          b.booking_date.split('T')[0] === today
        );
        const upcomingList = (data.bookings || []).filter((b: Booking) =>
          b.booking_date.split('T')[0] !== today
        ).slice(0, 20);

        setTodayBookings(todayList);
        setUpcomingBookings(upcomingList);

        setStats({
          today: todayList.length,
          pending: (data.bookings || []).filter((b: Booking) => b.status === 'confirmed').length,
          completed: (data.bookings || []).filter((b: Booking) => b.status === 'completed').length,
          total: (data.bookings || []).length
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setLoading(false);
    }
  };

  const handleComplete = async (id: number) => {
    if (!confirm('Mark this booking as completed?')) return;

    try {
      const response = await fetch('/api/autow/booking/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('autow_token')}`,
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        fetchBookings();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('DELETE this booking? This cannot be undone!')) return;

    try {
      const response = await fetch('/api/autow/booking/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('autow_token')}`,
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        fetchBookings();
      } else {
        alert('Failed to delete booking');
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <span style={{...styles.badge, ...styles.badgeSuccess}}>Completed</span>;
    }
    if (status === 'cancelled') {
      return <span style={{...styles.badge, ...styles.badgeError}}>Cancelled</span>;
    }
    return <span style={{...styles.badge, ...styles.badgeWarning}}>Pending</span>;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const renderBookingCard = (booking: Booking, isToday = false) => (
    <div key={booking.id} style={{
      ...styles.bookingCard,
      ...(booking.status === 'completed' ? { opacity: 0.7 } : {}),
    }}>
      <div style={styles.bookingHeader}>
        <div>
          <span style={styles.vehicleReg}>{booking.vehicle_reg}</span>
          <span style={styles.vehicleInfo}>{booking.vehicle_make} {booking.vehicle_model}</span>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      <div style={styles.bookingDetails}>
        <div style={styles.detailRow}>
          <span style={styles.detailIcon}>🔧</span>
          <span>{booking.service_type}</span>
        </div>
        {!isToday && (
          <div style={styles.detailRow}>
            <span style={styles.detailIcon}>📅</span>
            <span>{formatDate(booking.booking_date)}</span>
          </div>
        )}
        <div style={styles.detailRow}>
          <span style={styles.detailIcon}>⏰</span>
          <span>{booking.booking_time.substring(0, 5)}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailIcon}>👤</span>
          <span>{booking.customer_name}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailIcon}>📞</span>
          <a href={`tel:${booking.customer_phone}`} style={styles.link}>{booking.customer_phone}</a>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailIcon}>📍</span>
          <span>{booking.location_address}, {booking.location_postcode}</span>
        </div>
        {booking.issue_description && (
          <div style={{...styles.detailRow, marginTop: '12px'}}>
            <span style={styles.detailIcon}>🛠</span>
            <span style={{color: colors.textSecondary}}>{booking.issue_description}</span>
          </div>
        )}
      </div>

      <div style={styles.actionButtons}>
        <button
          onClick={() => router.push(`${paths.estimates}/create?booking_id=${booking.id}`)}
          style={styles.btnEstimate}
        >
          Create Estimate
        </button>
        <button
          onClick={() => router.push(`${paths.path('/edit')}?id=${booking.id}`)}
          style={styles.btnEdit}
        >
          Edit
        </button>
        {booking.status === 'confirmed' && (
          <button onClick={() => handleComplete(booking.id)} style={styles.btnComplete}>
            Complete
          </button>
        )}
        <button onClick={() => handleDelete(booking.id)} style={styles.btnDelete}>
          Delete
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
        <style>{animations}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt={branding.businessName} style={styles.logo} />
          )}
          <div>
            <h1 style={styles.title}>{branding.businessName}</h1>
            <p style={styles.subtitle}>Dashboard</p>
          </div>
        </div>
        <div style={styles.headerButtons}>
          <button onClick={() => router.push(paths.welcome)} style={styles.backBtn}>
            Menu
          </button>
          <button onClick={() => router.push(paths.jotter)} style={styles.navBtn}>
            Jotter
          </button>
          <button onClick={() => router.push(paths.notes)} style={styles.navBtn}>
            Notes
          </button>
          <button onClick={() => router.push(paths.bookings)} style={styles.primaryBtn}>
            + New Booking
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.today}</div>
          <div style={styles.statLabel}>Today's Jobs</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.completed}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total</div>
        </div>
      </div>

      {/* Today's Bookings */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Today's Bookings</h2>
        {todayBookings.length ? (
          <div style={styles.bookingsGrid}>
            {todayBookings.map(b => renderBookingCard(b, true))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📅</div>
            <p>No bookings scheduled for today</p>
          </div>
        )}
      </div>

      {/* Upcoming Bookings */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Upcoming Bookings</h2>
        {upcomingBookings.length ? (
          <div style={styles.bookingsGrid}>
            {upcomingBookings.map(b => renderBookingCard(b))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📆</div>
            <p>No upcoming bookings</p>
          </div>
        )}
      </div>

      <style>{animations}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: colors.background,
    minHeight: '100vh',
    padding: '20px',
  },
  loadingContainer: {
    ...baseStyles.loadingContainer,
  },
  loadingBox: {
    textAlign: 'center' as const,
  },
  spinner: {
    ...baseStyles.loadingSpinner,
    margin: '0 auto 16px',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: '16px',
  },
  header: {
    ...baseStyles.pageHeader,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    objectFit: 'contain' as const,
  },
  title: {
    ...baseStyles.pageTitle,
    fontSize: '24px',
  },
  subtitle: {
    ...baseStyles.subtitle,
  },
  headerButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  backBtn: {
    ...baseStyles.ghostButton,
    padding: '10px 20px',
  },
  navBtn: {
    ...baseStyles.secondaryButton,
    padding: '10px 20px',
  },
  primaryBtn: {
    ...baseStyles.primaryButton,
    padding: '10px 20px',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    ...baseStyles.statCard,
  },
  statNumber: {
    ...baseStyles.statNumber,
    fontSize: '32px',
  },
  statLabel: {
    ...baseStyles.statLabel,
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    color: colors.textHeading,
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
  },
  bookingCard: {
    background: colors.cardBackground,
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: shadows.small,
    border: `1px solid ${colors.borderLight}`,
    borderLeft: `4px solid ${colors.primary}`,
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  vehicleReg: {
    fontSize: '18px',
    fontWeight: '700',
    color: colors.textHeading,
    display: 'block',
    marginBottom: '4px',
  },
  vehicleInfo: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  badge: {
    ...baseStyles.badge,
  },
  badgeSuccess: {
    ...baseStyles.badgeSuccess,
  },
  badgeWarning: {
    ...baseStyles.badgeWarning,
  },
  badgeError: {
    ...baseStyles.badgeError,
  },
  bookingDetails: {
    marginBottom: '16px',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    color: colors.textPrimary,
    fontSize: '14px',
  },
  detailIcon: {
    fontSize: '14px',
    width: '20px',
  },
  link: {
    ...baseStyles.link,
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    paddingTop: '16px',
    borderTop: `1px solid ${colors.borderLight}`,
  },
  btnEstimate: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    background: colors.primary,
    color: 'white',
  },
  btnEdit: {
    padding: '8px 16px',
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    background: 'transparent',
    color: colors.primary,
  },
  btnComplete: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    background: colors.success,
    color: 'white',
  },
  btnDelete: {
    padding: '8px 16px',
    border: `2px solid rgba(239, 68, 68, 0.3)`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    background: 'transparent',
    color: colors.error,
  },
  emptyState: {
    ...baseStyles.emptyState,
    background: colors.cardBackground,
    borderRadius: '16px',
    padding: '40px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
};
