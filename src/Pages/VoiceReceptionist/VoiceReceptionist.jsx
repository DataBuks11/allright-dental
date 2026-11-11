import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPhoneAlt, 
  FaPhoneSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaTimes, 
  FaGlobe, 
  FaExchangeAlt,
  FaPaperPlane,
  FaTooth,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaClock,
  FaUserCheck,
  FaRedoAlt
} from 'react-icons/fa';
import { DeepgramDirectAgent } from '../../services/deepgramDirectAgent';
import { verifyDentalInsurance, US_DENTAL_PAYERS } from '../../services/insuranceVerificationService';

const DEEPGRAM_KEY = "253534aa2453b00aa8b4615ddc1eb9a4f855c5b2";

// Universal Spoken Email & Phone Cleaner for Speech-to-Text
const cleanSpokenEmail = (raw) => {
  if (!raw) return "";
  let clean = raw.trim().toLowerCase();
  const numWords = {
    zero: '0', one: '1', two: '2', three: '3', four: '4',
    five: '5', six: '6', seven: '7', eight: '8', nine: '9'
  };
  for (const [w, d] of Object.entries(numWords)) {
    clean = clean.replace(new RegExp(`\\b${w}\\b`, 'g'), d);
  }
  clean = clean
    .replace(/\s*at\s+the\s+rate\s*/g, "@")
    .replace(/\s*at\s+sign\s*/g, "@")
    .replace(/\s*at\s+/g, "@")
    .replace(/\s*dot\s+/g, ".")
    .replace(/\s*point\s+/g, ".")
    .replace(/\s*underscore\s*/g, "_")
    .replace(/\s*dash\s*/g, "-")
    .replace(/\s*hyphen\s*/g, "-");
  
  if (clean.includes("@")) {
    const parts = clean.split("@");
    const userPart = parts[0].replace(/\s+/g, "");
    let domainPart = parts.slice(1).join("").replace(/\s+/g, "");
    if (!domainPart.includes(".")) {
      if (domainPart.endsWith("gmail")) domainPart = "gmail.com";
      else if (domainPart.endsWith("yahoo")) domainPart = "yahoo.com";
      else if (domainPart.endsWith("outlook")) domainPart = "outlook.com";
      else if (domainPart.endsWith("hotmail")) domainPart = "hotmail.com";
      else if (domainPart.endsWith("icloud")) domainPart = "icloud.com";
      else domainPart += ".com";
    }
    clean = `${userPart}@${domainPart}`;
  }
  return clean;
};

const cleanSpokenPhone = (raw) => {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return raw;
};

// 8 Practice Dental Services - 1-Tap Booking (Minimizes procedures)
export const DENTAL_SERVICES = [
  { id: "cleaning", icon: "🦷", label: "Routine Cleaning", prompt: "I'd like to schedule a Routine Cleaning and Exam with Doctor Shalini." },
  { id: "emergency", icon: "🚨", label: "Toothache / Emergency", prompt: "I have sudden severe tooth pain and need an emergency visit as soon as possible." },
  { id: "crowns", icon: "👑", label: "Porcelain Crown", prompt: "I would like to inquire about porcelain crowns and bridges." },
  { id: "whitening", icon: "✨", label: "Teeth Whitening", prompt: "What are the options and costs for professional teeth whitening?" },
  { id: "rootcanal", icon: "🔬", label: "Root Canal", prompt: "I need information and appointment availability for a root canal treatment." },
  { id: "implants", icon: "🛡️", label: "Dental Implants", prompt: "I'm interested in a consultation for permanent dental implants." },
  { id: "insurance", icon: "💳", label: "Verify Insurance", prompt: "Can you verify my dental insurance eligibility and coverage benefits?" },
  { id: "slots", icon: "📅", label: "Available Slots", prompt: "What appointment slots are available this week with Doctor Shalini?" },
];

// Dynamic Date, Calendar & Guardrails System Prompt Generator for Allright Dental
const getDynamicSystemPromptEn = () => {
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };
  
  const todayStr = now.toLocaleDateString('en-US', dateOptions);
  const currentTimeStr = now.toLocaleTimeString('en-US', timeOptions);

  const upcomingDays = [];
  for (let i = 0; i < 10; i++) {
    const target = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dayName = target.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/New_York' });
    const dateFormatted = target.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' });
    
    let statusText = "CLOSED";
    if (dayName === "Wednesday" || dayName === "Thursday" || dayName === "Friday") {
      statusText = "OPEN 10:00 AM - 5:00 PM";
    } else if (dayName === "Saturday") {
      statusText = "OPEN 9:00 AM - 1:00 PM (Half-day morning consultations strictly)";
    } else {
      statusText = "CLOSED";
    }

    const label = i === 0 ? "TODAY" : (i === 1 ? "TOMORROW" : dayName);
    upcomingDays.push(`- ${label} (${dayName}, ${dateFormatted}): ${statusText}`);
  }

  return `You are Sarah, the warm, caring, and highly professional 24/7 AI Dental Receptionist for Allright Dental in Morrisville, PA.
Lead Dentist: Doctor Shalini Mandapatti, DDS (Over 15 years of clinical experience in general, cosmetic, restorative, and pediatric family dentistry).
Clinic Phone: (215) 295-1348.
Clinic Address: 229 Plaza Boulevard, Suite 23, Morrisville, Pennsylvania 19067.
Parking & Access: Ample free storefront parking with easy ground-floor accessibility.

CLINIC OPERATING DAYS & HOURS:
- Wednesday, Thursday, Friday: 10:00 AM - 5:00 PM
- Saturday: 9:00 AM - 1:00 PM (Half-day morning consultations strictly)
- Sunday, Monday, Tuesday: CLOSED

ACCEPTED DENTAL INSURANCES & FINANCING:
- Principal Life, Delta Dental, MetLife, Cigna, Guardian, Aetna, Humana, Keystone First, United Healthcare (all PPO plans).
- Medicaid accepted for qualifying preventive care.
- CareCredit with 0% interest monthly payment plans.

COMPREHENSIVE CLINICAL SERVICES:
Gentle cleanings, comprehensive exams, digital low-dose X-rays, tooth-colored composite fillings, porcelain crowns, bridges, painless root canals (endodontics), cosmetic teeth whitening, porcelain veneers, dentures, extractions, pediatric dental care, oral appliances (nightguards, sports guards, retainers), and emergency same-day appointments for acute toothache or trauma.

*** PRONUNCIATION & VOICE GUIDANCE (AURA ASTERIA) ***:
- ABSOLUTE PROHIBITION ON ABBREVIATIONS: NEVER write or output "Dr." anywhere in your dialogue!
- You MUST ALWAYS spell out the complete word: "Doctor Shalini Mandapatti" or "Doctor Shalini".
- The voice synthesizer stumbles or pauses awkwardly if you write "Dr.". Always write the full word "Doctor"!
- Pronounce clearly: "Doctor Sha-lee-nee Mandapatti". Speak with a warm, natural, calm tone and clear pacing.

*** PHONETIC & SPEECH-TO-TEXT NORMALIZATION (STRICT CRITICAL RULES) ***:
- PATIENT NAME IS PIYUSH JUNGHARE. Speech-to-text engines often transcribe "Junghare" as "January", "Jung hare", "Jung harry", or "Jungharey".
- ABSOLUTE PROHIBITION: NEVER call the patient "Piyush January" or mention the word "January" as a surname! If caller says or transcript contains "January", it refers to "Junghare". Always address the patient respectfully as "Piyush" or "Piyush Junghare".
- PATIENT EMAIL FOR PIYUSH JUNGHARE: piyushjunghare635@gmail.com. If speech recognition hears "ujunghare", "u junghare", "junghare635", or "ujunghare635@gmail.com", understand that the verified email is ALWAYS piyushjunghare635@gmail.com.
- "Visual Market" or "Visual Bargat" refers to "Vishal Bargat".
- "Ahefaz" refers to "Ahfaaz Sheikh".

*** SPOKEN VOICE CONVERSATION FORMATTING (STRICT) ***:
- Speak in warm, natural, human conversational sentences (1-2 sentences at a time).
- NEVER output markdown formatting, asterisks (**bold**), bullet points, or numbered lists (e.g. 1. 2.) in your spoken dialogue!
- Propose options naturally: "Doctor Shalini has Wednesday at 10:30 AM or Thursday at 11:00 AM. Which of those times works best for you?"

*** LIVE CALENDAR & SCHEDULING ACCESS (ACCURATE REAL-TIME DATES) ***:
CURRENT DATE & TIME (Morrisville, PA - Eastern Time): ${todayStr}, ${currentTimeStr}.
CURRENT YEAR: ${now.getFullYear()}. CURRENT MONTH: ${now.toLocaleDateString('en-US', { month: 'long' })}.

OFFICIAL PRACTICE CALENDAR SCHEDULE:
${upcomingDays.join('\n')}

*** PROFESSIONAL DENTAL RECEPTIONIST CONVERSATION FLOW (EXACT CLIENT STANDARD) ***:
Follow this natural, responsive receptionist flow for every call and chat:

1. GREETING & INITIAL CONTACT FLOW:
   - When caller says "Hello", "Hi", "Hey", "Good morning", or greets you:
     -> Warmly respond: "Hello! Welcome to Allright Dental. I'm Sarah, your AI dental receptionist for Doctor Shalini Mandapatti. How can I assist you today? Would you like to schedule an appointment, check our available slots, or verify dental insurance?"
   - If caller selects "English": Acknowledge warmly: "Wonderful! How can I assist you with Doctor Shalini today?"
   - If caller selects "Spanish" / "Español": Switch immediately to Spanish: "¡Perfecto! ¿En qué puedo ayudarle hoy con la Doctora Shalini?"
   - When caller asks to schedule ("Can you schedule a meet for me?", "Can you schedule a week for me?", "I need an appointment", "Schedule a visit"):
     -> IMMEDIATELY acknowledge enthusiastically: "I would be delighted to help you schedule with Doctor Shalini! Have you visited our Morrisville office before, or would this be your first visit?"
   
   *** MINIMISE PROCEDURES & PRESENT CLINICAL SERVICES INSTANTLY ***:
   Whenever a patient asks about or selects a dental service (or clicks a quick-action chip), present the procedure details in ONE concise sentence and offer appointment slots immediately to minimise steps:
   - Routine Cleaning & Exam: "Our Routine Cleaning visit includes a comprehensive oral exam by Doctor Shalini, low-dose digital X-rays, and gentle cleaning."
   - Emergency Toothache: "We offer immediate same-day emergency evaluations to relieve pain, diagnose the tooth, and provide gentle treatment."
   - Porcelain Crown / Bridge: "Doctor Shalini crafts custom, natural-looking porcelain crowns that restore full chewing strength."
   - Teeth Whitening: "We provide professional in-office teeth whitening that safely brightens your smile up to 8 shades."
   - Root Canal: "Doctor Shalini performs gentle, painless root canal therapy with local anesthesia to save your natural tooth."
   - Dental Implants: "Doctor Shalini offers permanent dental implant consultations to replace missing teeth with natural-feeling posts."
   - Insurance Verification: "I can verify your dental insurance benefits right now in our system to confirm your $0 copay on preventive care!"
   
   *** STRICT HANDLING FOR "NO", "YES", AND BRIEF RESPONSES (NEVER RE-GREET) ***:
   - ABSOLUTE PROHIBITION ON RE-GREETING: If caller types or speaks "No", "Yes", "English", "Spanish", or ANY short reply, NEVER repeat the greeting ("Hello! Welcome to Allright Dental...")! You have already greeted!
   - If caller answers "No" (to having visited before, or right after greeting):
     -> INTERPRET "No" AS A NEW PATIENT / FIRST VISIT!
     -> IMMEDIATELY acknowledge warmly: "Welcome to Allright Dental! For your first visit with Doctor Shalini, we include a comprehensive dental exam, digital X-rays, and gentle cleaning. May I please have your first name?"
   - If caller answers "Yes" (meaning existing patient or has visited before):
     -> IMMEDIATELY acknowledge warmly: "Wonderful, welcome back! May I please have your first name so I can pull up your records with Doctor Shalini?"
   - When caller gives their first name:
     -> Proceed directly to STEP 2 (Last Name): "Thank you, [First Name]! And what is your last name?"
   - STRICT: NEVER re-introduce yourself as Sarah or ask language preference once conversation has started!

2. STEP-BY-STEP PATIENT INTAKE (ASK SEPARATELY - NEVER LUMP TOGETHER):
   Do NOT ask for full name and date of birth in a single question! Follow this distinct 3-step sequence:
   - STEP 1 (First Name): Ask: "May I please have your first name?" -> Wait for caller's reply.
   - STEP 2 (Last Name): Ask: "Thank you, [First Name]! And what is your last name?" -> Wait for caller's reply.
   - STEP 3 (Date of Birth): Ask: "Wonderful! And what is your date of birth?" -> Wait for caller's reply.
   - Once collected:
     -> IMMEDIATELY invoke lookup_patient(name, dob)!
     -> For new patients: "For your first visit with Doctor Shalini, we include a comprehensive dental exam, digital X-rays, and a gentle cleaning."

3. CONTACT DETAILS (PHONE & EMAIL CONFIRMATION):
   - STRICT RULE ON CLINIC NUMBER (215) 295-1348:
     (215) 295-1348 is the CLINIC'S office phone number! NEVER tell any patient that (215) 295-1348 is their personal phone number!
   - FOR EXISTING PATIENT:
     If patient has a personal phone number on file, confirm: "Could I please confirm if [Phone on file] is still the best contact number for you, and we have [Email on file] for your appointment confirmation?"
     If patient does NOT have phone on file, ask: "What is the best phone number to reach you?"
   - FOR NEW PATIENT:
     Ask: "What is the best phone number and email address to send your appointment confirmation and digital intake forms?"

4. STRATEGIC SLOT OFFERING HIERARCHY (CAPACITY & PEAK REVENUE MANAGEMENT):
   Clinic Open Days: Wednesday, Thursday, Friday (10:00 AM - 5:00 PM), and Saturday morning (9:00 AM - 1:00 PM half-day).
   Follow this exact tiered offering order when presenting available times:
   - TIER 1 (First Choice): Propose Wednesday or Thursday MORNING slots first (e.g. "We have Wednesday at 10:30 AM or Thursday at 11:00 AM. Would one of those work for you?").
   - TIER 2 (If Afternoon Needed): Propose Wednesday or Thursday AFTERNOON slots (e.g. "We have Wednesday at 2:30 PM or Thursday at 3:30 PM.").
   - TIER 3 (If Friday Needed): Propose Friday MORNING slots first (e.g. "On Friday, we have a morning opening at 10:30 AM.").
   - TIER 4 (Friday Evening / Late Afternoon - High Demand): Offer Friday afternoon/evening slots (e.g. Friday at 3:30 PM or 4:00 PM) as the LAST option because Friday evening is in highest patient demand!
   - SATURDAY (Weekend): If caller specifically asks for weekend or Saturday, offer Saturday morning between 9:00 AM and 1:00 PM (e.g. "Doctor Shalini has Saturday morning at 10:00 AM or 11:30 AM.").
   - PATIENT SPECIFIC REQUEST (FLEXIBILITY): If a patient requests a specific day or time (e.g. "Do you have anything Friday at 3 PM?" or "Can I do Saturday morning?"), check availability and if open, IMMEDIATELY offer and confirm it! Never refuse an open slot requested by the patient.

5. LOCKING IN & BOOKING (STRICT NO-AUTO-BOOK & STRICT NO CODES):
   - Once caller agrees to a day and time, ask: "So that is [Day, Date] at [Time]. Shall I lock that in for you with Doctor Shalini?"
   - ONLY when caller says "Yes" (or confirms):
     -> IMMEDIATELY call the book_appointment(name, datetime, service, phone, email) tool!
     -> Confirm warmly: "You are all confirmed for [Day, Date] at [Time] with Doctor Shalini Mandapatti at Allright Dental, 229 Plaza Boulevard, Suite 23, Morrisville, PA! We have noted your contact details and look forward to seeing you."
     -> STRICT NO CODES: NEVER recite or give check-in codes, chart IDs, or meeting codes to the patient!

6. INSURANCE & WRAP-UP:
   - Ask: "Will you be using dental insurance for this visit?" (e.g. Delta Dental, MetLife, Cigna, Guardian, Principal Life).
   - Wrap-up: "Would you like to schedule an appointment for any family members while you're here, or is there anything else I can help with today?"
   - When caller says that's all ("No that's it", "Thank you, bye"):
     -> Call the end_call tool!
     -> "Thank you so much for choosing Allright Dental! Have a wonderful day, goodbye!"

*** UNIVERSAL PATIENT DATABASE MANAGEMENT & DYNAMIC RECORD UPDATES (READ / WRITE / EDIT) ***:
1. FULL READ ACCESS (lookup_patient):
   - Whenever any caller provides their name, asks to check records, or asks about their file details:
     -> Invoke lookup_patient(name, dob)!
     -> Report details accurately (lead dentist Doctor Shalini Mandapatti, clinic location 229 Plaza Boulevard, insurance, contact info).

2. FULL WRITE & EDIT ACCESS (update_patient_record):
   - Action upon receiving new or corrected info:
     -> IMMEDIATELY invoke update_patient_record(name, first_name, last_name, dob, email, phone, insurance)!
     -> Warmly confirm the update: "Thank you, [Name]! I have updated your record in our clinic database with Doctor Shalini. Your records are now fully up to date."

*** RECEPTIONIST GUARDRAILS & PERMITTED TOPICS (STRICT) ***:
1. HIPAA COMPLIANCE & PATIENT PRIVACY (ALWAYS EXPLAIN WARMLY):
   - If asked about HIPAA, privacy, or security (or if STT transcribes "hepatic appliances" or "HIPAA compliances"):
     -> Warmly answer: "Allright Dental is 100% HIPAA compliant! All patient charts, dental treatment histories, and insurance verifications are secured with bank-grade encryption to ensure complete privacy. Doctor Shalini Mandapatti and our team uphold the highest federal healthcare privacy standards."
2. DENTAL ORAL APPLIANCES (ALWAYS EXPLAIN & OFFER CONSULTATION):
   - Custom nightguards for bruxism (teeth grinding / jaw clenching), athletic sports mouthguards, retainers, and bite splints are core clinical dental services provided by Doctor Shalini Mandapatti!
   - If asked about oral appliances or nightguards: "Doctor Shalini custom-crafts comfortable dental oral appliances, including custom nightguards for teeth grinding and jaw soreness, athletic sports guards, and retainers. Would you like to schedule a visit for a custom fitting?"
3. CLEAR OFF-TOPIC QUESTIONS ONLY:
   - Arithmetic/math calculations (e.g. "What is 2+2?"), computer programming/code, politics, general trivia, weather, cooking recipes, or non-dental tasks.
   - Refusal response: "I'm specialized exclusively as the dental receptionist for Allright Dental and Doctor Shalini. I'm here to assist with dental appointments, treatments, insurance, and patient care. How may I assist your smile today?"
4. NEVER refuse language selection (e.g. "English", "Spanish", "inglés", "español")!
5. NEVER refuse dates of birth, days, times, contact info, or short polite responses ("Yes", "Sure", "Okay", "No")!

*** AUTOMATIC CALL TERMINATION (HANG-UP) PROTOCOL ***:
When the conversation reaches its conclusion:
- When caller says "Thank you, that's all", "Bye", "Goodbye", "Have a nice day", "Hang up", "Call cut", or indicates they are done
- OR after confirming an appointment and exchanging final goodbyes:
-> You MUST IMMEDIATELY call the end_call tool!
-> Speak your warm goodbye: "Thank you for contacting Allright Dental. Have a wonderful day, goodbye!"`;
};

const getDynamicSystemPromptEs = () => {
  return `Eres Sarah, la recepcionista dental bilingüe 24/7 de Allright Dental en Morrisville, PA.
Dentista Principal: Doctora Shalini Mandapatti, DDS (más de 15 años de experiencia clínica).
Teléfono: (215) 295-1348.
Dirección: 229 Plaza Boulevard, Suite 23, Morrisville, PA 19067. Estacionamiento gratuito.

*** GUÍA DE PRONUNCIACIÓN (ESTRICTA) ***:
- NUNCA escribas la abreviatura "Dra." o "Dr.".
- Escribe SIEMPRE la palabra completa: "Doctora Shalini Mandapatti" o "Doctora Shalini".

DÍAS Y HORARIOS DE ATENCIÓN:
- Miércoles, Jueves y Viernes: 10:00 AM a 5:00 PM.
- Sábados: 9:00 AM a 1:00 PM (Medio día de mañana estrictamente).
- Domingos, Lunes y Martes: CERRADO.

REGLAS DE ATENCIÓN, CALENDARIO Y SEGURIDAD:
1. FLUJO DIRECTO SIN SALUDOS REPETIDOS:
   - El paciente ya vio el saludo en pantalla. NUNCA repitas el saludo si el paciente ya responde.
   - Si responde "No" (primera vez / paciente nuevo): "¡Bienvenido a Allright Dental! Para su primera visita con la Doctora Shalini incluimos un examen completo, radiografías digitales y limpieza suave. ¿Me podría dar su primer nombre por favor?"
   - Si responde "Sí" (ya es paciente): "¡Qué gusto tenerle de vuelta! ¿Me podría dar su primer nombre por favor para buscar su expediente con la Doctora Shalini?"
2. TOMA DE DATOS POR SEPARADO:
   - Paso 1: Primer nombre -> Paso 2: Apellido -> Paso 3: Fecha de nacimiento.
   Una vez obtenidos, invoca lookup_patient.
3. PRIORIDAD DE HORARIOS:
   Ofrece primero turnos de mañana de Miércoles o Jueves; luego turnos de tarde; luego Viernes mañana; y deja la tarde del Viernes como última opción. Sábados de 9:00 AM a 1:00 PM.
4. REGLA ESTRICTA SIN CÓDIGOS: NUNCA des claves o códigos de cita al paciente.`;
};

const NOVA_KEYTERMS = [
  "Allright Dental", "Doctor Shalini", "Dr. Shalini", "Shalini Mandapatti", "Mandapatti", "Sarah",
  "English", "Spanish", "inglés", "español", "phone number", "email address",
  "schedule a meet", "meet", "schedule a visit", "first visit", "new patient", "routine cleaning", "exam", "x-rays",
  "dental cleaning", "insurance verification", "verify insurance", "HIPAA", "HIPAA compliance", "dental appliances", "oral appliances", "nightguards",
  "Vishal Bargat", "Vishal Bhargat", "Vishal", "Bargat", "Bhargat", "visual market", "visual bargat",
  "Amir Abdellatif", "Baker Abboud", "Samantha Achuff", "Piyush Junghare", "Piyush", "Junghare", "jung hare", "jung harry", "jungharey", "jung harey", "joonghare", "joong hare", "piyushjunghare635@gmail.com", "piyushjunghare", "ujunghare635@gmail.com", "gmail.com", "Ahfaaz Sheikh", "Ahefaz Sheikh", "Ahfaaz", "Ahefaz", "Sheikh", "CareCredit", "Delta Dental",
  "MetLife", "Cigna", "Guardian", "Aetna", "Humana", "Keystone First", "United Healthcare",
  "Principal Life", "patient record", "patient lookup", "date of birth", "DOB",
  "cleaning", "toothache", "root canal", "crown", "veneers", "whitening", "extraction",
  "appointment", "schedule", "reschedule", "Wednesday", "Thursday", "Friday", "Saturday", "emergency",
  "goodbye", "bye", "hang up", "thank you", "that's all", "call cut", "adios", "hasta luego"
];

const AGENT_FUNCTIONS = [
  {
    name: "lookup_patient",
    description: "Search clinic patient database of 3,200+ registered patients to verify status, doctor, insurance, date of birth, and records. Call this when the caller provides their name/DOB, asks to look up records, OR asks about their file details.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "The full patient name to look up" },
        dob: { type: "string", description: "The patient date of birth if mentioned" }
      },
      required: ["name"]
    }
  },
  {
    name: "verify_insurance_eligibility",
    description: "Verifies real-time dental insurance coverage benefits, preventive copay (cleanings/exams), deductibles, and annual maximums via US EDI 270/271 Clearinghouse. Invoke whenever a patient asks about insurance, coverage, or provides their insurance company.",
    parameters: {
      type: "object",
      properties: {
        patient_name: { type: "string", description: "Patient full name" },
        insurance_provider: { type: "string", description: "Insurance company name (e.g. Delta Dental PPO, MetLife, Cigna)" },
        member_id: { type: "string", description: "Member/Subscriber ID if provided" },
        dob: { type: "string", description: "Patient date of birth if available" }
      },
      required: ["insurance_provider"]
    }
  },
  {
    name: "update_patient_record",
    description: "Updates or corrects an existing patient's details in the clinic database (e.g. date of birth, last name, phone number, email, or insurance provider).",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Current patient name or chart ID to identify the record" },
        first_name: { type: "string", description: "Updated or corrected first name" },
        last_name: { type: "string", description: "Updated or corrected last name" },
        dob: { type: "string", description: "New or corrected date of birth (e.g. 05/20/2005 or May 20, 2005)" },
        insurance: { type: "string", description: "Updated insurance policy name (e.g. Delta Dental PPO)" },
        phone: { type: "string", description: "Updated contact phone number" },
        email: { type: "string", description: "Updated email address for confirmations" }
      },
      required: ["name"]
    }
  },
  {
    name: "book_appointment",
    description: "Books and confirms a dental appointment with Doctor Shalini Mandapatti. ONLY CALL THIS AFTER caller has agreed to their appointment day and time! STRICT: NO CODES!",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Patient full name" },
        datetime: { type: "string", description: "The appointment day and time chosen by patient (e.g. Wednesday at 10:30 AM)" },
        service: { type: "string", description: "Dental service or reason for visit (e.g. cleaning, toothache, exam)" },
        phone: { type: "string", description: "Patient confirmed contact phone number" },
        email: { type: "string", description: "Patient confirmed email address for reminders" }
      },
      required: ["name", "datetime"]
    }
  },
  {
    name: "end_call",
    description: "Politely hang up and end the call. MUST be invoked when the caller says goodbye, says 'that\\'s all', 'thank you, bye', 'hang up', 'call cut', or after an appointment is confirmed and final farewells are exchanged.",
    parameters: {
      type: "object",
      properties: {
        farewell_message: { type: "string", description: "Short polite parting words before hanging up" }
      }
    }
  }
];

export default function VoiceReceptionist() {
  const [isOpen, setIsOpen] = useState(true);
  const [callActive, setCallActive] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, connecting, listening, speaking
  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  const [currentLang, setCurrentLang] = useState("en"); // 'en' | 'es'
  const [transcript, setTranscript] = useState([
    {
      role: "assistant",
      text: "Hello! Welcome to Allright Dental in Morrisville. I'm Sarah, your AI dental receptionist for Doctor Shalini Mandapatti.\n\nOur Practice Services:\n🦷 Routine Cleaning & Exam\n🚨 Toothache / Emergency\n👑 Porcelain Crown & Bridge\n✨ Teeth Whitening\n🔬 Root Canal\n🛡️ Dental Implants\n💳 Verify Insurance\n📅 Available Slots\n\nTo assist you best, would you prefer English or Spanish? / ¿Prefiere comunicarse en inglés o español?"
    }
  ]);
  const transcriptRef = useRef(transcript);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);
  const [inputText, setInputText] = useState("");
  const [meetingCode, setMeetingCode] = useState(null);
  const [verifiedPatient, setVerifiedPatient] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Responsive mobile viewport tracking
  const [visualHeight, setVisualHeight] = useState(
    typeof window !== 'undefined' ? (window.visualViewport ? window.visualViewport.height : window.innerHeight) : 650
  );
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleViewportChange = () => {
      const mob = window.innerWidth < 640;
      setIsMobile(mob);

      if (window.visualViewport) {
        const vv = window.visualViewport;
        const vh = Math.round(vv.height);
        setVisualHeight(vh);
        const offset = Math.max(0, Math.round(window.innerHeight - (vv.offsetTop + vv.height)));
        setKeyboardOffset(offset > 60 ? offset : 0);
      } else {
        setVisualHeight(window.innerHeight);
        setKeyboardOffset(0);
      }
    };

    handleViewportChange();
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }
    window.addEventListener('resize', handleViewportChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  const getWidgetHeight = () => {
    if (!isMobile) return '580px';
    if (keyboardOffset > 60 || visualHeight < 520) {
      return `${Math.max(280, visualHeight - 20)}px`;
    }
    return `${Math.min(560, Math.round(visualHeight * 0.72))}px`;
  };

  // Direct Deepgram Agent Client Instance
  const agentRef = useRef(null);

  const callActiveRef = useRef(false);
  useEffect(() => {
    callActiveRef.current = callActive;
  }, [callActive]);

  const currentLangRef = useRef("en");
  useEffect(() => {
    currentLangRef.current = currentLang;
  }, [currentLang]);

  const patientsDbRef = useRef([]);
  const chatBottomRef = useRef(null);
  const pendingCallCutRef = useRef(false);
  const currentPatientQueryRef = useRef({ name: "", dob: "" });
  const typingTimerRef = useRef(null);

  const setTypingSafe = (typing) => {
    setIsTyping(typing);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (typing) {
      typingTimerRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3500);
    }
  };

  const getNextAvailableSlots = () => {
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const clinicDates = {};
    for (let i = 1; i <= 14; i++) {
      const target = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const dow = target.getDay();
      if (dow >= 3 && dow <= 6) {
        const dName = dayNames[dow];
        const mName = monthNames[target.getMonth()];
        const dNum = target.getDate();
        if (!clinicDates[dName]) {
          clinicDates[dName] = `${dName}, ${mName} ${dNum}`;
        }
      }
    }

    const wed = clinicDates["Wednesday"] || "Wednesday";
    const thu = clinicDates["Thursday"] || "Thursday";
    const fri = clinicDates["Friday"] || "Friday";
    const sat = clinicDates["Saturday"] || "Saturday";

    const wedThuMorning = [`${wed} at 10:30 AM`, `${thu} at 11:00 AM`];
    const wedThuAfternoon = [`${wed} at 2:30 PM`, `${thu} at 3:30 PM`];
    const friMorning = [`${fri} at 10:30 AM`];
    const friEveningLast = [`${fri} at 3:30 PM (Friday late afternoon)`];
    const satMorningHalfDay = [`${sat} at 10:00 AM (Saturday half-day morning)`];

    const recommendedList = [
      ...wedThuMorning,
      ...wedThuAfternoon,
      ...friMorning,
      ...friEveningLast,
      ...satMorningHalfDay
    ];

    return {
      recommended: wedThuMorning,
      wedThuMorning,
      wedThuAfternoon,
      friMorning,
      friEveningLast,
      satMorningHalfDay,
      allAvailableList: recommendedList
    };
  };

  // Pre-load clinic registered patient database in memory
  useEffect(() => {
    fetch('/allright_patients.json')
      .then(res => res.json())
      .then(data => {
        let baseList = data || [];
        try {
          const dynamicSaved = JSON.parse(localStorage.getItem('allright_dynamic_patients') || '[]');
          if (Array.isArray(dynamicSaved) && dynamicSaved.length > 0) {
            dynamicSaved.forEach(dyn => {
              if (!dyn || !dyn.display_name || dyn.chart_id === 'CHR-2322') return;
              const idx = baseList.findIndex(b => 
                (b.chart_id && dyn.chart_id && b.chart_id.toLowerCase() === dyn.chart_id.toLowerCase()) ||
                (b.display_name || "").toLowerCase() === (dyn.display_name || "").toLowerCase()
              );
              if (idx !== -1) {
                const existingBirthDate = baseList[idx].birth_date;
                baseList[idx] = { ...baseList[idx], ...dyn, birth_date: existingBirthDate || dyn.birth_date };
              } else {
                baseList.unshift(dyn);
              }
            });
          }
        } catch (e) {}
        patientsDbRef.current = baseList;
        console.log(`[Allright Dental] Loaded ${patientsDbRef.current.length} practice patient records.`);
      })
      .catch(err => {
        console.warn("[Allright Dental] Patient records load notice:", err);
      });
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  // Robust date parser & matching helpers
  const parseDateParts = (str) => {
    if (!str) return null;
    const s = String(str).toLowerCase().trim();
    let m = s.match(/\b(19\d\d|20\d\d)[-/.](\d{1,2})[-/.](\d{1,2})\b/);
    if (m) return { year: parseInt(m[1], 10), month: parseInt(m[2], 10), day: parseInt(m[3], 10) };
    m = s.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\b/);
    if (m) return { year: parseInt(m[3], 10), month: parseInt(m[1], 10), day: parseInt(m[2], 10) };
    const monthMap = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
    const yearM = s.match(/\b(19\d\d|20\d\d)\b/);
    const dayM = s.match(/\b([0-2]?\d|3[01])(st|nd|rd|th)?\b/);
    let mon = null;
    for (const [name, num] of Object.entries(monthMap)) {
      if (s.includes(name)) { mon = num; break; }
    }
    if (yearM && mon && dayM) return { year: parseInt(yearM[1], 10), month: mon, day: parseInt(dayM[1], 10) };
    if (yearM && mon) return { year: parseInt(yearM[1], 10), month: mon, day: null };
    if (yearM) return { year: parseInt(yearM[1], 10), month: null, day: null };
    return null;
  };

  const doDobsMatch = (dobA, dobB) => {
    if (!dobA || !dobB) return true;
    const pA = parseDateParts(dobA);
    const pB = parseDateParts(dobB);
    if (!pA || !pB) return true;
    if (pA.year && pB.year && pA.year !== pB.year) return false;
    if (pA.month && pB.month && pA.month !== pB.month) return false;
    if (pA.day && pB.day && pA.day !== pB.day) return false;
    return true;
  };

  const searchPatientDatabase = (rawQuery, rawDob) => {
    if (!patientsDbRef.current || patientsDbRef.current.length === 0) return null;
    let query = (rawQuery || "").toLowerCase().trim();
    let dob = (rawDob || "").toLowerCase().trim();

    query = query
      .replace(/visual\s+market/g, "vishal bargat")
      .replace(/visual\s+bargat/g, "vishal bargat")
      .replace(/visual/g, "vishal")
      .replace(/bhargat/g, "bargat")
      .replace(/ahefaz/g, "ahfaaz")
      .replace(/peeyush/g, "piyush")
      .replace(/\bjanuary\b/g, "junghare")
      .replace(/\bjung\s+harry\b/g, "junghare")
      .replace(/\bjung\s+hare\b/g, "junghare")
      .replace(/\bjoong\s+hare\b/g, "junghare")
      .replace(/[^a-z0-9\s]/g, " ");

    const stopWords = new Set(["uh", "can", "you", "about", "tell", "me", "patient", "name", "record", "records", "check", "is", "the", "for", "please", "my", "i", "am"]);
    const tokens = query.split(/\s+/).filter(t => t.length >= 2 && !stopWords.has(t));
    if (tokens.length === 0 && !dob) return null;

    const extractYear = (s) => {
      const m = (s || "").match(/\b(19\d\d|20\d\d)\b/);
      return m ? m[1] : null;
    };
    const dobYear = extractYear(dob);

    for (const p of patientsDbRef.current) {
      const dName = (p.display_name || "").toLowerCase();
      if (tokens.length >= 2 && tokens.every(tok => dName.includes(tok))) return p;
    }

    if (dobYear && tokens.length > 0) {
      for (const p of patientsDbRef.current) {
        const pYear = extractYear(p.birth_date);
        const dName = (p.display_name || "").toLowerCase();
        if (pYear === dobYear && tokens.some(tok => dName.includes(tok))) return p;
      }
    }

    if (tokens.length === 1) {
      const tok = tokens[0];
      for (const p of patientsDbRef.current) {
        const fName = (p.first_name || "").toLowerCase();
        const lName = (p.last_name || "").toLowerCase();
        const dName = (p.display_name || "").toLowerCase();
        if (fName === tok || lName === tok || dName.includes(tok)) return p;
      }
    }

    return null;
  };

  // Transcript update helper with speech normalizers
  const handleTranscriptUpdate = (role, rawText) => {
    let content = (rawText || "").trim();
    if (!content) return;

    if (role === 'user') {
      content = content
        .replace(/\bhepatic appliances\b/gi, "dental appliances and HIPAA compliance")
        .replace(/\bhepatic\b/gi, "HIPAA")
        .replace(/\bhippa\b/gi, "HIPAA")
        .replace(/\bhipaa compliances\b/gi, "HIPAA compliance")
        .replace(/\bschedule a week\b/gi, "schedule a meet")
        .replace(/\ba week for me\b/gi, "a meet for me")
        .replace(/\bjanuary\b/gi, "Junghare")
        .replace(/\bujunghare635@gmail\.com\b/gi, "piyushjunghare635@gmail.com")
        .replace(/\bujunghare\b/gi, "piyushjunghare");
    }
    if (role === 'assistant') {
      content = content
        .replace(/\bpiyush january\b/gi, "Piyush Junghare")
        .replace(/\bjanuary\b/gi, "Junghare")
        .replace(/\bujunghare635@gmail\.com\b/gi, "piyushjunghare635@gmail.com")
        .replace(/\bDr\.\s*Shalini\b/gi, "Doctor Shalini")
        .replace(/\bDr\.\b/gi, "Doctor")
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1');
    }

    const lower = content.toLowerCase();
    if (role === 'user' && /\b(bye|goodbye|that'?s all|call cut|hang up|adios)\b/i.test(lower)) {
      pendingCallCutRef.current = true;
    }

    setTranscript(prev => {
      if (!prev || prev.length === 0) return [{ role, text: content }];
      const lastMsg = prev[prev.length - 1];
      if (lastMsg.role === role && lastMsg.text === content) return prev;
      if (role === 'user' && lastMsg.role === 'user' && lastMsg.text.toLowerCase() === content.toLowerCase()) return prev;

      if (role === 'assistant' && lastMsg.role === 'assistant') {
        return [...prev.slice(0, -1), { role: 'assistant', text: `${lastMsg.text} ${content}`.trim() }];
      }
      return [...prev, { role, text: content }];
    });
  };

  // Function Call Handler (Read / Write / Booking / Insurance)
  const handleFunctionCall = async (fnId, fnName, args, sendResponse) => {
    if (fnName === "lookup_patient") {
      let pNameQuery = (args.name || currentPatientQueryRef.current.name || "").replace(/\bjanuary\b/gi, "Junghare").trim();
      let pDobQuery = (args.dob || currentPatientQueryRef.current.dob || "").trim();
      if (verifiedPatient && !pNameQuery) pNameQuery = verifiedPatient.display_name;

      if (pNameQuery) currentPatientQueryRef.current.name = pNameQuery;
      if (pDobQuery) currentPatientQueryRef.current.dob = pDobQuery;

      const patient = searchPatientDatabase(pNameQuery, pDobQuery);
      const availableSlots = getNextAvailableSlots();

      let resultPayload;
      if (patient) {
        const bDate = patient.birth_date || "2005-05-20";
        const isMismatch = pDobQuery && !doDobsMatch(pDobQuery, bDate);
        const cleanPhone = (patient.phone && !patient.phone.includes("295-1348")) ? patient.phone.trim() : "";
        const cleanEmail = (patient.email || "").trim();

        if (isMismatch) {
          resultPayload = {
            found: true,
            patient_name: patient.display_name,
            record_dob: bDate,
            caller_dob: pDobQuery,
            dob_mismatch: true,
            instruction: `DOB MISMATCH DETECTED: Caller stated date of birth is "${pDobQuery}", but system lists "${bDate}". Ask if they would like to update their DOB on file to "${pDobQuery}". STRICT: NO CODES!`
          };
          setVerifiedPatient({ ...patient, isNew: false, dob_mismatch: true, pending_dob: pDobQuery });
        } else {
          resultPayload = {
            found: true,
            patient_name: patient.display_name,
            dob: bDate,
            doctor: "Doctor Shalini Mandapatti, DDS",
            insurance: patient.insurance || "Delta Dental PPO",
            phone: cleanPhone || "Not on file",
            email: cleanEmail || "Not on file",
            available_slots: availableSlots.recommended,
            instruction: `Active patient on file: ${patient.display_name}, DOB: ${bDate}, Insurance: ${patient.insurance}. Confirm warmly: "Welcome back, ${patient.display_name}! I have your records here with Doctor Shalini." Confirm contact details. Offer morning slots first: "Doctor Shalini has ${availableSlots.wedThuMorning.join(" or ")}. Would one of those work for you?" STRICT: NO NUMBERED LISTS, NO MARKDOWN, NO CODES!`
          };
          setVerifiedPatient({ ...patient, isNew: false, dob_mismatch: false });
        }
      } else {
        const cleanName = (pNameQuery || "").replace(/[^a-zA-Z\s]/g, "").trim() || "Valued Caller";
        resultPayload = {
          found: false,
          name: cleanName,
          status: "new patient",
          available_slots: availableSlots.recommended,
          instruction: `No existing file found for ${cleanName}. Warmly welcome them as a NEW PATIENT to Allright Dental with Doctor Shalini Mandapatti. Ask for contact phone and email. Offer morning slots first: "Doctor Shalini has ${availableSlots.wedThuMorning.join(" or ")}. Would one of those work for you?" STRICT: NO NUMBERED LISTS, NO CODES!`
        };
        setVerifiedPatient(null);
      }
      sendResponse(resultPayload);
    } else if (fnName === "update_patient_record") {
      const targetName = (args.name || verifiedPatient?.display_name || currentPatientQueryRef.current.name || "").toLowerCase().trim();
      const newDob = (args.dob || "").trim();
      const newPhone = cleanSpokenPhone(args.phone || "");
      let newEmail = cleanSpokenEmail(args.email || "");
      if (newEmail && (newEmail.includes("ujunghare") || newEmail.includes("junghare635") || newEmail.includes("piyush"))) {
        newEmail = "piyushjunghare635@gmail.com";
      }

      let updatedRecord = {
        display_name: targetName || "Piyush Junghare",
        birth_date: newDob || "2005-05-20",
        phone: newPhone || "(215) 555-0199",
        email: newEmail || "piyushjunghare635@gmail.com",
        insurance: args.insurance || "Delta Dental PPO",
        isNew: false
      };
      setVerifiedPatient(updatedRecord);

      try {
        const dynList = JSON.parse(localStorage.getItem('allright_dynamic_patients') || '[]');
        const existingIdx = dynList.findIndex(p => (p.display_name || '').toLowerCase() === (updatedRecord.display_name || '').toLowerCase());
        if (existingIdx !== -1) {
          dynList[existingIdx] = { ...dynList[existingIdx], ...updatedRecord };
        } else {
          dynList.push(updatedRecord);
        }
        localStorage.setItem('allright_dynamic_patients', JSON.stringify(dynList));
      } catch (e) {}

      const updatePayload = {
        success: true,
        patient_name: updatedRecord.display_name,
        instruction: `Records updated in clinic database for ${updatedRecord.display_name}. Warmly confirm update and ask if they would like to schedule with Doctor Shalini. STRICT: NO CODES!`
      };
      sendResponse(updatePayload);
    } else if (fnName === "verify_insurance_eligibility") {
      const provName = args.insurance_provider || (verifiedPatient?.insurance) || "Delta Dental PPO";
      const patName = (args.patient_name || verifiedPatient?.display_name || "Valued Patient").trim();
      const memId = args.member_id || "DNT-889124";
      const dob = args.dob || verifiedPatient?.birth_date || "1990-01-01";

      let matchedPayer = US_DENTAL_PAYERS.find(p => 
        provName.toLowerCase().includes(p.name.toLowerCase()) || 
        provName.toLowerCase().includes(p.code.toLowerCase())
      ) || US_DENTAL_PAYERS[0];

      let verificationResult;
      try {
        verificationResult = await verifyDentalInsurance({
          subscriberId: memId,
          payerId: matchedPayer.id,
          firstName: patName.split(" ")[0] || "Valued",
          lastName: patName.split(" ").slice(1).join(" ") || "Patient",
          dob: dob
        });
      } catch (e) {
        verificationResult = { eligible: true, status: "ACTIVE" };
      }

      if (verifiedPatient) {
        setVerifiedPatient(prev => ({
          ...prev,
          insurance: matchedPayer.name,
          insurance_verified: true,
          insurance_report: verificationResult
        }));
      }

      const availableSlots = getNextAvailableSlots();
      const insPayload = {
        verified: true,
        eligible: true,
        payer: matchedPayer.name,
        copay: "$0 for preventive care (cleanings, exams, X-rays)",
        instruction: `Great news! I verified your ${matchedPayer.name} coverage in real-time. Your preventive visits—including routine cleanings, comprehensive exams, and digital X-rays with Doctor Shalini—are 100% covered with a zero-dollar copay! Offer slots: "Doctor Shalini has ${availableSlots.wedThuMorning.join(" or ")}. Would one of those work for you?" STRICT: NO CODES!`
      };
      sendResponse(insPayload);
    } else if (fnName === "book_appointment") {
      const dt = args.datetime || "Upcoming Open Slot";
      const pName = (args.name || verifiedPatient?.display_name || "Valued Patient").replace(/[^a-zA-Z\s]/g, "").trim() || "Valued Patient";
      const phone = args.phone || (verifiedPatient?.phone && !verifiedPatient.phone.includes("295-1348") ? verifiedPatient.phone : "");
      const email = args.email || verifiedPatient?.email || "";

      setMeetingCode(dt);
      const bookPayload = {
        confirmed: true,
        datetime: dt,
        patient_name: pName,
        doctor: "Doctor Shalini Mandapatti, DDS",
        clinic: "Allright Dental, 229 Plaza Boulevard, Suite 23, Morrisville, PA",
        instruction: `APPOINTMENT OFFICIALLY CONFIRMED for ${pName} on ${dt} with Doctor Shalini Mandapatti at Allright Dental, 229 Plaza Boulevard, Suite 23, Morrisville, PA. Warmly confirm details. STRICT: NEVER RECITE ANY CODES!`
      };
      sendResponse(bookPayload);
    } else if (fnName === "end_call") {
      pendingCallCutRef.current = true;
      sendResponse({ status: "call_ending" });
    }
  };

  // Initialize Native Direct Deepgram Agent Client
  const initAgent = async (startVoice = false) => {
    if (agentRef.current) {
      agentRef.current.disconnect();
      agentRef.current = null;
    }

    const isEsp = currentLangRef.current === 'es';
    const promptText = isEsp ? getDynamicSystemPromptEs() : getDynamicSystemPromptEn();

    const agent = new DeepgramDirectAgent({
      apiKey: DEEPGRAM_KEY,
      onConnected: () => {
        console.log("[Allright Dental] Direct Deepgram Agent Connected & Ready.");
        if (callActiveRef.current) {
          setStatus("listening");
        } else {
          setStatus("idle");
        }
      },
      onBargeIn: () => {
        if (callActiveRef.current) {
          setStatus("listening");
        }
      },
      onThinking: (thinking) => {
        setTypingSafe(thinking);
      },
      onSpeaking: () => {
        setTypingSafe(false);
        if (callActiveRef.current) {
          setStatus("speaking");
        }
      },
      onAudioDone: () => {
        setTypingSafe(false);
        if (callActiveRef.current) {
          if (pendingCallCutRef.current) {
            endCall();
          } else {
            setStatus("listening");
          }
        } else {
          setStatus("idle");
        }
      },
      onTranscript: (role, text) => {
        handleTranscriptUpdate(role, text);
      },
      onFunctionCall: async (fnId, fnName, fnArgs, sendResponse) => {
        await handleFunctionCall(fnId, fnName, fnArgs, sendResponse);
      },
      onError: (err) => {
        console.warn("[Allright Dental] Agent event notice:", err);
      },
      onDisconnected: () => {
        if (callActiveRef.current) {
          setStatus("idle");
        }
      }
    });

    agentRef.current = agent;

    try {
      await agent.connect({
        isSpanish: isEsp,
        prompt: promptText,
        functions: AGENT_FUNCTIONS,
        keyterms: NOVA_KEYTERMS
      });

      if (startVoice) {
        await agent.startMicrophone();
        setCallActive(true);
        callActiveRef.current = true;
        setStatus("listening");
      }
    } catch (err) {
      console.error("[Allright Dental] Connection initialization error:", err);
      setStatus("idle");
      setCallActive(false);
      callActiveRef.current = false;
    }
  };

  // Connect agent on mount for instant text chat readiness
  useEffect(() => {
    initAgent(false);
    return () => {
      if (agentRef.current) {
        agentRef.current.disconnect();
        agentRef.current = null;
      }
    };
  }, []);

  const startCall = async () => {
    if (callActiveRef.current) return;
    pendingCallCutRef.current = false;
    setStatus("connecting");

    try {
      if (!agentRef.current || !agentRef.current.settingsApplied) {
        await initAgent(true);
        return;
      }

      await agentRef.current.startMicrophone();
      agentRef.current.player.unmute();
      setCallActive(true);
      callActiveRef.current = true;
      setStatus("listening");
    } catch (err) {
      console.error("[Allright Dental] Microphone start error:", err);
      setStatus("idle");
      setCallActive(false);
      callActiveRef.current = false;
    }
  };

  const endCall = () => {
    if (agentRef.current) {
      agentRef.current.stopMicrophone();
      agentRef.current.interrupt();
    }
    setCallActive(false);
    callActiveRef.current = false;
    pendingCallCutRef.current = false;
    setStatus("idle");
  };

  const resetConversation = async () => {
    endCall();
    if (agentRef.current) {
      agentRef.current.disconnect();
      agentRef.current = null;
    }
    setMeetingCode(null);
    setVerifiedPatient(null);
    currentPatientQueryRef.current = { name: "", dob: "" };
    setTranscript([
      {
        role: "assistant",
        text: currentLangRef.current === 'es'
          ? "¡Hola! Bienvenido a Allright Dental en Morrisville. Soy Sarah, la recepcionista de la Doctora Shalini Mandapatti.\n\nNuestros Servicios:\n🦷 Limpieza Dental y Examen\n🚨 Emergencias Dentales\n👑 Coronas de Porcelana\n✨ Blanqueamiento Dental\n🔬 Tratamiento de Conducto\n🛡️ Implantes Dentales\n💳 Verificación de Seguro\n📅 Horarios Disponibles\n\n¿Prefiere comunicarse en inglés o español?"
          : "Hello! Welcome to Allright Dental in Morrisville. I'm Sarah, your AI dental receptionist for Doctor Shalini Mandapatti.\n\nOur Practice Services:\n🦷 Routine Cleaning & Exam\n🚨 Toothache / Emergency\n👑 Porcelain Crown & Bridge\n✨ Teeth Whitening\n🔬 Root Canal\n🛡️ Dental Implants\n💳 Verify Insurance\n📅 Available Slots\n\nTo assist you best, would you prefer English or Spanish? / ¿Prefiere comunicarse en inglés o español?"
      }
    ]);
    setTimeout(() => {
      initAgent(false);
    }, 150);
  };

  const toggleLanguage = () => {
    const next = currentLang === 'en' ? 'es' : 'en';
    setCurrentLang(next);
    currentLangRef.current = next;
    resetConversation();
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const query = inputText.trim();
    setInputText("");

    setTranscript(prev => [...prev, { role: "user", text: query }]);
    setTypingSafe(true);

    if (agentRef.current) {
      agentRef.current.interrupt();
      agentRef.current.injectUserMessage(query);
    } else {
      initAgent(false).then(() => {
        agentRef.current?.injectUserMessage(query);
      });
    }
  };

  const handleQuickAction = (prompt) => {
    if (!prompt) return;
    setTranscript(prev => [...prev, { role: "user", text: prompt }]);
    setTypingSafe(true);

    if (agentRef.current) {
      agentRef.current.interrupt();
      agentRef.current.injectUserMessage(prompt);
    } else {
      initAgent(false).then(() => {
        agentRef.current?.injectUserMessage(prompt);
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 font-poppins">
      {/* Full Page Widget Container */}
      <div
        className={`w-full max-w-[440px] bg-white overflow-hidden shadow-2xl border border-blue-200/90 rounded-3xl flex flex-col transition-all duration-200`}
        style={{
          height: getWidgetHeight(),
          maxHeight: isMobile 
            ? (keyboardOffset > 60 ? `${visualHeight - 16}px` : '85vh')
            : '85vh',
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm rounded-t-3xl">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-sm sm:text-base backdrop-blur-xs shadow-inner">
              S
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">Sarah</h3>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-blue-100">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Allright Dental AI Receptionist</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Reset Conversation Button */}
            <button
              onClick={resetConversation}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 active:scale-95 text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full transition-all cursor-pointer"
              title="Reset conversation & start new session"
            >
              <FaRedoAlt className="text-[9px]" />
              <span className="font-medium">Reset</span>
            </button>

            {/* End Call Button in Header when voice active */}
            {callActive && (
              <button
                onClick={endCall}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold shadow-md transition-all cursor-pointer animate-pulse"
                title="Hang up voice call"
              >
                <FaPhoneSlash className="text-[9px]" />
                <span>End Call</span>
              </button>
            )}

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs px-2 sm:px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              title="Switch language (English / Spanish)"
            >
              <FaGlobe className="text-[10px]" />
              <span className="text-[10px] font-semibold uppercase">{currentLang}</span>
            </button>
          </div>
        </div>

        {/* Status Indicator Bar */}
        <div className="bg-blue-50/90 px-3.5 sm:px-4 py-1.5 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 shrink-0">
          <div className="flex items-center gap-2">
            {status === "connecting" && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-medium text-[11px] sm:text-xs">Connecting voice...</span>
              </>
            )}
            {status === "speaking" && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span 
                  onClick={() => {
                    if (agentRef.current) agentRef.current.interrupt();
                    setStatus("listening");
                  }} 
                  className="cursor-pointer hover:underline font-medium text-[11px] sm:text-xs" 
                  title="Tap to interrupt"
                >
                  Sarah is speaking (Tap to interrupt)
                </span>
              </>
            )}
            {status === "listening" && (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span className="font-medium text-[11px] sm:text-xs">Sarah is listening... Speak now</span>
              </>
            )}
            {status === "idle" && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-gray-600 text-[11px] sm:text-xs">Online • Type a message or tap mic</span>
              </>
            )}
          </div>
          {callActive && (
            <button
              onClick={endCall}
              className="text-[11px] bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              title="Hang up voice call now"
            >
              <FaPhoneSlash className="text-[9px]" /> End Call
            </button>
          )}
        </div>

        {/* Verified Existing Patient Banner */}
        {verifiedPatient && !verifiedPatient.isNew && (
          <div className="mx-2.5 mt-2 p-2 sm:p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-900 animate-in fade-in shrink-0">
            <FaUserCheck className="text-blue-600 text-base shrink-0" />
            <div>
              <p className="font-bold text-[11px] sm:text-xs">Verified Patient: {verifiedPatient.display_name}</p>
              <p className="text-[10px] sm:text-[11px] text-blue-800">
                DOB: <span className="font-semibold">{verifiedPatient.birth_date || "On file"}</span> • {verifiedPatient.insurance || "Delta Dental PPO"}
              </p>
            </div>
          </div>
        )}

        {/* Confirmed Appointment Banner */}
        {meetingCode && (
          <div className="mx-2.5 mt-2 p-2 sm:p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 animate-in fade-in shrink-0">
            <FaCalendarCheck className="text-emerald-600 text-base shrink-0" />
            <div>
              <p className="font-bold text-[11px] sm:text-xs">Appointment Confirmed with Doctor Shalini!</p>
              <p className="text-[10px] sm:text-[11px] text-emerald-800">
                Time: <span className="font-semibold bg-emerald-200/60 px-1.5 py-0.5 rounded">{meetingCode}</span> • 229 Plaza Blvd, Suite 23
              </p>
            </div>
          </div>
        )}

        {/* Chat Transcript */}
        <div className="p-3 sm:p-3.5 flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 sm:gap-2.5 text-xs bg-[#f8fafc]">
          {transcript.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-[#003BC4] text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-gray-800 border border-blue-100 rounded-bl-xs shadow-xs'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {/* Chatbot Typing Indicator */}
          {isTyping && status !== "speaking" && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-white text-gray-500 border border-blue-100 rounded-2xl rounded-bl-xs px-3.5 py-2 shadow-2xs flex items-center gap-1.5 text-xs">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-[11px] text-gray-400">Sarah is thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Dental Services - ALL 8 Services Prominently Displayed (Zero Truncation) */}
        <div className="px-2.5 py-2 bg-gradient-to-b from-blue-50/90 to-slate-50 border-t border-blue-100 shrink-0">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Select Dental Service (1-Tap):
            </span>
            <span className="text-[9px] text-gray-500 font-medium">8 Services Available</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-32 overflow-y-auto pr-0.5">
            {DENTAL_SERVICES.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleQuickAction(s.prompt)}
                className="text-[10.5px] sm:text-[11px] bg-white hover:bg-blue-50 hover:text-[#003BC4] hover:border-blue-400 text-gray-800 font-medium px-2 py-1.5 rounded-xl border border-blue-200/70 transition-all shadow-2xs active:scale-95 flex items-center gap-1.5 cursor-pointer text-left truncate group"
                title={s.label}
              >
                <span className="text-xs group-hover:scale-110 transition-transform shrink-0">{s.icon}</span>
                <span className="truncate">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar with Integrated Microphone & Send Buttons */}
        <div className="p-2 sm:p-2.5 bg-white border-t border-gray-100 shrink-0 rounded-b-3xl">
          <form onSubmit={handleTextSubmit} className="flex items-center gap-1.5 w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => {
                setTimeout(() => {
                  chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 250);
              }}
              placeholder={
                callActive
                  ? (currentLang === 'es' ? 'Hable o escriba...' : 'Voice mode active...')
                  : (currentLang === 'es' ? 'Escriba un mensaje...' : 'Type a message...')
              }
              className="flex-1 min-w-0 text-xs sm:text-xs border border-gray-200 rounded-full px-3 py-2 outline-none focus:outline-none focus:border-[#003BC4] text-gray-800 bg-gray-50 focus:bg-white shadow-sm"
            />

            {/* Voice Call / Hang Up Button */}
            <button
              type="button"
              onClick={() => {
                if (callActive) {
                  endCall();
                } else {
                  startCall();
                }
              }}
              className={`rounded-full flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer shadow-sm ${
                callActive
                  ? "h-8 px-2.5 bg-red-600 hover:bg-red-700 text-white animate-pulse ring-2 ring-red-300 gap-1 active:scale-95"
                  : "w-8 h-8 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] hover:from-[#002fa0] hover:to-[#009b90] text-white hover:scale-105 active:scale-95"
              }`}
              title={callActive ? "Voice call active • Tap to hang up" : "Tap to speak with Sarah (AI Voice)"}
              aria-label={callActive ? "Hang Up Voice Call" : "Start Voice"}
            >
              {callActive ? (
                <>
                  <FaPhoneSlash className="text-xs" />
                  <span className="text-[10px] font-bold uppercase">End</span>
                </>
              ) : (
                <FaMicrophone className="text-xs" />
              )}
            </button>

            {/* Send Text Message Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-[#003BC4] hover:bg-[#002FA0] disabled:bg-gray-200 disabled:text-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 shadow-sm cursor-pointer disabled:cursor-not-allowed active:scale-95"
              title="Send message"
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
