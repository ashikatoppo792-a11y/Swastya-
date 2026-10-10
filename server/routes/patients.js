import express from 'express';
import { getAllPatients, getPatientById, savePatient, addAuditEntry, getFacilityProfile } from '../db.js';
import { generateTriageNote } from '../services/aiTriageService.js';

const router = express.Router();

// GET /api/patients
router.get('/', (req, res) => {
  try {
    const { status, priority, department, search } = req.query;
    let patients = getAllPatients();

    if (status && status !== 'all') {
      patients = patients.filter(p => p.status === status);
    }
    if (priority && priority !== 'all') {
      patients = patients.filter(p => p.triageNote?.suggestedPriority?.toLowerCase() === priority.toLowerCase());
    }
    if (department && department !== 'all') {
      patients = patients.filter(p => p.triageNote?.suggestedDepartment?.toLowerCase().includes(department.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      patients = patients.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tokenNumber.toLowerCase().includes(q) ||
        (p.chiefComplaint && p.chiefComplaint.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/patients/:id
router.get('/:id', (req, res) => {
  try {
    const patient = getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/patients - Create new patient intake
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const facility = getFacilityProfile();
    const currentPatients = getAllPatients();

    // Generate token number like "E-105" or "A-109"
    const nextNum = currentPatients.length + 101;
    const tokenNumber = `TK-${nextNum}`;
    const id = `PT-${Date.now()}`;

    // Language symptom translation if provided
    let voiceTranscriptEn = body.voiceTranscriptEn || body.voiceTranscript || body.chiefComplaint;
    if (!body.voiceTranscriptEn && body.voiceTranscript) {
      // In production, plug in translation API (Google Cloud Translate / Bhashini API)
      voiceTranscriptEn = `[Patient voice transcript translated to English]: ${body.voiceTranscript}`;
    }

    const patientObj = {
      id,
      tokenNumber,
      name: body.name || 'Anonymous Patient',
      age: Number(body.age) || 30,
      sex: body.sex || 'Other',
      bloodGroup: body.bloodGroup || 'Unknown',
      phone: body.phone || '',
      aadhaarLast4: body.aadhaarLast4 || '',
      primaryLanguage: body.primaryLanguage || 'en',
      facilityId: facility.id,
      facilityName: facility.name,
      facilityType: facility.facilityType,
      checkInTime: new Date().toISOString(),
      status: 'pending_review',
      bodyArea: body.bodyArea || 'chest',
      duration: body.duration || 'recent',
      severity: Number(body.severity) || 5,
      pregnant: Boolean(body.pregnant),
      pregnancyTrimester: body.pregnancyTrimester || '',
      chronicConditions: body.chronicConditions || [],
      currentMedicines: body.currentMedicines || [],
      allergies: body.allergies || [],
      chiefComplaint: body.chiefComplaint || body.voiceTranscript || 'Patient reported symptoms',
      voiceTranscript: body.voiceTranscript || '',
      voiceTranscriptEn,
      vitals: body.vitals || {
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        pulseRate: 76,
        spo2: 98,
        temperatureF: 98.6,
        respiratoryRate: 18,
      },
      reports: body.reports || [],
      photos: body.photos || [],
      auditTrail: [
        {
          id: `AUD-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          actorName: body.actorName || 'Self-Intake Kiosk',
          actorRole: body.actorRole || 'Patient',
          action: 'intake_submitted',
          details: `Patient intake recorded in language '${body.primaryLanguage}'. DPDP Act consent logged.`
        }
      ]
    };

    // Run AI Triage Engine
    const triageNote = await generateTriageNote(patientObj, facility);
    patientObj.triageNote = triageNote;

    // Add AI generation audit entry
    patientObj.auditTrail.unshift({
      id: `AUD-${Date.now()}-2`,
      timestamp: new Date().toISOString(),
      actorName: 'TriageAssist AI Engine v2.4',
      actorRole: 'AI Assistant',
      action: 'note_generated',
      details: `Generated triage recommendation: ${triageNote.suggestedPriority}. Confidence: ${Math.round(triageNote.confidenceScore * 100)}%. Red flags: ${triageNote.redFlagsDetected?.length || 0}.`
    });

    const saved = savePatient(patientObj);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('Error in patient intake:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/patients/bulk-sync (Sync offline submissions)
router.post('/bulk-sync', async (req, res) => {
  try {
    const { submissions } = req.body;
    if (!Array.isArray(submissions) || submissions.length === 0) {
      return res.json({ success: true, syncedCount: 0 });
    }

    const facility = getFacilityProfile();
    const synced = [];

    for (const item of submissions) {
      // Check if already exists
      const existing = getPatientById(item.id);
      if (!existing) {
        if (!item.triageNote) {
          item.triageNote = await generateTriageNote(item, facility);
        }
        item.auditTrail = item.auditTrail || [];
        item.auditTrail.unshift({
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorName: 'Sync Worker',
          actorRole: 'System',
          action: 'offline_synced',
          details: 'Queued offline submission synchronized successfully with facility server.'
        });
        savePatient(item);
        synced.push(item.id);
      }
    }

    res.json({ success: true, syncedCount: synced.length, ids: synced });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
