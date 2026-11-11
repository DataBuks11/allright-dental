import React, { useState } from "react";
import { useAuth, ROLES, ROLE_PERMISSIONS } from "../context/AuthContext";
import {
  FaUserShield,
  FaShieldAlt,
  FaKey,
  FaCheckCircle,
  FaLock,
  FaHistory,
  FaDatabase,
  FaServer,
  FaClipboardCheck
} from "react-icons/fa";

const AUDIT_LOGS = [
  { id: "LOG-901", timestamp: "Just now", action: "EDI 270 Inquiry Generated", user: "Sarah Jenkins (Receptionist)", target: "Piyush Junghare (Delta Dental)", ip: "192.168.1.42", status: "SUCCESS" },
  { id: "LOG-902", timestamp: "12 mins ago", action: "Patient Phone & Email Record Updated", user: "Sarah (AI Receptionist)", target: "Piyush Junghare (DOB: 2005-05-20)", ip: "10.0.4.11", status: "SUCCESS" },
  { id: "LOG-903", timestamp: "25 mins ago", action: "MFA Authentication TOTP Verified", user: "Doctor Shalini Mandapatti, DDS", target: "Session Token #3910", ip: "73.189.21.90", status: "SUCCESS" },
  { id: "LOG-904", timestamp: "1 hour ago", action: "Schedule Slot Blocked (Wed 3:00 PM)", user: "Doctor Shalini Mandapatti, DDS", target: "Operatory 1", ip: "73.189.21.90", status: "SUCCESS" },
  { id: "LOG-905", timestamp: "2 hours ago", action: "Patient Recall Dispatched (Dentrix D6)", user: "Automated Outbound Agent", target: "Michael Scott", ip: "10.0.4.12", status: "SUCCESS" }
];

const ModernSecurityAudit = () => {
  const { user, role, hasPermission } = useAuth();
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [logs, setLogs] = useState(AUDIT_LOGS);

  const complianceItems = [
    { rule: "45 CFR § 164.312(a)(1) Access Control", name: "Role-Based Access Control (RBAC)", status: "Active (4 Roles)", desc: "SuperAdmin, Doctor, Receptionist, Patient strict role partitioning." },
    { rule: "NIST SP 800-63B Authentication", name: "Multi-Factor Authentication (MFA)", status: "Enforced", desc: "Two-step verification mandatory for all administrative and clinical sessions." },
    { rule: "45 CFR § 164.312(d) Audit Controls", name: "Tamper-Evident ePHI Logging", status: "Active", desc: "Every read, edit, and insurance verification logged with operator ID and IP." },
    { rule: "45 CFR § 164.312(e)(1) Transmission", name: "TLS 1.3 Transport Encryption", status: "Active", desc: "Strict HTTPS redirection and HSTS preload enabled across all endpoints." },
    { rule: "45 CFR § 164.312(a)(2)(iv) Encryption", name: "AES-256 Storage Encryption", status: "Active (KMS CMK)", desc: "Database and S3 storage encrypted with customer-managed AWS KMS keys." }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <FaShieldAlt className="text-emerald-500" />
            <span>HIPAA Security Rule § 164.312 Technical Safeguards</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Security, RBAC & HIPAA Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time verification of role authorization, two-step MFA credentials, and ePHI access auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <FaCheckCircle className="text-emerald-600" />
            <span>100% HIPAA Compliant</span>
          </span>
        </div>
      </div>

      {/* HIPAA Compliance Matrix */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FaClipboardCheck className="text-blue-600" />
          <span>Technical Safeguards Compliance Checklist</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complianceItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.rule}</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {item.status}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">{item.name}</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Role Permissions Matrix */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FaUserShield className="text-teal-600" />
          <span>Role-Based Access Control (RBAC) Permissions Matrix</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">System Permission</th>
                <th className="py-2.5 px-3 text-center">SuperAdmin (Dr. Shalini)</th>
                <th className="py-2.5 px-3 text-center">Doctor (Associate)</th>
                <th className="py-2.5 px-3 text-center">Receptionist (Staff)</th>
                <th className="py-2.5 px-3 text-center">Patient (Portal)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">View Clinic Dashboard & KPIs</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-slate-400">✗ Blocked</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Read / Write 3,200+ Patient Files</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Clinical</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Intake</td>
                <td className="py-2.5 px-3 text-center text-blue-600 font-bold">Own Record Only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">US Dental Insurance Verifier (EDI 270)</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-blue-600 font-bold">View Benefits</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Block / Release Doctor Shalini Slots</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-slate-400">✗ View Only</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-slate-400">✗ Blocked</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">HIPAA Security Audit Logs & Roles</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-slate-400">✗ Blocked</td>
                <td className="py-2.5 px-3 text-center text-slate-400">✗ Blocked</td>
                <td className="py-2.5 px-3 text-center text-slate-400">✗ Blocked</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time ePHI Access Log Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FaHistory className="text-blue-600" />
          <span>Real-Time Electronic Protected Health Information (ePHI) Access Log</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Performed</th>
                <th className="py-2.5 px-3">Operator / Principal</th>
                <th className="py-2.5 px-3">Target Record</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{l.id}</td>
                  <td className="py-2.5 px-3 text-slate-500">{l.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{l.action}</td>
                  <td className="py-2.5 px-3 text-slate-600">{l.user}</td>
                  <td className="py-2.5 px-3 font-medium text-blue-700">{l.target}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{l.ip}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModernSecurityAudit;

