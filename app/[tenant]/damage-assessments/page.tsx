'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTenant, useTenantPath, useBranding } from '@/lib/tenant/TenantProvider';
import { colors, shadows } from '@/lib/theme';

interface DamageAssessment {
  id: number;
  assessment_number: string;
  assessment_date: string;
  status: string;
  client_name: string;
  client_phone: string;
  vehicle_reg: string;
  vehicle_make: string;
  vehicle_model: string;
  damage_description: string;
  created_at: string;
}

const styles = {
  container: {
    backgroundColor: colors.background,
    color: colors.text,
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
    borderBottom: `1px solid ${colors.border}`,
    flexWrap: 'wrap' as const,
    gap: '15px',
  } as React.CSSProperties,
  logo: {
    height: '50px',
    width: 'auto',
    borderRadius: '8px',
  } as React.CSSProperties,
  logoPlaceholder: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
  } as React.CSSProperties,
  headerButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  backButton: {
    backgroundColor: 'transparent',
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
  newButton: {
    backgroundColor: colors.primary,
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: colors.primary,
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '20px',
  } as React.CSSProperties,
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  } as React.CSSProperties,
  assessmentNumber: {
    fontSize: '12px',
    color: '#666',
    fontFamily: 'monospace',
  } as React.CSSProperties,
  statusBadge: {
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '12px',
    textTransform: 'uppercase' as const,
    fontWeight: 'bold',
  } as React.CSSProperties,
  vehicleReg: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: '5px',
  } as React.CSSProperties,
  vehicleInfo: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '10px',
  } as React.CSSProperties,
  clientName: {
    fontSize: '16px',
    color: '#fff',
    marginBottom: '10px',
  } as React.CSSProperties,
  damagePreview: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '15px',
    fontStyle: 'italic',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: `1px solid ${colors.border}`,
  } as React.CSSProperties,
  viewButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    flex: 1,
  } as React.CSSProperties,
  shareButton: {
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
  } as React.CSSProperties,
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#ff4444',
    border: '1px solid #ff4444',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#666',
  } as React.CSSProperties,
  emptyIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  } as React.CSSProperties,
  emptyText: {
    fontSize: '18px',
    marginBottom: '20px',
  } as React.CSSProperties,
  loading: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#888',
  } as React.CSSProperties,
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  } as React.CSSProperties,
  modalContent: {
    backgroundColor: '#111',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#ff4444',
  } as React.CSSProperties,
  modalText: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '25px',
  } as React.CSSProperties,
  modalButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  } as React.CSSProperties,
  modalCancel: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
  modalConfirm: {
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  } as React.CSSProperties,
};

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'rgba(158, 158, 158, 0.2)', text: '#9e9e9e' },
  pending: { bg: 'rgba(255, 152, 0, 0.2)', text: '#ff9800' },
  reviewed: { bg: `${colors.primary}20`, text: colors.primary },
  completed: { bg: `${colors.success}30`, text: colors.success },
};

export default function DamageAssessmentsPage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const branding = useBranding();

  const [assessments, setAssessments] = useState<DamageAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; assessment: DamageAssessment | null }>({
    show: false,
    assessment: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('bd_logged_in');
    if (!token) {
      router.push(paths.welcome);
      return;
    }
    fetchAssessments();
  }, [router, paths]);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('bd_logged_in');
      const response = await fetch('/api/autow/damage-assessment/list', {
        headers: {
          'X-Tenant-Slug': tenant.slug,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const data = await response.json();
      setAssessments(data.assessments);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.assessment) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('bd_logged_in');
      const response = await fetch('/api/autow/damage-assessment/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ id: deleteModal.assessment.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete assessment');
      }

      setDeleteModal({ show: false, assessment: null });
      fetchAssessments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async (assessment: DamageAssessment) => {
    try {
      const token = localStorage.getItem('bd_logged_in');
      const response = await fetch('/api/autow/damage-assessment/generate-share-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ id: assessment.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate share link');
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(data.share_url);
      alert('Share link copied to clipboard!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalTitle}>Delete Assessment?</div>
            <div style={styles.modalText}>
              This will permanently delete {deleteModal.assessment?.assessment_number}.
            </div>
            <div style={styles.modalButtons}>
              <button
                style={styles.modalCancel}
                onClick={() => setDeleteModal({ show: false, assessment: null })}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                style={styles.modalConfirm}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.header}>
        {branding.logoUrl ? (
          <Image
            src={branding.logoUrl}
            alt={branding.businessName}
            width={120}
            height={50}
            style={styles.logo}
            priority
          />
        ) : (
          <div style={styles.logoPlaceholder}>
            {branding.businessName?.charAt(0) || 'B'}
          </div>
        )}
        <div style={styles.headerButtons}>
          <button style={styles.backButton} onClick={() => router.push(paths.welcome)}>
            ← Menu
          </button>
          <button style={styles.newButton} onClick={() => router.push(paths.damageAssessmentsCreate)}>
            + New Assessment
          </button>
        </div>
      </div>

      <h1 style={styles.title}>Damage Assessments</h1>

      {error && (
        <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444', color: '#ff4444', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading assessments...</div>
      ) : assessments.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🚗</div>
          <div style={styles.emptyText}>No damage assessments yet</div>
          <button style={styles.newButton} onClick={() => router.push(paths.damageAssessmentsCreate)}>
            Create Your First Assessment
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {assessments.map((assessment) => (
            <div key={assessment.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.assessmentNumber}>{assessment.assessment_number}</span>
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

              <div style={styles.vehicleReg}>{assessment.vehicle_reg}</div>
              <div style={styles.vehicleInfo}>
                {[assessment.vehicle_make, assessment.vehicle_model].filter(Boolean).join(' ')}
              </div>
              <div style={styles.clientName}>{assessment.client_name}</div>

              {assessment.damage_description && (
                <div style={styles.damagePreview}>{assessment.damage_description}</div>
              )}

              <div style={styles.cardActions}>
                <button
                  style={styles.viewButton}
                  onClick={() => router.push(`${paths.damageAssessments}/view?id=${assessment.id}`)}
                >
                  View
                </button>
                <button
                  style={styles.shareButton}
                  onClick={() => handleShare(assessment)}
                >
                  Share
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => setDeleteModal({ show: true, assessment })}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
