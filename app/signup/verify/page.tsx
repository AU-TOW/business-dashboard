'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');

  useEffect(() => {
    const verifyMagicLink = async () => {
      const supabase = getSupabaseClient();

      // Get tenant slug from URL params
      const tenant = searchParams.get('tenant');
      if (tenant) {
        setTenantSlug(tenant);
      }

      try {
        // Supabase automatically handles the token verification from URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Verification error:', error);
          setErrorMessage(error.message);
          setStatus('error');
          return;
        }

        if (session) {
          // Session established successfully
          setStatus('success');

          // Link user to tenant if we have tenant slug
          if (tenant && session.user) {
            try {
              await fetch('/api/auth/link-tenant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: session.user.id,
                  tenantSlug: tenant,
                }),
              });
            } catch (linkError) {
              console.error('Failed to link tenant:', linkError);
              // Continue anyway - tenant linking can be retried
            }
          }

          // Redirect after short delay
          setTimeout(() => {
            if (tenant) {
              router.push(`/${tenant}/onboarding`);
            } else {
              // If no tenant, redirect to home
              router.push('/');
            }
          }, 2000);
        } else {
          // No session - check if we need to verify from URL
          // Supabase Auth may handle this automatically via onAuthStateChange
          const { error: refreshError } = await supabase.auth.refreshSession();

          if (refreshError) {
            setErrorMessage('Unable to verify your email. The link may have expired.');
            setStatus('error');
          }
        }
      } catch (err: any) {
        console.error('Verification failed:', err);
        setErrorMessage('An unexpected error occurred during verification.');
        setStatus('error');
      }
    };

    // Set up auth state listener
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const tenant = searchParams.get('tenant');
        setStatus('success');

        setTimeout(() => {
          if (tenant) {
            router.push(`/${tenant}/onboarding`);
          } else {
            router.push('/');
          }
        }, 2000);
      }
    });

    verifyMagicLink();

    return () => {
      subscription.unsubscribe();
    };
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
              Redirecting you to your dashboard...
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
                Try Again
              </button>
              {tenantSlug && (
                <button
                  onClick={() => router.push(`/${tenantSlug}/login`)}
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
