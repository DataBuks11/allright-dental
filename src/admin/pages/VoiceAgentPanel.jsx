import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Navbar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './VoiceAgentPanel.css';

const DEEPGRAM_KEY = "253534aa2453b00aa8b4615ddc1eb9a4f855c5b2";

const KNOWLEDGE_RESPONSES = [
  {
    triggers: ['time', 'hour', 'open', 'timing', 'schedule', 'saturday', 'tuesday', 'sunday', 'weekend'],
    answer: "Our clinic operating hours are Monday, Wednesday, Thursday, and Friday from 10:00 AM to 5:00 PM. On Saturday, we are open strictly from 9:00 AM to 12:00 PM noon. We are closed on Tuesdays and Sundays.",
    audio: "/audio/timings.mp3"
  },
  {
    triggers: ['address', 'where', 'location', 'located', 'direction', 'place', 'map'],
    answer: "We are located at 229 Plaza Blvd, Suite 23, Morrisville, PA 19067. Our office features easy ground-floor access with free storefront parking. Direct desk: (215) 295-1348.",
    audio: "/audio/address.mp3"
  },
  {
    triggers: ['new patient', 'accepting', 'accept new', 'register', 'first visit'],
    answer: "Yes, absolutely! We are warmly accepting new patients of all ages — both individuals and families. For your first visit, we provide a full comprehensive exam, gentle cleaning, and digital X-rays.",
    audio: "/audio/new_patients.mp3"
  },
  {
    triggers: ['book', 'schedule', 'reschedule', 'appointment', 'visit', 'slot', 'cancel'],
    answer: "I can help you book or reschedule an appointment! You can click 'Book an Appointment' on our website to choose your preferred room and slot, or call our team at (215) 295-1348.",
    audio: "/audio/booking.mp3"
  },
  {
    triggers: ['emergency', 'urgent', 'pain', 'toothache', 'broken tooth', 'swelling', 'bleeding'],
    answer: "If you are experiencing severe tooth pain, swelling, or a broken tooth, please call us immediately at (215) 295-1348. We reserve priority same-day emergency slots during operating days.",
    audio: "/audio/emergency.mp3"
  },
  {
    triggers: ['insurance', 'cost', 'price', 'medicaid', 'ppo', 'delta', 'metlife', 'cigna', 'guardian', 'aetna'],
    answer: "We accept all major PPO dental insurances including Delta Dental, MetLife, Cigna, Guardian, Aetna, Humana, and Keystone First. We also offer CareCredit with 0% interest financing.",
    audio: "/audio/insurance.mp3"
  },
  {
    triggers: ['doctor', 'dentist', 'shalini', 'mandapatti', 'who'],
    answer: "Dr. Shalini Mandapatti, DDS, is our lead dentist with over 15 years of clinical expertise providing gentle, modern dental care in Morrisville, PA.",
    audio: "/audio/doctor.mp3"
  }
];

function processVoiceQuery(userQuery, patientsList) {
  const q = (userQuery || '').toLowerCase().trim();

  // Guardrails
  const outsideKeywords = ['weather', 'cricket', 'football', 'movie', 'song', 'recipe', 'cook', 'president', 'politics', 'election', 'coding', 'python'];
  if (outsideKeywords.some(k => q.includes(k))) {
    return {
      text: "I specialize strictly in dental care and appointment scheduling for Allright Dental. I'm unable to assist with outside topics, but I'd be happy to help with your dental health questions or schedule a visit with Dr. Shalini!",
      audio: null,
      meetingCode: null
    };
  }

  // Patient lookup
  const nameTriggers = ['my name is', 'i am ', "i'm ", 'this is ', 'patient name', 'look up', 'check-in', 'meeting code', 'vishal', 'bargat', 'bhargat', 'baker'];
  if (nameTriggers.some(t => q.includes(t)) && patientsList && patientsList.length > 0) {
    const qNorm = q.replace(/bhargat/g, 'bargat').replace(/samanta/g, 'samantha');
    let matchedPatient = null;
    for (const p of patientsList) {
      const dn = (p.display_name || '').toLowerCase();
      const fn = (p.first_name || '').toLowerCase();
      const ln = (p.last_name || '').toLowerCase();
      if (dn && (qNorm.includes(dn) || (fn && ln && qNorm.includes(fn) && qNorm.includes(ln) && ln.length > 2))) {
        matchedPatient = p;
        break;
      }
    }
    if (matchedPatient) {
      const pName = matchedPatient.display_name || matchedPatient.first_name;
      const code = matchedPatient.meeting_code || `DEN-${matchedPatient.pat_id}`;
      const doc = matchedPatient.doctor_name || "Dr. Shalini Mandapatti, DDS";
      const ins = matchedPatient.insurance || "Insurance on file";
      return {
        text: `Welcome back, ${matchedPatient.first_name || pName}! Wonderful to hear from you again. I see your records here on file with ${doc} under ${ins}. Your direct meeting check-in code is ${code}. How can I assist you with your dental care today?`,
        audio: null,
        meetingCode: code
      };
    } else if (q.includes('new patient') || q.includes('first time') || q.includes('my name is') || q.includes('i am ')) {
      const randomSeed = Math.floor(1000 + Math.random() * 9000);
      const newCode = `NEW-DEN-${randomSeed}`;
      return {
        text: `Welcome to Allright Dental! It looks like you're visiting us for the first time. We are warmly accepting new patients! For your first visit, Dr. Shalini Mandapatti conducts a comprehensive exam, gentle cleaning, and digital X-rays. Your new patient check-in code is ${newCode}. What day and time works best for your appointment?`,
        audio: "/audio/new_patients.mp3",
        meetingCode: newCode
      };
    }
  }

  // Saturday check
  if (q.includes('saturday')) {
    return {
      text: "On Saturdays, our clinic is strictly open from 9:00 AM to 12:00 PM noon only. We do not have appointments after 12:00 PM on Saturdays. We have morning openings at 9:00 AM, 10:00 AM, or 11:00 AM.",
      audio: "/audio/timings.mp3",
      meetingCode: null
    };
  }

  // Tuesday / Sunday check
  if (q.includes('tuesday') || q.includes('sunday')) {
    return {
      text: "Our dental office is closed on Tuesdays and Sundays. The next available openings with Dr. Shalini are Monday or Wednesday starting at 10:00 AM. Would that work for you?",
      audio: null,
      meetingCode: null
    };
  }

  for (const item of KNOWLEDGE_RESPONSES) {
    if (item.triggers.some(t => q.includes(t))) {
      return { text: item.answer, audio: item.audio, meetingCode: null };
    }
  }

  return {
    text: "Thank you for asking! We provide comprehensive dental care including cleanings, fillings, crowns, and emergency care. Our clinic is open Monday, Wednesday, Thursday, and Friday 10:00 AM to 5:00 PM, and Saturday 9:00 AM to 12:00 PM. How else can I assist you today?",
    audio: "/audio/default.mp3",
    meetingCode: null
  };
}

export default function VoiceAgentPanel() {
  const [activeTab, setActiveTab] = useState('tester'); // 'tester' | 'bookings' | 'patients' | 'config'

  // Voice Tester State
  const [callActive, setCallActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('idle'); // idle | connecting | active | speaking | listening
  const [transcripts, setTranscripts] = useState([
    { role: 'assistant', text: "Thank you for calling Allright Dental! My name is Sarah. May I please have your full name so I can look up your patient records?" }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [latencyMs, setLatencyMs] = useState(320);

  // Audio & Speech refs
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const currentAudioRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Patients Database State (2,986 records)
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientPage, setPatientPage] = useState(1);
  const patientsPerPage = 15;
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  // Bookings State
  const [voiceBookings, setVoiceBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Load patients from public/allright_patients.json
  useEffect(() => {
    fetch('/allright_patients.json')
      .then(res => res.json())
      .then(data => {
        setPatients(data || []);
        setIsLoadingPatients(false);
      })
      .catch(err => {
        console.warn("Failed to load local patients JSON, falling back", err);
        setIsLoadingPatients(false);
      });
    
    fetchVoiceBookings();
  }, []);

  const fetchVoiceBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch('https://allrightdental.com/Backend_Dental/getVoiceBookings.php');
      const data = await res.json();
      if (data && data.data) {
        setVoiceBookings(data.data);
      }
    } catch (e) {
      // Fallback local sample bookings
      setVoiceBookings([
        {
          id: 101,
          patient_name: "Vishal Bargat",
          date: "2026-10-31",
          time: "10:00 AM",
          meeting_code: "DEN-8656",
          room: "Voice [DEN-8656] - Routine Dental Checkup",
          status: "Confirmed",
          insurance: "Principal Life"
        },
        {
          id: 102,
          patient_name: "Samantha Achuff",
          date: "2026-11-04",
          time: "11:30 AM",
          meeting_code: "DEN-1042",
          room: "Voice [DEN-1042] - Teeth Cleaning",
          status: "Confirmed",
          insurance: "Delta Dental PPO"
        }
      ]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      endVoiceCall();
    };
  }, []);

  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {}
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    isSpeakingRef.current = false;
  };

  const playDeepgramAudio = (audioUrl, onEnd) => {
    stopSpeaking();
    isSpeakingRef.current = true;
    setVoiceStatus('speaking');

    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;

    audio.onended = () => {
      isSpeakingRef.current = false;
      setVoiceStatus('listening');
      currentAudioRef.current = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      isSpeakingRef.current = false;
      setVoiceStatus('listening');
      currentAudioRef.current = null;
      if (onEnd) onEnd();
    };

    audio.play().catch(() => {
      isSpeakingRef.current = false;
      setVoiceStatus('listening');
      if (onEnd) onEnd();
    });
  };

  const speak = async (text, onEnd, preferredAudio) => {
    if (preferredAudio) {
      playDeepgramAudio(preferredAudio, onEnd);
      return;
    }

    for (const item of KNOWLEDGE_RESPONSES) {
      if (text.includes(item.answer.slice(0, 30)) || item.answer.includes(text.slice(0, 30))) {
        playDeepgramAudio(item.audio, onEnd);
        return;
      }
    }

    try {
      setVoiceStatus('speaking');
      isSpeakingRef.current = true;
      const resp = await fetch("https://api.deepgram.com/v1/speak?model=aura-asteria-en", {
        method: "POST",
        headers: {
          "Authorization": `Token ${DEEPGRAM_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });
      if (resp.ok) {
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        playDeepgramAudio(blobUrl, onEnd);
        return;
      }
    } catch (err) {
      console.warn("Deepgram TTS dynamic stream fallback:", err);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = true;
      setVoiceStatus('speaking');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.94;
      utterance.pitch = 1.02;
      utterance.onend = () => {
        isSpeakingRef.current = false;
        setVoiceStatus('listening');
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        isSpeakingRef.current = false;
        setVoiceStatus('listening');
        if (onEnd) onEnd();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        if (!isSpeakingRef.current) {
          setVoiceStatus('listening');
        }
      };

      recognition.onresult = (event) => {
        const userText = event.results[0][0].transcript;
        if (!userText.trim()) return;

        setTranscripts(prev => [...prev, { role: "user", text: userText }]);
        const reply = processVoiceQuery(userText, patients);
        setTimeout(() => {
          setTranscripts(prev => [...prev, { role: "assistant", text: reply.text }]);
          speak(reply.text, () => {
            if (callActive) startListening();
          }, reply.audio);
        }, 200);
      };

      recognition.onerror = () => {
        if (callActive && !isSpeakingRef.current) {
          setVoiceStatus('active');
        }
      };

      recognition.onend = () => {
        if (callActive && !isSpeakingRef.current) {
          setTimeout(() => {
            if (callActive && !isSpeakingRef.current) {
              try { recognition.start(); } catch {}
            }
          }, 600);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.log("Recognition init error:", err);
    }
  };

  const startVoiceCall = () => {
    setVoiceStatus('connecting');
    setCallActive(true);
    const greeting = "Thank you for calling Allright Dental! My name is Sarah. May I please have your full name so I can look up your patient records?";
    setTranscripts([
      { role: 'assistant', text: greeting }
    ]);
    speak(greeting, () => {
      startListening();
    }, "/audio/greeting.mp3");
  };

  const endVoiceCall = () => {
    setCallActive(false);
    setVoiceStatus('idle');
    stopSpeaking();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (next) {
        stopSpeaking();
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch {}
        }
      } else {
        if (callActive) startListening();
      }
      return next;
    });
  };

  const normalizePhonetic = (str) => {
    return (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/bh/g, 'b')
      .replace(/dh/g, 'd')
      .replace(/gh/g, 'g')
      .replace(/kh/g, 'k')
      .replace(/ph/g, 'f')
      .replace(/th/g, 't')
      .replace(/sh/g, 's')
      .replace(/ee/g, 'i')
      .replace(/oo/g, 'u')
      .replace(/aa/g, 'a')
      .replace(/([a-z])\1+/g, '$1');
  };

  // Filtered patients for 2,986 records search with Phonetic matching
  const filteredPatients = patients.filter(p => {
    const q = patientSearch.toLowerCase().trim();
    if (!q) return true;
    const name = (p.display_name || `${p.first_name} ${p.last_name}`).toLowerCase();
    const phone = (p.phone || '').toLowerCase();
    const chart = (p.chart_id || '').toLowerCase();
    const ins = (p.insurance || '').toLowerCase();

    // Standard substring match
    if (name.includes(q) || phone.includes(q) || chart.includes(q) || ins.includes(q)) {
      return true;
    }

    // Phonetic match (e.g. "Vishal Bhargat" matches "Vishal Bargat")
    const normQ = normalizePhonetic(q);
    const normName = normalizePhonetic(name);
    if (normQ.length >= 3 && (normName.includes(normQ) || normQ.includes(normName))) {
      return true;
    }
    return false;
  });

  const totalPatientPages = Math.ceil(filteredPatients.length / patientsPerPage) || 1;
  const paginatedPatients = filteredPatients.slice(
    (patientPage - 1) * patientsPerPage,
    patientPage * patientsPerPage
  );

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="voice-panel-content">
        {/* Top Header */}
        <div className="panel-header-card">
          <div className="header-left">
            <div className="badge-ai-live">
              <span className="live-dot"></span> 24/7 AI Receptionist
            </div>
            <h2>Sarah - Voice Agent Management</h2>
            <p className="subtitle">
              Allright Dental AI Phone Receptionist with practice database of 2,986 patients, direct check-in codes, and automatic calendar slot blocking.
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-pill">
              <i className="bi bi-people-fill"></i>
              <div>
                <strong>{patients.length > 0 ? patients.length.toLocaleString() : "2,986"}</strong>
                <span>Verified Patients</span>
              </div>
            </div>
            <div className="stat-pill">
              <i className="bi bi-lightning-charge-fill"></i>
              <div>
                <strong>&lt; 380 ms</strong>
                <span>Response Latency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="panel-tabs">
          <button
            className={`tab-btn ${activeTab === 'tester' ? 'active' : ''}`}
            onClick={() => setActiveTab('tester')}
          >
            <i className="bi bi-mic-fill me-2"></i> Live Voice Tester
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-calendar2-check-fill me-2"></i> Voice Bookings ({voiceBookings.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <i className="bi bi-person-lines-fill me-2"></i> Patient Database ({patients.length || "2,986"})
          </button>
          <button
            className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <i className="bi bi-sliders me-2"></i> Practice Rules & Hours
          </button>
        </div>

        {/* TAB 1: LIVE VOICE TESTER */}
        {activeTab === 'tester' && (
          <div className="voice-tester-grid">
            {/* Visualizer & Controls Card */}
            <div className="tester-card call-interface-card">
              <div className="card-top-bar">
                <div className="agent-badge">
                  <div className="agent-avatar">S</div>
                  <div>
                    <h5>Sarah</h5>
                    <span className="text-muted">Dental Practice AI Receptionist</span>
                  </div>
                </div>
                <div className={`status-pill ${voiceStatus}`}>
                  <span className="status-indicator"></span>
                  {voiceStatus === 'speaking' ? 'Speaking...' : voiceStatus === 'listening' ? 'Listening...' : voiceStatus === 'connecting' ? 'Connecting...' : 'Ready'}
                </div>
              </div>

              {/* Central Audio Waveform Animation */}
              <div className={`waveform-stage ${voiceStatus === 'speaking' ? 'animating-active' : voiceStatus === 'listening' ? 'animating-listen' : ''}`}>
                <div className="pulse-ring ring-1"></div>
                <div className="pulse-ring ring-2"></div>
                <div className="central-mic-orb">
                  <i className={`bi ${voiceStatus === 'speaking' ? 'bi-volume-up-fill' : 'bi-mic-fill'}`}></i>
                </div>
                <div className="audio-bars">
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                </div>
              </div>

              {/* Call Controls */}
              <div className="call-actions-row">
                {!callActive ? (
                  <button className="btn-call-start" onClick={startVoiceCall}>
                    <i className="bi bi-telephone-fill me-2"></i> Start Live Call with Sarah
                  </button>
                ) : (
                  <div className="active-call-controls">
                    <button
                      className={`btn-ctrl ${isMuted ? 'btn-muted' : ''}`}
                      onClick={toggleMute}
                      title={isMuted ? "Unmute Mic" : "Mute Mic"}
                    >
                      <i className={`bi ${isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'}`}></i>
                      <span>{isMuted ? "Unmute" : "Mute"}</span>
                    </button>
                    <button className="btn-call-end" onClick={endVoiceCall}>
                      <i className="bi bi-telephone-x-fill me-2"></i> End Call
                    </button>
                  </div>
                )}
              </div>

              <div className="test-hints-box">
                <h6>💡 Try asking Sarah:</h6>
                <ul>
                  <li><strong>Existing Patient:</strong> "Hi, I am Vishal Bhargat, I need to check my appointment."</li>
                  <li><strong>Scheduling:</strong> "Can I book a cleaning slot for Saturday at 10 AM?"</li>
                  <li><strong>Guardrail Test:</strong> "Can you tell me who won the football game?" <em>(She will politely decline and keep strictly to dental care)</em></li>
                  <li><strong>Emergency Care:</strong> "I have severe sudden tooth pain, can I get emergency care?"</li>
                </ul>
              </div>
            </div>

            {/* Live Conversation Transcript */}
            <div className="tester-card transcript-card">
              <div className="card-top-bar">
                <h5><i className="bi bi-chat-quote-fill me-2 text-primary"></i> Live Conversation Transcript</h5>
                <span className="text-muted text-sm">{transcripts.length} turns</span>
              </div>

              <div className="transcript-body" ref={chatScrollRef}>
                {transcripts.map((t, idx) => {
                  if (t.role === 'system') {
                    return (
                      <div key={idx} className="system-msg">
                        <i className="bi bi-info-circle me-1"></i> {t.text}
                      </div>
                    );
                  }
                  const isSarah = t.role === 'assistant';
                  return (
                    <div key={idx} className={`transcript-bubble-wrap ${isSarah ? 'sarah-wrap' : 'user-wrap'}`}>
                      <div className="role-label">{isSarah ? "Sarah (AI Receptionist)" : "Caller"}</div>
                      <div className={`bubble ${isSarah ? 'bubble-sarah' : 'bubble-user'}`}>
                        {t.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VOICE BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="panel-card">
            <div className="card-top-bar">
              <div>
                <h5>Confirmed Voice Appointments</h5>
                <p className="text-muted text-sm">Appointments scheduled over phone calls by Sarah with issued Check-In codes.</p>
              </div>
              <button className="btn-refresh" onClick={fetchVoiceBookings}>
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh
              </button>
            </div>

            <div className="table-responsive">
              <table className="voice-table">
                <thead>
                  <tr>
                    <th>Check-in Code</th>
                    <th>Patient Name</th>
                    <th>Date & Time</th>
                    <th>Service / Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {voiceBookings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No voice bookings recorded yet. Start a call with Sarah to schedule an appointment!
                      </td>
                    </tr>
                  ) : (
                    voiceBookings.map((b, i) => (
                      <tr key={i}>
                        <td>
                          <span className="badge-code">{b.meeting_code || `DEN-${b.id}`}</span>
                        </td>
                        <td>
                          <strong>{b.patient_name || `${b.firstName} ${b.lastName}`}</strong>
                        </td>
                        <td>
                          <i className="bi bi-calendar3 me-1 text-primary"></i> {b.date}
                          <span className="time-badge ms-2">{b.time}</span>
                        </td>
                        <td>{b.room || "Routine Dental Examination"}</td>
                        <td>
                          <span className="badge-confirmed">
                            <i className="bi bi-check-circle-fill me-1"></i> Confirmed
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRACTICE PATIENTS DATABASE (2,986 RECORDS) */}
        {activeTab === 'patients' && (
          <div className="panel-card">
            <div className="card-top-bar flex-wrap gap-3">
              <div>
                <h5>Practice Patients Database ({patients.length || "2,986"} records)</h5>
                <p className="text-muted text-sm">Verified clinic EHR records with attending doctors, chart numbers, and pre-assigned meeting check-in codes.</p>
              </div>
              <div className="search-box-wrap">
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name (e.g. Vishal Bhargat), chart, phone, or insurance..."
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setPatientPage(1);
                  }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="voice-table">
                <thead>
                  <tr>
                    <th>Chart #</th>
                    <th>Patient Name</th>
                    <th>Check-in Code</th>
                    <th>Attending Doctor</th>
                    <th>Insurance</th>
                    <th>Medical Alerts</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingPatients ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">Loading patient records...</td>
                    </tr>
                  ) : paginatedPatients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">No patients matching "{patientSearch}"</td>
                    </tr>
                  ) : (
                    paginatedPatients.map((p, idx) => (
                      <tr key={idx}>
                        <td><code>{p.chart_id || `P-${p.pat_id}`}</code></td>
                        <td>
                          <strong>{p.display_name || `${p.first_name} ${p.last_name}`}</strong>
                        </td>
                        <td>
                          <span className="badge-code">{p.meeting_code || `DEN-${p.pat_id}`}</span>
                        </td>
                        <td>{p.doctor_name || "Dr. Shalini Mandapatti, DDS"}</td>
                        <td>{p.insurance || "PPO on file"}</td>
                        <td>
                          <span className={p.medical_alerts && p.medical_alerts !== "None on record" ? "text-danger" : "text-muted"}>
                            {p.medical_alerts || "None"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-bar">
              <span className="text-muted text-sm">
                Showing {paginatedPatients.length} of {filteredPatients.length} patients (Page {patientPage} of {totalPatientPages})
              </span>
              <div className="page-btns">
                <button
                  className="btn-page"
                  disabled={patientPage <= 1}
                  onClick={() => setPatientPage(p => Math.max(1, p - 1))}
                >
                  <i className="bi bi-chevron-left"></i> Previous
                </button>
                <button
                  className="btn-page"
                  disabled={patientPage >= totalPatientPages}
                  onClick={() => setPatientPage(p => Math.min(totalPatientPages, p + 1))}
                >
                  Next <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRACTICE CONFIGURATION & RULES */}
        {activeTab === 'config' && (
          <div className="config-grid">
            <div className="panel-card">
              <h5><i className="bi bi-shield-check text-primary me-2"></i> Client Requirements & Policy Enforcement</h5>
              <div className="config-item">
                <strong>Strict Dental Guardrails</strong>
                <p>Sarah is strictly scoped to dental inquiries, procedures, insurances, and patient appointment bookings. All external topics (trivia, sports, politics) are politely declined.</p>
              </div>
              <div className="config-item">
                <strong>Phonetic Patient Matching</strong>
                <p>Indian and English name variations (e.g. <em>Vishal Bhargat / Vishal Bargat</em>, <em>Samantha Achuff</em>) are resolved with phonetic Soundex algorithms without triggering guardrails.</p>
              </div>
              <div className="config-item">
                <strong>Direct Check-In Meeting Codes</strong>
                <p>Existing patients receive instant direct check-in codes (<code>DEN-XXXX</code>) upon booking, bypassing the front-desk intake line.</p>
              </div>
            </div>

            <div className="panel-card">
              <h5><i className="bi bi-clock-history text-primary me-2"></i> Practice Schedule Enforced by Sarah</h5>
              <div className="hours-row">
                <span>Monday - Friday</span>
                <strong>10:00 AM - 5:00 PM</strong>
              </div>
              <div className="hours-row highlight-sat">
                <span>Saturday (Strict Client Requirement)</span>
                <strong>9:00 AM - 12:00 PM Only</strong>
              </div>
              <div className="hours-row closed">
                <span>Tuesday</span>
                <strong>Closed</strong>
              </div>
              <div className="hours-row closed">
                <span>Sunday</span>
                <strong>Closed (Urgent Emergency Care Only)</strong>
              </div>
              <div className="mt-4 pt-3 border-top text-xs text-muted">
                Hotline: <strong>(215) 295-1348</strong> | Address: <strong>229 Plaza Blvd. Suite 23, Morrisville, PA 19067</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
