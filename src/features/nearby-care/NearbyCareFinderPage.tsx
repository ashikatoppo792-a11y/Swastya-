import React, { useState, useEffect } from 'react';
import { useGeolocation } from './LocationProvider';
import { useNearbyFacilities } from './useNearbyFacilities';
import { MapView } from './MapView';
import { FacilityList } from './FacilityList';
import { Filters } from './Filters';
import { ReferralPanel } from './ReferralPanel';
import { NormalizedFacility, FacilityType } from './types';
import { defaultPlacesService } from './PlacesService';
import { getNavigationUrl } from './utils/formatDistance';
import {
  PhoneCall,
  MapPin,
  Flame,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  Navigation2,
  Search,
  Wifi,
  WifiOff,
  Layers,
  List,
  Map as MapIcon,
  ShieldCheck,
  Check,
  X,
  Compass
} from 'lucide-react';

interface NearbyCareFinderProps {
  currentLanguage?: string;
  initialSpecialty?: string;
  isEmergencyMode?: boolean;
  onBookAtHospital?: (hospitalName: string) => void;
  isClinicianMode?: boolean;
}

export const NearbyCareFinderPage: React.FC<NearbyCareFinderProps> = ({
  currentLanguage = 'en',
  initialSpecialty = '',
  isEmergencyMode = false,
  onBookAtHospital,
  isClinicianMode = false,
}) => {
  const {
    status,
    coordinates,
    errorMessage,
    accuracyWarning,
    requestCurrentLocation,
    setManualLocation,
    clearLocation
  } = useGeolocation();

  // Search by city/PIN code modal or bar
  const [manualQuery, setManualQuery] = useState('');
  const [isSearchingManual, setIsSearchingManual] = useState(false);
  const [manualSearchError, setManualSearchError] = useState<string | null>(null);

  // Selected Facility for popup/highlight & referral
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | undefined>();
  const [referralFacility, setReferralFacility] = useState<NormalizedFacility | null>(null);

  // Low Bandwidth Mode (List-only, zero map tiles loaded)
  const [listOnlyMode, setListOnlyMode] = useState<boolean>(false);

  // Mobile View Switcher (Map vs List)
  const [mobileView, setMobileView] = useState<'both' | 'map' | 'list'>('both');

  // Emergency Mode state (can be initialized from triage prop or toggled)
  const [emergencyActive, setEmergencyActive] = useState<boolean>(isEmergencyMode);

  // High contrast mode
  const [highContrastMap, setHighContrastMap] = useState<boolean>(false);

  // Hooks for nearby facilities
  const {
    facilities,
    rawCount,
    isLoading,
    filters,
    updateFilters,
    expandRadius,
    refetch
  } = useNearbyFacilities({
    emergencyOnly: emergencyActive,
    speciality: initialSpecialty,
    maxRadiusKm: emergencyActive ? 25 : 15,
    sortBy: emergencyActive ? 'nearest' : 'triage_match'
  });

  // When emergencyActive changes, enforce emergency filter
  useEffect(() => {
    if (emergencyActive) {
      updateFilters({ emergencyOnly: true, sortBy: 'nearest' });
    }
  }, [emergencyActive, updateFilters]);

  // Handle manual city or PIN code search
  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    setIsSearchingManual(true);
    setManualSearchError(null);

    const match = await defaultPlacesService.geocodeQuery(manualQuery.trim());
    setIsSearchingManual(false);

    if (match) {
      setManualLocation(match.lat, match.lng, match.displayName);
      setManualQuery('');
    } else {
      setManualSearchError('Could not locate city or PIN code. Try "Bhubaneswar", "Cuttack", "Puri", or a 6-digit PIN code like 751019.');
    }
  };

  // Find the single nearest emergency facility for one-tap button
  const nearestEmergencyFacility = facilities.find((f) => f.emergencyAvailable) || facilities[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in pb-16">
      {/* ========================================================= */}
      {/* 3b. EMERGENCY BEHAVIOUR BANNER */}
      {/* ========================================================= */}
      {emergencyActive && (
        <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 border border-red-500 animate-slide-down">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                <Flame className="w-4 h-4 animate-bounce" />
                <span>Urgent Care / Emergency Mode Active</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Emergency Healthcare Protocol (खतरे की स्थिति)
              </h2>
              <p className="text-xs sm:text-sm text-red-100 font-medium">
                Showing 24x7 Emergency-capable trauma centres & hospitals, sorted strictly by nearest distance.
              </p>
            </div>

            {/* Emergency Hotline Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <a
                href="tel:108"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-white text-red-700 font-black text-sm shadow-xl hover:bg-red-50 transition flex items-center justify-center gap-2 no-underline"
              >
                <PhoneCall className="w-5 h-5 text-red-600 animate-pulse" />
                <span>Call 108 Ambulance</span>
              </a>

              <a
                href="tel:112"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-red-950/80 text-white border border-red-400 font-bold text-sm hover:bg-red-900 transition flex items-center justify-center gap-2 no-underline"
              >
                <PhoneCall className="w-5 h-5 text-amber-400" />
                <span>Call 112 National</span>
              </a>
            </div>
          </div>

          {/* Persistent Safety Disclaimer & One-Tap Nearest Directions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-red-400/40 text-xs text-red-100">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>If this is an acute life-threatening emergency, call 108 now. Do not wait for the app.</span>
            </div>

            {nearestEmergencyFacility && (
              <a
                href={getNavigationUrl(
                  nearestEmergencyFacility.lat,
                  nearestEmergencyFacility.lng,
                  nearestEmergencyFacility.name,
                  coordinates?.lat,
                  coordinates?.lng
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-extrabold text-xs transition flex items-center gap-1.5 no-underline shrink-0 shadow-sm"
              >
                <Navigation2 className="w-3.5 h-3.5" />
                <span>Directions to Nearest: {nearestEmergencyFacility.name.split(' ')[0]}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. LOCATION CONTROLS & PRIVACY BAR */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Resolved Address & Status */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Care Search Location
              </span>
              {coordinates?.isManual && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Manual / Preset
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="line-clamp-1">
                {coordinates?.resolvedAddress || 'Searching location...'}
              </span>
            </h3>

            {accuracyWarning && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{accuracyWarning}</span>
              </p>
            )}

            {errorMessage && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errorMessage}
              </p>
            )}
          </div>

          {/* Location Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Detect Location Button */}
            <button
              type="button"
              onClick={requestCurrentLocation}
              disabled={status === 'loading'}
              className="flex-1 md:flex-initial py-2 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Navigation2 className="w-3.5 h-3.5" />
              <span>{status === 'loading' ? 'Detecting...' : 'Use My Current Location'}</span>
            </button>

            {/* Clear Location */}
            <button
              type="button"
              onClick={clearLocation}
              className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
              title="Clear stored coordinates"
            >
              Clear
            </button>

            {/* Low Bandwidth List-Only Toggle */}
            <button
              type="button"
              onClick={() => setListOnlyMode(!listOnlyMode)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                listOnlyMode
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="Low-bandwidth mode disables map tile downloads"
            >
              {listOnlyMode ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-slate-400" />}
              <span>{listOnlyMode ? '2G / List-Only Mode' : 'Standard View'}</span>
            </button>
          </div>
        </div>

        {/* Manual Geocoding Input (City / PIN Code / Area) */}
        <form onSubmit={handleManualSearch} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={manualQuery}
              onChange={(e) => setManualQuery(e.target.value)}
              placeholder="Search by City, Area, or 6-digit PIN code (e.g. 751024, Cuttack, Puri)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingManual || !manualQuery.trim()}
            className="py-2 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs transition disabled:opacity-40"
          >
            {isSearchingManual ? 'Locating...' : 'Set Location'}
          </button>
        </form>

        {manualSearchError && (
          <p className="text-xs text-rose-500 font-medium">{manualSearchError}</p>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. FILTERS & SEARCH MODULE */}
      {/* ========================================================= */}
      <Filters
        filters={filters}
        onChange={updateFilters}
        onReset={() =>
          updateFilters({
            facilityTypes: ['hospital', 'clinic', 'PHC', 'CHC', 'pharmacy', 'diagnostic_lab', 'nursing_home'],
            ownership: 'all',
            openNowOnly: false,
            emergencyOnly: false,
            speciality: '',
            maxRadiusKm: 15,
            searchQuery: '',
            sortBy: 'nearest',
            pmjayOnly: false
          })
        }
        totalResults={facilities.length}
      />

      {/* ========================================================= */}
      {/* 3. INTERACTIVE MAP & FACILITY LIST LAYOUT */}
      {/* ========================================================= */}
      {listOnlyMode ? (
        /* List-Only View for Low Bandwidth / 2G connections */
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold">
              <WifiOff className="w-4 h-4 text-amber-600" />
              <span>Low-Bandwidth Mode Active: Map tiles disabled to save mobile data.</span>
            </span>
            <button
              type="button"
              onClick={() => setListOnlyMode(false)}
              className="underline font-bold text-xs"
            >
              Enable Map
            </button>
          </div>

          <FacilityList
            facilities={facilities}
            isLoading={isLoading}
            selectedFacilityId={selectedFacilityId}
            onSelectFacility={setSelectedFacilityId}
            onExpandRadius={expandRadius}
            currentRadiusKm={filters.maxRadiusKm}
            userLat={coordinates?.lat}
            userLng={coordinates?.lng}
            onReferPatient={(fac) => setReferralFacility(fac)}
            isClinicianMode={isClinicianMode}
          />
        </div>
      ) : (
        /* Responsive Desktop Side-by-Side / Mobile Map & List Split */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Map */}
          <div className="lg:col-span-7 h-[420px] sm:h-[520px] lg:h-[680px] sticky top-20">
            <MapView
              userLat={coordinates?.lat}
              userLng={coordinates?.lng}
              accuracyRadiusMeters={coordinates?.accuracyMeters}
              facilities={facilities}
              selectedFacilityId={selectedFacilityId}
              onSelectFacility={(id) => {
                setSelectedFacilityId(id);
                // Scroll card into view
              }}
              onManualPinPlaced={(lat, lng) => {
                setManualLocation(lat, lng);
              }}
              isHighContrast={highContrastMap}
            />
          </div>

          {/* Right Column: Facility Cards List */}
          <div className="lg:col-span-5 space-y-4 max-h-[680px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <List className="w-4 h-4 text-sky-500" />
                <span>Nearby Facilities ({facilities.length})</span>
              </h4>
              <span className="text-xs text-slate-400">
                Radius: {filters.maxRadiusKm} km
              </span>
            </div>

            <FacilityList
              facilities={facilities}
              isLoading={isLoading}
              selectedFacilityId={selectedFacilityId}
              onSelectFacility={setSelectedFacilityId}
              onExpandRadius={expandRadius}
              currentRadiusKm={filters.maxRadiusKm}
              userLat={coordinates?.lat}
              userLng={coordinates?.lng}
              onReferPatient={(fac) => setReferralFacility(fac)}
              isClinicianMode={isClinicianMode}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. CLINICIAN REFERRAL MODAL */}
      {/* ========================================================= */}
      {referralFacility && (
        <ReferralPanel
          isOpen={Boolean(referralFacility)}
          onClose={() => setReferralFacility(null)}
          facility={referralFacility}
          patientCoordinates={coordinates ? { lat: coordinates.lat, lng: coordinates.lng } : undefined}
        />
      )}
    </div>
  );
};
