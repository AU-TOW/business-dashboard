import type { Metadata } from 'next';
import PricingContent from './PricingContent';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Business Dashboard. Plans from £12/month. 7-day free trial, no credit card required.',
  openGraph: {
    title: 'Pricing | Business Dashboard',
    description: 'Simple, transparent pricing for Business Dashboard. Plans from £12/month.',
  },
};

// JSON-LD structured data for pricing
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Business Dashboard',
  description: 'All-in-one dashboard for tradespeople. Manage bookings, estimates, invoices, and receipts.',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '12',
    highPrice: '99',
    priceCurrency: 'GBP',
    offerCount: 4,
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '12',
        priceCurrency: 'GBP',
        description: '10 bookings/month, 1 Telegram bot, basic branding',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '29',
        priceCurrency: 'GBP',
        description: 'Unlimited bookings, rich notifications, enhanced branding',
      },
      {
        '@type': 'Offer',
        name: 'Business',
        price: '59',
        priceCurrency: 'GBP',
        description: '3 team members, 3 Telegram bots, receipt management, custom colors',
      },
      {
        '@type': 'Offer',
        name: 'Enterprise',
        price: '99',
        priceCurrency: 'GBP',
        description: 'Unlimited team members, API access, custom domain',
      },
    ],
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingContent />
    </>
  );
}
