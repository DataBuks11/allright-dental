import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ModernSidebar from "./components/ModernSidebar";
import ModernHeader from "./components/ModernHeader";
import { AuthProvider } from "./context/AuthContext";

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
    <div className="min-h-screen bg-[#F4F7FC] flex font-poppins text-slate-800 antialiased selection:bg-[#003BC4] selection:text-white w-full">
      {/* Modern Sidebar with Open/Close on Desktop and Mobile */}
      <ModernSidebar
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden w-full">
        <ModernHeader
          toggleSidebar={handleToggleSidebar}
          isSidebarExpanded={sidebarExpanded}
        />
        <main className="flex-1 p-2.5 sm:p-3.5 lg:p-4 w-full">
          <AppRoutes />
        </main>
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
