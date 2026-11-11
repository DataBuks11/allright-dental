import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserInjured,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaEdit,
  FaPlus,
  FaCheckCircle,
  FaTimes,
  FaHospitalUser
} from "react-icons/fa";

const ModernPatientsDirectory = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Selected patient for viewing / editing
  const [activePatient, setActivePatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    phone: "",
    insurance: ""
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load patients from public/allright_patients.json or localStorage overrides
  useEffect(() => {
    fetch("/allright_patients.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Check if there are local edits
          const localEdits = JSON.parse(localStorage.getItem("allright_patient_overrides") || "{}");
          const merged = data.map((p) => {
            const key = `${(p.first_name || "").toLowerCase()}_${(p.last_name || "").toLowerCase()}_${p.dob || ""}`;
            if (localEdits[key]) {
              return { ...p, ...localEdits[key] };
            }
            return p;
          });
          setPatients(merged);
        }
      })
      .catch((err) => console.error("Error loading patients:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter patients
  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return patients.filter((p) => {
      const fullName = `${p.first_name || ""} ${p.last_name || ""} ${p.name || ""}`.toLowerCase();
      const phone = (p.phone || "").toLowerCase();
      const email = (p.email || "").toLowerCase();
      const dob = (p.dob || "").toLowerCase();
      const ins = (p.insurance || "").toLowerCase();

      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        dob.includes(q);

      const matchesInsurance =
        selectedInsurance === "ALL" ||
        ins.includes(selectedInsurance.toLowerCase());

      return matchesSearch && matchesInsurance;
    });
  }, [patients, searchTerm, selectedInsurance]);

  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openEditModal = (patient) => {
    setActivePatient(patient);
    setEditForm({
      name: patient.name || `${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
      first_name: patient.first_name || (patient.name ? patient.name.split(" ")[0] : ""),
      last_name: patient.last_name || (patient.name ? patient.name.split(" ").slice(1).join(" ") : ""),
      dob: patient.dob || "",
      email: patient.email || "",
      phone: patient.phone || "",
      insurance: patient.insurance || "Delta Dental PPO"
    });
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSavePatient = (e) => {
    e.preventDefault();
    const updated = {
      ...activePatient,
      ...editForm,
      name: `${editForm.first_name} ${editForm.last_name}`.trim()
    };

    // Save to state
    setPatients((prev) =>
      prev.map((p) => (p === activePatient ? updated : p))
    );

    // Save to localStorage overrides so it persists across refreshes
    const key = `${(activePatient.first_name || "").toLowerCase()}_${(activePatient.last_name || "").toLowerCase()}_${activePatient.dob || ""}`;
    const overrides = JSON.parse(localStorage.getItem("allright_patient_overrides") || "{}");
    overrides[key] = updated;
    localStorage.setItem("allright_patient_overrides", JSON.stringify(overrides));

    setActivePatient(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setIsEditing(false);
      setSaveSuccess(false);
    }, 1200);
  };

  const handleQuickVerify = (patient) => {
    navigate("/admin/insurance-verifier");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <FaHospitalUser className="text-blue-500" />
            <span>Master Patient Records • AllRight Dental (Doctor Shalini Mandapatti)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Patient Directory & Clinical Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time search, record modification, and instant insurance eligibility linkage across {patients.length.toLocaleString()} clinic records.
          </p>
        </div>

        <button
          onClick={() => {
            const newP = {
              first_name: "New",
              last_name: "Patient",
              dob: "1995-01-01",
              phone: "(215) 555-0100",
              email: "patient@example.com",
              insurance: "Delta Dental PPO"
            };
            openEditModal(newP);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <FaPlus />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, phone, email, date of birth..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedInsurance}
            onChange={(e) => {
              setSelectedInsurance(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-slate-700 font-medium"
          >
            <option value="ALL">All Insurances</option>
            <option value="Delta">Delta Dental</option>
            <option value="MetLife">MetLife</option>
            <option value="Cigna">Cigna</option>
            <option value="Guardian">Guardian</option>
            <option value="Aetna">Aetna</option>
          </select>
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-semibold">Loading practice database records...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FaUserInjured className="text-3xl text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No patient records found</p>
            <p className="text-xs text-slate-400 mt-1">Try refining your search terms or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Date of Birth</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Dental Insurance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPatients.map((p, idx) => {
                  const fullName = p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim();
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{fullName}</p>
                            <p className="text-[10px] text-slate-400">Doctor Shalini Patient</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{p.dob || "—"}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{p.phone || "—"}</td>
                      <td className="py-3.5 px-4 text-slate-600">{p.email || "—"}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <FaShieldAlt className="text-[9px]" /> {p.insurance || "Self-Pay"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <FaEdit className="text-[10px]" /> Edit
                          </button>
                          <button
                            onClick={() => handleQuickVerify(p)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition-colors cursor-pointer"
                          >
                            Verify
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredPatients.length)} of{" "}
            {filteredPatients.length} records
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Patient Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FaEdit className="text-blue-600" />
                <span>Edit Patient File</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FaTimes />
              </button>
            </div>

            {saveSuccess && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <FaCheckCircle className="text-emerald-600" />
                <span>Patient record updated and synchronized!</span>
              </div>
            )}

            <form onSubmit={handleSavePatient} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date of Birth (YYYY-MM-DD)</label>
                <input
                  type="date"
                  required
                  value={editForm.dob}
                  onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dental Insurance Plan</label>
                <input
                  type="text"
                  value={editForm.insurance}
                  onChange={(e) => setEditForm({ ...editForm, insurance: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernPatientsDirectory;

