import React, { useState } from "react";
import {
  US_DENTAL_PAYERS,
  CLINIC_CREDENTIALS,
  verifyDentalInsurance
} from "../../services/insuranceVerificationService";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSearch,
  FaFileInvoiceDollar,
  FaTooth,
  FaUserCheck,
  FaPrint,
  FaCode,
  FaHospitalAlt
} from "react-icons/fa";

const ModernInsuranceVerifier = () => {
  const [payerId, setPayerId] = useState("00430");
  const [subscriberId, setSubscriberId] = useState("DEL-89234190");
  const [groupNumber, setGroupNumber] = useState("GRP-PA-104");
  const [firstName, setFirstName] = useState("Piyush");
  const [lastName, setLastName] = useState("Junghare");
  const [dob, setDob] = useState("2005-05-20");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showEdi, setShowEdi] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyDentalInsurance({
        payerId,
        subscriberId,
        groupNumber,
        firstName,
        lastName,
        dob
      });
      setResult(res);
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (type) => {
    if (type === "delta") {
      setPayerId("00430");
      setSubscriberId("DEL-89234190");
      setGroupNumber("GRP-PA-104");
      setFirstName("Piyush");
      setLastName("Junghare");
      setDob("2005-05-20");
    } else if (type === "metlife") {
      setPayerId("65978");
      setSubscriberId("MET-77291032");
      setGroupNumber("ML-CORP-99");
      setFirstName("Michael");
      setLastName("Scott");
      setDob("1978-03-15");
    } else if (type === "cigna") {
      setPayerId("62308");
      setSubscriberId("CIG-44918230");
      setGroupNumber("CG-ALLRIGHT-01");
      setFirstName("Sarah");
      setLastName("Connor");
      setDob("1984-11-28");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <FaShieldAlt className="text-emerald-500" />
            <span>US Clearinghouse Real-Time Verification (ANSI ASC X12 EDI 270/271)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Real-Time Dental Insurance Eligibility Verifier
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Instant policy active status, remaining annual maximums, deductibles, and ADA procedure copays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Quick Samples:</span>
          <button
            type="button"
            onClick={() => handleLoadSample("delta")}
            className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
          >
            Delta Dental
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample("metlife")}
            className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-semibold hover:bg-teal-100 transition-colors"
          >
            MetLife
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample("cigna")}
            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors"
          >
            Cigna
          </button>
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleVerify} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FaSearch className="text-blue-600" /> Subscriber & Payer Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Payer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dental Payer (US Electronic ID)
            </label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium text-slate-800"
            >
              {US_DENTAL_PAYERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Payer ID: {p.id})
                </option>
              ))}
            </select>
          </div>

          {/* Member ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subscriber / Member ID
            </label>
            <input
              type="text"
              required
              value={subscriberId}
              onChange={(e) => setSubscriberId(e.target.value)}
              placeholder="e.g. DEL-89234190"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium text-slate-800"
            />
          </div>

          {/* Group Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Group / Plan Number
            </label>
            <input
              type="text"
              value={groupNumber}
              onChange={(e) => setGroupNumber(e.target.value)}
              placeholder="e.g. GRP-PA-104"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium text-slate-800"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient First Name
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium text-slate-800"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Last Name
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium text-slate-800"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Birth (YYYY-MM-DD)
            </label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium text-slate-800"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <FaHospitalAlt className="text-slate-400" />
            <span>Rendering Provider: <b>Doctor Shalini Mandapatti, DDS</b> (NPI: 1295784930)</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Connecting to Clearinghouse...</span>
              </>
            ) : (
              <>
                <FaShieldAlt />
                <span>Verify Real-Time Eligibility</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Verification Result Display */}
      {result && (
        <div className="space-y-5 animate-fade-in">
          {/* Status Header Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
                  <FaCheckCircle />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Coverage Active & Eligible</h2>
                    <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      IN-NETWORK
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Verification ID: <span className="font-mono font-bold text-slate-700">{result.verificationId}</span> • 
                    Payer: <span className="font-semibold text-slate-800">{result.payer.name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEdi(!showEdi)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <FaCode className="text-xs" />
                  <span>{showEdi ? "Hide EDI 270 Payload" : "View Raw EDI 270"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <FaPrint className="text-xs" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* EDI Raw Viewer Accordion */}
            {showEdi && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-teal-300 font-mono text-[11px] overflow-x-auto shadow-inner leading-relaxed">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  ANSI ASC X12 EDI 270 Healthcare Eligibility Inquiry (EDIFACT)
                </div>
                <pre>{result.edi270Payload}</pre>
              </div>
            )}

            {/* Financials Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Annual Maximum</span>
                <p className="text-xl font-black text-slate-900 mt-1">${result.financials.annualMaximum.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400">Benefit Year Calendar</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase">Remaining Balance</span>
                <p className="text-xl font-black text-emerald-700 mt-1">${result.financials.annualMaximumRemaining.toFixed(2)}</p>
                <p className="text-[10px] text-emerald-600">Available For Treatment</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Deductible (Indiv.)</span>
                <p className="text-xl font-black text-slate-900 mt-1">${result.financials.individualDeductible.toFixed(2)}</p>
                <p className="text-[10px] text-emerald-600 font-semibold">
                  {result.financials.deductibleMet ? "✓ Fully Met ($0 remaining)" : `$${result.financials.deductibleRemaining} Remaining`}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                <span className="text-[11px] font-semibold text-blue-800 uppercase">Lead Provider</span>
                <p className="text-xs font-bold text-blue-900 mt-1.5 leading-tight">Doctor Shalini Mandapatti</p>
                <p className="text-[10px] text-blue-700">Preferred Tier 1 Provider</p>
              </div>
            </div>
          </div>

          {/* ADA Procedure Benefit Coverage Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaTooth className="text-teal-600" />
              <span>ADA Dental Procedure Benefit Breakdown & Co-Insurance</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/80">
                    <th className="py-2.5 px-3">Service Category</th>
                    <th className="py-2.5 px-3">ADA Codes</th>
                    <th className="py-2.5 px-3 text-center">Plan Pays</th>
                    <th className="py-2.5 px-3 text-center">Patient Co-Pay</th>
                    <th className="py-2.5 px-3">Deductible Applies</th>
                    <th className="py-2.5 px-3">Limitations & Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.coverageCategories.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{c.category}</td>
                      <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">{c.codes}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {c.coveragePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                          {c.patientResponsibilityPercent}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {c.deductibleApplies ? (
                          <span className="text-amber-700 font-semibold">Yes</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">Waived (No Deductible)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">{c.limitations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernInsuranceVerifier;

