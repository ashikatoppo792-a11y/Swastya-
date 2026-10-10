import React, { useState } from 'react';
import { Send, X, PhoneCall, Building2, Truck, Video, FileText, MapPin, CheckCircle2 } from 'lucide-react';
import { SEED_FACILITIES } from '../features/nearby-care/data/seedFacilities';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  tokenNumber: string;
  defaultDestination: string;
  defaultSummary: string;
  onConfirmReferral: (referralData: any) => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  patientName,
  tokenNumber,
  defaultDestination,
  defaultSummary,
  onConfirmReferral,
}) => {
  const [destination, setDestination] = useState(defaultDestination || 'AIIMS Bhubaneswar (Apex Trauma)');
  const [urgency, setUrgency] = useState('Immediate 108 ALS Ambulance Dispatch');
  const [transportType, setTransportType] = useState('108 ALS Ambulance');
  const [clinicalSummary, setClinicalSummary] = useState(defaultSummary || '');
  const [teleconsultNeeded, setTeleconsultNeeded] = useState(true);
  const [sharePatientCoordinates, setSharePatientCoordinates] = useState(true);

  if (!isOpen) return null;

  // Top suggested tertiary & district facilities from seed dataset
  const suggestedFacilities = SEED_FACILITIES.filter(
    (f) => f.emergencyAvailable && f.ownership === 'government'
  ).slice(0, 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReferral({
      destinationFacility: destination,
      urgency,
      transportType,
      clinicalSummary,
      sharePatientCoordinates,
      patientCoordinatesShared: sharePatientCoordinates ? 'Approx. lat: 20.296, lng: 85.824 (Consent Granted)' : 'Masked / Redacted',
      teleconsultId: teleconsultNeeded ? `eSANJ-${Math.floor(100000 + Math.random() * 900000)}` : null,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-teal-300" />
            <div>
              <h3 className="text-base font-bold">Refer to Higher Medical Centre</h3>
              <p className="text-xs text-teal-200">
                Patient: {patientName} • Token: {tokenNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Select Receiving Facility from Nearby Care Network */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Select Destination Facility (निकटतम रेफरल नेटवर्क)
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {suggestedFacilities.map((fac) => (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => setDestination(`${fac.name} (${fac.type.toUpperCase()})`)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition ${
                    destination.includes(fac.name)
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="truncate font-semibold">{fac.name.split('(')[0]}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>ICU: {fac.icuBedsAvailable || 8} beds</span>
                    <span className="text-emerald-500 font-bold">24x7</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Referral Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Immediate 108 ALS Ambulance Dispatch">🚨 Immediate (108 ALS)</option>
                <option value="Transfer within 2 Hours">⚡ Within 2 Hours (Urgent)</option>
                <option value="Elective Next-Day Transfer">📅 Elective OPD Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Transport Arrangement
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value)}
                  className="w-full pl-9 pr-2 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="108 ALS Ambulance">108 ALS Ambulance</option>
                  <option value="108 BLS Ambulance">108 BLS Ambulance</option>
                  <option value="Facility Ambulance">PHC / Facility Van</option>
                  <option value="Patient Own Transport">Self / Private Transport</option>
                </select>
              </div>
            </div>
          </div>

          {/* eSanjeevani Teleconsultation Checkbox */}
          <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-teal-600" />
              <div>
                <div className="text-xs font-bold text-teal-900 dark:text-teal-200">
                  eSanjeevani Tele-Consult Integration
                </div>
                <div className="text-[11px] text-teal-700 dark:text-teal-300">
                  Auto-create telemedicine case ticket for specialist guidance in transit
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={teleconsultNeeded}
              onChange={(e) => setTeleconsultNeeded(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded cursor-pointer"
            />
          </div>

          {/* Patient Location Sharing Consent Checkbox */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="shareCoordinatesConsent"
              checked={sharePatientCoordinates}
              onChange={(e) => setSharePatientCoordinates(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-sky-600 rounded cursor-pointer"
            />
            <label htmlFor="shareCoordinatesConsent" className="text-xs text-slate-700 dark:text-slate-300 leading-tight">
              <span className="font-bold text-slate-900 dark:text-white block">
                Attach Patient GPS Coordinates for Emergency Dispatch
              </span>
              <span className="text-[11px] text-slate-500">
                Shared strictly with the receiving hospital dispatch desk and ambulance crew (DPDP Act 2023 compliant).
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Clinical Handover Summary
            </label>
            <textarea
              rows={3}
              value={clinicalSummary}
              onChange={(e) => setClinicalSummary(e.target.value)}
              placeholder="Summary of presentation, pre-referral medication given (e.g. Loading dose Aspirin, IV fluids)..."
              className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Issue Referral Slip & Log Audit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
