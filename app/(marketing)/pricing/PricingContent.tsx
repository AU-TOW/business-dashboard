'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PricingContent() {
  return (
    <div style={styles.container}>
      {/* Header */}
      <section style={styles.header}>
        <h1 style={styles.title}>Simple, Transparent Pricing</h1>
        <p style={styles.subtitle}>
          Start with a 7-day free trial. No credit card required.
        </p>
      </section>

      {/* Pricing Tiers */}
      <section style={styles.tiersSection}>
        <div style={styles.tiersGrid}>
          <PricingCard
            name="Starter"
            price="12"
            popular={false}
            features={[
              '10 bookings/month',
              '1 Telegram bot',
              'Basic branding (logo + name)',
              'Email support',
            ]}
            cta="Start Free Trial"
            ctaLink="/signup"
          />
          <PricingCard
            name="Pro"
            price="29"
            popular={true}
            features={[
              'Unlimited bookings',
              '1 Telegram bot with rich notifications',
              'Enhanced branding',
              'Priority email support',
            ]}
            cta="Start Free Trial"
            ctaLink="/signup"
          />
          <PricingCard
            name="Business"
            price="59"
            popular={false}
            features={[
              'Everything in Pro',
              '3 team members',
              '3 Telegram bots',
              'Receipt management',
              'Custom colors',
            ]}
            cta="Start Free Trial"
            ctaLink="/signup"
          />
          <PricingCard
            name="Enterprise"
            price="99"
            popular={false}
            features={[
              'Everything in Business',
              'Unlimited team members',
              'Unlimited Telegram bots',
              'API access',
              'Priority support',
              'Custom domain option',
            ]}
            cta="Contact Us"
            ctaLink="/signup"
          />
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section style={styles.comparisonSection}>
        <h2 style={styles.sectionTitle}>Feature Comparison</h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Feature</th>
                <th style={styles.th}>Starter</th>
                <th style={styles.thPopular}>Pro</th>
                <th style={styles.th}>Business</th>
                <th style={styles.th}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                feature="Bookings"
                values={['10/month', 'Unlimited', 'Unlimited', 'Unlimited']}
              />
              <ComparisonRow
                feature="Estimates & Invoices"
                values={['check', 'check', 'check', 'check']}
              />
              <ComparisonRow
                feature="Share Links"
                values={['check', 'check', 'check', 'check']}
              />
              <ComparisonRow
                feature="Telegram Bot"
                values={['1', '1', '3', 'Unlimited']}
              />
              <ComparisonRow
                feature="Telegram Notifications"
                values={['Basic', 'Rich', 'Rich', 'Rich']}
              />
              <ComparisonRow
                feature="Team Members"
                values={['1', '1', '3', 'Unlimited']}
              />
              <ComparisonRow
                feature="Receipt Management"
                values={['dash', 'dash', 'check', 'check']}
              />
              <ComparisonRow
                feature="Smart Jotter (OCR)"
                values={['check', 'check', 'check', 'check']}
              />
              <ComparisonRow
                feature="Custom Branding"
                values={['Basic', 'Enhanced', 'Full', 'White-label']}
              />
              <ComparisonRow
                feature="Custom Colors"
                values={['dash', 'dash', 'check', 'check']}
              />
              <ComparisonRow
                feature="API Access"
                values={['dash', 'dash', 'dash', 'check']}
              />
              <ComparisonRow
                feature="Custom Domain"
                values={['dash', 'dash', 'dash', 'check']}
              />
              <ComparisonRow
                feature="Support"
                values={['Email', 'Priority', 'Priority', 'Dedicated']}
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.faqSection}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqGrid}>
          <FAQItem
            question="What happens after my trial ends?"
            answer="Your account pauses. No charges until you choose a plan. All your data is safely preserved."
          />
          <FAQItem
            question="Can I change plans later?"
            answer="Yes, upgrade or downgrade anytime. Changes apply immediately, and we'll prorate your billing."
          />
          <FAQItem
            question="Do you offer annual billing?"
            answer="Coming soon! Annual plans will include 2 months free. Sign up now and we'll notify you when available."
          />
          <FAQItem
            question="What payment methods do you accept?"
            answer="All major credit/debit cards via Stripe. UK bank transfers available for Enterprise plans."
          />
          <FAQItem
            question="Is there a setup fee?"
            answer="No. Just choose your plan and start using the dashboard. We'll help you get set up for free."
          />
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalCta}>
        <h2 style={styles.ctaTitle}>Ready to streamline your business?</h2>
        <p style={styles.ctaSubtitle}>Start your 7-day free trial today</p>
        <Link href="/signup" style={styles.ctaButton}>
          Get Started Free
        </Link>
      </section>
    </div>
  );
}

function PricingCard({
  name,
  price,
  popular,
  features,
  cta,
  ctaLink,
}: {
  name: string;
  price: string;
  popular: boolean;
  features: string[];
  cta: string;
  ctaLink: string;
}) {
  return (
    <div style={popular ? styles.cardPopular : styles.card}>
      {popular && <div style={styles.popularBadge}>Popular</div>}
      <h3 style={styles.cardName}>{name}</h3>
      <div style={styles.priceWrapper}>
        <span style={styles.currency}>£</span>
        <span style={styles.price}>{price}</span>
        <span style={styles.period}>/mo</span>
      </div>
      <ul style={styles.featureList}>
        {features.map((feature, index) => (
          <li key={index} style={styles.featureItem}>
            <span style={styles.checkIcon}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Link href={ctaLink} style={popular ? styles.ctaPrimary : styles.ctaSecondary}>
        {cta}
      </Link>
    </div>
  );
}

function ComparisonRow({ feature, values }: { feature: string; values: string[] }) {
  const renderValue = (value: string, index: number) => {
    if (value === 'check') {
      return <span style={styles.checkMark}>✓</span>;
    }
    if (value === 'dash') {
      return <span style={styles.dashMark}>—</span>;
    }
    return value;
  };

  return (
    <tr style={styles.tableRow}>
      <td style={styles.tdFeature}>{feature}</td>
      {values.map((value, index) => (
        <td key={index} style={index === 1 ? styles.tdPopular : styles.td}>
          {renderValue(value, index)}
        </td>
      ))}
    </tr>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.faqItem}>
      <button
        style={styles.faqQuestion}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span style={styles.faqIcon}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <p style={styles.faqAnswer}>{answer}</p>}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 50%, #f5f5f5 100%)',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    padding: '60px 24px 40px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '42px',
    fontWeight: 800,
    color: '#1e293b',
    margin: '0 0 16px 0',
  },
  subtitle: {
    fontSize: '20px',
    color: '#64748b',
    margin: 0,
  },
  tiersSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px 60px',
  },
  tiersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px 24px',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  cardPopular: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px 24px',
    border: '2px solid #3B82F6',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transform: 'scale(1.02)',
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #3B82F6, #2563eb)',
    color: '#fff',
    padding: '6px 16px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: 600,
  },
  cardName: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 16px 0',
    textAlign: 'center',
  },
  priceWrapper: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  currency: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#3B82F6',
  },
  price: {
    fontSize: '48px',
    fontWeight: 800,
    color: '#1e293b',
    lineHeight: 1,
  },
  period: {
    fontSize: '16px',
    color: '#64748b',
    marginLeft: '4px',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 24px 0',
    flex: 1,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '14px',
    color: '#475569',
    marginBottom: '12px',
  },
  checkIcon: {
    color: '#3B82F6',
    fontWeight: 700,
    flexShrink: 0,
  },
  ctaPrimary: {
    display: 'block',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #3B82F6, #2563eb)',
    color: '#fff',
    padding: '14px 24px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  ctaSecondary: {
    display: 'block',
    textAlign: 'center',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3B82F6',
    padding: '14px 24px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 600,
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  comparisonSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '40px',
  },
  tableWrapper: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    overflow: 'auto',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '700px',
  },
  tableHeader: {
    background: 'rgba(59, 130, 246, 0.05)',
    position: 'sticky',
    top: 0,
  },
  th: {
    padding: '16px 20px',
    textAlign: 'center',
    fontWeight: 600,
    color: '#1e293b',
    fontSize: '14px',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
  },
  thPopular: {
    padding: '16px 20px',
    textAlign: 'center',
    fontWeight: 600,
    color: '#3B82F6',
    fontSize: '14px',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    background: 'rgba(59, 130, 246, 0.08)',
  },
  tableRow: {
    borderBottom: '1px solid rgba(59, 130, 246, 0.05)',
  },
  tdFeature: {
    padding: '14px 20px',
    fontWeight: 500,
    color: '#1e293b',
    fontSize: '14px',
    textAlign: 'left',
  },
  td: {
    padding: '14px 20px',
    textAlign: 'center',
    color: '#475569',
    fontSize: '14px',
  },
  tdPopular: {
    padding: '14px 20px',
    textAlign: 'center',
    color: '#475569',
    fontSize: '14px',
    background: 'rgba(59, 130, 246, 0.03)',
  },
  checkMark: {
    color: '#3B82F6',
    fontWeight: 700,
    fontSize: '16px',
  },
  dashMark: {
    color: '#cbd5e1',
  },
  faqSection: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '60px 24px',
  },
  faqGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  faqItem: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    overflow: 'hidden',
  },
  faqQuestion: {
    width: '100%',
    padding: '18px 24px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
    textAlign: 'left',
  },
  faqIcon: {
    fontSize: '20px',
    color: '#3B82F6',
    fontWeight: 400,
  },
  faqAnswer: {
    padding: '0 24px 18px',
    margin: 0,
    fontSize: '15px',
    color: '#64748b',
    lineHeight: 1.6,
  },
  finalCta: {
    textAlign: 'center',
    padding: '80px 24px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.1))',
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  ctaSubtitle: {
    fontSize: '18px',
    color: '#64748b',
    margin: '0 0 32px 0',
  },
  ctaButton: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #3B82F6, #2563eb)',
    color: '#fff',
    padding: '16px 40px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 600,
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
  },
};
