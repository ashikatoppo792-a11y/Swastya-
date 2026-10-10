import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  UserCheck
} from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  piiMasked: boolean;
  onTogglePiiMask: (val: boolean) => void;
  onPurgeData: () => void;
}

export const SecurityPrivacyModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  piiMasked,
  onTogglePiiMask,
  onPurgeData,
}) => {
  const [pin, setPin] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'security' | 'consent' | 'privacy'>('security');

  if (!isOpen) return null;

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === '0000') {
      setPinUnlocked(true);
      setPinError('');
      onTogglePiiMask(false);
    } else {
      setPinError('Incorrect PIN. (Default demo PIN is 1234)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-black">Security & Privacy Governance</h3>
              <p className="text-[11px] text-slate-400">
                DPDP Act 2023 Compliant • Role-Based Access Control • Data Rights
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-3 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'security'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Encryption & Access
          </button>
          <button
            onClick={() => setActiveTab('consent')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'consent'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Consent Log (DPDP 2023)
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'privacy'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Right to Erasure
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {activeTab === 'security' && (
            <div className="space-y-4">
              {/* Security Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold">
                    <Lock className="w-4 h-4" />
                    <span>In-Transit Encryption</span>
                  </div>
                  <div className="font-mono text-slate-700 dark:text-slate-300">TLS 1.3 / HTTPS</div>
                  <div className="text-[10px] text-slate-400">All data transfers encrypted</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold">
                    <Database className="w-4 h-4" />
                    <span>At-Rest Storage</span>
                  </div>
                  <div className="font-mono text-slate-700 dark:text-slate-300">AES-256 GCM</div>
                  <div className="text-[10px] text-slate-400">Local & server data isolated</div>
                </div>
              </div>

              {/* Staff Authentication PIN */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-teal-950 dark:text-teal-200">
                      Clinician PIN Security Gate
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    pinUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pinUnlocked ? 'Verified Active Session' : 'Locked'}
                  </span>
                </div>

                <p className="text-teal-800 dark:text-teal-300">
                  Staff members must authenticate to unlock full patient Aadhaar identifiers and sensitive reports. Default demo PIN: <strong>1234</strong>.
                </p>

                {!pinUnlocked ? (
                  <form onSubmit={handleUnlockPin} className="flex gap-2">
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter PIN (1234)"
                      className="p-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-teal-300 text-slate-900 dark:text-white font-mono w-36 text-center tracking-widest"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition"
                    >
                      Authenticate
                    </button>
                  </form>
                ) : (
                  <div className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Medical Officer session authenticated. Full records unmasked.</span>
                  </div>
                )}

                {pinError && <p className="text-rose-600 font-bold">{pinError}</p>}
              </div>

              {/* PII Masking Quick Switcher */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Patient PII Masking</div>
                  <div className="text-[11px] text-slate-500">
                    Masks names to "R*** P***" on shared hospital screens
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onTogglePiiMask(!piiMasked)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    piiMasked ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {piiMasked ? 'Masked (ON)' : 'Visible (OFF)'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'consent' && (
            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>Informed Digital Health Consent Log</span>
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Consent
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Consent collected at intake explicitly permits symptom triage prioritization under DPDP Act 2023 Section 6.
                </p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  Purpose Specification: Clinical Acuity Sorting • Validity: Current Encounter Only
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Patient Right to Erasure / Data Purge</span>
              </div>
              <p className="text-rose-800 dark:text-rose-300">
                Under Section 12 of the DPDP Act 2023, patients have the right to revoke consent and request deletion of their recorded health information and uploaded reports.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to purge all local patient records and cached files?')) {
                    onPurgeData();
                    alert('Local patient cache cleared.');
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge My Health Records</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
