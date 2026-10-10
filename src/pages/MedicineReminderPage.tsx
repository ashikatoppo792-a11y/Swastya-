import React, { useState, useEffect } from 'react';
import { MedicineReminder, AppointmentReminder } from '../types';
import {
  fetchMedicineReminders,
  addMedicineReminder,
  toggleMedicineTaken,
  deleteMedicineReminder,
  fetchAppointmentReminders,
  addAppointmentReminder,
  deleteAppointmentReminder
} from '../services/api';
import {
  Clock,
  Calendar,
  Bell,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  Pill,
  Stethoscope,
  HeartPulse,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { playReminderAlarmSound, stopAlarmSound } from '../services/alarmSound';

export const MedicineReminderPage: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineReminder[]>([]);
  const [appointments, setAppointments] = useState<AppointmentReminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddAptOpen, setIsAddAptOpen] = useState(false);

  // New Medicine Form State
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet (500mg)');
  const [instruction, setInstruction] = useState<'after_food' | 'before_food' | 'with_food' | 'empty_stomach'>('after_food');
  const [timeMorning, setTimeMorning] = useState(true);
  const [timeNight, setTimeNight] = useState(true);
  const [doctorPrescribed, setDoctorPrescribed] = useState('');

  // New Appointment Form State
  const [aptDoctor, setAptDoctor] = useState('');
  const [aptDept, setAptDept] = useState('General Medicine OPD');
  const [aptDate, setAptDate] = useState('');
  const [aptTime, setAptTime] = useState('10:00 AM');
  const [aptLocation, setAptLocation] = useState('Primary Health Centre');
  const [aptPrep, setAptPrep] = useState('Bring previous prescriptions & test reports');

  // Notification Test Alert
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);
  const [isRingingAlarm, setIsRingingAlarm] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mList, aList] = await Promise.all([
        fetchMedicineReminders(),
        fetchAppointmentReminders()
      ]);
      setMedicines(mList);
      setAppointments(aList);
    } catch (err) {
      console.error('Failed to load reminders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTaken = async (id: string, slotIdx = 0) => {
    try {
      const updated = await toggleMedicineTaken(id, slotIdx);
      setMedicines(prev => prev.map(m => m.id === id ? updated : m));
    } catch (err) {
      console.error('Toggle error', err);
    }
  };

  const handleDeleteMed = async (id: string) => {
    if (!confirm('Are you sure you want to remove this medication reminder?')) return;
    await deleteMedicineReminder(id);
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleDeleteApt = async (id: string) => {
    if (!confirm('Remove this appointment reminder?')) return;
    await deleteAppointmentReminder(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleCreateMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const timings: any[] = [];
    if (timeMorning) timings.push({ timeSlot: 'morning', time: '08:30', takenToday: false });
    if (timeNight) timings.push({ timeSlot: 'night', time: '20:30', takenToday: false });
    if (timings.length === 0) timings.push({ timeSlot: 'morning', time: '09:00', takenToday: false });

    const newMed = await addMedicineReminder({
      medicineName: medName.trim(),
      dosage,
      instructions: instruction,
      timings,
      frequency: 'daily',
      startDate: new Date().toISOString().split('T')[0],
      doctorPrescribedBy: doctorPrescribed.trim() || 'Prescribed by Medical Officer'
    });

    setMedicines([newMed, ...medicines]);
    setIsAddMedOpen(false);
    setMedName('');
  };

  const handleCreateApt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptDoctor.trim() || !aptDate) return;

    const newApt = await addAppointmentReminder({
      doctorOrClinic: aptDoctor.trim(),
      department: aptDept,
      date: aptDate,
      time: aptTime,
      location: aptLocation.trim(),
      preparationNotes: aptPrep ? aptPrep.split(',').map(s => s.trim()) : []
    });

    setAppointments([newApt, ...appointments]);
    setIsAddAptOpen(false);
    setAptDoctor('');
  };

  // Test Notification Alert & Audible Alarm
  const handleTestNotification = () => {
    if (isRingingAlarm) {
      stopAlarmSound();
      setIsRingingAlarm(false);
      setNotificationBanner(null);
      return;
    }

    setIsRingingAlarm(true);
    playReminderAlarmSound(3, () => {
      setIsRingingAlarm(false);
    });

    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification('TriageAssist Medicine Reminder', {
            body: 'Time to take Aspirin 75mg (1 Tablet) after food.',
            icon: '/logo.svg'
          });
        }
      });
    }
    setNotificationBanner('Scheduled Reminder Alarm: Take Aspirin 75mg (1 Tablet) after food per prescription.');
  };

  // Calculate overall adherence
  const totalSlotsToday = medicines.reduce((acc, m) => acc + (m.timings?.length || 0), 0);
  const takenSlotsToday = medicines.reduce((acc, m) => acc + (m.timings?.filter(t => t.takenToday).length || 0), 0);
  const adherencePercent = totalSlotsToday > 0 ? Math.round((takenSlotsToday / totalSlotsToday) * 100) : 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-700 mb-2">
            <Bell className="w-4 h-4 text-teal-600" />
            <span>Prescription Schedule & Clinic Appointments</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Medicine & Doctor Appointment Reminders
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily medications according to your doctor's exact prescription and keep scheduled clinic visit dates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestNotification}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition shadow-sm ${
            isRingingAlarm
              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 animate-pulse shadow-rose-600/30 ring-2 ring-rose-400'
              : 'bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700'
          }`}
          title="Play audible reminder alarm chime"
        >
          {isRingingAlarm ? (
            <>
              <VolumeX className="w-4 h-4 text-white" />
              <span>Stop Alarm (Ringing...)</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4 text-teal-600" />
              <span>Test Reminder Alarm</span>
            </>
          )}
        </button>
      </div>

      {/* Simulated Live Alert Banner with Audio Indicator */}
      {notificationBanner && (
        <div className={`rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 animate-slide-up ${
          isRingingAlarm
            ? 'bg-gradient-to-r from-teal-700 via-teal-600 to-indigo-700 text-white ring-2 ring-teal-400'
            : 'bg-teal-600 text-white'
        }`}>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <Bell className={`w-5 h-5 shrink-0 ${isRingingAlarm ? 'animate-bounce text-amber-300' : ''}`} />
            <span>{notificationBanner}</span>
            {isRingingAlarm && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wide">
                <Volume2 className="w-3 h-3 text-amber-300 animate-pulse" />
                Sound Playing
              </span>
            )}
          </div>
          <button
            onClick={() => {
              stopAlarmSound();
              setIsRingingAlarm(false);
              setNotificationBanner(null);
            }}
            className="text-white hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0"
          >
            {isRingingAlarm ? 'Stop Sound & Dismiss' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Daily Adherence Progress Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-black text-lg">
            {adherencePercent}%
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Today's Medicine Adherence</div>
            <div className="text-[11px] text-slate-500">
              {takenSlotsToday} of {totalSlotsToday} doses marked as taken
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-black text-lg">
            {medicines.length}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Active Prescriptions</div>
            <div className="text-[11px] text-slate-500">Following clinical schedule</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-black text-lg">
            {appointments.length}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Upcoming Appointments</div>
            <div className="text-[11px] text-slate-500">Scheduled clinic follow-ups</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Daily Medicine Reminders */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              Daily Prescribed Medicines
            </h2>
            <p className="text-xs text-slate-500">
              Follow exact dosage timing and food instructions. Tap the checkbox when taken.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddMedOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicines.map((med) => (
            <div
              key={med.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {med.medicineName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-bold text-teal-600">{med.dosage}</span>
                      <span>•</span>
                      <span className="capitalize">{med.instructions.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMed(med.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    title="Remove reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 mt-1">
                  Prescribed by: {med.doctorPrescribedBy || 'Attending Physician'}
                </div>
              </div>

              {/* Time Slots Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                {med.timings?.map((slot, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {slot.timeSlot === 'morning' ? (
                        <Sun className="w-4 h-4 text-amber-500" />
                      ) : slot.timeSlot === 'afternoon' ? (
                        <Sunset className="w-4 h-4 text-orange-500" />
                      ) : (
                        <Moon className="w-4 h-4 text-indigo-500" />
                      )}
                      <div>
                        <span className="font-bold capitalize text-slate-800 dark:text-slate-200">
                          {slot.timeSlot}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                          ({slot.time})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleTaken(med.id, sIdx)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                        slot.takenToday
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                      }`}
                    >
                      {slot.takenToday ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Taken</span>
                        </>
                      ) : (
                        <span>Mark Taken</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {medicines.length === 0 && (
            <div className="col-span-2 text-center p-8 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300">
              No medicine reminders configured yet. Tap "Add Medicine" above to create one.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Doctor Appointment Reminders */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Doctor & Clinic Appointments
            </h2>
            <p className="text-xs text-slate-500">
              Follow-up consultations, vaccination schedules, and diagnostic reviews.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddAptOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Schedule Appointment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    {apt.department}
                  </span>
                  <button
                    onClick={() => handleDeleteApt(apt.id)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {apt.doctorOrClinic}
                </h3>

                <div className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(apt.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} at {apt.time}</span>
                </div>

                <div className="text-xs text-slate-500">
                  Venue: {apt.location}
                </div>

                {apt.preparationNotes && apt.preparationNotes.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>Checklist:</strong>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[10px]">
                      {apt.preparationNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="col-span-3 text-center p-8 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300">
              No upcoming appointments. Tap "Schedule Appointment" to add one.
            </div>
          )}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {isAddMedOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                Add Medicine Reminder
              </h3>
              <button onClick={() => setIsAddMedOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMed} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Amlodipine, Metformin, Paracetamol"
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet (5mg)"
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Food Instruction
                  </label>
                  <select
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value as any)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="after_food">After Food (खाने के बाद)</option>
                    <option value="before_food">Before Food (खाने से पहले)</option>
                    <option value="with_food">With Food (खाने के साथ)</option>
                    <option value="empty_stomach">Empty Stomach (खाली पेट)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Daily Timing Slots
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timeMorning}
                      onChange={(e) => setTimeMorning(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span>Morning (08:30 AM)</span>
                  </label>
                  <label className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timeNight}
                      onChange={(e) => setTimeNight(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span>Night (08:30 PM)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Prescribed By (Doctor / Clinic)
                </label>
                <input
                  type="text"
                  value={doctorPrescribed}
                  onChange={(e) => setDoctorPrescribed(e.target.value)}
                  placeholder="e.g. Dr. Suresh Mehta (PHC Barabanki)"
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {isAddAptOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Schedule Doctor Appointment
              </h3>
              <button onClick={() => setIsAddAptOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApt} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Doctor or Hospital Name *
                </label>
                <input
                  type="text"
                  value={aptDoctor}
                  onChange={(e) => setAptDoctor(e.target.value)}
                  placeholder="e.g. Dr. Suresh Mehta / District Hospital"
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={aptDept}
                    onChange={(e) => setAptDept(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Venue / Room
                  </label>
                  <input
                    type="text"
                    value={aptLocation}
                    onChange={(e) => setAptLocation(e.target.value)}
                    placeholder="Room 4 / OPD Hall"
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Preparation Checklist
                </label>
                <input
                  type="text"
                  value={aptPrep}
                  onChange={(e) => setAptPrep(e.target.value)}
                  placeholder="e.g. Fasting for blood test, Bring previous reports"
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAptOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
