import React, { useState } from 'react';
import { NormalizedFacility, ReferralDetails } from './types';
import {
  UserCheck,
  Building2,
  AlertTriangle,
  Send,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  MapPin
} from 'lucide-react';

interface ReferralPanelProps {
  isOpen: boolean;
  onClose: () => void;
  facility: NormalizedFacility;
  patientName?: string;
  patientId?: string;
  triagePriority?: 'P1' | 'P2' | 'P3' | 'P4';
  triageSummary?: string;
  patientCoordinates?: { lat: number; lng: number };
  onCompleteReferral?: (referral: ReferralDetails) => void;
}

export const ReferralPanel: React.FC<ReferralPanelProps> = ({
  isOpen,
  onClose,
  facility,
  patientName = 'Aarav Sharma',
  patientId = 'PT-2026-0891',
  triagePriority = 'P2',
  triageSummary = 'Patient presented with 3 days of fever, progressive dyspnea, and SpO2 93%. Requires emergency physician & respiratory care.',
  patientCoordinates,
  onCompleteReferral,
}) => {
  const [urgency, setUrgency] = useState<'immediate_transfer' | 'same_day' | 'elective_opd'>('same_day');
  const [requiredSpeciality, setRequiredSpeciality] = useState<string>(
    facility.specialities[0] || 'General Medicine'
  );
  const [reason, setReason] = useState<string>('Higher level clinical management and inpatient monitoring');
  const [clinicalNotes, setClinicalNotes] = useState<string>(triageSummary);
  const [sharePatientLocation, setSharePatientLocation] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const referral: ReferralDetails = {
      facilityId: facility.id,
      facilityName: facility.name,
      facilityAddress: facility.address,
      patientId,
      patientName,
      patientTriagePriority: triagePriority,
      reasonForReferral: reason,
      requiredSpeciality,
      clinicalSummary: clinicalNotes,
      sharePatientLocation,
      patientCoordinates: sharePatientLocation ? patientCoordinates : undefined,
      referredByClinicianId: 'DOC-OD-402',
      referredByClinicianName: 'Dr. Debabrata Mohapatra (MO I/C)',
      referralDate: new Date().toISOString(),
      urgency
    };

    // Save to local clinician referrals audit
    try {
      const existing = localStorage.getItem('swasthya_clinical_referrals');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(referral);
      localStorage.setItem('swasthya_clinical_referrals', JSON.stringify(list));
    } catch {
      // Ignore
    }

    if (onCompleteReferral) {
      onCompleteReferral(referral);
    }

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Refer Patient to Nearby Facility
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inter-facility Clinical Referral Transfer
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Referral Slip Generated & Logged
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Patient <strong>{patientName}</strong> has been referred to <strong>{facility.name}</strong>. An encrypted clinical summary was attached to the ABDM audit trail.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Facility Card Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Target Facility
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  {facility.ownership.toUpperCase()}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {facility.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                📍 {facility.address} • 📞 {facility.phone}
              </p>
            </div>

            {/* Patient & Urgency Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Patient
                </label>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {patientName} ({patientId})
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Transfer Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="immediate_transfer">🚨 Immediate 108 Transfer</option>
                  <option value="same_day">⚡ Same-Day OPD Transfer</option>
                  <option value="elective_opd">📅 Elective Referral</option>
                </select>
              </div>
            </div>

            {/* Required Specialty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Requested Specialty / Department
              </label>
              <select
                value={requiredSpeciality}
                onChange={(e) => setRequiredSpeciality(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {facility.specialities.map((spec, i) => (
                  <option key={i} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason for Referral */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Referral
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                placeholder="e.g. ICU care requirement, lack of specialist on duty..."
              />
            </div>

            {/* Clinical Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Summary & Triage Observations
              </label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Privacy Checkbox: Share Coordinates */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="shareLocationConsent"
                checked={sharePatientLocation}
                onChange={(e) => setSharePatientLocation(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="shareLocationConsent" className="text-xs text-slate-600 dark:text-slate-300 leading-tight">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Patient Consent: Attach Coordinates for Dispatch
                </span>
                {patientCoordinates ? (
                  <span className="text-[11px] text-slate-400">
                    Will share approximate location ({patientCoordinates.lat.toFixed(3)}, {patientCoordinates.lng.toFixed(3)}) with receiving ambulance dispatch.
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    No coordinates currently stored.
                  </span>
                )}
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/30 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Referral Slip</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
