'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightning from '@/components/marketing/Lightning';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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

          <div style={styles.loginBox}>
            <div style={styles.boxBorder}></div>
            <div style={styles.boxContent}>
              <div style={styles.successContent}>
                <div style={styles.successIconWrapper}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <h1 style={styles.successTitle}>Check Your Email</h1>
                <p style={styles.successText}>
                  We've sent a magic link to <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{email}</strong>
                </p>
                <p style={styles.successSubtext}>
                  Click the link in your email to sign in to your dashboard.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  style={styles.backButton}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Try Different Email
                </button>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

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

          <div style={styles.loginBox}>
            <div style={styles.boxBorder}></div>
            <div style={styles.boxContent}>
              <div style={styles.header}>
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>
                  Sign in to your Business Dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                {error && (
                  <div style={styles.error}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <div style={styles.inputWrapper}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={styles.inputIcon}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      required
                      style={styles.input}
                      placeholder="you@yourbusiness.com"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    ...(loading ? styles.buttonDisabled : {}),
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span style={styles.spinner}></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Magic Link
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

                <p style={styles.infoText}>
                  We'll send you a secure link to sign in — no password needed.
                </p>

                <div style={styles.signupLink}>
                  Don't have an account?{' '}
                  <Link href="/signup" style={styles.link}>Start free trial</Link>
                </div>
              </form>
            </div>
          </div>
        </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        input:focus {
          border-color: rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1) !important;
        }

        button:hover:not(:disabled) {
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
    background: '#000000',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
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
  loginBox: {
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
  header: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  title: {
    color: '#ffffff',
    fontSize: '34px',
    marginBottom: '10px',
    margin: '0 0 10px 0',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#f87171',
    padding: '14px 18px',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: 500,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    marginBottom: '10px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '13px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '18px 18px 18px 52px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '14px',
    fontSize: '16px',
    fontFamily: '"Outfit", sans-serif',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '18px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    letterSpacing: '0.5px',
    fontFamily: '"Outfit", sans-serif',
    transition: 'all 0.3s',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  infoText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  signupLink: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    paddingTop: '22px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    fontFamily: '"Outfit", sans-serif',
  },
  link: {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontWeight: 600,
  },
  // Success state styles
  successContent: {
    textAlign: 'center',
    padding: '20px 0',
  },
  successIconWrapper: {
    width: '88px',
    height: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    margin: '0 auto 28px',
    boxShadow: '0 0 50px rgba(255, 255, 255, 0.1)',
  },
  successTitle: {
    color: '#ffffff',
    fontSize: '30px',
    marginBottom: '16px',
    margin: '0 0 16px 0',
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 700,
  },
  successText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    marginBottom: '8px',
    margin: '0 0 8px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  successSubtext: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    marginBottom: '28px',
    margin: '0 0 28px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '14px 28px',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
  },
};
