import React from 'react';
import { UserRole } from '../types';
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  Users,
  Building2,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Globe,
  WifiOff,
  Cpu,
  Sparkles,
  HeartPulse,
  Clock,
  PhoneCall,
  CheckCircle2,
  FileText,
  Bell,
  Volume2,
  Lock,
  MapPin,
  Calendar,
  Droplet
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string, role?: UserRole) => void;
  onSelectLanguage: (lang: string) => void;
  currentLanguage: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectLanguage,
  currentLanguage,
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-16 lg:pb-20 bg-gradient-to-b from-teal-500/10 via-slate-50 to-white dark:from-teal-950/30 dark:via-slate-900 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* National Facility Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-700 shadow-sm animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span>National Health Facilities Triage Network • DPDP Act 2023 Aligned</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Multimodal Triage Assistant for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400">
                Indian Health Facilities
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Empowering Primary Health Centres (PHCs), CHCs, public health camps, and industrial clinics to summarize patient voice symptoms in 11 Indian languages, lab reports, and wound photos into a structured triage note for qualified clinician sign-off.
            </p>

            {/* Core Principle Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 text-left flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>STRICT CLINICAL GOVERNANCE:</strong> The AI <span className="underline decoration-rose-500 font-bold">NEVER diagnoses or prescribes</span>. It solely analyzes acuity signals and suggests a triage priority (Emergency, Urgent, Semi-urgent, Routine). A qualified doctor or nurse must review, edit, approve, or reject every note before clinical consultation.
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('intake', 'patient')}
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/20 flex items-center gap-2 hover:scale-102 transition"
              >
                <Users className="w-4 h-4" />
                <span>Try Patient Intake (Multilingual Voice)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('clinician', 'doctor')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm shadow-md flex items-center gap-2 hover:scale-102 transition"
              >
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>Clinician Cockpit (Live Queue)</span>
              </button>

              <button
                onClick={() => onNavigate('blood-donation')}
                className="px-5 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 flex items-center gap-2 hover:scale-102 transition"
              >
                <Droplet className="w-4 h-4 fill-white" />
                <span>Blood Camps & Live Stock</span>
              </button>

              <button
                onClick={() => onNavigate('admin', 'admin')}
                className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 transition"
              >
                <Building2 className="w-4 h-4" />
                <span>Facility Admin</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400">11</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Indian Languages</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-rose-600">&lt;60s</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Emergency Detection</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400">100%</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Clinician Gatekept</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400">Offline</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">2G / Edge Resilient</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The India Challenge & Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Designed for the Realities of India's Public Healthcare
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Balancing severe patient overcrowding, linguistic diversity, variable specialist availability, and intermittent connectivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Overcrowding & Delayed Care
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              District hospitals and CHCs routinely see 800+ OPD patients daily. Critical chest pain or impending eclampsia patients can wait in line for hours without early identification.
            </p>
            <div className="pt-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              → TriageAssist detects red-flags immediately at intake kiosk.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Linguistic Diversity & Illiteracy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Patients describe complex symptoms in regional dialects (Bhojpuri, Odia, Gujarati, Tamil, Bengali). Doctors trained in English may misunderstand subtleties.
            </p>
            <div className="pt-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              → Voice recognition preserves original audio and gives clinical English translation.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Uneven Specialist Distribution
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Many PHCs lack cardiologists or gynecologists. Static guidelines fail when local specialists are absent.
            </p>
            <div className="pt-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              → Adaptive routing automatically activates eSanjeevani tele-consult or 108 referral.
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Continuous Human-in-the-Loop Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              How TriageAssist Operates in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-extrabold flex items-center justify-center text-sm border border-teal-500/30">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Multimodal Patient Intake</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Patient speaks symptoms in their native tongue, taps the interactive body map, and uploads lab reports or photos at the tablet kiosk.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-extrabold flex items-center justify-center text-sm border border-teal-500/30">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Rule-Based AI Synthesis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The engine checks deterministic red-flag rules (STEMI, eclampsia, pediatric shock), performs OCR, and structures an objective draft note.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-extrabold flex items-center justify-center text-sm border border-teal-500/30">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Clinician Review & Sign-Off</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A qualified medical officer views side-by-side original inputs, edits or approves the note, or overrides priority with mandatory justification.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-extrabold flex items-center justify-center text-sm border border-teal-500/30">
                4
              </div>
              <h4 className="text-sm font-bold text-white">Action & Adaptive Referral</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Patient receives a queue token with wait estimates; emergency cases are routed to resuscitation or higher centres via 108 ALS dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Facility Profiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Configurable Across Institutional Tiers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Dynamically adjusts referral logic based on bed availability and on-site specialists.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: 'Primary Health Centre', tag: 'PHC / Ayushman Arogya', icon: '🏥' },
            { title: 'Community Health Centre', tag: 'CHC (30 Beds)', icon: '🏛️' },
            { title: 'District Hospital', tag: 'Secondary / Tertiary', icon: '🏨' },
            { title: 'Industrial Clinic', tag: 'GIDC / Manufacturing', icon: '🏭' },
            { title: 'Campus Health Centre', tag: 'Colleges & Universities', icon: '🎓' },
            { title: 'Public Health Camp', tag: 'Outreach & Mela', icon: '⛺' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm space-y-1 hover:border-teal-500 transition"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{item.tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accessible Patient Tools & Community Health Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold mb-2">
            <span>Patient-Centric Health Tools • English, हिंदी, ଓଡ଼ିଆ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Comprehensive Digital Health Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            AI-powered symptom evaluation, geolocation hospital discovery, online OPD booking, report explanation, and health guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Symptom Checker */}
          <div
            onClick={() => onNavigate('symptom-checker')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                AI Symptom Checker
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter or speak symptoms (fever, cough, chest pain, headache) to receive instant acuity triage assessment, red-flag alerts, and structured recommended next steps.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Check Symptoms with AI</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Find Nearby Hospitals */}
          <div
            onClick={() => onNavigate('nearby-hospitals')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                Find Nearby Hospitals
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Locate nearest Government District Hospitals, PHCs, CHCs, Jan Aushadhi pharmacies, and 108 Emergency ambulance stations with GPS directions and live bed availability.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Find Hospitals Near Me</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Blood Donation Camps & Live Stock */}
          <div
            onClick={() => onNavigate('blood-donation')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-rose-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Droplet className="w-6 h-6 fill-rose-600" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition">
                  Blood Camps & Live Stock
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                  Donate / Take
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Discover voluntary blood donation drives organized near your GPS location to donate blood. Check live blood bank units across 8 blood groups (A+, B+, O-, etc.) or broadcast urgent patient transfusion requests.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>Donate or Find Blood</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Online Doctor Appointment */}
          <div
            onClick={() => onNavigate('doctor-appointments')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                Online Doctor Appointment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Search verified medical officers and specialists across departments. Choose available time slots and book or manage hospital OPD / eSanjeevani video consultations.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Book Appointment Slot</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Patient Intake & Triage Registration */}
          <div
            onClick={() => onNavigate('intake', 'patient')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                Patient Intake & Registration
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Multilingual voice intake with anatomical body maps, vital signs logging, prescription uploads, and OPD token generation for PHC triage queues.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Start Patient Intake</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Health Awareness Section */}
          <div
            onClick={() => onNavigate('awareness')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                Health Awareness Guide
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Trustworthy guidance on Indian health challenges: Diabetes, Anemia, Dengue warning signs, Child Malnutrition, Hygiene & ORS, and Preventive Care with myths vs facts.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Explore Awareness Topics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Medicine Reminders */}
          <div
            onClick={() => onNavigate('reminders')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                Medicine & OPD Reminders
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Track daily doctor-prescribed medications (morning/night, with/before food), calculate weekly adherence rate, and receive reminders for upcoming hospital doctor visits.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Manage My Reminders</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Seeded Demo Case Quick Launcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                Seeded Realistic Demo Scenarios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly jump into pre-configured Indian facility cases across languages, clinical presentations, and triage urgency levels.
              </p>
            </div>
            <button
              onClick={() => onNavigate('clinician', 'doctor')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              Open Full Clinician Queue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => onNavigate('clinician', 'doctor')}
              className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 shadow-sm cursor-pointer hover:ring-2 hover:ring-rose-500 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  EMERGENCY
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Token A-101</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Ramesh Patel (54M, Sanand GIDC)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Crushing chest pain radiating to left jaw & diaphoresis. Gujarati voice input + ECG lead II strip.
              </p>
            </div>

            <div
              onClick={() => onNavigate('clinician', 'doctor')}
              className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 shadow-sm cursor-pointer hover:ring-2 hover:ring-rose-500 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  EMERGENCY
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Token A-102</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Sunita Devi (26F, PHC Barabanki)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                34w pregnancy, severe scotoma, BP 174/112, 3+ urine proteinuria. Impending eclampsia red flag.
              </p>
            </div>

            <div
              onClick={() => onNavigate('clinician', 'doctor')}
              className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/60 shadow-sm cursor-pointer hover:ring-2 hover:ring-orange-500 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                  URGENT
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Token B-201</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Mohammed Rafiq (62M, CHC Bengal)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Chronic diabetic foot ulcer with cellulitis, random glucose 312 mg/dL. Uploaded wound photograph.
              </p>
            </div>

            <div
              onClick={() => onNavigate('clinician', 'doctor')}
              className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/60 shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-500 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ROUTINE
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Token D-401</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Ananya Roy (21F, Pune Campus)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Situational exam anxiety, episodic palpitations, normal vital signs. Marathi voice input.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
