'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <span style={styles.badge}>About Us</span>
          <h1 style={styles.heroTitle}>Built by Tradespeople,<br />For Tradespeople</h1>
          <p style={styles.heroSubtitle}>
            We understand the challenges of running a trade business because we've lived them.
            Business Dashboard was born from real frustration with paperwork, missed payments,
            and lost receipts.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.storyGrid}>
            <div style={styles.storyContent}>
              <h2 style={styles.sectionTitle}>Our Story</h2>
              <p style={styles.paragraph}>
                Business Dashboard started in 2024 when our founder, a former electrician with
                15 years in the trade, got fed up with spending evenings buried in paperwork
                instead of with his family.
              </p>
              <p style={styles.paragraph}>
                After trying every app on the market and finding them either too complicated,
                too expensive, or designed for big corporations, he decided to build something
                different — a tool made specifically for UK tradespeople.
              </p>
              <p style={styles.paragraph}>
                Today, Business Dashboard helps hundreds of mechanics, plumbers, electricians,
                and builders across the UK manage their businesses more efficiently, get paid
                faster, and reclaim their evenings.
              </p>
            </div>
            <div style={styles.storyCard}>
              <div style={styles.storyCardGlow}></div>
              <div style={styles.statGrid}>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>500+</span>
                  <span style={styles.statLabel}>Active Users</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>£2M+</span>
                  <span style={styles.statLabel}>Invoices Processed</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>50K+</span>
                  <span style={styles.statLabel}>Receipts Scanned</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>4.8★</span>
                  <span style={styles.statLabel}>User Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitleCentered}>What We Believe</h2>
          <div style={styles.valuesGrid}>
            <div style={styles.valueCard}>
              <div style={styles.valueIcon}>🎯</div>
              <h3 style={styles.valueTitle}>Simplicity First</h3>
              <p style={styles.valueText}>
                No bloated features or confusing menus. Every tool we build must be
                usable on a building site with dirty hands.
              </p>
            </div>
            <div style={styles.valueCard}>
              <div style={styles.valueIcon}>🤝</div>
              <h3 style={styles.valueTitle}>Fair Pricing</h3>
              <p style={styles.valueText}>
                Transparent pricing that makes sense for small businesses. No hidden
                fees, no surprises, no contracts.
              </p>
            </div>
            <div style={styles.valueCard}>
              <div style={styles.valueIcon}>🇬🇧</div>
              <h3 style={styles.valueTitle}>UK Focused</h3>
              <p style={styles.valueText}>
                Built for UK tax requirements, UK bank formats, and UK business
                practices. We speak your language.
              </p>
            </div>
            <div style={styles.valueCard}>
              <div style={styles.valueIcon}>💬</div>
              <h3 style={styles.valueTitle}>Real Support</h3>
              <p style={styles.valueText}>
                When you need help, you talk to real people who understand the
                trade industry — not bots or scripts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitleCentered}>The Team</h2>
          <p style={styles.teamIntro}>
            We're a small, dedicated team based in the UK. Every feature we build
            comes from real conversations with tradespeople.
          </p>
          <div style={styles.teamGrid}>
            <div style={styles.teamCard}>
              <div style={styles.teamAvatar}>👨‍🔧</div>
              <h3 style={styles.teamName}>James Mitchell</h3>
              <p style={styles.teamRole}>Founder & CEO</p>
              <p style={styles.teamBio}>Former electrician, 15 years in the trade</p>
            </div>
            <div style={styles.teamCard}>
              <div style={styles.teamAvatar}>👩‍💻</div>
              <h3 style={styles.teamName}>Sarah Chen</h3>
              <p style={styles.teamRole}>Head of Product</p>
              <p style={styles.teamBio}>Building software that actually helps people</p>
            </div>
            <div style={styles.teamCard}>
              <div style={styles.teamAvatar}>👨‍💼</div>
              <h3 style={styles.teamName}>David Thompson</h3>
              <p style={styles.teamRole}>Customer Success</p>
              <p style={styles.teamBio}>Here to make sure you succeed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div style={styles.ctaGlow}></div>
          <h2 style={styles.ctaTitle}>Ready to Simplify Your Business?</h2>
          <p style={styles.ctaText}>
            Join hundreds of UK tradespeople who've taken back control of their admin.
          </p>
          <Link href="/signup" style={styles.ctaButton}>
            Start Your Free Trial
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
  },
  hero: {
    padding: '80px 20px',
    textAlign: 'center',
  },
  heroInner: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '100px',
    padding: '8px 20px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '24px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 20px 0',
    fontFamily: '"Space Grotesk", sans-serif',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.7,
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  section: {
    padding: '60px 20px',
  },
  sectionInner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 24px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  sectionTitleCentered: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 40px 0',
    fontFamily: '"Space Grotesk", sans-serif',
    textAlign: 'center',
  },
  storyGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },
  storyContent: {},
  paragraph: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.8,
    margin: '0 0 20px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  storyCard: {
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  storyCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.5), transparent)',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  stat: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '36px',
    fontWeight: 700,
    color: '#ffffff',
    fontFamily: '"Space Grotesk", sans-serif',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: '"Outfit", sans-serif',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  valueCard: {
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px 24px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    textAlign: 'center',
  },
  valueIcon: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  valueTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  valueText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.6,
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  teamIntro: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 40px',
    fontFamily: '"Outfit", sans-serif',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  teamCard: {
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    textAlign: 'center',
  },
  teamAvatar: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  teamName: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 4px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  teamRole: {
    fontSize: '14px',
    color: 'rgba(100, 180, 255, 0.8)',
    margin: '0 0 8px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  teamBio: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  ctaSection: {
    padding: '60px 20px 80px',
  },
  ctaCard: {
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '48px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    boxShadow: '0 0 40px rgba(100, 180, 255, 0.1)',
  },
  ctaGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.6), transparent)',
  },
  ctaTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  ctaText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0 0 28px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
};
