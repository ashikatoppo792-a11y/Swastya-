import {
  BloodDonationCamp,
  BloodBankFacility,
  DonorRegistration,
  BloodRequest,
  BloodGroup,
  BloodComponent
} from '../types';
import { calculateHaversineDistance } from '../features/nearby-care/utils/haversine';

// -------------------------------------------------------------
// Seed Blood Donation Camps
// -------------------------------------------------------------
export const seedBloodDonationCamps: BloodDonationCamp[] = [
  {
    id: 'CAMP-BBSR-01',
    name: 'Red Cross Voluntary Blood Donation Mega Camp',
    organizer: 'Indian Red Cross Society, Odisha State Branch',
    venue: 'Red Cross Bhavan, Unit-IX, Near Sachivalaya Marg',
    city: 'Bhubaneswar',
    state: 'Odisha',
    lat: 20.2885,
    lng: 85.8398,
    startDate: '2026-10-10',
    endDate: '2026-10-12',
    timings: '09:00 AM - 05:30 PM',
    phone: '+91-674-2391479',
    status: 'ongoing',
    criticalBloodNeeded: ['O-', 'B+', 'AB-', 'A-'],
    facilities: [
      'AC Mobile Blood Collection Bus',
      'Doctor Pre-Check & Vitals on-site',
      'Nutritional Snacks & Juice',
      'State Blood Transfusion Certificate',
      'ABHA ID Linking'
    ],
    targetUnits: 250,
    collectedUnits: 142,
    slotsAvailable: ['09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM']
  },
  {
    id: 'CAMP-BBSR-02',
    name: 'AIIMS Community Youth Blood & Platelet Drive',
    organizer: 'AIIMS Bhubaneswar Dept of Transfusion Medicine',
    venue: 'Community Hall, Patrapada, Near AIIMS Main Gate',
    city: 'Bhubaneswar',
    state: 'Odisha',
    lat: 20.2289,
    lng: 85.7766,
    startDate: '2026-10-11',
    endDate: '2026-10-11',
    timings: '08:30 AM - 04:00 PM',
    phone: '+91-674-2476789',
    status: 'upcoming',
    criticalBloodNeeded: ['O+', 'O-', 'A+', 'B-'],
    facilities: [
      'Single Donor Platelet (SDP) Apheresis Facility',
      'Rapid Hemoglobin Testing',
      'Doctor Consultation',
      'Digital Donor Card & Badge'
    ],
    targetUnits: 180,
    collectedUnits: 28,
    slotsAvailable: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM']
  },
  {
    id: 'CAMP-BBSR-03',
    name: 'Rotary Club Chandrasekharpur Blood Donation Camp',
    organizer: 'Rotary Club of Bhubaneswar & Capital Blood Centre',
    venue: 'Sailashree Vihar Community Centre, Chandrasekharpur',
    city: 'Bhubaneswar',
    state: 'Odisha',
    lat: 20.3235,
    lng: 85.8209,
    startDate: '2026-10-12',
    endDate: '2026-10-13',
    timings: '10:00 AM - 05:00 PM',
    phone: '+91-94370-12844',
    status: 'upcoming',
    criticalBloodNeeded: ['B+', 'O+', 'AB+'],
    facilities: [
      'Air-conditioned Rest Area',
      'Sterile Single-Use Kits',
      'Refreshments & Energy Drinks',
      'Donor Recognition Token'
    ],
    targetUnits: 120,
    collectedUnits: 0,
    slotsAvailable: ['10:30 AM', '11:30 AM', '12:30 PM', '02:30 PM', '04:00 PM']
  },
  {
    id: 'CAMP-UP-01',
    name: 'District Hospital Barabanki Voluntary Blood Drive',
    organizer: 'Uttar Pradesh State Blood Transfusion Council',
    venue: 'District Combined Hospital Blood Centre Hall',
    city: 'Barabanki',
    state: 'Uttar Pradesh',
    lat: 26.9272,
    lng: 81.1834,
    startDate: '2026-10-10',
    endDate: '2026-10-11',
    timings: '09:00 AM - 04:30 PM',
    phone: '+91-5248-222410',
    status: 'ongoing',
    criticalBloodNeeded: ['O-', 'A-', 'B-', 'O+'],
    facilities: [
      'Medical Officer Supervision',
      'Free Blood Group Testing',
      'Iron & Calcium Advisory',
      'Government Donor Certificate'
    ],
    targetUnits: 150,
    collectedUnits: 88,
    slotsAvailable: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM']
  },
  {
    id: 'CAMP-GUJ-01',
    name: 'Red Cross Ahmedabad Industrial Workers Blood Camp',
    organizer: 'Red Cross Society Gujarat & Sanand Health Centre',
    venue: 'Sanand GIDC Industrial Welfare Hall, Sanand',
    city: 'Ahmedabad',
    state: 'Gujarat',
    lat: 22.9868,
    lng: 72.3812,
    startDate: '2026-10-10',
    endDate: '2026-10-11',
    timings: '09:30 AM - 05:00 PM',
    phone: '+91-79-27557000',
    status: 'ongoing',
    criticalBloodNeeded: ['B+', 'O-', 'AB+'],
    facilities: [
      'Mobile Blood Van',
      'Free Health & Vitals Check',
      'Refreshment Kits',
      'Donor Privilege Card'
    ],
    targetUnits: 200,
    collectedUnits: 130,
    slotsAvailable: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM']
  }
];

// -------------------------------------------------------------
// Seed Licensed Blood Banks & Live Inventory
// -------------------------------------------------------------
export const seedBloodBanks: BloodBankFacility[] = [
  {
    id: 'BB-01',
    bloodBankName: 'Capital Hospital Model Blood Centre',
    category: 'Government Blood Centre',
    address: 'Unit 6, Ganga Nagar, Near AG Square, Bhubaneswar',
    city: 'Bhubaneswar',
    lat: 20.2644,
    lng: 85.8249,
    phone: '+91-674-2391983',
    is24x7: true,
    lastUpdated: 'Today at 02:30 PM',
    inventory: {
      'A+': { wholeBlood: 18, prbc: 24, platelets: 12, ffp: 16 },
      'A-': { wholeBlood: 4, prbc: 5, platelets: 2, ffp: 3 },
      'B+': { wholeBlood: 28, prbc: 35, platelets: 16, ffp: 22 },
      'B-': { wholeBlood: 3, prbc: 4, platelets: 1, ffp: 2 },
      'AB+': { wholeBlood: 14, prbc: 18, platelets: 8, ffp: 12 },
      'AB-': { wholeBlood: 2, prbc: 2, platelets: 1, ffp: 2 },
      'O+': { wholeBlood: 32, prbc: 40, platelets: 20, ffp: 25 },
      'O-': { wholeBlood: 1, prbc: 2, platelets: 1, ffp: 2 }
    }
  },
  {
    id: 'BB-02',
    bloodBankName: 'AIIMS Bhubaneswar Regional Blood Centre',
    category: 'Government Blood Centre',
    address: 'Sijua, Patrapada, Bhubaneswar, Odisha 751019',
    city: 'Bhubaneswar',
    lat: 20.2289,
    lng: 85.7766,
    phone: '+91-674-2476789',
    is24x7: true,
    lastUpdated: 'Today at 03:15 PM',
    inventory: {
      'A+': { wholeBlood: 22, prbc: 30, platelets: 18, ffp: 20 },
      'A-': { wholeBlood: 6, prbc: 8, platelets: 4, ffp: 5 },
      'B+': { wholeBlood: 34, prbc: 42, platelets: 22, ffp: 28 },
      'B-': { wholeBlood: 5, prbc: 6, platelets: 3, ffp: 4 },
      'AB+': { wholeBlood: 16, prbc: 20, platelets: 10, ffp: 14 },
      'AB-': { wholeBlood: 3, prbc: 3, platelets: 2, ffp: 2 },
      'O+': { wholeBlood: 40, prbc: 52, platelets: 26, ffp: 32 },
      'O-': { wholeBlood: 4, prbc: 5, platelets: 2, ffp: 3 }
    }
  },
  {
    id: 'BB-03',
    bloodBankName: 'Indian Red Cross Society Central Blood Bank',
    category: 'Red Cross',
    address: 'Red Cross Bhavan, Unit-IX, Sachivalaya Marg, Bhubaneswar',
    city: 'Bhubaneswar',
    lat: 20.2885,
    lng: 85.8398,
    phone: '+91-674-2391479',
    is24x7: true,
    lastUpdated: 'Today at 01:45 PM',
    inventory: {
      'A+': { wholeBlood: 14, prbc: 18, platelets: 10, ffp: 12 },
      'A-': { wholeBlood: 2, prbc: 3, platelets: 1, ffp: 1 },
      'B+': { wholeBlood: 20, prbc: 26, platelets: 14, ffp: 18 },
      'B-': { wholeBlood: 2, prbc: 2, platelets: 1, ffp: 1 },
      'AB+': { wholeBlood: 10, prbc: 12, platelets: 6, ffp: 8 },
      'AB-': { wholeBlood: 1, prbc: 1, platelets: 0, ffp: 1 },
      'O+': { wholeBlood: 25, prbc: 30, platelets: 15, ffp: 20 },
      'O-': { wholeBlood: 0, prbc: 1, platelets: 0, ffp: 1 }
    }
  },
  {
    id: 'BB-04',
    bloodBankName: 'Barabanki District Hospital Blood Bank',
    category: 'Government Blood Centre',
    address: 'Civil Lines, Near DM Office, Barabanki',
    city: 'Barabanki',
    lat: 26.9272,
    lng: 81.1834,
    phone: '+91-5248-222410',
    is24x7: true,
    lastUpdated: 'Today at 12:00 PM',
    inventory: {
      'A+': { wholeBlood: 12, prbc: 15, platelets: 6, ffp: 8 },
      'A-': { wholeBlood: 1, prbc: 2, platelets: 1, ffp: 1 },
      'B+': { wholeBlood: 22, prbc: 28, platelets: 10, ffp: 14 },
      'B-': { wholeBlood: 2, prbc: 3, platelets: 1, ffp: 2 },
      'AB+': { wholeBlood: 8, prbc: 10, platelets: 4, ffp: 6 },
      'AB-': { wholeBlood: 1, prbc: 1, platelets: 0, ffp: 1 },
      'O+': { wholeBlood: 20, prbc: 26, platelets: 12, ffp: 16 },
      'O-': { wholeBlood: 1, prbc: 1, platelets: 0, ffp: 1 }
    }
  }
];

// -------------------------------------------------------------
// Seed Live Urgent Blood Requests (Recipients / Takers)
// -------------------------------------------------------------
export const seedBloodRequests: BloodRequest[] = [
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
    alternatePhone: '+91 98610 44211',
    doctorPrescriptionVerified: true,
    notes: 'Postpartum hemorrhage emergency in labor room. Urgent O negative units required.',
    requestedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45m ago
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
    notes: 'Severe Dengue with Thrombocytopenia (Platelets dropped to 18,000/mcL). Random donor or single donor platelets needed.',
    requestedAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(), // ~2.3h ago
    status: 'OPEN_URGENT',
    fulfilledUnits: 2,
    responsesCount: 3
  },
  {
    id: 'REQ-2026-003',
    reqNumber: 'BLD-REQ-8843',
    patientName: 'Kailash Nath Verma',
    age: 62,
    gender: 'Male',
    bloodGroup: 'AB-',
    component: 'Whole Blood',
    unitsNeeded: 2,
    hospitalName: 'District Combined Hospital Barabanki',
    hospitalAddress: 'Emergency Surgery OT, Barabanki',
    city: 'Barabanki',
    urgency: 'EMERGENCY_IMMEDIATE',
    attendantName: 'Ravi Verma (Son)',
    contactPhone: '+91 94500 78219',
    doctorPrescriptionVerified: true,
    notes: 'Emergency polytrauma laparotomy. Rare AB Negative blood needed.',
    requestedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25m ago
    status: 'OPEN_URGENT',
    fulfilledUnits: 0,
    responsesCount: 1
  }
];

// -------------------------------------------------------------
// Storage Keys
// -------------------------------------------------------------
const STORAGE_DONORS_KEY = 'swasthya_donor_registrations';
const STORAGE_REQUESTS_KEY = 'swasthya_blood_requests';

// -------------------------------------------------------------
// Functions for Camps & Donors
// -------------------------------------------------------------
export function getBloodCamps(userLat?: number, userLng?: number): BloodDonationCamp[] {
  return seedBloodDonationCamps.map((camp) => {
    let distanceKm: number | undefined = undefined;
    if (userLat != null && userLng != null) {
      distanceKm = calculateHaversineDistance(userLat, userLng, camp.lat, camp.lng);
    }
    return {
      ...camp,
      distanceKm
    };
  }).sort((a, b) => {
    if (a.distanceKm != null && b.distanceKm != null) {
      return a.distanceKm - b.distanceKm;
    }
    return a.status === 'ongoing' ? -1 : 1;
  });
}

export function getStoredDonorRegistrations(): DonorRegistration[] {
  try {
    const raw = localStorage.getItem(STORAGE_DONORS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read donor registrations:', e);
  }
  return [];
}

export function saveDonorRegistration(reg: Omit<DonorRegistration, 'id' | 'tokenNumber' | 'registeredAt' | 'status'>): DonorRegistration {
  const current = getStoredDonorRegistrations();
  const tokenNumber = `DON-${Math.floor(1000 + Math.random() * 9000)}`;
  const newReg: DonorRegistration = {
    ...reg,
    id: `DON-REG-${Date.now()}`,
    tokenNumber,
    registeredAt: new Date().toISOString(),
    status: 'confirmed'
  };

  const updated = [newReg, ...current];
  try {
    localStorage.setItem(STORAGE_DONORS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save donor registration:', e);
  }

  return newReg;
}

export function cancelDonorRegistration(id: string): DonorRegistration[] {
  const current = getStoredDonorRegistrations();
  const updated = current.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r);
  try {
    localStorage.setItem(STORAGE_DONORS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update donor registration:', e);
  }
  return updated;
}

// -------------------------------------------------------------
// Functions for Blood Banks & Inventory (Taker / Recipient)
// -------------------------------------------------------------
export function getBloodBankFacilities(
  bloodGroupFilter?: BloodGroup | 'all',
  componentFilter?: BloodComponent | 'all',
  userLat?: number,
  userLng?: number
): BloodBankFacility[] {
  return seedBloodBanks.map((bank) => {
    let distanceKm: number | undefined = undefined;
    if (userLat != null && userLng != null) {
      distanceKm = calculateHaversineDistance(userLat, userLng, bank.lat, bank.lng);
    }
    return {
      ...bank,
      distanceKm
    };
  }).sort((a, b) => {
    if (a.distanceKm != null && b.distanceKm != null) {
      return a.distanceKm - b.distanceKm;
    }
    return 0;
  });
}

// -------------------------------------------------------------
// Functions for Urgent Blood Requests (Post & Fulfill)
// -------------------------------------------------------------
export function getBloodRequests(): BloodRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_REQUESTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read blood requests:', e);
  }

  // Fallback to seed requests and save to localStorage
  try {
    localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(seedBloodRequests));
  } catch {}
  return seedBloodRequests;
}

export function saveBloodRequest(req: Omit<BloodRequest, 'id' | 'reqNumber' | 'requestedAt' | 'status' | 'fulfilledUnits' | 'responsesCount'>): BloodRequest {
  const current = getBloodRequests();
  const reqNumber = `BLD-REQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const newReq: BloodRequest = {
    ...req,
    id: `REQ-${Date.now()}`,
    reqNumber,
    requestedAt: new Date().toISOString(),
    status: 'OPEN_URGENT',
    fulfilledUnits: 0,
    responsesCount: 0
  };

  const updated = [newReq, ...current];
  try {
    localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save blood request:', e);
  }
  return newReq;
}

export function respondToBloodRequest(requestId: string): BloodRequest[] {
  const current = getBloodRequests();
  const updated = current.map(r => {
    if (r.id === requestId) {
      const newFulfilled = Math.min(r.unitsNeeded, r.fulfilledUnits + 1);
      const newStatus = newFulfilled >= r.unitsNeeded ? 'FULFILLED' as const : 'OPEN_URGENT' as const;
      return {
        ...r,
        fulfilledUnits: newFulfilled,
        responsesCount: r.responsesCount + 1,
        status: newStatus
      };
    }
    return r;
  });

  try {
    localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update blood request:', e);
  }
  return updated;
}
