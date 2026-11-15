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
  FaHospitalUser,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const ModernSidebar = ({ isExpanded, setIsExpanded, mobileOpen, setMobileOpen }) => {
  const { user, role, logout, switchRole, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    {
      to: "/admin/dashboard",
      icon: <FaChartPie className="text-lg shrink-0" />,
      label: "Overview Dashboard",
      permission: "dashboard:view",
      badge: "Live"
    },
    {
      to: "/admin/schedule",
      icon: <FaCalendarAlt className="text-lg shrink-0" />,
      label: "Doctor Shalini Schedule",
      permission: "schedule:manage",
      badge: "Wed-Sat"
    },
    {
      to: "/admin/patients-directory",
      icon: <FaUserFriends className="text-lg shrink-0" />,
      label: "Patient Directory",
      permission: "patients:read",
      badge: "3,067"
    },
    {
      to: "/admin/appointments",
      icon: <FaNotesMedical className="text-lg shrink-0" />,
      label: "Appointments & Recalls",
      permission: "appointments:read"
    },
    {
      to: "/admin/insurance-verifier",
      icon: <FaShieldAlt className="text-lg shrink-0" />,
      label: "US Insurance Verifier",
      permission: "insurance:verify",
      badge: "EDI 270"
    },
    {
      to: "/admin/voice-receptionist",
      icon: <FaMicrophoneAlt className="text-lg shrink-0" />,
      label: "AI Voice Platform",
      permission: "dashboard:view",
      badge: "24/7"
    },
    {
      to: "/admin/security-audit",
      icon: <FaUserShield className="text-lg shrink-0" />,
      label: "HIPAA Security & RBAC",
      permission: "hipaa:audit",
      badge: "MFA"
    },
    {
      to: "/admin/timing",
      icon: <FaClock className="text-lg shrink-0" />,
      label: "Operatory Time Blocks",
      permission: "schedule:manage"
    }
  ];

  return (
    <>
      {/* ================= 1. MOBILE BACKDROP OVERLAY ================= */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* ================= 2. DESKTOP EXPANDABLE / COLLAPSIBLE SIDEBAR (LIQUID GLASS) ================= */}
      <aside
        className={`hidden md:flex flex-col justify-between py-4 bg-[#060D20]/45 backdrop-blur-2xl text-slate-100 shadow-2xl border-r border-white/20 sticky top-0 h-screen z-40 shrink-0 transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64 px-3" : "w-20 px-2"
        }`}
      >
        {/* Top: Brand Header & Collapse Toggle */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <NavLink
              to="/admin/dashboard"
              className="flex items-center gap-3 group overflow-hidden"
              title="AllRight Dental Operating System"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all shrink-0">
                <FaTooth className="text-lg" />
              </div>

              {isExpanded && (
                <div className="min-w-0 transition-opacity duration-200">
                  <h2 className="font-extrabold text-sm text-white tracking-tight leading-tight">
                    AllRight <span className="text-[#00B7AA]">Dental</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-mono">Practice EHR</p>
                </div>
              )}
            </NavLink>

            {/* Quick Collapse / Expand Chevron Button */}
            {isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <FaChevronLeft className="text-xs" />
              </button>
            )}
          </div>
        </div>

        {/* Center: Navigation Menu Items */}
        <nav className="flex flex-col gap-1.5 my-auto py-3 overflow-y-auto">
          {navItems.map((item) => {
            const hasAccess = !item.permission || hasPermission(item.permission);
            if (!hasAccess) return null;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center transition-all duration-200 rounded-xl cursor-pointer relative group ${
                    isExpanded
                      ? "px-3 py-2.5 gap-3"
                      : "w-10 h-10 mx-auto justify-center"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-[#003BC4]/85 to-[#0052FF]/85 text-white shadow-lg shadow-blue-600/30 font-semibold border border-blue-400/30 backdrop-blur-md"
                      : "text-slate-300/85 hover:text-white hover:bg-white/10 hover:backdrop-blur-md"
                  }`
                }
              >
                {item.icon}

                {/* Expanded Label */}
                {isExpanded ? (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="text-xs font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-teal-400 shrink-0 ml-1.5 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                ) : (
                  /* Collapsed Floating Tooltip */
                  <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity border border-slate-800 flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom: Doctor Profile Pill & Expand/Collapse / Logout */}
        <div className="flex flex-col gap-2 pt-3 border-t border-white/15 w-full">
          {/* If Collapsed, show Expand Button */}
          {!isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-10 h-8 mx-auto rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer mb-1"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <FaChevronRight className="text-xs" />
            </button>
          )}

          {/* User Profile Info */}
          {user && (
            <div
              className={`flex items-center rounded-xl transition-all ${
                isExpanded
                  ? "p-2 bg-white/10 backdrop-blur-xl border border-white/20 gap-2.5 shadow-sm"
                  : "justify-center relative group cursor-pointer"
              }`}
              title={user.name}
            >
              <img
                src="/drShaliniAvatar.jpg"
                alt="Doctor Shalini Mandapatti, DDS"
                className="w-9 h-9 rounded-full object-cover border-2 border-teal-400/70 shadow-xs shrink-0"
                onError={(e) => {
                  e.target.src = "/drShaliniUpdate.jpg";
                }}
              />

              {isExpanded ? (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    Doctor Shalini
                  </p>
                  <p className="text-[10px] text-teal-300 font-mono truncate">
                    Lead DDS • Admin
                  </p>
                </div>
              ) : (
                <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity border border-white/20">
                  {user.name} ({user.role})
                </span>
              )}
            </div>
          )}

          {/* Sign Out Button */}
          {isExpanded ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/25 border border-rose-400/30 backdrop-blur-md transition-all cursor-pointer mt-1"
            >
              <FaSignOutAlt className="text-xs" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-300 hover:bg-rose-500/20 transition-colors relative group cursor-pointer"
              title="Secure Sign Out"
              aria-label="Secure Sign Out"
            >
              <FaSignOutAlt className="text-base" />
              <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-rose-950/90 backdrop-blur-md text-rose-200 text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity border border-rose-900">
                Sign Out
              </span>
            </button>
          )}
        </div>
      </aside>

      {/* ================= 3. MOBILE SLIDE-OUT DRAWER ================= */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#060D20]/85 backdrop-blur-2xl text-slate-100 flex flex-col z-50 md:hidden transition-transform duration-300 ease-in-out shadow-2xl border-r border-white/20 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
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
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Mobile User Info */}
        {user && (
          <div className="p-3 mx-3 my-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center gap-3">
            <img
              src="/drShaliniAvatar.jpg"
              alt="Doctor Shalini Mandapatti, DDS"
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
                onClick={() => setMobileOpen(false)}
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
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-teal-400">
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
              type="button"
              onClick={() => switchRole(ROLES.SUPER_ADMIN)}
              className={`text-[10px] font-semibold py-1 px-1.5 rounded text-center transition-all cursor-pointer ${
                role === ROLES.SUPER_ADMIN
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Doctor Shalini
            </button>
            <button
              type="button"
              onClick={() => switchRole(ROLES.RECEPTIONIST)}
              className={`text-[10px] font-semibold py-1 px-1.5 rounded text-center transition-all cursor-pointer ${
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
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 cursor-pointer"
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
