import React, { useState } from 'react';
import { languages, getTranslation } from '../i18n/translations';
import { Patient, ReportItem, PhotoItem, Vitals } from '../types';
import { InteractiveBodyMap } from '../components/InteractiveBodyMap';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { ReportUploader } from '../components/ReportUploader';
import { submitPatientIntake, translateSymptomText } from '../services/api';
import { speakText, stopSpeaking } from '../services/voiceAssistant';
import {
  User,
  HeartPulse,
  Activity,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  Clock,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Flame,
  Volume2,
  VolumeX,
  Lock
} from 'lucide-react';

interface PatientIntakePageProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onSubmitSuccess: (patient: Patient) => void;
}

export const PatientIntakePage: React.FC<PatientIntakePageProps> = ({
  currentLanguage,
  onLanguageChange,
  onSubmitSuccess,
}) => {
  const t = getTranslation(currentLanguage);

  // Wizard Steps: 1: Info & Consent, 2: Symptoms & Body Area, 3: Vitals & Medical History, 4: Reports & Photos, 5: Review & Submit
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<string>('Unknown');
  const [phone, setPhone] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);

  // Symptoms
  const [selectedBodyArea, setSelectedBodyArea] = useState('chest');
  const [duration, setDuration] = useState('Today (few hours)');
  const [severity, setSeverity] = useState(6);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Medical History & Vitals
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyTrimester, setPregnancyTrimester] = useState('2nd Trimester');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [currentMedicines, setCurrentMedicines] = useState('');
  const [allergies, setAllergies] = useState('');

  // Vitals
  const [systolic, setSystolic] = useState<number | ''>('');
  const [diastolic, setDiastolic] = useState<number | ''>('');
  const [pulse, setPulse] = useState<number | ''>('');
  const [spo2, setSpo2] = useState<number | ''>('');
  const [temp, setTemp] = useState<number | ''>('');

  // Reports & Photos
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // Submission loading state
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSpeakingConsent, setIsSpeakingConsent] = useState(false);

  const commonConditions = [
    'Diabetes (Type 2)',
    'Hypertension / High BP',
    'Asthma / COPD',
    'Heart Disease / Past Angina',
    'Chronic Kidney Disease',
    'Tuberculosis history',
  ];

  const handleConditionToggle = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter(c => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const handleNextStep = () => {
    setValidationError('');
    if (currentStep === 1) {
      if (!name.trim()) {
        setValidationError('Please enter patient name.');
        return;
      }
      if (!age || Number(age) <= 0) {
        setValidationError('Please enter a valid age.');
        return;
      }
      if (!consentGiven) {
        setValidationError('DPDP Act consent is required to proceed.');
        return;
      }
    } else if (currentStep === 2) {
      const complaintText = chiefComplaint || voiceTranscript;
      if (!complaintText.trim()) {
        setValidationError('Please speak or type the primary symptoms.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setValidationError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setValidationError('');

    const vitalsObj: Vitals = {};
    if (systolic) vitalsObj.bloodPressureSystolic = Number(systolic);
    if (diastolic) vitalsObj.bloodPressureDiastolic = Number(diastolic);
    if (pulse) vitalsObj.pulseRate = Number(pulse);
    if (spo2) vitalsObj.spo2 = Number(spo2);
    if (temp) vitalsObj.temperatureF = Number(temp);

    const primaryText = chiefComplaint || voiceTranscript || 'Patient reported symptoms';

    // Auto-translate to English for clinician review note if in another language
    let translatedEn = primaryText;
    if (currentLanguage !== 'en') {
      try {
        translatedEn = await translateSymptomText(primaryText, currentLanguage);
      } catch {}
    }

    const payload: Partial<Patient> = {
      name: name.trim(),
      age: Number(age),
      sex,
      bloodGroup: bloodGroup || 'Unknown',
      phone: phone.trim(),
      aadhaarLast4: aadhaarLast4.trim(),
      primaryLanguage: currentLanguage,
      bodyArea: selectedBodyArea,
      duration,
      severity,
      pregnant: isPregnant,
      pregnancyTrimester: isPregnant ? pregnancyTrimester : undefined,
      chronicConditions: selectedConditions,
      currentMedicines: currentMedicines ? currentMedicines.split(',').map(s => s.trim()) : [],
      allergies: allergies ? allergies.split(',').map(s => s.trim()) : [],
      chiefComplaint: primaryText,
      voiceTranscript: voiceTranscript || primaryText,
      voiceTranscriptEn: translatedEn,
      vitals: vitalsObj,
      reports,
      photos,
      actorName: 'Patient Self-Intake Kiosk',
      actorRole: 'Patient'
    };

    try {
      const savedPatient = await submitPatientIntake(payload);
      setSubmitting(false);
      onSubmitSuccess(savedPatient);
    } catch (err: any) {
      setSubmitting(false);
      setValidationError(err.message || 'Failed to submit intake. Please try again.');
    }
  };

  // Severity face helper
  const getSeverityFace = (val: number) => {
    if (val <= 3) return <Smile className="w-6 h-6 text-emerald-500" />;
    if (val <= 6) return <Meh className="w-6 h-6 text-amber-500" />;
    if (val <= 8) return <Frown className="w-6 h-6 text-orange-500" />;
    return <Flame className="w-6 h-6 text-rose-600 animate-bounce" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Wizard Progress Indicator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
          <span>STEP {currentStep} OF 5</span>
          <span className="text-teal-600 dark:text-teal-400">
            {currentStep === 1 && 'Patient Info & Consent'}
            {currentStep === 2 && 'Symptoms & Body Area'}
            {currentStep === 3 && 'Vitals & Medical History'}
            {currentStep === 4 && 'Reports & Photos'}
            {currentStep === 5 && 'Review & Final Submit'}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {validationError && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl p-3 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-200 font-bold animate-shake">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: Identification & DPDP Act 2023 Consent */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
          {/* Accessible 1-Click Language Switcher for Rural & Older Users */}
          <div className="bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-teal-950 dark:text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>{t.selectLanguage}</span>
              </div>
              <p className="text-[11px] text-teal-700 dark:text-teal-400">
                Large accessible buttons for easy reading and voice guidance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  currentLanguage === 'en'
                    ? 'bg-teal-600 text-white ring-2 ring-teal-400'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-100'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  currentLanguage === 'hi'
                    ? 'bg-teal-600 text-white ring-2 ring-teal-400'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-100'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('or')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  currentLanguage === 'or'
                    ? 'bg-teal-600 text-white ring-2 ring-teal-400'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-100'
                }`}
              >
                ଓଡ଼ିଆ (Odia)
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              {t.step1}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Please enter basic patient details. All data is handled in strict compliance with the Digital Personal Data Protection (DPDP) Act 2023.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {t.patientName} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {t.age} *
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 54"
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {t.sex} *
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as any)}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Male">{t.male}</option>
                  <option value="Female">{t.female}</option>
                  <option value="Other">{t.other}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>{t.bloodGroup}</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">ABO/Rh</span>
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Unknown">{t.unknownBloodGroup}</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {t.phone} ({t.optional})
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {t.abhaId}
              </label>
              <input
                type="text"
                maxLength={14}
                value={aadhaarLast4}
                onChange={(e) => setAadhaarLast4(e.target.value)}
                placeholder="e.g. 8842 or 91-XXXX-XXXX"
                className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Security & Encryption Indicator */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Lock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>
              <strong>Encrypted Connection (TLS 1.3 / AES-256):</strong> Patient data is protected under DPDP Act 2023. Identifiers remain restricted and accessible only to qualified attending healthcare staff.
            </span>
          </div>

          {/* DPDP Act 2023 Consent Section with Audio Voice Assistance */}
          <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>{t.consentTitle}</span>
              </div>

              {/* Voice Assistance Read-Aloud for Rural/Older Users */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeakingConsent) {
                    stopSpeaking();
                    setIsSpeakingConsent(false);
                  } else {
                    setIsSpeakingConsent(true);
                    speakText(t.consentText, currentLanguage, () => setIsSpeakingConsent(false));
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-sm ${
                  isSpeakingConsent
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 hover:bg-teal-100'
                }`}
                title="Voice read-aloud"
              >
                {isSpeakingConsent ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-600" />}
                <span>{isSpeakingConsent ? t.stopAudio : t.listenAudio}</span>
              </button>
            </div>

            <p className="text-xs text-teal-800 dark:text-teal-300 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-lg border border-teal-100 dark:border-teal-900">
              {t.consentText}
            </p>

            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t.consentCheckbox}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* STEP 2: Symptoms, Voice Input & Body Map */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          {/* Interactive Body Map */}
          <InteractiveBodyMap
            selectedArea={selectedBodyArea}
            onSelectArea={(area) => setSelectedBodyArea(area)}
          />

          {/* Voice & Text Symptom Recorder */}
          <VoiceInputButton
            language={currentLanguage}
            transcript={chiefComplaint || voiceTranscript}
            onTranscriptChange={(val) => {
              setChiefComplaint(val);
              setVoiceTranscript(val);
            }}
          />

          {/* Severity & Duration Sliders */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t.severity}
                </label>
                <div className="flex items-center gap-2">
                  {getSeverityFace(severity)}
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {severity} / 10
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>1 (Mild / Refill)</span>
                <span>5 (Moderate)</span>
                <span>8 (Severe)</span>
                <span className="text-rose-600">10 (Unbearable)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t.duration}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['< 1 Hour (Sudden)', 'Today (Few Hours)', '1 to 3 Days', '1 to 4 Weeks', 'Chronic (> 1 Month)'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                      duration === dur
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Vitals & Medical History */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              {t.vitals}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter triage desk vital measurements if already taken. In emergency cases, vitals trigger rule-based priority overrides.
            </p>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                BP Systolic
              </label>
              <input
                type="number"
                placeholder="120"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-base font-bold bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white mt-1"
              />
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                BP Diastolic
              </label>
              <input
                type="number"
                placeholder="80"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-base font-bold bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white mt-1"
              />
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Pulse Rate
              </label>
              <input
                type="number"
                placeholder="78"
                value={pulse}
                onChange={(e) => setPulse(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-base font-bold bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white mt-1"
              />
              <span className="text-[10px] text-slate-400">bpm</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                SpO2 Saturation
              </label>
              <input
                type="number"
                placeholder="98"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-base font-bold bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white mt-1"
              />
              <span className="text-[10px] text-slate-400">% oxygen</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Temperature
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="98.6"
                value={temp}
                onChange={(e) => setTemp(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-base font-bold bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white mt-1"
              />
              <span className="text-[10px] text-slate-400">°Fahrenheit</span>
            </div>
          </div>

          {/* Pregnancy Checkbox (if Female) */}
          {sex === 'Female' && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-950 dark:text-purple-200">
                    Is the patient currently pregnant?
                  </span>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300">
                    Pregnancy triggers specialized maternal red-flag screening (preeclampsia, antepartum bleeding).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPregnant}
                  onChange={(e) => setIsPregnant(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </div>

              {isPregnant && (
                <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
                  <label className="block text-xs font-bold text-purple-900 dark:text-purple-200 mb-1">
                    Gestational Stage / Trimester
                  </label>
                  <select
                    value={pregnancyTrimester}
                    onChange={(e) => setPregnancyTrimester(e.target.value)}
                    className="p-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-purple-300 text-purple-950 dark:text-purple-200"
                  >
                    <option value="1st Trimester (0-12 Weeks)">1st Trimester (0-12 Weeks)</option>
                    <option value="2nd Trimester (13-27 Weeks)">2nd Trimester (13-27 Weeks)</option>
                    <option value="3rd Trimester (28-40 Weeks)">3rd Trimester (28-40 Weeks)</option>
                    <option value="Post-partum (< 6 Weeks)">Post-partum (&lt; 6 Weeks)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Chronic Conditions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Existing Chronic Medical Conditions
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {commonConditions.map((cond) => {
                const isSelected = selectedConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleConditionToggle(cond)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {cond}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Medicines & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Current Regular Medicines
              </label>
              <input
                type="text"
                value={currentMedicines}
                onChange={(e) => setCurrentMedicines(e.target.value)}
                placeholder="e.g. Metformin 500mg, Telmisartan 40mg"
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Drug Allergies
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Sulfa drugs, None"
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Diagnostic Reports & Photos */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          <ReportUploader
            reports={reports}
            photos={photos}
            onReportsChange={setReports}
            onPhotosChange={setPhotos}
          />
        </div>
      )}

      {/* STEP 5: Review & Final Submission */}
      {currentStep === 5 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              {t.reviewSummary}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Confirm your reported details before submitting to the clinical triage queue.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div>
                <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">Patient</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{name}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">Age / Sex</span>
                <div className="font-bold text-slate-900 dark:text-white">{age} Y / {sex}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">Blood Group</span>
                <div className="font-bold text-rose-600 dark:text-rose-400">{bloodGroup || 'Unknown'}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">Target Zone</span>
                <div className="font-bold text-teal-600 dark:text-teal-400 uppercase">{selectedBodyArea}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">Severity</span>
                <div className="font-bold text-amber-600">{severity} / 10</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">Chief Symptoms</span>
              <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                "{chiefComplaint || voiceTranscript}"
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Uploaded Reports:</span>
                <span className="ml-1 font-bold text-slate-800 dark:text-slate-200">{reports.length} files</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Photos:</span>
                <span className="ml-1 font-bold text-slate-800 dark:text-slate-200">{photos.length} photos</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Pregnancy:</span>
                <span className="ml-1 font-bold text-slate-800 dark:text-slate-200">{isPregnant ? pregnancyTrimester : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Upon submission, TriageAssist will synthesize a draft triage note and assign a queue token. A healthcare professional will examine and validate this note.
            </span>
          </div>
        </div>
      )}

      {/* Navigation Wizard Bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.previousStep}</span>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <span>{t.nextStep}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-black shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.generateAiNote || 'Submitting...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.submitIntake}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
