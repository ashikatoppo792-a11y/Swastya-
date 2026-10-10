import express from 'express';

const router = express.Router();

// In-memory / cache fallback for server
let donorRegistrations = [];
let bloodRequests = [
  {
    id: 'REQ-2026-001',
    reqNumber: 'BLD-REQ-8841',
    patientName: 'Subhashree Mohanty',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O-',
    component: 'PRBC (Red Cells)',
    unitsNeeded: 2,
    hospitalName: 'Capital Hospital Bhubaneswar',
    hospitalAddress: 'Ganga Nagar, Unit 6, Ward 4 Bed 12',
    city: 'Bhubaneswar',
    urgency: 'EMERGENCY_IMMEDIATE',
    attendantName: 'Alok Mohanty (Husband)',
    contactPhone: '+91 94371 88204',
    doctorPrescriptionVerified: true,
    notes: 'Postpartum hemorrhage emergency in labor room. Urgent O negative units required.',
    requestedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'OPEN_URGENT',
    fulfilledUnits: 1,
    responsesCount: 2
  },
  {
    id: 'REQ-2026-002',
    reqNumber: 'BLD-REQ-8842',
    patientName: 'Rohan Sharma',
    age: 9,
    gender: 'Male',
    bloodGroup: 'B+',
    component: 'Platelets (RDP/SDP)',
    unitsNeeded: 4,
    hospitalName: 'AIIMS Bhubaneswar Pediatric ICU',
    hospitalAddress: 'Sijua, Patrapada, PICU Bed 8',
    city: 'Bhubaneswar',
    urgency: 'URGENT_TODAY',
    attendantName: 'Manish Sharma (Father)',
    contactPhone: '+91 98765 21098',
    doctorPrescriptionVerified: true,
    notes: 'Severe Dengue with Thrombocytopenia (Platelets 18,000/mcL). Platelets needed urgently.',
    requestedAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    status: 'OPEN_URGENT',
    fulfilledUnits: 2,
    responsesCount: 3
  }
];

// GET /api/blood/requests
router.get('/requests', (req, res) => {
  res.json({
    success: true,
    count: bloodRequests.length,
    data: bloodRequests
  });
});

// POST /api/blood/requests
router.post('/requests', (req, res) => {
  const body = req.body;
  if (!body.patientName || !body.bloodGroup || !body.hospitalName || !body.contactPhone) {
    return res.status(400).json({ success: false, error: 'Missing required patient, hospital, or blood group details.' });
  }

  const newReq = {
    ...body,
    id: `REQ-${Date.now()}`,
    reqNumber: `BLD-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
    requestedAt: new Date().toISOString(),
    status: 'OPEN_URGENT',
    fulfilledUnits: 0,
    responsesCount: 0
  };

  bloodRequests.unshift(newReq);
  res.status(201).json({ success: true, data: newReq });
});

// PATCH /api/blood/requests/:id/fulfill
router.patch('/requests/:id/fulfill', (req, res) => {
  const { id } = req.params;
  const item = bloodRequests.find(r => r.id === id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Blood request not found.' });
  }

  item.fulfilledUnits = Math.min(item.unitsNeeded, item.fulfilledUnits + 1);
  item.responsesCount += 1;
  if (item.fulfilledUnits >= item.unitsNeeded) {
    item.status = 'FULFILLED';
  }

  res.json({ success: true, data: item });
});

// POST /api/blood/camps/register
router.post('/camps/register', (req, res) => {
  const body = req.body || {};
  const donorPhone = body.phone || body.donorPhone;
  if (!body.donorName || !body.bloodGroup || !donorPhone || !body.campId) {
    return res.status(400).json({ success: false, error: 'Missing donor registration details.' });
  }

  const registration = {
    ...body,
    phone: donorPhone,
    id: `DON-REG-${Date.now()}`,
    tokenNumber: `DON-${Math.floor(1000 + Math.random() * 9000)}`,
    registeredAt: new Date().toISOString(),
    status: 'confirmed'
  };

  donorRegistrations.unshift(registration);
  res.status(201).json({ success: true, data: registration });
});

export default router;
