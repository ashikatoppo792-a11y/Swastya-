import React, { useState, useEffect } from 'react';
import { FacilityProfile, AnalyticsData, FacilityType } from '../types';
import { fetchAnalytics, fetchFacilityProfile, updateFacilityProfile } from '../services/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Building2,
  Users,
  Clock,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Settings,
  Save,
  Radio,
  Sparkles,
  BedDouble,
  HeartPulse,
  RefreshCw
} from 'lucide-react';

export const FacilityAdminPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [facility, setFacility] = useState<FacilityProfile | null>(null);
  const [savingFacility, setSavingFacility] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aData, fData] = await Promise.all([
        fetchAnalytics(),
        fetchFacilityProfile()
      ]);
      setAnalytics(aData);
      setFacility(fData);
    } catch (err) {
      console.error('Failed to load facility data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFacilityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facility) return;
    try {
      setSavingFacility(true);
      const updated = await updateFacilityProfile(facility);
      setFacility(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSavingFacility(false);
    }
  };

  const handleSpecialistToggle = (key: keyof FacilityProfile['specialists']) => {
    if (!facility) return;
    setFacility({
      ...facility,
      specialists: {
        ...facility.specialists,
        [key]: !facility.specialists[key]
      }
    });
  };

  const facilityTypeOptions: FacilityType[] = [
    'PHC',
    'CHC',
    'District Hospital',
    'Company Clinic',
    'Industrial Estate',
    'Campus Clinic',
    'Health Camp'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-teal-600" />
            Facility Operations & Triage Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time patient throughput, override rates, language equity, and dynamic specialist profile adaptation.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Patients Today
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics.totalPatients}
            </div>
            <div className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              {analytics.pendingReviewCount} pending doctor review
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg Time-to-Review
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics.avgReviewTimeMinutes} <span className="text-sm font-normal text-slate-400">mins</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>✓ Well below 15-min target</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Clinician Concordance
            </span>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {analytics.concordanceRate}%
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Override rate: <strong>{analytics.overrideRate}%</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AI Quality Satisfaction
            </span>
            <div className="text-2xl font-black text-emerald-600">
              {analytics.aiSatisfactionRate}%
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Based on {analytics.totalFeedbacks} clinical feedbacks
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hourly Patient Intake Curve (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Hourly Patient Arrival Load & Emergency Influx
                </h3>
                <p className="text-xs text-slate-500">Distribution over the active shift (07:00 - 16:00)</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.hourlyLoad}>
                  <defs>
                    <linearGradient id="colorArrivals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#0d9488" stop-opacity={0.3}/>
                      <stop offset="95%" stop-color="#0d9488" stop-opacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEmerg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#ef4444" stop-opacity={0.4}/>
                      <stop offset="95%" stop-color="#ef4444" stop-opacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="arrivals" name="Total Patients" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorArrivals)" />
                  <Area type="monotone" dataKey="emergency" name="Emergencies" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorEmerg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Triage Priority Distribution (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Triage Acuity Distribution
              </h3>
              <p className="text-xs text-slate-500">Breakdown across 4 clinical levels</p>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.triageDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {analytics.triageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Analytics Row: Language Equity & Top Complaints */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-teal-600" />
              Linguistic Diversity Across Patient Intakes
            </h3>
            <p className="text-xs text-slate-500">Preserving vernacular patient agency through local language voice STT.</p>
            <div className="space-y-2 pt-2">
              {analytics.languageDistribution.map((lang) => (
                <div key={lang.code} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{lang.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (lang.count / (analytics.totalPatients || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono w-6 text-right">
                      {lang.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Syndromic Surveillance / Top Complaints */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              Syndromic Surveillance & Top Complaints
            </h3>
            <p className="text-xs text-slate-500">Automated symptom clustering for public health disease outbreak monitoring.</p>
            <div className="space-y-2 pt-2">
              {analytics.topComplaints.map((c, i) => (
                <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.complaint}</span>
                    <span className="text-[10px] text-slate-400 block">{c.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.highPriority && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                        Acuity Alert
                      </span>
                    )}
                    <span className="font-black text-slate-800 dark:text-slate-200 font-mono">{c.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Facility Profile Configuration & Adaptive Specialists */}
      {facility && (
        <form onSubmit={handleFacilityUpdate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-600" />
                Facility Profile & Adaptive Specialist Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle available specialists to see TriageAssist dynamically adjust its referral suggestions!
              </p>
            </div>

            <button
              type="submit"
              disabled={savingFacility}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{savingFacility ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Facility profile updated. AI routing rules re-calibrated.
            </div>
          )}

          {/* Core Facility Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Facility Name
              </label>
              <input
                type="text"
                value={facility.name}
                onChange={(e) => setFacility({ ...facility, name: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Facility Institutional Tier
              </label>
              <select
                value={facility.facilityType}
                onChange={(e) => setFacility({ ...facility, facilityType: e.target.value as FacilityType })}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {facilityTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Bed Count
                </label>
                <input
                  type="number"
                  value={facility.bedCount}
                  onChange={(e) => setFacility({ ...facility, bedCount: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  ICU Available
                </label>
                <select
                  value={facility.icuAvailable ? 'yes' : 'no'}
                  onChange={(e) => setFacility({ ...facility, icuAvailable: e.target.value === 'yes' })}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="no">No ICU</option>
                  <option value="yes">ICU On-site</option>
                </select>
              </div>
            </div>
          </div>

          {/* Adaptive Specialist Availability Switches */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  On-Site Specialists (Dynamic Adaptive Referral Triggers)
                </h4>
                <p className="text-[11px] text-slate-500">
                  When a specialist is toggled OFF (e.g. Cardiologist at a PHC), the AI changes its note recommendation from "Local OPD" to "Immediate 108 Ambulance / eSanjeevani Teleconsult Transfer"!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {[
                { key: 'generalPhysician', label: 'General Physician / MBBS' },
                { key: 'cardiologist', label: 'Cardiologist (MD/DM)' },
                { key: 'gynecologist', label: 'Gynecologist / Obstetrician' },
                { key: 'pediatrician', label: 'Pediatrician' },
                { key: 'generalSurgeon', label: 'General Surgeon' },
                { key: 'orthopedic', label: 'Orthopedic Surgeon' },
              ].map((s) => {
                const isAvailable = facility.specialists[s.key as keyof FacilityProfile['specialists']];
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => handleSpecialistToggle(s.key as keyof FacilityProfile['specialists'])}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      isAvailable
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px]">{isAvailable ? '✓ Available On-Site' : '✗ Unavailable (Auto-Refer)'}</div>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Referral Destinations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Designated Higher Center for Referrals
              </label>
              <input
                type="text"
                value={facility.nearestHigherFacility}
                onChange={(e) => setFacility({ ...facility, nearestHigherFacility: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Tele-Consultation Service
              </label>
              <input
                type="text"
                value={facility.teleconsultService}
                onChange={(e) => setFacility({ ...facility, teleconsultService: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Dynamic Referral Network & Gap Mitigation */}
          <div className="p-5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Nearby Referral Network & Specialty Gap Routing
                </h4>
              </div>
              <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                Facility Lat: 20.296° N, Lng: 85.824° E
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              When an on-site specialist is toggled OFF above, the triage assistant automatically flags the nearest referral center and prepares an eSanjeevani tele-consult slip.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">AIIMS Bhubaneswar</div>
                <div className="text-[10px] text-slate-400 mt-0.5">8.5 km • Cardiology, Trauma, ICU</div>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                  Apex Partner (24x7)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Capital Hospital</div>
                <div className="text-[10px] text-slate-400 mt-0.5">12.0 km • Obstetrics, Pediatrics</div>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-800">
                  Government District
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">SCB Medical College</div>
                <div className="text-[10px] text-slate-400 mt-0.5">24.5 km • Apex Burn & Neurosurgery</div>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-100 text-teal-800">
                  Tertiary Super-specialty
                </span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
