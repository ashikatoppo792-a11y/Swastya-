import React, { useState, useEffect } from 'react';
import { Patient, TriagePriority, PatientStatus, AuditEntry } from '../types';
import { fetchPatients, performClinicianAction, submitClinicianFeedback } from '../services/api';
import { printTriageSlip, exportFhirJson } from '../services/exportPdf';
import { AuditTrailModal } from '../components/AuditTrailModal';
import { PriorityOverrideModal } from '../components/PriorityOverrideModal';
import { ReferralModal } from '../components/ReferralModal';
import { FeedbackModal } from '../components/FeedbackModal';
import {
  Stethoscope,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Edit3,
  XCircle,
  HelpCircle,
  Printer,
  FileCode,
  History,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  ShieldAlert,
  PhoneCall,
  Eye,
  FileText,
  Camera,
  Activity,
  Layers,
  HeartPulse,
  RefreshCw,
  Building2,
  ArrowLeft,
  Users
} from 'lucide-react';
import { getTranslation } from '../i18n/translations';

interface ClinicianDashboardProps {
  piiMasked: boolean;
  currentLanguage?: string;
}

export const ClinicianDashboardPage: React.FC<ClinicianDashboardProps> = ({ piiMasked, currentLanguage = 'en' }) => {
  const t = getTranslation(currentLanguage);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileCockpitView, setMobileCockpitView] = useState<'queue' | 'detail'>('queue');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Modals state
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Editable note state
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedChiefComplaint, setEditedChiefComplaint] = useState('');
  const [editedHpi, setEditedHpi] = useState('');
  const [editedDepartment, setEditedDepartment] = useState('');

  // Explainability drawer toggle
  const [showExplainability, setShowExplainability] = useState(true);

  // Fetch live queue
  const loadQueue = async () => {
    try {
      setLoading(true);
      const data = await fetchPatients({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
        search: searchQuery || undefined,
      });

      // Sort by priority rank: Emergency -> Urgent -> Semi-urgent -> Routine
      const priorityRank: Record<string, number> = {
        Emergency: 1,
        Urgent: 2,
        'Semi-urgent': 3,
        Routine: 4,
      };

      const sorted = [...data].sort((a, b) => {
        const rankA = priorityRank[a.triageNote?.suggestedPriority || 'Routine'] || 5;
        const rankB = priorityRank[b.triageNote?.suggestedPriority || 'Routine'] || 5;
        return rankA - rankB;
      });

      setPatients(sorted);
      if (sorted.length > 0 && !selectedPatientId) {
        setSelectedPatientId(sorted[0].id);
      }
    } catch (err) {
      console.error('Failed to load queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [statusFilter, priorityFilter, departmentFilter]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Sync edited fields when selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      setEditedChiefComplaint(selectedPatient.triageNote?.chiefComplaintSummary || selectedPatient.chiefComplaint || '');
      setEditedHpi(selectedPatient.triageNote?.historyOfPresentIllness || '');
      setEditedDepartment(selectedPatient.triageNote?.suggestedDepartment || 'General OPD');
      setIsEditingNote(false);
    }
  }, [selectedPatientId]);

  // Actions
  const handleApprove = async () => {
    if (!selectedPatient) return;
    try {
      const updated = await performClinicianAction({
        patientId: selectedPatient.id,
        action: 'approve',
        clinicianName: 'Dr. Suresh Mehta, MD',
        clinicianRole: 'Attending Physician'
      });
      updateLocalPatient(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditApprove = async () => {
    if (!selectedPatient) return;
    try {
      const updated = await performClinicianAction({
        patientId: selectedPatient.id,
        action: 'edit_approve',
        clinicianName: 'Dr. Suresh Mehta, MD',
        clinicianRole: 'Attending Physician',
        editedNote: {
          chiefComplaintSummary: editedChiefComplaint,
          historyOfPresentIllness: editedHpi,
          suggestedDepartment: editedDepartment
        }
      });
      setIsEditingNote(false);
      updateLocalPatient(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOverrideConfirm = async (newPriority: TriagePriority, reason: string) => {
    if (!selectedPatient) return;
    try {
      const updated = await performClinicianAction({
        patientId: selectedPatient.id,
        action: 'override',
        newPriority,
        overrideReason: reason,
        clinicianName: 'Dr. Suresh Mehta, MD',
        clinicianRole: 'Attending Physician'
      });
      updateLocalPatient(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReferralConfirm = async (referralData: any) => {
    if (!selectedPatient) return;
    try {
      const updated = await performClinicianAction({
        patientId: selectedPatient.id,
        action: 'refer',
        referralDetails: referralData,
        clinicianName: 'Dr. Suresh Mehta, MD',
        clinicianRole: 'Attending Physician'
      });
      updateLocalPatient(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = async () => {
    if (!selectedPatient) return;
    const reason = prompt('Please enter clinical reason for rejection / reassignment:');
    if (!reason) return;
    try {
      const updated = await performClinicianAction({
        patientId: selectedPatient.id,
        action: 'reject',
        overrideReason: reason,
        clinicianName: 'Dr. Suresh Mehta, MD',
        clinicianRole: 'Attending Physician'
      });
      updateLocalPatient(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRequestInfo = async () => {
    if (!selectedPatient) return;
    const query = prompt('What additional clinical information is required? (e.g. repeat BP, verify onset)', 'Verify symptom progression & previous cardiac medications.');
    if (!query) return;
    try {
      const updated = await performClinicianAction({
        patientId: selectedPatient.id,
        action: 'request_info',
        infoRequestText: query,
        clinicianName: 'Dr. Suresh Mehta, MD',
        clinicianRole: 'Attending Physician'
      });
      updateLocalPatient(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFeedbackSubmit = async (rating: 'helpful' | 'incorrect' | 'partially_accurate', comment: string) => {
    if (!selectedPatient) return;
    try {
      await submitClinicianFeedback({
        patientId: selectedPatient.id,
        clinicianName: 'Dr. Suresh Mehta, MD',
        rating,
        comment
      });
      alert('Feedback logged! Continuous improvement model telemetry updated.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateLocalPatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Display name with PII masking
  const getDisplayName = (patient: Patient) => {
    if (!piiMasked) return patient.name;
    const parts = patient.name.split(' ');
    return parts.map(p => p[0] + '***').join(' ');
  };

  // Triage priority color classes
  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'Emergency':
        return 'bg-rose-600 text-white animate-pulse-fast shadow-md shadow-rose-600/30';
      case 'Urgent':
        return 'bg-orange-500 text-white';
      case 'Semi-urgent':
        return 'bg-amber-400 text-slate-950 font-bold';
      case 'Routine':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  // Calculate wait time since check-in
  const getWaitMinutes = (checkInTime: string) => {
    const diffMs = Date.now() - new Date(checkInTime).getTime();
    return Math.max(1, Math.round(diffMs / (60 * 1000)));
  };

  const formatWaitTime = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const cleanEmergencyNotice = (txt?: string) => {
    if (!txt) return '';
    return txt.replace(/^[🎉🚨⚠️\s]+/, '').replace(/^IMMEDIATE ACTION:\s*/i, '').trim();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Triage Statistics Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Stethoscope className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Clinician Triage Cockpit
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                  {patients.length} In Queue
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged in as: <strong>Dr. Suresh Mehta, MD</strong> (Medical Officer) • Facility: Primary Health Centre Barabanki
              </p>
            </div>
          </div>
        </div>

        {/* Refresh & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadQueue}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t.refreshQueue}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher: Queue vs Case Details (Hidden on Desktop) */}
      <div className="flex lg:hidden bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-1">
        <button
          type="button"
          onClick={() => setMobileCockpitView('queue')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mobileCockpitView === 'queue'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.patientQueue} ({patients.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileCockpitView('detail')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mobileCockpitView === 'detail'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{t.caseDetails}: {selectedPatient ? selectedPatient.tokenNumber : ''}</span>
        </button>
      </div>

      {/* Main 2-Column Cockpit Layout: Left Queue / Right Case Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Queue (4 Cols) */}
        <div className={`lg:col-span-4 space-y-3 ${mobileCockpitView === 'detail' ? 'hidden lg:block' : 'block'}`}>
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadQueue()}
                placeholder="Search patient, token, complaint..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="overridden">Overridden</option>
                  <option value="referred">Referred</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full p-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Semi-urgent">Semi-urgent</option>
                  <option value="Routine">Routine</option>
                </select>
              </div>
            </div>
          </div>

          {/* Patient Cards List */}
          <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {patients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              const prio = p.triageNote?.suggestedPriority || 'Routine';
              const waitMins = getWaitMinutes(p.checkInTime);

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPatientId(p.id);
                    setMobileCockpitView('detail');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-teal-50/70 dark:bg-teal-950/60 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {/* Top line: Token & Priority */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
                        {p.tokenNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {getDisplayName(p)}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                        ({p.age}Y/{p.sex[0]})
                      </span>
                      {p.bloodGroup && p.bloodGroup !== 'Unknown' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 whitespace-nowrap shrink-0">
                          {p.bloodGroup}
                        </span>
                      )}
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap shrink-0 ${getPriorityBadge(prio)}`}>
                      {prio}
                    </span>
                  </div>

                  {/* Complaint excerpt */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-medium">
                    {p.chiefComplaint}
                  </p>

                  {/* Bottom details: Wait time & Status */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{t.waitLabel}: <strong className="text-slate-700 dark:text-slate-300">{formatWaitTime(waitMins)}</strong></span>
                    </span>
                    <span className={`capitalize font-bold text-[10px] px-1.5 py-0.2 rounded ${
                      p.status === 'approved' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' :
                      p.status === 'overridden' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950' :
                      p.status === 'referred' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' :
                      'text-slate-500'
                    }`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}

            {patients.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                No patients match the selected filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Case Workstation (8 Cols) */}
        {selectedPatient ? (
          <div className={`lg:col-span-8 space-y-4 ${mobileCockpitView === 'queue' ? 'hidden lg:block' : 'block'}`}>
            {/* Mobile Return to Queue Header Button */}
            <div className="lg:hidden flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setMobileCockpitView('queue')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← {t.backToQueue}</span>
              </button>
              <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {t.tokenNumber}: {selectedPatient.tokenNumber}
              </span>
            </div>
            {/* Top Emergency Red-Flag Banner if detected */}
            {selectedPatient.triageNote?.emergencyActionNotice && (
              <div className="bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-500 rounded-2xl p-4 shadow-md space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-black text-rose-900 dark:text-rose-100 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                        {t.highUrgencyProtocol}
                      </h3>
                      <p className="text-xs font-bold text-rose-800 dark:text-rose-200 mt-1 leading-relaxed">
                        {cleanEmergencyNotice(selectedPatient.triageNote.emergencyActionNotice)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsReferralModalOpen(true)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md shrink-0 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{t.callAmbulance}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Patient Header Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="min-w-[68px] px-3 py-2 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 font-mono font-black text-base flex items-center justify-center whitespace-nowrap shrink-0 shadow-xs">
                    {selectedPatient.tokenNumber}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {getDisplayName(selectedPatient)}
                      </h2>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {selectedPatient.age} Y / {selectedPatient.sex === 'Male' ? t.male : selectedPatient.sex === 'Female' ? t.female : t.other}
                      </span>
                      {selectedPatient.bloodGroup && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900/50 flex items-center gap-1 whitespace-nowrap">
                          <span className="text-rose-500">🩸</span> {selectedPatient.bloodGroup}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold uppercase whitespace-nowrap">
                        {selectedPatient.primaryLanguage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Facility: {selectedPatient.facilityName} • Intake: {new Date(selectedPatient.checkInTime).toLocaleTimeString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Priority & Status Badges */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-xl text-xs font-black shadow-sm whitespace-nowrap ${getPriorityBadge(selectedPatient.triageNote?.suggestedPriority)}`}>
                    {t.priorityLabel}: {selectedPatient.triageNote?.suggestedPriority || 'Routine'}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                    {t.statusLabel}: {selectedPatient.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Patient Vitals Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {selectedPatient.vitals?.bloodPressureSystolic || '-'}/{selectedPatient.vitals?.bloodPressureDiastolic || '-'}
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">mmHg</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Pulse Rate</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {selectedPatient.vitals?.pulseRate || '-'}
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">bpm</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">SpO2 Oxygen</div>
                  <div className={`text-sm font-extrabold mt-0.5 ${
                    selectedPatient.vitals?.spo2 && selectedPatient.vitals.spo2 < 94 ? 'text-rose-600' : 'text-slate-900 dark:text-white'
                  }`}>
                    {selectedPatient.vitals?.spo2 ? `${selectedPatient.vitals.spo2}%` : '-'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Temperature</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {selectedPatient.vitals?.temperatureF ? `${selectedPatient.vitals.temperatureF}°F` : '-'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Severity</div>
                  <div className="text-sm font-extrabold text-amber-600 mt-0.5">
                    {selectedPatient.severity} / 10
                  </div>
                </div>
              </div>
            </div>

            {/* Side-by-Side: Original Patient Inputs (Left) vs AI Triage Note (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Box: Original Raw Patient Inputs */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                    Original Patient Inputs
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                    Native Voice + Media
                  </span>
                </div>

                {/* Voice Transcript (Native) */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Raw Voice Transcript ({selectedPatient.primaryLanguage.toUpperCase()})
                  </span>
                  <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-sans italic mt-1">
                    "{selectedPatient.voiceTranscript || selectedPatient.chiefComplaint}"
                  </div>
                </div>

                {/* Translated English Transcript */}
                {selectedPatient.voiceTranscriptEn && selectedPatient.voiceTranscriptEn !== selectedPatient.voiceTranscript && (
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 uppercase">
                      Auto-Translated English Transcript
                    </span>
                    <div className="bg-teal-50/50 dark:bg-teal-950/30 p-3 rounded-xl border border-teal-200 dark:border-teal-800/60 text-xs text-slate-800 dark:text-slate-200 mt-1">
                      "{selectedPatient.voiceTranscriptEn}"
                    </div>
                  </div>
                )}

                {/* Patient Context (Blood Group, Pregnancy, Chronic, Meds) */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {selectedPatient.bloodGroup && selectedPatient.bloodGroup !== 'Unknown' && (
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-bold">
                      <span>🩸 Blood Group:</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-extrabold">{selectedPatient.bloodGroup}</span>
                    </div>
                  )}
                  {selectedPatient.pregnant && (
                    <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-bold">
                      <span>• Pregnancy:</span>
                      <span>{selectedPatient.pregnancyTrimester || 'Yes'}</span>
                    </div>
                  )}
                  {selectedPatient.chronicConditions && selectedPatient.chronicConditions.length > 0 && (
                    <div>
                      <strong>Chronic:</strong> {selectedPatient.chronicConditions.join(', ')}
                    </div>
                  )}
                  {selectedPatient.currentMedicines && selectedPatient.currentMedicines.length > 0 && (
                    <div>
                      <strong>Medicines:</strong> {selectedPatient.currentMedicines.join(', ')}
                    </div>
                  )}
                  {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                    <div className="text-rose-600 font-semibold">
                      <strong>Allergies:</strong> {selectedPatient.allergies.join(', ')}
                    </div>
                  )}
                </div>

                {/* Attached Reports with OCR Findings */}
                {selectedPatient.reports && selectedPatient.reports.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Attached Lab / Scan Reports ({selectedPatient.reports.length})
                    </span>
                    {selectedPatient.reports.map((rep) => (
                      <div key={rep.id} className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            {rep.fileName}
                          </span>
                        </div>
                        {rep.ocrExtractedText && (
                          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-700">
                            {rep.ocrExtractedText}
                          </div>
                        )}
                        {rep.keyFindings && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {rep.keyFindings.map((kf, i) => (
                              <span
                                key={i}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  kf.status === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                                  kf.status === 'ABNORMAL' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {kf.parameter}: {kf.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Attached Clinical Photos */}
                {selectedPatient.photos && selectedPatient.photos.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Clinical Visual Inputs ({selectedPatient.photos.length})
                    </span>
                    {selectedPatient.photos.map((p) => (
                      <div key={p.id} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-2.5">
                        <img src={p.previewUrl} alt={p.fileName} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{p.fileName}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">{p.mockVisualAnalysis}</p>
                          <span className="text-[10px] text-teal-600 font-semibold block mt-1">
                            Basic visual screening only
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Box: AI-Generated Structured Triage Note */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    AI Structured Clinical Note (Draft)
                  </h3>
                  <button
                    onClick={() => setIsEditingNote(!isEditingNote)}
                    className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {isEditingNote ? 'Cancel Editing' : 'Edit Note'}
                  </button>
                </div>

                {/* Chief Complaint Summary */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Chief Complaint Summary</span>
                  {isEditingNote ? (
                    <input
                      type="text"
                      value={editedChiefComplaint}
                      onChange={(e) => setEditedChiefComplaint(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-teal-500 bg-teal-50/20 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
                    />
                  ) : (
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedPatient.triageNote?.chiefComplaintSummary || selectedPatient.chiefComplaint}
                    </p>
                  )}
                </div>

                {/* History of Present Illness (HPI) */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">History of Present Illness</span>
                  {isEditingNote ? (
                    <textarea
                      rows={3}
                      value={editedHpi}
                      onChange={(e) => setEditedHpi(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-teal-500 bg-teal-50/20 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
                    />
                  ) : (
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {selectedPatient.triageNote?.historyOfPresentIllness || 'N/A'}
                    </p>
                  )}
                </div>

                {/* Suggested Department / Referral */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Suggested Department / Specialist</span>
                  {isEditingNote ? (
                    <input
                      type="text"
                      value={editedDepartment}
                      onChange={(e) => setEditedDepartment(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-teal-500 bg-teal-50/20 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
                    />
                  ) : (
                    <div className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 p-2 rounded-lg border border-teal-200 dark:border-teal-800 mt-1">
                      {selectedPatient.triageNote?.suggestedDepartment || 'General OPD'}
                    </div>
                  )}
                </div>

                {/* Red Flags Detected List */}
                {selectedPatient.triageNote?.redFlagsDetected && selectedPatient.triageNote.redFlagsDetected.length > 0 && (
                  <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900 space-y-1.5">
                    <span className="text-[10px] font-black text-rose-800 dark:text-rose-200 uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Red-Flag Acuity Indicators
                    </span>
                    <ul className="text-xs space-y-1 text-rose-900 dark:text-rose-200 font-medium">
                      {selectedPatient.triageNote.redFlagsDetected.map((rf, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Information To Ask Doctor */}
                {selectedPatient.triageNote?.missingInformationToAsk && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      Suggested Clinical Clarifications for Doctor
                    </span>
                    <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      {selectedPatient.triageNote.missingInformationToAsk.map((q, i) => (
                        <li key={i}>? {q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Explainability "Why this priority?" Drawer */}
                {selectedPatient.triageNote?.explainability && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <button
                      onClick={() => setShowExplainability(!showExplainability)}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      {showExplainability ? 'Hide Clinical Explainability' : 'Show "Why this priority?" Explainability'}
                    </button>

                    {showExplainability && (
                      <div className="bg-teal-50/40 dark:bg-teal-950/20 p-3 rounded-xl border border-teal-200 dark:border-teal-800/50 text-xs space-y-2">
                        <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase">
                          Evidence Mapping (Source Inputs → Model Inference)
                        </span>
                        <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                          {selectedPatient.triageNote.explainability.primaryFactors.map((f, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-teal-600 font-bold">✓</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        {selectedPatient.triageNote.explainability.sourceMapping && (
                          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-teal-200 dark:border-teal-800">
                            {selectedPatient.triageNote.explainability.sourceMapping.map((sm, i) => (
                              <div key={i}>
                                <strong>Claim:</strong> {sm.claim} ← <em>{sm.source}</em>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Human-in-the-Loop Action Toolbar */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldAlert className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-white uppercase tracking-wider">
                    HUMAN-IN-THE-LOOP CLINICIAN SIGN-OFF
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    (Qualified review required before consultation)
                  </span>
                </div>

                {/* Audit & Export buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAuditModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5 text-teal-400" />
                    <span>Audit Trail</span>
                  </button>

                  <button
                    onClick={() => printTriageSlip(selectedPatient, piiMasked)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                    title="Print standardized ABDM Clinical Triage Slip"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-400" />
                    <span>Print Slip</span>
                  </button>

                  <button
                    onClick={() => exportFhirJson(selectedPatient)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                    title="Export HL7 FHIR R4 JSON Bundle"
                  >
                    <FileCode className="w-3.5 h-3.5 text-teal-400" />
                    <span>FHIR JSON</span>
                  </button>
                </div>
              </div>

              {/* Main Clinical Actions Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {isEditingNote ? (
                  <button
                    onClick={handleEditApprove}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Edits & Approve Note</span>
                  </button>
                ) : (
                  <button
                    onClick={handleApprove}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Note As Final</span>
                  </button>
                )}

                <button
                  onClick={() => setIsOverrideModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Override Priority (With Justification)</span>
                </button>

                <button
                  onClick={() => setIsReferralModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Refer to Higher Facility</span>
                </button>

                <button
                  onClick={handleRequestInfo}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Request Info
                </button>

                <button
                  onClick={handleReject}
                  className="px-3 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs transition"
                >
                  Reject Note
                </button>

                {/* AI Continuous Improvement feedback button */}
                <button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="ml-auto px-3 py-2.5 rounded-xl bg-teal-950 text-teal-300 border border-teal-800 text-xs font-bold transition flex items-center gap-1.5 hover:bg-teal-900"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Rate AI Accuracy</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            Select a patient from the queue on the left to review their clinical summary.
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedPatient && (
        <>
          <AuditTrailModal
            isOpen={isAuditModalOpen}
            onClose={() => setIsAuditModalOpen(false)}
            patientName={getDisplayName(selectedPatient)}
            tokenNumber={selectedPatient.tokenNumber}
            auditTrail={selectedPatient.auditTrail || []}
          />

          <PriorityOverrideModal
            isOpen={isOverrideModalOpen}
            onClose={() => setIsOverrideModalOpen(false)}
            currentPriority={selectedPatient.triageNote?.suggestedPriority || 'Routine'}
            onConfirmOverride={handleOverrideConfirm}
          />

          <ReferralModal
            isOpen={isReferralModalOpen}
            onClose={() => setIsReferralModalOpen(false)}
            patientName={getDisplayName(selectedPatient)}
            tokenNumber={selectedPatient.tokenNumber}
            defaultDestination="District Hospital Barabanki (18 km)"
            defaultSummary={selectedPatient.triageNote?.chiefComplaintSummary || selectedPatient.chiefComplaint}
            onConfirmReferral={handleReferralConfirm}
          />

          <FeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={() => setIsFeedbackModalOpen(false)}
            patientId={selectedPatient.id}
            patientName={getDisplayName(selectedPatient)}
            onSubmitFeedback={handleFeedbackSubmit}
          />
        </>
      )}
    </div>
  );
};
