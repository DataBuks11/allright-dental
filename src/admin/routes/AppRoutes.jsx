import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Brand New Modern Clinical & Administrative Pages
import ModernLogin from "../components/ModernLogin";
import ModernDashboard from "../pages/ModernDashboard";
import ModernPatientsDirectory from "../pages/ModernPatientsDirectory";
import ModernSchedule from "../pages/ModernSchedule";
import ModernInsuranceVerifier from "../pages/ModernInsuranceVerifier";
import ModernSecurityAudit from "../pages/ModernSecurityAudit";

// Existing Admin Tools
import Appointments from "../pages/Appointments";
import Calendar from "../pages/Calendar";
import Past_Appointments from "../pages/Past_Appointments";
import VoiceAIDashboard from "../pages/VoiceAIDashboard";
import VoiceAgentPanel from "../pages/VoiceAgentPanel";
import Patients from "../pages/Patients";
import AdminTimeBlockPanel from "../pages/AdminTimeBlockPanel";

// Protected Route Guard with MFA Check
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center max-w-lg mx-auto mt-12 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
          🛡️
        </div>
        <h3 className="text-base font-bold text-slate-900">Access Restricted by RBAC</h3>
        <p className="text-xs text-slate-500 mt-1">
          Your current role does not have authorization to access this clinical module. Contact Doctor Shalini Mandapatti for clearance.
        </p>
      </div>
    );
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<ModernLogin />} />

      {/* Modern Dashboard & Core Portal */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredPermission="dashboard:view">
            <ModernDashboard />
          </ProtectedRoute>
        }
      />

      {/* Patient Directory (3,200+ Master Records) */}
      <Route
        path="/patients-directory"
        element={
          <ProtectedRoute requiredPermission="patients:read">
            <ModernPatientsDirectory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registeredpatients"
        element={
          <ProtectedRoute requiredPermission="patients:read">
            <ModernPatientsDirectory />
          </ProtectedRoute>
        }
      />

      {/* Master Doctor Shalini Schedule */}
      <Route
        path="/schedule"
        element={
          <ProtectedRoute requiredPermission="schedule:manage">
            <ModernSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timing"
        element={
          <ProtectedRoute requiredPermission="schedule:manage">
            <AdminTimeBlockPanel />
          </ProtectedRoute>
        }
      />

      {/* US Dental Insurance Verifier (EDI 270/271) */}
      <Route
        path="/insurance-verifier"
        element={
          <ProtectedRoute requiredPermission="insurance:verify">
            <ModernInsuranceVerifier />
          </ProtectedRoute>
        }
      />

      {/* HIPAA Security & Audit Trail */}
      <Route
        path="/security-audit"
        element={
          <ProtectedRoute requiredPermission="hipaa:audit">
            <ModernSecurityAudit />
          </ProtectedRoute>
        }
      />

      {/* Voice AI Platform & Control Center */}
      <Route
        path="/voice-receptionist"
        element={
          <ProtectedRoute requiredPermission="dashboard:view">
            <VoiceAIDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voice-agent"
        element={
          <ProtectedRoute requiredPermission="dashboard:view">
            <VoiceAIDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voice-dashboard"
        element={
          <ProtectedRoute requiredPermission="dashboard:view">
            <VoiceAIDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voice-tester"
        element={
          <ProtectedRoute requiredPermission="dashboard:view">
            <VoiceAgentPanel />
          </ProtectedRoute>
        }
      />

      {/* Appointments & Calendar */}
      <Route
        path="/appointments"
        element={
          <ProtectedRoute requiredPermission="appointments:read">
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute requiredPermission="appointments:read">
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute requiredPermission="patients:read">
            <Patients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/past-appointments"
        element={
          <ProtectedRoute requiredPermission="appointments:read">
            <Past_Appointments />
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
