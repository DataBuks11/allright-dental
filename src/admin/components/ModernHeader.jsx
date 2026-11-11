import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaBell,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaPhoneAlt
} from "react-icons/fa";

const ModernHeader = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/New_York"
        }) + " EST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Open Sidebar"
        >
          <FaBars className="text-lg" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
            Morrisville Clinic Open
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
            <FaClock className="text-slate-400" /> {currentTime}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Practice Phone Quick Dial */}
        <a
          href="tel:2152951348"
          className="hidden lg:flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full font-semibold border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          <FaPhoneAlt className="text-[10px]" /> (215) 295-1348
        </a>

        {/* Security & MFA Indicator */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
          <FaShieldAlt className="text-emerald-500" />
          <span className="font-semibold text-[11px]">HIPAA Encrypted</span>
        </div>

        {/* User Pill */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-teal-600 font-semibold">{user.title}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ModernHeader;

