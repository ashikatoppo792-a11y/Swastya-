import React from 'react';
import { languages, getTranslation } from '../i18n/translations';
import { UserRole } from '../types';
import {
  Activity,
  Globe,
  Eye,
  Type,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  Sun,
  Moon,
  Menu,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Bot
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
  piiMasked: boolean;
  setPiiMasked: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isOnline: boolean;
  lowBandwidth: boolean;
  setLowBandwidth: (val: boolean) => void;
  pendingSyncCount: number;
  onSyncClick: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSecurity: () => void;
  onToggleMobileSidebar: () => void;
  onOpenAiChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  currentLanguage,
  setCurrentLanguage,
  highContrast,
  setHighContrast,
  largeText,
  setLargeText,
  piiMasked,
  setPiiMasked,
  darkMode,
  setDarkMode,
  isOnline,
  lowBandwidth,
  setLowBandwidth,
  pendingSyncCount,
  onSyncClick,
  activeTab,
  setActiveTab,
  onOpenSecurity,
  onToggleMobileSidebar,
  onOpenAiChat,
}) => {
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [isRoleOpen, setIsRoleOpen] = React.useState(false);
  const t = getTranslation(currentLanguage);

  // Close popovers on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.popover-container')) {
        setIsLangOpen(false);
        setIsRoleOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Hamburger (Mobile) + Brand Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition touch-manipulation"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group"
              onClick={() => setActiveTab('landing')}
            >
              {/* Blue Logo Box matching screenshot */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div>
                <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  TriageAssist
                </h1>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  Swasthya Setu
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Security Link (Hidden on very narrow mobile screens to preserve space) */}
            <button
              type="button"
              onClick={onOpenSecurity}
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition"
            >
              Security
            </button>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-600 font-bold select-none">·</span>

            {/* Language Dropdown Link (Touch + Click Accessible) */}
            <div className="relative popover-container">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangOpen(!isLangOpen);
                  setIsRoleOpen(false);
                }}
                className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition flex items-center gap-1 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="uppercase text-[11px] sm:text-xs font-bold text-sky-700 dark:text-sky-400 sm:font-semibold sm:text-slate-700 sm:normal-case">
                  <span className="sm:inline hidden">Language</span>
                  <span className="sm:hidden">{currentLanguage}</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition" />
              </button>

              {/* Language Selection Popover */}
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                    Select Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setCurrentLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                        currentLanguage === l.code
                          ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-300 font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{l.native}</span>
                      <span className="text-[10px] text-slate-400">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-300 dark:text-slate-600 font-bold select-none">·</span>

            {/* Role Dropdown Link (Touch + Click Accessible) */}
            <div className="relative popover-container">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRoleOpen(!isRoleOpen);
                  setIsLangOpen(false);
                }}
                className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition flex items-center gap-1 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>Role</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition" />
              </button>

              {/* Role Selection Popover */}
              {isRoleOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                    Active Persona
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRole('patient');
                      setActiveTab('intake');
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      currentRole === 'patient'
                        ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t.rolePatient}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRole('doctor');
                      setActiveTab('clinician');
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      currentRole === 'doctor' || currentRole === 'nurse'
                        ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t.roleDoctor}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRole('admin');
                      setActiveTab('admin');
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      currentRole === 'admin'
                        ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t.roleAdmin}
                  </button>
                </div>
              )}
            </div>

            <span className="hidden xs:inline text-slate-300 dark:text-slate-600 font-bold select-none">·</span>

            {/* AI Assistant Pill Button at the top right */}
            <button
              type="button"
              onClick={onOpenAiChat}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 hover:shadow-sky-600/40 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer group shrink-0"
              title="Open AI Assistant & Medical Triage Chat"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline tracking-wide">AI Assistant</span>
              <span className="sm:hidden font-bold">AI</span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
            </button>

            {/* Subtle Accessibility & Utility Controls */}
            <div className="hidden sm:flex items-center pl-2 ml-1 border-l border-slate-200 dark:border-slate-800 gap-1.5">
              {/* PII Masking */}
              <button
                type="button"
                onClick={() => setPiiMasked(!piiMasked)}
                title={piiMasked ? 'PII Protected (Masked)' : 'PII Visible'}
                className={`p-1.5 rounded-lg text-xs transition ${
                  piiMasked
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                {piiMasked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>

              {/* High Contrast */}
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                title="High Contrast Mode"
                className={`p-1.5 rounded-lg text-xs transition ${
                  highContrast
                    ? 'bg-yellow-400 text-black font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              {/* Large Text */}
              <button
                type="button"
                onClick={() => setLargeText(!largeText)}
                title="Toggle Large Text"
                className={`p-1.5 rounded-lg text-xs transition ${
                  largeText
                    ? 'bg-sky-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle Theme"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
