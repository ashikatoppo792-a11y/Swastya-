import express from 'express';
import { getFacilityProfile, updateFacilityProfile } from '../db.js';

const router = express.Router();

// Sample Facility Directory for Backend API fallback
const SERVER_SEED_FACILITIES = [
  {
    id: 'aiims-bbsr',
    name: 'AIIMS Bhubaneswar (Apex Trauma Centre)',
    type: 'hospital',
    ownership: 'government',
    lat: 20.2289,
    lng: 85.7766,
    address: 'Sijua, Patrapada, Bhubaneswar, Odisha 751019',
    phone: '+91-674-2476789',
    openNow: true,
    hours: '24 Hours Emergency',
    emergencyAvailable: true,
    specialities: ['Emergency & Trauma', 'Cardiology', 'Neurology', 'Pediatrics', 'Critical Care'],
    rating: 4.8,
    pmjayEmpanelled: true
  },
  {
    id: 'cap-hosp-bbsr',
    name: 'Capital Hospital Bhubaneswar',
    type: 'hospital',
    ownership: 'government',
    lat: 20.2644,
    lng: 85.8249,
    address: 'Unit 6, Ganga Nagar, Bhubaneswar, Odisha 751001',
    phone: '+91-674-2391983',
    openNow: true,
    hours: '24 Hours Emergency',
    emergencyAvailable: true,
    specialities: ['General Medicine', 'Obstetrics & Gynecology', 'Trauma Care'],
    rating: 4.3,
    pmjayEmpanelled: true
  },
  {
    id: 'phc-chandrasekharpur',
    name: 'Primary Health Centre (PHC) Chandrasekharpur',
    type: 'PHC',
    ownership: 'government',
    lat: 20.3235,
    lng: 85.8209,
    address: 'Sailashree Vihar, Bhubaneswar, Odisha 751021',
    phone: '+91-674-2741120',
    openNow: true,
    hours: '8:00 AM - 5:00 PM',
    emergencyAvailable: false,
    specialities: ['General OPD', 'Maternal & Child Health', 'Immunization'],
    rating: 4.2,
    pmjayEmpanelled: false
  },
  {
    id: 'jan-aushadhi-bbsr',
    name: 'Pradhan Mantri Jan Aushadhi Kendra - Master Canteen',
    type: 'pharmacy',
    ownership: 'government',
    lat: 20.2678,
    lng: 85.8402,
    address: 'Master Canteen, Bhubaneswar, Odisha 751001',
    phone: '+91-9437012345',
    openNow: true,
    hours: '8:00 AM - 10:00 PM',
    emergencyAvailable: false,
    specialities: ['Affordable Generic Medicines', 'Chronic Care Refills'],
    rating: 4.7,
    pmjayEmpanelled: false
  }
];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

// GET /api/facility
router.get('/', (req, res) => {
  try {
    const facility = getFacilityProfile();
    res.json({ success: true, data: facility });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/facility/nearby
router.get('/nearby', (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 20.2961;
    const lng = req.query.lng ? parseFloat(req.query.lng) : 85.8245;
    const radius = req.query.radius ? parseFloat(req.query.radius) : 25;
    const emergencyOnly = req.query.emergency === 'true';

    const results = SERVER_SEED_FACILITIES.map((f) => {
      const distanceKm = haversine(lat, lng, f.lat, f.lng);
      return {
        ...f,
        distanceKm,
        estimatedTravelTimeMin: Math.max(3, Math.round((distanceKm / 25) * 60))
      };
    })
      .filter((f) => f.distanceKm <= radius && (!emergencyOnly || f.emergencyAvailable))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/facility/referral
router.post('/referral', (req, res) => {
  try {
    const referral = {
      ...req.body,
      id: `REF-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    res.status(201).json({ success: true, data: referral });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/facility
router.put('/', (req, res) => {
  try {
    const updates = req.body;
    const updated = updateFacilityProfile(updates);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
