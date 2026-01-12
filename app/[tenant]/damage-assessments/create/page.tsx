'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useTenant, useTenantPath } from '@/lib/tenant/TenantProvider';

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
  } as React.CSSProperties,
  logo: {
    height: '50px',
    width: 'auto',
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#30ff37',
  } as React.CSSProperties,
  section: {
    marginBottom: '30px',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '16px',
    color: '#888',
    marginBottom: '15px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    borderBottom: '1px solid #333',
    paddingBottom: '10px',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  } as React.CSSProperties,
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  } as React.CSSProperties,
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,
  label: {
    fontSize: '14px',
    color: '#888',
  } as React.CSSProperties,
  required: {
    color: '#ff4444',
  } as React.CSSProperties,
  input: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '15px',
    color: '#fff',
    fontSize: '16px',
  } as React.CSSProperties,
  textarea: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '15px',
    color: '#fff',
    fontSize: '16px',
    minHeight: '100px',
    resize: 'vertical' as const,
  } as React.CSSProperties,
  damageLocations: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
  } as React.CSSProperties,
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
  } as React.CSSProperties,
  checkboxChecked: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: 'rgba(48, 255, 55, 0.1)',
    border: '1px solid #30ff37',
    borderRadius: '8px',
    cursor: 'pointer',
  } as React.CSSProperties,
  checkboxInput: {
    width: '18px',
    height: '18px',
    accentColor: '#30ff37',
  } as React.CSSProperties,
  buttonRow: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  } as React.CSSProperties,
  draftButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    flex: 1,
  } as React.CSSProperties,
  submitButton: {
    backgroundColor: '#30ff37',
    color: '#000',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    flex: 1,
  } as React.CSSProperties,
  submitButtonDisabled: {
    backgroundColor: '#333',
    color: '#666',
    cursor: 'not-allowed',
  } as React.CSSProperties,
  error: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid #ff4444',
    color: '#ff4444',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  } as React.CSSProperties,
  loadingOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  } as React.CSSProperties,
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #333',
    borderTop: '4px solid #30ff37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  } as React.CSSProperties,
  loadingText: {
    marginTop: '20px',
    color: '#30ff37',
    fontSize: '18px',
  } as React.CSSProperties,
};

const damageLocationOptions = [
  { key: 'front', label: 'Front' },
  { key: 'rear', label: 'Rear' },
  { key: 'left', label: 'Left Side' },
  { key: 'right', label: 'Right Side' },
  { key: 'top', label: 'Roof/Top' },
  { key: 'underside', label: 'Underside' },
];

export default function CreateDamageAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenant = useTenant();
  const paths = useTenantPath();

  const editId = searchParams.get('id');
  const isEditing = !!editId;

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [mileage, setMileage] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [damageLocations, setDamageLocations] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('bd_logged_in');
    if (!token) {
      router.push(paths.welcome);
      return;
    }

    if (isEditing) {
      fetchAssessment();
    }
  }, [router, paths, isEditing, editId]);

  const fetchAssessment = async () => {
    try {
      const token = localStorage.getItem('bd_logged_in');
      const response = await fetch(`/api/autow/damage-assessment/get?id=${editId}`, {
        headers: {
          'X-Tenant-Slug': tenant.slug,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assessment');
      }

      const data = await response.json();
      const a = data.assessment;

      setClientName(a.client_name || '');
      setClientEmail(a.client_email || '');
      setClientPhone(a.client_phone || '');
      setVehicleReg(a.vehicle_reg || '');
      setVehicleMake(a.vehicle_make || '');
      setVehicleModel(a.vehicle_model || '');
      setVehicleYear(a.vehicle_year || '');
      setVehicleColor(a.vehicle_color || '');
      setMileage(a.mileage?.toString() || '');
      setDamageDescription(a.damage_description || '');
      setDamageLocations(a.damage_locations || {});
      setNotes(a.notes || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const toggleDamageLocation = (key: string) => {
    setDamageLocations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (saveAsDraft: boolean = false) => {
    setError(null);

    if (!clientName.trim()) {
      setError('Client name is required');
      return;
    }
    if (!vehicleReg.trim()) {
      setError('Vehicle registration is required');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('bd_logged_in');
      const endpoint = isEditing
        ? '/api/autow/damage-assessment/update'
        : '/api/autow/damage-assessment/create';

      const body: any = {
        client_name: clientName.trim(),
        client_email: clientEmail.trim() || null,
        client_phone: clientPhone.trim() || null,
        vehicle_reg: vehicleReg.trim().toUpperCase(),
        vehicle_make: vehicleMake.trim() || null,
        vehicle_model: vehicleModel.trim() || null,
        vehicle_year: vehicleYear.trim() || null,
        vehicle_color: vehicleColor.trim() || null,
        mileage: mileage ? parseInt(mileage) : null,
        damage_description: damageDescription.trim() || null,
        damage_locations: damageLocations,
        notes: notes.trim() || null,
        status: saveAsDraft ? 'draft' : 'pending',
      };

      if (isEditing) {
        body.id = parseInt(editId!);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save assessment');
      }

      router.push(paths.damageAssessments);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = clientName.trim() && vehicleReg.trim();

  if (loadingData) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <div style={styles.loadingText}>Loading assessment...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <div style={styles.loadingText}>Saving assessment...</div>
        </div>
      )}

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

      <h1 style={styles.title}>{isEditing ? 'Edit Assessment' : 'New Damage Assessment'}</h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.form}>
        {/* Client Information */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Client Information</div>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Client Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Full name"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Phone number"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Email address"
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Vehicle Information</div>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Registration <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                placeholder="e.g., AB12 CDE"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Make</label>
              <input
                type="text"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                placeholder="e.g., Ford"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Model</label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g., Focus"
                style={styles.input}
              />
            </div>
          </div>
          <div style={{ ...styles.row, marginTop: '15px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Year</label>
              <input
                type="text"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
                placeholder="e.g., 2020"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Color</label>
              <input
                type="text"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                placeholder="e.g., Silver"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mileage</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g., 45000"
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Damage Details */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Damage Details</div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Damage Locations</label>
            <div style={styles.damageLocations}>
              {damageLocationOptions.map((loc) => (
                <div
                  key={loc.key}
                  style={damageLocations[loc.key] ? styles.checkboxChecked : styles.checkbox}
                  onClick={() => toggleDamageLocation(loc.key)}
                >
                  <input
                    type="checkbox"
                    checked={damageLocations[loc.key] || false}
                    onChange={() => toggleDamageLocation(loc.key)}
                    style={styles.checkboxInput}
                  />
                  <span>{loc.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...styles.formGroup, marginTop: '15px' }}>
            <label style={styles.label}>Damage Description</label>
            <textarea
              value={damageDescription}
              onChange={(e) => setDamageDescription(e.target.value)}
              placeholder="Describe the damage in detail..."
              style={styles.textarea}
            />
          </div>

          <div style={{ ...styles.formGroup, marginTop: '15px' }}>
            <label style={styles.label}>Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              style={styles.textarea}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div style={styles.buttonRow}>
          <button
            onClick={() => handleSubmit(true)}
            disabled={!isFormValid || loading}
            style={{
              ...styles.draftButton,
              ...((!isFormValid || loading) ? styles.submitButtonDisabled : {}),
            }}
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={!isFormValid || loading}
            style={{
              ...styles.submitButton,
              ...((!isFormValid || loading) ? styles.submitButtonDisabled : {}),
            }}
          >
            {isEditing ? 'Update Assessment' : 'Create Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
}
