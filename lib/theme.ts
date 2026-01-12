/**
 * Business Dashboard Theme
 * Consistent blue/white glassmorphism theme for all pages
 */

export const colors = {
  // Primary blue palette
  primary: '#3b82f6',
  primaryDark: '#1e40af',
  primaryLight: '#60a5fa',
  primaryRgb: '59, 130, 246',

  // Backgrounds
  background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 50%, #f5f5f5 100%)',
  cardBackground: 'rgba(255, 255, 255, 0.85)',
  cardBackgroundSolid: '#ffffff',

  // Text colors
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textHeading: '#1e40af',

  // Status colors
  success: '#10b981',
  successLight: 'rgba(16, 185, 129, 0.1)',
  warning: '#f59e0b',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  error: '#ef4444',
  errorLight: 'rgba(239, 68, 68, 0.1)',
  info: '#3b82f6',
  infoLight: 'rgba(59, 130, 246, 0.1)',

  // Borders
  border: 'rgba(59, 130, 246, 0.2)',
  borderLight: 'rgba(59, 130, 246, 0.1)',
};

export const shadows = {
  card: '0 25px 50px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
  cardHover: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
  button: '0 4px 16px rgba(59, 130, 246, 0.4)',
  small: '0 4px 16px rgba(59, 130, 246, 0.08)',
};

// Common styles that can be spread into component styles
export const baseStyles: { [key: string]: React.CSSProperties } = {
  // Page container
  pageContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: colors.background,
    minHeight: '100vh',
    padding: '20px',
  },

  // Card/Box container
  card: {
    background: colors.cardBackground,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: shadows.card,
    border: '1px solid rgba(255, 255, 255, 0.8)',
  },

  // Page header
  pageHeader: {
    background: colors.cardBackground,
    backdropFilter: 'blur(20px)',
    padding: '24px 32px',
    borderRadius: '20px',
    marginBottom: '24px',
    boxShadow: shadows.small,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '16px',
    border: `1px solid ${colors.borderLight}`,
  },

  // Page title
  pageTitle: {
    color: colors.textHeading,
    fontSize: '28px',
    fontWeight: '700',
    margin: '0',
  },

  // Subtitle
  subtitle: {
    color: colors.textSecondary,
    fontSize: '14px',
    margin: '4px 0 0 0',
  },

  // Primary button
  primaryButton: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    border: 'none',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: shadows.button,
    transition: 'all 0.3s',
  },

  // Secondary button
  secondaryButton: {
    background: 'transparent',
    border: `2px solid ${colors.border}`,
    color: colors.primary,
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },

  // Ghost button (subtle)
  ghostButton: {
    background: `rgba(59, 130, 246, 0.1)`,
    border: `2px solid ${colors.border}`,
    color: colors.primary,
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },

  // Input field
  input: {
    width: '100%',
    padding: '14px 16px',
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    background: 'rgba(255, 255, 255, 0.9)',
    color: colors.textPrimary,
    transition: 'all 0.3s',
    boxSizing: 'border-box' as const,
    outline: 'none',
  },

  // Label
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '8px',
    color: colors.textHeading,
    fontSize: '14px',
  },

  // Stat card
  statCard: {
    background: colors.cardBackground,
    backdropFilter: 'blur(10px)',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: shadows.small,
    border: `1px solid ${colors.borderLight}`,
    textAlign: 'center' as const,
  },

  // Stat number
  statNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '8px',
  },

  // Stat label
  statLabel: {
    color: colors.textSecondary,
    fontSize: '13px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },

  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    background: colors.cardBackgroundSolid,
    borderRadius: '16px',
    overflow: 'hidden',
  },

  // Table header
  tableHeader: {
    background: `rgba(59, 130, 246, 0.05)`,
    color: colors.textHeading,
    fontWeight: '600',
    fontSize: '13px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    padding: '16px',
    textAlign: 'left' as const,
    borderBottom: `2px solid ${colors.borderLight}`,
  },

  // Table cell
  tableCell: {
    padding: '16px',
    borderBottom: `1px solid ${colors.borderLight}`,
    color: colors.textPrimary,
    fontSize: '14px',
  },

  // Empty state
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: colors.textSecondary,
    fontSize: '16px',
  },

  // Loading state
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: colors.background,
  },

  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${colors.borderLight}`,
    borderTop: `4px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  // Link
  link: {
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '500',
  },

  // Badge/Tag
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },

  badgeSuccess: {
    background: colors.successLight,
    color: colors.success,
  },

  badgeWarning: {
    background: colors.warningLight,
    color: colors.warning,
  },

  badgeError: {
    background: colors.errorLight,
    color: colors.error,
  },

  badgeInfo: {
    background: colors.infoLight,
    color: colors.info,
  },
};

// CSS keyframes for animations (to be included in a style tag)
export const animations = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
