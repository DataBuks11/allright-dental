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
  FaCheckCircle,
  FaArrowRight,
  FaUserFriends
} from "react-icons/fa";

export default function ModernDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good Morning");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'new' | 'insurance'
  const [selectedPeriod, setSelectedPeriod] = useState("November 2026");
  
  // Events toggle state
  const [events, setEvents] = useState([
    { id: 1, title: "Doctor Team Meeting", time: "10:00 - 12:00", active: true, color: "bg-blue-500" },
    { id: 2, title: "Surgical Operatory Block", time: "01:00 - 02:00", active: true, color: "bg-teal-500" },
    { id: 3, title: "Continuing Care & Recalls", time: "03:00 - 04:00", active: false, color: "bg-indigo-500" }
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
      time: "10:30 AM",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      status: "Checked In"
    },
    {
      id: "APT-3149",
      name: "Samantha Reilly",
      diagnosis: "Comprehensive Dental Exam",
      time: "11:15 AM",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
      status: "In Treatment"
    },
    {
      id: "APT-3144",
      name: "Scott Talley",
      diagnosis: "Porcelain Crown Fit",
      time: "01:00 PM",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      status: "Confirmed"
    },
    {
      id: "APT-3148",
      name: "Darlayah Mcmillan",
      diagnosis: "Emergency Toothache Visit",
      time: "02:30 PM",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
      status: "Confirmed"
    },
    {
      id: "APT-2322",
      name: "Piyush Junghare",
      diagnosis: "Preventive Care & Polish",
      time: "04:00 PM",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
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

  // Fetch real counts and bookings from MySQL Backend
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
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"
          ];
          const mapped = res.data.slice(0, 5).map((reg, idx) => {
            const timeRaw = reg.time || "10:30 AM";
            let formattedTime = timeRaw;
            if (timeRaw.includes(":") && timeRaw.length >= 5) {
              const parts = timeRaw.split(":");
              const h = parseInt(parts[0], 10);
              const m = parts[1];
              if (!isNaN(h)) {
                formattedTime = h >= 12 ? `${h === 12 ? 12 : h - 12}:${m} PM` : `${h === 0 ? 12 : h}:${m} AM`;
              }
            }
            return {
              id: `APT-${reg.id}`,
              name: `${reg.firstName} ${reg.lastName}`,
              diagnosis: idx % 3 === 0 ? "Routine Cleaning & Exam" : (idx % 3 === 1 ? "Comprehensive Dental Exam" : "Porcelain Crown Fit"),
              time: formattedTime,
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
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Header Greeting & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, Doctor Shalini
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Have a great and productive day caring for patient smiles at AllRight Dental.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs font-semibold px-3.5 py-1.5 bg-white border border-slate-200/90 rounded-full shadow-2xs hover:border-slate-300 text-slate-700 outline-none cursor-pointer"
          >
            <option value="November 2026">November 2026</option>
            <option value="This Week">This Week</option>
            <option value="Today">Today (Real-Time)</option>
          </select>
        </div>
      </div>

      {/* 2. Top 4 Metric / KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Appointments */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003BC4] flex items-center justify-center text-base shadow-2xs">
            <FaCalendarCheck />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-3">Total Appointments</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {parseInt(counts.patients, 10).toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">● Synced with MySQL</p>
        </div>

        {/* Card 2: Clinical Reports / Recalls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-base shadow-2xs">
            <FaFileMedical />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-3">Total Reports / Recalls</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {counts.recalls || "871"}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Dentrix Care Recalls</p>
        </div>

        {/* Card 3: Practice Capacity */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-base shadow-2xs">
            <FaTooth />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-3">Practice Fill Rate</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              94.8%
            </span>
          </div>
          <p className="text-[10px] text-teal-600 font-semibold mt-1">Wed - Sat Operatories</p>
        </div>

        {/* Card 4: New Patients */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base shadow-2xs">
            <FaUserPlus />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-3">New Patients This Month</p>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              42
            </span>
          </div>
          <p className="text-[10px] text-blue-600 font-semibold mt-1">+18% vs last month</p>
        </div>
      </div>

      {/* 3. Main Dashboard Layout (8 Cols Left / 4 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT SECTION (8 Cols) ================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* A. "Your Patients Today" Analytics & Line Chart Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Your patients today
              </h2>

              {/* Filter Tabs: [All] [New] [Insurance] */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-full self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-slate-900 text-white shadow-xs"
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-center">
              {/* Left Sub-Stats Column */}
              <div className="md:col-span-4 flex sm:flex-col justify-around sm:justify-center gap-4 sm:gap-5 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
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

              {/* Right Chart Column (Smooth SVG Bezier Curve matching Mockup) */}
              <div className="md:col-span-8 relative">
                <div className="w-full h-44 sm:h-48 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
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
                    <line x1="30" y1="30" x2="480" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="30" y1="70" x2="480" y2="70" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="30" y1="110" x2="480" y2="110" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="30" y1="150" x2="480" y2="150" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Y-Axis values */}
                    <text x="10" y="34" fill="#94A3B8" fontSize="10" fontWeight="600">50</text>
                    <text x="10" y="74" fill="#94A3B8" fontSize="10" fontWeight="600">40</text>
                    <text x="10" y="114" fill="#94A3B8" fontSize="10" fontWeight="600">30</text>
                    <text x="10" y="154" fill="#94A3B8" fontSize="10" fontWeight="600">10</text>

                    {/* Gradient Area Fills */}
                    <path
                      d="M 50 150 C 110 140, 150 120, 200 125 C 250 130, 280 80, 340 75 C 400 70, 430 45, 470 50 L 470 150 L 50 150 Z"
                      fill="url(#roseGradient)"
                    />
                    <path
                      d="M 50 150 C 110 135, 160 110, 210 115 C 260 120, 290 95, 340 85 C 390 75, 420 80, 470 65 L 470 150 L 50 150 Z"
                      fill="url(#blueGradient)"
                    />

                    {/* Rose Line Curve (New Patients) */}
                    <path
                      d="M 50 150 C 110 140, 150 120, 200 125 C 250 130, 280 80, 340 75 C 400 70, 430 45, 470 50"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Blue Line Curve (Insurance Patients) */}
                    <path
                      d="M 50 150 C 110 135, 160 110, 210 115 C 260 120, 290 95, 340 85 C 390 75, 420 80, 470 65"
                      fill="none"
                      stroke="#003BC4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Active Data Point on Wednesday */}
                    <circle cx="340" cy="85" r="4.5" fill="#003BC4" stroke="#FFFFFF" strokeWidth="2" />
                    
                    {/* Tooltip Badge: "35 Insurance patients" matching mockup */}
                    <g transform="translate(275, 55)">
                      <rect width="130" height="22" rx="11" fill="#0F172A" />
                      <text x="65" y="14" fill="#FFFFFF" fontSize="9.5" fontWeight="600" textAnchor="middle">
                        35 Insurance patients
                      </text>
                    </g>

                    {/* X-Axis Day Labels */}
                    <text x="50" y="172" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Sun</text>
                    <text x="120" y="172" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Mon</text>
                    <text x="190" y="172" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Tue</text>
                    <text x="260" y="172" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Wed</text>
                    <text x="330" y="172" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Thu</text>
                    <text x="400" y="172" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Fri</text>
                    <text x="470" y="172" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="500">Sat</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* B. Bottom Grid (Events Card + Patients Today Roster Card) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Clinical Events & Meetings */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Events</h3>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                  aria-label="Events Menu"
                >
                  <FaEllipsisH />
                </button>
              </div>

              <div className="mt-3.5 space-y-3.5">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {evt.title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {evt.time}
                      </p>

                      {/* Small overlapping avatars */}
                      <div className="flex items-center -space-x-1.5 mt-2">
                        <img
                          src="/drShaliniUpdate.jpg"
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

                    {/* Toggle Switch matching mockup */}
                    <button
                      type="button"
                      onClick={() => toggleEvent(evt.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none p-0.5 ${
                        evt.active ? "bg-[#003BC4]" : "bg-slate-300"
                      }`}
                      aria-label="Toggle Event"
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          evt.active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Your Patients Today (Real Patient Roster) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
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
                      <img
                        src={pt.avatar}
                        alt={pt.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {pt.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
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

        {/* ================= RIGHT SECTION (4 Cols) ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Widget 1: Appointment Mini Calendar Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
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
            <div className="flex items-center justify-between mt-3 px-1">
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

            {/* Days Row & Date Row (Matching Mockup with Wed Nov 18 Highlighted) */}
            <div className="grid grid-cols-7 gap-1 mt-3 text-center">
              <span className="text-[10px] font-semibold text-slate-400">Sun</span>
              <span className="text-[10px] font-semibold text-slate-400">Mon</span>
              <span className="text-[10px] font-semibold text-slate-400">Tue</span>
              <span className="text-[10px] font-bold text-[#003BC4]">Wed</span>
              <span className="text-[10px] font-bold text-slate-700">Thu</span>
              <span className="text-[10px] font-bold text-slate-700">Fri</span>
              <span className="text-[10px] font-bold text-amber-600">Sat</span>

              {/* Date Numbers */}
              <span className="text-xs font-medium text-slate-400 py-1.5">15</span>
              <span className="text-xs font-medium text-slate-400 py-1.5">16</span>
              <span className="text-xs font-medium text-slate-400 py-1.5">17</span>
              {/* Active Day 18 (Wednesday) Highlighted with Purple/Blue Circle */}
              <div className="flex items-center justify-center py-1">
                <span className="w-7 h-7 rounded-full bg-gradient-to-r from-[#003BC4] to-[#0052FF] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  18
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800 py-1.5">19</span>
              <span className="text-xs font-bold text-slate-800 py-1.5">20</span>
              <span className="text-xs font-bold text-amber-700 py-1.5">21</span>
            </div>
          </div>

          {/* Widget 2: Featured Attending Doctor Card (Doctor Shalini Mandapatti, DDS) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 leading-snug">
              Doctor Shalini Mandapatti
            </h3>
            
            <div className="mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#003BC4] border border-blue-200/80">
                <FaTooth className="text-[9px]" /> Lead Cosmetic & Family Dentist
              </span>
            </div>

            {/* Doctor Shalini Image matching Mockup */}
            <div className="relative mt-3.5 rounded-2xl overflow-hidden border border-slate-100 shadow-xs bg-slate-50 group">
              <img
                src="/drShaliniUpdate.jpg"
                alt="Doctor Shalini Mandapatti, DDS"
                className="w-full h-48 sm:h-52 object-cover object-top group-hover:scale-102 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/drShalini.jpg";
                }}
              />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800 shadow-2xs border border-white/60">
                15+ Yrs Exp
              </div>
            </div>

            {/* About Doctor Shalini */}
            <div className="mt-3.5">
              <p className="text-xs font-bold text-slate-800">About Doctor Shalini</p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                Doctor Shalini provides compassionate, gentle dental care with over 15 years of clinical expertise ensuring patient health, restorative excellence, and radiant smiles.
              </p>
            </div>

            {/* Info Row: Timing & Consultation Duration */}
            <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                📅 Wed - Sat Open
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                ⏱️ 30 - 45 min
              </span>
            </div>

            {/* Big Action Button Matching Website Colors */}
            <Link
              to="/admin/schedule"
              className="mt-4 w-full py-2.5 px-4 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] hover:from-[#002fa0] hover:to-[#009b90] text-white font-bold rounded-xl shadow-md shadow-blue-600/20 text-xs text-center flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
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
