const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default;

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'a4'
});

// A4: 595.28 x 841.89 pt
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 36;
const contentWidth = 523;

// Corporate Executive Palette
const NAVY = [14, 42, 71];          // #0E2A47 - Executive Deep Navy
const SLATE = [30, 41, 59];         // #1E293B - Dark Slate Text
const MUTED = [100, 116, 139];      // #64748B - Professional Muted Gray
const LIGHT_BG = [248, 250, 252];   // #F8FAFC - Clean Slate Surface
const BORDER = [226, 232, 240];     // #E2E8F0 - Subtle Structural Border
const BLUE_ACCENT = [0, 59, 196];   // #003BC4 - Brand Blue
const GREEN_ACCENT = [16, 149, 106];// #10956A - Subtle Corporate Green

// Running Header
function drawHeader(doc, pageNum) {
  doc.setFillColor(...NAVY);
  doc.rect(margin, 24, contentWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...NAVY);
  doc.text('ALLRIGHT DENTAL PC', margin, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text('AWS LEAN ARCHITECTURE & COST PROPOSAL', margin + contentWidth, 38, { align: 'right' });
}

// Running Footer
function drawFooter(doc, pageNum, totalPages) {
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 32, margin + contentWidth, pageHeight - 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text('AllRight Dental PC • Doctor Shalini Mandapatti, DDS • 229 Plaza Blvd, Suite 23, Morrisville, PA', margin, pageHeight - 18);
  doc.text(`Page ${pageNum} of ${totalPages}`, margin + contentWidth, pageHeight - 18, { align: 'right' });
}

// ============================================================================
// PAGE 1: ARCHITECTURE BLUEPRINT & SCOPE (BODY FIT - FULL PAGE)
// ============================================================================
drawHeader(doc, 1);

// Title Block
let y = 60;
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.setTextColor(...NAVY);
doc.text('AWS Lean Architecture Blueprint', margin, y);

y += 16;
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...MUTED);
doc.text('Production Cloud Specification for Practice Website, Digital Forms & AI Receptionist Chatbot', margin, y);

// Metadata Grid Table (Structured, Zero Overlaps)
y += 12;
autoTable(doc, {
  startY: y,
  margin: { left: margin, right: margin },
  theme: 'plain',
  styles: {
    fontSize: 8,
    cellPadding: { top: 4.5, bottom: 4.5, left: 8, right: 8 },
    lineColor: BORDER,
    lineWidth: 0.5,
    textColor: SLATE
  },
  columnStyles: {
    0: { fontStyle: 'bold', textColor: MUTED, cellWidth: 105, fillColor: LIGHT_BG },
    1: { cellWidth: 156, fillColor: [255, 255, 255] },
    2: { fontStyle: 'bold', textColor: MUTED, cellWidth: 105, fillColor: LIGHT_BG },
    3: { cellWidth: 157, fontStyle: 'bold', textColor: BLUE_ACCENT, fillColor: [255, 255, 255] }
  },
  body: [
    ['Practice / Client:', 'AllRight Dental PC', 'Target Workload:', 'Website, Form & AI Chatbot'],
    ['Location / Region:', 'Morrisville, PA (us-east-1)', 'Estimated Monthly Bill:', '$35.00 – $48.00 / month'],
    ['Lead Clinician:', 'Dr. Shalini Mandapatti, DDS', 'Cloud Provider:', 'Amazon Web Services (AWS)']
  ]
});

// Section 1: Executive Scope Directive
y = doc.lastAutoTable.finalY + 14;
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(...NAVY);
doc.text('1. Executive Scope & Strategic Directive', margin, y);

y += 12;
doc.setFont('helvetica', 'normal');
doc.setFontSize(8.2);
doc.setTextColor(...SLATE);
const scopeP1 = 'Per stakeholder instructions, this document formalizes the "start small" production architecture for AllRight Dental PC. All telephony, carrier SIP trunks, and Session Border Controllers (SBC) have been eliminated from the current implementation. The architecture is dedicated exclusively to delivering the practice public website, the 3-page digital patient intake form, and the 24/7 AI receptionist chatbot with HIPAA-aligned security.';
const splitP1 = doc.splitTextToSize(scopeP1, contentWidth);
doc.text(splitP1, margin, y);

y += (splitP1.length * 11) + 12;

// Section 2: Core AWS Services (Table 1)
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(...NAVY);
doc.text('2. Required AWS Services (Only 4 Components to Procure)', margin, y);

y += 8;
autoTable(doc, {
  startY: y,
  margin: { left: margin, right: margin },
  theme: 'grid',
  styles: {
    fontSize: 7.8,
    cellPadding: 5.5,
    textColor: SLATE,
    lineColor: BORDER,
    lineWidth: 0.5
  },
  headStyles: {
    fillColor: NAVY,
    textColor: [255, 255, 255],
    fontStyle: 'bold',
    fontSize: 8.2
  },
  columnStyles: {
    0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
    1: { cellWidth: 68, fontStyle: 'bold' },
    2: { cellWidth: 105, fontStyle: 'bold', textColor: NAVY },
    3: { cellWidth: 120 },
    4: { cellWidth: 210 }
  },
  head: [['#', 'Layer', 'AWS Service', 'Sizing / Specification', 'Functional Scope in Practice']],
  body: [
    ['1', 'Frontend', 'Amazon S3 +\nCloudFront CDN', 'Private Origin (OAC),\nGlobal Edge Caching, TLS 1.3', 'High-speed delivery of website and 3-page patient intake form. Automatic free SSL certificate.'],
    ['2', 'Application', 'AWS ECS Fargate\n(or App Runner)', '0.25 vCPU, 0.5 GB RAM\n(Lightweight Container)', 'Hosts backend REST APIs, processes intake submissions, and routes text messages to the AI receptionist.'],
    ['3', 'Database', 'Amazon RDS\nMySQL / Postgres', 'db.t4g.micro\n(20 GB SSD, Daily Snapshots)', 'Stores registered patient records, appointments, and medical history with AES-256 KMS encryption.'],
    ['4', 'Security', 'AWS KMS +\nCloudWatch / Cognito', 'Customer-Managed Key (KMS),\nCloudTrail + Access Logs', 'AES-256 encryption at rest for ePHI, immutable access audit logging, and role-based staff authentication.']
  ]
});

// Section 3: Excluded Overhead & Justification (Table 2 - Fills Lower Half of Page 1)
y = doc.lastAutoTable.finalY + 14;
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(...NAVY);
doc.text('3. Excluded Heavy Overhead (Why Cost Dropped from $160+)', margin, y);

y += 8;
autoTable(doc, {
  startY: y,
  margin: { left: margin, right: margin },
  theme: 'grid',
  styles: {
    fontSize: 7.5,
    cellPadding: 4.8,
    textColor: SLATE,
    lineColor: BORDER,
    lineWidth: 0.5
  },
  headStyles: {
    fillColor: [51, 65, 85],
    textColor: [255, 255, 255],
    fontStyle: 'bold',
    fontSize: 8
  },
  columnStyles: {
    0: { cellWidth: 135, fontStyle: 'bold' },
    1: { cellWidth: 270 },
    2: { cellWidth: 118, halign: 'right', fontStyle: 'bold', textColor: GREEN_ACCENT }
  },
  head: [['Excluded Item', 'Engineering Justification', 'Estimated Monthly Savings']],
  body: [
    ['Comcast Business SIP Trunk', 'Telephony out of current scope; AI Chatbot runs natively in web.', 'Eliminates trunk fees & usage rates'],
    ['SBC Gateways / Transcoders', 'No SIP audio transcoding servers or public telecom proxies needed.', 'Saves ~$50.00 / month in compute'],
    ['AWS NAT Gateway ($32/mo flat)', 'Used VPC Gateway Endpoints (S3) to eliminate flat monthly charges.', 'Saves $32.00 / month flat overhead'],
    ['Aurora Serverless v2 Multi-ACU', 'Small clinic workload does not justify high ACU idle cluster minimums.', 'Saves ~$45.00 / month idle capacity']
  ]
});

// Compliance & Security Callout Box (Fills bottom of Page 1 perfectly)
y = doc.lastAutoTable.finalY + 12;
doc.setFillColor(241, 245, 249);
doc.setDrawColor(...BORDER);
doc.setLineWidth(0.5);
doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(7.5);
doc.setTextColor(...NAVY);
doc.text('HIPAA COMPLIANCE & DATA SEGREGATION HIGHLIGHT:', margin + 10, y + 13);

doc.setFont('helvetica', 'normal');
doc.setFontSize(7.2);
doc.setTextColor(...SLATE);
doc.text('No patient health information (PHI) is exposed in public storage. S3 buckets are private behind Origin Access Control,', margin + 10, y + 24);
doc.text('all database storage is encrypted with customer-managed KMS keys, and application audit trails are retained in CloudWatch.', margin + 10, y + 33);

// ============================================================================
// PAGE 2: COST MODEL, SAVINGS & DEPLOYMENT ROADMAP (FULL PAGE)
// ============================================================================
doc.addPage();
drawHeader(doc, 2);

y = 60;
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.setTextColor(...NAVY);
doc.text('Estimated Monthly Cloud Cost & Savings', margin, y);

y += 16;
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...MUTED);
doc.text('Itemized Budget Projection & Deployment Plan for US-East-1 (N. Virginia)', margin, y);

// Visual Cost Cards (2 Balanced Hero Cards)
y += 12;
autoTable(doc, {
  startY: y,
  margin: { left: margin, right: margin },
  theme: 'plain',
  styles: {
    cellPadding: 8,
    lineColor: [203, 213, 225],
    lineWidth: 0.6,
    fillColor: [241, 245, 249]
  },
  columnStyles: {
    0: { cellWidth: 261 },
    1: { cellWidth: 262 }
  },
  body: [
    [
      { content: 'TOTAL ESTIMATED MONTHLY AWS COST:\n$35.00 – $48.00 / month', styles: { fontStyle: 'bold', fontSize: 10.5, textColor: BLUE_ACCENT, cellPadding: 8 } },
      { content: 'ANNUAL PROJECTED RUN-RATE:\n~$420 – $570 / year (Savings: ~68%)', styles: { fontStyle: 'bold', fontSize: 10.5, textColor: SLATE, cellPadding: 8 } }
    ]
  ]
});

// Section 4: Itemized Monthly Bill Table
y = doc.lastAutoTable.finalY + 16;
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(...NAVY);
doc.text('4. Itemized Monthly Bill Projection', margin, y);

y += 8;
autoTable(doc, {
  startY: y,
  margin: { left: margin, right: margin },
  theme: 'grid',
  styles: {
    fontSize: 7.8,
    cellPadding: 5,
    textColor: SLATE,
    lineColor: BORDER,
    lineWidth: 0.5
  },
  headStyles: {
    fillColor: NAVY,
    textColor: [255, 255, 255],
    fontStyle: 'bold',
    fontSize: 8.2
  },
  columnStyles: {
    0: { cellWidth: 165, fontStyle: 'bold' },
    1: { cellWidth: 245 },
    2: { cellWidth: 113, halign: 'right', fontStyle: 'bold', textColor: NAVY }
  },
  head: [['AWS Service / Line Item', 'Usage Metric & Allocation Basis', 'Estimated Monthly Cost']],
  body: [
    ['Amazon S3 (Frontend Storage)', 'Storage for static web assets (< 1 GB) + GET requests', '$0.50 – $1.00'],
    ['Amazon CloudFront (CDN Edge)', '10,000+ monthly pageviews, SSL termination, caching', '$1.00 – $1.50'],
    ['AWS ECS Fargate (API/Chatbot)', 'Single 0.25 vCPU / 0.5 GB RAM task running 24/7 (730 hours)', '$10.50 – $14.00'],
    ['Amazon RDS (db.t4g.micro)', 'Single-AZ 24/7 MySQL or Postgres instance + 20 GB gp3 storage', '$15.00 – $20.00'],
    ['AWS Key Management Service (KMS)', '1 Customer-Managed Key for ePHI encryption + 10k API requests', '$1.00 – $1.50'],
    ['Amazon CloudWatch & CloudTrail', 'Audit access logs, system monitoring, error alarms (retained 90 days)', '$3.00 – $5.00'],
    ['AWS WAF (Web App Firewall)', 'Basic rate-limiting & bot protection for intake form submissions', '$4.50 – $5.50'],
    ['Amazon Cognito (Identity)', 'User directory for staff administration (First 50,000 MAU are free)', '$0.00 (Free Tier)'],
    ['TOTAL ESTIMATED AWS EXPENSE', 'All-inclusive cloud hosting for Website, Digital Form & AI Chatbot', '$35.50 – $48.50 / month']
  ],
  foot: [['BUDGET IMPACT SUMMARY', 'Original 12-page proposal quoted $99.50 – $164.00 / month.', 'SAVINGS: ~68%']]
});

// Section 5: Implementation Roadmap
y = doc.lastAutoTable.finalY + 16;
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(...NAVY);
doc.text('5. Implementation Roadmap (4 Actionable Steps)', margin, y);

y += 8;
autoTable(doc, {
  startY: y,
  margin: { left: margin, right: margin },
  theme: 'grid',
  styles: {
    fontSize: 7.5,
    cellPadding: 4.5,
    textColor: SLATE,
    lineColor: BORDER,
    lineWidth: 0.5
  },
  headStyles: {
    fillColor: [51, 65, 85],
    textColor: [255, 255, 255],
    fontStyle: 'bold',
    fontSize: 8
  },
  columnStyles: {
    0: { cellWidth: 50, halign: 'center', fontStyle: 'bold' },
    1: { cellWidth: 130, fontStyle: 'bold' },
    2: { cellWidth: 343 }
  },
  head: [['Step', 'Action Item', 'Deliverable & Objective']],
  body: [
    ['Step 1', 'AWS BAA Execution', 'Sign in to the practice AWS console and execute the standard Business Associate Addendum online.'],
    ['Step 2', 'Infrastructure Provisioning', 'Deploy S3 bucket, CloudFront CDN, and RDS MySQL/Postgres using verified Terraform modules.'],
    ['Step 3', 'Application Deployment', 'Build and upload static web assets to S3 and launch the containerized chatbot API in ECS Fargate.'],
    ['Step 4', 'DNS & Production Go-Live', 'Point allrightdental.com domain DNS to CloudFront with automated ACM SSL certificate renewal.']
  ]
});

// Footers on both pages
const totalPages = doc.internal.getNumberOfPages();
for (let p = 1; p <= totalPages; p++) {
  doc.setPage(p);
  drawFooter(doc, p, totalPages);
}

// Output Paths
const outPath1 = path.join('C:\\Users\\Piyush Junghare\\Downloads', 'AllRight_Dental_AWS_Minimal_Architecture_Cost.pdf');
const outPath2 = path.join('C:\\Users\\Piyush Junghare\\.gemini\\antigravity\\brain\\3ced4f37-836f-4882-9cc4-5aef33902ba0', 'AllRight_Dental_AWS_Minimal_Architecture_Cost.pdf');

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outPath1, pdfBuffer);
fs.writeFileSync(outPath2, pdfBuffer);

console.log('Master Executive PDF generated successfully! Total pages:', doc.internal.getNumberOfPages());
