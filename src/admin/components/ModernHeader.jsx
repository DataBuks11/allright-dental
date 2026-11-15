import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaBell,
  FaCog,
  FaChevronDown,
  FaClock,
  FaPhoneAlt,
  FaTooth,
  FaSignOutAlt,
  FaChevronLeft
} from "react-icons/fa";

const ModernHeader = ({ toggleSidebar, isSidebarExpanded }) => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/New_York"
        }) + " EST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/45 backdrop-blur-2xl border-b border-white/60 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs w-full">
      {/* Left: Sidebar Toggle Button (Mobile & Desktop) & Brand Logo */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Toggle Button: Opens/Closes Sidebar on Desktop and Mobile */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 text-slate-700 hover:text-[#003BC4] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center focus:outline-none"
          title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          aria-label="Toggle Sidebar"
        >
          <FaBars className="text-base sm:text-lg" />
        </button>

        {/* Brand Logo & Name Matching MEDIX Design */}
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
            <span>✱</span>
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-tight flex items-center gap-1">
              <span>ALLRIGHT</span>
              <span className="text-[#003BC4]">DENTAL</span>
            </h1>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold hidden sm:block">
              Clinical Operating System
            </p>
          </div>
        </Link>

        {/* Live Clinic Status Badge */}
        <div className="hidden xl:flex items-center gap-2.5 pl-4 border-l border-slate-200">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
            Morrisville Practice Live
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-mono font-medium">
            <FaClock className="text-slate-400" /> {currentTime}
          </span>
        </div>
      </div>

      {/* Right: Quick Tools, Settings, Notifications, & Doctor Profile Pill */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Practice Phone Quick Dial */}
        <a
          href="tel:2152951348"
          className="hidden lg:flex items-center gap-1.5 text-xs text-[#003BC4] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-full font-semibold border border-blue-200/70 transition-colors"
          title="Direct Practice Telephony: (215) 295-1348"
        >
          <FaPhoneAlt className="text-[10px]" /> (215) 295-1348
        </a>

        {/* Settings Button */}
        <Link
          to="/admin/timing"
          className="w-9 h-9 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          title="Practice Time Blocks & Schedule Settings"
          aria-label="Settings"
        >
          <FaCog className="text-sm" />
        </Link>

        {/* Notification Bell */}
        <Link
          to="/admin/appointments"
          className="w-9 h-9 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors relative cursor-pointer"
          title="4 Appointments Pending"
          aria-label="Notifications"
        >
          <FaBell className="text-sm" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00B7AA] border border-white" />
        </Link>

        {/* Doctor Shalini Admin Profile Pill (Pure Square Face Avatar) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer bg-white"
          >
            <img
              src="/drShaliniAvatar.jpg"
              alt="Doctor Shalini Mandapatti, DDS"
              className="w-8 h-8 rounded-full object-cover border border-teal-500/60 shadow-2xs"
              onError={(e) => {
                e.target.src = "/drShaliniUpdate.jpg";
              }}
            />
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-800 leading-tight block">
                Doctor Shalini
              </span>
              <span className="text-[10px] text-teal-600 font-medium block">
                Lead Dentist
              </span>
            </div>
            <FaChevronDown className="text-[9px] text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2.5">
                <img
                  src="/drShaliniAvatar.jpg"
                  alt="Doctor Shalini"
                  className="w-9 h-9 rounded-full object-cover border border-teal-500"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Doctor Shalini Mandapatti
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">DDS • Morrisville, PA</p>
                </div>
              </div>

              <Link
                to="/admin/schedule"
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                Doctor Schedule
              </Link>
              <Link
                to="/admin/timing"
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                Operatory Time Blocks
              </Link>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                >
                  <FaSignOutAlt className="text-xs" />
                  <span>Secure Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
