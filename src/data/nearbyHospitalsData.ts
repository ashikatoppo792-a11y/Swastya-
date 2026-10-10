import { NearbyHospital, FacilityCategory } from '../types';

export const predefinedCities = [
  { name: 'Barabanki & Lucknow (UP)', lat: 26.9275, lng: 81.1843, state: 'Uttar Pradesh' },
  { name: 'Bhubaneswar & Cuttack (Odisha)', lat: 20.2961, lng: 85.8245, state: 'Odisha' },
  { name: 'Ahmedabad & Sanand (Gujarat)', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  { name: 'New Delhi & NCR', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  { name: 'Mumbai & Thane', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  { name: 'Pune & Pimpri', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  { name: 'Bengaluru (Karnataka)', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  { name: 'Kolkata (West Bengal)', lat: 22.5726, lng: 88.3639, state: 'West Bengal' }
];

export const nearbyHospitalsList: NearbyHospital[] = [
  {
    id: 'HOSP-001',
    name: 'District Combined Hospital Barabanki',
    nameHi: 'जिला संयुक्त चिकित्सालय बाराबंकी',
    nameOr: 'ଜିଲ୍ଲା ଡାକ୍ତରଖାନା ବାରାବଙ୍କି',
    category: 'Hospital',
    typeLabel: 'Government District Hospital (Secondary)',
    address: 'Near Civil Lines, Faizabad Road, Barabanki',
    city: 'Barabanki',
    district: 'Barabanki',
    state: 'Uttar Pradesh',
    pincode: '225001',
    coordinates: { lat: 26.9312, lng: 81.1920 },
    distanceKm: 1.8,
    rating: 4.4,
    reviewsCount: 382,
    contactNumber: '+91 5248 222108',
    emergencyNumber: '108',
    openStatus: 'Open 24x7',
    timing: 'Emergency: 24/7 • General OPD: 08:00 AM - 02:00 PM',
    bedsAvailable: { general: 38, icu: 6, oxygen: 24 },
    specialtiesOnDuty: ['General Physician', 'Pediatrician', 'General Surgeon', 'Orthopedic', 'Cardiologist (On Call)'],
    services: ['Ayushman Bharat PMJAY Free Care', 'Blood Bank (24x7)', 'Digital X-Ray & CT', 'Janani Suraksha Yojana'],
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.9312,81.1920'
  },
  {
    id: 'HOSP-002',
    name: 'Primary Health Centre (PHC) Barabanki Rural',
    nameHi: 'प्राथमिक स्वास्थ्य केंद्र (PHC) बाराबंकी ग्रामीण',
    nameOr: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ବାରାବଙ୍କି',
    category: 'PHC',
    typeLabel: 'Ayushman Arogya Mandir (Primary Care)',
    address: 'Block Sadar, Near Block Development Office, Barabanki',
    city: 'Barabanki',
    district: 'Barabanki',
    state: 'Uttar Pradesh',
    pincode: '225003',
    coordinates: { lat: 26.9210, lng: 81.1760 },
    distanceKm: 2.4,
    rating: 4.6,
    reviewsCount: 145,
    contactNumber: '+91 94500 88219',
    emergencyNumber: '102 / 108',
    openStatus: 'Open Now',
    timing: '09:00 AM - 04:00 PM (Mon-Sat)',
    bedsAvailable: { general: 6, icu: 0, oxygen: 4 },
    specialtiesOnDuty: ['Medical Officer (MBBS)', 'Community Health Officer (CHO)', 'Staff Nurse & ANM'],
    services: ['Free Essential Medicines (EDL)', 'Routine Immunization', 'Maternal Antenatal Checkup', 'eSanjeevani Teleconsult'],
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.9210,81.1760'
  },
  {
    id: 'HOSP-003',
    name: 'Community Health Centre (CHC) Dewa Sharif',
    nameHi: 'सामुदायिक स्वास्थ्य केंद्र (CHC) देवा शरीफ',
    nameOr: 'ସାମୁଦାୟିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ଦେୱା',
    category: 'CHC',
    typeLabel: 'First Referral Unit (30 Beds)',
    address: 'Dewa Sharif Main Road, Dewa, District Barabanki',
    city: 'Barabanki',
    district: 'Barabanki',
    state: 'Uttar Pradesh',
    pincode: '225301',
    coordinates: { lat: 27.0340, lng: 81.1620 },
    distanceKm: 8.5,
    rating: 4.2,
    reviewsCount: 198,
    contactNumber: '+91 5248 244102',
    emergencyNumber: '108',
    openStatus: 'Open 24x7',
    timing: 'Emergency & Delivery: 24/7 • OPD: 08:30 AM - 02:00 PM',
    bedsAvailable: { general: 18, icu: 2, oxygen: 12 },
    specialtiesOnDuty: ['Obstetrician & Gynecologist', 'Pediatrician', 'Anesthetist'],
    services: ['24x7 Normal & C-Section Delivery', 'Neonatal Stabilization Unit (NBSU)', 'Laboratory & Ultrasound'],
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=27.0340,81.1620'
  },
  {
    id: 'HOSP-004',
    name: 'Pradhan Mantri Jan Aushadhi Kendra (Generic Pharmacy)',
    nameHi: 'प्रधानमंत्री जन औषधि केंद्र (किफायती दवाएं)',
    nameOr: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ଜନ ଔଷଧି କେନ୍ଦ୍ର',
    category: 'Pharmacy',
    typeLabel: 'Government Subsidized Generic Pharmacy (50-90% Discount)',
    address: 'Shop No 14, Opposite District Hospital Gate, Barabanki',
    city: 'Barabanki',
    district: 'Barabanki',
    state: 'Uttar Pradesh',
    pincode: '225001',
    coordinates: { lat: 26.9318, lng: 81.1925 },
    distanceKm: 1.9,
    rating: 4.8,
    reviewsCount: 420,
    contactNumber: '+91 98390 12345',
    openStatus: 'Open Now',
    timing: '08:00 AM - 10:00 PM (All 7 Days)',
    specialtiesOnDuty: ['Registered Pharmacist on Duty'],
    services: ['Generic Medicines for Diabetes & BP', 'Surgical Dressings & Bandages', 'Sanitary Pads (₹1 Suvidha)', 'ORS Packets'],
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.9318,81.1925'
  },
  {
    id: 'HOSP-005',
    name: 'King George’s Medical University (KGMU) & Trauma Centre',
    nameHi: 'किंग जॉर्ज मेडिकल यूनिवर्सिटी (KGMU) ट्रॉमा सेंटर',
    nameOr: 'କିଙ୍ଗ ଜର୍ଜ ମେଡିକାଲ ୟୁନିଭରସିଟି ଲକ୍ଷ୍ନୌ',
    category: 'Hospital',
    typeLabel: 'Apex Tertiary Medical College & Level-1 Trauma Centre',
    address: 'Shah Mina Road, Chowk, Lucknow',
    city: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226003',
    coordinates: { lat: 26.8687, lng: 80.9168 },
    distanceKm: 32.0,
    rating: 4.7,
    reviewsCount: 3120,
    contactNumber: '+91 522 2257540',
    emergencyNumber: '108 / 0522-2257540',
    openStatus: 'Open 24x7',
    timing: '24x7 Trauma & Super-Specialty Emergency',
    bedsAvailable: { general: 140, icu: 28, oxygen: 110 },
    specialtiesOnDuty: ['Interventional Cardiology', 'Neurosurgery', 'Critical Care Medicine', 'Burn Care', 'Nephrology & Dialysis'],
    services: ['Cath Lab / Primary Angioplasty', '24x7 Component Blood Bank', 'Trauma Resuscitation', 'Pediatric Intensive Care (PICU)'],
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.8687,80.9168'
  },
  {
    id: 'HOSP-006',
    name: 'Apollo 24x7 Emergency & Pharmacy Centre',
    nameHi: 'अपोलो 24x7 इमरजेंसी एवं फार्मेसी',
    nameOr: 'ଆପୋଲୋ ୨୪x୭ ଔଷଧାଳୟ',
    category: 'Pharmacy',
    typeLabel: '24x7 Private Pharmacy & Emergency Dressing Clinic',
    address: 'Station Road, Near Railway Junction, Barabanki',
    city: 'Barabanki',
    district: 'Barabanki',
    state: 'Uttar Pradesh',
    pincode: '225001',
    coordinates: { lat: 26.9240, lng: 81.1890 },
    distanceKm: 2.1,
    rating: 4.5,
    reviewsCount: 215,
    contactNumber: '+91 5248 223400',
    openStatus: 'Open 24x7',
    timing: 'Open 24 Hours, 365 Days',
    specialtiesOnDuty: ['Duty Pharmacist', 'Nurse for Vitals / Injections'],
    services: ['Home Delivery of Prescriptions', 'Emergency Insulin & Cold Chain', 'BP & Blood Sugar Testing', 'Nebulization Facility'],
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.9240,81.1890'
  },
  {
    id: 'HOSP-007',
    name: 'National 108 Emergency Ambulance Station Barabanki',
    nameHi: 'राष्ट्रीय 108 आपातकालीन एम्बुलेंस केंद्र',
    nameOr: 'ଜାତୀୟ ୧୦୮ ଜରୁରୀକାଳୀନ ଆମ୍ବୁଲାନ୍ସ',
    category: 'Emergency',
    typeLabel: 'Advanced Life Support (ALS) & Basic Life Support (BLS) Fleet',
    address: 'Combined Hospital Campus, Faizabad Road, Barabanki',
    city: 'Barabanki',
    district: 'Barabanki',
    state: 'Uttar Pradesh',
    pincode: '225001',
    coordinates: { lat: 26.9315, lng: 81.1915 },
    distanceKm: 1.8,
    rating: 4.9,
    reviewsCount: 890,
    contactNumber: '108',
    emergencyNumber: '108 / 112',
    openStatus: 'Open 24x7',
    timing: 'Emergency Dispatch Active 24x7',
    specialtiesOnDuty: ['Emergency Medical Technician (EMT)', 'Pilot'],
    services: ['Cardiac Defibrillator on board', 'Oxygen delivery & Suction', 'Ventilator Transport for Critical Patients', 'Free Govt Service'],
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.9315,81.1915'
  },
  {
    id: 'HOSP-008',
    name: 'Capital Hospital Bhubaneswar',
    nameHi: 'कैपिटल हॉस्पिटल भुवनेश्वर',
    nameOr: 'କ୍ୟାପିଟାଲ ହସ୍ପିଟାଲ ଭୁବନେଶ୍ୱର',
    category: 'Hospital',
    typeLabel: 'Government Principal Hospital (Tertiary)',
    address: 'Unit 6, Ganga Nagar, Bhubaneswar',
    city: 'Bhubaneswar',
    district: 'Khurda',
    state: 'Odisha',
    pincode: '751001',
    coordinates: { lat: 20.2745, lng: 85.8235 },
    distanceKm: 3.2,
    rating: 4.6,
    reviewsCount: 2450,
    contactNumber: '+91 674 2391983',
    emergencyNumber: '108',
    openStatus: 'Open 24x7',
    timing: '24x7 Casualty & Emergency • OPD: 08:00 AM - 01:00 PM',
    bedsAvailable: { general: 65, icu: 14, oxygen: 48 },
    specialtiesOnDuty: ['General Medicine', 'Pediatrics', 'Obstetrics & Gynae', 'Cardiology', 'Orthopedics'],
    services: ['Biju Swasthya Kalyan Yojana (BSKY)', 'Free Dialysis Centre', 'Blood Bank (24x7)', 'Niramaya Free Medicine Counter'],
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=20.2745,85.8235'
  }
];

// Calculate distance between two lat/lng points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function getSortedHospitals(
  userLat?: number,
  userLng?: number,
  categoryFilter: string = 'All',
  searchQuery: string = ''
): NearbyHospital[] {
  let list = nearbyHospitalsList.map((hosp) => {
    if (userLat && userLng) {
      const dist = calculateDistance(userLat, userLng, hosp.coordinates.lat, hosp.coordinates.lng);
      return { ...hosp, distanceKm: dist };
    }
    return hosp;
  });

  if (categoryFilter !== 'All') {
    list = list.filter((h) => h.category === categoryFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.nameHi && h.nameHi.includes(q)) ||
        (h.nameOr && h.nameOr.includes(q)) ||
        h.address.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.services.some((s) => s.toLowerCase().includes(q)) ||
        h.specialtiesOnDuty.some((s) => s.toLowerCase().includes(q))
    );
  }

  return list.sort((a, b) => a.distanceKm - b.distanceKm);
}
