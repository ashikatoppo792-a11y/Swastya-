import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { printTriageSlip } from '../services/exportPdf';
import {
  Clock,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Stethoscope,
  HeartPulse,
  PhoneCall,
  Sparkles,
  Building2
} from 'lucide-react';

interface PatientStatusProps {
  patient: Patient;
  onNewIntake: () => void;
  onViewNearbyCare?: (isEmergency?: boolean, specialty?: string) => void;
}

export const PatientStatusPage: React.FC<PatientStatusProps> = ({
  patient,
  onNewIntake,
  onViewNearbyCare,
}) => {
  // Estimated wait time calculation
  const getEstimatedWait = () => {
    const prio = patient.triageNote?.suggestedPriority;
    if (prio === 'Emergency') return '< 5 minutes (Immediate Priority)';
    if (prio === 'Urgent') return '15 - 25 minutes';
    if (prio === 'Semi-urgent') return '35 - 50 minutes';
    return '45 - 75 minutes';
  };

  const getPriorityTheme = () => {
    const prio = patient.triageNote?.suggestedPriority;
    if (prio === 'Emergency') return { bg: 'bg-rose-600', text: 'text-rose-600', light: 'bg-rose-50 text-rose-800' };
    if (prio === 'Urgent') return { bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50 text-orange-800' };
    if (prio === 'Semi-urgent') return { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50 text-amber-800' };
    return { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50 text-emerald-800' };
  };

  const theme = getPriorityTheme();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Token Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Intake Registered Successfully</span>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            YOUR QUEUE TOKEN
          </span>
          <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-mono tracking-tight my-2">
            {patient.tokenNumber}
          </div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span>{patient.name} • {patient.age} Y • {patient.sex}</span>
            {patient.bloodGroup && patient.bloodGroup !== 'Unknown' && (
              <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span>🩸 Blood Group:</span>
                <strong>{patient.bloodGroup}</strong>
              </span>
            )}
            <div className="text-xs text-slate-400 mt-1 font-normal">{patient.facilityName}</div>
          </div>
        </div>

        {/* Priority & Wait Time Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black text-white ${theme.bg}`}>
            Triage Level: {patient.triageNote?.suggestedPriority || 'Standard'}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            Estimated Wait: {getEstimatedWait()}
          </span>
        </div>
      </div>

      {/* What Happens Next - Step by Step */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          What Happens Next in Your Visit
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                1. AI Pre-Consultation Summary Generated
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Your reported symptoms, uploaded reports, and pain scores were structured into a clinical summary note.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 animate-pulse">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                2. Clinician Gatekeeper Review (In Progress)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                A triage nurse or duty doctor is validating your note to confirm urgency level and route you to the correct OPD room.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                3. Consultation Room Calling Token
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Keep watch on the waiting hall display. When token <strong>{patient.tokenNumber}</strong> is announced, proceed to the examination room.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recommended Care Nearby based on Triage Level */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recommended Care Nearby (निकटतम अनुशंसित स्वास्थ्य केंद्र)
              </h4>
              <p className="text-[11px] text-slate-500">
                Matched to: {patient.triageNote?.suggestedPriority || 'Routine'} ({patient.triageNote?.suggestedDepartment || 'General Medicine'})
              </p>
            </div>
          </div>
          {onViewNearbyCare && (
            <button
              type="button"
              onClick={() =>
                onViewNearbyCare(
                  patient.triageNote?.suggestedPriority === 'Emergency',
                  patient.triageNote?.suggestedDepartment
                )
              }
              className="text-xs font-bold text-sky-600 hover:text-sky-500 flex items-center gap-1 transition"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {patient.triageNote?.suggestedPriority === 'Emergency'
            ? '🚨 High acuity detected: We recommend an immediate 24x7 Emergency Trauma Centre with active ICU.'
            : patient.triageNote?.suggestedPriority === 'Urgent'
            ? '⚡ Moderate acuity: Sub-district or District Hospital OPD with specialist consultation recommended.'
            : '✓ Routine acuity: Can be safely evaluated at your nearest Primary Health Centre (PHC) or Community Clinic.'}
        </p>

        {onViewNearbyCare && (
          <button
            type="button"
            onClick={() =>
              onViewNearbyCare(
                patient.triageNote?.suggestedPriority === 'Emergency',
                patient.triageNote?.suggestedDepartment
              )
            }
            className="w-full py-2.5 px-4 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold text-xs border border-sky-200 dark:border-sky-800 transition flex items-center justify-center gap-2"
          >
            <span>Browse Nearby Facilities & Live Travel Times</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Patient Emergency Warning */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">FEELING SUDDENLY WORSE IN THE WAITING ROOM?</strong>
          <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
            If you experience crushing chest pain, severe breathlessness, fainting, or severe bleeding while waiting, notify the triage desk immediately or call 108.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => printTriageSlip(patient)}
          className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4 text-teal-600" />
          <span>Print Triage Slip</span>
        </button>

        <button
          onClick={onNewIntake}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
        >
          <span>Register Another Patient</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
