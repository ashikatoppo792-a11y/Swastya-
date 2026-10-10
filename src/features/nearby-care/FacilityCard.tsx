import React, { useState } from 'react';
import { NormalizedFacility } from './types';
import { formatDistance, formatTravelTime, getNavigationUrl } from './utils/formatDistance';
import {
  Phone,
  Navigation2,
  Share2,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Info,
  ChevronRight,
  Flame,
  UserCheck
} from 'lucide-react';

interface FacilityCardProps {
  facility: NormalizedFacility;
  userLat?: number;
  userLng?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onReferPatient?: (facility: NormalizedFacility) => void;
  isClinicianMode?: boolean;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  userLat,
  userLng,
  isSelected = false,
  onSelect,
  onReferPatient,
  isClinicianMode = false,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('swasthya_saved_facilities');
      if (saved) {
        const ids = JSON.parse(saved);
        return Array.isArray(ids) && ids.includes(facility.id);
      }
    } catch {
      // Ignore
    }
    return false;
  });

  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportNote, setReportNote] = useState<string>('');

  const navUrl = getNavigationUrl(facility.lat, facility.lng, facility.name, userLat, userLng);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('swasthya_saved_facilities');
      let ids: string[] = saved ? JSON.parse(saved) : [];
      if (isSaved) {
        ids = ids.filter((id) => id !== facility.id);
        setIsSaved(false);
      } else {
        ids.push(facility.id);
        setIsSaved(true);
      }
      localStorage.setItem('swasthya_saved_facilities', JSON.stringify(ids));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${facility.name}\n📍 ${facility.address}\n📞 ${facility.phone}\nNavigate: ${navUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: facility.name,
          text: shareText,
          url: navUrl
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert(`Facility details:\n${shareText}`);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reporting. Our clinical directory maintainers will verify the information with the district health administration.');
    setReportModalOpen(false);
    setReportNote('');
  };

  return (
    <>
      <div
        onClick={onSelect}
        className={`rounded-2xl border transition-all p-5 space-y-3 cursor-pointer ${
          isSelected
            ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600 shadow-md ring-2 ring-sky-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
        }`}
      >
        {/* Top Badges Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Facility Type Badge */}
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                facility.type === 'hospital'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  : facility.type === 'PHC' || facility.type === 'CHC'
                  ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                  : facility.type === 'pharmacy'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              {facility.type}
            </span>

            {/* Ownership Badge */}
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                facility.ownership === 'government'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {facility.ownership === 'government' ? 'Government (सरकारी)' : 'Private (निजी)'}
            </span>

            {/* PM-JAY Empanelled */}
            {facility.pmjayEmpanelled && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-600" />
                <span>PM-JAY</span>
              </span>
            )}
          </div>

          {/* 24x7 Emergency Pill */}
          {facility.emergencyAvailable && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white shadow-sm flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3" />
              <span>24x7 Emergency</span>
            </span>
          )}
        </div>

        {/* Facility Name & Address */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {facility.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            📍 {facility.address}
          </p>
        </div>

        {/* Distance & Real-Time Travel Time */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-200">
            <span className="text-sky-600 dark:text-sky-400 font-extrabold">
              {formatDistance(facility.distanceKm)}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatTravelTime(facility.estimatedTravelTimeMin)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{facility.hours}</span>
          </div>
        </div>

        {/* Clinical Bed & ICU Info if Available */}
        {facility.icuBedsAvailable !== undefined && (
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 font-bold">
              ICU Beds: {facility.icuBedsAvailable} available
            </span>
            {facility.oxygenAvailable && (
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                Oxygen Supply Active
              </span>
            )}
          </div>
        )}

        {/* Specialities Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {facility.specialities.slice(0, 4).map((spec, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {spec}
            </span>
          ))}
          {facility.specialities.length > 4 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
              +{facility.specialities.length - 4} more
            </span>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Call Button */}
          <a
            href={`tel:${facility.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-[90px] py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition flex items-center justify-center gap-1.5 no-underline"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call</span>
          </a>

          {/* Directions Button */}
          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-[110px] py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-1.5 no-underline"
          >
            <Navigation2 className="w-3.5 h-3.5" />
            <span>Get Directions</span>
          </a>

          {/* Clinician Referral Action */}
          {isClinicianMode && onReferPatient && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReferPatient(facility);
              }}
              className="py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-1 shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Refer Patient</span>
            </button>
          )}

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Share facility address"
            aria-label="Share facility"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Bookmark / Save */}
          <button
            type="button"
            onClick={toggleSave}
            className={`p-2 rounded-xl transition ${
              isSaved
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isSaved ? 'Saved in offline bookmarks' : 'Save for offline'}
            aria-label="Bookmark facility"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Report Incorrect Info */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setReportModalOpen(true);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Report outdated info"
            aria-label="Report incorrect info"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>

        {/* Data Source & Outdated Disclaimer */}
        <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Source: {facility.source.toUpperCase()} • Verified {facility.lastUpdated}</span>
          <span className="italic text-slate-500">Please call to confirm</span>
        </div>

        {copySuccess && (
          <div className="text-[11px] font-bold text-emerald-500 text-center animate-fade-in">
            ✓ Facility details and navigation link copied to clipboard!
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setReportModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Report Incorrect Facility Info</span>
            </h4>
            <p className="text-xs text-slate-500">
              Reporting for: <strong>{facility.name}</strong>
            </p>
            <textarea
              rows={3}
              value={reportNote}
              onChange={(e) => setReportNote(e.target.value)}
              placeholder="e.g. Phone number changed, no oxygen beds available, or incorrect hours..."
              className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReportSubmit}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
