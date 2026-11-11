# Allright Dental Clinic - Web & AI Voice Receptionist Platform

A comprehensive modern dental healthcare platform combining a responsive patient portal, admin scheduling suite, and an **End-to-End Real-Time AI Voice Receptionist ("Sarah")** powered by Deepgram Nova-3 & Aura-Asteria.

---

## 🌟 Key Features

### 1. 24/7 AI Voice Receptionist ("Sarah")
- **Instant Live Calling**: Natural spoken conversation via browser WebSockets with sub-400ms turnaround.
- **2,986 Practice Records Database**: Pre-loaded practice patient records (`allright_patients.json`).
- **Phonetic Patient Matching**: Automatic Soundex/phonetic resolution for English & Indian names (e.g. *Vishal Bhargat* → *Vishal Bargat* with attending Dr. Shalini Mandapatti & Principal Life Insurance).
- **Express Check-In Meeting Codes**: Instant generation and voice read-out of meeting codes (e.g. `DEN-8656` for existing patients, `NEW-DEN-XXXX` for new patients).
- **Calendar Slot Conflict Detection**: Checks real-time schedule before confirming bookings.
- **Strict Dental Guardrails**: Firmly focused on dental procedures, cleanings, emergencies, and scheduling while politely declining unrelated topics.
- **Acoustic Echo Shield & Barge-In**: Hardware VAD with `UserStartedSpeaking` support; automatically pauses Sarah when the patient speaks without audio feedback.

### 2. Website & Scheduling Fixes
- **Updated Doctor Imagery**: Modern clinic team photo (`public/doctorsTeam.jpg`) on hero sliders.
- **Promotional Video Player**: Responsive 16:9 clinic video player (`public/promotional_video.mp4`) with feature highlights.
- **Walk-In Notices Removed**: All walk-in emergency references removed across all pages and headers.
- **Strict Saturday Operating Hours**: Saturday appointments strictly run from **9:00 AM to 12:00 PM** (UTC timezone offset bug completely resolved).
- **Tuesday Closed**: Emergency appointments on Tuesday removed from calendar and opening hours.

### 3. Integrated Admin Portal
- **Dashboard**: Appointment counts, patient totals, and quick actions.
- **Voice Receptionist Tab** (`/admin/voice-receptionist`):
  - **Live Voice Assistant Tester**: Direct microphone testing with waveform animation and real-time transcripts.
  - **Voice Bookings Table**: Check-in codes, appointment times, patient statuses, and notes.
  - **Practice Patient Database (2,986 patients)**: Search by Name, Chart #, Phone, or Insurance.
  - **Clinic Rules & Schedule Overview**: Verified practice operating hours and policies.

---

## 🚀 Running the Project

### Frontend (React + Vite)
```bash
cd AllRight_Frontend
npm install --legacy-peer-deps
npm run dev
```
Accessible at `http://localhost:5173`.

- **Main Website**: `http://localhost:5173/`
- **Full-Screen Voice Consultation**: `http://localhost:5173/voice-receptionist`
- **Admin Portal**: `http://localhost:5173/admin/dashboard`
- **Admin Voice Receptionist Panel**: `http://localhost:5173/admin/voice-receptionist`

### Voice Service (Python FastAPI & Deepgram Runtime)
Located in `voice_service/`:
```bash
cd voice_service
pip install -r requirements.txt
uvicorn src.voice_agent.server:app --host 0.0.0.0 --port 8000
```
- **Live Production Runtime**: `wss://voice-runtime-production-dc24.up.railway.app`
- **Supabase Workspace ID**: `9e41c18f-70da-441c-9895-8dce2e63c2ef`

### Backend (PHP & MySQL)
Located in `Backend_Dental/`:
- `syncVoiceBooking.php`: Direct endpoint syncing voice bookings into `final_appointments` & `blocked_slots`.
- `getVoiceBookings.php`: Retrieves confirmed voice bookings with check-in codes.
- `final_appointment.php`: Standard web booking endpoint.
- `getBlockedSlots.php`: Calendar slot availability check.
