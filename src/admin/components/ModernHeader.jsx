import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaBell,
  FaCog,
  FaChevronDown,
  FaShieldAlt,
  FaClock,
  FaPhoneAlt,
  FaTooth
} from "react-icons/fa";

const ModernHeader = ({ toggleSidebar }) => {
  const { user } = useAuth();
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle & Brand Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          <FaBars className="text-lg" />
        </button>

        {/* Brand Logo & Name Matching Mockup */}
        <Link to="/admin/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
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
        <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-200">
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
          title="Direct Practice Telephony"
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
          title="Live Clinical Alerts & Appointments"
          aria-label="Notifications"
        >
          <FaBell className="text-sm" />
          <span className="w-2 h-2 rounded-full bg-[#00B7AA] absolute top-2 right-2 ring-2 ring-white"></span>
        </Link>

        {/* Doctor Shalini User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-full border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer bg-white"
          >
            <img
              src="/drShaliniUpdate.jpg"
              alt="Doctor Shalini Mandapatti"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#003BC4]/30"
              onError={(e) => {
                e.target.src = "/drShalini.jpg";
              }}
            />
            <div className="hidden sm:block text-left pr-1">
              <p className="text-xs font-bold text-slate-800 leading-tight">Doctor Shalini</p>
              <p className="text-[10px] text-slate-500 font-semibold leading-tight">Admin</p>
            </div>
            <FaChevronDown className="text-[10px] text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Doctor Shalini Mandapatti, DDS</p>
                <p className="text-[11px] text-[#003BC4] font-semibold">Lead Attending Dentist</p>
                <p className="text-[10px] text-slate-400 mt-0.5">229 Plaza Blvd, Suite 23</p>
              </div>
              <Link
                to="/admin/schedule"
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
              >
                📅 Doctor Shalini Schedule
              </Link>
              <Link
                to="/admin/security-audit"
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
              >
                🛡️ HIPAA Security Audit
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold border-t border-slate-100 mt-1"
              >
                🚪 Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
