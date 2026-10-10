import React from 'react';
import { UserRole } from '../types';
import { languages, getTranslation } from '../i18n/translations';
import {
  LayoutGrid,
  UserCheck,
  Activity,
  Building2,
  Calendar,
  HeartPulse,
  Bell,
  Users,
  Settings,
  ShieldCheck,
  ChevronRight,
  Globe,
  Lock,
  X,
  Droplet
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentLanguage?: string;
  setCurrentLanguage?: (lang: string) => void;
  onOpenSecurity?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  isOpenMobile,
  onCloseMobile,
  currentLanguage = 'en',
  setCurrentLanguage,
  onOpenSecurity,
}) => {
  const t = getTranslation(currentLanguage);
  const menuItems = [
    {
      id: 'landing',
      label: 'Overview',
      icon: LayoutGrid,
      role: 'all',
    },
    {
      id: 'intake',
      label: 'Patient Intake',
      icon: UserCheck,
      role: 'patient',
    },
    {
      id: 'symptom-checker',
      label: 'Symptom Checker',
      icon: Activity,
      role: 'all',
      badge: 'AI',
    },
    {
      id: 'nearby-hospitals',
      label: 'Hospitals',
      icon: Building2,
      role: 'all',
    },
    {
      id: 'doctor-appointments',
      label: 'Book Doctor',
      icon: Calendar,
      role: 'all',
    },
    {
      id: 'blood-donation',
      label: t.bloodConnect || 'Blood & Camps',
      icon: Droplet,
      role: 'all',
      badge: 'Live',
    },
    {
      id: 'awareness',
      label: 'Awareness',
      icon: HeartPulse,
      role: 'all',
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: Bell,
      role: 'all',
    },
    {
      id: 'clinician',
      label: 'Clinician Cockpit',
      icon: Users,
      role: 'doctor',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Settings,
      role: 'admin',
    },
    {
      id: 'responsible',
      label: 'Safety',
      icon: ShieldCheck,
      role: 'all',
    },
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    setActiveTab(item.id);
    if (item.id === 'intake') setCurrentRole('patient');
    if (item.id === 'clinician') setCurrentRole('doctor');
    if (item.id === 'admin') setCurrentRole('admin');
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-5 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="space-y-4">
        {/* Sidebar Header Title */}
        <div className="px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 shadow-sm" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Clinical Navigation
            </span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation List */}
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 shadow-sm border border-sky-200/60 dark:border-sky-800/80 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Mobile Quick Settings: Persona & Language Switcher (Visible on mobile screens) */}
        <div className="lg:hidden px-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-1 mb-1.5">
              Active Persona
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('patient');
                  setActiveTab('intake');
                  onCloseMobile();
                }}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition min-h-[40px] flex items-center justify-center ${
                  currentRole === 'patient'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.rolePatient}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('doctor');
                  setActiveTab('clinician');
                  onCloseMobile();
                }}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition min-h-[40px] flex items-center justify-center ${
                  currentRole === 'doctor' || currentRole === 'nurse'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.roleDoctor}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('admin');
                  setActiveTab('admin');
                  onCloseMobile();
                }}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition min-h-[40px] flex items-center justify-center ${
                  currentRole === 'admin'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.roleAdmin}
              </button>
            </div>
          </div>

          {setCurrentLanguage && (
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-1 mb-1.5 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{t.selectLanguage}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setCurrentLanguage(l.code);
                    }}
                    className={`py-1.5 px-1 text-center rounded-xl text-[11px] font-bold transition ${
                      currentLanguage === l.code
                        ? 'bg-sky-600 text-white ring-1 ring-sky-500 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onOpenSecurity && (
            <button
              type="button"
              onClick={() => {
                onOpenSecurity();
                onCloseMobile();
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                <span>Security & DPDP Consent</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Footer Info / Facility Connection in Sidebar */}
      <div className="px-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 dark:text-slate-300">Swasthya Setu</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
            Connected
          </span>
        </div>
        <p className="truncate text-slate-500">Government Triage Network</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10 animate-slide-right flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
