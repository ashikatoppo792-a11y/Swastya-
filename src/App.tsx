import React, { useState, useEffect } from 'react';
import { UserRole, Patient } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { PatientIntakePage } from './pages/PatientIntakePage';
import { ClinicianDashboardPage } from './pages/ClinicianDashboardPage';
import { FacilityAdminPage } from './pages/FacilityAdminPage';
import { PatientStatusPage } from './pages/PatientStatusPage';
import { ResponsibleAiPage } from './pages/ResponsibleAiPage';
import { MedicalReportScannerPage } from './pages/MedicalReportScannerPage';
import { HealthAwarenessPage } from './pages/HealthAwarenessPage';
import { MedicineReminderPage } from './pages/MedicineReminderPage';
import { AiSymptomCheckerPage } from './pages/AiSymptomCheckerPage';
import { FindNearbyHospitalsPage } from './pages/FindNearbyHospitalsPage';
import { OnlineDoctorAppointmentPage } from './pages/OnlineDoctorAppointmentPage';
import { BloodDonationPage } from './pages/BloodDonationPage';
import { SecurityPrivacyModal } from './components/SecurityPrivacyModal';
import { AiChatAssistant } from './components/AiChatAssistant';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HealthAwarenessTopic } from './types';
import { getOfflineQueueCount, syncOfflineQueue, isOnline as checkOnline } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('symptom-checker');
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);

  // Cross-Navigation Filters
  const [appointmentHospitalFilter, setAppointmentHospitalFilter] = useState<string>('');
  const [appointmentSpecialtyFilter, setAppointmentSpecialtyFilter] = useState<string>('');
  const [nearbyCareEmergencyMode, setNearbyCareEmergencyMode] = useState<boolean>(false);
  const [nearbyCareSpecialtyFilter, setNearbyCareSpecialtyFilter] = useState<string>('');

  // Accessibility & Theme States
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [piiMasked, setPiiMasked] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // Network & Offline Queue
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Submitted Patient for Status View
  const [submittedPatient, setSubmittedPatient] = useState<Patient | null>(null);

  // Listen to network changes
  useEffect(() => {
    const updateOnline = () => {
      const online = checkOnline();
      setIsOnline(online);
      setPendingSyncCount(getOfflineQueueCount());
      if (online) {
        syncOfflineQueue().then(({ syncedCount }) => {
          if (syncedCount > 0) {
            setPendingSyncCount(getOfflineQueueCount());
          }
        });
      }
    };

    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    updateOnline();

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  const handleManualSync = async () => {
    const res = await syncOfflineQueue();
    setPendingSyncCount(getOfflineQueueCount());
    alert(`Synchronized ${res.syncedCount} queued records with the facility database.`);
  };

  const handleIntakeSuccess = (patient: Patient) => {
    setSubmittedPatient(patient);
    setActiveTab('status');
  };

  const handleNavigate = (tab: string, role?: UserRole) => {
    setActiveTab(tab);
    if (role) setCurrentRole(role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePurgeData = () => {
    try {
      localStorage.removeItem('swasthya_offline_queue');
      localStorage.removeItem('swasthya_recent_patients');
      setPendingSyncCount(0);
      setSubmittedPatient(null);
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  };

  const handleStartIntakeWithTopic = (topic: HealthAwarenessTopic) => {
    setActiveTab('intake');
    setCurrentRole('patient');
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 bg-[#f4f7fb] text-slate-900 ${
        darkMode ? 'dark bg-[#0f172a] text-slate-100' : 'bg-[#f4f7fb] text-slate-900'
      } ${highContrast ? 'high-contrast' : ''} ${largeText ? 'large-text' : ''}`}
    >
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        largeText={largeText}
        setLargeText={setLargeText}
        piiMasked={piiMasked}
        setPiiMasked={setPiiMasked}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOnline={isOnline}
        lowBandwidth={lowBandwidth}
        setLowBandwidth={setLowBandwidth}
        pendingSyncCount={pendingSyncCount}
        onSyncClick={handleManualSync}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Main Two-Column Layout with Left Sidebar */}
      <div className="flex flex-1 min-w-0 bg-[#f4f7fb] text-slate-900">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          onOpenSecurity={() => setIsSecurityModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 pb-28 lg:pb-8 overflow-y-auto">
          {activeTab === 'landing' && (
            <LandingPage
              onNavigate={handleNavigate}
              onSelectLanguage={setCurrentLanguage}
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'intake' && (
            <PatientIntakePage
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              onSubmitSuccess={handleIntakeSuccess}
            />
          )}

          {activeTab === 'symptom-checker' && (
            <AiSymptomCheckerPage
              currentLanguage={currentLanguage}
              onNavigateToHospitals={(isEmergency, spec) => {
                setNearbyCareEmergencyMode(Boolean(isEmergency));
                if (spec) setNearbyCareSpecialtyFilter(spec);
                setActiveTab('nearby-hospitals');
              }}
              onNavigateToAppointments={(spec) => {
                if (spec) setAppointmentSpecialtyFilter(spec);
                setActiveTab('doctor-appointments');
              }}
              onNavigateToIntake={() => setActiveTab('intake')}
            />
          )}

          {activeTab === 'nearby-hospitals' && (
            <FindNearbyHospitalsPage
              currentLanguage={currentLanguage}
              isEmergencyMode={nearbyCareEmergencyMode}
              initialSpecialty={nearbyCareSpecialtyFilter}
              onBookAtHospital={(hospName) => {
                setAppointmentHospitalFilter(hospName);
                setActiveTab('doctor-appointments');
              }}
              isClinicianMode={currentRole === 'doctor' || currentRole === 'nurse'}
            />
          )}

          {activeTab === 'doctor-appointments' && (
            <OnlineDoctorAppointmentPage
              currentLanguage={currentLanguage}
              initialHospitalFilter={appointmentHospitalFilter}
              initialSpecialtyFilter={appointmentSpecialtyFilter}
            />
          )}

          {activeTab === 'blood-donation' && (
            <BloodDonationPage
              currentLanguage={currentLanguage}
              onNavigateToHospital={(hospName) => {
                setAppointmentHospitalFilter(hospName);
                setActiveTab('doctor-appointments');
              }}
            />
          )}

          {activeTab === 'report-scanner' && (
            <MedicalReportScannerPage
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'awareness' && (
            <HealthAwarenessPage
              currentLanguage={currentLanguage}
              onStartIntakeWithTopic={handleStartIntakeWithTopic}
            />
          )}

          {activeTab === 'reminders' && (
            <MedicineReminderPage />
          )}

          {activeTab === 'clinician' && (
            <ClinicianDashboardPage piiMasked={piiMasked} currentLanguage={currentLanguage} />
          )}

          {activeTab === 'admin' && (
            <FacilityAdminPage />
          )}

          {activeTab === 'status' && submittedPatient && (
            <PatientStatusPage
              patient={submittedPatient}
              onNewIntake={() => {
                setSubmittedPatient(null);
                setActiveTab('intake');
              }}
              onViewNearbyCare={(isEmergency, spec) => {
                setNearbyCareEmergencyMode(Boolean(isEmergency));
                if (spec) setNearbyCareSpecialtyFilter(spec);
                setActiveTab('nearby-hospitals');
              }}
            />
          )}

          {activeTab === 'responsible' && (
            <ResponsibleAiPage />
          )}
        </main>
      </div>

      {/* Security & Privacy Modal (DPDP Act 2023, PIN Gate, Right to Erasure) */}
      <SecurityPrivacyModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        piiMasked={piiMasked}
        onTogglePiiMask={setPiiMasked}
        onPurgeData={handlePurgeData}
      />

      {/* Interactive AI Chat Assistant Modal / Slide-out */}
      <AiChatAssistant
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onNavigateTab={(tab, isEmergency) => {
          if (isEmergency) setNearbyCareEmergencyMode(true);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Persistent Legal Disclaimer Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar (Thumb Zone) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
      />
    </div>
  );
}

export default App;
