import React, { useState, useRef } from 'react';
import { commonSymptomsList, analyzeSymptoms, getLocalizedSymptomName } from '../data/symptomCheckerData';
import { getTranslation } from '../i18n/translations';
import { SymptomCheckResult } from '../types';
import { speakText, stopSpeaking } from '../services/voiceAssistant';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ArrowRight,
  ShieldAlert,
  Activity,
  PhoneCall,
  Calendar,
  MapPin,
  RefreshCw,
  User,
  Info,
  Check,
  Flame,
  Smile,
  Meh,
  Frown,
  Upload,
  FileCheck2
} from 'lucide-react';

interface AiSymptomCheckerProps {
  currentLanguage: string;
  onNavigateToHospitals?: (isEmergency?: boolean, specialty?: string) => void;
  onNavigateToAppointments?: (specialty?: string) => void;
  onNavigateToIntake?: () => void;
}

export const AiSymptomCheckerPage: React.FC<AiSymptomCheckerProps> = ({
  currentLanguage,
  onNavigateToHospitals,
  onNavigateToAppointments,
  onNavigateToIntake,
}) => {
  const t = getTranslation(currentLanguage);
  // Input State
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>(['fever', 'headache']);
  const [freeText, setFreeText] = useState('');
  const [severity, setSeverity] = useState<number>(6);
  const [duration, setDuration] = useState('2-3 days');
  const [age, setAge] = useState<number | ''>(38);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [existingConditions, setExistingConditions] = useState<string[]>([]);

  // Prescription Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [extractedOcrSummary, setExtractedOcrSummary] = useState<string | null>(null);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingResult, setIsSpeakingResult] = useState(false);

  // Analysis Result
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomCheckResult | null>(() => {
    return analyzeSymptoms({
      symptoms: ['fever', 'headache'],
      freeTextDescription: 'Feeling feverish with body ache and mild throat irritation for 2 days',
      duration: '2-3 days',
      severity: 6,
      age: 38,
      gender: 'Male',
      language: currentLanguage
    });
  });

  const toggleSymptom = (id: string) => {
    if (selectedSymptomIds.includes(id)) {
      setSelectedSymptomIds(selectedSymptomIds.filter((s) => s !== id));
    } else {
      setSelectedSymptomIds([...selectedSymptomIds, id]);
    }
  };

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type symptoms.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (currentLanguage === 'hi') recognition.lang = 'hi-IN';
      else if (currentLanguage === 'or') recognition.lang = 'or-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFreeText((prev) => (prev ? `${prev}. ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsOcrProcessing(true);

    // Simulate clinical OCR & NLP Symptom Extraction
    setTimeout(() => {
      setIsOcrProcessing(false);
      const parsedSymptoms = ['fever', 'cough', 'headache', 'throat_pain'];
      setSelectedSymptomIds((prev) => Array.from(new Set([...prev, ...parsedSymptoms])));
      const extractedNote = `Rx extracted from ${file.name}: Tab Paracetamol 650mg TDS, Tab Azithromycin 500mg OD. Patient reports 3 days of persistent fever, cough with phlegm, and throat irritation.`;
      setFreeText(extractedNote);
      setExtractedOcrSummary('Extracted: Fever, Cough, Throat Pain, Headache (Tab Paracetamol 650mg)');
      
      // Auto run analysis
      const res = analyzeSymptoms({
        symptoms: ['fever', 'cough', 'headache', 'throat_pain'],
        freeTextDescription: extractedNote,
        duration: '2-3 days',
        severity: 7,
        age: 38,
        gender: 'Male',
        language: currentLanguage
      });
      setResult(res);

      // Smooth scroll to form / results
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 900);
  };

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const res = analyzeSymptoms({
        symptoms: selectedSymptomIds,
        freeTextDescription: freeText,
        duration,
        severity,
        age: age ? Number(age) : undefined,
        gender,
        existingConditions,
        language: currentLanguage
      });
      setResult(res);
      setAnalyzing(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 600);
  };

  const toggleVoiceGuidance = () => {
    if (isSpeakingResult) {
      stopSpeaking();
      setIsSpeakingResult(false);
    } else if (result) {
      const textToSpeak =
        currentLanguage === 'hi'
          ? result.executiveSummary.hi
          : currentLanguage === 'or'
          ? result.executiveSummary.or
          : result.executiveSummary.en;

      setIsSpeakingResult(true);
      speakText(textToSpeak, currentLanguage, () => setIsSpeakingResult(false));
    }
  };

  const getLocalizedSummary = () => {
    if (!result) return '';
    if (currentLanguage === 'hi') return result.executiveSummary.hi;
    if (currentLanguage === 'or') return result.executiveSummary.or;
    return result.executiveSummary.en;
  };

  const getSeverityIcon = (sev: number) => {
    if (sev <= 3) return <Smile className="w-5 h-5 text-emerald-500" />;
    if (sev <= 6) return <Meh className="w-5 h-5 text-amber-500" />;
    if (sev <= 8) return <Frown className="w-5 h-5 text-orange-500" />;
    return <Flame className="w-5 h-5 text-rose-500 animate-bounce" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Professional Clinical Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Triage Decision Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Symptom Checker
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Select or describe your symptoms for real-time acuity triage, emergency red-flag screening, and recommended care routing.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Prescription / Lab Report Upload Trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePrescriptionUpload}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isOcrProcessing}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-sky-500 text-xs font-semibold text-slate-700 hover:text-sky-600 transition flex items-center gap-2 cursor-pointer shadow-sm"
            title="Upload a prescription or lab report to extract symptoms"
          >
            {isOcrProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                <span>Scanning OCR...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>Upload Rx / Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {uploadedFileName && extractedOcrSummary && (
        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>{uploadedFileName}:</strong> {extractedOcrSummary}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setUploadedFileName(null);
              setExtractedOcrSummary(null);
            }}
            className="text-slate-400 hover:text-slate-700 ml-2 text-base font-bold"
          >
            ×
          </button>
        </div>
      )}
      {/* =================================================================== */}
      {/* DETAILED INTERACTIVE SYMPTOM CHECKER & LIVE ASSESSMENT RESULTS */}
      {/* =================================================================== */}
      <div ref={formSectionRef} className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-sky-50 via-white to-blue-50 border border-sky-100 rounded-2xl p-5 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Decision-Support System</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Clinical Symptom Analysis & Triage Prioritization
            </h3>
            <p className="text-xs text-slate-600">
              Assesses clinical acuity for India-wide primary health centers, OPDs, and emergency care.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              Decision-support only
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <PhoneCall className="w-4 h-4" />
              Helpline 108
            </span>
          </div>
        </div>

        {/* Main Grid: Form Left, Results Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Symptom Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>{t.selectSymptoms}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    {selectedSymptomIds.length} Selected
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tap common symptoms or use the voice assistant.
                </p>
              </div>

              {/* Symptom Chips */}
              <div className="flex flex-wrap gap-2">
                {commonSymptomsList.map((sym) => {
                  const isSelected = selectedSymptomIds.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => toggleSymptom(sym.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? sym.isRedFlagWarning
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                          : sym.isRedFlagWarning
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{getLocalizedSymptomName(sym, currentLanguage)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Free-text Description with Voice Input Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.chiefComplaint}
                  </label>
                  <button
                    type="button"
                    onClick={handleSpeechInput}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="e.g. Fever started 2 days ago with severe headache and throat irritation..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 focus:bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                />
              </div>

              {/* Severity Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    {getSeverityIcon(severity)}
                    Discomfort / Severity: <strong>{severity} / 10</strong>
                  </span>
                  <span className="text-slate-500">
                    {severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : severity <= 8 ? 'Severe' : 'Very Critical'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Duration & Demographics */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Duration (कब से है?)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  >
                    <option value="Few hours">Few hours (आज ही)</option>
                    <option value="2-3 days">2 - 3 days (दो-तीन दिन)</option>
                    <option value="1 week">About 1 week (एक हफ्ता)</option>
                    <option value=">2 weeks">Over 2 weeks (&gt;2 सप्ताह)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Age (आयु)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                    placeholder="e.g. 38"
                  />
                </div>
              </div>

              {/* Check Button */}
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Medical Guidance...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Symptoms (लक्षणों का विश्लेषण करें)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Guidance & Results */}
          <div ref={resultsRef} className="lg:col-span-7 space-y-6">
            {result && (
              <div className="space-y-6 animate-slide-up">
                {/* 3b. Red Flag / Emergency Auto-Alert Banner */}
                {result.urgencyColor === 'rose' && (
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xl space-y-3 border border-red-500 animate-pulse">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Flame className="w-6 h-6 text-amber-300 shrink-0" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-red-100">
                            Immediate Emergency Care Required
                          </div>
                          <h4 className="text-base font-black">
                            Acuity indicates urgent or emergency clinical evaluation.
                          </h4>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-red-100 leading-relaxed">
                      If this is an emergency, call 108 immediately. Do not wait for the app.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href="tel:108"
                        className="py-2 px-4 rounded-xl bg-white text-red-700 font-black text-xs no-underline shadow-md hover:bg-red-50 transition flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-4 h-4 text-red-600" />
                        <span>Call 108 Ambulance</span>
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          onNavigateToHospitals &&
                          onNavigateToHospitals(true, result?.recommendedSpecialty)
                        }
                        className="py-2 px-4 rounded-xl bg-red-950/80 hover:bg-red-900 text-white font-bold text-xs border border-red-400 transition flex items-center gap-1.5"
                      >
                        <MapPin className="w-4 h-4 text-amber-300" />
                        <span>Open 24x7 Emergency Centres Nearby</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Acuity Level Card */}
                <div
                  className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                    result.urgencyColor === 'rose'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : result.urgencyColor === 'orange'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : result.urgencyColor === 'amber'
                      ? 'bg-yellow-50 border-yellow-300 text-yellow-950'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full animate-ping bg-current opacity-75" />
                      <div>
                        <div className="text-xs uppercase font-extrabold tracking-wider opacity-75">
                          Triage Assessment Level
                        </div>
                        <h3 className="text-lg sm:text-xl font-black">{result.primaryTriageLevel}</h3>
                      </div>
                    </div>

                    {/* Audio Voice Guidance Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceGuidance}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                        isSpeakingResult
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSpeakingResult ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
                      <span>{isSpeakingResult ? 'Stop Audio' : 'Listen Guidance (बोलकर सुनें)'}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed font-medium bg-white/90 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-sm">
                    {getLocalizedSummary()}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
                    <span>Recommended OPD Clinic:</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white text-slate-900 border border-slate-300 shadow-sm font-extrabold">
                      {result.recommendedSpecialty}
                    </span>
                  </div>
                </div>

                {/* Potential Conditions */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-600" />
                    <span>Potential Conditions to Discuss with Doctor</span>
                  </h4>

                  <div className="space-y-3">
                    {result.possibleConditions.map((cond, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {cond.condition}
                            {cond.conditionHi && (
                              <span className="ml-1.5 text-xs text-slate-500 font-normal">
                                ({cond.conditionHi})
                              </span>
                            )}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cond.likelihood === 'High Probability'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {cond.likelihood}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {cond.description}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">Typical signs:</span>
                          {cond.typicalSymptoms.join(' • ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Next Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Immediate & Home Care */}
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Recommended Immediate Steps</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-800 list-disc pl-4">
                      {result.recommendedNextSteps.immediateActions.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Flag Warning Signs */}
                  <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Red Flags (खतरे के संकेत - Go to Hospital)</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-800 list-disc pl-4">
                      {result.recommendedNextSteps.redFlagSigns.map((rf, i) => (
                        <li key={i}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Cross-Link Action Hub */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 text-slate-900 space-y-4 shadow-sm">
                  <div>
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>Next Steps for Care</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Connect directly to healthcare facilities or book appointments based on your symptoms.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => onNavigateToAppointments && onNavigateToAppointments(result?.recommendedSpecialty)}
                      className="p-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition text-left space-y-1 flex flex-col justify-between cursor-pointer shadow-md shadow-sky-600/20"
                    >
                      <div className="flex items-center justify-between">
                        <Calendar className="w-4 h-4" />
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold">Book Doctor Appointment</div>
                        <div className="text-[10px] text-sky-100 font-normal">OPD or Teleconsult</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onNavigateToHospitals &&
                        onNavigateToHospitals(
                          result?.urgencyColor === 'rose',
                          result?.recommendedSpecialty
                        )
                      }
                      className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition text-left space-y-1 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <MapPin className="w-4 h-4 text-teal-600" />
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold">Find Nearby Hospitals</div>
                        <div className="text-[10px] text-slate-500 font-normal">PHCs, CHCs & Bed Status</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={onNavigateToIntake}
                      className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition text-left space-y-1 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <User className="w-4 h-4 text-sky-600" />
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold">Clinical Triage Intake</div>
                        <div className="text-[10px] text-slate-500 font-normal">Generate OPD Token & Slip</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Mandatory Legal & Clinical Disclaimer */}
                <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-100 text-[11px] text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    {result.disclaimer} Always verify symptoms with an attending medical professional.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
