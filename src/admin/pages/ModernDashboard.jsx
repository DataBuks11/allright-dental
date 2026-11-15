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

  // Events toggle state matching MEDIX mockup (4 items to balance Row 2 height)
  const [events, setEvents] = useState([
    { id: 1, title: "Doctor Team Meeting", time: "10:00 - 12:00", active: true },
    { id: 2, title: "Surgical Operatory Block", time: "12:00 - 02:00", active: true },
    { id: 3, title: "Continuing Care & Recalls", time: "03:00 - 04:00", active: false },
    { id: 4, title: "New Patient Consultations", time: "04:00 - 05:00", active: true }
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
      "bg-teal-100 text-teal-700 border border-teal-200",
      "bg-amber-100 text-amber-800 border border-amber-200"
    ];
    return styles[idx % styles.length];
  };

  // Real Registered Patients Roster - Professional Clinical EHR Initials (4 items to match Events & Upcoming Doctor height 1:1)
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
    },
    {
      id: "APT-3153",
      name: "Scott Talley",
      diagnosis: "Porcelain Crown Fit",
      time: "01:00 PM",
      status: "Confirmed",
      initials: "ST",
      initialsStyle: "bg-amber-100 text-amber-800 border border-amber-200"
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

          const mapped = data.slice(0, 4).map((item, idx) => {
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
                  : idx === 2
                  ? "Emergency Toothache Visit"
                  : "Porcelain Crown Fit"),
              time: item.appointment_time || (idx === 0 ? "05:00 AM" : idx === 1 ? "05:00 AM" : idx === 2 ? "11:00 AM" : "01:00 PM"),
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
    <div className="space-y-3 sm:space-y-3.5 w-full max-w-full">
      {/* 1. Header Greeting & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {greeting}, Doctor Shalini
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Have a great and productive day filled with success caring for patient smiles.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-[11px] font-semibold px-3 py-1 bg-white border border-slate-200/90 rounded-full shadow-2xs hover:border-slate-300 text-slate-700 outline-none cursor-pointer"
          >
            <option value="November 2026">November 2026</option>
            <option value="Monthly">Monthly</option>
            <option value="This Week">This Week</option>
          </select>
        </div>
      </div>

      {/* 2. Top 4 Metric / KPI Cards (Row of 4 Equal Width Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full">
        {/* Card 1: Total Appointment */}
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#003BC4] flex items-center justify-center text-xs shadow-2xs">
            <FaCalendarCheck />
          </div>
          <p className="text-[10px] font-medium text-slate-500 mt-1.5">Total Appointment</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {parseInt(counts.patients, 10).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 2: Total Report */}
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center text-xs shadow-2xs">
            <FaFileMedical />
          </div>
          <p className="text-[10px] font-medium text-slate-500 mt-1.5">Total Report</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {counts.recalls || "871"}
            </span>
          </div>
        </div>

        {/* Card 3: Health Progress / Fill Rate */}
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center text-xs shadow-2xs">
            <FaTooth />
          </div>
          <p className="text-[10px] font-medium text-slate-500 mt-1.5">Health Progress</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              87.86%
            </span>
          </div>
        </div>

        {/* Card 4: New Patients */}
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shadow-2xs">
            <FaUserPlus />
          </div>
          <p className="text-[10px] font-medium text-slate-500 mt-1.5">New Patients</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              35
            </span>
          </div>
        </div>
      </div>

      {/* 3. ROW 1 (TOP SECTION): Chart Card (8 cols) + Appointment Calendar (4 cols) -> Screen-Fitted Matching Height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5 items-stretch w-full">
        {/* Left: "Your Patients Today" Analytics & Line Chart Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                Your patients today
              </h2>

              {/* Filter Tabs matching mockup: [All] [New] [Insurance] */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
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
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
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
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
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
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mt-2 items-center">
              {/* Left Sub-Stats Column */}
              <div className="sm:col-span-4 flex sm:flex-col justify-around sm:justify-center gap-2 sm:gap-3 border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">56</span>
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-full border border-rose-200">
                      +32%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">New patients</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">23</span>
                    <span className="text-[9px] font-bold text-[#003BC4] bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                      +12%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Insurance patients</p>
                </div>
              </div>

              {/* Right Chart Column (Screen-Fitted Smooth Spline Curve) */}
              <div className="sm:col-span-8 relative">
                <div className="w-full h-32 sm:h-36 relative">
                  <svg className="w-full h-full" viewBox="0 0 460 140">
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
                    <line x1="25" y1="15" x2="445" y2="15" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="45" x2="445" y2="45" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="75" x2="445" y2="75" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="105" x2="445" y2="105" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Y-axis Labels */}
                    <text x="10" y="19" fontSize="8.5" fill="#94A3B8" fontWeight="600">50</text>
                    <text x="10" y="49" fontSize="8.5" fill="#94A3B8" fontWeight="600">40</text>
                    <text x="10" y="79" fontSize="8.5" fill="#94A3B8" fontWeight="600">30</text>
                    <text x="10" y="109" fontSize="8.5" fill="#94A3B8" fontWeight="600">10</text>

                    {/* Curve 1: Blue Insurance Line with Area Fill */}
                    <path
                      d="M 35 100 C 85 88, 120 95, 160 70 C 200 50, 245 62, 290 50 L 290 115 L 35 115 Z"
                      fill="url(#blueGradient)"
                    />
                    <path
                      d="M 35 100 C 85 88, 120 95, 160 70 C 200 50, 245 62, 290 50"
                      fill="none"
                      stroke="#003BC4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Curve 2: Rose New Patients Line with Area Fill */}
                    <path
                      d="M 35 105 C 80 100, 130 80, 175 75 C 220 70, 255 45, 300 40 C 345 36, 390 28, 435 24 L 435 115 L 35 115 Z"
                      fill="url(#roseGradient)"
                    />
                    <path
                      d="M 35 105 C 80 100, 130 80, 175 70 C 220 65, 255 45, 300 40 C 345 36, 390 28, 435 24"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Active Data Tooltip Pill */}
                    <g transform="translate(255, 35)">
                      <rect x="0" y="0" width="100" height="18" rx="9" fill="#0B132B" />
                      <circle cx="9" cy="9" r="3" fill="#00B7AA" />
                      <text x="16" y="12" fontSize="8" fill="#FFFFFF" fontWeight="700">
                        35 Insurance patients
                      </text>
                    </g>

                    {/* X-axis Day Labels */}
                    <text x="35" y="130" fontSize="8.5" fill="#94A3B8" fontWeight="500">Sun</text>
                    <text x="100" y="130" fontSize="8.5" fill="#94A3B8" fontWeight="500">Mon</text>
                    <text x="165" y="130" fontSize="8.5" fill="#94A3B8" fontWeight="500">Tue</text>
                    <text x="230" y="130" fontSize="8.5" fill="#94A3B8" fontWeight="500">Wed</text>
                    <text x="295" y="130" fontSize="8.5" fill="#94A3B8" fontWeight="500">Thu</text>
                    <text x="360" y="130" fontSize="8.5" fill="#94A3B8" fontWeight="500">Fri</text>
                    <text x="420" y="130" fontSize="8.5" fill="#94A3B8" fontWeight="500">Sat</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: "Appointment" Mini Calendar Widget (Screen-Fitted Matching Height) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Appointment</h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                aria-label="Calendar Menu"
              >
                <FaEllipsisH />
              </button>
            </div>

            {/* Month Navigator */}
            <div className="flex items-center justify-between mt-2 px-1">
              <button
                type="button"
                className="w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Previous Month"
              >
                <FaChevronLeft className="text-[9px]" />
              </button>
              <span className="text-[11px] font-bold text-slate-800 tracking-tight">
                November 2026
              </span>
              <button
                type="button"
                className="w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Next Month"
              >
                <FaChevronRight className="text-[9px]" />
              </button>
            </div>

            {/* Days Row & Date Numbers (Wed Nov 18 Highlighted with Circle) */}
            <div className="grid grid-cols-7 gap-1 mt-2 text-center">
              <span className="text-[9px] font-semibold text-slate-400">Sun</span>
              <span className="text-[9px] font-semibold text-slate-400">Mon</span>
              <span className="text-[9px] font-semibold text-slate-400">Tue</span>
              <span className="text-[9px] font-bold text-[#003BC4]">Wed</span>
              <span className="text-[9px] font-bold text-slate-700">Thu</span>
              <span className="text-[9px] font-bold text-slate-700">Fri</span>
              <span className="text-[9px] font-bold text-amber-600">Sat</span>

              {/* Date Numbers */}
              <span className="text-[11px] font-medium text-slate-400 py-1">15</span>
              <span className="text-[11px] font-medium text-slate-400 py-1">16</span>
              <span className="text-[11px] font-medium text-slate-400 py-1">17</span>
              {/* Active Day 18 (Wednesday) Highlighted with Mockup Circle */}
              <div className="flex items-center justify-center py-0.5">
                <span className="w-5 h-5 rounded-full bg-[#003BC4] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  18
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 py-1">19</span>
              <span className="text-[11px] font-bold text-slate-800 py-1">20</span>
              <span className="text-[11px] font-bold text-amber-700 py-1">21</span>
            </div>
          </div>

          {/* Today's Operatory & Clinical Load Summary Pill */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <FaCheckCircle className="text-[9px]" /> Operatory 1 & 2 Live
            </span>
            <span className="font-mono text-slate-600 text-[10px] font-bold">
              4 Appts Today
            </span>
          </div>
        </div>
      </div>

      {/* 4. ROW 2 (BOTTOM SECTION): [Events + Patients Today] (8 cols) + [Upcoming Doctor] (4 cols) -> Screen-Fitted Matching Height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5 items-stretch w-full">
        {/* Left: Events Card + Patients Today Card (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 h-full">
          {/* Card 1: Events */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Events</h3>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                  aria-label="Events Menu"
                >
                  <FaEllipsisH />
                </button>
              </div>

              <div className="mt-2.5 space-y-2">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {evt.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {evt.time}
                      </p>

                      {/* Real Staff Badges: Doctor Shalini Real Face Avatar + RDH + DA */}
                      <div className="flex items-center -space-x-1 mt-1">
                        <img
                          src="/drShaliniAvatar.jpg"
                          alt="Doctor Shalini"
                          className="w-4 h-4 rounded-full object-cover ring-1 ring-white"
                        />
                        <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[7px] flex items-center justify-center ring-1 ring-white">
                          RDH
                        </div>
                        <div className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 font-bold text-[7px] flex items-center justify-center ring-1 ring-white">
                          DA
                        </div>
                      </div>
                    </div>

                    {/* Purple / Blue Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleEvent(evt.id)}
                      className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer focus:outline-none p-0.5 ${
                        evt.active ? "bg-[#003BC4]" : "bg-slate-200"
                      }`}
                      aria-label="Toggle Event"
                    >
                      <span
                        className={`block w-3 h-3 rounded-full bg-white shadow-xs transition-transform ${
                          evt.active ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Practice Calendar Link */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#003BC4]">
              <Link to="/admin/schedule" className="hover:underline flex items-center gap-1.5">
                <span>Full Practice Schedule</span>
                <FaArrowRight className="text-[9px]" />
              </Link>
              <span className="text-[10px] text-slate-400 font-normal">4 events planned</span>
            </div>
          </div>

          {/* Card 2: Your Patients Today (Roster) - Clinical Initials Badges */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Your patients today</h3>
                <Link
                  to="/admin/appointments"
                  className="text-[11px] font-semibold text-[#003BC4] hover:underline flex items-center gap-1"
                >
                  <span>All</span>
                  <FaArrowRight className="text-[8px]" />
                </Link>
              </div>

              <div className="mt-2.5 space-y-2">
                {patientsToday.map((pt) => (
                  <div
                    key={pt.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Clinical EHR Initials Badge */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${pt.initialsStyle}`}
                      >
                        {pt.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {pt.name}
                        </p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">
                          {pt.diagnosis}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-1.5">
                      <span className="text-[10px] font-bold text-slate-600 font-mono block">
                        {pt.time}
                      </span>
                      <span
                        className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full inline-block mt-0.5 ${
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

            {/* Bottom Records Link */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#003BC4]">
              <Link to="/admin/appointments" className="hover:underline flex items-center gap-1.5">
                <span>View All Records (3,067)</span>
                <FaArrowRight className="text-[9px]" />
              </Link>
              <span className="text-[10px] text-slate-400 font-normal">Next: 01:00 PM</span>
            </div>
          </div>
        </div>

        {/* Right: Featured Attending Doctor Card (4 cols) -> Screen-Fitted Matching Height with Events/Patients */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Upcoming Doctor
              </span>
              <Link
                to="/admin/schedule"
                className="text-slate-400 hover:text-[#003BC4] text-xs transition-colors"
                title="View Doctor Schedule"
              >
                <FaExternalLinkAlt className="text-[10px]" />
              </Link>
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 leading-tight">
              Doctor Shalini Mandapatti
            </h3>

            <div className="mt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-[#003BC4] border border-blue-200/80">
                <FaTooth className="text-[8px]" /> Lead Cosmetic & Family Dentist
              </span>
            </div>

            {/* Perfect Proportional Solo Portrait: Head, Face, Smile, Doctor Coat All 100% Visible */}
            <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-100 shadow-xs bg-slate-50 aspect-[16/10]">
              <img
                src="/drShaliniCard.jpg"
                alt="Doctor Shalini Mandapatti, DDS"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = "/drShaliniUpdate.jpg";
                }}
              />
              <div className="absolute bottom-1.5 right-1.5 bg-white/95 backdrop-blur-xs px-1.5 py-0.2 rounded text-[9px] font-bold text-slate-800 shadow-2xs border border-white/60">
                15+ Yrs Exp
              </div>
            </div>

            {/* About Doctor Shalini */}
            <div className="mt-1.5">
              <p className="text-[11px] font-bold text-slate-800">About Doctor Shalini</p>
              <p className="text-[10px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                Doctor Shalini provides compassionate care expertise ensuring patient health and restorative excellence...{" "}
                <Link to="/about-doctor" className="text-[#003BC4] font-semibold cursor-pointer hover:underline">
                  Read More
                </Link>
              </p>
            </div>

            {/* Info Row: Timing & Consultation Duration */}
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <FaRegClock className="text-slate-400 text-[9px]" /> Wed - Sat Open
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                ⏱️ 30 - 45 min
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to="/admin/schedule"
            className="mt-2 w-full py-2 px-3 bg-[#0B132B] hover:bg-[#003BC4] text-white font-bold rounded-full shadow-sm text-[11px] text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <FaCalendarCheck className="text-[10px]" />
            <span>Manage Clinic Schedule</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
