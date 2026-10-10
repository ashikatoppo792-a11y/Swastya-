import React from 'react';
import { NormalizedFacility } from './types';
import { FacilityCard } from './FacilityCard';
import { SearchX, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

interface FacilityListProps {
  facilities: NormalizedFacility[];
  isLoading: boolean;
  selectedFacilityId?: string;
  onSelectFacility: (id: string) => void;
  onExpandRadius: () => void;
  currentRadiusKm: number;
  userLat?: number;
  userLng?: number;
  onReferPatient?: (facility: NormalizedFacility) => void;
  isClinicianMode?: boolean;
}

export const FacilityList: React.FC<FacilityListProps> = ({
  facilities,
  isLoading,
  selectedFacilityId,
  onSelectFacility,
  onExpandRadius,
  currentRadiusKm,
  userLat,
  userLng,
  onReferPatient,
  isClinicianMode = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading facilities">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 animate-pulse space-y-3"
          >
            <div className="flex gap-2">
              <div className="w-16 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="w-20 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="w-3/4 h-6 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="w-1/2 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="flex gap-3 pt-2">
              <div className="flex-1 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (facilities.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 bg-white/50 dark:bg-slate-900/50">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto shadow-sm">
          <SearchX className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Facilities Found Within {currentRadiusKm} km
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            In rural or semi-urban areas, tertiary medical colleges and specialized trauma centers may be located farther away.
          </p>
        </div>

        <button
          type="button"
          onClick={onExpandRadius}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition inline-flex items-center gap-2"
        >
          <span>Expand Search Radius (+15 km)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="feed" aria-label="Nearby Healthcare Facilities List">
      {facilities.map((fac) => (
        <FacilityCard
          key={fac.id}
          facility={fac}
          userLat={userLat}
          userLng={userLng}
          isSelected={fac.id === selectedFacilityId}
          onSelect={() => onSelectFacility(fac.id)}
          onReferPatient={onReferPatient}
          isClinicianMode={isClinicianMode}
        />
      ))}
    </div>
  );
};
