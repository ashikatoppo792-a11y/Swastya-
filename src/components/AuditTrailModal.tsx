import React from 'react';
import { AuditEntry } from '../types';
import { History, X, Clock, User, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  tokenNumber: string;
  auditTrail: AuditEntry[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  patientName,
  tokenNumber,
  auditTrail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold">
                Clinical Audit Trail & Human-in-the-Loop Log
              </h3>
              <p className="text-xs text-slate-400">
                Patient: {patientName} • Token: <strong className="text-teal-300">{tokenNumber}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Timeline */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl p-3 text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Every AI inference, clinical modification, and supervisor approval is recorded in an immutable ledger aligned with DPDP Act 2023 and ABDM standards.
            </span>
          </div>

          <div className="relative border-l-2 border-teal-500/40 dark:border-teal-700/50 ml-4 pl-6 space-y-6 my-4">
            {auditTrail.map((entry, idx) => (
              <div key={entry.id || idx} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-teal-600 dark:border-teal-400 group-hover:scale-125 transition-transform" />

                <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(entry.timestamp).toLocaleString('en-IN')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200">
                      {entry.action.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>{entry.actorName}</span>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                      ({entry.actorRole})
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {entry.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
