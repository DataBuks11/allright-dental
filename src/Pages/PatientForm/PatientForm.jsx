import React, { useState } from 'react';
import { 
  FaUser, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaShieldAlt, 
  FaFileContract, 
  FaTooth, 
  FaNotesMedical, 
  FaHeartbeat, 
  FaCheckCircle, 
  FaPrint, 
  FaArrowRight, 
  FaArrowLeft, 
  FaSignature, 
  FaIdCard,
  FaFilePdf
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ALLERGIES_LIST = [
  "Penicillin",
  "Aspirin",
  "Codeine",
  "Local Anesthetics (Novocaine/Lidocaine)",
  "Latex",
  "Sulfa Drugs",
  "Acrylic",
  "Metal / Nickel",
  "Sedatives"
];

const MEDICAL_CONDITIONS_LIST = [
  "High Blood Pressure",
  "Low Blood Pressure",
  "Heart Attack / Surgery",
  "Heart Murmur",
  "Pacemaker",
  "Artificial Heart Valve",
  "Artificial Joint / Hip / Knee",
  "Diabetes",
  "Asthma / Respiratory",
  "Allergies / Sinus",
  "Hepatitis (A, B or C)",
  "Kidney Problems",
  "Liver Disease",
  "Epilepsy / Seizures",
  "Stroke",
  "Bleeding Disorders / Anemia",
  "Cancer / Tumors",
  "Chemotherapy / Radiation",
  "Thyroid Condition",
  "Arthritis / Gout",
  "Teeth Grinding / Jaw Soreness (TMJ)",
  "Fainting / Dizziness"
];

const DENTAL_REASONS = [
  "Routine Cleaning & Comprehensive Exam",
  "Sudden Toothache / Emergency Relief",
  "Porcelain Crown or Bridge Consultation",
  "Cosmetic Teeth Whitening",
  "Root Canal Therapy (Painless Endodontics)",
  "Permanent Dental Implants Consultation",
  "Dentures / Partial Dentures",
  "Custom Nightguard / Oral Appliance (Bruxism)",
  "Pediatric Dental Checkup"
];

const US_DENTAL_INSURANCES = [
  "Delta Dental (PPO / Premier)",
  "MetLife Dental",
  "Cigna Dental",
  "Guardian Life",
  "Aetna Dental PPO",
  "Humana Dental",
  "UnitedHealthcare Dental",
  "Principal Financial Group",
  "Blue Cross Blue Shield Dental",
  "Keystone First",
  "Ameritas Life",
  "Other Insurance",
  "Self-Pay / No Insurance (CareCredit 0% Financing)"
];

export default function PatientForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Demographics
    firstName: "",
    lastName: "",
    dob: "",
    gender: "male",
    phone: "",
    email: "",
    address: "",
    city: "Morrisville",
    state: "PA",
    zip: "19067",
    emergencyName: "",
    emergencyPhone: "",
    dentalReason: "Routine Cleaning & Comprehensive Exam",
    lastDentalVisit: "Within last 6 months",

    // Step 2: Medical History
    underPhysicianCare: "no",
    physicianCareDetails: "",
    recentSurgery: "no",
    surgeryDetails: "",
    headNeckInjury: "no",
    injuryDetails: "",
    takingMedications: "no",
    medicationsDetails: "",
    takenPhenFen: "no",
    takenBisphosphonates: "no", // Fosamax, Boniva, Actonel
    usesTobacco: "no",
    usesControlledSubstances: "no",
    isPregnant: "no",
    isNursing: "no",
    allergies: [],
    otherAllergies: "",
    medicalConditions: [],
    otherMedicalNotes: "",

    // Step 3: Insurance
    hasInsurance: "yes",
    insuranceProvider: "Delta Dental (PPO / Premier)",
    subscriberId: "",
    groupNumber: "",
    policyHolderName: "",
    policyHolderDob: "",
    policyHolderRelationship: "Self",

    // Step 4: Consent & Signatures
    familyDiscussionConsent: "yes",
    familyMembersAllowed: "",
    agreeTreatmentConsent: false,
    agreeAssignmentBenefits: false,
    agreeHipaaPrivacy: false,
    typedSignature: "",
    signatureDate: new Date().toISOString().split("T")[0]
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayToggle = (field, item) => {
    setFormData(prev => {
      const exists = prev[field].includes(item);
      const updated = exists 
        ? prev[field].filter(x => x !== item)
        : [...prev[field], item];
      return { ...prev, [field]: updated };
    });
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        alert("Please enter patient first and last name.");
        return false;
      }
      if (!formData.dob) {
        alert("Please select patient date of birth.");
        return false;
      }
      if (!formData.phone.trim() || !formData.email.trim()) {
        alert("Please provide both phone number and email address for appointment confirmation.");
        return false;
      }
    }
    if (step === 4) {
      if (!formData.agreeTreatmentConsent || !formData.agreeAssignmentBenefits || !formData.agreeHipaaPrivacy) {
        alert("Please check all three required HIPAA consent and treatment authorizations to proceed.");
        return false;
      }
      if (!formData.typedSignature.trim()) {
        alert("Please type your full legal name as your electronic signature.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(4, prev + 1));
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const chartNum = `CHR-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationId(chartNum);

    // Save patient directly into dynamic registered patients store
    try {
      const dynamicList = JSON.parse(localStorage.getItem('allright_dynamic_patients') || '[]');
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      
      const newRecord = {
        chart_id: chartNum,
        display_name: fullName,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        birth_date: formData.dob,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        insurance: formData.hasInsurance === 'yes' ? formData.insuranceProvider : "Self-Pay",
        subscriber_id: formData.subscriberId || "N/A",
        medical_alerts: [
          ...(formData.allergies.length > 0 ? [`Allergies: ${formData.allergies.join(', ')}`] : []),
          ...(formData.medicalConditions.length > 0 ? [`Conditions: ${formData.medicalConditions.join(', ')}`] : [])
        ],
        intake_completed_at: new Date().toISOString(),
        isNew: false
      };

      const filtered = dynamicList.filter(p => 
        (p.chart_id && p.chart_id !== chartNum) &&
        (p.display_name || "").toLowerCase() !== fullName.toLowerCase()
      );
      filtered.unshift(newRecord);
      localStorage.setItem('allright_dynamic_patients', JSON.stringify(filtered));
    } catch (err) {
      console.warn("Local storage write error:", err);
    }

    setSubmitted(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Practice Header & HIPAA Verification Card */}
        <div className="bg-white rounded-3xl shadow-md border border-blue-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs mb-2">
                  <FaShieldAlt className="text-emerald-300" /> HIPAA Compliant Online Registration
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Digital Patient Intake & Medical History</h1>
                <p className="text-blue-100 text-sm mt-1">
                  AllRight Dental PC • Doctor Shalini Mandapatti, DDS • Morrisville, PA
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/patientForm.pdf"
                  download="AllRight_Dental_Patient_Form.pdf"
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs px-4 py-2.5 rounded-full font-medium transition border border-white/30 backdrop-blur-xs"
                  title="Download paper PDF version"
                >
                  <FaFilePdf /> Download Blank PDF
                </a>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/70 border-b border-blue-100 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-blue-900 gap-2">
            <span>📍 229 Plaza Blvd, Suite 23, Morrisville, PA 19067</span>
            <span>📞 (215) 295-1348</span>
            <span className="font-semibold text-emerald-700">🔒 256-bit Bank Grade Encryption</span>
          </div>

          {/* Stepper Bar */}
          {!submitted && (
            <div className="px-6 py-4 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between max-w-2xl mx-auto relative">
                {[
                  { step: 1, label: "Demographics", icon: FaUser },
                  { step: 2, label: "Medical History", icon: FaNotesMedical },
                  { step: 3, label: "Insurance", icon: FaIdCard },
                  { step: 4, label: "HIPAA & Consent", icon: FaFileContract },
                ].map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = currentStep === s.step;
                  const isDone = currentStep > s.step;
                  return (
                    <div key={s.step} className="flex flex-col items-center z-10">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep > s.step) setCurrentStep(s.step);
                        }}
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                          isDone 
                            ? "bg-emerald-600 text-white" 
                            : isActive 
                              ? "bg-[#003BC4] text-white ring-4 ring-blue-100 scale-105" 
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isDone ? <FaCheckCircle /> : <Icon />}
                      </button>
                      <span className={`text-[11px] sm:text-xs mt-1.5 font-medium ${
                        isActive ? "text-[#003BC4] font-bold" : isDone ? "text-emerald-700" : "text-gray-400"
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Success Confirmation View */}
        {submitted ? (
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 sm:p-10 text-center animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <FaCheckCircle />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Intake Completed & Verified
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 mb-2">
              Welcome to AllRight Dental, {formData.firstName}!
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-6">
              Your digital patient intake form and medical history have been securely encrypted and submitted directly to 
              <strong> Doctor Shalini Mandapatti, DDS</strong>.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left mb-8 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Patient Chart ID:</span>
                <span className="font-bold text-[#003BC4]">{confirmationId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Patient Name:</span>
                <span className="font-semibold text-gray-800">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Date of Birth:</span>
                <span className="font-medium text-gray-800">{formData.dob}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Insurance on File:</span>
                <span className="font-medium text-gray-800">{formData.hasInsurance === 'yes' ? formData.insuranceProvider : "Self-Pay"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Reason for Visit:</span>
                <span className="font-medium text-gray-800">{formData.dentalReason}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Signed Electronically by:</span>
                <span className="font-semibold text-emerald-700">{formData.typedSignature} ({formData.signatureDate})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-semibold transition"
              >
                <FaPrint /> Print / Save PDF Receipt
              </button>
              <Link
                to="/Appointment"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] hover:opacity-95 text-white px-7 py-3 rounded-full text-sm font-bold shadow-md transition"
              >
                Book Appointment Time <FaArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-Step Intake Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-10">
            
            {/* STEP 1: PATIENT DEMOGRAPHICS & CONTACT */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-[#003BC4]" /> 1. Patient Demographics & Contact
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Please provide accurate personal information for your dental chart and billing.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Piyush"
                      required
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Junghare"
                      required
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(215) 555-0199"
                      required
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Home Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Apt 4"
                    className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">ZIP</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Contact Full Name</label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Smith (Spouse/Parent)"
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="(215) 555-0144"
                      className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Reason for Visiting AllRight Dental *</label>
                  <select
                    name="dentalReason"
                    value={formData.dentalReason}
                    onChange={handleChange}
                    className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                  >
                    {DENTAL_REASONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: MEDICAL HISTORY (EXACT MATCH TO CLINIC PAPER FORM PAGE 1) */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaNotesMedical className="text-[#003BC4]" /> 2. Confidential Medical History
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Although dental personnel primarily treat the oral cavity, medical conditions and medications can directly impact dental safety, anesthesia, and recovery.
                  </p>
                </div>

                {/* Yes/No General Health Questions */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-gray-200/80 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Are you currently under a physician's active care?</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="underPhysicianCare" value="yes" checked={formData.underPhysicianCare === 'yes'} onChange={handleChange} /> Yes
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="underPhysicianCare" value="no" checked={formData.underPhysicianCare === 'no'} onChange={handleChange} /> No
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Have you ever been hospitalized or had a major surgical operation?</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="recentSurgery" value="yes" checked={formData.recentSurgery === 'yes'} onChange={handleChange} /> Yes
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="recentSurgery" value="no" checked={formData.recentSurgery === 'no'} onChange={handleChange} /> No
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Have you ever had a serious head or neck injury?</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="headNeckInjury" value="yes" checked={formData.headNeckInjury === 'yes'} onChange={handleChange} /> Yes
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="headNeckInjury" value="no" checked={formData.headNeckInjury === 'no'} onChange={handleChange} /> No
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Are you taking any prescription medications, pills, or blood thinners?</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="takingMedications" value="yes" checked={formData.takingMedications === 'yes'} onChange={handleChange} /> Yes
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="takingMedications" value="no" checked={formData.takingMedications === 'no'} onChange={handleChange} /> No
                      </label>
                    </div>
                  </div>
                  {formData.takingMedications === 'yes' && (
                    <input
                      type="text"
                      name="medicationsDetails"
                      value={formData.medicationsDetails}
                      onChange={handleChange}
                      placeholder="Please list all current medications, dosages, or blood thinners..."
                      className="w-full text-xs border border-blue-300 rounded-lg p-2 bg-white"
                    />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Have you ever taken Fosamax, Boniva, Actonel, or bone density bisphosphonates?</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="takenBisphosphonates" value="yes" checked={formData.takenBisphosphonates === 'yes'} onChange={handleChange} /> Yes
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="takenBisphosphonates" value="no" checked={formData.takenBisphosphonates === 'no'} onChange={handleChange} /> No
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                    <span className="text-gray-700 font-medium">Do you smoke, vape, or use tobacco products?</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="usesTobacco" value="yes" checked={formData.usesTobacco === 'yes'} onChange={handleChange} /> Yes
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="usesTobacco" value="no" checked={formData.usesTobacco === 'no'} onChange={handleChange} /> No
                      </label>
                    </div>
                  </div>

                  {formData.gender === 'female' && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="font-semibold text-gray-800 mb-1">Women Only:</p>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" name="isPregnant" checked={formData.isPregnant === 'yes'} onChange={(e) => setFormData(p => ({ ...p, isPregnant: e.target.checked ? 'yes' : 'no' }))} />
                          Pregnant / Trying to get pregnant
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" name="isNursing" checked={formData.isNursing === 'yes'} onChange={(e) => setFormData(p => ({ ...p, isNursing: e.target.checked ? 'yes' : 'no' }))} />
                          Nursing
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Allergies Checklist */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Are you allergic to any of the following? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALLERGIES_LIST.map(a => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => handleArrayToggle('allergies', a)}
                        className={`text-xs px-3 py-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                          formData.allergies.includes(a)
                            ? "bg-red-50 border-red-400 text-red-800 font-semibold"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{a}</span>
                        {formData.allergies.includes(a) && <FaCheckCircle className="text-red-500 text-xs shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    name="otherAllergies"
                    value={formData.otherAllergies}
                    onChange={handleChange}
                    placeholder="Other allergies (food, metals, seasonal, dyes)..."
                    className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2 mt-2 focus:border-[#003BC4] focus:outline-none"
                  />
                </div>

                {/* Medical Conditions Grid */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Do you have, or have you ever had, any of the following medical conditions?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-50 border border-gray-200 rounded-2xl">
                    {MEDICAL_CONDITIONS_LIST.map(cond => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => handleArrayToggle('medicalConditions', cond)}
                        className={`text-xs px-3 py-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                          formData.medicalConditions.includes(cond)
                            ? "bg-blue-100 border-[#003BC4] text-[#003BC4] font-semibold shadow-xs"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="truncate">{cond}</span>
                        {formData.medicalConditions.includes(cond) && <FaCheckCircle className="text-[#003BC4] text-xs shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DENTAL INSURANCE & COVERAGE */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaIdCard className="text-[#003BC4]" /> 3. Dental Insurance & Coverage
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    AllRight Dental accepts most PPO plans and verifies benefits for $0 copay preventive cleanings.
                  </p>
                </div>

                <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-blue-950">Will you be using Dental Insurance for your visit?</span>
                  <div className="flex items-center gap-4 text-xs sm:text-sm">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-800">
                      <input type="radio" name="hasInsurance" value="yes" checked={formData.hasInsurance === 'yes'} onChange={handleChange} /> Yes (Insured)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-800">
                      <input type="radio" name="hasInsurance" value="no" checked={formData.hasInsurance === 'no'} onChange={handleChange} /> No (Self-Pay / CareCredit)
                    </label>
                  </div>
                </div>

                {formData.hasInsurance === 'yes' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Dental Insurance Payer *</label>
                      <select
                        name="insuranceProvider"
                        value={formData.insuranceProvider}
                        onChange={handleChange}
                        className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                      >
                        {US_DENTAL_INSURANCES.map(ins => (
                          <option key={ins} value={ins}>{ins}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Member / Subscriber ID # *</label>
                        <input
                          type="text"
                          name="subscriberId"
                          value={formData.subscriberId}
                          onChange={handleChange}
                          placeholder="e.g. 104928342"
                          className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Group Number</label>
                        <input
                          type="text"
                          name="groupNumber"
                          value={formData.groupNumber}
                          onChange={handleChange}
                          placeholder="e.g. GRP-9821"
                          className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Policyholder / Subscriber Name</label>
                        <input
                          type="text"
                          name="policyHolderName"
                          value={formData.policyHolderName || `${formData.firstName} ${formData.lastName}`}
                          onChange={handleChange}
                          placeholder="Full name on insurance card"
                          className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Relationship to Patient</label>
                        <select
                          name="policyHolderRelationship"
                          value={formData.policyHolderRelationship}
                          onChange={handleChange}
                          className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                        >
                          <option value="Self">Self</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Child">Child</option>
                          <option value="Guardian">Legal Guardian</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Policyholder Date of Birth</label>
                        <input
                          type="date"
                          name="policyHolderDob"
                          value={formData.policyHolderDob || formData.dob}
                          onChange={handleChange}
                          className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-900">
                    <p className="font-bold mb-1">No Insurance? No Problem!</p>
                    <p className="leading-relaxed">
                      AllRight Dental offers clear upfront pricing and participates with CareCredit for 0% interest monthly payment plans. Doctor Shalini Mandapatti will review all treatment options prior to care.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: HIPAA COMPLIANCE, TREATMENT CONSENT & DIGITAL SIGNATURE */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaFileContract className="text-[#003BC4]" /> 4. HIPAA Consent & Treatment Authorization
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Exact legal provisions as required by federal HIPAA privacy laws and Pennsylvania Dental Board regulations.
                  </p>
                </div>

                {/* HIPAA Privacy Notice Box */}
                <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-700 max-h-48 overflow-y-auto space-y-2 leading-relaxed">
                  <p className="font-bold text-gray-900">Notice of Privacy Practices & HIPAA Compliance (45 CFR § 164.520):</p>
                  <p>
                    AllRight Dental PC is dedicated to safeguarding your protected health information (PHI). We use bank-grade AES-256 encryption and follow strict HIPAA Security Rules. By signing below, you consent to the use and disclosure of your protected health information for treatment, billing, insurance claims, and healthcare operations. You have the right to request restrictions on disclosures or review your records at any time.
                  </p>
                  <p className="font-bold text-gray-900 pt-1">Consent for Treatment & Assignment of Benefits:</p>
                  <p>
                    The undersigned hereby authorizes AllRight Dental PC and Doctor Shalini Mandapatti, DDS to perform dental examinations, take digital X-rays, study models, photographs, and diagnostic aids, and perform necessary dental therapies with local anesthesia. I authorize direct payment of dental benefits to AllRight Dental PC. I understand that I am financially responsible for any charges not covered by my dental insurance.
                  </p>
                  <p className="text-gray-500 text-[11px] pt-1 border-t border-gray-200">
                    * Practice Policy: Medical release records/X-ray duplication fee is $50.00. Late cancellation fee for cancellations made less than 24 hours prior to appointment is $25.00.
                  </p>
                </div>

                {/* Family Discussion Consent */}
                <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs sm:text-sm space-y-2">
                  <label className="font-semibold text-gray-800 block">
                    May we discuss your medical / dental condition with designated family members?
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="familyDiscussionConsent" value="yes" checked={formData.familyDiscussionConsent === 'yes'} onChange={handleChange} /> Yes
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="familyDiscussionConsent" value="no" checked={formData.familyDiscussionConsent === 'no'} onChange={handleChange} /> No
                    </label>
                  </div>
                  {formData.familyDiscussionConsent === 'yes' && (
                    <input
                      type="text"
                      name="familyMembersAllowed"
                      value={formData.familyMembersAllowed}
                      onChange={handleChange}
                      placeholder="Enter allowed family member names and relationship..."
                      className="w-full text-xs border border-blue-300 rounded-xl p-2 bg-white mt-1"
                    />
                  )}
                </div>

                {/* Mandatory Checkboxes */}
                <div className="space-y-3 pt-1 text-xs sm:text-sm">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeHipaaPrivacy"
                      checked={formData.agreeHipaaPrivacy}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-[#003BC4] rounded border-gray-300 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-gray-700">
                      <strong>I have reviewed and acknowledge the HIPAA Notice of Privacy Practices</strong> and consent to the use of my health information for treatment and billing operations.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTreatmentConsent"
                      checked={formData.agreeTreatmentConsent}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-[#003BC4] rounded border-gray-300 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-gray-700">
                      <strong>I authorize Doctor Shalini Mandapatti, DDS</strong> to perform dental exams, diagnostic X-rays, and recommended treatment.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeAssignmentBenefits"
                      checked={formData.agreeAssignmentBenefits}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-[#003BC4] rounded border-gray-300 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-gray-700">
                      <strong>I agree to the Assignment of Insurance Benefits</strong> and understand I am responsible for copays and balances not covered by insurance.
                    </span>
                  </label>
                </div>

                {/* Digital Signature Field */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-blue-200 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <FaSignature className="text-[#003BC4] text-base" /> Legal Electronic Signature *
                  </label>
                  <p className="text-xs text-gray-600">
                    Type your full legal name below. By typing your name, you acknowledge this digital signature carries the same legal validity as a handwritten signature under the federal ESIGN Act (15 U.S.C. § 7001).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        name="typedSignature"
                        value={formData.typedSignature}
                        onChange={handleChange}
                        placeholder="e.g. Piyush Junghare"
                        required
                        className="w-full text-sm font-semibold border-2 border-blue-300 rounded-xl px-4 py-2.5 focus:border-[#003BC4] focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        name="signatureDate"
                        value={formData.signatureDate}
                        onChange={handleChange}
                        className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#003BC4] focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  <FaArrowLeft /> Back
                </button>
              ) : <div></div>}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-[#003BC4] hover:bg-[#002FA0] text-white px-7 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition"
                >
                  Continue <FaArrowRight />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white px-8 py-3.5 rounded-full text-sm font-extrabold shadow-lg transition active:scale-95"
                >
                  <FaCheckCircle /> Complete & Submit Digital Intake
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
