import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ModernSidebar from "./components/ModernSidebar";
import ModernHeader from "./components/ModernHeader";
import { AuthProvider } from "./context/AuthContext";

function AdminAppContent() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage =
    location.pathname === "/admin" ||
    location.pathname === "/admin/" ||
    location.pathname === "/admin/login";

  if (isAuthPage) {
    return <AppRoutes />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row font-poppins text-slate-800">
      <ModernSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <ModernHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
