import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ModernSidebar from "./components/ModernSidebar";
import ModernHeader from "./components/ModernHeader";
import { AuthProvider } from "./context/AuthContext";
import { FaShieldAlt } from "react-icons/fa";

function AdminAppContent() {
  const location = useLocation();

  // Desktop sidebar collapse/expand state (persisted)
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    return localStorage.getItem("allright_sidebar_expanded") === "true";
  });

  // Mobile drawer slide-in state
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("allright_sidebar_expanded", sidebarExpanded ? "true" : "false");
  }, [sidebarExpanded]);

  // Toggle handler that works seamlessly on both mobile and desktop
  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarExpanded((prev) => !prev);
    }
  };

  const isAuthPage =
    location.pathname === "/admin" ||
    location.pathname === "/admin/" ||
    location.pathname === "/admin/login";

  if (isAuthPage) {
    return <AppRoutes />;
  }

  return (
    <div className="h-screen bg-[#F4F7FC] flex font-poppins text-slate-800 antialiased selection:bg-[#003BC4] selection:text-white w-full overflow-hidden">
      {/* Modern Sidebar: Always 100% full height of viewport on desktop, never scrolls away or cuts off */}
      <ModernSidebar
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Viewport: Scrolls smoothly with its own independent scrollbar */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden w-full">
        <ModernHeader
          toggleSidebar={handleToggleSidebar}
          isSidebarExpanded={sidebarExpanded}
        />

        <main className="flex-1 p-2.5 sm:p-3.5 lg:p-4 w-full">
          <AppRoutes />
        </main>

        {/* Global Admin Footer: Proper, professional bottom finish on Laptop & Desktop */}
        <footer className="mt-auto py-2.5 px-4 sm:px-6 bg-white/90 backdrop-blur-xs border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">AllRight Dental PC</span>
            <span className="text-slate-300">•</span>
            <span>Doctor Shalini Mandapatti, DDS</span>
            <span className="text-slate-300 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">229 Plaza Blvd, Morrisville, PA</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <FaShieldAlt className="text-emerald-600 text-[10px]" />
              HIPAA Compliant EHR
            </span>
            <span>•</span>
            <span className="text-slate-400">© 2026 TAGRAB LLC. All Rights Reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function AdminApp() {
  return (
    <AuthProvider>
      <AdminAppContent />
    </AuthProvider>
  );
}

export default AdminApp;
