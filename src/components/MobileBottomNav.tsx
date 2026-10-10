import React from 'react';
import { UserRole } from '../types';
import {
  Activity,
  UserCheck,
  Building2,
  Calendar,
  Menu,
  Users,
  Sparkles
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  onOpenMobileMenu,
}) => {
  const isClinician = currentRole === 'doctor' || currentRole === 'nurse';

  const navItems = isClinician
    ? [
        { id: 'clinician', label: 'Cockpit', icon: Users, badge: 'Live' },
        { id: 'symptom-checker', label: 'Triage AI', icon: Activity },
        { id: 'nearby-hospitals', label: 'Facilities', icon: Building2 },
        { id: 'intake', label: 'Intake', icon: UserCheck },
      ]
    : [
        { id: 'symptom-checker', label: 'Symptom AI', icon: Activity, badge: 'AI' },
        { id: 'intake', label: 'Intake', icon: UserCheck },
        { id: 'nearby-hospitals', label: 'Hospitals', icon: Building2 },
        { id: 'doctor-appointments', label: 'Book OPD', icon: Calendar },
      ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe transition-all"
    >
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 relative transition-all active:scale-95 ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-black bg-sky-600 text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1 truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 mt-0.5 animate-fade-in" />
              )}
            </button>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 relative text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95 transition-all"
          aria-label="Open More Menu"
        >
          <Menu className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] tracking-tight mt-1">More</span>
        </button>
      </div>
    </nav>
  );
};
