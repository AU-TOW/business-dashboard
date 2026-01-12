'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
      <div style={styles.verifyBox}>
        {status === 'verifying' && (
          <div style={styles.content}>
            <div style={styles.spinner}></div>
            <h1 style={styles.title}>Verifying Your Email</h1>
            <p style={styles.subtitle}>Please wait while we confirm your account...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={styles.content}>
            <div style={styles.successIcon}>✓</div>
            <h1 style={styles.successTitle}>Email Verified!</h1>
            <p style={styles.subtitle}>
              Welcome to Business Dashboard, <strong>{businessName}</strong>!
            </p>
            <p style={styles.redirectText}>
              Redirecting you to complete your setup...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div style={styles.content}>
            <div style={styles.errorIcon}>✕</div>
            <h1 style={styles.errorTitle}>Verification Failed</h1>
            <p style={styles.errorText}>{errorMessage}</p>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => router.push('/signup')}
                style={styles.primaryButton}
              >
                Sign Up Again
              </button>
              {tenantSlug && (
                <button
                  onClick={() => router.push('/autow')}
                  style={styles.secondaryButton}
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div style={styles.container}>
        <div style={styles.verifyBox}>
          <div style={styles.content}>
            <div style={styles.spinner}></div>
            <h1 style={styles.title}>Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 50%, #f5f5f5 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  verifyBox: {
    maxWidth: '450px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '48px 40px',
    boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
  },
  content: {
    textAlign: 'center' as const,
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(59, 130, 246, 0.2)',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    margin: '0 auto 24px',
    animation: 'spin 1s linear infinite',
  },
  title: {
    color: '#1e40af',
    fontSize: '24px',
    marginBottom: '12px',
    margin: '0 0 12px 0',
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '16px',
    margin: '0',
  },
  redirectText: {
    color: '#94a3b8',
    fontSize: '14px',
    marginTop: '16px',
    margin: '16px 0 0 0',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
  },
  successTitle: {
    color: '#059669',
    fontSize: '24px',
    marginBottom: '12px',
    margin: '0 0 12px 0',
    fontWeight: '700',
  },
  errorIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
  },
  errorTitle: {
    color: '#dc2626',
    fontSize: '24px',
    marginBottom: '12px',
    margin: '0 0 12px 0',
    fontWeight: '700',
  },
  errorText: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '24px',
    margin: '0 0 24px 0',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  primaryButton: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
    transition: 'all 0.3s',
  },
  secondaryButton: {
    width: '100%',
    padding: '14px',
    border: '2px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'transparent',
    color: '#3b82f6',
    transition: 'all 0.3s',
  },
};
