import { jsPDF } from 'jspdf';

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

/**
 * Generates and downloads an exact 3-page replica PDF of Doctor Shalini's clinic intake form
 * matching patient_form_p1.png, patient_form_p2.png, patient_form_p3.png.
 */
export function downloadFilledPatientFormPDF(formData, chartId = "") {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const w = doc.internal.pageSize.getWidth();
  const m = 40; // 40pt margin
  const contentWidth = w - (m * 2);
  const today = new Date().toISOString().split("T")[0];

  const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Patient';

  // =========================================================================
  // PAGE 1: MEDICAL HISTORY (Exact Replica of patient_form_p1.png)
  // =========================================================================
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('MEDICAL HISTORY', w / 2, 45, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.text(`PATIENT NAME: ${fullName}`, m, 68);
  doc.text(`Birth Date: ${formData.dob || '_________________'}`, 400, 68);

  doc.setFontSize(8.5);
  doc.text(`Phone: ${formData.phone || 'N/A'}    Email: ${formData.email || 'N/A'}`, m, 82);
  doc.text(`Address: ${formData.address || ''}, ${formData.city || 'Morrisville'}, ${formData.state || 'PA'} ${formData.zip || '19067'}`, m, 94);

  doc.setLineWidth(0.8);
  doc.line(m, 100, w - m, 100);

  // Exact Preamble Text
  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  const preamble = "Although dental personnel primarily treat the area in and around your mouth, your mouth is a part of your entire body. Health problems that you may have, or medication that you may be taking, could have an important interrelationship with the dentistry you will receive. Thank you for answering the following questions.";
  const pLines = doc.splitTextToSize(preamble, contentWidth);
  doc.text(pLines, m, 112);

  let y = 145;
  doc.setFont('times', 'normal');
  doc.setFontSize(8);

  const healthQuestions = [
    { q: "Are you under a physician's care now?", a: formData.underPhysicianCare, exp: formData.underPhysicianCareExplain },
    { q: "Have you ever been hospitalized or had a major operation?", a: formData.hospitalizedOrOperation, exp: formData.hospitalizedOrOperationExplain },
    { q: "Have you ever had a serious head or neck injury?", a: formData.headNeckInjury, exp: formData.headNeckInjuryExplain },
    { q: "Are you taking any medications, pills, or drugs?", a: formData.takingMedications, exp: formData.takingMedicationsExplain },
    { q: "Do you take, or have you taken, Phen-Fen or Redux?", a: formData.takenPhenFen },
    { q: "Have you ever taken Fosamax, Boniva, Actonel or bisphosphonates?", a: formData.takenBisphosphonates },
    { q: "Are you on a special diet?", a: formData.specialDiet },
    { q: "Do you use tobacco?", a: formData.usesTobacco },
    { q: "Do you use controlled substances?", a: formData.usesControlledSubstances }
  ];

  healthQuestions.forEach(item => {
    const isYes = item.a === 'yes';
    const ansText = isYes ? "(X) Yes  ( ) No" : "( ) Yes  (X) No";
    doc.text(item.q, m, y);
    doc.setFont('times', 'bold');
    doc.text(ansText, w - m - 70, y);
    doc.setFont('times', 'normal');
    y += 12;

    if (isYes && item.exp) {
      doc.setFont('times', 'italic');
      doc.text(`   -> If yes: ${item.exp}`, m + 10, y);
      doc.setFont('times', 'normal');
      y += 11;
    }
  });

  // Women Section
  if (formData.gender === 'female') {
    doc.setFont('times', 'bold');
    doc.text("Women: Are you", m, y);
    doc.setFont('times', 'normal');
    doc.text(`Pregnant/Trying: ${formData.isPregnant || 'no'}   Oral contraceptives: ${formData.takingContraceptives || 'no'}   Nursing: ${formData.isNursing || 'no'}`, m + 100, y);
    y += 14;
  }

  // Allergies Checklist
  y += 4;
  doc.setFont('times', 'bold');
  doc.text("Are you allergic to any of the following?", m, y);
  y += 12;
  doc.setFont('times', 'normal');

  let ax = m;
  ALLERGIES_LIST.forEach((alg, idx) => {
    const isChecked = (formData.allergies || []).includes(alg);
    doc.text(`${isChecked ? '[X]' : '[ ]'} ${alg}`, ax, y);
    ax += 125;
    if ((idx + 1) % 4 === 0) {
      ax = m;
      y += 11;
    }
  });

  if (formData.hasOtherAllergies === 'yes' && formData.otherAllergiesExplain) {
    doc.text(`Other Allergies: ${formData.otherAllergiesExplain}`, m, y);
    y += 12;
  }

  // Conditions Checklist
  y += 4;
  doc.setFont('times', 'bold');
  doc.text("Do you have, or have you had, any of the following medical conditions?", m, y);
  y += 11;
  doc.setFont('times', 'normal');

  const condText = (formData.medicalConditions && formData.medicalConditions.length > 0)
    ? `Checked Conditions: ${formData.medicalConditions.join(", ")}`
    : "None checked / No systemic medical conditions reported.";
  const condLines = doc.splitTextToSize(condText, contentWidth);
  doc.text(condLines, m, y);
  y += (condLines.length * 10) + 6;

  if (formData.hasSeriousIllnessNotListed === 'yes' && formData.seriousIllnessExplain) {
    doc.text(`Other Serious Illness: ${formData.seriousIllnessExplain}`, m, y);
    y += 11;
  }
  if (formData.page1Comments) {
    doc.text(`Comments: ${formData.page1Comments}`, m, y);
    y += 11;
  }

  // Declaration & Signature Page 1
  y += 6;
  doc.setLineWidth(0.5);
  doc.line(m, y, w - m, y);
  y += 12;

  doc.setFont('times', 'italic');
  doc.setFontSize(7.5);
  const decl = "To the best of my knowledge, the questions on this form have been accurately answered. I understand that providing incorrect information can be dangerous to my (or patient's) health. It is my responsibility to inform the dental office of any changes in medical status.";
  const dLines = doc.splitTextToSize(decl, contentWidth);
  doc.text(dLines, m, y);
  y += (dLines.length * 9) + 16;

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.text("SIGNATURE OF PATIENT, PARENT, or GUARDIAN:", m, y);
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.text(formData.page1Signature || fullName, m + 230, y);
  doc.line(m + 225, y + 2, m + 380, y + 2);

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.text("DATE:", 410, y);
  doc.setFont('times', 'normal');
  doc.text(formData.page1SignatureDate || today, 445, y);
  doc.line(440, y + 2, w - m, y + 2);

  doc.setFontSize(7);
  doc.text("Form 1 of 3 • All Right Dental PC", w - m, 755, { align: 'right' });

  // =========================================================================
  // PAGE 2: HIPAA COMPLIANCE PATIENT CONSENT FORM (Exact Replica of p2.png)
  // =========================================================================
  doc.addPage();
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.text('HIPAA Compliance Patient Consent Form', w / 2, 45, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('times', 'normal');
  doc.text('All Right Dental PC • 229 Plaza Blvd, Suite 23, Morrisville, PA 19067 • Phone: (215) 295-1348', w / 2, 60, { align: 'center' });
  doc.line(m, 68, w - m, 68);

  let hy = 90;
  doc.setFontSize(9);
  const hipaaParagraphs = [
    "Our Notice of Privacy Practices provides information about how we may use or disclose protected health information.",
    "The notice contains a patients rights section describing your rights under the law. You ascertain that by your signature that you have reviewed our notice before signing this consent.",
    "The term of the notice may chance, if so, you will be notified at your next visit to update your signature/date.",
    "You have the right to restrict how your protected health information is used and disclosed for treatment, payment of healthcare operations. We are not required to after with this restriction, but if we do, we shall honor this agreement. The HIPAA (Health Insurance Portability and Accountability Act of 1996) law allows for the use of the information for treatment, payment, or healthcare operations.",
    "By signing this form, you consent to our use and disclosure of your protected healthcare information and potentially anonymous usage in a publication. You have the right to revoke this consent in writing, signed by you. However, such a revocation will not be retroactive.",
    "By signing this form, I understand that:\n• Protected health information may be disclosed or used for treatment, payment, or healthcare operations.\n• The practice reserves the right to chance the privacy policy as allowed by the law.\n• The patient has the right to revoke this consent in writing at any time and all full disclosures will then erase.\n• The practice may condition receipt of treatable upon execution of this consent."
  ];

  hipaaParagraphs.forEach(p => {
    const lines = doc.splitTextToSize(p, contentWidth);
    doc.text(lines, m, hy);
    hy += (lines.length * 11) + 10;
  });

  // Family Discussion Box
  hy += 6;
  doc.rect(m, hy, contentWidth, 42);
  doc.setFont('times', 'bold');
  const familyConsentText = `May we discuss your medical condition with any members of your family? ${formData.familyDiscussionConsent === 'yes' ? '[X] Yes  [ ] No' : '[ ] Yes  [X] No'}`;
  doc.text(familyConsentText, m + 10, hy + 16);
  doc.setFont('times', 'normal');
  doc.text(`If YES, please name the members allowed: ${formData.familyMembersAllowed || (formData.familyDiscussionConsent === 'yes' ? 'Immediate family' : 'None')}`, m + 10, hy + 31);
  hy += 55;

  // Signature Block Page 2
  doc.setFont('times', 'bold');
  doc.text("This consent was signed by: (PRINT NAME PLEASE):", m, hy);
  doc.setFont('times', 'normal');
  doc.text(formData.hipaaPrintedName || fullName, m + 260, hy);
  doc.line(m + 255, hy + 2, w - m, hy + 2);
  hy += 25;

  doc.setFont('times', 'bold');
  doc.text("Signature:", m, hy);
  doc.setFont('times', 'normal');
  doc.text(formData.hipaaSignature || fullName, m + 60, hy);
  doc.line(m + 55, hy + 2, 340, hy + 2);

  doc.setFont('times', 'bold');
  doc.text("Date:", 370, hy);
  doc.setFont('times', 'normal');
  doc.text(formData.hipaaSignatureDate || today, 405, hy);
  doc.line(400, hy + 2, w - m, hy + 2);
  hy += 25;

  doc.setFont('times', 'bold');
  doc.text("Emergency Contact:", m, hy);
  doc.setFont('times', 'normal');
  doc.text(formData.emergencyContactName || "On file", m + 110, hy);
  doc.line(m + 105, hy + 2, 340, hy + 2);

  doc.setFont('times', 'bold');
  doc.text("Phone Number:", 370, hy);
  doc.setFont('times', 'normal');
  doc.text(formData.emergencyContactPhone || "On file", 445, hy);
  doc.line(440, hy + 2, w - m, hy + 2);

  doc.setFontSize(7);
  doc.text("Form 2 of 3 • All Right Dental PC", w - m, 755, { align: 'right' });

  // =========================================================================
  // PAGE 3: TREATMENT & BENEFITS (Exact Replica of patient_form_p3.png)
  // =========================================================================
  doc.addPage();
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('All Right Dental PC', w / 2, 45, { align: 'center' });
  doc.setFontSize(10);
  doc.text('229 Plaza Blvd. Ste #23', w / 2, 60, { align: 'center' });
  doc.text('Morrisville, PA 19067', w / 2, 73, { align: 'center' });
  doc.text('215-295-1348', w / 2, 86, { align: 'center' });

  doc.setFontSize(13);
  doc.text('Consent for Treatment & Assignment of Insurance Benefits', w / 2, 115, { align: 'center' });
  doc.setLineWidth(0.8);
  doc.line(m, 122, w - m, 122);

  doc.setFontSize(9.5);
  doc.setFont('times', 'normal');
  const treatText = "The undersigned hereby authorize All Right Dental PC to take X-rays, study models, photographs or any other diagnostic aids deemed appropriate by the Doctor to make a thorough diagnosis for my dental needs. I also authorize the Doctor to perform any and all forms of treatment, prescribe medication and therapy that may be indicated. I also understand the use of anesthetic agents embodies a certain risk. I understand that All Right Dental PC will submit a claim to my dental insurance for all services rendered. Any balance that is not covered by my dental insurance will be my financial responsibility. You have the right to ask for a Pre-treatment estimate is sent to my insurance for clarification of benefits prior to start of treatment.";
  const tLines = doc.splitTextToSize(treatText, contentWidth);
  doc.text(tLines, m, 142);

  let ty = 142 + (tLines.length * 12) + 16;

  // Highlighted Fee Notice Box
  doc.rect(m, ty, contentWidth, 48);
  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text("For ANY medical release records ( X-rays) there will be a fee of $50.00.", m + 12, ty + 19);
  doc.text("For ANY cancellation fee less than 24 hours prior to appointment there will be a fee of $25.00", m + 12, ty + 37);
  ty += 66;

  // Dental Insurance Information on file
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text(`Dental Insurance Carrier: ${formData.hasInsurance === 'yes' ? (formData.insuranceProvider || 'Insured') : 'Self-Pay / CareCredit'}`, m, ty);
  doc.text(`Subscriber ID #: ${formData.subscriberId || 'N/A'}`, 300, ty);
  doc.text(`Group #: ${formData.groupNumber || 'N/A'}`, 440, ty);
  ty += 32;

  // Signature Block 1: Treatment Consent
  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text("By signing you are agreeing with consent for Treatment.", m, ty);
  ty += 24;

  doc.text("X", m, ty);
  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.text(formData.treatmentConsentSignature || fullName, m + 20, ty);
  doc.line(m + 15, ty + 2, 370, ty + 2);

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text("Date:", 400, ty);
  doc.setFont('times', 'normal');
  doc.text(formData.treatmentConsentDate || today, 435, ty);
  doc.line(430, ty + 2, w - m, ty + 2);
  ty += 48;

  // Signature Block 2: Assignment of Benefits
  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text("By signing you are agreeing to assignment of Benefits.", m, ty);
  ty += 24;

  doc.text("X", m, ty);
  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.text(formData.benefitsAssignmentSignature || fullName, m + 20, ty);
  doc.line(m + 15, ty + 2, 370, ty + 2);

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text("Date:", 400, ty);
  doc.setFont('times', 'normal');
  doc.text(formData.benefitsAssignmentDate || today, 435, ty);
  doc.line(430, ty + 2, w - m, ty + 2);

  doc.setFontSize(7);
  doc.text("Form 3 of 3 • All Right Dental PC", w - m, 755, { align: 'right' });

  // Save / Download PDF
  const safeLastName = (formData.lastName || 'Patient').replace(/[^a-zA-Z0-9]/g, '_');
  const safeFirstName = (formData.firstName || '').replace(/[^a-zA-Z0-9]/g, '_');
  const safeChart = (chartId || 'Form').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `AllRight_Dental_Intake_${safeLastName}_${safeFirstName}_${safeChart}.pdf`;

  doc.save(fileName);
  return fileName;
}

