import { Doctor, BookedAppointment } from '../types';

export const verifiedDoctorsList: Doctor[] = [
  {
    id: 'DOC-001',
    name: 'Dr. Suresh Mehta',
    qualification: 'MBBS, MD (General Medicine), DNB (Cardiology)',
    department: 'Cardiology & Chest Medicine',
    experienceYears: 16,
    hospitalId: 'HOSP-001',
    hospitalName: 'District Combined Hospital Barabanki',
    city: 'Barabanki',
    languages: ['Hindi', 'English', 'Awadhi'],
    consultationFee: 0, // Free at Government Hospital
    rating: 4.8,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '02:00 PM', '02:45 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    isTeleconsultAvailable: true,
    isInPersonAvailable: true
  },
  {
    id: 'DOC-002',
    name: 'Dr. Vandana Rao',
    qualification: 'MBBS, MS (Obstetrics & Gynecology)',
    department: 'Obstetrics & Gynecology (Maternal Health)',
    experienceYears: 12,
    hospitalId: 'HOSP-003',
    hospitalName: 'Community Health Centre (CHC) Dewa Sharif',
    city: 'Barabanki',
    languages: ['Hindi', 'English'],
    consultationFee: 0,
    rating: 4.9,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableSlots: ['10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM', '03:00 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1594824813583-3665799a7795?w=400&auto=format&fit=crop&q=80',
    isTeleconsultAvailable: true,
    isInPersonAvailable: true
  },
  {
    id: 'DOC-003',
    name: 'Dr. Priyadarshi Nayak',
    qualification: 'MBBS, MD (Pediatrics), FIAP',
    department: 'Pediatrics & Child Health',
    experienceYears: 14,
    hospitalId: 'HOSP-008',
    hospitalName: 'Capital Hospital Bhubaneswar',
    city: 'Bhubaneswar',
    languages: ['Odia', 'English', 'Hindi'],
    consultationFee: 0,
    rating: 4.9,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    availableSlots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '01:30 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    isTeleconsultAvailable: true,
    isInPersonAvailable: true
  },
  {
    id: 'DOC-004',
    name: 'Dr. Rajeshwar Sharma',
    qualification: 'MBBS (KGMC), Post-Graduation in Family Medicine',
    department: 'General Medicine & Diabetology',
    experienceYears: 9,
    hospitalId: 'HOSP-002',
    hospitalName: 'Primary Health Centre (PHC) Barabanki Rural',
    city: 'Barabanki',
    languages: ['Hindi', 'English'],
    consultationFee: 0,
    rating: 4.7,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableSlots: ['09:15 AM', '10:00 AM', '10:45 AM', '11:30 AM', '01:00 PM', '02:00 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
    isTeleconsultAvailable: true,
    isInPersonAvailable: true
  },
  {
    id: 'DOC-005',
    name: 'Dr. Tariq Ahmed',
    qualification: 'MBBS, MS (General Surgery), Fellowship in Diabetic Foot',
    department: 'General Surgery & Wound Care',
    experienceYears: 15,
    hospitalId: 'HOSP-001',
    hospitalName: 'District Combined Hospital Barabanki',
    city: 'Barabanki',
    languages: ['Hindi', 'Urdu', 'English'],
    consultationFee: 0,
    rating: 4.8,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['10:30 AM', '11:15 AM', '12:00 PM', '02:30 PM', '03:15 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    isTeleconsultAvailable: false,
    isInPersonAvailable: true
  },
  {
    id: 'DOC-006',
    name: 'Dr. Ananya Sen',
    qualification: 'MBBS, MD (Pulmonology / TB & Chest Diseases)',
    department: 'Pulmonology & Respiratory Medicine',
    experienceYears: 11,
    hospitalId: 'HOSP-005',
    hospitalName: 'King George’s Medical University (KGMU) Lucknow',
    city: 'Lucknow',
    languages: ['Bengali', 'Hindi', 'English'],
    consultationFee: 0,
    rating: 4.8,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableSlots: ['09:30 AM', '10:15 AM', '11:00 AM', '01:30 PM', '02:15 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1594824813583-3665799a7795?w=400&auto=format&fit=crop&q=80',
    isTeleconsultAvailable: true,
    isInPersonAvailable: true
  },
  {
    id: 'DOC-007',
    name: 'Dr. Ashok Mohanty',
    qualification: 'MBBS, MS (Orthopedics)',
    department: 'Orthopedics & Joint Clinic',
    experienceYears: 18,
    hospitalId: 'HOSP-008',
    hospitalName: 'Capital Hospital Bhubaneswar',
    city: 'Bhubaneswar',
    languages: ['Odia', 'Hindi', 'English'],
    consultationFee: 0,
    rating: 4.7,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM'],
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80',
    isTeleconsultAvailable: true,
    isInPersonAvailable: true
  }
];

export const initialBookedAppointments: BookedAppointment[] = [
  {
    id: 'BK-001',
    bookingRef: 'BK-2026-9812',
    doctorId: 'DOC-001',
    doctorName: 'Dr. Suresh Mehta',
    doctorDepartment: 'Cardiology & Chest Medicine',
    doctorQualification: 'MBBS, MD (General Medicine), DNB (Cardiology)',
    hospitalName: 'District Combined Hospital Barabanki',
    hospitalAddress: 'Near Civil Lines, Faizabad Road, Barabanki',
    patientName: 'Ramesh Patel',
    patientPhone: '+91 98765 43210',
    patientAge: 54,
    patientGender: 'Male',
    abhaId: '91-4521-8842-1092',
    appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    appointmentTime: '10:15 AM',
    consultationType: 'In-Person OPD',
    reasonForVisit: 'Post-angina follow-up & Blood Pressure check',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    tokenNumber: 'OPD-CARDIO-14',
    notes: 'Please bring previous ECG reports and current prescription strip.'
  },
  {
    id: 'BK-002',
    bookingRef: 'BK-2026-9815',
    doctorId: 'DOC-002',
    doctorName: 'Dr. Vandana Rao',
    doctorDepartment: 'Obstetrics & Gynecology (Maternal Health)',
    doctorQualification: 'MBBS, MS (Obstetrics & Gynecology)',
    hospitalName: 'Community Health Centre (CHC) Dewa Sharif',
    hospitalAddress: 'Dewa Sharif Main Road, Dewa, District Barabanki',
    patientName: 'Sunita Devi',
    patientPhone: '+91 98765 11223',
    patientAge: 26,
    patientGender: 'Female',
    abhaId: '91-8842-7712-4011',
    appointmentDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    appointmentTime: '11:30 AM',
    consultationType: 'In-Person OPD',
    reasonForVisit: 'Antenatal care 34 weeks, Blood Pressure review',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    tokenNumber: 'OPD-MCH-07',
    notes: 'Bring Mother and Child Protection (MCP) card.'
  }
];

const LOCAL_STORAGE_KEY = 'swasthya_booked_appointments';

export function getStoredAppointments(): BookedAppointment[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse appointments from localStorage', e);
  }
  return initialBookedAppointments;
}

export function saveAppointment(appointment: BookedAppointment): BookedAppointment[] {
  const current = getStoredAppointments();
  const updated = [appointment, ...current.filter((a) => a.id !== appointment.id)];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
  return updated;
}

export function cancelAppointment(id: string): BookedAppointment[] {
  const current = getStoredAppointments();
  const updated = current.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a));
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update in localStorage', e);
  }
  return updated;
}
