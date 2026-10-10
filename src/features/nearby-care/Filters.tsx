import React from 'react';
import { NearbyFilters, FacilityType } from './types';
import {
  Search,
  Filter,
  Flame,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  Clock,
  Building2
} from 'lucide-react';

interface FiltersProps {
  filters: NearbyFilters;
  onChange: (updates: Partial<NearbyFilters>) => void;
  onReset: () => void;
  totalResults: number;
}

const ALL_TYPES: { id: FacilityType; label: string }[] = [
  { id: 'hospital', label: 'Hospitals' },
  { id: 'PHC', label: 'PHCs' },
  { id: 'CHC', label: 'CHCs' },
  { id: 'clinic', label: 'Clinics' },
  { id: 'pharmacy', label: 'Pharmacies' },
  { id: 'diagnostic_lab', label: 'Labs' },
  { id: 'nursing_home', label: 'Nursing Homes' }
];

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const toggleType = (typeId: FacilityType) => {
    let next: FacilityType[];
    if (filters.facilityTypes.includes(typeId)) {
      if (filters.facilityTypes.length === 1) return; // Keep at least one
      next = filters.facilityTypes.filter((t) => t !== typeId);
    } else {
      next = [...filters.facilityTypes, typeId];
    }
    onChange({ facilityTypes: next });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Search facility name, doctor speciality, or area..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 hidden sm:inline">Sort:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            className="py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="nearest">Nearest Distance (निकटतम)</option>
            <option value="triage_match">Triage Acuity & Emergency</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Facility Type Filter Chips */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
          Facility Type / प्रकार
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map((t) => {
            const isSelected = filters.facilityTypes.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleType(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Toggles: Emergency, Government, Open Now, PM-JAY */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
        {/* 24x7 Emergency Button */}
        <button
          type="button"
          onClick={() => onChange({ emergencyOnly: !filters.emergencyOnly })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filters.emergencyOnly
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>24x7 Emergency Only</span>
        </button>

        {/* Government Only */}
        <button
          type="button"
          onClick={() =>
            onChange({
              ownership: filters.ownership === 'government' ? 'all' : 'government'
            })
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filters.ownership === 'government'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Government Only (सरकारी)</span>
        </button>

        {/* PM-JAY Empanelled */}
        <button
          type="button"
          onClick={() => onChange({ pmjayOnly: !filters.pmjayOnly })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filters.pmjayOnly
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PM-JAY Empanelled</span>
        </button>

        {/* Open Now */}
        <button
          type="button"
          onClick={() => onChange({ openNowOnly: !filters.openNowOnly })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filters.openNowOnly
              ? 'bg-sky-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Open Now</span>
        </button>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          className="ml-auto text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Radius Slider Row */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-500" />
            <span>Search Radius: <strong>{filters.maxRadiusKm} km</strong></span>
          </span>
          <span className="text-slate-400">
            {totalResults} facilities found
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={filters.maxRadiusKm}
          onChange={(e) => onChange({ maxRadiusKm: Number(e.target.value) })}
          className="w-full accent-sky-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>1 km</span>
          <span>10 km</span>
          <span>25 km</span>
          <span>50 km</span>
        </div>
      </div>
    </div>
  );
};
