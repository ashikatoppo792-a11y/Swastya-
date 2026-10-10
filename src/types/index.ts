export type TriagePriority = 'Emergency' | 'Urgent' | 'Semi-urgent' | 'Routine';

export type PatientStatus = 'pending_review' | 'approved' | 'overridden' | 'referred' | 'rejected';

export type UserRole = 'patient' | 'nurse' | 'doctor' | 'admin';

export type FacilityType = 'PHC' | 'CHC' | 'District Hospital' | 'Company Clinic' | 'Industrial Estate' | 'Campus Clinic' | 'Health Camp';

export interface Vitals {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  pulseRate?: number;
  spo2?: number;
  temperatureF?: number;
  respiratoryRate?: number;
}

export interface KeyFinding {
  parameter: string;
  value: string;
  status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL' | 'BORDERLINE';
  normalRange?: string;
}

export interface ReportItem {
  id: string;
  type: string;
  fileName: string;
  previewUrl?: string;
  ocrExtractedText?: string;
  keyFindings?: KeyFinding[];
}

export interface PhotoItem {
  id: string;
  fileName: string;
  previewUrl: string;
  mockVisualAnalysis?: string;
  confidence?: number;
}

export interface SourceMapping {
  claim: string;
  source: string;
  rawText?: string;
}

export interface Explainability {
  primaryFactors: string[];
  sourceMapping: SourceMapping[];
}

export interface TriageNote {
  aiGeneratedAt: string;
  suggestedPriority: TriagePriority;
  suggestedDepartment: string;
  confidenceScore: number;
  confidenceRationale: string;
  redFlagsDetected: string[];
  emergencyActionNotice?: string;
  chiefComplaintSummary: string;
  historyOfPresentIllness: string;
  vitalsAssessment: string;
  findingsFromReports: string;
  visualObservations: string;
  missingInformationToAsk: string[];
  explainability?: Explainability;
  overrideJustification?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
}

export interface ReferralInfo {
  referredAt: string;
  referredBy: string;
  destinationFacility: string;
  referralUrgency: string;
  transportType: string;
  clinicalHandoverSummary: string;
  eSanjeevaniTeleconsultId?: string;
}

export interface Patient {
  id: string;
  tokenNumber: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  phone?: string;
  aadhaarLast4?: string;
  primaryLanguage: string;
  facilityId: string;
  facilityName: string;
  facilityType: FacilityType;
  checkInTime: string;
  status: PatientStatus;
  bodyArea?: string;
  duration?: string;
  severity: number;
  pregnant?: boolean;
  pregnancyTrimester?: string;
  chronicConditions?: string[];
  currentMedicines?: string[];
  allergies?: string[];
  chiefComplaint: string;
  voiceTranscript?: string;
  voiceTranscriptEn?: string;
  vitals: Vitals;
  reports?: ReportItem[];
  photos?: PhotoItem[];
  actorName?: string;
  actorRole?: string;
  triageNote?: TriageNote;
  auditTrail: AuditEntry[];
  referralInfo?: ReferralInfo;
  infoRequested?: {
    requestedAt: string;
    requestedBy: string;
    query: string;
  };
}

export interface FacilityProfile {
  id: string;
  name: string;
  state: string;
  district: string;
  facilityType: FacilityType;
  bedCount: number;
  icuAvailable: boolean;
  connectivityMode: 'online' | 'low-bandwidth' | 'offline';
  specialists: {
    generalPhysician: boolean;
    pediatrician: boolean;
    cardiologist: boolean;
    gynecologist: boolean;
    generalSurgeon: boolean;
    orthopedic: boolean;
  };
  nearestHigherFacility: string;
  teleconsultService: string;
  emergencyAmbulanceContact: string;
}

export interface AnalyticsData {
  totalPatients: number;
  pendingReviewCount: number;
  approvedCount: number;
  overriddenCount: number;
  referredCount: number;
  avgReviewTimeMinutes: number;
  overrideRate: number;
  concordanceRate: number;
  triageDistribution: Array<{
    name: string;
    count: number;
    color: string;
    waitTarget: string;
  }>;
  hourlyLoad: Array<{
    hour: string;
    arrivals: number;
    emergency: number;
  }>;
  languageDistribution: Array<{
    code: string;
    name: string;
    count: number;
  }>;
  topComplaints: Array<{
    complaint: string;
    category: string;
    count: number;
    highPriority: boolean;
  }>;
  aiSatisfactionRate: number;
  totalFeedbacks: number;
}

// Medicine & Appointment Reminders
export interface MedicineReminder {
  id: string;
  patientId?: string;
  medicineName: string;
  dosage: string; // e.g. "1 Tablet (500mg)", "5 ml Syrup"
  instructions: 'before_food' | 'after_food' | 'with_food' | 'empty_stomach';
  timings: Array<{
    timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
    time: string; // "08:00"
    takenToday?: boolean;
    takenAt?: string;
  }>;
  frequency: 'daily' | 'alternate_days' | 'weekly' | 'as_needed';
  startDate: string;
  endDate?: string;
  doctorPrescribedBy?: string;
  active: boolean;
}

export interface AppointmentReminder {
  id: string;
  patientId?: string;
  doctorOrClinic: string;
  department: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  preparationNotes?: string[];
  status: 'upcoming' | 'completed' | 'rescheduled';
}

// Medical Report Scanner
export interface MedicalTermExplanation {
  term: string;
  category: 'Lab Value' | 'Medical Term' | 'Abbreviation' | 'Organ / Condition';
  simpleExplanation: string;
  hindiExplanation: string;
  odiaExplanation: string;
  normalRange?: string;
  whatItMeansForYou: string;
  urgencyLevel: 'Normal / Expected' | 'Needs Doctor Review' | 'Critical Attention';
}

export interface ReportScanResult {
  id: string;
  fileName: string;
  scannedAt: string;
  documentType: string;
  ocrText: string;
  explainedTerms: MedicalTermExplanation[];
  summaryInPlainLanguage: {
    en: string;
    hi: string;
    or: string;
  };
  suggestedQuestionsForDoctor: string[];
}

// Health Awareness
export interface HealthAwarenessTopic {
  id: string;
  slug: string;
  title: string;
  titleHi: string;
  titleOr: string;
  category: 'Chronic Disease' | 'Infectious / Vector' | 'Maternal & Child' | 'Nutrition & Hygiene' | 'Preventive Care';
  summary: string;
  summaryHi: string;
  summaryOr: string;
  keySigns: string[];
  causesAndRisks: string[];
  preventionAndDiet: string[];
  whenToSeeDoctor: string;
  mythsAndFacts: Array<{
    myth: string;
    fact: string;
  }>;
  audioPromptText: {
    en: string;
    hi: string;
    or: string;
  };
}

// 1. AI Symptom Checker
export interface SymptomCheckRequest {
  symptoms: string[];
  freeTextDescription: string;
  duration: string;
  severity: number; // 1 to 10
  age?: number;
  gender?: string;
  existingConditions?: string[];
  language?: string;
}

export interface PossibleCondition {
  condition: string;
  conditionHi?: string;
  conditionOr?: string;
  likelihood: 'High Probability' | 'Moderate' | 'Possible' | 'Low';
  description: string;
  typicalSymptoms: string[];
}

export interface SymptomCheckResult {
  id: string;
  timestamp: string;
  primaryTriageLevel: 'Self-Care & Monitor' | 'Consult Doctor (Routine OPD)' | 'Urgent Clinic Evaluation (<4 hrs)' | 'Emergency Medical Care (Immediate)';
  urgencyColor: 'emerald' | 'amber' | 'orange' | 'rose';
  executiveSummary: {
    en: string;
    hi: string;
    or: string;
  };
  possibleConditions: PossibleCondition[];
  recommendedNextSteps: {
    immediateActions: string[];
    homeCareMeasures: string[];
    whatToAvoid: string[];
    redFlagSigns: string[];
  };
  recommendedSpecialty: string;
  disclaimer: string;
}

// 2. Find Nearby Hospitals
export type FacilityCategory = 'Hospital' | 'PHC' | 'CHC' | 'Clinic' | 'Pharmacy' | 'Emergency';

export interface NearbyHospital {
  id: string;
  name: string;
  nameHi?: string;
  nameOr?: string;
  category: FacilityCategory;
  typeLabel: string; // "District Hospital", "Primary Health Centre", "Jan Aushadhi Kendra"
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  contactNumber: string;
  emergencyNumber?: string;
  openStatus: 'Open 24x7' | 'Open Now' | 'Closing Soon' | 'Emergency Only';
  timing: string;
  bedsAvailable?: {
    general: number;
    icu: number;
    oxygen: number;
  };
  specialtiesOnDuty: string[];
  services: string[];
  googleMapsUrl: string;
}

// 3. Online Doctor Appointment
export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  department: string;
  experienceYears: number;
  hospitalId: string;
  hospitalName: string;
  city: string;
  languages: string[];
  consultationFee: number;
  rating: number;
  availableDays: string[];
  availableSlots: string[];
  avatarUrl?: string;
  isTeleconsultAvailable: boolean;
  isInPersonAvailable: boolean;
}

export interface BookedAppointment {
  id: string;
  bookingRef: string;
  doctorId: string;
  doctorName: string;
  doctorDepartment: string;
  doctorQualification: string;
  hospitalName: string;
  hospitalAddress: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  abhaId?: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: 'In-Person OPD' | 'Video Teleconsult (eSanjeevani)';
  reasonForVisit: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  createdAt: string;
  tokenNumber: string;
  notes?: string;
}

// 4. Blood Donation Camps & Blood Requests (Donate & Take)
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type BloodComponent = 'Whole Blood' | 'PRBC (Red Cells)' | 'Platelets (RDP/SDP)' | 'FFP (Plasma)' | 'Cryoprecipitate';

export interface BloodDonationCamp {
  id: string;
  name: string;
  organizer: string;
  venue: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  startDate: string;
  endDate: string;
  timings: string;
  phone: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  criticalBloodNeeded: BloodGroup[];
  facilities: string[];
  targetUnits: number;
  collectedUnits: number;
  slotsAvailable: string[];
  distanceKm?: number;
}

export interface BloodStockItem {
  wholeBlood: number;
  prbc: number;
  platelets: number;
  ffp: number;
}

export interface BloodBankFacility {
  id: string;
  bloodBankName: string;
  category: 'Government Blood Centre' | 'Red Cross' | 'Charitable Trust' | 'Private Hospital';
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone: string;
  is24x7: boolean;
  inventory: Record<BloodGroup, BloodStockItem>;
  lastUpdated: string;
  distanceKm?: number;
}

export interface DonorRegistration {
  id: string;
  tokenNumber: string;
  donorName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  phone: string;
  email?: string;
  campId: string;
  campName: string;
  campVenue: string;
  slotDate: string;
  slotTime: string;
  registeredAt: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  weightKg?: number;
  lastDonatedMonthsAgo?: number;
}

export interface BloodRequest {
  id: string;
  reqNumber: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  component: BloodComponent;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  urgency: 'EMERGENCY_IMMEDIATE' | 'URGENT_TODAY' | 'SCHEDULED_SURGERY';
  attendantName: string;
  contactPhone: string;
  alternatePhone?: string;
  doctorPrescriptionVerified: boolean;
  notes?: string;
  requestedAt: string;
  status: 'OPEN_URGENT' | 'FULFILLED' | 'CANCELLED';
  fulfilledUnits: number;
  responsesCount: number;
}

