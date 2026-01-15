'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <span style={styles.badge}>Legal</span>
          <h1 style={styles.heroTitle}>Privacy Policy</h1>
          <p style={styles.heroSubtitle}>
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={styles.section}>
        <div style={styles.contentCard}>
          <div style={styles.contentGlow}></div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>1. Introduction</h2>
            <p style={styles.paragraph}>
              Business Dashboard ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
            <p style={styles.paragraph}>
              We are registered in the United Kingdom and comply with the UK General Data Protection Regulation
              (UK GDPR) and the Data Protection Act 2018.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>2. Information We Collect</h2>
            <h3 style={styles.subTitle}>Personal Information</h3>
            <p style={styles.paragraph}>When you register for an account, we collect:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Name and email address</li>
              <li style={styles.listItem}>Business name and contact details</li>
              <li style={styles.listItem}>Phone number (optional)</li>
              <li style={styles.listItem}>Business address</li>
              <li style={styles.listItem}>Payment information (processed securely via Stripe)</li>
            </ul>

            <h3 style={styles.subTitle}>Business Data</h3>
            <p style={styles.paragraph}>In the course of using our service, you may provide:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Customer contact information</li>
              <li style={styles.listItem}>Invoice and estimate details</li>
              <li style={styles.listItem}>Receipt images and expense data</li>
              <li style={styles.listItem}>Booking and appointment information</li>
            </ul>

            <h3 style={styles.subTitle}>Automatically Collected Information</h3>
            <p style={styles.paragraph}>We automatically collect certain information when you use our service:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>IP address and device information</li>
              <li style={styles.listItem}>Browser type and version</li>
              <li style={styles.listItem}>Usage data and analytics</li>
              <li style={styles.listItem}>Cookies and similar technologies</li>
            </ul>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>3. How We Use Your Information</h2>
            <p style={styles.paragraph}>We use the information we collect to:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Provide, operate, and maintain our service</li>
              <li style={styles.listItem}>Process transactions and send related information</li>
              <li style={styles.listItem}>Send you technical notices and support messages</li>
              <li style={styles.listItem}>Respond to your comments and questions</li>
              <li style={styles.listItem}>Send marketing communications (with your consent)</li>
              <li style={styles.listItem}>Analyse usage patterns to improve our service</li>
              <li style={styles.listItem}>Detect and prevent fraud or abuse</li>
            </ul>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>4. Legal Basis for Processing</h2>
            <p style={styles.paragraph}>Under UK GDPR, we process your data based on:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Contract:</strong> Processing necessary to perform our contract with you</li>
              <li style={styles.listItem}><strong>Legitimate Interests:</strong> Processing necessary for our legitimate business interests</li>
              <li style={styles.listItem}><strong>Consent:</strong> Where you have given explicit consent</li>
              <li style={styles.listItem}><strong>Legal Obligation:</strong> Processing required to comply with law</li>
            </ul>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>5. Data Sharing and Disclosure</h2>
            <p style={styles.paragraph}>We do not sell your personal data. We may share information with:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Service Providers:</strong> Third parties that help us operate our service (e.g., Stripe for payments, AWS for hosting)</li>
              <li style={styles.listItem}><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li style={styles.listItem}><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
            </ul>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>6. Data Security</h2>
            <p style={styles.paragraph}>
              We implement appropriate technical and organisational measures to protect your data:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>256-bit SSL encryption for all data transmission</li>
              <li style={styles.listItem}>Encrypted storage for sensitive data</li>
              <li style={styles.listItem}>Regular security audits and testing</li>
              <li style={styles.listItem}>Access controls and authentication</li>
              <li style={styles.listItem}>Data stored on UK/EU-based servers</li>
            </ul>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>7. Data Retention</h2>
            <p style={styles.paragraph}>
              We retain your personal data for as long as your account is active or as needed to provide you services.
              We retain and use your information as necessary to comply with legal obligations, resolve disputes,
              and enforce our agreements.
            </p>
            <p style={styles.paragraph}>
              When you delete your account, we will delete or anonymise your data within 30 days, unless we are
              legally required to retain it.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>8. Your Rights</h2>
            <p style={styles.paragraph}>Under UK GDPR, you have the right to:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Access:</strong> Request a copy of your personal data</li>
              <li style={styles.listItem}><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li style={styles.listItem}><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li style={styles.listItem}><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li style={styles.listItem}><strong>Restriction:</strong> Request limitation of processing</li>
              <li style={styles.listItem}><strong>Object:</strong> Object to processing based on legitimate interests</li>
              <li style={styles.listItem}><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p style={styles.paragraph}>
              To exercise these rights, please contact us at privacy@businessdashboard.com
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>9. Cookies</h2>
            <p style={styles.paragraph}>
              We use cookies and similar technologies to improve your experience. You can control cookies through
              your browser settings. Essential cookies are required for the service to function.
            </p>
            <div style={styles.cookieTable}>
              <div style={styles.cookieRow}>
                <span style={styles.cookieType}>Essential</span>
                <span style={styles.cookieDesc}>Required for service functionality</span>
              </div>
              <div style={styles.cookieRow}>
                <span style={styles.cookieType}>Analytics</span>
                <span style={styles.cookieDesc}>Help us understand usage patterns</span>
              </div>
              <div style={styles.cookieRow}>
                <span style={styles.cookieType}>Preferences</span>
                <span style={styles.cookieDesc}>Remember your settings and preferences</span>
              </div>
            </div>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>10. International Transfers</h2>
            <p style={styles.paragraph}>
              Your data is primarily stored and processed in the United Kingdom. Where we transfer data outside
              the UK, we ensure appropriate safeguards are in place (such as Standard Contractual Clauses).
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>11. Children's Privacy</h2>
            <p style={styles.paragraph}>
              Our service is not intended for individuals under 18 years of age. We do not knowingly collect
              personal data from children.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>12. Changes to This Policy</h2>
            <p style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting
              the new policy on this page and updating the "Last updated" date. Material changes will be
              communicated via email.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>13. Contact Us</h2>
            <p style={styles.paragraph}>
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div style={styles.contactBox}>
              <p style={styles.contactLine}><strong>Email:</strong> privacy@businessdashboard.com</p>
              <p style={styles.contactLine}><strong>Address:</strong> Business Dashboard Ltd, London, United Kingdom</p>
            </div>
            <p style={styles.paragraph}>
              You also have the right to lodge a complaint with the Information Commissioner's Office (ICO)
              if you believe your data protection rights have been breached.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div style={styles.ctaGlow}></div>
          <h2 style={styles.ctaTitle}>Have Questions?</h2>
          <p style={styles.ctaText}>
            Our team is here to help with any privacy-related concerns.
          </p>
          <Link href="/contact" style={styles.ctaButton}>
            Contact Us
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
    padding: '80px 20px 40px',
    textAlign: 'center',
  },
  heroInner: {
    maxWidth: '700px',
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
    margin: '0 0 16px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  heroSubtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  section: {
    padding: '20px 20px 60px',
  },
  contentCard: {
    position: 'relative',
    maxWidth: '900px',
    margin: '0 auto',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '48px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  contentGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.5), transparent)',
  },
  policySection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 16px 0',
    fontFamily: '"Space Grotesk", sans-serif',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(100, 180, 255, 0.2)',
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'rgba(100, 180, 255, 0.9)',
    margin: '20px 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  paragraph: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.8,
    margin: '0 0 16px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 16px 0',
  },
  listItem: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.8,
    paddingLeft: '24px',
    position: 'relative',
    marginBottom: '8px',
    fontFamily: '"Outfit", sans-serif',
  },
  cookieTable: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
  },
  cookieRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  cookieType: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(100, 180, 255, 0.9)',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  cookieDesc: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: '"Outfit", sans-serif',
  },
  contactBox: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px',
    marginBottom: '16px',
  },
  contactLine: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '0 0 8px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  ctaSection: {
    padding: '20px 20px 80px',
  },
  ctaCard: {
    position: 'relative',
    maxWidth: '500px',
    margin: '0 auto',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
  },
  ctaGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.5), transparent)',
  },
  ctaTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  ctaText: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0 0 24px 0',
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
