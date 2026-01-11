'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant, useTenantPath, useBranding, useHasFeature } from '@/lib/tenant/TenantProvider';

export default function WelcomePage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const branding = useBranding();
  const hasReceipts = useHasFeature('receipts');
  const hasDamageAssessments = useHasFeature('damage_assessments');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('autow_token');
    if (!token) {
      // For now, just show the page - auth will be handled in Phase 3
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('autow_token');
    router.push('/');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.welcomeBox} className="welcome-box">
        <div style={styles.header}>
          {branding.logoUrl && (
            <img
              src={branding.logoUrl}
              alt={branding.businessName}
              style={styles.logo}
            />
          )}
          <h1 style={styles.title}>Welcome to {branding.businessName}</h1>
          <p style={styles.subtitle}>Business Management System</p>
        </div>

        <div style={styles.optionsGrid}>
          <button
            onClick={() => router.push(paths.bookings)}
            style={styles.optionCard}
          >
            <div style={styles.optionIcon}>📅</div>
            <h2 style={styles.optionTitle}>New Booking</h2>
            <p style={styles.optionDescription}>Create a new customer booking</p>
          </button>

          <button
            onClick={() => router.push(paths.dashboard)}
            style={styles.optionCard}
          >
            <div style={styles.optionIcon}>📊</div>
            <h2 style={styles.optionTitle}>View Dashboard</h2>
            <p style={styles.optionDescription}>Manage existing bookings</p>
          </button>

          <button
            onClick={() => router.push(paths.estimates)}
            style={styles.optionCard}
          >
            <div style={styles.optionIcon}>📋</div>
            <h2 style={styles.optionTitle}>Estimates</h2>
            <p style={styles.optionDescription}>Create and manage estimates</p>
          </button>

          <button
            onClick={() => router.push(paths.invoices)}
            style={styles.optionCard}
          >
            <div style={styles.optionIcon}>💰</div>
            <h2 style={styles.optionTitle}>Invoices</h2>
            <p style={styles.optionDescription}>Create and manage invoices</p>
          </button>

          {hasDamageAssessments && (
            <button
              onClick={() => router.push(paths.damageAssessments)}
              style={styles.optionCard}
            >
              <div style={styles.optionIcon}>🚗</div>
              <h2 style={styles.optionTitle}>Damage Assessments</h2>
              <p style={styles.optionDescription}>Document vehicle damage</p>
            </button>
          )}

          <button
            onClick={() => router.push(paths.jotter)}
            style={{...styles.optionCard, borderColor: 'rgba(156, 39, 176, 0.4)'}}
          >
            <div style={styles.optionIcon}>✍️</div>
            <h2 style={styles.optionTitle}>Smart Jotter</h2>
            <p style={styles.optionDescription}>Handwriting to booking data</p>
          </button>

          <button
            onClick={() => router.push(paths.notes)}
            style={{...styles.optionCard, borderColor: 'rgba(156, 39, 176, 0.4)'}}
          >
            <div style={styles.optionIcon}>📝</div>
            <h2 style={styles.optionTitle}>Jotter Notes</h2>
            <p style={styles.optionDescription}>View and manage saved notes</p>
          </button>

          {hasReceipts ? (
            <button
              onClick={() => router.push(paths.receipts)}
              style={{...styles.optionCard, borderColor: 'rgba(255, 152, 0, 0.4)'}}
            >
              <div style={styles.optionIcon}>🧾</div>
              <h2 style={styles.optionTitle}>Receipts</h2>
              <p style={styles.optionDescription}>Upload and manage receipts</p>
            </button>
          ) : (
            <button
              style={{...styles.optionCard, borderColor: 'rgba(128, 128, 128, 0.2)', opacity: 0.5, cursor: 'not-allowed'}}
              disabled
            >
              <div style={styles.optionIcon}>🧾</div>
              <h2 style={styles.optionTitle}>Receipts</h2>
              <p style={styles.optionDescription}>Upgrade to Business tier</p>
            </button>
          )}
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Logout
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .welcome-box {
            padding: 20px 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 50%, #f5f5f5 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  welcomeBox: {
    maxWidth: '900px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  logo: {
    width: '180px',
    height: 'auto',
    margin: '0 auto 20px',
    filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.2))',
    display: 'block',
  },
  title: {
    color: '#1e40af',
    fontSize: '32px',
    marginBottom: '5px',
    margin: '0 0 5px 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '16px',
    margin: '0',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '30px',
  },
  optionCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '20px',
    padding: '40px 10px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
  },
  optionIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  optionTitle: {
    color: '#1e40af',
    fontSize: '24px',
    marginBottom: '10px',
    margin: '0 0 10px 0',
  },
  optionDescription: {
    color: '#64748b',
    fontSize: '14px',
    margin: '0',
  },
  logoutButton: {
    width: '100%',
    padding: '14px',
    border: '2px solid rgba(244, 67, 54, 0.2)',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700' as const,
    cursor: 'pointer',
    background: 'rgba(244, 67, 54, 0.1)',
    color: '#f44336',
    transition: 'all 0.3s',
  },
  loadingText: {
    color: '#3b82f6',
    fontSize: '24px',
    textAlign: 'center' as const,
  },
};
