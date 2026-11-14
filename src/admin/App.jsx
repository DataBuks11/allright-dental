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
    <div className="min-h-screen bg-[#F4F7FC] flex font-poppins text-slate-800 antialiased selection:bg-[#003BC4] selection:text-white">
      <ModernSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <ModernHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1600px] mx-auto">
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
