import React, { useState, useEffect } from 'react';
import {
  BloodDonationCamp,
  BloodBankFacility,
  DonorRegistration,
  BloodRequest,
  BloodGroup,
  BloodComponent
} from '../types';
import {
  getBloodCamps,
  getStoredDonorRegistrations,
  saveDonorRegistration,
  cancelDonorRegistration,
  getBloodBankFacilities,
  getBloodRequests,
  saveBloodRequest,
  respondToBloodRequest
} from '../data/bloodDonationData';
import { getTranslation } from '../i18n/translations';
import {
  Droplet,
  MapPin,
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Plus,
  Navigation,
  ShieldCheck,
  Search,
  Filter,
  User,
  Building2,
  ExternalLink,
  ChevronRight,
  Printer,
  Sparkles,
  Info,
  X,
  Share2
} from 'lucide-react';

interface BloodDonationPageProps {
  currentLanguage?: string;
  userCoordinates?: { lat: number; lng: number } | null;
  onRequestLocation?: () => void;
  onNavigateToHospital?: (hospitalName: string) => void;
}

const ALL_BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ALL_COMPONENTS: BloodComponent[] = [
  'Whole Blood',
  'PRBC (Red Cells)',
  'Platelets (RDP/SDP)',
  'FFP (Plasma)',
  'Cryoprecipitate'
];

export const BloodDonationPage: React.FC<BloodDonationPageProps> = ({
  currentLanguage = 'en',
  userCoordinates = { lat: 20.2961, lng: 85.8245 }, // Default fallback to Bhubaneswar Hub
  onRequestLocation,
  onNavigateToHospital
}) => {
  const t = getTranslation(currentLanguage);

  // Active Main SubTab
  const [activeTab, setActiveTab] = useState<'camps' | 'stock' | 'requests' | 'my-pledges'>('camps');

  // Location & City Filter
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [userLat, setUserLat] = useState<number | undefined>(userCoordinates?.lat);
  const [userLng, setUserLng] = useState<number | undefined>(userCoordinates?.lng);

  useEffect(() => {
    if (userCoordinates) {
      setUserLat(userCoordinates.lat);
      setUserLng(userCoordinates.lng);
    }
  }, [userCoordinates]);

  // Data States
  const [camps, setCamps] = useState<BloodDonationCamp[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBankFacility[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [myPledges, setMyPledges] = useState<DonorRegistration[]>([]);

  // Filters for Stock Tab
  const [selectedStockGroup, setSelectedStockGroup] = useState<BloodGroup | 'all'>('all');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent | 'all'>('all');

  // Filter for Camps
  const [campSearchQuery, setCampSearchQuery] = useState('');

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCampForRegister, setSelectedCampForRegister] = useState<BloodDonationCamp | null>(null);

  const [isPostRequestModalOpen, setIsPostRequestModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Donor Form State
  const [donorName, setDonorName] = useState('');
  const [donorAge, setDonorAge] = useState<number | ''>(28);
  const [donorGender, setDonorGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [donorBloodGroup, setDonorBloodGroup] = useState<BloodGroup>('O+');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorSlotTime, setDonorSlotTime] = useState('');
  const [donorEligible, setDonorEligible] = useState(true);

  // New Blood Request Form State
  const [reqPatientName, setReqPatientName] = useState('');
  const [reqAge, setReqAge] = useState<number | ''>('');
  const [reqGender, setReqGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [reqBloodGroup, setReqBloodGroup] = useState<BloodGroup>('O-');
  const [reqComponent, setReqComponent] = useState<BloodComponent>('PRBC (Red Cells)');
  const [reqUnits, setReqUnits] = useState<number>(2);
  const [reqHospital, setReqHospital] = useState('');
  const [reqAddress, setReqAddress] = useState('');
  const [reqCity, setReqCity] = useState('Bhubaneswar');
  const [reqUrgency, setReqUrgency] = useState<'EMERGENCY_IMMEDIATE' | 'URGENT_TODAY' | 'SCHEDULED_SURGERY'>('EMERGENCY_IMMEDIATE');
  const [reqAttendant, setReqAttendant] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqNotes, setReqNotes] = useState('');

  // Load Data
  const loadAllData = () => {
    setCamps(getBloodCamps(userLat, userLng));
    setBloodBanks(getBloodBankFacilities(selectedStockGroup, selectedComponent, userLat, userLng));
    setRequests(getBloodRequests());
    setMyPledges(getStoredDonorRegistrations());
  };

  useEffect(() => {
    loadAllData();
  }, [userLat, userLng, selectedStockGroup, selectedComponent]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Handle Donor Pledge Submit
  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampForRegister) return;
    if (!donorName.trim() || !donorPhone.trim() || !donorAge) {
      alert('Please enter all required donor details.');
      return;
    }
    if (Number(donorAge) < 18 || Number(donorAge) > 65) {
      alert('Donor must be between 18 and 65 years of age.');
      return;
    }

    const newReg = saveDonorRegistration({
      donorName: donorName.trim(),
      age: Number(donorAge),
      gender: donorGender,
      bloodGroup: donorBloodGroup,
      phone: donorPhone.trim(),
      campId: selectedCampForRegister.id,
      campName: selectedCampForRegister.name,
      campVenue: selectedCampForRegister.venue,
      slotDate: selectedCampForRegister.startDate,
      slotTime: donorSlotTime || selectedCampForRegister.slotsAvailable[0] || '10:00 AM'
    });

    setIsRegisterModalOpen(false);
    setMyPledges(getStoredDonorRegistrations());
    showToast(`Donor registration confirmed! Your Token: ${newReg.tokenNumber}. Please reach the camp on time.`);
    setActiveTab('my-pledges');
  };

  // Handle Urgent Request Submit
  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqPatientName.trim() || !reqHospital.trim() || !reqPhone.trim() || !reqUnits) {
      alert('Please fill all mandatory fields for the urgent blood request.');
      return;
    }

    const newReq = saveBloodRequest({
      patientName: reqPatientName.trim(),
      age: Number(reqAge) || 30,
      gender: reqGender,
      bloodGroup: reqBloodGroup,
      component: reqComponent,
      unitsNeeded: Number(reqUnits),
      hospitalName: reqHospital.trim(),
      hospitalAddress: reqAddress.trim(),
      city: reqCity,
      urgency: reqUrgency,
      attendantName: reqAttendant.trim() || 'Family Attendant',
      contactPhone: reqPhone.trim(),
      doctorPrescriptionVerified: true,
      notes: reqNotes.trim()
    });

    setIsPostRequestModalOpen(false);
    setRequests(getBloodRequests());
    showToast(`Urgent Blood Request broadcasted live! Ref: ${newReq.reqNumber}. Donors nearby are being alerted.`);
    setActiveTab('requests');
  };

  // Handle Response / Fulfill
  const handleRespondToRequest = (reqId: string, patientName: string) => {
    const updated = respondToBloodRequest(reqId);
    setRequests(updated);
    showToast(`Thank you! Your willingness to donate for ${patientName} has been recorded.`);
  };

  // Filtered camps
  const filteredCamps = camps.filter((c) => {
    const matchCity = selectedCity === 'All' || c.city.toLowerCase() === selectedCity.toLowerCase();
    const matchSearch =
      campSearchQuery === '' ||
      c.name.toLowerCase().includes(campSearchQuery.toLowerCase()) ||
      c.organizer.toLowerCase().includes(campSearchQuery.toLowerCase()) ||
      c.venue.toLowerCase().includes(campSearchQuery.toLowerCase()) ||
      c.criticalBloodNeeded.some((bg) => bg.toLowerCase().includes(campSearchQuery.toLowerCase()));
    return matchCity && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Toast Banner */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-up border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{successToast}</span>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-white/80 hover:text-white ml-2 text-sm font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-rose-700/50">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-400/30">
            <Droplet className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>National Voluntary Blood Network & Camps</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2.5">
            <span>{t.bloodConnect}</span>
            <span className="hidden sm:inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </h1>

          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-normal">
            Discover nearby voluntary blood donation camps, pledge donation slots, inspect real-time blood bank inventories for 8 blood groups, or broadcast urgent requests for critical patients.
          </p>

          {/* Location Bar & Quick Filter */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white font-semibold">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Location: {selectedCity === 'All' ? 'Current GPS Area' : selectedCity}</span>
            </div>

            {onRequestLocation && (
              <button
                type="button"
                onClick={onRequestLocation}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600/60 hover:bg-rose-600 border border-rose-400/40 text-white font-bold transition cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Update GPS</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-black/25 px-2.5 py-1 rounded-xl border border-white/10">
              <span className="text-rose-300 font-bold text-[11px]">Filter City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="All" className="text-slate-900">All Cities</option>
                <option value="Bhubaneswar" className="text-slate-900">Bhubaneswar (Odisha)</option>
                <option value="Barabanki" className="text-slate-900">Barabanki (UP)</option>
                <option value="Ahmedabad" className="text-slate-900">Ahmedabad (Gujarat)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Decorative Blood Drop Background Art */}
        <div className="absolute right-6 -bottom-8 opacity-10 pointer-events-none hidden md:block">
          <Droplet className="w-64 h-64 text-white fill-white" />
        </div>
      </div>

      {/* Quick Action Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('camps')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'camps'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t.bloodCamps} ({filteredCamps.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stock')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'stock'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>{t.findBlood}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-300" />
          <span>{t.urgentBloodRequests} ({requests.filter(r => r.status === 'OPEN_URGENT').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-pledges')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'my-pledges'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{t.myPledges} ({myPledges.length})</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: NEARBY DONATION CAMPS (DONATE) */}
      {/* ===================================================================== */}
      {activeTab === 'camps' && (
        <div className="space-y-6">
          {/* Top Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={campSearchQuery}
                onChange={(e) => setCampSearchQuery(e.target.value)}
                placeholder="Search camps by name, organizer, venue, or blood group..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
              <span className="font-bold">Sorted by:</span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800">
                Nearest to you (km)
              </span>
            </div>
          </div>

          {/* Camps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCamps.map((camp) => (
              <div
                key={camp.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Status & Distance Top Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      camp.status === 'ongoing'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                        : 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300'
                    }`}>
                      {camp.status === 'ongoing' ? '● Ongoing Today' : 'Upcoming Drive'}
                    </span>

                    {camp.distanceKm != null && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs border border-rose-200 dark:border-rose-900">
                        <Navigation className="w-3 h-3 text-rose-500" />
                        <span>{camp.distanceKm} km away</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Organizer */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {camp.name}
                    </h3>
                    <p className="text-xs font-bold text-rose-700 dark:text-rose-400 mt-0.5">
                      Organized by: {camp.organizer}
                    </p>
                  </div>

                  {/* Venue & Timing Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="font-medium">{camp.venue}, {camp.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{camp.startDate === camp.endDate ? camp.startDate : `${camp.startDate} to ${camp.endDate}`} • {camp.timings}</span>
                    </div>
                  </div>

                  {/* Urgent Blood Groups Needed */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1.5">
                      Urgently Needed Blood Groups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {camp.criticalBloodNeeded.map((bg) => (
                        <span
                          key={bg}
                          className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white font-black text-xs shadow-xs"
                        >
                          {bg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Facilities Provided */}
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {camp.facilities.slice(0, 3).map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        ✓ {f}
                      </span>
                    ))}
                  </div>

                  {/* Progress of Target Collection */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      <span>Collection Progress</span>
                      <span>{camp.collectedUnits} / {camp.targetUnits} Units ({Math.round((camp.collectedUnits / camp.targetUnits) * 100)}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((camp.collectedUnits / camp.targetUnits) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCampForRegister(camp);
                      setDonorSlotTime(camp.slotsAvailable[0] || '10:00 AM');
                      setIsRegisterModalOpen(true);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition shadow-md shadow-rose-600/25 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>{t.pledgeToDonate}</span>
                  </button>

                  <a
                    href={`tel:${camp.phone}`}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                    title={`Call Organizer: ${camp.phone}`}
                  >
                    <Phone className="w-4 h-4 text-rose-600" />
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${camp.name} ${camp.venue} ${camp.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                    title="View on Google Maps"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredCamps.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <Droplet className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Blood Camps Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active donation drives matched your search criteria. You can change your city filter or donate directly at any nearby licensed blood bank.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: LIVE BLOOD STOCK & FINDER (TAKER / RECIPIENT) */}
      {/* ===================================================================== */}
      {activeTab === 'stock' && (
        <div className="space-y-6">
          {/* Blood Group Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                Filter by Blood Group:
              </span>
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedStockGroup('all')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-black transition cursor-pointer ${
                    selectedStockGroup === 'all'
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  All Types
                </button>
                {ALL_BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedStockGroup(bg)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-black transition cursor-pointer ${
                      selectedStockGroup === bg
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Component Filter */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                Blood Component:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedComponent('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedComponent === 'all'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  All Components
                </button>
                {ALL_COMPONENTS.map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setSelectedComponent(comp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedComponent === comp
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blood Banks List */}
          <div className="space-y-4">
            {bloodBanks.map((bank) => (
              <div
                key={bank.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {bank.bloodBankName}
                      </h3>
                      {bank.is24x7 && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                          24x7 Emergency
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {bank.address} • Updated: {bank.lastUpdated}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {bank.distanceKm != null && (
                      <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-900">
                        {bank.distanceKm} km away
                      </span>
                    )}
                    <a
                      href={`tel:${bank.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Bank</span>
                    </a>
                  </div>
                </div>

                {/* Stock Table / Matrix */}
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 min-w-[500px]">
                    {(selectedStockGroup === 'all' ? ALL_BLOOD_GROUPS : [selectedStockGroup]).map((bg) => {
                      const stock = bank.inventory[bg];
                      const totalUnits = stock.wholeBlood + stock.prbc + stock.platelets + stock.ffp;
                      const isLow = totalUnits < 5;
                      const isCritical = totalUnits <= 2;

                      return (
                        <div
                          key={bg}
                          className={`p-3 rounded-2xl border text-center transition ${
                            isCritical
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                              : isLow
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="text-sm font-black text-rose-700 dark:text-rose-400">{bg}</div>
                          <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                            {totalUnits} <span className="text-[10px] font-normal text-slate-400">units</span>
                          </div>

                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 space-y-0.5 text-left border-t border-slate-200/60 dark:border-slate-700 pt-1">
                            <div>PRBC: <strong>{stock.prbc}</strong></div>
                            <div>Platelet: <strong>{stock.platelets}</strong></div>
                            <div>Whole: <strong>{stock.wholeBlood}</strong></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: URGENT BLOOD REQUESTS BOARD (FOR TAKERS & DONOR RESPONDERS) */}
      {/* ===================================================================== */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Post Request Action Hero */}
          <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Live Emergency Transfusion Broadcast</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                Need Blood Urgently for a Hospitalized Patient?
              </h3>
              <p className="text-xs text-rose-100">
                Post your patient's requirement to alert verified voluntary donors and Red Cross network in real time.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPostRequestModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-600" />
              <span>{t.postBloodRequest}</span>
            </button>
          </div>

          {/* Active Requests List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              Active Emergency Requests ({requests.filter(r => r.status === 'OPEN_URGENT').length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`rounded-3xl p-5 border shadow-sm space-y-4 transition ${
                    req.urgency === 'EMERGENCY_IMMEDIATE'
                      ? 'bg-rose-50/70 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900 dark:text-white">
                            {req.patientName}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-500">
                            ({req.age}Y/{req.gender[0]})
                          </span>
                        </div>
                        <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                          {req.unitsNeeded} Units • {req.component}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      req.urgency === 'EMERGENCY_IMMEDIATE'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.urgency === 'EMERGENCY_IMMEDIATE' ? 'Immediate Urgent' : 'Urgent Today'}
                    </span>
                  </div>

                  {/* Hospital & Location */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                      <Building2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{req.hospitalName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {req.hospitalAddress}
                    </div>
                    {req.notes && (
                      <p className="text-[11px] text-rose-900 dark:text-rose-200 font-medium pt-1 border-t border-slate-100 dark:border-slate-700">
                        "{req.notes}"
                      </p>
                    )}
                  </div>

                  {/* Fulfillment Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span>Units Arranged</span>
                      <span>{req.fulfilledUnits} of {req.unitsNeeded} Units ({req.responsesCount} Donors Responded)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((req.fulfilledUnits / req.unitsNeeded) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Attendant Call & Volunteer Response */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <a
                      href={`tel:${req.contactPhone}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-rose-400" />
                      <span>Call Attendant ({req.contactPhone})</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleRespondToRequest(req.id, req.patientName)}
                      className="py-2.5 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition cursor-pointer"
                      title="Pledge to donate for this patient"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>I Can Donate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: MY DONOR REGISTRATIONS & PLEDGE PASSES */}
      {/* ===================================================================== */}
      {activeTab === 'my-pledges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t.myPledges}
              </h3>
              <p className="text-xs text-slate-500">
                Digital token slips for your scheduled voluntary blood donations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('camps')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>+ Register for another camp</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myPledges.map((reg) => (
              <div
                key={reg.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-rose-200 dark:border-rose-900/60 shadow-md space-y-4 relative overflow-hidden"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase tracking-wider">
                    ✓ Verified Pledge Token
                  </span>
                  <span className="font-mono font-black text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-800">
                    {reg.tokenNumber}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30">
                    {reg.bloodGroup}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {reg.donorName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {reg.age} Years • {reg.gender} • Mobile: {reg.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>{reg.campName}</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{reg.campVenue}</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Scheduled Slot: {reg.slotDate} at {reg.slotTime}</span>
                  </div>
                </div>

                {/* Pre-donation advice */}
                <div className="text-[11px] text-slate-500 space-y-0.5 bg-rose-50/50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-100 dark:border-rose-950">
                  <span className="font-bold text-rose-800 dark:text-rose-300">Important Donor Advice:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Drink at least 500ml water before donation.</li>
                    <li>Avoid heavy fatty meals; have a light breakfast.</li>
                    <li>Bring a valid government ID (Aadhaar / Voter ID / Driving License).</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Do you wish to cancel this donation pledge?')) {
                        const updated = cancelDonorRegistration(reg.id);
                        setMyPledges(updated);
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                  >
                    Cancel Registration
                  </button>
                </div>
              </div>
            ))}

            {myPledges.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
                <Heart className="w-12 h-12 text-rose-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Active Donor Pledges</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You haven't registered for any blood donation camp yet. Explore nearby voluntary camps and pledge to save lives!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('camps')}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  Explore Nearby Camps
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: REGISTER AS DONOR AT CAMP */}
      {/* ===================================================================== */}
      {isRegisterModalOpen && selectedCampForRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                  <span>Register to Donate Blood</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Camp: {selectedCampForRegister.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterDonor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Priyaranjan Das"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age (18-65) *
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    required
                    value={donorAge}
                    onChange={(e) => setDonorAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gender *
                  </label>
                  <select
                    value={donorGender}
                    onChange={(e) => setDonorGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={donorBloodGroup}
                    onChange={(e) => setDonorBloodGroup(e.target.value as BloodGroup)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    {ALL_BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={donorSlotTime}
                  onChange={(e) => setDonorSlotTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {selectedCampForRegister.slotsAvailable.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Eligibility Self-Check Checklist */}
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-1.5">
                <span className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  Donor Eligibility Criteria
                </span>
                <p className="text-[11px] text-rose-800 dark:text-rose-300">
                  By submitting, you confirm you weigh 45kg or more, have not received a tattoo in the last 6 months, and feel in good general health today.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md shadow-rose-600/30"
                >
                  Confirm Donor Pledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: POST URGENT BLOOD REQUIREMENT (TAKER / RECIPIENT) */}
      {/* ===================================================================== */}
      {isPostRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Post Urgent Blood Requirement</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcasts to nearby blood banks and registered voluntary donors.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPostRequestModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  required
                  value={reqPatientName}
                  onChange={(e) => setReqPatientName(e.target.value)}
                  placeholder="e.g. Subhashree Mohanty"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={reqBloodGroup}
                    onChange={(e) => setReqBloodGroup(e.target.value as BloodGroup)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    {ALL_BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Component *
                  </label>
                  <select
                    value={reqComponent}
                    onChange={(e) => setReqComponent(e.target.value as BloodComponent)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {ALL_COMPONENTS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Units Needed *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={reqUnits}
                    onChange={(e) => setReqUnits(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reqHospital}
                    onChange={(e) => setReqHospital(e.target.value)}
                    placeholder="e.g. Capital Hospital"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ward / Bed / Department
                  </label>
                  <input
                    type="text"
                    value={reqAddress}
                    onChange={(e) => setReqAddress(e.target.value)}
                    placeholder="e.g. Ward 4 Bed 12 / ICU"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Urgency Level *
                  </label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="EMERGENCY_IMMEDIATE">Immediate (Within 1-2 Hours)</option>
                    <option value="URGENT_TODAY">Urgent (Within Today)</option>
                    <option value="SCHEDULED_SURGERY">Scheduled Surgery (Next 24-48 Hours)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={reqCity}
                    onChange={(e) => setReqCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Attendant Name
                  </label>
                  <input
                    type="text"
                    value={reqAttendant}
                    onChange={(e) => setReqAttendant(e.target.value)}
                    placeholder="e.g. Alok Mohanty"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={reqPhone}
                    onChange={(e) => setReqPhone(e.target.value)}
                    placeholder="+91 94371 XXXXX"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Diagnosis / Requisition Note
                </label>
                <textarea
                  rows={2}
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="e.g. Postpartum hemorrhage, severe dengue thrombocytopenia, emergency trauma surgery..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostRequestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md shadow-rose-600/30"
                >
                  Broadcast Urgent Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
