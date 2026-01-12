import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerGrid}>
          {/* Column 1: Logo + Tagline */}
          <div style={styles.footerColumn}>
            <Link href="/" style={styles.footerLogo}>
              Business Dashboard
            </Link>
            <p style={styles.tagline}>
              All-in-one management for UK tradespeople
            </p>
          </div>

          {/* Column 2: Product */}
          <div style={styles.footerColumn}>
            <h4 style={styles.columnTitle}>Product</h4>
            <nav aria-label="Product links">
              <Link href="/#features" style={styles.footerLink}>
                Features
              </Link>
              <Link href="/pricing" style={styles.footerLink}>
                Pricing
              </Link>
              <Link href="/signup" style={styles.footerLink}>
                Sign Up
              </Link>
            </nav>
          </div>

          {/* Column 3: Company */}
          <div style={styles.footerColumn}>
            <h4 style={styles.columnTitle}>Company</h4>
            <nav aria-label="Company links">
              <Link href="#" style={styles.footerLink}>
                About
              </Link>
              <Link href="#" style={styles.footerLink}>
                Contact
              </Link>
              <Link href="#" style={styles.footerLink}>
                Support
              </Link>
            </nav>
          </div>

          {/* Column 4: Legal */}
          <div style={styles.footerColumn}>
            <h4 style={styles.columnTitle}>Legal</h4>
            <nav aria-label="Legal links">
              <Link href="#" style={styles.footerLink}>
                Privacy Policy
              </Link>
              <Link href="#" style={styles.footerLink}>
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} Business Dashboard. All rights reserved.
          </p>
          <p style={styles.madeWith}>
            Made for UK tradespeople with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(59, 130, 246, 0.1)',
    padding: '48px 24px 24px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
    marginBottom: '32px',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerLogo: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1e40af',
    textDecoration: 'none',
    marginBottom: '4px',
  },
  tagline: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: 1.5,
    margin: 0,
  },
  columnTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'block',
    padding: '4px 0',
    transition: 'color 0.2s',
  },
  footerBottom: {
    borderTop: '1px solid rgba(59, 130, 246, 0.1)',
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  copyright: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: 0,
  },
  madeWith: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: 0,
  },
};
