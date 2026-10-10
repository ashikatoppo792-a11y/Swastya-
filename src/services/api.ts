import { Patient, FacilityProfile, AnalyticsData, AuditEntry } from '../types';

const API_BASE = '/api';
const OFFLINE_QUEUE_KEY = 'triage_offline_submissions';

// Check if currently online
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// Queue offline submission
export function queueOfflineSubmission(patient: Partial<Patient>): void {
  try {
    const existing = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    existing.push({
      ...patient,
      id: patient.id || `OFFLINE-${Date.now()}`,
      queuedAt: new Date().toISOString()
    });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to store offline submission', err);
  }
}

// Get offline queue count
export function getOfflineQueueCount(): number {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    return queue.length;
  } catch {
    return 0;
  }
}

// Flush and sync offline queue with backend
export async function syncOfflineQueue(): Promise<{ syncedCount: number }> {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    if (!queue || queue.length === 0) return { syncedCount: 0 };

    const res = await fetch(`${API_BASE}/patients/bulk-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissions: queue })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
      return { syncedCount: data.syncedCount || queue.length };
    }
  } catch (err) {
    console.warn('Sync failed, will retry later', err);
  }
  return { syncedCount: 0 };
}

// Patient API
export async function fetchPatients(params?: {
  status?: string;
  priority?: string;
  department?: string;
  search?: string;
}): Promise<Patient[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.priority) query.set('priority', params.priority);
  if (params?.department) query.set('department', params.department);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE}/patients?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch patients');
  const json = await res.json();
  return json.data || [];
}

export async function fetchPatientById(id: string): Promise<Patient> {
  const res = await fetch(`${API_BASE}/patients/${id}`);
  if (!res.ok) throw new Error('Patient not found');
  const json = await res.json();
  return json.data;
}

export async function submitPatientIntake(patientData: Partial<Patient>): Promise<Patient> {
  // If offline, queue locally
  if (!isOnline()) {
    queueOfflineSubmission(patientData);
    // Return mock offline patient
    return {
      id: `OFFLINE-${Date.now()}`,
      tokenNumber: `OFF-${Math.floor(100 + Math.random() * 900)}`,
      name: patientData.name || 'Anonymous',
      age: patientData.age || 30,
      sex: patientData.sex || 'Male',
      primaryLanguage: patientData.primaryLanguage || 'en',
      facilityId: 'FAC-OFFLINE',
      facilityName: 'Local Health Centre (Offline)',
      facilityType: 'PHC',
      checkInTime: new Date().toISOString(),
      status: 'pending_review',
      severity: patientData.severity || 5,
      chiefComplaint: patientData.chiefComplaint || 'Queued offline',
      vitals: patientData.vitals || {},
      auditTrail: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorName: 'Offline Kiosk',
          actorRole: 'Patient',
          action: 'offline_queued',
          details: 'Saved locally in low-connectivity buffer. Will sync when online.'
        }
      ]
    } as Patient;
  }

  const res = await fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });

  if (!res.ok) throw new Error('Failed to submit intake');
  const json = await res.json();
  return json.data;
}

// Clinician Actions
export async function performClinicianAction(payload: {
  patientId: string;
  action: 'approve' | 'edit_approve' | 'override' | 'reject' | 'request_info' | 'refer';
  clinicianName?: string;
  clinicianRole?: string;
  editedNote?: any;
  overrideReason?: string;
  newPriority?: string;
  referralDetails?: any;
  infoRequestText?: string;
}): Promise<Patient> {
  const res = await fetch(`${API_BASE}/clinician/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(errorJson.error || 'Failed to perform action');
  }
  const json = await res.json();
  return json.data;
}

export async function submitClinicianFeedback(payload: {
  patientId: string;
  clinicianName: string;
  rating: 'helpful' | 'incorrect' | 'partially_accurate';
  comment?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/clinician/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

// Analytics API
export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to load analytics');
  const json = await res.json();
  return json.data;
}

// Facility Profile API
export async function fetchFacilityProfile(): Promise<FacilityProfile> {
  const res = await fetch(`${API_BASE}/facility`);
  if (!res.ok) throw new Error('Failed to load facility');
  const json = await res.json();
  return json.data;
}

export async function updateFacilityProfile(updates: Partial<FacilityProfile>): Promise<FacilityProfile> {
  const res = await fetch(`${API_BASE}/facility`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update facility profile');
  const json = await res.json();
  return json.data;
}

// AI Services
export async function extractReportOCR(fileName: string, fileType?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/ai/extract-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, fileType })
  });
  const json = await res.json();
  return json.data;
}

export async function translateSymptomText(text: string, sourceLanguage: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/ai/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceLanguage })
    });
    const json = await res.json();
    return json.translatedText || text;
  } catch {
    return text;
  }
}

// Medicine Reminders API
const LOCAL_MEDS_KEY = 'triage_medicine_reminders';

export async function fetchMedicineReminders(): Promise<import('../types').MedicineReminder[]> {
  try {
    const res = await fetch(`${API_BASE}/reminders/medicines`);
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem(LOCAL_MEDS_KEY, JSON.stringify(json.data));
      return json.data;
    }
  } catch {}
  return JSON.parse(localStorage.getItem(LOCAL_MEDS_KEY) || '[]');
}

export async function addMedicineReminder(med: Partial<import('../types').MedicineReminder>): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/reminders/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(med)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {}
  const list = JSON.parse(localStorage.getItem(LOCAL_MEDS_KEY) || '[]');
  const newMed = { ...med, id: `MED-${Date.now()}`, active: true };
  list.unshift(newMed);
  localStorage.setItem(LOCAL_MEDS_KEY, JSON.stringify(list));
  return newMed;
}

export async function toggleMedicineTaken(id: string, slotIndex = 0): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/reminders/medicines/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotIndex })
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {}
  const list = JSON.parse(localStorage.getItem(LOCAL_MEDS_KEY) || '[]');
  const med = list.find((m: any) => m.id === id);
  if (med && med.timings && med.timings[slotIndex]) {
    med.timings[slotIndex].takenToday = !med.timings[slotIndex].takenToday;
    localStorage.setItem(LOCAL_MEDS_KEY, JSON.stringify(list));
  }
  return med;
}

export async function deleteMedicineReminder(id: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/reminders/medicines/${id}`, { method: 'DELETE' });
  } catch {}
  const list = JSON.parse(localStorage.getItem(LOCAL_MEDS_KEY) || '[]');
  const filtered = list.filter((m: any) => m.id !== id);
  localStorage.setItem(LOCAL_MEDS_KEY, JSON.stringify(filtered));
  return true;
}

// Appointment Reminders API
const LOCAL_APTS_KEY = 'triage_appointment_reminders';

export async function fetchAppointmentReminders(): Promise<import('../types').AppointmentReminder[]> {
  try {
    const res = await fetch(`${API_BASE}/reminders/appointments`);
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem(LOCAL_APTS_KEY, JSON.stringify(json.data));
      return json.data;
    }
  } catch {}
  return JSON.parse(localStorage.getItem(LOCAL_APTS_KEY) || '[]');
}

export async function addAppointmentReminder(apt: Partial<import('../types').AppointmentReminder>): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/reminders/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apt)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {}
  const list = JSON.parse(localStorage.getItem(LOCAL_APTS_KEY) || '[]');
  const newApt = { ...apt, id: `APT-${Date.now()}`, status: 'upcoming' };
  list.unshift(newApt);
  localStorage.setItem(LOCAL_APTS_KEY, JSON.stringify(list));
  return newApt;
}

export async function deleteAppointmentReminder(id: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/reminders/appointments/${id}`, { method: 'DELETE' });
  } catch {}
  const list = JSON.parse(localStorage.getItem(LOCAL_APTS_KEY) || '[]');
  const filtered = list.filter((a: any) => a.id !== id);
  localStorage.setItem(LOCAL_APTS_KEY, JSON.stringify(filtered));
  return true;
}

