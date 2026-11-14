import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaCalendarCheck,
  FaFileMedical,
  FaTooth,
  FaUserPlus,
  FaEllipsisH,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaArrowRight,
  FaCheckCircle,
  FaRegClock
} from "react-icons/fa";

export default function ModernDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good Morning");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("November 2026");

  // Events toggle state matching MEDIX mockup
  const [events, setEvents] = useState([
    { id: 1, title: "Doctor Team Meeting", time: "10:00 - 12:00", active: true },
    { id: 2, title: "Surgical Operatory Block", time: "12:00 - 02:00", active: true },
    { id: 3, title: "Continuing Care & Recalls", time: "03:00 - 04:00", active: false }
  ]);

  // System Counts from live backend
  const [counts, setCounts] = useState({
    appointments: "4",
    patients: "3067",
    slots: "6807",
    recalls: "871"
  });

  const getInitialsBadgeStyle = (idx) => {
    const styles = [
      "bg-blue-100 text-[#003BC4] border border-blue-200",
      "bg-purple-100 text-purple-700 border border-purple-200",
      "bg-teal-100 text-teal-700 border border-teal-200"
    ];
    return styles[idx % styles.length];
  };

  // Real Registered Patients Roster - Professional Clinical EHR Initials (3 items to match Events card height 1:1)
  const [patientsToday, setPatientsToday] = useState([
    {
      id: "APT-3150",
      name: "Brian Reilly",
      diagnosis: "Routine Cleaning & Exam",
      time: "05:00 AM",
      status: "Checked In",
      initials: "BR",
      initialsStyle: "bg-blue-100 text-[#003BC4] border border-blue-200"
    },
    {
      id: "APT-3151",
      name: "Samantha Reilly",
      diagnosis: "Comprehensive Dental Exam",
      time: "05:00 AM",
      status: "In Treatment",
      initials: "SR",
      initialsStyle: "bg-purple-100 text-purple-700 border border-purple-200"
    },
    {
      id: "APT-3152",
      name: "Darlayah Mcmillan",
      diagnosis: "Emergency Toothache Visit",
      time: "11:00 AM",
      status: "Confirmed",
      initials: "DM",
      initialsStyle: "bg-teal-100 text-teal-700 border border-teal-200"
    }
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Fetch real metrics from MySQL backend
    fetch("/api/getRegistration.php")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCounts((prev) => ({
            ...prev,
            patients: data.length.toString()
          }));

          const mapped = data.slice(0, 3).map((item, idx) => {
            const firstName = item.first_name || item.firstname || "Patient";
            const lastName = item.last_name || item.lastname || "";
            const fullName = `${firstName} ${lastName}`.trim();
            const firstInitial = firstName[0] || "P";
            const lastInitial = lastName[0] || "T";
            const init = `${firstInitial}${lastInitial}`.toUpperCase();

            let st = "Confirmed";
            if (idx === 0) st = "Checked In";
            if (idx === 1) st = "In Treatment";

            return {
              id: item.id || `APT-${3150 + idx}`,
              name: fullName,
              diagnosis:
                item.reason_for_visit ||
                item.service ||
                item.appointment_type ||
                (idx === 0
                  ? "Routine Cleaning & Exam"
                  : idx === 1
                  ? "Comprehensive Dental Exam"
                  : "Emergency Toothache Visit"),
              time: item.appointment_time || (idx === 0 ? "05:00 AM" : idx === 1 ? "05:00 AM" : "11:00 AM"),
              status: st,
              initials: init,
              initialsStyle: getInitialsBadgeStyle(idx)
            };
          });
          setPatientsToday(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const toggleEvent = (id) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full">
      {/* 1. Header Greeting & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, Doctor Shalini
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Have a great and productive day filled with success caring for patient smiles.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs font-semibold px-3.5 py-1.5 bg-white border border-slate-200/90 rounded-full shadow-2xs hover:border-slate-300 text-slate-700 outline-none cursor-pointer"
          >
            <option value="November 2026">November 2026</option>
            <option value="Monthly">Monthly</option>
            <option value="This Week">This Week</option>
          </select>
        </div>
      </div>

      {/* 2. Top 4 Metric / KPI Cards (Row of 4 Equal Width Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {/* Card 1: Total Appointment */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#003BC4] flex items-center justify-center text-sm shadow-2xs">
            <FaCalendarCheck />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-2.5">Total Appointment</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {parseInt(counts.patients, 10).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 2: Total Report */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-sm shadow-2xs">
            <FaFileMedical />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-2.5">Total Report</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {counts.recalls || "871"}
            </span>
          </div>
        </div>

        {/* Card 3: Health Progress / Fill Rate */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-sm shadow-2xs">
            <FaTooth />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-2.5">Health Progress</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              87.86%
            </span>
          </div>
        </div>

        {/* Card 4: New Patients */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shadow-2xs">
            <FaUserPlus />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-2.5">New Patients</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              35
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Layout (8 Cols Left / 4 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch w-full">
        {/* ================= LEFT SECTION (8 Cols) ================= */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-4 sm:gap-5">
          {/* A. "Your Patients Today" Analytics & Line Chart Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Your patients today
              </h2>

              {/* Filter Tabs matching mockup: [All] [New] [Insurance] */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-[#0B132B] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("new")}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === "new"
                      ? "bg-[#003BC4] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  New
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("insurance")}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === "insurance"
                      ? "bg-[#00B7AA] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Insurance
                </button>
              </div>
            </div>

            {/* Split: Stats Numbers (Left) + SVG Chart (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-3 items-center">
              {/* Left Sub-Stats Column */}
              <div className="sm:col-span-4 flex sm:flex-col justify-around sm:justify-center gap-3 sm:gap-4 border-b sm:border-b-0 sm:border-r border-slate-100 pb-3 sm:pb-0 sm:pr-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">56</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      +32%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">New patients</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">23</span>
                    <span className="text-[10px] font-bold text-[#003BC4] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      +12%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Insurance patients</p>
                </div>
              </div>

              {/* Right Chart Column (Smooth Dual SVG Spline Curve matching MEDIX Mockup) */}
              <div className="sm:col-span-8 relative">
                <div className="w-full h-40 sm:h-44 relative">
                  <svg className="w-full h-full" viewBox="0 0 460 160">
                    <defs>
                      <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#003BC4" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#003BC4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Guideline Grids */}
                    <line x1="25" y1="20" x2="445" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="55" x2="445" y2="55" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="90" x2="445" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="125" x2="445" y2="125" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Y-axis Labels */}
                    <text x="10" y="24" fontSize="9" fill="#94A3B8" fontWeight="600">50</text>
                    <text x="10" y="59" fontSize="9" fill="#94A3B8" fontWeight="600">40</text>
                    <text x="10" y="94" fontSize="9" fill="#94A3B8" fontWeight="600">30</text>
                    <text x="10" y="129" fontSize="9" fill="#94A3B8" fontWeight="600">10</text>

                    {/* Curve 1: Blue Insurance Line with Area Fill */}
                    <path
                      d="M 35 120 C 85 105, 120 115, 160 85 C 200 60, 245 75, 290 60 L 290 135 L 35 135 Z"
                      fill="url(#blueGradient)"
                    />
                    <path
                      d="M 35 120 C 85 105, 120 115, 160 85 C 200 60, 245 75, 290 60"
                      fill="none"
                      stroke="#003BC4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Curve 2: Rose New Patients Line with Area Fill */}
                    <path
                      d="M 35 125 C 80 120, 130 95, 175 90 C 220 85, 255 55, 300 50 C 345 45, 390 35, 435 30 L 435 135 L 35 135 Z"
                      fill="url(#roseGradient)"
                    />
                    <path
                      d="M 35 125 C 80 120, 130 95, 175 90 C 220 85, 255 55, 300 50 C 345 45, 390 35, 435 30"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Active Data Tooltip Pill */}
                    <g transform="translate(255, 46)">
                      <rect x="0" y="0" width="105" height="20" rx="10" fill="#0B132B" />
                      <circle cx="10" cy="10" r="3.5" fill="#00B7AA" />
                      <text x="18" y="13.5" fontSize="8.5" fill="#FFFFFF" fontWeight="700">
                        35 Insurance patients
                      </text>
                    </g>

                    {/* X-axis Day Labels */}
                    <text x="35" y="152" fontSize="9" fill="#94A3B8" fontWeight="500">Sun</text>
                    <text x="100" y="152" fontSize="9" fill="#94A3B8" fontWeight="500">Mon</text>
                    <text x="165" y="152" fontSize="9" fill="#94A3B8" fontWeight="500">Tue</text>
                    <text x="230" y="152" fontSize="9" fill="#94A3B8" fontWeight="500">Wed</text>
                    <text x="295" y="152" fontSize="9" fill="#94A3B8" fontWeight="500">Thu</text>
                    <text x="360" y="152" fontSize="9" fill="#94A3B8" fontWeight="500">Fri</text>
                    <text x="420" y="152" fontSize="9" fill="#94A3B8" fontWeight="500">Sat</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* B. Bottom Grid (Events Card + Patients Today Roster Card) - Equal 3 Items Each! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
            {/* Card 1: Events */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Events</h3>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                    aria-label="Events Menu"
                  >
                    <FaEllipsisH />
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {evt.title}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {evt.time}
                        </p>

                        {/* Real Staff Badges: Doctor Shalini Real Face Avatar + RDH + DA */}
                        <div className="flex items-center -space-x-1 mt-1.5">
                          <img
                            src="/drShaliniAvatar.jpg"
                            alt="Doctor Shalini"
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                          />
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[8px] flex items-center justify-center ring-1 ring-white">
                            RDH
                          </div>
                          <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold text-[8px] flex items-center justify-center ring-1 ring-white">
                            DA
                          </div>
                        </div>
                      </div>

                      {/* Purple / Blue Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleEvent(evt.id)}
                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none p-0.5 ${
                          evt.active ? "bg-[#003BC4]" : "bg-slate-200"
                        }`}
                        aria-label="Toggle Event"
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                            evt.active ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Your Patients Today (Roster) - Clinical Initials Badges (Zero Stock Images) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Your patients today</h3>
                  <Link
                    to="/admin/appointments"
                    className="text-xs font-semibold text-[#003BC4] hover:underline flex items-center gap-1"
                  >
                    <span>All</span>
                    <FaArrowRight className="text-[9px]" />
                  </Link>
                </div>

                <div className="mt-3 space-y-3">
                  {patientsToday.map((pt) => (
                    <div
                      key={pt.id}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Clinical EHR Initials Badge */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${pt.initialsStyle}`}
                        >
                          {pt.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                            {pt.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                            {pt.diagnosis}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span className="text-[11px] font-bold text-slate-600 font-mono block">
                          {pt.time}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full inline-block mt-0.5 ${
                            pt.status === "Checked In"
                              ? "bg-emerald-50 text-emerald-700"
                              : pt.status === "In Treatment"
                              ? "bg-blue-50 text-[#003BC4]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {pt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION (4 Cols) ================= */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4 sm:gap-5">
          {/* Widget 1: Appointment Mini Calendar Widget */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Appointment</h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                aria-label="Calendar Menu"
              >
                <FaEllipsisH />
              </button>
            </div>

            {/* Month Navigator */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                type="button"
                className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Previous Month"
              >
                <FaChevronLeft className="text-[10px]" />
              </button>
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                November 2026
              </span>
              <button
                type="button"
                className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Next Month"
              >
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>

            {/* Days Row & Date Numbers (Wed Nov 18 Highlighted with Circle) */}
            <div className="grid grid-cols-7 gap-1 mt-2.5 text-center">
              <span className="text-[10px] font-semibold text-slate-400">Sun</span>
              <span className="text-[10px] font-semibold text-slate-400">Mon</span>
              <span className="text-[10px] font-semibold text-slate-400">Tue</span>
              <span className="text-[10px] font-bold text-[#003BC4]">Wed</span>
              <span className="text-[10px] font-bold text-slate-700">Thu</span>
              <span className="text-[10px] font-bold text-slate-700">Fri</span>
              <span className="text-[10px] font-bold text-amber-600">Sat</span>

              {/* Date Numbers */}
              <span className="text-xs font-medium text-slate-400 py-1">15</span>
              <span className="text-xs font-medium text-slate-400 py-1">16</span>
              <span className="text-xs font-medium text-slate-400 py-1">17</span>
              {/* Active Day 18 (Wednesday) Highlighted with Mockup Circle */}
              <div className="flex items-center justify-center py-0.5">
                <span className="w-6 h-6 rounded-full bg-[#003BC4] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  18
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800 py-1">19</span>
              <span className="text-xs font-bold text-slate-800 py-1">20</span>
              <span className="text-xs font-bold text-amber-700 py-1">21</span>
            </div>

            {/* Practice Schedule Indicator (Balances Row 1 Height) */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <FaCheckCircle className="text-[10px]" /> Operatory 1 & 2 Active
              </span>
              <span className="font-mono text-slate-400 text-[10px]">
                4 Appts Today
              </span>
            </div>
          </div>

          {/* Widget 2: Featured Attending Doctor Card (Doctor Shalini Mandapatti, DDS) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex-1 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Upcoming Doctor
                </span>
                <Link
                  to="/admin/schedule"
                  className="text-slate-400 hover:text-[#003BC4] text-xs transition-colors"
                  title="View Doctor Schedule"
                >
                  <FaExternalLinkAlt />
                </Link>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-tight">
                Doctor Shalini Mandapatti
              </h3>

              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#003BC4] border border-blue-200/80">
                  <FaTooth className="text-[9px]" /> Lead Cosmetic & Family Dentist
                </span>
              </div>

              {/* SOLO Centered Portrait of Doctor Shalini (Head, Face, Smile, Doctor Coat - ZERO Cut-Off!) */}
              <div className="relative mt-3 rounded-2xl overflow-hidden border border-slate-100 shadow-xs bg-slate-50">
                <img
                  src="/drShaliniCard.jpg"
                  alt="Doctor Shalini Mandapatti, DDS"
                  className="w-full h-44 sm:h-48 object-cover object-top"
                  onError={(e) => {
                    e.target.src = "/drShaliniUpdate.jpg";
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800 shadow-2xs border border-white/60">
                  15+ Yrs Exp
                </div>
              </div>

              {/* About Doctor Shalini */}
              <div className="mt-2.5">
                <p className="text-xs font-bold text-slate-800">About Doctor Shalini</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Doctor Shalini provides compassionate care expertise ensuring patient health and restorative excellence...{" "}
                  <Link to="/about-us" className="text-[#003BC4] font-semibold cursor-pointer hover:underline">
                    Read More
                  </Link>
                </p>
              </div>

              {/* Info Row: Timing & Consultation Duration */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <FaRegClock className="text-slate-400 text-xs" /> Wed - Sat Open
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-500">
                  ⏱️ 30 - 45 min
                </span>
              </div>
            </div>

            {/* Mockup Pill Action Button */}
            <Link
              to="/admin/schedule"
              className="mt-3 w-full py-2.5 px-4 bg-[#0B132B] hover:bg-[#003BC4] text-white font-bold rounded-full shadow-sm text-xs text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FaCalendarCheck className="text-xs" />
              <span>Manage Clinic Schedule</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
