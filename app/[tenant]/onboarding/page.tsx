'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant, useTenantPath, useBranding } from '@/lib/tenant/TenantProvider';

export default function OnboardingPage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const branding = useBranding();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState({
    address: '',
    postcode: '',
    bankName: '',
    sortCode: '',
    accountNumber: '',
  });

  // Calculate trial days remaining
  const trialDaysRemaining = tenant.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(tenant.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 7;

  const handleSkip = () => {
    router.push(paths.dashboard);
  };

  const handleSaveDetails = async () => {
    setLoading(true);
    try {
      // TODO: Implement API to save additional business details
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay
      router.push(paths.dashboard);
    } catch (error) {
      console.error('Failed to save details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdditionalDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.onboardingBox}>
        {/* Welcome Step */}
        {step === 1 && (
          <div style={styles.stepContent}>
            <div style={styles.welcomeEmoji}>🎉</div>
            <h1 style={styles.title}>Welcome to Business Dashboard!</h1>
            <p style={styles.subtitle}>
              Hi <strong>{branding.businessName}</strong>, your account is ready.
            </p>

            <div style={styles.trialBanner}>
              <div style={styles.trialIcon}>⏰</div>
              <div style={styles.trialText}>
                <strong>Free Trial Active</strong>
                <span>{trialDaysRemaining} days remaining</span>
              </div>
            </div>

            <div style={styles.featureList}>
              <h3 style={styles.featureTitle}>What you can do:</h3>
              <ul style={styles.features}>
                <li>📅 Manage bookings and appointments</li>
                <li>📋 Create estimates and quotes</li>
                <li>💰 Generate professional invoices</li>
                <li>📱 Get Telegram notifications</li>
                {tenant.showVehicleFields && <li>🚗 Track vehicle details</li>}
              </ul>
            </div>

            <div style={styles.buttonGroup}>
              <button
                onClick={() => setStep(2)}
                style={styles.primaryButton}
              >
                Add Business Details →
              </button>
              <button
                onClick={handleSkip}
                style={styles.secondaryButton}
              >
                Skip for Now
              </button>
            </div>
          </div>
        )}

        {/* Additional Details Step */}
        {step === 2 && (
          <div style={styles.stepContent}>
            <button
              onClick={() => setStep(1)}
              style={styles.backLink}
            >
              ← Back
            </button>

            <h1 style={styles.title}>Business Details</h1>
            <p style={styles.subtitle}>
              Optional: Add your address and bank details for invoices.
            </p>

            <form style={styles.form}>
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Address</h3>
                <input
                  type="text"
                  name="address"
                  value={additionalDetails.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  style={styles.input}
                />
                <input
                  type="text"
                  name="postcode"
                  value={additionalDetails.postcode}
                  onChange={handleChange}
                  placeholder="Postcode"
                  style={{ ...styles.input, maxWidth: '200px' }}
                />
              </div>

              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Bank Details (for invoices)</h3>
                <input
                  type="text"
                  name="bankName"
                  value={additionalDetails.bankName}
                  onChange={handleChange}
                  placeholder="Bank name"
                  style={styles.input}
                />
                <div style={styles.inputRow}>
                  <input
                    type="text"
                    name="sortCode"
                    value={additionalDetails.sortCode}
                    onChange={handleChange}
                    placeholder="Sort code"
                    style={{ ...styles.input, flex: 1 }}
                    maxLength={8}
                  />
                  <input
                    type="text"
                    name="accountNumber"
                    value={additionalDetails.accountNumber}
                    onChange={handleChange}
                    placeholder="Account number"
                    style={{ ...styles.input, flex: 1 }}
                    maxLength={8}
                  />
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  style={styles.primaryButton}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save & Go to Dashboard'}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  style={styles.secondaryButton}
                >
                  Skip for Now
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
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
  onboardingBox: {
    maxWidth: '550px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  backLink: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '0',
    marginBottom: '20px',
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  welcomeEmoji: {
    fontSize: '64px',
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  title: {
    color: '#1e40af',
    fontSize: '28px',
    textAlign: 'center' as const,
    marginBottom: '12px',
    margin: '0 0 12px 0',
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '16px',
    textAlign: 'center' as const,
    marginBottom: '24px',
    margin: '0 0 24px 0',
  },
  trialBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
    border: '2px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '16px',
    padding: '16px 20px',
    marginBottom: '24px',
  },
  trialIcon: {
    fontSize: '32px',
  },
  trialText: {
    display: 'flex',
    flexDirection: 'column' as const,
    color: '#059669',
    gap: '2px',
  },
  featureList: {
    marginBottom: '32px',
  },
  featureTitle: {
    color: '#1e40af',
    fontSize: '16px',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  features: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    color: '#475569',
    fontSize: '15px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  primaryButton: {
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
    transition: 'all 0.3s',
  },
  secondaryButton: {
    width: '100%',
    padding: '14px',
    border: '2px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'transparent',
    color: '#64748b',
    transition: 'all 0.3s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  sectionTitle: {
    color: '#1e40af',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#1e293b',
    transition: 'all 0.3s',
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
  },
};
