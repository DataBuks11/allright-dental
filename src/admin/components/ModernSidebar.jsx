import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
import {
  FaChartLine,
  FaCalendarAlt,
  FaUserInjured,
  FaNotesMedical,
  FaMicrophoneAlt,
  FaShieldAlt,
  FaSignOutAlt,
  FaUserShield,
  FaTooth,
  FaHospitalUser
} from "react-icons/fa";

const ModernSidebar = ({ isOpen, setIsOpen }) => {
  const { user, role, logout, switchRole, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    {
      to: "/admin/dashboard",
      icon: <FaChartLine className="text-lg" />,
      label: "Overview Dashboard",
      permission: "dashboard:view",
      badge: "Live"
    },
    {
      to: "/admin/patients-directory",
      icon: <FaUserInjured className="text-lg" />,
      label: "Patient Directory",
      permission: "patients:read",
      badge: "3,200+"
    },
    {
      to: "/admin/schedule",
      icon: <FaCalendarAlt className="text-lg" />,
      label: "Doctor Shalini Schedule",
      permission: "schedule:manage",
      badge: "Wed-Sat"
    },
    {
      to: "/admin/appointments",
      icon: <FaNotesMedical className="text-lg" />,
      label: "Appointments & Recalls",
      permission: "appointments:read"
    },
    {
      to: "/admin/insurance-verifier",
      icon: <FaShieldAlt className="text-lg text-emerald-400" />,
      label: "US Insurance Verifier",
      permission: "insurance:verify",
      badge: "EDI 270/271"
    },
    {
      to: "/admin/voice-receptionist",
      icon: <FaMicrophoneAlt className="text-lg text-cyan-400" />,
      label: "AI Receptionist Platform",
      permission: "dashboard:view",
      badge: "Sarah 24/7"
    },
    {
      to: "/admin/security-audit",
      icon: <FaUserShield className="text-lg text-amber-400" />,
      label: "HIPAA Security & RBAC",
      permission: "hipaa:audit",
      badge: "MFA"
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 text-slate-100 flex flex-col z-50 transition-transform duration-300 ease-in-out border-r border-slate-800 shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <FaTooth className="text-xl" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight tracking-wide text-white flex items-center gap-1.5">
                AllRight Dental
              </h1>
              <p className="text-[11px] text-teal-400 font-medium">Practice EHR & AI Hub</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ● HIPAA
          </span>
        </div>

        {/* User Profile Card */}
        {user && (
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3 shadow-inner">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/50"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {user.role}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                  ✓ MFA
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const hasAccess = !item.permission || hasPermission(item.permission);
            if (!hasAccess) return null;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/30 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 group-hover:bg-slate-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Fast Role Switcher (For Demo & Clinical Testing) */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center justify-between">
            <span>Test Role (RBAC)</span>
            <FaHospitalUser className="text-teal-400" />
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => switchRole(ROLES.SUPER_ADMIN)}
              className={`text-[10px] font-semibold py-1 px-1.5 rounded text-center transition-all ${
                role === ROLES.SUPER_ADMIN
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Doctor Shalini
            </button>
            <button
              onClick={() => switchRole(ROLES.RECEPTIONIST)}
              className={`text-[10px] font-semibold py-1 px-1.5 rounded text-center transition-all ${
                role === ROLES.RECEPTIONIST
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Receptionist
            </button>
            <button
              onClick={() => switchRole(ROLES.DOCTOR)}
              className={`text-[10px] font-semibold py-1 px-1.5 rounded text-center transition-all ${
                role === ROLES.DOCTOR
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Clinician
            </button>
            <button
              onClick={() => switchRole(ROLES.PATIENT)}
              className={`text-[10px] font-semibold py-1 px-1.5 rounded text-center transition-all ${
                role === ROLES.PATIENT
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Patient Portal
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 transition-all cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Secure Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default ModernSidebar;

