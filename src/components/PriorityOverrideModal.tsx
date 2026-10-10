import React, { useState } from 'react';
import { TriagePriority } from '../types';
import { AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';

interface PriorityOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPriority: TriagePriority;
  onConfirmOverride: (newPriority: TriagePriority, reason: string) => void;
}

const overrideCategories = [
  'Physical examination reveals signs not reflected in initial report',
  'Patient clinical appearance appears critically unstable / stable',
  'Vital signs repeated at bedside and found markedly different',
  'High-risk comorbidities / pregnancy risk requires higher priority',
  'Standard clinical protocol override per attending physician judgment',
];

export const PriorityOverrideModal: React.FC<PriorityOverrideModalProps> = ({
  isOpen,
  onClose,
  currentPriority,
  onConfirmOverride,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<TriagePriority>(
    currentPriority === 'Emergency' ? 'Urgent' : 'Emergency'
  );
  const [selectedReasonCategory, setSelectedReasonCategory] = useState(overrideCategories[0]);
  const [customRationale, setCustomRationale] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customRationale.trim()
      ? `${selectedReasonCategory} — Note: ${customRationale.trim()}`
      : selectedReasonCategory;

    if (!finalReason.trim()) {
      setError('A clinical justification is strictly required to override AI priority.');
      return;
    }

    onConfirmOverride(selectedPriority, finalReason);
    onClose();
  };

  const priorityOptions: Array<{ label: TriagePriority; color: string; desc: string }> = [
    { label: 'Emergency', color: 'bg-rose-600', desc: 'Immediate Resuscitation (<0 min)' },
    { label: 'Urgent', color: 'bg-orange-500', desc: 'Urgent Care (<30 min)' },
    { label: 'Semi-urgent', color: 'bg-amber-500', desc: 'Semi-urgent (<60 min)' },
    { label: 'Routine', color: 'bg-emerald-600', desc: 'Standard Routine Queue' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold">Override AI Triage Priority</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200">
            <strong>CLINICAL AUDIT MANDATE:</strong> Overriding the AI triage score requires an explicit medical rationale. This action will be permanently recorded in the patient audit log.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select New Priority Level (Currently: {currentPriority})
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelectedPriority(opt.label)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    selectedPriority === opt.label
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Clinical Justification Category
            </label>
            <select
              value={selectedReasonCategory}
              onChange={(e) => setSelectedReasonCategory(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {overrideCategories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Additional Clinician Notes / Observations
            </label>
            <textarea
              rows={3}
              value={customRationale}
              onChange={(e) => {
                setCustomRationale(e.target.value);
                setError('');
              }}
              placeholder="e.g. Bedside exam reveals acute diaphoresis and altered sensorium not captured in kiosk intake..."
              className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-600">{error}</p>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              Confirm Clinical Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
