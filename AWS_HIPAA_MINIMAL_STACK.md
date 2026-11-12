# Minimal HIPAA-Compliant AWS Architecture Stack (Lean Starter Edition)
**Practice:** AllRight Dental (Doctor Shalini Mandapatti, DDS)  
**System Scope:** Practice Website, Digital Patient Intake Portal, React Frontend & 24/7 AI Web Receptionist (Sarah)  
**Deployment Strategy:** Lean Starter AWS Deployment ("Start Small" — Website, Bot & Digital Intake)  
**Standard:** US Health Insurance Portability and Accountability Act (HIPAA) Security Rule (45 CFR Part 160 & Part 164) & NIST SP 800-63B MFA

---

## 1. Executive Summary & Revised Scope

Following client directive to **start lean, minimize overhead, and defer telephony carrier integrations**:
1. **Telephony & PSTN Calling Deferred:** External telephone carrier trunking (Comcast Business SIP Trunking, PBX/SBC infrastructure) is deferred from Phase 1. All voice and chat interactions run directly and securely over the web.
2. **Core Production Scope:**
   - **AllRight Dental Web Platform:** Public practice website and appointment scheduling.
   - **Digital Patient Intake & Medical History Portal:** Full 3-page digitized patient registration (demographics, comprehensive medical history, dental insurance verification, and HIPAA consent with legal electronic signature).
   - **24/7 AI Receptionist (Sarah):** Dual-mode Web Voice Assistant (16kHz mic, 24kHz Aura Asteria synthesis with 250ms adaptive jitter buffer) and Web Chatbot with instant 1-tap dental service chips.
   - **HIPAA ePHI Data Store:** Encrypted database storing patient charts, medical alerts, and intake records.
3. **Target AWS Starter Cost:** **~$20.00 – $45.00 / month** *(Achieves full HIPAA technical compliance on a lean starter budget without expensive carrier/NAT gateway overhead)*.

---

## 2. Lean Architecture Diagram

```mermaid
flowchart TD
    User([Patients & Practice Staff]) -->|HTTPS / TLS 1.3| CF[Amazon CloudFront CDN / Edge\nSSL & Security Headers]
    
    subgraph EdgeSecurity["Public Edge & Delivery"]
        CF --> S3_Web[Amazon S3 Static Bucket\nReact SPA Frontend]
    end

    subgraph AWS_Instance["AWS Lean Production Instance (EC2 / Lightsail / App Runner)"]
        subgraph AppService["Application & API Layer"]
            API[Express.js / Node.js API Service\nPatient Records & Intake Engine]
            Auth[Cognito / JWT Auth Middleware\nRole-Based Access & MFA]
        end

        subgraph LocalData["Encrypted ePHI Data Store"]
            DB[(PostgreSQL / MySQL Database\nAES-256 KMS CMK Encrypted)]
        end
    end

    subgraph CloudSecurity["HIPAA Security & Audit Controls"]
        KMS[AWS KMS\nCustomer Managed Key - CMK]
        CloudWatch[Amazon CloudWatch\nEncrypted Audit Logs]
        S3_Audit[S3 Audit Bucket\nObject Lock Compliance Mode]
    end

    subgraph WebAI["24/7 AI Receptionist (Sarah - Web Voice & Chat)"]
        BrowserClient([Patient Browser / Mobile]) -->|Secure WSS\n24kHz Linear16| DeepgramAgent[Deepgram Voice Agent API\nBAA Signed WebSocket]
        DeepgramAgent <-->|Direct Tool Calls\nPatient Lookup / Bookings| API
    end

    CF -->|/api/*| API
    API --> DB
    KMS -.->|Encrypts at Rest| DB
    KMS -.->|Encrypts at Rest| S3_Audit
    API -.->|ePHI Access Logs| CloudWatch
    CloudWatch --> S3_Audit
```

---

## 3. Revised Starter Component Breakdown & Monthly Costs

| Component | AWS Service / Pattern | HIPAA Compliance Role | Monthly Cost (Est.) |
| :--- | :--- | :--- | :--- |
| **Frontend Web Hosting** | Amazon S3 + CloudFront CDN | Fast worldwide delivery of React SPA. TLS 1.3, HSTS headers, zero PHI stored in public assets. | **$1.50 – $3.00** |
| **Lean Production Instance** | AWS Lightsail (2GB RAM) or EC2 `t4g.small` | Hosts backend APIs, digital patient intake processing, and patient directory. Private network isolation. | **$10.00 – $15.00** |
| **ePHI Database** | Managed RDS MySQL / PostgreSQL (or encrypted Lightsail DB) | Stores 3,200+ patient records, digital intake forms, and appointments. Encrypted at rest with KMS AES-256. | **$12.00 – $25.00** |
| **Identity & Access Control** | AWS Cognito User Pools | Mandatory Multi-Factor Authentication (MFA), role-based permissions (`Doctor`, `Receptionist`, `Admin`, `Patient`). | **$0.00** *(First 50k MAU free)* |
| **Encryption Keys** | AWS KMS (Customer Managed Key) | Dedicated CMK with automatic annual rotation for database volumes and audit logs. | **$1.00 – $2.00** |
| **Audit Trail & Logging** | AWS CloudWatch + S3 Archive | Immutable ePHI audit trail recording every patient form submission, lookup, and appointment booking. | **$2.00 – $5.00** |
| **Total Lean AWS Starter Stack** | | **100% HIPAA BAA Eligible** | **~$26.50 – $48.00 / mo** |

*Note: Telephony SIP trunking, Session Border Controllers (SBC), and per-minute carrier trunks are completely excluded from Phase 1, keeping operational costs strictly under $50/mo.*

---

## 4. Digital Patient Intake Form System (§ 164.312)

The practice's traditional 3-page paper intake form has been completely digitized into a secure, mobile-responsive web flow at `/patient-form`:

### 4.1 Digitized Clinical Sections (Exact Paper Match)
1. **Patient Demographics:** First/Last Name, DOB, Gender, Phone, Email, Home Address, Emergency Contact details.
2. **Confidential Medical History:**
   - Active physician care, hospitalizations, surgeries, head/neck injuries.
   - Current prescription medications, blood thinners, bisphosphonates (Fosamax/Boniva).
   - Tobacco, vape, and controlled substance usage.
   - Pregnancy & nursing status for female patients.
   - Comprehensive **Allergies Checklist** (Penicillin, Aspirin, Codeine, Local Anesthetics, Latex, Sulfa, etc.).
   - 22-point **Systemic Medical Conditions Checklist** (Heart conditions, high/low blood pressure, diabetes, asthma, hepatitis, arthritis, TMJ/bruxism).
3. **Dental Insurance & Billing:**
   - Insurance carrier selection (Delta Dental, MetLife, Cigna, Guardian, Aetna, Humana, UnitedHealthcare, Principal, etc.).
   - Member Subscriber ID, Group Number, Policyholder details.
   - Self-Pay / CareCredit 0% financing option.
4. **HIPAA Consent & Treatment Authorization:**
   - Acknowledgment of HIPAA Notice of Privacy Practices (45 CFR § 164.520).
   - Family discussion permission (designated individuals allowed to discuss care).
   - Informed consent for examinations, digital X-rays, diagnostic models, and local anesthesia by Doctor Shalini Mandapatti.
   - Assignment of insurance benefits and financial responsibility acknowledgment.
   - **Legal Electronic Signature** under the federal ESIGN Act (15 U.S.C. § 7001) with auto-timestamp.

### 4.2 Dynamic Integration with AI Receptionist & Clinic EHR
- Upon form submission, the patient's record is immediately saved with a unique **Chart ID (e.g. `CHR-4921`)**.
- The record automatically syncs with **Sarah (AI Voice & Chat Receptionist)**:
  - When the patient calls or chats, Sarah recognizes them immediately by name and DOB via `lookup_patient()`.
  - Sarah greets them warmly as a verified patient and knows their insurance on file.
- Generates an on-screen **Digital Intake Receipt** with one-click print/PDF functionality.

---

## 5. AI Receptionist (Sarah) Protocol & Voice/Chat Stability

The 24/7 AI Receptionist is running in production with zero external telephony dependencies:
1. **Direct Native WebSocket Architecture:** Bypasses legacy wrapper bottlenecks; establishes direct real-time WebSocket connection to Deepgram Nova-3 + Aura Asteria.
2. **Adaptive 250ms Jitter Buffer:**
   - Eliminates choppy audio and stutters by pre-buffering 250ms of audio cushion before playback.
   - Concatenates 20ms chunks into gapless 120ms batches scheduled on the browser's Web Audio clock.
   - Tested and verified: **0 audio underruns**.
3. **Clean Mode Separation:**
   - **Chat Mode:** Text-only dialogue, instant responses, audio muted.
   - **Voice Mode:** Active microphone, 24kHz high-fidelity spoken dialogue with instant barge-in interrupt.
4. **1-Tap Service Minimization:** 8 prominent chips for instant access to Routine Cleaning, Toothache Emergency, Crowns, Whitening, Root Canals, Implants, Insurance Verification, and Available Slots.
5. **Relaxed Guardrails:** Welcomes questions regarding HIPAA compliance, encryption, and custom dental oral appliances (nightguards, sports guards, retainers) without robotic canned refusals.

---

## 6. AWS Security, Encryption & BAA Signing

1. **Signing the AWS BAA (Zero Cost):**
   - Navigate to **AWS Artifact** in the AWS Console.
   - Select **Agreements** -> **AWS Business Associate Addendum (BAA)**.
   - Click **Accept Agreement**. The BAA is instantly active for all HIPAA-eligible services.
2. **Encryption Standards:**
   - **Data at Rest:** Encrypted using AWS KMS with AES-256 (`alias/allright-dental-hipaa-key`).
   - **Data in Transit:** TLS 1.3 enforced across all web routes and secure WebSockets (`wss://`).
3. **Role-Based Access Control (RBAC):**
   - `SuperAdmin` (Doctor Shalini Mandapatti)
   - `Doctor` (Associate Dentists)
   - `Receptionist` (Front Desk Staff)
   - `Patient` (Self-service intake and portal access)
4. **Session Controls:** 15-minute inactivity timeout, mandatory MFA for clinical staff.

---

## 7. Deliverables & Deployment Links

- **Live Production Application:** [https://allright-dental.vercel.app](https://allright-dental.vercel.app)
- **Digital Patient Intake Form:** [https://allright-dental.vercel.app/patient-form](https://allright-dental.vercel.app/patient-form)
- **24/7 AI Receptionist (Sarah):** [https://allright-dental.vercel.app/voice-receptionist](https://allright-dental.vercel.app/voice-receptionist)
- **GitHub Repository:** [https://github.com/DataBuks11/allright-dental](https://github.com/DataBuks11/allright-dental)
