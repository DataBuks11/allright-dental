import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaBan,
  FaCheckCircle,
  FaLock,
  FaUnlock,
  FaExclamationTriangle,
  FaUserMd
} from "react-icons/fa";

const INITIAL_SCHEDULE = {
  Wednesday: [
    { time: "10:00 AM", category: "morning", blocked: false, patient: "Michael Scott" },
    { time: "10:45 AM", category: "morning", blocked: false, patient: null },
    { time: "11:30 AM", category: "morning", blocked: false, patient: null },
    { time: "01:30 PM", category: "afternoon", blocked: false, patient: "Sarah Connor" },
    { time: "02:15 PM", category: "afternoon", blocked: false, patient: null },
    { time: "03:00 PM", category: "afternoon", blocked: true, blockReason: "Staff In-Service" },
    { time: "04:00 PM", category: "afternoon", blocked: false, patient: null }
  ],
  Thursday: [
    { time: "10:00 AM", category: "morning", blocked: false, patient: null },
    { time: "10:45 AM", category: "morning", blocked: false, patient: "David Miller" },
    { time: "11:30 AM", category: "morning", blocked: false, patient: null },
    { time: "01:30 PM", category: "afternoon", blocked: false, patient: null },
    { time: "02:15 PM", category: "afternoon", blocked: false, patient: "Emily Watson" },
    { time: "03:00 PM", category: "afternoon", blocked: false, patient: null },
    { time: "04:00 PM", category: "afternoon", blocked: false, patient: null }
  ],
  Friday: [
    { time: "10:00 AM", category: "morning", blocked: false, patient: null },
    { time: "10:45 AM", category: "morning", blocked: false, patient: null },
    { time: "11:30 AM", category: "morning", blocked: false, patient: null },
    { time: "01:30 PM", category: "afternoon", blocked: false, patient: "Piyush Junghare" },
    { time: "02:15 PM", category: "afternoon", blocked: false, patient: null },
    { time: "03:00 PM", category: "afternoon", blocked: false, patient: null },
    { time: "04:00 PM", category: "afternoon", blocked: false, patient: null }
  ],
  Saturday: [
    { time: "09:00 AM", category: "morning", blocked: false, patient: null },
    { time: "09:45 AM", category: "morning", blocked: false, patient: null },
    { time: "10:30 AM", category: "morning", blocked: false, patient: "Robert DeNiro" },
    { time: "11:15 AM", category: "morning", blocked: false, patient: null },
    { time: "12:00 PM", category: "morning", blocked: false, patient: null }
  ]
};

const ModernSchedule = () => {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [selectedDay, setSelectedDay] = useState("Wednesday");
  const [feedback, setFeedback] = useState("");

  const toggleSlotBlock = (day, index) => {
    setSchedule((prev) => {
      const updatedDay = [...prev[day]];
      const target = updatedDay[index];
      const isNowBlocked = !target.blocked;

      updatedDay[index] = {
        ...target,
        blocked: isNowBlocked,
        blockReason: isNowBlocked ? "Doctor Administrative Hold" : null
      };

      return { ...prev, [day]: updatedDay };
    });

    setFeedback(`Slot successfully ${schedule[day][index].blocked ? "unblocked" : "blocked"}!`);
    setTimeout(() => setFeedback(""), 2500);
  };

  const days = ["Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <FaUserMd className="text-emerald-500" />
            <span>Doctor Shalini Mandapatti, DDS • Practice Master Schedule</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Clinical Slot & Capacity Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enforces strict slot release rules: Wed/Thu Morning → Wed/Thu Afternoon → Fri Morning → Fri Evening (Reserved).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDay === day
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {day} {day === "Saturday" ? "(Half Day)" : ""}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <FaCheckCircle className="text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* AI Slot Priority Hierarchy Guidance Card */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-4 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            AI
          </div>
          <div>
            <p className="font-bold text-slate-800">Sarah AI Slot Offering Hierarchy Policy:</p>
            <p className="text-slate-600 text-[11px]">
              1. <b>Wed & Thu Morning</b> (10:00 AM - 12:30 PM) → 
              2. <b>Wed & Thu Afternoon</b> → 
              3. <b>Fri Morning</b> → 
              4. <b>Fri Afternoon/Evening</b> (Offer only upon explicit caller request).
            </p>
          </div>
        </div>
        <span className="shrink-0 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          Active Automation Rule
        </span>
      </div>

      {/* Slot Grid for Selected Day */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" />
              <span>{selectedDay} Operatory Schedule</span>
            </h2>
            <p className="text-xs text-slate-500">
              {selectedDay === "Saturday"
                ? "Saturday Clinic Hours: 9:00 AM – 1:00 PM (Half Day Only)"
                : `${selectedDay} Clinic Hours: 10:00 AM – 5:00 PM`}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {schedule[selectedDay].filter((s) => !s.blocked && !s.patient).length} Open Slots Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {schedule[selectedDay].map((slot, idx) => {
            const isBooked = !!slot.patient;
            const isBlocked = slot.blocked;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isBlocked
                    ? "bg-rose-50/60 border-rose-200 text-rose-900"
                    : isBooked
                    ? "bg-blue-50/60 border-blue-200 text-blue-900"
                    : "bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-xs opacity-60" />
                    <span className="font-mono font-black text-sm">{slot.time}</span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isBlocked
                        ? "bg-rose-200 text-rose-800"
                        : isBooked
                        ? "bg-blue-200 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isBlocked ? "BLOCKED" : isBooked ? "BOOKED" : "OPEN"}
                  </span>
                </div>

                <div className="mt-3 text-xs">
                  {isBooked ? (
                    <div>
                      <p className="font-bold text-slate-900">{slot.patient}</p>
                      <p className="text-[11px] text-blue-600 font-medium">Operatory 1 • Doctor Shalini</p>
                    </div>
                  ) : isBlocked ? (
                    <div>
                      <p className="font-semibold text-rose-700">{slot.blockReason || "Doctor Block"}</p>
                      <p className="text-[11px] text-rose-400">Unavailable for booking</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-emerald-700">Available For Scheduling</p>
                      <p className="text-[11px] text-slate-400 capitalize">{slot.category} Release Wave</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 capitalize">Wave: {slot.category}</span>
                  <button
                    onClick={() => toggleSlotBlock(selectedDay, idx)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      isBlocked
                        ? "bg-white hover:bg-rose-100 text-rose-700 border border-rose-300"
                        : "bg-white hover:bg-slate-200 text-slate-700 border border-slate-300"
                    }`}
                  >
                    {isBlocked ? (
                      <>
                        <FaUnlock className="text-[10px]" /> Unblock
                      </>
                    ) : (
                      <>
                        <FaLock className="text-[10px]" /> Block
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModernSchedule;

