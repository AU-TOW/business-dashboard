import Link from 'next/link';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logo}>
            Business Dashboard
          </Link>
          <nav style={styles.nav}>
            <Link href="/pricing" style={styles.navLink}>
              Pricing
            </Link>
            <Link href="/signup" style={styles.signupButton}>
              Start Free Trial
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {children}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLinks}>
            <Link href="/" style={styles.footerLink}>Home</Link>
            <Link href="/pricing" style={styles.footerLink}>Pricing</Link>
            <Link href="/signup" style={styles.footerLink}>Sign Up</Link>
          </div>
          <p style={styles.copyright}>© 2026 Business Dashboard</p>
        </div>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    padding: '16px 24px',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e40af',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  signupButton: {
    background: 'linear-gradient(135deg, #3B82F6, #2563eb)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  main: {
    flex: 1,
  },
  footer: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(59, 130, 246, 0.1)',
    padding: '32px 24px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  footerLinks: {
    display: 'flex',
    gap: '32px',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  copyright: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: 0,
  },
};
