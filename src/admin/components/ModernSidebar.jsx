import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
import {
  FaChartPie,
  FaCalendarAlt,
  FaUserFriends,
  FaNotesMedical,
  FaMicrophoneAlt,
  FaShieldAlt,
  FaSignOutAlt,
  FaUserShield,
  FaTooth,
  FaClock,
  FaTimes,
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
      icon: <FaChartPie className="text-xl" />,
      label: "Overview Dashboard",
      permission: "dashboard:view",
      badge: "Live"
    },
    {
      to: "/admin/schedule",
      icon: <FaCalendarAlt className="text-xl" />,
      label: "Doctor Shalini Schedule",
      permission: "schedule:manage",
      badge: "Wed-Sat"
    },
    {
      to: "/admin/patients-directory",
      icon: <FaUserFriends className="text-xl" />,
      label: "Patient Directory",
      permission: "patients:read",
      badge: "3,067"
    },
    {
      to: "/admin/appointments",
      icon: <FaNotesMedical className="text-xl" />,
      label: "Appointments & Recalls",
      permission: "appointments:read"
    },
    {
      to: "/admin/insurance-verifier",
      icon: <FaShieldAlt className="text-xl" />,
      label: "US Insurance Verifier",
      permission: "insurance:verify",
      badge: "EDI 270"
    },
    {
      to: "/admin/voice-receptionist",
      icon: <FaMicrophoneAlt className="text-xl" />,
      label: "AI Voice Receptionist (Sarah)",
      permission: "dashboard:view",
      badge: "24/7"
    },
    {
      to: "/admin/security-audit",
      icon: <FaUserShield className="text-xl" />,
      label: "HIPAA Security & RBAC",
      permission: "hipaa:audit",
      badge: "MFA"
    },
    {
      to: "/admin/timing",
      icon: <FaClock className="text-xl" />,
      label: "Operatory Time Blocks",
      permission: "schedule:manage"
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Desktop Sleek Vertical Pill Sidebar - Fixed Viewport Height */}
      <aside className="hidden md:flex flex-col items-center justify-between py-4 px-2 bg-[#0B132B] text-slate-300 w-16 lg:w-18 shadow-xl border-r border-slate-800/80 sticky top-0 h-screen z-40 shrink-0">
        {/* Top App Icon Badge */}
        <div className="flex flex-col items-center gap-2">
          <NavLink
            to="/admin/dashboard"
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all group relative"
            title="AllRight Dental Operating System"
          >
            <FaTooth className="text-xl" />
            <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-md shadow-lg whitespace-nowrap z-50 transition-opacity">
              AllRight Dental Admin
            </span>
          </NavLink>
        </div>

        {/* Center Navigation Icons with Hover Tooltips */}
        <nav className="flex flex-col items-center gap-2 my-auto py-2">
          {navItems.map((item) => {
            const hasAccess = !item.permission || hasPermission(item.permission);
            if (!hasAccess) return null;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#003BC4] to-[#0052FF] text-white shadow-md shadow-blue-600/30 font-bold scale-105"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                  }`
                }
              >
                {item.icon}

                {/* Tooltip on hover */}
                <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity border border-slate-800 flex items-center gap-1.5">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions (User Avatar & Sign Out) */}
        <div className="flex flex-col items-center gap-3 pt-2 border-t border-slate-800/80 w-full">
          {user && (
            <div className="relative group cursor-pointer" title={user.name}>
              <img
                src="/drShaliniPortrait.jpg"
                alt="Doctor Shalini Mandapatti, DDS"
                className="w-9 h-9 rounded-full object-cover border-2 border-teal-500/50 hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.src = "/drShaliniUpdate.jpg";
                }}
              />
              <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity border border-slate-800">
                {user.name} ({user.role})
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors relative group cursor-pointer"
            title="Secure Sign Out"
            aria-label="Secure Sign Out"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-rose-950 text-rose-200 text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity border border-rose-900">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Slide-out Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#0B132B] text-slate-100 flex flex-col z-50 md:hidden transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003BC4] to-[#00B7AA] flex items-center justify-center text-white shadow-md">
              <FaTooth className="text-lg" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">AllRight Dental</h2>
              <p className="text-[10px] text-teal-400 font-medium">Practice EHR & Admin</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Mobile User Info */}
        {user && (
          <div className="p-3 mx-3 my-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center gap-3">
            <img
              src="/drShaliniPortrait.jpg"
              alt="Doctor Shalini Mandapatti"
              className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/50"
              onError={(e) => {
                e.target.src = "/drShaliniUpdate.jpg";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-teal-400 font-semibold">{user.title}</p>
            </div>
          </div>
        )}

        {/* Mobile Nav Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const hasAccess = !item.permission || hasPermission(item.permission);
            if (!hasAccess) return null;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#003BC4] to-[#0052FF] text-white shadow-md font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Role Switcher */}
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
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Doctor Shalini
            </button>
            <button
              onClick={() => switchRole(ROLES.RECEPTIONIST)}
              className={`text-[10px] font-semibold py-1 px-1.5 rounded text-center transition-all ${
                role === ROLES.RECEPTIONIST
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Receptionist
            </button>
          </div>
        </div>

        {/* Mobile Sign Out */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20"
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
