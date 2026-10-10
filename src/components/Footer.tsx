import React from 'react';
import { ShieldCheck, PhoneCall, AlertTriangle, Scale, HeartPulse } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* High-Visibility Clinical Safety Strip */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-amber-950/80 border-b border-teal-800/40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-center md:text-left">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>CLINICAL SAFETY MANDATE:</strong> Decision-support tool only. The AI NEVER diagnoses or prescribes. Every structured note requires qualified clinician review.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 shrink-0">
            <span className="flex items-center gap-1.5 text-rose-300">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              National Emergency Ambulance: <strong className="text-white">108</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Compliance Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-white">
                Triage<span className="text-teal-400">Assist</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Human-in-the-loop multimodal triage assistant built for Indian government hospitals, primary health centers (PHCs), community health centers (CHCs), industrial units, and campus clinics.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>DPDP Act 2023 Aligned • ABDM Ready</span>
            </div>
          </div>

          {/* Supported Health Units */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Facility Profiles
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>Primary Health Centres (PHC)</li>
              <li>Community Health Centres (CHC)</li>
              <li>District & Sub-District Hospitals</li>
              <li>Public Health Outreach Camps</li>
              <li>Industrial Estate & GIDC Clinics</li>
              <li>University Campus Health Units</li>
            </ul>
          </div>

          {/* Clinical Architecture */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Safety Guardrails
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>Deterministic Red-Flag Safety Override</li>
              <li>Explainability & Source Claim Attribution</li>
              <li>Mandatory Clinician Justification for Overrides</li>
              <li>Full Cryptographic-ready Audit Trails</li>
              <li>Low-Bandwidth & Offline First (2G/Edge)</li>
            </ul>
          </div>

          {/* Legal and Privacy */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Standards & Ethics
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Complies with Digital Personal Data Protection (DPDP) Act 2023 requirements for explicit consent, on-device redaction, and patient data rights.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              <span className="font-semibold text-teal-300">SaMD Classification:</span> Class B Clinical Decision Support Software (Non-autonomous).
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © 2026 SwasthyaSetu TriageAssist. Open-source decision-support platform for India Public Health.
          </div>
          <div className="text-slate-400">
            Powered by Multimodal AI & Clinical Knowledge Graphs
          </div>
        </div>
      </div>
    </footer>
  );
};
