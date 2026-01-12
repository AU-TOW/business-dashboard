import Link from 'next/link';

// JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Business Dashboard',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '12',
    highPrice: '99',
    priceCurrency: 'GBP',
    offerCount: 4,
  },
  description: 'All-in-one dashboard for tradespeople. Manage bookings, estimates, invoices, and receipts with Telegram notifications.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '50',
  },
};

export default function LandingPage() {
  return (
    <div style={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Manage Your Trade Business in One Place
          </h1>
          <p style={styles.heroSubtitle}>
            Bookings, estimates, invoices, and receipts - with instant Telegram notifications
          </p>
          <div style={styles.heroCtas}>
            <Link href="/signup" style={styles.primaryCta}>
              Start Free Trial
            </Link>
            <Link href="/pricing" style={styles.secondaryCta}>
              See Pricing
            </Link>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroPlaceholder}>
            <span style={styles.heroPlaceholderIcon}>📊</span>
            <span style={styles.heroPlaceholderText}>Dashboard Preview</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Everything You Need to Run Your Business</h2>
        <div style={styles.featuresGrid}>
          <FeatureCard
            icon="📅"
            title="Bookings"
            description="Schedule appointments with smart availability. Never double-book again."
          />
          <FeatureCard
            icon="📋"
            title="Estimates"
            description="Create professional quotes in seconds. Send shareable links to customers."
          />
          <FeatureCard
            icon="💰"
            title="Invoices"
            description="Bill customers and track payments. Convert estimates to invoices instantly."
          />
          <FeatureCard
            icon="🧾"
            title="Receipts"
            description="Snap photos, auto-extract expenses. Keep track of all your costs."
          />
          <FeatureCard
            icon="📱"
            title="Telegram Alerts"
            description="Instant notifications when customers view documents. Stay informed 24/7."
          />
          <FeatureCard
            icon="🔧"
            title="Multi-Trade"
            description="Customized for mechanics, plumbers, electricians, builders, and more."
          />
        </div>
      </section>

      {/* Trust Section */}
      <section style={styles.trust}>
        <div style={styles.trustBadge}>
          🇬🇧 Built for UK Tradespeople
        </div>
        <p style={styles.trustMessage}>
          7-Day Free Trial - No Card Required
        </p>
        <div style={styles.tradeTypes}>
          <span style={styles.tradeTag}>Car Mechanics</span>
          <span style={styles.tradeTag}>Plumbers</span>
          <span style={styles.tradeTag}>Electricians</span>
          <span style={styles.tradeTag}>Builders</span>
          <span style={styles.tradeTag}>General Trades</span>
        </div>
        <Link href="/signup" style={styles.trustCta}>
          Get Started Free →
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={styles.featureCard}>
      <span style={styles.featureIcon}>{icon}</span>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDescription}>{description}</p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 50%, #f5f5f5 100%)',
    minHeight: '100vh',
  },
  // Hero Section
  hero: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 24px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'center',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 800,
    color: '#1e293b',
    lineHeight: 1.1,
    margin: 0,
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#64748b',
    lineHeight: 1.6,
    margin: 0,
  },
  heroCtas: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  primaryCta: {
    background: 'linear-gradient(135deg, #3B82F6, #2563eb)',
    color: '#fff',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 600,
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  secondaryCta: {
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#3B82F6',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 600,
    border: '2px solid rgba(59, 130, 246, 0.3)',
    transition: 'background 0.2s, border-color 0.2s',
  },
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholder: {
    width: '100%',
    maxWidth: '500px',
    aspectRatio: '4/3',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
  },
  heroPlaceholderIcon: {
    fontSize: '64px',
  },
  heroPlaceholderText: {
    color: '#64748b',
    fontSize: '16px',
    fontWeight: 500,
  },
  // Features Section
  features: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 24px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '48px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  featureIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  featureDescription: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: 1.6,
    margin: 0,
  },
  // Trust Section
  trust: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '80px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  trustBadge: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '12px 24px',
    borderRadius: '100px',
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e40af',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
  },
  trustMessage: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#059669',
    margin: 0,
  },
  tradeTypes: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '12px',
  },
  tradeTag: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3B82F6',
    padding: '8px 16px',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: 500,
  },
  trustCta: {
    color: '#3B82F6',
    fontSize: '18px',
    fontWeight: 600,
    textDecoration: 'none',
    marginTop: '8px',
  },
};
