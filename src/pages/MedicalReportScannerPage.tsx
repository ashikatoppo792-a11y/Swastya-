import React, { useState } from 'react';
import { parseAndExplainReport, medicalDictionary } from '../data/medicalTermsData';
import { ReportScanResult, MedicalTermExplanation } from '../types';
import { speakText, stopSpeaking, isSpeaking } from '../services/voiceAssistant';
import {
  FileText,
  Upload,
  ScanLine,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Camera
} from 'lucide-react';

interface ReportScannerProps {
  currentLanguage: string;
}

export const MedicalReportScannerPage: React.FC<ReportScannerProps> = ({ currentLanguage }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ReportScanResult | null>(null);
  const [activeSpeechTerm, setActiveSpeechTerm] = useState<string | null>(null);

  // Pre-loaded realistic demo reports
  const sampleReports = [
    {
      title: 'Dengue CBC Blood Report (Platelets 36,000)',
      text: 'CBC Report: Hemoglobin 14.2 g/dL. Total Leukocyte Count (TLC): 11,800 /cumm. Platelet Count: 36,000 /cumm. Hematocrit: 46%. Dengue NS1: POSITIVE.',
      fileName: 'diagnostic_lab_cbc_dengue.pdf'
    },
    {
      title: 'Diabetes & Kidney Profile (HbA1c 8.6%)',
      text: 'Biochemistry: Fasting Blood Glucose: 194 mg/dL. HbA1c: 8.6%. Serum Creatinine: 1.4 mg/dL. Blood Urea: 44 mg/dL.',
      fileName: 'diabetic_glycemic_profile.jpg'
    },
    {
      title: 'Pregnancy Urine Dipstick (Albumin 3+)',
      text: 'Antenatal Urine Analysis: Urine Albumin: +++ (3+ Proteinuria). Sugar: Nil. Pus cells: 3-4 /HPF. RBC: Nil.',
      fileName: 'antenatal_urine_dipstick.pdf'
    },
    {
      title: 'Doctor Prescription (OD, BD, TDS, SOS)',
      text: 'Rx: Tab Paracetamol 650mg TDS x 3 days. Tab Pantoprazole 40mg OD before breakfast. Tab Amoxicillin 500mg BD x 5 days. Syp Antacid 10ml SOS.',
      fileName: 'doctor_prescription_slip.png'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setScanning(true);

    // Simulate OCR scanning
    setTimeout(() => {
      const simulatedText = `Scanned Medical Document: ${file.name}. Platelet count: 140,000 /cumm. Hemoglobin: 12.1 g/dL. Total Leukocyte Count: 8,900 /cumm. Rx: Tab OD after food.`;
      const result = parseAndExplainReport(simulatedText, file.name);
      setScanResult(result);
      setScanning(false);
    }, 1500);
  };

  const handleLoadSample = (sample: typeof sampleReports[0]) => {
    setScanning(true);
    setTimeout(() => {
      const result = parseAndExplainReport(sample.text, sample.fileName);
      setScanResult(result);
      setScanning(false);
    }, 800);
  };

  const handleSpeak = (textToSpeak: string, termKey: string) => {
    if (activeSpeechTerm === termKey) {
      stopSpeaking();
      setActiveSpeechTerm(null);
    } else {
      speakText(textToSpeak, currentLanguage, () => {
        setActiveSpeechTerm(null);
      });
      setActiveSpeechTerm(termKey);
    }
  };

  // Plain language text per language
  const getLanguageExplanation = (term: MedicalTermExplanation) => {
    if (currentLanguage === 'hi') return term.hindiExplanation;
    if (currentLanguage === 'or') return term.odiaExplanation;
    return term.simpleExplanation;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Page Title & Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-700">
          <FileSearch className="w-4 h-4 text-teal-600" />
          <span>Patient-Friendly Medical Report Translator</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Understand Your Medical Reports in Plain Language
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Upload any lab report, prescription slip, or scan to receive clear, everyday explanations of complex medical terms in English, Hindi, and Odia — with voice read-aloud assistance.
        </p>
      </div>

      {/* Mandatory Non-Diagnostic Clinical Safety Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">INFORMATIONAL AID ONLY — NOT A CLINICAL DIAGNOSIS:</strong>
          <span className="ml-1 text-amber-800 dark:text-amber-300">
            This tool explains medical definitions to help you communicate more effectively with your doctor. It does not replace professional medical advice or clinical interpretation of your complete health history.
          </span>
        </div>
      </div>

      {/* Quick Sample Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Try Pre-Loaded Indian Clinical Reports:
          </span>
          <span className="text-[11px] text-slate-400">Click to test instantly</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {sampleReports.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:border-teal-400 text-left transition flex flex-col justify-between group"
            >
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                {sample.title}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">
                {sample.fileName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Document Upload Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <label className="border-2 border-dashed border-teal-300 dark:border-teal-800 hover:border-teal-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-teal-50/30 dark:bg-teal-950/20 hover:bg-teal-50/60 transition group">
          <Upload className="w-10 h-10 text-teal-600 dark:text-teal-400 mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-base font-bold text-slate-800 dark:text-slate-200">
            Upload Report (PDF / Image) or Snap Prescription Photo
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
            Works with CBC, Blood Sugar, Urine tests, ECG strips, Liver/Kidney profiles, and handwritten prescriptions.
          </span>
          <input
            type="file"
            accept=".pdf,image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Scanning Indicator */}
      {scanning && (
        <div className="bg-teal-50 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
          <ScanLine className="w-8 h-8 text-teal-600 animate-spin" />
          <div>
            <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200">
              Scanning Medical Document & Translating Jargon...
            </h3>
            <p className="text-xs text-teal-700 dark:text-teal-300 mt-0.5">
              Identifying clinical abbreviations, normal reference ranges, and simple everyday equivalents.
            </p>
          </div>
        </div>
      )}

      {/* Scan Results Display */}
      {scanResult && !scanning && (
        <div className="space-y-6">
          {/* Document Summary Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  SCANNED REPORT
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  {scanResult.fileName}
                </h3>
                <span className="text-xs text-slate-500">{scanResult.documentType}</span>
              </div>

              {/* Read Aloud Button for Entire Summary */}
              <button
                type="button"
                onClick={() => handleSpeak(
                  currentLanguage === 'hi' ? scanResult.summaryInPlainLanguage.hi :
                  currentLanguage === 'or' ? scanResult.summaryInPlainLanguage.or :
                  scanResult.summaryInPlainLanguage.en,
                  'summary'
                )}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  activeSpeechTerm === 'summary'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {activeSpeechTerm === 'summary' ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Reading</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Listen Aloud ({currentLanguage.toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              <strong>Overview in Simple Words:</strong>{' '}
              {currentLanguage === 'hi'
                ? scanResult.summaryInPlainLanguage.hi
                : currentLanguage === 'or'
                ? scanResult.summaryInPlainLanguage.or
                : scanResult.summaryInPlainLanguage.en}
            </div>
          </div>

          {/* Explained Terms List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Medical Terms Explained ({scanResult.explainedTerms.length})
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {scanResult.explainedTerms.map((term, idx) => {
                const speechKey = `term-${idx}`;
                const isSpeakingThis = activeSpeechTerm === speechKey;
                const explanationText = `${term.term}. ${getLanguageExplanation(term)}. What it means for you: ${term.whatItMeansForYou}`;

                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {term.term}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {term.category}
                          </span>
                        </div>
                        {term.normalRange && (
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Standard Healthy Range: <strong>{term.normalRange}</strong>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Urgency Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            term.urgencyLevel === 'Critical Attention'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                              : term.urgencyLevel === 'Needs Doctor Review'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          }`}
                        >
                          {term.urgencyLevel}
                        </span>

                        {/* Speech Button */}
                        <button
                          type="button"
                          onClick={() => handleSpeak(explanationText, speechKey)}
                          title="Listen to this explanation"
                          className={`p-1.5 rounded-lg border transition ${
                            isSpeakingThis
                              ? 'bg-rose-50 text-rose-600 border-rose-300'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-teal-600'
                          }`}
                        >
                          {isSpeakingThis ? <VolumeX className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Simple Definition */}
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Simple Plain-Language Meaning
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {getLanguageExplanation(term)}
                      </p>
                    </div>

                    {/* What It Means For You */}
                    <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-xs text-teal-950 dark:text-teal-200">
                      <strong>What this means for you:</strong> {term.whatItMeansForYou}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggested Questions for Your Doctor */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-3">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Suggested Questions to Ask Your Doctor at Your Next Visit
            </h4>
            <ul className="text-xs space-y-2 text-slate-300">
              {scanResult.suggestedQuestionsForDoctor.map((q, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
