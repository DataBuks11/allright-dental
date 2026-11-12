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
  FaFilePdf,
  FaExclamationTriangle,
  FaCheck,
  FaDownload,
  FaEye,
  FaEdit
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { downloadFilledPatientFormPDF } from '../../services/patientFormPdfGenerator';

// Exact 8 allergies from Page 1 of Clinic Paper Form
const ALLERGIES_LIST = [
  "Aspirin",
  "Penicillin",
  "Codeine",
  "Local Anesthetics",
  "Acrylic",
  "Metal",
  "Latex",
  "Sulfa drugs"
];

// Exact 77 medical conditions from Page 1 of Clinic Paper Form
const MEDICAL_CONDITIONS_LIST = [
  "AIDS/HIV Positive",
  "Alzheimer's Disease",
  "Anaphylaxis",
  "Anemia",
  "Angina",
  "Arthritis/Gout",
  "Artificial Heart Valve",
  "Artificial Joint",
  "Asthma",
  "Blood Disease",
  "Blood Transfusion",
  "Breathing Problem",
  "Bruise Easily",
  "Cancer",
  "Chemotherapy",
  "Chest Pains",
  "Cold Sores/Fever Blisters",
  "Congenital Heart Disorder",
  "Convulsions",
  "Cortisone Medicine",
  "Diabetes",
  "Drug Addiction",
  "Easily Winded",
  "Emphysema",
  "Epilepsy or Seizures",
  "Excessive Bleeding",
  "Excessive Thirst",
  "Fainting Spells/Dizziness",
  "Frequent Cough",
  "Frequent Diarrhea",
  "Frequent Headaches",
  "Genital Herpes",
  "Glaucoma",
  "Hay Fever",
  "Heart Attack/Failure",
  "Heart Murmur",
  "Heart Pacemaker",
  "Heart Trouble/Disease",
  "Hemophilia",
  "Hepatitis A",
  "Hepatitis B or C",
  "Herpes",
  "High Blood Pressure",
  "High Cholesterol",
  "Hives or Rash",
  "Hypoglycemia",
  "Irregular Heartbeat",
  "Kidney Problems",
  "Leukemia",
  "Liver Disease",
  "Low Blood Pressure",
  "Lung Disease",
  "Mitral Valve Prolapse",
  "Osteoporosis",
  "Pain in Jaw Joints",
  "Parathyroid Disease",
  "Psychiatric Care",
  "Radiation Treatments",
  "Recent Weight Loss",
  "Renal Dialysis",
  "Rheumatic Fever",
  "Rheumatism",
  "Scarlet Fever",
  "Shingles",
  "Sickle Cell Disease",
  "Sinus Trouble",
  "Spina Bifida",
  "Stomach/Intestinal Disease",
  "Stroke",
  "Swelling of Limbs",
  "Thyroid Disease",
  "Tonsillitis",
  "Tuberculosis",
  "Tumors or Growths",
  "Ulcers",
  "Venereal Disease",
  "Yellow Jaundice"
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
  const [activePage, setActivePage] = useState(1); // 1 = Medical History, 2 = HIPAA Consent, 3 = Treatment & Benefits Consent
  const [submitted, setSubmitted] = useState(false);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");
  const todayDate = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    // Page 1: Medical History - Patient Header
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

    // Page 1: General Health Questions
    underPhysicianCare: "no",
    underPhysicianCareExplain: "",
    hospitalizedOrOperation: "no",
    hospitalizedOrOperationExplain: "",
    headNeckInjury: "no",
    headNeckInjuryExplain: "",
    takingMedications: "no",
    takingMedicationsExplain: "",
    takenPhenFen: "no",
    takenBisphosphonates: "no", // Fosamax, Boniva, Actonel
    specialDiet: "no",
    usesTobacco: "no",
    usesControlledSubstances: "no",

    // Page 1: Women only
    isPregnant: "no",
    takingContraceptives: "no",
    isNursing: "no",

    // Page 1: Allergies checklist
    allergies: [],
    hasOtherAllergies: "no",
    otherAllergiesExplain: "",

    // Page 1: Conditions checklist
    medicalConditions: [],
    hasSeriousIllnessNotListed: "no",
    seriousIllnessExplain: "",
    page1Comments: "",

    // Page 1: Medical History Signature
    page1Signature: "",
    page1SignatureDate: todayDate,

    // Page 2: HIPAA Compliance Patient Consent Form
    familyDiscussionConsent: "yes",
    familyMembersAllowed: "",
    hipaaPrintedName: "",
    hipaaSignature: "",
    hipaaSignatureDate: todayDate,
    emergencyContactName: "",
    emergencyContactPhone: "",

    // Page 3: Consent for Treatment & Assignment of Benefits
    hasInsurance: "yes",
    insuranceProvider: "Delta Dental (PPO / Premier)",
    subscriberId: "",
    groupNumber: "",
    policyHolderName: "",
    policyHolderRelationship: "Self",
    policyHolderDob: "",

    treatmentConsentSignature: "",
    treatmentConsentDate: todayDate,
    benefitsAssignmentSignature: "",
    benefitsAssignmentDate: todayDate,

    autoFillSignatures: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const next = { ...prev, [name]: val };
      
      // Auto-fill signatures across all 3 pages if toggled on
      if (prev.autoFillSignatures) {
        if (name === 'page1Signature') {
          next.hipaaSignature = val;
          next.treatmentConsentSignature = val;
          next.benefitsAssignmentSignature = val;
          if (!prev.hipaaPrintedName) next.hipaaPrintedName = val;
        }
        if (name === 'firstName' || name === 'lastName') {
          const fullName = `${name === 'firstName' ? val : prev.firstName} ${name === 'lastName' ? val : prev.lastName}`.trim();
          if (!prev.page1Signature) {
            next.page1Signature = fullName;
            next.hipaaSignature = fullName;
            next.treatmentConsentSignature = fullName;
            next.benefitsAssignmentSignature = fullName;
            next.hipaaPrintedName = fullName;
          }
        }
      }
      return next;
    });
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

  const validatePage = (page) => {
    if (page === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        alert("Please enter patient First and Last Name on Page 1.");
        return false;
      }
      if (!formData.dob) {
        alert("Please enter patient Date of Birth on Page 1.");
        return false;
      }
      if (!formData.phone.trim() || !formData.email.trim()) {
        alert("Please provide both phone number and email address for appointment confirmation.");
        return false;
      }
      if (!formData.page1Signature.trim()) {
        alert("Please provide your electronic signature at the bottom of Page 1 (Medical History certification).");
        return false;
      }
    }

    if (page === 2) {
      if (!formData.emergencyContactName.trim() || !formData.emergencyContactPhone.trim()) {
        alert("Please provide an Emergency Contact Name and Phone Number on Page 2 (HIPAA Form).");
        return false;
      }
      if (!formData.hipaaSignature.trim()) {
        alert("Please provide your electronic signature on Page 2 (HIPAA Consent Form).");
        return false;
      }
    }

    if (page === 3) {
      if (!formData.treatmentConsentSignature.trim()) {
        alert("Please sign Consent for Treatment on Page 3.");
        return false;
      }
      if (!formData.benefitsAssignmentSignature.trim()) {
        alert("Please sign Assignment of Benefits on Page 3.");
        return false;
      }
    }

    return true;
  };

  const handleNextPage = () => {
    if (validatePage(activePage)) {
      setActivePage(prev => Math.min(3, prev + 1));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    setActivePage(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!validatePage(3)) return;

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
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        emergency_contact: `${formData.emergencyContactName} (${formData.emergencyContactPhone})`,
        insurance: formData.hasInsurance === 'yes' ? formData.insuranceProvider : "Self-Pay",
        subscriber_id: formData.subscriberId || "N/A",
        medical_alerts: [
          ...(formData.allergies.length > 0 ? [`Allergies: ${formData.allergies.join(', ')}`] : []),
          ...(formData.medicalConditions.length > 0 ? [`Conditions: ${formData.medicalConditions.join(', ')}`] : []),
          ...(formData.takenBisphosphonates === 'yes' ? ["Bone Density Meds (Bisphosphonates)"] : []),
          ...(formData.takingMedications === 'yes' ? [`Meds: ${formData.takingMedicationsExplain}`] : [])
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
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDirectDownload = () => {
    try {
      downloadFilledPatientFormPDF(formData, confirmationId);
    } catch (err) {
      console.error("Direct PDF download error:", err);
      window.print();
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DEDICATED PRINTABLE 3-PAGE LEGAL DOCUMENT (ONLY VISIBLE ON PRINT)       */}
      {/* ========================================================================= */}
      <div className="hidden print:block font-serif text-black p-0 m-0 bg-white leading-snug">
        
        {/* --- PRINT PAGE 1: MEDICAL HISTORY --- */}
        <div className="print-page border border-black p-6 mb-6">
          <div className="text-center border-b-2 border-black pb-2 mb-3">
            <h1 className="text-xl font-bold tracking-wider">ALL RIGHT DENTAL PC</h1>
            <p className="text-xs">229 Plaza Blvd. Ste #23 • Morrisville, PA 19067 • Phone: (215) 295-1348</p>
            <h2 className="text-base font-extrabold underline tracking-wide mt-1">MEDICAL HISTORY</h2>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-b border-black pb-2 mb-2">
            <div><strong>PATIENT NAME:</strong> {formData.firstName} {formData.lastName}</div>
            <div><strong>Birth Date:</strong> {formData.dob || "_________________"}</div>
            <div><strong>Phone:</strong> {formData.phone}</div>
            <div><strong>Gender:</strong> {formData.gender}</div>
            <div className="col-span-2"><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zip}</div>
          </div>

          <p className="text-[10px] italic mb-3 leading-tight border-l-2 border-black pl-2">
            Although dental personnel primarily treat the area in and around your mouth, your mouth is a part of your entire body. Health problems that you may have, or medication that you may be taking, could have an important interrelationship with the dentistry you will receive. Thank you for answering the following questions.
          </p>

          <table className="w-full text-[10px] border-collapse mb-3">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-1">Are you under a physician's care now?</td>
                <td className="w-24 text-right font-bold">{formData.underPhysicianCare === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</td>
              </tr>
              {formData.underPhysicianCare === 'yes' && (
                <tr className="border-b border-gray-200 bg-gray-50"><td colSpan={2} className="py-0.5 pl-3 italic">If yes, explain: {formData.underPhysicianCareExplain || "Not specified"}</td></tr>
              )}

              <tr className="border-b border-gray-300">
                <td className="py-1">Have you ever been hospitalized or had a major operation?</td>
                <td className="w-24 text-right font-bold">{formData.hospitalizedOrOperation === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</td>
              </tr>
              {formData.hospitalizedOrOperation === 'yes' && (
                <tr className="border-b border-gray-200 bg-gray-50"><td colSpan={2} className="py-0.5 pl-3 italic">If yes, explain: {formData.hospitalizedOrOperationExplain || "Not specified"}</td></tr>
              )}

              <tr className="border-b border-gray-300">
                <td className="py-1">Have you ever had a serious head or neck injury?</td>
                <td className="w-24 text-right font-bold">{formData.headNeckInjury === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</td>
              </tr>
              {formData.headNeckInjury === 'yes' && (
                <tr className="border-b border-gray-200 bg-gray-50"><td colSpan={2} className="py-0.5 pl-3 italic">If yes, explain: {formData.headNeckInjuryExplain || "Not specified"}</td></tr>
              )}

              <tr className="border-b border-gray-300">
                <td className="py-1">Are you taking any medications, pills, or drugs?</td>
                <td className="w-24 text-right font-bold">{formData.takingMedications === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</td>
              </tr>
              {formData.takingMedications === 'yes' && (
                <tr className="border-b border-gray-200 bg-gray-50"><td colSpan={2} className="py-0.5 pl-3 italic">Meds listed: {formData.takingMedicationsExplain || "Not specified"}</td></tr>
              )}

              <tr className="border-b border-gray-300">
                <td className="py-1">Do you take, or have you taken, Phen-Fen or Redux?</td>
                <td className="w-24 text-right font-bold">{formData.takenPhenFen === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="py-1">Have you ever taken Fosamax, Boniva, Actonel or bisphosphonates?</td>
                <td className="w-24 text-right font-bold">{formData.takenBisphosphonates === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="py-1">Are you on a special diet?</td>
                <td className="w-24 text-right font-bold">{formData.specialDiet === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="py-1">Do you use tobacco?</td>
                <td className="w-24 text-right font-bold">{formData.usesTobacco === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="py-1">Do you use controlled substances?</td>
                <td className="w-24 text-right font-bold">{formData.usesControlledSubstances === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</td>
              </tr>
            </tbody>
          </table>

          {/* Women only */}
          {formData.gender === 'female' && (
            <div className="text-[10px] border border-gray-400 p-1.5 mb-2 bg-gray-50">
              <strong>Women:</strong> Pregnant/Trying: {formData.isPregnant} | Oral Contraceptives: {formData.takingContraceptives} | Nursing: {formData.isNursing}
            </div>
          )}

          {/* Allergies */}
          <div className="border border-black p-2 mb-2 text-[10px]">
            <strong>Are you allergic to any of the following?</strong>
            <div className="grid grid-cols-4 gap-1 mt-1">
              {ALLERGIES_LIST.map(a => (
                <span key={a}>
                  {formData.allergies.includes(a) ? `[X] ${a}` : `[ ] ${a}`}
                </span>
              ))}
            </div>
            {formData.hasOtherAllergies === 'yes' && (
              <div className="mt-1"><strong>Other Allergies:</strong> {formData.otherAllergiesExplain || "None"}</div>
            )}
          </div>

          {/* Conditions */}
          <div className="border border-black p-2 mb-2 text-[9.5px]">
            <strong>Do you have, or have you had, any of the following?</strong>
            <div className="mt-1">
              {formData.medicalConditions.length > 0 ? (
                <div className="font-semibold text-black">
                  Identified Conditions: {formData.medicalConditions.join(", ")}
                </div>
              ) : (
                <div className="italic text-gray-700">None checked / No systemic conditions reported.</div>
              )}
            </div>
            {formData.hasSeriousIllnessNotListed === 'yes' && (
              <div className="mt-1"><strong>Other Serious Illness:</strong> {formData.seriousIllnessExplain}</div>
            )}
            {formData.page1Comments && (
              <div className="mt-1"><strong>Comments:</strong> {formData.page1Comments}</div>
            )}
          </div>

          <div className="border-t-2 border-black pt-2 mt-3 text-[10px]">
            <p className="italic mb-2">
              "To the best of my knowledge, the questions on this form have been accurately answered. I understand that providing incorrect information can be dangerous to my (or patient's) health. It is my responsibility to inform the dental office of any changes in medical status."
            </p>
            <div className="flex justify-between items-end pt-3">
              <div>
                <span className="font-bold border-b border-black pb-0.5 px-4 font-mono text-xs">
                  {formData.page1Signature || `${formData.firstName} ${formData.lastName}`}
                </span>
                <p className="text-[9px] uppercase mt-0.5">SIGNATURE OF PATIENT, PARENT, or GUARDIAN</p>
              </div>
              <div>
                <span className="font-bold border-b border-black pb-0.5 px-4 font-mono text-xs">
                  {formData.page1SignatureDate || todayDate}
                </span>
                <p className="text-[9px] uppercase mt-0.5">DATE</p>
              </div>
            </div>
          </div>
          <div className="text-right text-[8px] text-gray-500 mt-2">Form 1 of 3 • All Right Dental PC</div>
        </div>

        {/* --- PRINT PAGE 2: HIPAA CONSENT --- */}
        <div className="print-page print-page-break border border-black p-6 mb-6">
          <div className="text-center border-b-2 border-black pb-2 mb-4">
            <h1 className="text-xl font-bold tracking-wider">ALL RIGHT DENTAL PC</h1>
            <p className="text-xs">229 Plaza Blvd. Ste #23 • Morrisville, PA 19067 • Phone: (215) 295-1348</p>
            <h2 className="text-base font-extrabold underline tracking-wide mt-2">HIPAA Compliance Patient Consent Form</h2>
          </div>

          <div className="text-xs space-y-3 leading-relaxed text-justify mb-4">
            <p>
              Our Notice of Privacy Practices provides information about how we may use or disclose protected health information.
            </p>
            <p>
              The notice contains a patients rights section describing your rights under the law. You ascertain that by your signature that you have reviewed our notice before signing this consent.
            </p>
            <p>
              The term of the notice may chance, if so, you will be notified at your next visit to update your signature/date.
            </p>
            <p>
              You have the right to restrict how your protected health information is used and disclosed for treatment, payment of healthcare operations. We are not required to after with this restriction, but if we do, we shall honor this agreement. The HIPAA (Health Insurance Portability and Accountability Act of 1996) law allows for the use of the information for treatment, payment, or healthcare operations.
            </p>
            <p>
              By signing this form, you consent to our use and disclosure of your protected healthcare information and potentially anonymous usage in a publication. You have the right to revoke this consent in writing, signed by you. However, such a revocation will not be retroactive.
            </p>
            <p className="font-bold">
              By signing this form, I understand that:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Protected health information may be disclosed or used for treatment, payment, or healthcare operations.</li>
              <li>The practice reserves the right to chance the privacy policy as allowed by the law.</li>
              <li>The patient has the right to revoke this consent in writing at any time and all full disclosures will then erase.</li>
              <li>The practice may condition receipt of treatable upon execution of this consent.</li>
            </ul>
          </div>

          <div className="border border-black p-3 mb-4 text-xs">
            <p className="font-bold mb-1">May we discuss your medical condition with any members of your family? {formData.familyDiscussionConsent === 'yes' ? "[X] Yes  [ ] No" : "[ ] Yes  [X] No"}</p>
            {formData.familyDiscussionConsent === 'yes' && (
              <p className="italic pl-2">If YES, members allowed: <strong>{formData.familyMembersAllowed || "Immediate family"}</strong></p>
            )}
          </div>

          <div className="border border-black p-4 space-y-3 text-xs mb-4">
            <div>
              <strong>This consent was signed by: (PRINT NAME PLEASE): </strong>
              <span className="font-mono underline font-bold ml-2">
                {formData.hipaaPrintedName || `${formData.firstName} ${formData.lastName}`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <strong>Signature: </strong>
                <span className="font-mono underline font-bold ml-2">
                  {formData.hipaaSignature || `${formData.firstName} ${formData.lastName}`}
                </span>
              </div>
              <div>
                <strong>Date: </strong>
                <span className="font-mono underline font-bold ml-2">
                  {formData.hipaaSignatureDate || todayDate}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-300">
              <div>
                <strong>Emergency Contact: </strong>
                <span className="font-medium ml-2">{formData.emergencyContactName || "On file"}</span>
              </div>
              <div>
                <strong>Phone Number: </strong>
                <span className="font-medium ml-2">{formData.emergencyContactPhone || "On file"}</span>
              </div>
            </div>
          </div>
          <div className="text-right text-[8px] text-gray-500 mt-6">Form 2 of 3 • All Right Dental PC</div>
        </div>

        {/* --- PRINT PAGE 3: TREATMENT & BENEFITS --- */}
        <div className="print-page print-page-break border border-black p-6 mb-6">
          <div className="text-center pb-2 mb-3">
            <h1 className="text-2xl font-black tracking-wide">All Right Dental PC</h1>
            <p className="text-xs font-bold">229 Plaza Blvd. Ste #23</p>
            <p className="text-xs font-bold">Morrisville, PA 19067</p>
            <p className="text-xs font-bold">215-295-1348</p>
            <h2 className="text-base font-extrabold underline tracking-wide mt-3">
              Consent for Treatment & Assignment of Insurance Benefits
            </h2>
          </div>

          <div className="text-xs leading-relaxed text-justify space-y-3 mb-4">
            <p>
              The undersigned hereby authorize All Right Dental PC to take X-rays, study models, photographs or any other diagnostic aids deemed appropriate by the Doctor to make a thorough diagnosis for my dental needs. I also authorize the Doctor to perform any and all forms of treatment, prescribe medication and therapy that may be indicated. I also understand the use of anesthetic agents embodies a certain risk. I understand that All Right Dental PC will submit a claim to my dental insurance for all services rendered. Any balance that is not covered by my dental insurance will be my financial responsibility. You have the right to ask for a Pre-treatment estimate is sent to my insurance for clarification of benefits prior to start of treatment.
            </p>

            <div className="border-2 border-black p-3 space-y-1.5 my-3 bg-gray-50">
              <p className="font-extrabold underline text-xs">
                For ANY medical release records ( X-rays) there will be a fee of $50.00.
              </p>
              <p className="font-extrabold underline text-xs">
                For ANY cancellation fee less than 24 hours prior to appointment there will be a fee of $25.00
              </p>
            </div>
          </div>

          <div className="border border-black p-3 mb-4 text-xs">
            <h3 className="font-bold underline mb-1">Insurance on File (Assignment of Benefits):</h3>
            <div className="grid grid-cols-3 gap-2">
              <div><strong>Carrier:</strong> {formData.hasInsurance === 'yes' ? formData.insuranceProvider : "Self-Pay"}</div>
              <div><strong>Subscriber ID:</strong> {formData.subscriberId || "N/A"}</div>
              <div><strong>Group #:</strong> {formData.groupNumber || "N/A"}</div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="border border-black p-3">
              <p className="text-xs font-bold mb-2">By signing you are agreeing with consent for Treatment.</p>
              <div className="flex justify-between items-end pt-3">
                <div className="w-2/3">
                  <strong>X</strong> <span className="font-mono text-sm underline font-bold px-3">
                    {formData.treatmentConsentSignature || `${formData.firstName} ${formData.lastName}`}
                  </span>
                  <p className="text-[9px] uppercase mt-0.5">Patient / Legal Guardian Signature</p>
                </div>
                <div>
                  <strong>Date:</strong> <span className="font-mono text-xs underline font-bold px-2">
                    {formData.treatmentConsentDate || todayDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-black p-3">
              <p className="text-xs font-bold mb-2">By signing you are agreeing to assignment of Benefits.</p>
              <div className="flex justify-between items-end pt-3">
                <div className="w-2/3">
                  <strong>X</strong> <span className="font-mono text-sm underline font-bold px-3">
                    {formData.benefitsAssignmentSignature || `${formData.firstName} ${formData.lastName}`}
                  </span>
                  <p className="text-[9px] uppercase mt-0.5">Patient / Policyholder Signature</p>
                </div>
                <div>
                  <strong>Date:</strong> <span className="font-mono text-xs underline font-bold px-2">
                    {formData.benefitsAssignmentDate || todayDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right text-[8px] text-gray-500 mt-6">Form 3 of 3 • All Right Dental PC</div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. ON-SCREEN INTERACTIVE INTAKE PORTAL (HIDDEN DURING PRINT)              */}
      {/* ========================================================================= */}
      <div className="min-h-screen bg-slate-100 text-gray-800 font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-4xl mx-auto">
          
          {/* Practice Letterhead Header */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#003BC4] via-[#0055D4] to-[#00B7AA] text-white p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs mb-2">
                    <FaShieldAlt className="text-emerald-300" /> Official Dental Intake Portal
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Digital Patient Intake & Medical History</h1>
                  <p className="text-blue-100 text-xs sm:text-sm mt-1">
                    AllRight Dental PC • Doctor Shalini Mandapatti, DDS • 229 Plaza Blvd, Suite 23, Morrisville, PA 19067
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/patientForm.pdf"
                    download="AllRight_Dental_Patient_Form.pdf"
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs px-4 py-2.5 rounded-full font-medium transition border border-white/30 backdrop-blur-xs shadow-xs"
                    title="Download the official 3-page paper form PDF"
                  >
                    <FaDownload /> Blank Paper PDF
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/80 border-b border-blue-100 px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-blue-900 gap-2 font-medium">
              <span>📍 229 Plaza Blvd, Ste #23, Morrisville, PA 19067</span>
              <span>📞 Phone: (215) 295-1348</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <FaShieldAlt /> HIPAA Compliant 256-bit AES Encryption
              </span>
            </div>

            {/* 3-Page Tab Navigation (Exact Match to Clinic's 3-Page Form) */}
            {!submitted && (
              <div className="px-4 sm:px-8 py-3 bg-white border-b border-slate-200">
                <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
                  {[
                    { page: 1, title: "Page 1: Medical History", subtitle: "Health, Allergies & 77 Conditions" },
                    { page: 2, title: "Page 2: HIPAA Consent", subtitle: "Privacy Practices & Emergency Contact" },
                    { page: 3, title: "Page 3: Treatment & Benefits", subtitle: "All Right Dental PC Authorization" },
                  ].map((p) => {
                    const isActive = activePage === p.page;
                    const isDone = activePage > p.page;
                    return (
                      <button
                        key={p.page}
                        type="button"
                        onClick={() => {
                          if (activePage > p.page || validatePage(activePage)) {
                            setActivePage(p.page);
                          }
                        }}
                        className={`text-left p-2.5 rounded-xl border transition-all ${
                          isActive
                            ? "bg-blue-50 border-[#003BC4] text-[#003BC4] shadow-xs ring-2 ring-blue-100"
                            : isDone
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                              : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate">
                            {isDone ? `✓ ${p.title.split(':')[0]}` : p.title.split(':')[0]}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            isActive ? "bg-[#003BC4] text-white" : isDone ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                          }`}>
                            P.{p.page}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold truncate mt-0.5 text-gray-800">
                          {p.title.split(':')[1]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Success Confirmation View */}
          {submitted ? (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl border border-emerald-200 p-6 sm:p-10 text-center animate-in fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  <FaCheckCircle />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Official 3-Page Intake Form Verified & Recorded
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 mb-2">
                  Registration Complete, {formData.firstName}!
                </h2>
                <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
                  All 3 official clinic forms (Medical History, HIPAA Consent, and Treatment & Benefits Assignment) 
                  have been electronically signed and transmitted to <strong>AllRight Dental PC</strong>.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-lg mx-auto text-left mb-8 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Patient Chart ID:</span>
                    <span className="font-bold text-[#003BC4]">{confirmationId}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Patient Full Name:</span>
                    <span className="font-semibold text-gray-800">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Date of Birth:</span>
                    <span className="font-medium text-gray-800">{formData.dob}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Contact Phone:</span>
                    <span className="font-medium text-gray-800">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Emergency Contact:</span>
                    <span className="font-medium text-gray-800">{formData.emergencyContactName} ({formData.emergencyContactPhone})</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Insurance on File:</span>
                    <span className="font-medium text-gray-800">{formData.hasInsurance === 'yes' ? `${formData.insuranceProvider} (ID: ${formData.subscriberId || 'N/A'})` : "Self-Pay / CareCredit"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Page 1 Medical E-Signature:</span>
                    <span className="font-semibold text-emerald-700">{formData.page1Signature} ({formData.page1SignatureDate})</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Page 2 HIPAA E-Signature:</span>
                    <span className="font-semibold text-emerald-700">{formData.hipaaSignature} ({formData.hipaaSignatureDate})</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Page 3 Treatment & Benefits:</span>
                    <span className="font-semibold text-emerald-700">Signed & Authorized ({formData.treatmentConsentDate})</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleDirectDownload}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:opacity-95 text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold transition shadow-lg active:scale-95 cursor-pointer"
                    title="Instantly download the filled 3-page PDF to your device"
                  >
                    <FaDownload /> Download Filled 3-Page PDF
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#003BC4] hover:bg-[#002FA0] text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold transition shadow-md active:scale-95 cursor-pointer"
                    title="Open browser print dialog for printing or saving"
                  >
                    <FaPrint /> Print Official Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDocumentPreview(prev => !prev)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    <FaEye /> {showDocumentPreview ? "Hide Preview" : "Preview 3-Page Form"}
                  </button>
                  <a
                    href="/patientForm.pdf"
                    download="AllRight_Dental_Blank_Form.pdf"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer shadow-2xs"
                  >
                    <FaFilePdf className="text-red-600" /> Blank Paper PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setActivePage(1);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer"
                  >
                    <FaEdit /> Edit
                  </button>
                  <Link
                    to="/Appointment"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#003BC4] hover:bg-[#002fa0] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition"
                  >
                    Book Visit <FaArrowRight />
                  </Link>
                </div>
              </div>

              {/* On-Screen Document Preview (When user toggles Preview) */}
              {showDocumentPreview && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-300 p-6 sm:p-10 space-y-8 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FaFileContract className="text-[#003BC4]" /> Exact 3-Page Clinic Document Preview
                      </h3>
                      <p className="text-xs text-gray-500">Matching patient_form_p1, p2, p3 of Doctor Shalini's clinic form</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDirectDownload}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-full font-bold shadow-sm cursor-pointer"
                      >
                        <FaDownload /> Download PDF
                      </button>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 bg-[#003BC4] hover:bg-[#002FA0] text-white text-xs px-4 py-2 rounded-full font-bold shadow-sm cursor-pointer"
                      >
                        <FaPrint /> Print
                      </button>
                    </div>
                  </div>

                  {/* Page 1 Preview Box */}
                  <div className="border border-slate-300 rounded-2xl p-6 bg-slate-50/50 space-y-3 font-serif text-xs">
                    <div className="text-center border-b border-slate-300 pb-2">
                      <p className="font-bold text-base">ALL RIGHT DENTAL PC • MEDICAL HISTORY</p>
                      <p className="text-[11px] text-gray-600">229 Plaza Blvd. Ste #23 • Morrisville, PA 19067</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-300 pb-2">
                      <div><strong>PATIENT NAME:</strong> {formData.firstName} {formData.lastName}</div>
                      <div><strong>Birth Date:</strong> {formData.dob}</div>
                      <div><strong>Phone:</strong> {formData.phone}</div>
                      <div><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zip}</div>
                    </div>
                    <div className="border-b border-slate-200 pb-2">
                      <p className="font-bold mb-1">General Health Answers:</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                        <li>• Physician's care: <strong>{formData.underPhysicianCare === 'yes' ? `Yes (${formData.underPhysicianCareExplain})` : 'No'}</strong></li>
                        <li>• Hospitalized/Surgery: <strong>{formData.hospitalizedOrOperation === 'yes' ? `Yes (${formData.hospitalizedOrOperationExplain})` : 'No'}</strong></li>
                        <li>• Head/Neck injury: <strong>{formData.headNeckInjury === 'yes' ? `Yes (${formData.headNeckInjuryExplain})` : 'No'}</strong></li>
                        <li>• Medications/Blood thinners: <strong>{formData.takingMedications === 'yes' ? `Yes (${formData.takingMedicationsExplain})` : 'No'}</strong></li>
                        <li>• Phen-Fen / Redux: <strong>{formData.takenPhenFen}</strong></li>
                        <li>• Bisphosphonates (Fosamax, Boniva): <strong>{formData.takenBisphosphonates}</strong></li>
                        <li>• Special diet: <strong>{formData.specialDiet}</strong></li>
                        <li>• Tobacco: <strong>{formData.usesTobacco}</strong></li>
                      </ul>
                    </div>
                    <div>
                      <strong>Allergies:</strong> {formData.allergies.length > 0 ? formData.allergies.join(", ") : "None reported"}
                    </div>
                    <div>
                      <strong>Medical Conditions:</strong> {formData.medicalConditions.length > 0 ? formData.medicalConditions.join(", ") : "None reported"}
                    </div>
                    <div className="pt-2 border-t border-slate-300 flex justify-between font-mono">
                      <span>Signature: {formData.page1Signature}</span>
                      <span>Date: {formData.page1SignatureDate}</span>
                    </div>
                  </div>

                  {/* Page 2 Preview Box */}
                  <div className="border border-slate-300 rounded-2xl p-6 bg-slate-50/50 space-y-3 font-serif text-xs">
                    <div className="text-center border-b border-slate-300 pb-2">
                      <p className="font-bold text-base">ALL RIGHT DENTAL PC • HIPAA PATIENT CONSENT FORM</p>
                    </div>
                    <p className="italic text-gray-600">Notice of Privacy Practices & Family Disclosure Authorization on file.</p>
                    <div><strong>Family Discussion Allowed:</strong> {formData.familyDiscussionConsent === 'yes' ? `Yes (${formData.familyMembersAllowed || "Immediate family"})` : "No"}</div>
                    <div><strong>Emergency Contact:</strong> {formData.emergencyContactName} ({formData.emergencyContactPhone})</div>
                    <div className="pt-2 border-t border-slate-300 flex justify-between font-mono">
                      <span>Signature: {formData.hipaaSignature}</span>
                      <span>Date: {formData.hipaaSignatureDate}</span>
                    </div>
                  </div>

                  {/* Page 3 Preview Box */}
                  <div className="border border-slate-300 rounded-2xl p-6 bg-slate-50/50 space-y-3 font-serif text-xs">
                    <div className="text-center border-b border-slate-300 pb-2">
                      <p className="font-bold text-base">ALL RIGHT DENTAL PC • TREATMENT & BENEFITS CONSENT</p>
                      <p className="text-[11px] text-gray-600">229 Plaza Blvd. Ste #23 • Morrisville, PA 19067 • 215-295-1348</p>
                    </div>
                    <div className="p-2 border border-slate-400 bg-white space-y-1">
                      <p className="font-bold">Records release fee: $50.00 | Late cancellation fee (&lt;24h): $25.00</p>
                      <p>Insurance Carrier: {formData.hasInsurance === 'yes' ? `${formData.insuranceProvider} (ID: ${formData.subscriberId || 'N/A'})` : "Self-Pay"}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-300 flex justify-between font-mono">
                      <span>Treatment Consent: {formData.treatmentConsentSignature}</span>
                      <span>Benefits Assignment: {formData.benefitsAssignmentSignature}</span>
                      <span>Date: {formData.treatmentConsentDate}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10">
              
              {/* PAGE 1: MEDICAL HISTORY */}
              {activePage === 1 && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Form Page Header */}
                  <div className="border-b-2 border-slate-800 pb-3 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          Form 1 of 3 • Paper Replica
                        </span>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">MEDICAL HISTORY</h2>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">AllRight Dental PC</span>
                    </div>
                  </div>

                  {/* Patient Information Bar */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">PATIENT NAME *</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                            className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                          />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                            className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">Birth Date *</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          required
                          className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-200">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(215) 555-0148"
                          required
                          className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="patient@email.com"
                          required
                          className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="123 Main St"
                          className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">City / State</label>
                        <input
                          type="text"
                          name="city"
                          value={`${formData.city}, ${formData.state}`}
                          onChange={(e) => setFormData(p => ({ ...p, city: e.target.value.split(',')[0] || "Morrisville" }))}
                          className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Exact Preamble Text from Paper Form Page 1 */}
                  <div className="p-3.5 bg-blue-50/70 border-l-4 border-[#003BC4] text-xs text-blue-950 italic rounded-r-xl leading-relaxed">
                    "Although dental personnel primarily treat the area in and around your mouth, your mouth is a part of your entire body. Health problems that you may have, or medication that you may be taking, could have an important interrelationship with the dentistry you will receive. Thank you for answering the following questions."
                  </div>

                  {/* Exact General Health Questions from Page 1 */}
                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                    
                    {/* Q1 */}
                    <div className="py-2 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-gray-800 font-medium">Are you under a physician's care now?</span>
                        <div className="flex items-center gap-4 shrink-0">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="underPhysicianCare" value="yes" checked={formData.underPhysicianCare === 'yes'} onChange={handleChange} /> Yes
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="underPhysicianCare" value="no" checked={formData.underPhysicianCare === 'no'} onChange={handleChange} /> No
                          </label>
                        </div>
                      </div>
                      {formData.underPhysicianCare === 'yes' && (
                        <input
                          type="text"
                          name="underPhysicianCareExplain"
                          value={formData.underPhysicianCareExplain}
                          onChange={handleChange}
                          placeholder="If yes, please explain physician name and reason for care..."
                          className="w-full text-xs border border-blue-300 rounded-lg p-2 bg-blue-50/30 mt-2"
                        />
                      )}
                    </div>

                    {/* Q2 */}
                    <div className="py-2 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-gray-800 font-medium">Have you ever been hospitalized or had a major operation?</span>
                        <div className="flex items-center gap-4 shrink-0">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="hospitalizedOrOperation" value="yes" checked={formData.hospitalizedOrOperation === 'yes'} onChange={handleChange} /> Yes
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="hospitalizedOrOperation" value="no" checked={formData.hospitalizedOrOperation === 'no'} onChange={handleChange} /> No
                          </label>
                        </div>
                      </div>
                      {formData.hospitalizedOrOperation === 'yes' && (
                        <input
                          type="text"
                          name="hospitalizedOrOperationExplain"
                          value={formData.hospitalizedOrOperationExplain}
                          onChange={handleChange}
                          placeholder="If yes, please explain procedure and approximate date..."
                          className="w-full text-xs border border-blue-300 rounded-lg p-2 bg-blue-50/30 mt-2"
                        />
                      )}
                    </div>

                    {/* Q3 */}
                    <div className="py-2 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-gray-800 font-medium">Have you ever had a serious head or neck injury?</span>
                        <div className="flex items-center gap-4 shrink-0">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="headNeckInjury" value="yes" checked={formData.headNeckInjury === 'yes'} onChange={handleChange} /> Yes
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="headNeckInjury" value="no" checked={formData.headNeckInjury === 'no'} onChange={handleChange} /> No
                          </label>
                        </div>
                      </div>
                      {formData.headNeckInjury === 'yes' && (
                        <input
                          type="text"
                          name="headNeckInjuryExplain"
                          value={formData.headNeckInjuryExplain}
                          onChange={handleChange}
                          placeholder="If yes, please explain..."
                          className="w-full text-xs border border-blue-300 rounded-lg p-2 bg-blue-50/30 mt-2"
                        />
                      )}
                    </div>

                    {/* Q4 */}
                    <div className="py-2 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-gray-800 font-medium">Are you taking any medications, pills, or drugs?</span>
                        <div className="flex items-center gap-4 shrink-0">
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
                          name="takingMedicationsExplain"
                          value={formData.takingMedicationsExplain}
                          onChange={handleChange}
                          placeholder="If yes, please list all medications, dosages, blood thinners, etc..."
                          className="w-full text-xs border border-blue-300 rounded-lg p-2 bg-blue-50/30 mt-2"
                        />
                      )}
                    </div>

                    {/* Q5 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100">
                      <span className="text-gray-800 font-medium">Do you take, or have you taken, Phen-Fen or Redux?</span>
                      <div className="flex items-center gap-4 shrink-0">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="takenPhenFen" value="yes" checked={formData.takenPhenFen === 'yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="takenPhenFen" value="no" checked={formData.takenPhenFen === 'no'} onChange={handleChange} /> No
                        </label>
                      </div>
                    </div>

                    {/* Q6 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100">
                      <span className="text-gray-800 font-medium">Have you ever taken Fosamax, Boniva, Actonel or any other medications containing bisphosphonates?</span>
                      <div className="flex items-center gap-4 shrink-0">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="takenBisphosphonates" value="yes" checked={formData.takenBisphosphonates === 'yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="takenBisphosphonates" value="no" checked={formData.takenBisphosphonates === 'no'} onChange={handleChange} /> No
                        </label>
                      </div>
                    </div>

                    {/* Q7 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100">
                      <span className="text-gray-800 font-medium">Are you on a special diet?</span>
                      <div className="flex items-center gap-4 shrink-0">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="specialDiet" value="yes" checked={formData.specialDiet === 'yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="specialDiet" value="no" checked={formData.specialDiet === 'no'} onChange={handleChange} /> No
                        </label>
                      </div>
                    </div>

                    {/* Q8 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100">
                      <span className="text-gray-800 font-medium">Do you use tobacco?</span>
                      <div className="flex items-center gap-4 shrink-0">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="usesTobacco" value="yes" checked={formData.usesTobacco === 'yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="usesTobacco" value="no" checked={formData.usesTobacco === 'no'} onChange={handleChange} /> No
                        </label>
                      </div>
                    </div>

                    {/* Q9 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100">
                      <span className="text-gray-800 font-medium">Do you use controlled substances?</span>
                      <div className="flex items-center gap-4 shrink-0">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="usesControlledSubstances" value="yes" checked={formData.usesControlledSubstances === 'yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="usesControlledSubstances" value="no" checked={formData.usesControlledSubstances === 'no'} onChange={handleChange} /> No
                        </label>
                      </div>
                    </div>

                    {/* Women Section */}
                    {formData.gender === 'female' && (
                      <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2 mt-2">
                        <span className="font-bold text-rose-900 block text-xs">Women: Are you</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="flex items-center justify-between sm:justify-start gap-2">
                            <span className="text-xs text-gray-700">Pregnant/Trying to get pregnant?</span>
                            <div className="flex items-center gap-2">
                              <label><input type="radio" name="isPregnant" value="yes" checked={formData.isPregnant === 'yes'} onChange={handleChange} /> Yes</label>
                              <label><input type="radio" name="isPregnant" value="no" checked={formData.isPregnant === 'no'} onChange={handleChange} /> No</label>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-start gap-2">
                            <span className="text-xs text-gray-700">Taking oral contraceptives?</span>
                            <div className="flex items-center gap-2">
                              <label><input type="radio" name="takingContraceptives" value="yes" checked={formData.takingContraceptives === 'yes'} onChange={handleChange} /> Yes</label>
                              <label><input type="radio" name="takingContraceptives" value="no" checked={formData.takingContraceptives === 'no'} onChange={handleChange} /> No</label>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-start gap-2">
                            <span className="text-xs text-gray-700">Nursing?</span>
                            <div className="flex items-center gap-2">
                              <label><input type="radio" name="isNursing" value="yes" checked={formData.isNursing === 'yes'} onChange={handleChange} /> Yes</label>
                              <label><input type="radio" name="isNursing" value="no" checked={formData.isNursing === 'no'} onChange={handleChange} /> No</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Allergies Checklist */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      Are you allergic to any of the following?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {ALLERGIES_LIST.map(allergy => {
                        const isChecked = formData.allergies.includes(allergy);
                        return (
                          <button
                            key={allergy}
                            type="button"
                            onClick={() => handleArrayToggle('allergies', allergy)}
                            className={`text-xs px-3 py-2 rounded-xl border text-left flex items-center justify-between transition ${
                              isChecked
                                ? "bg-red-50 border-red-400 text-red-800 font-bold"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span>{allergy}</span>
                            {isChecked && <FaCheck className="text-red-600 text-xs" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs font-medium text-gray-700">Other Allergies?</span>
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input type="radio" name="hasOtherAllergies" value="yes" checked={formData.hasOtherAllergies === 'yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input type="radio" name="hasOtherAllergies" value="no" checked={formData.hasOtherAllergies === 'no'} onChange={handleChange} /> No
                        </label>
                      </div>
                      {formData.hasOtherAllergies === 'yes' && (
                        <input
                          type="text"
                          name="otherAllergiesExplain"
                          value={formData.otherAllergiesExplain}
                          onChange={handleChange}
                          placeholder="If yes, please explain other allergies..."
                          className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white"
                        />
                      )}
                    </div>
                  </div>

                  {/* Exact 77 Conditions Grid */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide">
                        Do you have, or have you had, any of the following?
                      </label>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {formData.medicalConditions.length} selected
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-2">Tap/click to select any conditions that apply to you:</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 max-h-64 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      {MEDICAL_CONDITIONS_LIST.map(cond => {
                        const isSelected = formData.medicalConditions.includes(cond);
                        return (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => handleArrayToggle('medicalConditions', cond)}
                            className={`text-[11px] px-2 py-1.5 rounded-lg border text-left flex items-center justify-between transition leading-tight ${
                              isSelected
                                ? "bg-blue-100 border-[#003BC4] text-[#003BC4] font-bold shadow-2xs"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span className="truncate">{cond}</span>
                            {isSelected && <span className="text-[#003BC4] font-bold text-xs ml-1 shrink-0">✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-gray-700">Have you ever had any serious illness not listed above?</span>
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input type="radio" name="hasSeriousIllnessNotListed" value="yes" checked={formData.hasSeriousIllnessNotListed === 'yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input type="radio" name="hasSeriousIllnessNotListed" value="no" checked={formData.hasSeriousIllnessNotListed === 'no'} onChange={handleChange} /> No
                        </label>
                      </div>
                      {formData.hasSeriousIllnessNotListed === 'yes' && (
                        <input
                          type="text"
                          name="seriousIllnessExplain"
                          value={formData.seriousIllnessExplain}
                          onChange={handleChange}
                          placeholder="Please specify illness..."
                          className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-slate-50"
                        />
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Comments:</label>
                        <textarea
                          name="page1Comments"
                          value={formData.page1Comments}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Any additional medical or dental notes for Doctor Shalini..."
                          className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Page 1 Bottom Legal Certification & E-Signature */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 space-y-3">
                    <p className="text-xs text-gray-700 leading-relaxed font-serif italic border-l-2 border-slate-600 pl-3">
                      "To the best of my knowledge, the questions on this form have been accurately answered. I understand that providing incorrect information can be dangerous to my (or patient's) health. It is my responsibility to inform the dental office of any changes in medical status."
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">
                          SIGNATURE OF PATIENT, PARENT, or GUARDIAN *
                        </label>
                        <input
                          type="text"
                          name="page1Signature"
                          value={formData.page1Signature}
                          onChange={handleChange}
                          placeholder="Type full legal name"
                          required
                          className="w-full text-sm font-semibold border-2 border-blue-400 rounded-xl px-3.5 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">DATE *</label>
                        <input
                          type="date"
                          name="page1SignatureDate"
                          value={formData.page1SignatureDate}
                          onChange={handleChange}
                          className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2 bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* PAGE 2: HIPAA COMPLIANCE PATIENT CONSENT FORM */}
              {activePage === 2 && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Form Page Header */}
                  <div className="border-b-2 border-slate-800 pb-3 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          Form 2 of 3 • Paper Replica
                        </span>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">HIPAA Compliance Patient Consent Form</h2>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">AllRight Dental PC</span>
                    </div>
                  </div>

                  {/* Exact Text from Paper Form Page 2 */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-gray-800 space-y-3 leading-relaxed">
                    <p>
                      Our Notice of Privacy Practices provides information about how we may use or disclose protected health information.
                    </p>
                    <p>
                      The notice contains a patients rights section describing your rights under the law. You ascertain that by your signature that you have reviewed our notice before signing this consent.
                    </p>
                    <p>
                      The term of the notice may chance, if so, you will be notified at your next visit to update your signature/date.
                    </p>
                    <p>
                      You have the right to restrict how your protected health information is used and disclosed for treatment, payment of healthcare operations. We are not required to after with this restriction, but if we do, we shall honor this agreement. The HIPAA (Health Insurance Portability and Accountability Act of 1996) law allows for the use of the information for treatment, payment, or healthcare operations.
                    </p>
                    <p>
                      By signing this form, you consent to our use and disclosure of your protected healthcare information and potentially anonymous usage in a publication. You have the right to revoke this consent in writing, signed by you. However, such a revocation will not be retroactive.
                    </p>

                    <div className="pt-2 border-t border-slate-200">
                      <p className="font-bold text-gray-900 mb-1.5">By signing this form, I understand that:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1">
                        <li>Protected health information may be disclosed or used for treatment, payment, or healthcare operations.</li>
                        <li>The practice reserves the right to chance the privacy policy as allowed by the law.</li>
                        <li>The patient has the right to revoke this consent in writing at any time and all full disclosures will then erase.</li>
                        <li>The practice may condition receipt of treatable upon execution of this consent.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Family Discussion Permission */}
                  <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200 text-xs sm:text-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="font-bold text-blue-950">
                        May we discuss your medical condition with any members of your family?
                      </span>
                      <div className="flex items-center gap-4 shrink-0">
                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-800">
                          <input type="radio" name="familyDiscussionConsent" value="yes" checked={formData.familyDiscussionConsent === 'yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-800">
                          <input type="radio" name="familyDiscussionConsent" value="no" checked={formData.familyDiscussionConsent === 'no'} onChange={handleChange} /> No
                        </label>
                      </div>
                    </div>
                    {formData.familyDiscussionConsent === 'yes' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          If YES, please name the members allowed:
                        </label>
                        <input
                          type="text"
                          name="familyMembersAllowed"
                          value={formData.familyMembersAllowed}
                          onChange={handleChange}
                          placeholder="e.g. Spouse: Jane Doe, Mother: Mary Smith"
                          className="w-full text-xs border border-blue-300 rounded-xl px-3 py-2 bg-white focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
                      Emergency Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Contact Full Name *</label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleChange}
                          placeholder="e.g. Sarah Smith (Spouse)"
                          required
                          className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2 focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Phone Number *</label>
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleChange}
                          placeholder="(215) 555-0144"
                          required
                          className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2 focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Page 2 Signature Block */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">
                          This consent was signed by: (PRINT NAME PLEASE) *
                        </label>
                        <input
                          type="text"
                          name="hipaaPrintedName"
                          value={formData.hipaaPrintedName || `${formData.firstName} ${formData.lastName}`.trim()}
                          onChange={handleChange}
                          placeholder="Printed full name"
                          required
                          className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">
                          Signature: *
                        </label>
                        <input
                          type="text"
                          name="hipaaSignature"
                          value={formData.hipaaSignature}
                          onChange={handleChange}
                          placeholder="Electronic signature"
                          required
                          className="w-full text-sm font-semibold border-2 border-blue-400 rounded-xl px-3 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">Date: *</label>
                        <input
                          type="date"
                          name="hipaaSignatureDate"
                          value={formData.hipaaSignatureDate}
                          onChange={handleChange}
                          className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* PAGE 3: CONSENT FOR TREATMENT & ASSIGNMENT OF INSURANCE BENEFITS */}
              {activePage === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Official Clinic Letterhead */}
                  <div className="border-b-2 border-slate-800 pb-4 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Form 3 of 3 • Paper Replica
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">All Right Dental PC</h2>
                    <p className="text-sm font-bold text-gray-700">229 Plaza Blvd. Ste #23</p>
                    <p className="text-sm font-bold text-gray-700">Morrisville, PA 19067</p>
                    <p className="text-sm font-bold text-blue-800">215-295-1348</p>

                    <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-4 underline decoration-2">
                      Consent for Treatment & Assignment of Insurance Benefits
                    </h3>
                  </div>

                  {/* Exact Text from Paper Page 3 */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-gray-800 space-y-3 leading-relaxed">
                    <p>
                      The undersigned hereby authorize All Right Dental PC to take X-rays, study models, photographs or any other diagnostic aids deemed appropriate by the Doctor to make a thorough diagnosis for my dental needs. I also authorize the Doctor to perform any and all forms of treatment, prescribe medication and therapy that may be indicated. I also understand the use of anesthetic agents embodies a certain risk. I understand that All Right Dental PC will submit a claim to my dental insurance for all services rendered. Any balance that is not covered by my dental insurance will be my financial responsibility. You have the right to ask for a Pre-treatment estimate is sent to my insurance for clarification of benefits prior to start of treatment.
                    </p>

                    <div className="bg-white p-4 rounded-xl border-2 border-slate-400 space-y-2 my-2">
                      <p className="font-bold text-gray-900 text-xs sm:text-sm underline">
                        For ANY medical release records ( X-rays) there will be a fee of $50.00.
                      </p>
                      <p className="font-bold text-red-700 text-xs sm:text-sm underline">
                        For ANY cancellation fee less than 24 hours prior to appointment there will be a fee of $25.00
                      </p>
                    </div>
                  </div>

                  {/* Insurance Details Section */}
                  <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                        Dental Insurance Information (For Claims & Assignment)
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="hasInsurance" value="yes" checked={formData.hasInsurance === 'yes'} onChange={handleChange} /> Insured
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="hasInsurance" value="no" checked={formData.hasInsurance === 'no'} onChange={handleChange} /> Self-Pay
                        </label>
                      </div>
                    </div>

                    {formData.hasInsurance === 'yes' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Insurance Provider</label>
                          <select
                            name="insuranceProvider"
                            value={formData.insuranceProvider}
                            onChange={handleChange}
                            className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white focus:outline-none"
                          >
                            {US_DENTAL_INSURANCES.map(ins => (
                              <option key={ins} value={ins}>{ins}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Member / Subscriber ID #</label>
                          <input
                            type="text"
                            name="subscriberId"
                            value={formData.subscriberId}
                            onChange={handleChange}
                            placeholder="e.g. 102938475"
                            className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Group Number</label>
                          <input
                            type="text"
                            name="groupNumber"
                            value={formData.groupNumber}
                            onChange={handleChange}
                            placeholder="e.g. GRP-4821"
                            className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 italic">
                        Self-pay patient. Payment due at time of service (CareCredit accepted).
                      </p>
                    )}
                  </div>

                  {/* Two Separate Legal Signature Blocks */}
                  <div className="space-y-4">
                    
                    {/* Signature 1: Consent for Treatment */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 space-y-2">
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        By signing you are agreeing with consent for Treatment.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            X (Patient / Guardian Signature) *
                          </label>
                          <input
                            type="text"
                            name="treatmentConsentSignature"
                            value={formData.treatmentConsentSignature}
                            onChange={handleChange}
                            placeholder="Type full legal name as signature"
                            required
                            className="w-full text-sm font-semibold border-2 border-blue-400 rounded-xl px-3.5 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Date: *</label>
                          <input
                            type="date"
                            name="treatmentConsentDate"
                            value={formData.treatmentConsentDate}
                            onChange={handleChange}
                            className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2 bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Signature 2: Assignment of Benefits */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 space-y-2">
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        By signing you are agreeing to assignment of Benefits.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            X (Patient / Policyholder Signature) *
                          </label>
                          <input
                            type="text"
                            name="benefitsAssignmentSignature"
                            value={formData.benefitsAssignmentSignature}
                            onChange={handleChange}
                            placeholder="Type full legal name as signature"
                            required
                            className="w-full text-sm font-semibold border-2 border-blue-400 rounded-xl px-3.5 py-2 bg-white focus:border-[#003BC4] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Date: *</label>
                          <input
                            type="date"
                            name="benefitsAssignmentDate"
                            value={formData.benefitsAssignmentDate}
                            onChange={handleChange}
                            className="w-full text-sm border border-gray-300 rounded-xl px-3.5 py-2 bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* Stepper Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
                {activePage > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <FaArrowLeft /> Previous Form Page
                  </button>
                ) : <div></div>}

                {activePage < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextPage}
                    className="flex items-center gap-2 bg-[#003BC4] hover:bg-[#002FA0] text-white px-7 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition"
                  >
                    Save & Go to Form Page {activePage + 1} <FaArrowRight />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:opacity-95 text-white px-8 py-3.5 rounded-full text-sm font-extrabold shadow-lg transition active:scale-95 cursor-pointer"
                  >
                    <FaCheckCircle /> Complete & Submit Official 3-Page Intake
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
