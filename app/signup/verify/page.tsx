'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Lightning from '@/components/marketing/Lightning';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setErrorMessage('No verification token provided');
        setStatus('error');
        return;
      }

      try {
        // Call our verify API endpoint
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setErrorMessage(data.error || 'Verification failed');
          setStatus('error');
          if (data.tenantSlug) {
            setTenantSlug(data.tenantSlug);
          }
          return;
        }

        // Success!
        setStatus('success');
        setTenantSlug(data.tenantSlug);
        setBusinessName(data.businessName);

        // Set localStorage flag for client-side auth checks
        localStorage.setItem('bd_logged_in', 'true');
        localStorage.setItem('bd_tenant', data.tenantSlug);

        // Redirect to onboarding after short delay
        setTimeout(() => {
          router.push(`/${data.tenantSlug}/onboarding`);
        }, 2500);
      } catch (err: any) {
        console.error('Verification failed:', err);
        setErrorMessage('An unexpected error occurred during verification.');
        setStatus('error');
      }
    };

    verifyToken();
  }, [router, searchParams]);

  return (
    <div style={styles.container}>
      {/* Background Elements */}
      <div style={styles.background}>
        <div style={styles.gridOverlay}></div>
        <Lightning />
        <div style={styles.glowOrb1}></div>
        <div style={styles.glowOrb2}></div>
        <div style={styles.glowOrb3}></div>
      </div>

      <div style={styles.mainContent}>
        {/* Centered Logo */}
        <div style={styles.logoContainer}>
          <Link href="/" style={styles.logoLink}>
            <div style={styles.logoGlow}></div>
            <Image
              src="/assets/Business-Dash.png"
              alt="Business Dashboard"
              width={280}
              height={80}
              style={styles.logoImageCentered}
            />
          </Link>
        </div>

        <div style={styles.verifyBox}>
        <div style={styles.boxBorder}></div>
        <div style={styles.boxContent}>
          {status === 'verifying' && (
            <div style={styles.content}>
              <div style={styles.spinnerWrapper}>
                <div style={styles.spinner}></div>
                <div style={styles.spinnerGlow}></div>
              </div>
              <h1 style={styles.title}>Verifying Your Email</h1>
              <p style={styles.subtitle}>Please wait while we confirm your account...</p>
            </div>
          )}

          {status === 'success' && (
            <div style={styles.content}>
              <div style={styles.successIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h1 style={styles.successTitle}>Email Verified!</h1>
              <p style={styles.subtitle}>
                Welcome to Business Dashboard, <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{businessName}</strong>!
              </p>
              <p style={styles.redirectText}>
                <span style={styles.redirectSpinner}></span>
                Redirecting you to complete your setup...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div style={styles.content}>
              <div style={styles.errorIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </div>
              <h1 style={styles.errorTitle}>Verification Failed</h1>
              <p style={styles.errorText}>{errorMessage}</p>
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => router.push('/signup')}
                  style={styles.primaryButton}
                >
                  Sign Up Again
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                {tenantSlug && (
                  <button
                    onClick={() => router.push('/login')}
                    style={styles.secondaryButton}
                  >
                    Go to Login
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div style={styles.container}>
        {/* Background Elements */}
        <div style={styles.background}>
          <div style={styles.gridOverlay}></div>
          <div style={styles.glowOrb1}></div>
          <div style={styles.glowOrb2}></div>
          <div style={styles.glowOrb3}></div>
        </div>

        <div style={styles.mainContent}>
          {/* Centered Logo */}
          <div style={styles.logoContainer}>
            <Link href="/" style={styles.logoLink}>
              <div style={styles.logoGlow}></div>
              <Image
                src="/assets/Business-Dash.png"
                alt="Business Dashboard"
                width={280}
                height={80}
                style={styles.logoImageCentered}
              />
            </Link>
          </div>

          <div style={styles.verifyBox}>
            <div style={styles.boxBorder}></div>
            <div style={styles.boxContent}>
              <div style={styles.content}>
                <div style={styles.spinnerWrapper}>
                  <div style={styles.spinner}></div>
                  <div style={styles.spinnerGlow}></div>
                </div>
                <h1 style={styles.title}>Loading...</h1>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }

          @keyframes glowPulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}</style>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
    background: '#000000',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
  },
  glowOrb1: {
    position: 'absolute',
    top: '20%',
    right: '30%',
    width: '450px',
    height: '450px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'pulse 4s ease-in-out infinite',
  },
  glowOrb2: {
    position: 'absolute',
    bottom: '30%',
    left: '20%',
    width: '350px',
    height: '350px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'pulse 4s ease-in-out infinite 2s',
  },
  glowOrb3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 60%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
    width: '100%',
    maxWidth: '460px',
  },
  logoContainer: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '-40px',
  },
  logoLink: {
    position: 'relative',
    display: 'block',
    textDecoration: 'none',
  },
  logoGlow: {
    position: 'absolute',
    inset: '-20px',
    background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
    filter: 'blur(20px)',
    zIndex: 0,
  },
  logoImageCentered: {
    position: 'relative',
    height: '80px',
    width: 'auto',
    objectFit: 'contain',
    zIndex: 1,
    filter: 'drop-shadow(0 4px 20px rgba(255, 255, 255, 0.2))',
  },
  verifyBox: {
    position: 'relative',
    maxWidth: '460px',
    width: '100%',
    zIndex: 1,
  },
  boxBorder: {
    position: 'absolute',
    inset: '-1px',
    borderRadius: '28px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
    zIndex: 0,
  },
  boxContent: {
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '26px',
    padding: '52px 44px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  content: {
    textAlign: 'center',
  },
  spinnerWrapper: {
    position: 'relative',
    width: '70px',
    height: '70px',
    margin: '0 auto 28px',
  },
  spinner: {
    position: 'absolute',
    inset: 0,
    border: '3px solid rgba(255, 255, 255, 0.15)',
    borderTop: '3px solid rgba(255, 255, 255, 0.9)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  spinnerGlow: {
    position: 'absolute',
    inset: '-10px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
    animation: 'glowPulse 2s ease-in-out infinite',
  },
  title: {
    color: '#ffffff',
    fontSize: '26px',
    marginBottom: '14px',
    margin: '0 0 14px 0',
    fontWeight: 700,
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '0.3px',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  redirectText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    marginTop: '20px',
    margin: '20px 0 0 0',
    fontFamily: '"Outfit", sans-serif',
  },
  redirectSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.25)',
    borderTop: '2px solid rgba(255, 255, 255, 0.9)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  successIcon: {
    width: '88px',
    height: '88px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    color: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 28px',
    boxShadow: '0 0 50px rgba(255, 255, 255, 0.1)',
  },
  successTitle: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: '30px',
    marginBottom: '14px',
    margin: '0 0 14px 0',
    fontWeight: 700,
    fontFamily: '"Space Grotesk", sans-serif',
  },
  errorIcon: {
    width: '88px',
    height: '88px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '2px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '50%',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 28px',
    boxShadow: '0 0 50px rgba(239, 68, 68, 0.2)',
  },
  errorTitle: {
    color: '#ef4444',
    fontSize: '30px',
    marginBottom: '14px',
    margin: '0 0 14px 0',
    fontWeight: 700,
    fontFamily: '"Space Grotesk", sans-serif',
  },
  errorText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    marginBottom: '28px',
    margin: '0 0 28px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  primaryButton: {
    width: '100%',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
  },
  secondaryButton: {
    width: '100%',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s',
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
  },
};
