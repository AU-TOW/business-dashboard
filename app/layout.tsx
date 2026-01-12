import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', // Enable safe-area-inset for notched devices
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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
