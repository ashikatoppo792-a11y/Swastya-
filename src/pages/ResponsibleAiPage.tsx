import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  Scale,
  Lock,
  Globe,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Eye,
  Server
} from 'lucide-react';

export const ResponsibleAiPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Title & Badge */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-700">
          <ShieldAlert className="w-4 h-4 text-teal-600" />
          <span>Responsible AI & Regulatory Safety Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          System Architecture & Responsible AI Principles
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          How TriageAssist enforces strict human-in-the-loop clinical boundaries, deterministic red-flag overrides, and data protection across public health infrastructure.
        </p>
      </div>

      {/* Human-in-the-Loop Architecture Visual Flow */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Human-in-the-Loop Architecture Flow
          </h2>
          <span className="text-xs text-slate-400">CDSS Class B (Non-Autonomous)</span>
        </div>

        {/* 4 Step Visual Block Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
            <span className="px-2 py-0.5 rounded bg-teal-900 text-teal-300 font-mono text-[10px] font-bold">
              LAYER 1: INGESTION
            </span>
            <h4 className="font-bold text-white text-sm">Multimodal Inputs</h4>
            <p className="text-slate-400 leading-relaxed">
              • Vernacular voice STT (11 Indian languages)<br />
              • Anatomical SVG selector<br />
              • Lab reports & ECG strips (OCR)<br />
              • Basic skin/wound photos
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
            <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-300 font-mono text-[10px] font-bold">
              LAYER 2: SAFETY GATE
            </span>
            <h4 className="font-bold text-white text-sm">Deterministic Red-Flags</h4>
            <p className="text-slate-400 leading-relaxed">
              • STEMI / Chest pain rules<br />
              • Severe preeclampsia markers<br />
              • Pediatric dengue shock criteria<br />
              • Overrides priority to Level 1
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/90 border border-teal-500/80 bg-teal-950/40 space-y-2 ring-2 ring-teal-500/20">
            <span className="px-2 py-0.5 rounded bg-teal-500 text-slate-950 font-mono text-[10px] font-bold">
              LAYER 3: GATEKEEPER
            </span>
            <h4 className="font-bold text-white text-sm">Qualified Clinician Review</h4>
            <p className="text-slate-300 leading-relaxed">
              • Doctor/Nurse reviews side-by-side<br />
              • Inline rich note editing<br />
              • Priority override requires justification<br />
              • Permanent audit logging
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
            <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-300 font-mono text-[10px] font-bold">
              LAYER 4: DISPOSITION
            </span>
            <h4 className="font-bold text-white text-sm">Care Routing & E-Referral</h4>
            <p className="text-slate-400 leading-relaxed">
              • Queue token generation<br />
              • Adaptive facility referral<br />
              • eSanjeevani teleconsultation ID<br />
              • ABDM Slip & FHIR R4 export
            </p>
          </div>
        </div>
      </div>

      {/* Core Safety Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            No Autonomous Diagnosis
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            The engine is explicitly forbidden from outputting diagnostic statements (e.g. "Patient has STEMI") or recommending drug dosages. It restricts itself to descriptive summarization and triage priority bands.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Source Explainability
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Every clinical priority level generated is backed by source attribution linking directly to patient voice quotes, vital sign abnormalities, or verified lab parameters.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            DPDP Act 2023 Compliance
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Built from the ground up for India's Digital Personal Data Protection Act 2023. Explicit purpose-bound consent, one-click PII redaction toggles, and on-device offline storage safeguards.
          </p>
        </div>
      </div>

      {/* Code Blueprint: Pluggable Claude API / LLM Service */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-teal-400 flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Pluggable LLM Adapter Architecture (Claude 3.5 Sonnet / Vision API)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clean separation of model adapter in <code>server/services/aiTriageService.js</code>
            </p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            Node.js / Express
          </span>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
{`// server/services/aiTriageService.js
// Pluggable Anthropic Claude 3.5 Sonnet / Vision API Interface

export async function callClaudeTriageAPI(patient, facility, redFlags) {
  // TODO: Connect Anthropic Claude API / Vision API here
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  const systemPrompt = \`You are an AI Clinical Triage Assistant for Indian Government Facilities.
STRICT CONSTRAINT: You DO NOT diagnose disease or prescribe medications.
You only summarize patient symptoms, OCR reports, and photos into a structured triage note
and suggest an acuity level (Emergency, Urgent, Semi-urgent, Routine).
Every note will be reviewed by a human doctor.\`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: JSON.stringify({ patient, facility, redFlags }) }
      ]
    }]
  });
  
  return JSON.parse(response.content[0].text);
}`}
        </pre>
      </div>

      {/* Bias Mitigation Across Indian Socio-Economic Demographics */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-600" />
          Bias & Fairness Considerations Across Indian Contexts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-bold">
              1. Linguistic Parity:
            </strong>
            <span>
              Triage models trained on English medical corpora often under-triage colloquial expressions (e.g. "kaleje mein jalan" or "chhati ma bhar"). TriageAssist embeds localized Indian symptom idioms across 11 languages to prevent dialectal under-triaging.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-bold">
              2. Skin Tone Fairness in Visual Models:
            </strong>
            <span>
              Dermatological and wound analysis models calibrated primarily on Fitzpatrick I-II skin types fail to detect erythema in darker South Asian skin tones (Fitzpatrick IV-VI). Visual observations are flagged as strictly non-diagnostic screenings with low confidence weights.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-bold">
              3. Gender-Specific Maternal Safety:
            </strong>
            <span>
              In rural health units, young primigravida women often minimize headache or visual scotoma symptoms. The engine specifically elevates pregnancy danger signs into deterministic red-flag overrides.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-bold">
              4. Low-Bandwidth Infrastructure Equity:
            </strong>
            <span>
              High-latency rural 2G/3G connectivity is accommodated via on-device IndexedDB caching, compressed photo payloads, and asynchronous synchronization upon network restoration.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
