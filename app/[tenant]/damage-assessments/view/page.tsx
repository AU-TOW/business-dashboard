'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useTenant, useTenantPath } from '@/lib/tenant/TenantProvider';

interface DamageAssessment {
  id: number;
  assessment_number: string;
  assessment_date: string;
  status: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  vehicle_reg: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_color: string;
  mileage: number;
  damage_description: string;
  damage_locations: Record<string, boolean>;
  photos: { url: string; location: string; description: string }[];
  notes: string;
  share_token: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #333',
    flexWrap: 'wrap' as const,
    gap: '15px',
  } as React.CSSProperties,
  logo: {
    height: '50px',
    width: 'auto',
  } as React.CSSProperties,
  headerButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  backButton: {
    backgroundColor: 'transparent',
    color: '#30ff37',
    border: '1px solid #30ff37',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
  editButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
  shareButton: {
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap' as const,
    gap: '15px',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#30ff37',
  } as React.CSSProperties,
  assessmentNumber: {
    fontSize: '14px',
    color: '#666',
    fontFamily: 'monospace',
    marginTop: '5px',
  } as React.CSSProperties,
  statusBadge: {
    fontSize: '12px',
    padding: '6px 14px',
    borderRadius: '15px',
    textTransform: 'uppercase' as const,
    fontWeight: 'bold',
  } as React.CSSProperties,
  section: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '14px',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #333',
  } as React.CSSProperties,
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  infoItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
  } as React.CSSProperties,
  infoLabel: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  infoValue: {
    fontSize: '16px',
    color: '#fff',
  } as React.CSSProperties,
  vehicleReg: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#30ff37',
    marginBottom: '15px',
  } as React.CSSProperties,
  damageLocations: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
  } as React.CSSProperties,
  locationBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  locationActive: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    color: '#ff4444',
    border: '1px solid #ff4444',
  } as React.CSSProperties,
  locationInactive: {
    backgroundColor: '#222',
    color: '#666',
    border: '1px solid #333',
  } as React.CSSProperties,
  description: {
    fontSize: '16px',
    color: '#fff',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap' as const,
  } as React.CSSProperties,
  notes: {
    fontSize: '14px',
    color: '#888',
    fontStyle: 'italic',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap' as const,
  } as React.CSSProperties,
  loading: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#888',
  } as React.CSSProperties,
  error: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid #ff4444',
    color: '#ff4444',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  } as React.CSSProperties,
  meta: {
    fontSize: '12px',
    color: '#666',
    marginTop: '20px',
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
};

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'rgba(158, 158, 158, 0.2)', text: '#9e9e9e' },
  pending: { bg: 'rgba(255, 152, 0, 0.2)', text: '#ff9800' },
  reviewed: { bg: 'rgba(33, 150, 243, 0.2)', text: '#2196f3' },
  completed: { bg: 'rgba(48, 255, 55, 0.2)', text: '#30ff37' },
};

const damageLocationLabels: Record<string, string> = {
  front: 'Front',
  rear: 'Rear',
  left: 'Left Side',
  right: 'Right Side',
  top: 'Roof/Top',
  underside: 'Underside',
};

export default function ViewDamageAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenant = useTenant();
  const paths = useTenantPath();

  const id = searchParams.get('id');

  const [assessment, setAssessment] = useState<DamageAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('autow_token');
    if (!token) {
      router.push(paths.welcome);
      return;
    }

    if (!id) {
      setError('Assessment ID is required');
      setLoading(false);
      return;
    }

    fetchAssessment();
  }, [router, paths, id]);

  const fetchAssessment = async () => {
    try {
      const token = localStorage.getItem('autow_token');
      const response = await fetch(`/api/autow/damage-assessment/get?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Slug': tenant.slug,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assessment');
      }

      const data = await response.json();
      setAssessment(data.assessment);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!assessment) return;

    try {
      const token = localStorage.getItem('autow_token');
      const response = await fetch('/api/autow/damage-assessment/generate-share-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ id: assessment.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate share link');
      }

      await navigator.clipboard.writeText(data.share_url);
      alert('Share link copied to clipboard!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading assessment...</div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Image
            src="/logo.png"
            alt="AUTOW Logo"
            width={120}
            height={50}
            style={styles.logo}
            priority
          />
          <button style={styles.backButton} onClick={() => router.push(paths.damageAssessments)}>
            ← Back
          </button>
        </div>
        <div style={styles.error}>{error || 'Assessment not found'}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Image
          src="/logo.png"
          alt="AUTOW Logo"
          width={120}
          height={50}
          style={styles.logo}
          priority
        />
        <div style={styles.headerButtons}>
          <button style={styles.backButton} onClick={() => router.push(paths.damageAssessments)}>
            ← Back
          </button>
          <button
            style={styles.editButton}
            onClick={() => router.push(`${paths.damageAssessmentsCreate}?id=${assessment.id}`)}
          >
            Edit
          </button>
          <button style={styles.shareButton} onClick={handleShare}>
            Share
          </button>
        </div>
      </div>

      <div style={styles.titleRow}>
        <div>
          <div style={styles.title}>{assessment.vehicle_reg}</div>
          <div style={styles.assessmentNumber}>{assessment.assessment_number}</div>
        </div>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: statusColors[assessment.status]?.bg || '#333',
            color: statusColors[assessment.status]?.text || '#fff',
          }}
        >
          {assessment.status}
        </span>
      </div>

      {/* Vehicle Information */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Vehicle Information</div>
        <div style={styles.vehicleReg}>{assessment.vehicle_reg}</div>
        <div style={styles.infoGrid}>
          {assessment.vehicle_make && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Make</span>
              <span style={styles.infoValue}>{assessment.vehicle_make}</span>
            </div>
          )}
          {assessment.vehicle_model && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Model</span>
              <span style={styles.infoValue}>{assessment.vehicle_model}</span>
            </div>
          )}
          {assessment.vehicle_year && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Year</span>
              <span style={styles.infoValue}>{assessment.vehicle_year}</span>
            </div>
          )}
          {assessment.vehicle_color && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Color</span>
              <span style={styles.infoValue}>{assessment.vehicle_color}</span>
            </div>
          )}
          {assessment.mileage && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Mileage</span>
              <span style={styles.infoValue}>{assessment.mileage.toLocaleString()} miles</span>
            </div>
          )}
        </div>
      </div>

      {/* Client Information */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Client Information</div>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Name</span>
            <span style={styles.infoValue}>{assessment.client_name}</span>
          </div>
          {assessment.client_phone && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Phone</span>
              <span style={styles.infoValue}>{assessment.client_phone}</span>
            </div>
          )}
          {assessment.client_email && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{assessment.client_email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Damage Details */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Damage Details</div>

        {assessment.damage_locations && Object.keys(assessment.damage_locations).length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ ...styles.infoLabel, marginBottom: '10px' }}>Affected Areas</div>
            <div style={styles.damageLocations}>
              {Object.entries(damageLocationLabels).map(([key, label]) => (
                <span
                  key={key}
                  style={{
                    ...styles.locationBadge,
                    ...(assessment.damage_locations[key] ? styles.locationActive : styles.locationInactive),
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {assessment.damage_description && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ ...styles.infoLabel, marginBottom: '10px' }}>Description</div>
            <div style={styles.description}>{assessment.damage_description}</div>
          </div>
        )}

        {assessment.notes && (
          <div>
            <div style={{ ...styles.infoLabel, marginBottom: '10px' }}>Additional Notes</div>
            <div style={styles.notes}>{assessment.notes}</div>
          </div>
        )}
      </div>

      {/* Meta Information */}
      <div style={styles.meta}>
        <span>Created by {assessment.created_by}</span>
        <span>Created on {formatDate(assessment.created_at)}</span>
        {assessment.updated_at !== assessment.created_at && (
          <span>Last updated {formatDate(assessment.updated_at)}</span>
        )}
      </div>
    </div>
  );
}
