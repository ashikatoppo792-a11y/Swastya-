import express from 'express';
import { getPatientById, savePatient, addAuditEntry, addClinicianFeedback, getFeedbacks } from '../db.js';

const router = express.Router();

// POST /api/clinician/action - Clinician reviews, edits, approves, overrides, or refers
router.post('/action', (req, res) => {
  try {
    const {
      patientId,
      action, // 'approve' | 'edit_approve' | 'override' | 'reject' | 'request_info' | 'refer'
      clinicianName = 'Dr. Rajesh Rao, Medical Officer',
      clinicianRole = 'Medical Officer',
      editedNote,
      overrideReason,
      newPriority,
      referralDetails,
      infoRequestText
    } = req.body;

    const patient = getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    let auditAction = action;
    let auditDetails = '';

    if (action === 'approve') {
      patient.status = 'approved';
      auditDetails = `Clinician validated and approved AI triage note without changes. Priority confirmed as: ${patient.triageNote.suggestedPriority}.`;
    } else if (action === 'edit_approve') {
      patient.status = 'approved';
      if (editedNote) {
        patient.triageNote = { ...patient.triageNote, ...editedNote };
      }
      auditDetails = `Clinician edited clinical summary and approved note. Prior clinical observations updated.`;
    } else if (action === 'override') {
      if (!overrideReason || !overrideReason.trim()) {
        return res.status(400).json({ success: false, error: 'Clinical override reason is strictly required.' });
      }
      const previousPriority = patient.triageNote.suggestedPriority;
      patient.triageNote.suggestedPriority = newPriority || previousPriority;
      patient.triageNote.overrideJustification = overrideReason;
      patient.status = 'overridden';
      auditDetails = `Clinician overrode AI priority from '${previousPriority}' to '${newPriority}'. Justification: "${overrideReason}".`;
    } else if (action === 'refer') {
      patient.status = 'referred';
      patient.referralInfo = {
        referredAt: new Date().toISOString(),
        referredBy: `${clinicianName} (${clinicianRole})`,
        destinationFacility: referralDetails?.destinationFacility || 'District Hospital Barabanki',
        referralUrgency: referralDetails?.urgency || 'Immediate 108 Ambulance Dispatch',
        transportType: referralDetails?.transportType || '108 ALS Ambulance',
        clinicalHandoverSummary: referralDetails?.clinicalSummary || patient.triageNote?.chiefComplaintSummary,
        eSanjeevaniTeleconsultId: referralDetails?.teleconsultId || `eSANJ-${Math.floor(100000 + Math.random() * 900000)}`
      };
      auditDetails = `Clinician issued formal clinical referral to ${patient.referralInfo.destinationFacility} via ${patient.referralInfo.transportType}.`;
    } else if (action === 'reject') {
      patient.status = 'rejected';
      auditDetails = `Clinician rejected AI triage draft. Reason: "${overrideReason || 'Case reassigned for in-person primary clinical workup.'}".`;
    } else if (action === 'request_info') {
      patient.status = 'pending_review';
      patient.infoRequested = {
        requestedAt: new Date().toISOString(),
        requestedBy: clinicianName,
        query: infoRequestText || 'Please clarify symptom onset and repeat BP measurement.'
      };
      auditDetails = `Clinician requested additional patient information: "${patient.infoRequested.query}".`;
    }

    // Append to immutable audit trail
    if (!patient.auditTrail) patient.auditTrail = [];
    patient.auditTrail.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: clinicianName,
      actorRole: clinicianRole,
      action: auditAction,
      details: auditDetails
    });

    const updated = savePatient(patient);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/clinician/audit/:id
router.get('/audit/:id', (req, res) => {
  try {
    const patient = getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.json({ success: true, data: patient.auditTrail || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/clinician/feedback - Continuous AI Improvement Loop
router.post('/feedback', (req, res) => {
  try {
    const { patientId, clinicianName, rating, comment } = req.body;
    if (!patientId || !rating) {
      return res.status(400).json({ success: false, error: 'Patient ID and rating are required.' });
    }
    const feedback = addClinicianFeedback({
      patientId,
      clinicianName: clinicianName || 'Attending Clinician',
      rating, // 'helpful' | 'incorrect' | 'partially_accurate'
      comment: comment || ''
    });

    // Also record feedback in the patient audit trail
    addAuditEntry(patientId, {
      actorName: clinicianName || 'Attending Clinician',
      actorRole: 'Clinician / Evaluator',
      action: 'ai_feedback_submitted',
      details: `Clinician submitted feedback on AI note: Rating=${rating}. Note: "${comment || 'No comment'}".`
    });

    res.json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/clinician/feedbacks
router.get('/feedbacks', (req, res) => {
  try {
    const feedbacks = getFeedbacks();
    res.json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
