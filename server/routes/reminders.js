import express from 'express';
import {
  getMedicineReminders,
  saveMedicineReminder,
  toggleMedicineTaken,
  deleteMedicineReminder,
  getAppointmentReminders,
  saveAppointmentReminder,
  deleteAppointmentReminder
} from '../db.js';

const router = express.Router();

// GET /api/reminders/medicines
router.get('/medicines', (req, res) => {
  try {
    const list = getMedicineReminders();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reminders/medicines
router.post('/medicines', (req, res) => {
  try {
    const body = req.body;
    const newMed = {
      id: body.id || `MED-${Date.now()}`,
      medicineName: body.medicineName || 'Unnamed Medicine',
      dosage: body.dosage || '1 Tablet',
      instructions: body.instructions || 'after_food',
      timings: body.timings || [{ timeSlot: 'morning', time: '08:00', takenToday: false }],
      frequency: body.frequency || 'daily',
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || undefined,
      doctorPrescribedBy: body.doctorPrescribedBy || 'Self-Scheduled (Prescribed)',
      active: true
    };
    const saved = saveMedicineReminder(newMed);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/reminders/medicines/:id/toggle
router.put('/medicines/:id/toggle', (req, res) => {
  try {
    const { slotIndex = 0 } = req.body;
    const updated = toggleMedicineTaken(req.params.id, slotIndex);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/reminders/medicines/:id
router.delete('/medicines/:id', (req, res) => {
  try {
    deleteMedicineReminder(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reminders/appointments
router.get('/appointments', (req, res) => {
  try {
    const list = getAppointmentReminders();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reminders/appointments
router.post('/appointments', (req, res) => {
  try {
    const body = req.body;
    const newApt = {
      id: body.id || `APT-${Date.now()}`,
      doctorOrClinic: body.doctorOrClinic || 'General OPD',
      department: body.department || 'Primary Care',
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '10:00 AM',
      location: body.location || 'Local Health Centre',
      preparationNotes: body.preparationNotes || ['Carry previous prescription slips'],
      status: 'upcoming'
    };
    const saved = saveAppointmentReminder(newApt);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/reminders/appointments/:id
router.delete('/appointments/:id', (req, res) => {
  try {
    deleteAppointmentReminder(req.params.id);
    res.json({ success: true, message: 'Appointment removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
