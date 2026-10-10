import React, { useState } from 'react';
import {
  verifiedDoctorsList,
  getStoredAppointments,
  saveAppointment,
  cancelAppointment
} from '../data/doctorAppointmentData';
import { getTranslation } from '../i18n/translations';
import { Doctor, BookedAppointment } from '../types';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Video,
  User,
  Building2,
  Stethoscope,
  Star,
  Printer,
  X,
  ArrowRight,
  Phone,
  ShieldCheck,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface DoctorAppointmentProps {
  currentLanguage: string;
  initialHospitalFilter?: string;
  initialSpecialtyFilter?: string;
}

export const OnlineDoctorAppointmentPage: React.FC<DoctorAppointmentProps> = ({
  currentLanguage,
  initialHospitalFilter,
  initialSpecialtyFilter,
}) => {
  const t = getTranslation(currentLanguage);
  // Tabs: 'search' | 'my-bookings'
  const [activeSubTab, setActiveSubTab] = useState<'search' | 'my-bookings'>('search');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>(initialSpecialtyFilter || 'All');
  const [consultType, setConsultType] = useState<'all' | 'in_person' | 'teleconsult'>('all');

  // Date selection for slot booking
  const today = new Date();
  const nextDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const [selectedDate, setSelectedDate] = useState<string>(nextDates[0].dateStr);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Booking Modal Form State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('Ramesh Patel');
  const [patientPhone, setPatientPhone] = useState('+91 98765 43210');
  const [patientAge, setPatientAge] = useState<number | ''>(54);
  const [patientGender, setPatientGender] = useState('Male');
  const [abhaId, setAbhaId] = useState('91-4521-8842-1092');
  const [reasonForVisit, setReasonForVisit] = useState('Routine consultation & symptom review');
  const [bookingConsultType, setBookingConsultType] = useState<'In-Person OPD' | 'Video Teleconsult (eSanjeevani)'>('In-Person OPD');

  // Booked Appointments list state
  const [myBookings, setMyBookings] = useState<BookedAppointment[]>(() => getStoredAppointments());
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<BookedAppointment | null>(null);

  // Departments list
  const departments = [
    'All',
    'General Medicine & Diabetology',
    'Cardiology & Chest Medicine',
    'Obstetrics & Gynecology (Maternal Health)',
    'Pediatrics & Child Health',
    'General Surgery & Wound Care',
    'Pulmonology & Respiratory Medicine',
    'Orthopedics & Joint Clinic'
  ];

  // Filter Doctors
  const filteredDoctors = verifiedDoctorsList.filter((doc) => {
    const matchesDept = selectedDept === 'All' || doc.department.includes(selectedDept) || selectedDept.includes(doc.department);
    const matchesConsult =
      consultType === 'all' ||
      (consultType === 'teleconsult' && doc.isTeleconsultAvailable) ||
      (consultType === 'in_person' && doc.isInPersonAvailable);
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      doc.name.toLowerCase().includes(q) ||
      doc.department.toLowerCase().includes(q) ||
      doc.hospitalName.toLowerCase().includes(q) ||
      doc.city.toLowerCase().includes(q) ||
      doc.languages.some((l) => l.toLowerCase().includes(q));

    const matchesHospital = !initialHospitalFilter || doc.hospitalName.toLowerCase().includes(initialHospitalFilter.toLowerCase());

    return matchesDept && matchesConsult && matchesQuery && matchesHospital;
  });

  const handleOpenBookingModal = (doc: Doctor, slot: string) => {
    setSelectedDoctor(doc);
    setSelectedTimeSlot(slot);
    setBookingConsultType(doc.isInPersonAvailable ? 'In-Person OPD' : 'Video Teleconsult (eSanjeevani)');
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedTimeSlot) return;

    const tokenRand = Math.floor(10 + Math.random() * 90);
    const newBooking: BookedAppointment = {
      id: `BK-${Date.now()}`,
      bookingRef: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorDepartment: selectedDoctor.department,
      doctorQualification: selectedDoctor.qualification,
      hospitalName: selectedDoctor.hospitalName,
      hospitalAddress: `${selectedDoctor.hospitalName}, ${selectedDoctor.city}`,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: Number(patientAge) || 30,
      patientGender,
      abhaId: abhaId.trim() || undefined,
      appointmentDate: selectedDate,
      appointmentTime: selectedTimeSlot,
      consultationType: bookingConsultType,
      reasonForVisit: reasonForVisit.trim(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      tokenNumber: `OPD-${selectedDoctor.department.slice(0, 3).toUpperCase()}-${tokenRand}`,
      notes: 'Please arrive 15 minutes before slot with previous records & photo ID.'
    };

    const updated = saveAppointment(newBooking);
    setMyBookings(updated);
    setLastConfirmedBooking(newBooking);
    setIsBookingModalOpen(false);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this doctor appointment?')) {
      const updated = cancelAppointment(bookingId);
      setMyBookings(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-slate-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>Ayushman OPD & eSanjeevani Teleconsultation Booking</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.onlineDoctorAppt}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Search verified Government Hospital and Primary Health Centre doctors, choose convenient time slots, and receive instant digital appointment slips.
          </p>

          {/* Sub Tabs */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('search')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeSubTab === 'search'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find & Book Doctors</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('my-bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeSubTab === 'my-bookings'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>My Appointments ({myBookings.filter((b) => b.status === 'confirmed').length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Slip Banner if newly booked */}
      {lastConfirmedBooking && (
        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 shadow-md space-y-4 animate-slide-up">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
                  Booking Confirmed
                </span>
                <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
                  Appointment Confirmed for {lastConfirmedBooking.patientName} (Token: {lastConfirmedBooking.tokenNumber})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Appointment Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setLastConfirmedBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-emerald-200/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Doctor</span>
              <strong className="text-slate-900 dark:text-white">{lastConfirmedBooking.doctorName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Date & Time</span>
              <strong className="text-slate-900 dark:text-white">
                {lastConfirmedBooking.appointmentDate} at {lastConfirmedBooking.appointmentTime}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Facility</span>
              <strong className="text-slate-900 dark:text-white">{lastConfirmedBooking.hospitalName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Booking ID</span>
              <strong className="font-mono text-teal-600">{lastConfirmedBooking.bookingRef}</strong>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: SEARCH & BOOK DOCTORS */}
      {activeSubTab === 'search' && (
        <div className="space-y-6">
          {/* Search, Department & Consultation Mode Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctor name, hospital, or city..."
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Department Dropdown */}
            <div className="md:col-span-4">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'All Specialties / Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Switcher */}
            <div className="md:col-span-3 flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setConsultType('all')}
                className={`flex-1 py-2 rounded-xl transition ${
                  consultType === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setConsultType('in_person')}
                className={`flex-1 py-2 rounded-xl transition ${
                  consultType === 'in_person' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                In-Person
              </button>
              <button
                type="button"
                onClick={() => setConsultType('teleconsult')}
                className={`flex-1 py-2 rounded-xl transition ${
                  consultType === 'teleconsult' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm' : 'text-slate-500'
                }`}
              >
                Video Tele
              </button>
            </div>
          </div>

          {/* Date Picker Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Select Appointment Date / दिनांक चुनें:
              </span>
              <span className="text-teal-600">Free Government OPD (₹0)</span>
            </div>

            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
              {nextDates.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center min-w-[100px] border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[10px] uppercase opacity-80">{item.dayName}</span>
                    <span className="text-sm font-black">{item.formatted}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doctor Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Doctor Info Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold truncate">
                        {doc.department}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {doc.qualification} • {doc.experienceYears} Yrs Exp.
                      </p>
                    </div>
                  </div>

                  {/* Hospital & Location */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{doc.hospitalName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>City: {doc.city}</span>
                      <span>Languages: {doc.languages.join(', ')}</span>
                    </div>
                  </div>

                  {/* Consultation Fee & Modes */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px]">
                        Free OPD (₹0)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                      {doc.isInPersonAvailable && <span>• In-Person OPD</span>}
                      {doc.isTeleconsultAvailable && <span className="text-teal-600 font-bold">• eSanjeevani Video</span>}
                    </div>
                  </div>

                  {/* Time Slots Picker */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Available Slots ({selectedDate}):</span>
                      <span className="text-teal-600">Select one</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {doc.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleOpenBookingModal(doc, slot)}
                          className="px-2 py-2 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-600 hover:text-white transition text-center"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleOpenBookingModal(doc, doc.availableSlots[0])}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Book Earliest Slot ({doc.availableSlots[0]})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MY BOOKED APPOINTMENTS */}
      {activeSubTab === 'my-bookings' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              My Appointments & Consultation History
            </h3>
            <button
              type="button"
              onClick={() => setActiveSubTab('search')}
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              <span>+ Book Another Doctor</span>
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Appointments Booked Yet</h4>
              <p className="text-xs text-slate-500">
                You have not booked any hospital or doctor OPD slots yet.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('search')}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Search Doctors Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm space-y-4 transition ${
                    b.status === 'cancelled'
                      ? 'border-slate-200 opacity-60'
                      : 'border-slate-200 dark:border-slate-800 hover:border-teal-500'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="text-xs font-mono text-slate-400">Ref: {b.bookingRef}</span>
                        <span className="text-xs font-mono font-bold text-teal-600">
                          Token: {b.tokenNumber}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {b.doctorName}
                      </h4>
                      <p className="text-xs text-teal-600 font-semibold">{b.doctorDepartment}</p>
                      <p className="text-xs text-slate-500">{b.hospitalName}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {b.appointmentDate}
                      </div>
                      <div className="text-xs text-teal-600 font-extrabold">{b.appointmentTime}</div>
                      <div className="text-[11px] text-slate-400">{b.consultationType}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between text-xs gap-2">
                    <div>
                      <span className="text-slate-400">Patient: </span>
                      <strong>{b.patientName}</strong> ({b.patientGender}, {b.patientAge}y)
                    </div>
                    <div>
                      <span className="text-slate-400">Reason: </span>
                      <span>{b.reasonForVisit}</span>
                    </div>
                    {b.notes && (
                      <div className="w-full text-[11px] text-slate-500 pt-1">
                        📌 {b.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {b.status === 'confirmed' && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Slip</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Appointment</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {isBookingModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-slide-up">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold">Book OPD Appointment Slot</h3>
                <p className="text-xs text-slate-400">
                  {selectedDoctor.name} • {selectedDoctor.department}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              {/* Slot Summary */}
              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-800 dark:text-teal-300">
                    Selected Slot
                  </span>
                  <div className="font-bold text-sm text-teal-950 dark:text-teal-100">
                    {selectedDate} at {selectedTimeSlot}
                  </div>
                  <div className="text-[11px] text-teal-700 dark:text-teal-400">
                    {selectedDoctor.hospitalName}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold text-xs">
                  Free OPD
                </span>
              </div>

              {/* Consultation Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingConsultType('In-Person OPD')}
                    className={`p-2.5 rounded-xl font-bold transition text-center ${
                      bookingConsultType === 'In-Person OPD'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    In-Person Hospital OPD
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingConsultType('Video Teleconsult (eSanjeevani)')}
                    className={`p-2.5 rounded-xl font-bold transition text-center ${
                      bookingConsultType === 'Video Teleconsult (eSanjeevani)'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Video Teleconsult
                  </button>
                </div>
              </div>

              {/* Patient Name & Mobile */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gender *
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* ABHA ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ABHA ID (Ayushman Bharat Health Account - Optional)
                </label>
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  placeholder="e.g. 91-4521-8842-1092"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Visit / Primary Symptoms
                </label>
                <textarea
                  rows={2}
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  placeholder="e.g. Follow-up after fever, persistent cough, blood pressure review..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-md"
                >
                  Confirm & Generate Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
