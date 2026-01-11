import pool from '@/lib/db';

interface TenantBranding {
  businessName: string;
  logoUrl: string | null;
  primaryColor: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  postcode: string | null;
  subscriptionTier: string;
}

async function getAssessmentData(token: string) {
  const client = await pool.connect();

  try {
    // First, look up the tenant from the share token
    const lookupResult = await client.query(
      `SELECT tenant_slug, tenant_schema FROM public.share_token_lookup WHERE share_token = $1`,
      [token]
    );

    let schemaName = 'public';
    let tenantBranding: TenantBranding | null = null;

    if (lookupResult.rows.length > 0) {
      // Multi-tenant: use tenant schema
      schemaName = lookupResult.rows[0].tenant_schema;
      const tenantSlug = lookupResult.rows[0].tenant_slug;

      // Get tenant branding
      const tenantResult = await client.query(
        `SELECT business_name, logo_url, primary_color, email, phone, address, postcode, subscription_tier
         FROM public.tenants WHERE slug = $1`,
        [tenantSlug]
      );

      if (tenantResult.rows.length > 0) {
        const t = tenantResult.rows[0];
        tenantBranding = {
          businessName: t.business_name,
          logoUrl: t.logo_url,
          primaryColor: t.primary_color || '#3B82F6',
          email: t.email,
          phone: t.phone,
          address: t.address,
          postcode: t.postcode,
          subscriptionTier: t.subscription_tier,
        };
      }
    }

    // Query assessment from the appropriate schema
    const result = await client.query(
      `SELECT * FROM ${schemaName}.damage_assessments WHERE share_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return { assessment: null, tenantBranding: null };
    }

    const assessment = result.rows[0];

    return { assessment, tenantBranding };
  } finally {
    client.release();
  }
}

// Helper to determine if color customization is enabled for tier
function canCustomizeColor(tier: string): boolean {
  return ['trial', 'business', 'enterprise'].includes(tier);
}

export default async function SharedAssessmentPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  const { assessment, tenantBranding } = await getAssessmentData(token);

  if (!assessment) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorBox}>
          <h2 style={styles.errorTitle}>Assessment Not Found</h2>
          <p style={styles.errorText}>The requested assessment could not be found or the link has expired.</p>
        </div>
      </div>
    );
  }

  // Use tenant branding or defaults
  const branding = tenantBranding || {
    businessName: 'Business Dashboard',
    logoUrl: null,
    primaryColor: '#3B82F6',
    email: null,
    phone: null,
    address: null,
    postcode: null,
    subscriptionTier: 'trial',
  };

  // Apply primary color only for Business+ tiers (or trial)
  const accentColor = canCustomizeColor(branding.subscriptionTier)
    ? branding.primaryColor
    : '#3B82F6';

  // Parse damage locations if stored as JSON
  const damageLocations = typeof assessment.damage_locations === 'string'
    ? JSON.parse(assessment.damage_locations)
    : assessment.damage_locations || [];

  return (
    <div style={styles.container} className="assessment-container">
      {/* Print Button */}
      <div style={styles.actionBar} className="no-print">
        <button onClick={() => {}} style={{ ...styles.printBtn, background: accentColor }} className="print-btn">
          Print / Save as PDF
        </button>
      </div>

      {/* Header */}
      <div style={{ ...styles.header, borderTopColor: accentColor }} className="assessment-header">
        <div style={styles.headerTop}>
          <div style={styles.logoSection}>
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.businessName} style={styles.logo} />
            ) : (
              <div style={{ ...styles.logoPlaceholder, borderColor: accentColor, color: accentColor }}>
                {branding.businessName.charAt(0)}
              </div>
            )}
            <div style={styles.headerText}>
              <h1 style={{ ...styles.headerTitle, color: accentColor }}>Vehicle Damage Assessment</h1>
              <p style={styles.headerSubtitle}>{branding.businessName}</p>
            </div>
          </div>
          <div style={{ ...styles.regBadge, background: accentColor }}>{assessment.vehicle_reg}</div>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Make / Model</div>
            <div style={styles.infoValue}>{assessment.vehicle_make} {assessment.vehicle_model}</div>
          </div>
          {assessment.vehicle_color && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Colour</div>
              <div style={styles.infoValue}>{assessment.vehicle_color}</div>
            </div>
          )}
          {assessment.vehicle_year && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Year</div>
              <div style={styles.infoValue}>{assessment.vehicle_year}</div>
            </div>
          )}
          {assessment.mileage && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Mileage</div>
              <div style={styles.infoValue}>{assessment.mileage.toLocaleString()} miles</div>
            </div>
          )}
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Assessment Date</div>
            <div style={{ ...styles.infoValue, color: accentColor }}>
              {new Date(assessment.assessment_date).toLocaleDateString('en-GB')}
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Reference</div>
            <div style={styles.infoValue}>{assessment.assessment_number}</div>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: `${accentColor}20` }}>👤</div>
          <div style={{ ...styles.cardTitle, color: accentColor }}>Client Information</div>
        </div>
        <div style={styles.clientInfo}>
          <p><strong>Name:</strong> {assessment.client_name}</p>
          {assessment.client_phone && <p><strong>Phone:</strong> {assessment.client_phone}</p>}
          {assessment.client_email && <p><strong>Email:</strong> {assessment.client_email}</p>}
        </div>
      </div>

      {/* Damage Description */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: 'rgba(220,38,38,0.2)' }}>⚠️</div>
          <div style={{ ...styles.cardTitle, color: accentColor }}>Damage Assessment</div>
        </div>
        <div style={styles.damageContent}>
          {assessment.damage_description ? (
            <div style={styles.damageDescription}>
              {assessment.damage_description.split('\n').map((paragraph: string, index: number) => (
                <p key={index} style={styles.paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p style={styles.noDamage}>No damage description provided.</p>
          )}
        </div>

        {/* Damage Locations */}
        {damageLocations.length > 0 && (
          <div style={styles.damageLocations}>
            <h4 style={styles.subTitle}>Damage Locations</h4>
            <div style={styles.locationGrid}>
              {damageLocations.map((location: any, index: number) => (
                <div key={index} style={styles.locationItem}>
                  <span style={styles.locationBullet}>•</span>
                  <span>{location.area || location}: {location.severity || 'Damaged'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {assessment.notes && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, background: `${accentColor}20` }}>📝</div>
            <div style={{ ...styles.cardTitle, color: accentColor }}>Additional Notes</div>
          </div>
          <div style={styles.notesContent}>
            <p style={styles.notesText}>{assessment.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        {branding.logoUrl && (
          <img src={branding.logoUrl} alt={branding.businessName} style={styles.footerLogo} />
        )}
        <p><strong>{branding.businessName}</strong></p>
        {branding.email && <p>Email: {branding.email}</p>}
        {branding.phone && <p>Phone: {branding.phone}</p>}
        {branding.address && <p>{branding.address}</p>}
        <p style={{ marginTop: '10px', color: '#94a3b8' }}>
          Assessment Date: {new Date(assessment.assessment_date).toLocaleDateString('en-GB')}
        </p>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }

        @media (max-width: 768px) {
          .assessment-container {
            padding: 10px !important;
          }
          .assessment-header {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    color: '#1e293b',
    lineHeight: 1.6,
    minHeight: '100vh',
    padding: '20px',
  },
  errorContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#f8fafc',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  errorBox: {
    textAlign: 'center',
    padding: '60px 40px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  errorTitle: {
    color: '#dc2626',
    marginBottom: '10px',
  },
  errorText: {
    color: '#64748b',
  },
  actionBar: {
    maxWidth: '900px',
    margin: '0 auto 20px auto',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  printBtn: {
    padding: '12px 24px',
    background: '#3B82F6',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  },
  header: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderTop: '4px solid #3B82F6',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '20px',
    maxWidth: '900px',
    margin: '0 auto 20px auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '25px',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    height: '60px',
    width: 'auto',
    maxWidth: '150px',
    objectFit: 'contain',
  },
  logoPlaceholder: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    border: '2px solid #3B82F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 700,
    background: 'rgba(255,255,255,0.1)',
  },
  headerText: {},
  headerTitle: {
    fontSize: '1.4em',
    color: '#3B82F6',
    marginBottom: '3px',
    margin: 0,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: '0.9em',
    margin: 0,
  },
  regBadge: {
    background: '#3B82F6',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '1.2em',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },
  infoItem: {
    background: 'rgba(255,255,255,0.1)',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  infoLabel: {
    fontSize: '0.7em',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#94a3b8',
    marginBottom: '3px',
  },
  infoValue: {
    fontWeight: 600,
    color: '#fff',
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '25px',
    marginBottom: '20px',
    maxWidth: '900px',
    margin: '0 auto 20px auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e2e8f0',
  },
  cardIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2em',
  },
  cardTitle: {
    fontSize: '1.1em',
    fontWeight: 600,
    color: '#3B82F6',
  },
  clientInfo: {
    fontSize: '14px',
    lineHeight: 1.8,
    color: '#475569',
  },
  damageContent: {
    marginBottom: '20px',
  },
  damageDescription: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    fontSize: '0.95em',
    lineHeight: 1.8,
    color: '#475569',
  },
  paragraph: {
    marginBottom: '15px',
  },
  noDamage: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  damageLocations: {
    marginTop: '20px',
  },
  subTitle: {
    fontSize: '0.9em',
    fontWeight: 600,
    color: '#64748b',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  locationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px',
  },
  locationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#fef2f2',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#dc2626',
  },
  locationBullet: {
    color: '#dc2626',
    fontWeight: 700,
  },
  notesContent: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
  },
  notesText: {
    fontSize: '14px',
    lineHeight: 1.8,
    color: '#475569',
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  footer: {
    textAlign: 'center',
    padding: '30px',
    color: '#64748b',
    fontSize: '0.85em',
    borderTop: '1px solid #e2e8f0',
    marginTop: '30px',
    maxWidth: '900px',
    margin: '30px auto 0 auto',
  },
  footerLogo: {
    height: '40px',
    marginBottom: '10px',
    opacity: 0.7,
  },
};
