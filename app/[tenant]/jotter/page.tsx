'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SmartJotter from '@/components/smart-jotter/SmartJotter';
import { ParsedBookingData } from '@/types/smart-jotter';
import { useTenantPath, useBranding } from '@/lib/tenant/TenantProvider';
import { colors, shadows, baseStyles, animations } from '@/lib/theme';

export default function SmartJotterPage() {
  const router = useRouter();
  const paths = useTenantPath();
  const branding = useBranding();

  const handleBookingCreate = async (data: ParsedBookingData) => {
    try {
      console.log('Creating booking with data:', data);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleEstimateCreate = async (data: ParsedBookingData) => {
    try {
      console.log('Creating estimate with data:', data);
    } catch (error) {
      console.error('Error creating estimate:', error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header} className="jotter-header">
        <div style={styles.headerLeft} className="header-left">
          {branding.logoUrl && (
            <img
              src={branding.logoUrl}
              alt={branding.businessName}
              style={styles.logo}
              className="jotter-logo"
            />
          )}
          <div style={styles.headerText}>
            <h1 style={styles.title} className="jotter-title">Smart Jotter</h1>
            <p style={styles.subtitle} className="jotter-subtitle">Convert handwritten notes or typed text into booking data</p>
          </div>
        </div>
        <div style={styles.headerButtons}>
          <button onClick={() => router.push(paths.welcome)} style={styles.backBtn}>
            ← Menu
          </button>
          <button onClick={() => router.push(paths.dashboard)} style={styles.dashboardBtn}>
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div style={styles.mainCard}>
        <SmartJotter
          onBookingCreate={handleBookingCreate}
          onEstimateCreate={handleEstimateCreate}
        />
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .jotter-header {
            padding: 20px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .header-left {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }

          .jotter-logo {
            width: 120px !important;
          }

          .jotter-title {
            font-size: 22px !important;
          }

          .jotter-subtitle {
            font-size: 12px !important;
          }
        }
        ${animations}
      `}</style>
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
  header: {
    ...baseStyles.pageHeader,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logo: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    objectFit: 'contain' as const,
  },
  headerText: {},
  title: {
    fontSize: '24px',
    color: colors.textHeading,
    marginBottom: '5px',
    margin: '0 0 5px 0',
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: '14px',
    margin: '0',
  },
  headerButtons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  backBtn: {
    ...baseStyles.ghostButton,
    padding: '12px 24px',
  },
  dashboardBtn: {
    ...baseStyles.primaryButton,
    padding: '12px 24px',
  },
  mainCard: {
    background: colors.cardBackground,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '30px',
    boxShadow: shadows.card,
    border: `1px solid ${colors.borderLight}`,
  },
};
