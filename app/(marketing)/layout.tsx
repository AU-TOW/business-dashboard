import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import Lightning from '@/components/marketing/Lightning';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={styles.wrapper}>
      {/* Global Background with Grid */}
      <div style={styles.globalBackground}>
        <div style={styles.gridOverlay}></div>
        <Lightning />
      </div>

      {/* Skip link for accessibility */}
      <a href="#main-content" style={styles.skipLink}>
        Skip to main content
      </a>

      <Header />

      <main id="main-content" style={styles.main}>
        {children}
      </main>

      <Footer />

      {/* Global responsive styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Mobile hamburger visibility */
        @media (max-width: 768px) {
          header nav[aria-label="Main navigation"] {
            display: none !important;
          }
          header button[aria-label*="menu"] {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          header button[aria-label*="menu"] {
            display: none !important;
          }
        }

        /* Footer responsive */
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
          footer > div > div:last-child {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center;
          }
        }

        /* Focus visible for accessibility */
        a:focus-visible,
        button:focus-visible {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }

        /* Skip link styling */
        a[href="#main-content"]:focus {
          clip: auto !important;
          clip-path: none !important;
          height: auto !important;
          width: auto !important;
          position: absolute !important;
          top: 8px;
          left: 8px;
          z-index: 1000;
          padding: 12px 24px;
          background: #3B82F6;
          color: white;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
        }
      ` }} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    background: '#000000',
  },
  globalBackground: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
  },
  skipLink: {
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
  main: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
};
