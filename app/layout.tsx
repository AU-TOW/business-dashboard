import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Enable safe-area-inset for notched devices
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0a2540' },
    { media: '(prefers-color-scheme: dark)', color: '#0a2540' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://business-dashboard.autow-services.co.uk'),
  title: {
    default: 'Business Dashboard - Manage Your Trade Business',
    template: '%s | Business Dashboard',
  },
  description: 'All-in-one dashboard for tradespeople. Bookings, estimates, invoices, receipts with Telegram notifications. Built for UK mechanics, plumbers, electricians, and builders.',
  keywords: ['trade business software', 'invoice software UK', 'booking system tradespeople', 'telegram business notifications'],
  authors: [{ name: 'Business Dashboard' }],
  creator: 'Business Dashboard',
  publisher: 'Business Dashboard',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  // Apple Web App Configuration
  appleWebApp: {
    capable: true,
    title: 'Business Dashboard',
    statusBarStyle: 'black-translucent',
    startupImage: [
      {
        url: '/splash/apple-splash-2048-2732.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash/apple-splash-1668-2388.png',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash/apple-splash-1536-2048.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash/apple-splash-1125-2436.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/splash/apple-splash-1242-2688.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/splash/apple-splash-828-1792.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash/apple-splash-1170-2532.png',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/splash/apple-splash-1179-2556.png',
        media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/splash/apple-splash-1290-2796.png',
        media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  // Mobile web app manifest
  manifest: '/manifest.json',
  // Other mobile settings
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#0a2540',
    'msapplication-tap-highlight': 'no',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/',
    siteName: 'Business Dashboard',
    title: 'Business Dashboard - Manage Your Trade Business',
    description: 'All-in-one dashboard for tradespeople. Bookings, estimates, invoices, receipts.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Business Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Dashboard',
    description: 'All-in-one dashboard for UK tradespeople',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon-152.png', sizes: '152x152' },
      { url: '/apple-touch-icon-180.png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
