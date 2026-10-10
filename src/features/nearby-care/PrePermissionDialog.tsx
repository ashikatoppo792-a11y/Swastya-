import React from 'react';
import { ShieldCheck, MapPin, X, Lock, CheckCircle2 } from 'lucide-react';

interface PrePermissionDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onChooseManual: () => void;
  onCancel: () => void;
}

export const PrePermissionDialog: React.FC<PrePermissionDialogProps> = ({
  isOpen,
  onConfirm,
  onChooseManual,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
        {/* Header with Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Find Care Near You
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Privacy-first location detection
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why Location is Needed */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            To display nearby Government hospitals, 24x7 emergency centers, PHCs, and open pharmacies with realistic travel times, we need your approximate location.
          </p>

          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Used only in this browser session to calculate facility distance</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" />
              <span>Never sold, tracked, or sent to unauthorized servers (DPDP Act 2023 aligned)</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
              <span>You can clear or change your location at any time</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Allow & Detect Location (अनुमति दें)</span>
          </button>

          <button
            type="button"
            onClick={onChooseManual}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition border border-slate-200 dark:border-slate-700"
          >
            Search by City or PIN Code Manually
          </button>
        </div>
      </div>
    </div>
  );
};
