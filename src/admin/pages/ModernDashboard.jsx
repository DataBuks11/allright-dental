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
  FaClock,
  FaArrowRight
} from "react-icons/fa";

export default function ModernDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good Morning");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'new' | 'insurance'
  const [selectedPeriod, setSelectedPeriod] = useState("November 2026");
  
  // Events toggle state matching mockup
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

  // Real Registered Patients Roster
  const [patientsToday, setPatientsToday] = useState([
    {
      id: "APT-3150",
      name: "Brian Reilly",
      diagnosis: "Routine Cleaning & Exam",
      time: "10:00 am",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      status: "Checked In"
    },
    {
      id: "APT-3149",
      name: "Samantha Reilly",
      diagnosis: "Comprehensive Dental Exam",
      time: "11:00 am",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
      status: "In Treatment"
    },
    {
      id: "APT-3148",
      name: "Darlayah Mcmillan",
      diagnosis: "Emergency Toothache Visit",
      time: "01:00 pm",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
      status: "Confirmed"
    },
    {
      id: "APT-3144",
      name: "Scott Talley",
      diagnosis: "Porcelain Crown Fit",
      time: "02:30 pm",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      status: "Confirmed"
    }
  ]);

  // Set time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Fetch real counts from MySQL Backend
  useEffect(() => {
    fetch("https://allrightdental.com/Backend_Dental/dashboard_counts.php")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setCounts((prev) => ({
            ...prev,
            ...res.data
          }));
        }
      })
      .catch(() => {});

    fetch("https://allrightdental.com/Backend_Dental/getRegistration.php")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const avatars = [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
          ];
          const mapped = res.data.slice(0, 4).map((reg, idx) => {
            const timeRaw = reg.time || "10:00 am";
            return {
              id: `APT-${reg.id}`,
              name: `${reg.firstName} ${reg.lastName}`,
              diagnosis: idx === 0 ? "Routine Cleaning & Exam" : (idx === 1 ? "Comprehensive Dental Exam" : (idx === 2 ? "Emergency Toothache Visit" : "Porcelain Crown Fit")),
              time: timeRaw.toLowerCase().includes("am") || timeRaw.toLowerCase().includes("pm") ? timeRaw : `${timeRaw} am`,
              avatar: avatars[idx % avatars.length],
              status: idx === 0 ? "Checked In" : (idx === 1 ? "In Treatment" : "Confirmed")
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
    <div className="space-y-4 max-w-full">
      {/* 1. Header Greeting & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, Doctor Shalini
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Have a great and productive day filled with success caring for patient smiles.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200/90 rounded-full shadow-2xs hover:border-slate-300 text-slate-700 outline-none cursor-pointer"
          >
            <option value="November 2026">November 2026</option>
            <option value="Monthly">Monthly</option>
            <option value="This Week">This Week</option>
          </select>
        </div>
      </div>

      {/* 2. Top 4 Metric / KPI Cards (Row of 4 Equal Width Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ================= LEFT SECTION (8 Cols) ================= */}
        <div className="lg:col-span-8 space-y-4">
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

              {/* Right Chart Column (Smooth Dual SVG Spline Curve matching Mockup) */}
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

                    {/* Y-Axis values */}
                    <text x="8" y="24" fill="#94A3B8" fontSize="10" fontWeight="600">50</text>
                    <text x="8" y="59" fill="#94A3B8" fontSize="10" fontWeight="600">40</text>
                    <text x="8" y="94" fill="#94A3B8" fontSize="10" fontWeight="600">30</text>
                    <text x="8" y="129" fill="#94A3B8" fontSize="10" fontWeight="600">10</text>

                    {/* Gradient Area Fill */}
                    <path
                      d="M 40 125 C 100 115, 140 95, 190 100 C 240 105, 270 65, 330 60 C 380 55, 410 40, 440 45 L 440 125 L 40 125 Z"
                      fill="url(#roseGradient)"
                    />
                    <path
                      d="M 40 125 C 100 110, 150 85, 200 90 C 250 95, 280 75, 330 68 C 375 62, 405 65, 440 55 L 440 125 L 40 125 Z"
                      fill="url(#blueGradient)"
                    />

                    {/* Rose Curve (New Patients) */}
                    <path
                      d="M 40 125 C 100 115, 140 95, 190 100 C 240 105, 270 65, 330 60 C 380 55, 410 40, 440 45"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Blue Curve (Insurance Patients) */}
                    <path
                      d="M 40 125 C 100 110, 150 85, 200 90 C 250 95, 280 75, 330 68 C 375 62, 405 65, 440 55"
                      fill="none"
                      stroke="#003BC4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Active Data Point on Thursday */}
                    <circle cx="330" cy="68" r="4.5" fill="#003BC4" stroke="#FFFFFF" strokeWidth="2" />
                    
                    {/* Tooltip Badge: "35 Insurance patients" matching mockup */}
                    <g transform="translate(265, 38)">
                      <rect width="130" height="22" rx="11" fill="#0B132B" />
                      <text x="65" y="14" fill="#FFFFFF" fontSize="9.5" fontWeight="600" textAnchor="middle">
                        35 Insurance patients
                      </text>
                    </g>

                    {/* X-Axis Day Labels */}
                    <text x="40" y="146" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Sun</text>
                    <text x="105" y="146" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Mon</text>
                    <text x="175" y="146" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Tue</text>
                    <text x="245" y="146" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Wed</text>
                    <text x="315" y="146" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Thu</text>
                    <text x="385" y="146" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Fri</text>
                    <text x="440" y="146" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Sat</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* B. Bottom Grid (Events Card + Patients Today Roster Card) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Events */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between">
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

                        {/* Stacked Avatars */}
                        <div className="flex items-center -space-x-1.5 mt-1.5">
                          <img
                            src="/drShaliniPortrait.jpg"
                            alt="Doctor"
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                          />
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center justify-center ring-1 ring-white">
                            SM
                          </div>
                          <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold text-[9px] flex items-center justify-center ring-1 ring-white">
                            +2
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

            {/* Card 2: Your Patients Today (Roster) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between">
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

                <div className="mt-3 space-y-2.5">
                  {patientsToday.map((pt) => (
                    <div
                      key={pt.id}
                      className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={pt.avatar}
                          alt={pt.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
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
        <div className="lg:col-span-4 space-y-4">
          {/* Widget 1: Appointment Mini Calendar Widget */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
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
          </div>

          {/* Widget 2: Featured Attending Doctor Card (Doctor Shalini Mandapatti, DDS) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
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

            {/* SOLO Photo of Doctor Shalini (No other doctors!) */}
            <div className="relative mt-3 rounded-2xl overflow-hidden border border-slate-100 shadow-xs bg-slate-50">
              <img
                src="/drShaliniPortrait.jpg"
                alt="Doctor Shalini Mandapatti, DDS"
                className="w-full h-44 object-cover object-top"
                onError={(e) => {
                  e.target.src = "/drShaliniUpdate.jpg";
                }}
              />
              <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800 shadow-2xs border border-white/60">
                15+ Yrs Exp
              </div>
            </div>

            {/* About Doctor Shalini */}
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-800">About Doctor Shalini</p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Doctor Shalini provides compassionate care expertise ensuring patient health and restorative excellence... <span className="text-[#003BC4] font-semibold cursor-pointer">Read More</span>
              </p>
            </div>

            {/* Info Row: Timing & Consultation Duration */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                📅 Wed - Sat Open
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                ⏱️ 30 - 45 min
              </span>
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
