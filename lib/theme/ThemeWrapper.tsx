'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';

/**
 * Client-side wrapper for ThemeProvider
 * Used in server component layouts
 */
export function ThemeWrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
