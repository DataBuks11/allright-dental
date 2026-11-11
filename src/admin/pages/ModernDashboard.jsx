import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
import {
  FaCalendarCheck,
  FaUserFriends,
  FaMicrophoneAlt,
  FaShieldAlt,
  FaClock,
  FaTooth,
  FaDollarSign,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileMedical,
  FaUserPlus
} from "react-icons/fa";

const ModernDashboard = () => {
  const { user, role, hasPermission } = useAuth();
  const [patientCount, setPatientCount] = useState(3240);
  const [todayAppointments, setTodayAppointments] = useState([
    { id: "APT-101", time: "10:00 AM", patient: "Michael Scott", procedure: "Routine Cleaning & Exam", status: "Checked In", insurance: "Delta Dental PPO", chair: "Operatory 1" },
    { id: "APT-102", time: "11:15 AM", patient: "Sarah Connor", procedure: "Porcelain Crown Fit", status: "In Treatment", insurance: "MetLife Dental", chair: "Operatory 2" },
    { id: "APT-103", time: "01:30 PM", patient: "Piyush Junghare", procedure: "Tooth Pain Emergency", status: "Confirmed", insurance: "Delta Dental PPO", chair: "Operatory 1" },
    { id: "APT-104", time: "02:45 PM", patient: "David Miller", procedure: "Root Canal Therapy (D3330)", status: "Pending Intake", insurance: "Cigna Dental", chair: "Operatory 3" },
    { id: "APT-105", time: "04:00 PM", patient: "Emily Watson", procedure: "Deep Scaling & Planing", status: "Confirmed", insurance: "Guardian Dental", chair: "Operatory 2" }
  ]);

  // Load patient count from JSON if available
  useEffect(() => {
    fetch("/allright_patients.json")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPatientCount(data.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-400/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-teal-300 mb-3 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Practice Operating System 2.0 • HIPAA Compliant
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Doctor Shalini"}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
            AllRight Dental practice schedule is active for Morrisville, PA. 
            AI Receptionist (Sarah) is managing calls 24/7 with zero dropped patients.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Link
              to="/admin/insurance-verifier"
              className="bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <FaShieldAlt className="text-xs" />
              <span>Verify US Dental Insurance</span>
            </Link>
            <Link
              to="/admin/schedule"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all border border-white/20 flex items-center gap-1.5"
            >
              <FaClock className="text-xs" />
              <span>View Doctor Shalini Schedule</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Visits</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaCalendarCheck className="text-base" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">8 Visits</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">92% Fill</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lead: Doctor Shalini Mandapatti</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Master Patients</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FaUserFriends className="text-base" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{patientCount.toLocaleString()}</span>
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Synchronized</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Full Dental History & Insurance</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Receptionist (Sarah)</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <FaMicrophoneAlt className="text-base" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">142 Calls</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">98.4% Auto</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Zero Staff Interruption</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Insurance Cleared</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FaShieldAlt className="text-base" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">100% Real-Time</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">EDI 270/271</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Direct US Clearinghouse API</p>
        </div>
      </div>

      {/* Main Content Split: Today's Schedule & Clinic Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Patient Schedule (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FaCalendarCheck className="text-blue-600" />
                <span>Today's Clinical Roster</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Doctor Shalini Mandapatti • Operatories 1 & 2</p>
            </div>
            <Link
              to="/admin/appointments"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Manage All</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-14 text-center py-1 px-1.5 bg-blue-50 text-blue-700 font-mono font-bold text-xs rounded-lg border border-blue-100">
                    {apt.time}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{apt.patient}</span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                        {apt.insurance}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500">{apt.procedure} • <span className="font-semibold text-slate-700">{apt.chair}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    apt.status === "Checked In"
                      ? "bg-emerald-100 text-emerald-800"
                      : apt.status === "In Treatment"
                      ? "bg-blue-100 text-blue-800 animate-pulse"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {apt.status}
                  </span>
                  <Link
                    to="/admin/insurance-verifier"
                    className="text-[11px] font-semibold text-teal-700 hover:bg-teal-50 px-2 py-1 rounded border border-teal-200 transition-colors"
                  >
                    Verify
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Doctor Shalini Practice Schedule Rules & Quick Actions */}
        <div className="space-y-5">
          {/* Practice Hours Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
              <FaClock className="text-blue-600" />
              <span>Doctor Shalini Clinic Hours</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <span className="font-semibold text-emerald-900">Wednesday</span>
                <span className="font-mono text-emerald-800">10:00 AM – 5:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <span className="font-semibold text-emerald-900">Thursday</span>
                <span className="font-mono text-emerald-800">10:00 AM – 5:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <span className="font-semibold text-emerald-900">Friday</span>
                <span className="font-mono text-emerald-800">10:00 AM – 5:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 border border-amber-200">
                <span className="font-semibold text-amber-900">Saturday (Half Day)</span>
                <span className="font-mono text-amber-800">9:00 AM – 1:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 text-slate-500">
                <span>Sun, Mon, Tue</span>
                <span className="font-semibold uppercase text-[10px]">Closed (Rest / Surgery)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-tight">
              <b>AI Slot Hierarchy:</b> Wed/Thu Morning → Wed/Thu Afternoon → Fri Morning → Fri Evening (Reserved last).
            </div>
          </div>

          {/* Quick Tool Links */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-1.5">
              <FaShieldAlt /> Rapid Administrative Tools
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/insurance-verifier"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium text-slate-200"
              >
                <span>EDI 270/271 Real-Time Verifier</span>
                <FaArrowRight className="text-[10px] text-teal-400" />
              </Link>
              <Link
                to="/admin/patients-directory"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium text-slate-200"
              >
                <span>Search 3,200+ Patient Records</span>
                <FaArrowRight className="text-[10px] text-teal-400" />
              </Link>
              <Link
                to="/admin/voice-receptionist"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium text-slate-200"
              >
                <span>AI Voice Receptionist Console</span>
                <FaArrowRight className="text-[10px] text-teal-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;

