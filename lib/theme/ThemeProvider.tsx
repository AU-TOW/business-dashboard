'use client';

import { useEffect, createContext, useContext, ReactNode } from 'react';
import { useTenant } from '@/lib/tenant/TenantProvider';
import { canAccessFeature, SubscriptionTier, TradeType } from '@/lib/features';

const DEFAULT_PRIMARY_COLOR = '#3B82F6';
const DEFAULT_PRIMARY_RGB = '59, 130, 246';

interface ThemeContextValue {
  primaryColor: string;
  primaryRgb: string;
  canCustomize: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  primaryColor: DEFAULT_PRIMARY_COLOR,
  primaryRgb: DEFAULT_PRIMARY_RGB,
  canCustomize: false,
});

/**
 * Convert hex color to RGB string for use in rgba()
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return DEFAULT_PRIMARY_RGB;
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/**
 * Lighten a hex color by a percentage
 */
function lightenColor(hex: string, percent: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  r = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  r = Math.max(0, Math.round(r * (1 - percent / 100)));
  g = Math.max(0, Math.round(g * (1 - percent / 100)));
  b = Math.max(0, Math.round(b * (1 - percent / 100)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const tenant = useTenant();

  const tier = (tenant.subscriptionTier || 'trial') as SubscriptionTier;
  const trade = (tenant.tradeType || 'general') as TradeType;
  const canCustomize = canAccessFeature('customBranding', tier, trade);

  // Determine the primary color to use
  // If tier can customize, use tenant's color; otherwise use default
  const primaryColor = canCustomize && tenant.primaryColor
    ? tenant.primaryColor
    : DEFAULT_PRIMARY_COLOR;

  const primaryRgb = hexToRgb(primaryColor);
  const primaryLight = lightenColor(primaryColor, 15);
  const primaryDark = darkenColor(primaryColor, 15);

  useEffect(() => {
    // Set CSS custom properties on document root
    const root = document.documentElement;

    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--primary-rgb', primaryRgb);
    root.style.setProperty('--primary-light', primaryLight);
    root.style.setProperty('--primary-dark', primaryDark);

    // Cleanup on unmount (reset to defaults)
    return () => {
      root.style.setProperty('--primary-color', DEFAULT_PRIMARY_COLOR);
      root.style.setProperty('--primary-rgb', DEFAULT_PRIMARY_RGB);
      root.style.setProperty('--primary-light', lightenColor(DEFAULT_PRIMARY_COLOR, 15));
      root.style.setProperty('--primary-dark', darkenColor(DEFAULT_PRIMARY_COLOR, 15));
    };
  }, [primaryColor, primaryRgb, primaryLight, primaryDark]);

  return (
    <ThemeContext.Provider value={{ primaryColor, primaryRgb, canCustomize }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme values
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/**
 * Hook to get CSS variable references for inline styles
 * Returns style objects that use CSS variables
 */
export function useThemeStyles() {
  return {
    // Primary button style
    primaryButton: {
      background: 'var(--primary-color)',
      color: '#fff',
    },
    // Primary button with gradient
    primaryButtonGradient: {
      background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
      color: '#fff',
    },
    // Primary text color
    primaryText: {
      color: 'var(--primary-color)',
    },
    // Primary border
    primaryBorder: {
      borderColor: 'var(--primary-color)',
    },
    // Light primary background (for cards, highlights)
    primaryBgLight: {
      backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
    },
    // Primary shadow
    primaryShadow: {
      boxShadow: '0 4px 16px rgba(var(--primary-rgb), 0.15)',
    },
  };
}
