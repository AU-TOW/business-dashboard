'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant, useTenantPath, useBranding } from '@/lib/tenant/TenantProvider';
import { canAccessFeature, getUpgradeTierForFeature, getTierDisplayName, SubscriptionTier, TradeType } from '@/lib/features';
import { colors, shadows, animations } from '@/lib/theme';

export default function WelcomePage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const branding = useBranding();

  // Get subscription tier and trade type from tenant context
  const tier = (tenant.subscriptionTier || 'trial') as SubscriptionTier;
  const trade = (tenant.tradeType || 'general') as TradeType;

  // Check feature access
  const hasReceipts = canAccessFeature('receipts', tier, trade);
  const hasDamageAssessments = canAccessFeature('damageAssessments', tier, trade);
  const hasSmartJotter = canAccessFeature('smartJotter', tier, trade);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bd_logged_in');
    if (!token) {
      // For now, just show the page - auth will be handled in Phase 3
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('bd_logged_in');
    localStorage.removeItem('bd_tenant');
    router.push('/');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading...</p>
        </div>
        <style>{animations}</style>
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

          {/* Damage Assessments - only for car_mechanic trade */}
          {trade === 'car_mechanic' && (
            hasDamageAssessments ? (
              <button
                onClick={() => router.push(paths.damageAssessments)}
                style={styles.optionCard}
              >
                <div style={styles.optionIcon}>🚗</div>
                <h2 style={styles.optionTitle}>Damage Assessments</h2>
                <p style={styles.optionDescription}>Document vehicle damage</p>
              </button>
            ) : (
              <button
                style={styles.lockedCard}
                disabled
              >
                <div style={styles.upgradeBadge}>Upgrade to {getTierDisplayName(getUpgradeTierForFeature('damageAssessments') || 'pro')}</div>
                <div style={styles.optionIcon}>🚗</div>
                <h2 style={styles.optionTitle}>Damage Assessments</h2>
                <p style={styles.optionDescription}>Document vehicle damage</p>
              </button>
            )
          )}

          {/* Smart Jotter */}
          {hasSmartJotter ? (
            <button
              onClick={() => router.push(paths.jotter)}
              style={{...styles.optionCard, borderColor: 'rgba(156, 39, 176, 0.4)'}}
            >
              <div style={styles.optionIcon}>✍️</div>
              <h2 style={styles.optionTitle}>Smart Jotter</h2>
              <p style={styles.optionDescription}>Handwriting to booking data</p>
            </button>
          ) : (
            <button
              style={styles.lockedCard}
              disabled
            >
              <div style={styles.upgradeBadge}>Upgrade to {getTierDisplayName(getUpgradeTierForFeature('smartJotter') || 'starter')}</div>
              <div style={styles.optionIcon}>✍️</div>
              <h2 style={styles.optionTitle}>Smart Jotter</h2>
              <p style={styles.optionDescription}>Handwriting to booking data</p>
            </button>
          )}

          {/* Jotter Notes - always available if Smart Jotter is */}
          {hasSmartJotter && (
            <button
              onClick={() => router.push(paths.notes)}
              style={{...styles.optionCard, borderColor: 'rgba(156, 39, 176, 0.4)'}}
            >
              <div style={styles.optionIcon}>📝</div>
              <h2 style={styles.optionTitle}>Jotter Notes</h2>
              <p style={styles.optionDescription}>View and manage saved notes</p>
            </button>
          )}

          {/* Receipts */}
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
              style={styles.lockedCard}
              disabled
            >
              <div style={styles.upgradeBadge}>Upgrade to {getTierDisplayName(getUpgradeTierForFeature('receipts') || 'business')}</div>
              <div style={styles.optionIcon}>🧾</div>
              <h2 style={styles.optionTitle}>Receipts</h2>
              <p style={styles.optionDescription}>Upload and manage receipts</p>
            </button>
          )}

          {/* Settings */}
          <button
            onClick={() => router.push(paths.settings)}
            style={{...styles.optionCard, borderColor: 'rgba(107, 114, 128, 0.3)'}}
          >
            <div style={styles.optionIcon}>⚙️</div>
            <h2 style={styles.optionTitle}>Settings</h2>
            <p style={styles.optionDescription}>Business details & branding</p>
          </button>
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
    background: colors.background,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loadingBox: {
    textAlign: 'center' as const,
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${colors.borderLight}`,
    borderTop: `4px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: '16px',
    margin: '0',
  },
  welcomeBox: {
    maxWidth: '900px',
    width: '100%',
    background: colors.cardBackground,
    backdropFilter: 'blur(20px)',
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
    width: '80px',
    height: '80px',
    margin: '0 auto 20px',
    borderRadius: '16px',
    display: 'block',
    objectFit: 'contain' as const,
  },
  title: {
    color: colors.textHeading,
    fontSize: '32px',
    marginBottom: '5px',
    margin: '0 0 5px 0',
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
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
    border: `2px solid ${colors.border}`,
    borderRadius: '20px',
    padding: '40px 10px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: shadows.small,
  },
  lockedCard: {
    background: 'rgba(200, 200, 200, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '2px dashed rgba(128, 128, 128, 0.3)',
    borderRadius: '20px',
    padding: '40px 10px',
    textAlign: 'center' as const,
    cursor: 'not-allowed',
    opacity: 0.6,
    position: 'relative' as const,
  },
  upgradeBadge: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 'bold' as const,
    padding: '4px 10px',
    borderRadius: '12px',
    textTransform: 'uppercase' as const,
  },
  optionIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  optionTitle: {
    color: colors.textHeading,
    fontSize: '24px',
    marginBottom: '10px',
    margin: '0 0 10px 0',
    fontWeight: '600',
  },
  optionDescription: {
    color: colors.textSecondary,
    fontSize: '14px',
    margin: '0',
  },
  logoutButton: {
    width: '100%',
    padding: '14px',
    border: `2px solid rgba(239, 68, 68, 0.3)`,
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700' as const,
    cursor: 'pointer',
    background: 'rgba(239, 68, 68, 0.1)',
    color: colors.error,
    transition: 'all 0.3s',
  },
};
