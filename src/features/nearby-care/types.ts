// Types for Nearby Care Finder

export type FacilityType =
  | 'hospital'
  | 'clinic'
  | 'nursing_home'
  | 'PHC'
  | 'CHC'
  | 'pharmacy'
  | 'diagnostic_lab';

export type FacilityOwnership = 'government' | 'private' | 'trust' | 'unknown';

export type PlacesSource = 'osm' | 'google' | 'geoapify' | 'demo_seed';

export interface NormalizedFacility {
  id: string;
  name: string;
  type: FacilityType;
  ownership: FacilityOwnership;
  lat: number;
  lng: number;
  distanceKm?: number;
  estimatedTravelTimeMin?: number;
  address: string;
  phone: string;
  openNow?: boolean;
  hours: string;
  emergencyAvailable: boolean;
  specialities: string[];
  rating?: number;
  ratingCount?: number;
  source: PlacesSource;
  lastUpdated: string;
  pmjayEmpanelled?: boolean; // Ayushman Bharat / PM-JAY
  verified?: boolean;
  icuBedsAvailable?: number;
  oxygenAvailable?: boolean;
  ambulanceAvailable?: boolean;
}

export type GeolocationStatus =
  | 'idle'
  | 'prompting'
  | 'loading'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'timeout'
  | 'low_accuracy';

export interface UserCoordinates {
  lat: number;
  lng: number;
  accuracyMeters: number;
  timestamp: number;
  resolvedAddress?: string;
  isManual?: boolean;
}

export interface NearbyFilters {
  facilityTypes: FacilityType[];
  ownership: 'all' | 'government' | 'private' | 'trust';
  openNowOnly: boolean;
  emergencyOnly: boolean;
  speciality: string;
  maxRadiusKm: number; // 1 to 50 km, default 5
  searchQuery: string;
  sortBy: 'nearest' | 'triage_match' | 'rating';
  pmjayOnly: boolean;
}

export interface ReferralDetails {
  facilityId: string;
  facilityName: string;
  facilityAddress: string;
  patientId: string;
  patientName: string;
  patientTriagePriority: 'P1' | 'P2' | 'P3' | 'P4';
  reasonForReferral: string;
  requiredSpeciality: string;
  clinicalSummary: string;
  sharePatientLocation: boolean;
  patientCoordinates?: { lat: number; lng: number };
  referredByClinicianId: string;
  referredByClinicianName: string;
  referralDate: string;
  urgency: 'immediate_transfer' | 'same_day' | 'elective_opd';
}
