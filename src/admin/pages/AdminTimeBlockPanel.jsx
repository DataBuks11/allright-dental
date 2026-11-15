import React, { useState, useEffect, useMemo } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaClock,
  FaCalendarAlt,
  FaDoorOpen,
  FaUserMd,
  FaShieldAlt,
  FaCheckCircle,
  FaLock,
  FaUnlock,
  FaSync,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaTimes,
  FaSave,
  FaUserPlus,
  FaTooth,
  FaInfoCircle
} from "react-icons/fa";
import "./AdminTimeBlockPanel.css";

// Safe local date parser (immune to UTC midnight shifts)
const parseLocalDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(y, m, d, 12, 0, 0);
};

const formatLocalDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Clinic today in US Eastern Time (Morrisville, PA)
const getTodayNY = () => {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date());
  } catch (e) {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
};

export default function AdminTimeBlockPanel() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = getTodayNY();
    const d = parseLocalDate(today);
    // If today is Sunday (0) or Tuesday (2), advance to next open clinic day
    if (d && d.getDay() === 0) d.setDate(d.getDate() + 1);
    else if (d && d.getDay() === 2) d.setDate(d.getDate() + 1);
    return d ? formatLocalDate(d) : today;
  });

  const [blockedSlots, setBlockedSlots] = useState({});
  const [liveAppointments, setLiveAppointments] = useState([]);
  const [selectedSlotModal, setSelectedSlotModal] = useState(null); // { room, time, status, patient }
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    room: "",
  });

  const rooms = [
    {
      id: "Room 1",
      name: "Operatory 1",
      provider: "Doctor Shalini Mandapatti, DDS",
      role: "Lead Dentist • Restorative & Cosmetic",
      badgeColor: "bg-blue-50 text-[#003BC4] border-blue-200"
    },
    {
      id: "Room 2",
      name: "Operatory 2",
      provider: "Registered Dental Hygienist (RDH)",
      role: "Prophy, Periodontal Care & Scaling",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200"
    },
    {
      id: "Emergency",
      name: "Emergency Operatory",
      provider: "Same-Day Clinical Triage",
      role: "Acute Toothache, Pain Relief & Trauma",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200"
    }
  ];

  // Weekday regular slots: 10:00 AM – 5:00 PM (8 hourly slots)
  const weekdayTimes = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM"
  ];

  // Saturday slots: strictly 9:00 AM – 12:00 PM noon (4 slots)
  const saturdayTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

  // Day of week analysis
  const parsedDate = parseLocalDate(selectedDate);
  const dayOfWeek = parsedDate ? parsedDate.getDay() : null; // 0=Sun, 1=Mon, 2=Tue, 5=Fri, 6=Sat
  const isSaturday = dayOfWeek === 6;
  const isClosed = dayOfWeek === 0 || dayOfWeek === 2;

  const formattedDayTitle = parsedDate
    ? parsedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const activeTimes = useMemo(() => {
    if (!selectedDate || isClosed) return [];
    if (isSaturday) return saturdayTimes;
    return weekdayTimes;
  }, [selectedDate, isClosed, isSaturday]);

  // Generate 7 quick upcoming open days
  const quickDays = useMemo(() => {
    const list = [];
    const base = parseLocalDate(getTodayNY()) || new Date();
    let count = 0;
    let offset = 0;
    while (count < 7) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset, 12, 0, 0);
      const dow = d.getDay();
      if (dow !== 0 && dow !== 2) {
        list.push({
          ymd: formatLocalDate(d),
          dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
          dayNum: d.getDate(),
          monthName: d.toLocaleDateString("en-US", { month: "short" }),
          isSat: dow === 6
        });
        count++;
      }
      offset++;
    }
    return list;
  }, []);

  // Fetch blocked slots & live registered appointments
  const fetchSlotData = () => {
    if (!selectedDate) return;
    setIsRefreshing(true);

    // 1. Fetch blocked slots from DB
    const p1 = fetch(
      `https://allrightdental.com/Backend_Dental/getBlockedSlots.php?date=${selectedDate}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const slots = {};
        if (Array.isArray(data)) {
          data.forEach(({ room, time, status }) => {
            slots[`${room}_${time}`] = status;
          });
        }
        setBlockedSlots(slots);
      })
      .catch(() => {});

    // 2. Fetch live scheduled appointments from DB
    const p2 = fetch("https://allrightdental.com/Backend_Dental/getRegistration.php")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setLiveAppointments(data.data);
        }
      })
      .catch(() => {});

    Promise.all([p1, p2]).finally(() => {
      setTimeout(() => setIsRefreshing(false), 300);
    });
  };

  useEffect(() => {
    fetchSlotData();
  }, [selectedDate]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Check if a slot has a live booked appointment
  const getBookedAppointmentForSlot = (room, time) => {
    if (!liveAppointments || liveAppointments.length === 0) return null;
    return liveAppointments.find((a) => {
      if (a.date !== selectedDate) return false;
      const roomMatch =
        (a.room || "").toLowerCase().trim() === room.toLowerCase().trim() ||
        ((a.room || "").toLowerCase().includes("room 1") && room === "Room 1") ||
        ((a.room || "").toLowerCase().includes("room 2") && room === "Room 2") ||
        ((a.room || "").toLowerCase().includes("emergency") && room === "Emergency");
      if (!roomMatch) return false;

      // Normalize time comparison (e.g. "10:00 AM" vs "10:00:00")
      const slotHour = parseInt(time.split(":")[0], 10);
      const slotPeriod = time.includes("PM") ? "PM" : "AM";
      const apptHourRaw = parseInt(a.time.split(":")[0], 10);
      const apptPeriod = a.time.includes("PM") || apptHourRaw >= 12 ? "PM" : "AM";
      const apptHour = apptHourRaw > 12 ? apptHourRaw - 12 : apptHourRaw;

      return slotHour === apptHour && slotPeriod === apptPeriod;
    });
  };

  // Toggle Slot to Available (Unblock)
  const handleUnblockSlot = async (room, time) => {
    const key = `${room}_${time}`;
    try {
      await fetch("https://allrightdental.com/Backend_Dental/unblockSlot.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, room, time }),
      });
      setBlockedSlots((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      setNotification({
        type: "success",
        message: `🟢 ${room} at ${time} is now marked Available!`
      });
    } catch (e) {
      setNotification({ type: "error", message: "Failed to unblock slot." });
    }
    setSelectedSlotModal(null);
  };

  // Toggle Slot to Blocked (Not Available)
  const handleBlockSlot = async (room, time) => {
    const key = `${room}_${time}`;
    try {
      await fetch("https://allrightdental.com/Backend_Dental/blockSlot.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, room, time }),
      });
      setBlockedSlots((prev) => ({ ...prev, [key]: "blocked" }));
      setNotification({
        type: "info",
        message: `🔒 ${room} at ${time} is now marked Blocked / Not Available.`
      });
    } catch (e) {
      setNotification({ type: "error", message: "Failed to block slot." });
    }
    setSelectedSlotModal(null);
  };

  // Unblock ALL slots on this date (Convenience reset tool)
  const handleUnblockAllOnDate = async () => {
    if (!window.confirm(`Are you sure you want to make ALL slots available on ${selectedDate}?`)) {
      return;
    }
    setIsRefreshing(true);
    for (const r of rooms) {
      for (const t of activeTimes) {
        try {
          await fetch("https://allrightdental.com/Backend_Dental/unblockSlot.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: selectedDate, room: r.id, time: t }),
          });
        } catch (e) {}
      }
    }
    setBlockedSlots({});
    setIsRefreshing(false);
    setNotification({
      type: "success",
      message: `✨ All slots on ${formattedDayTitle} have been set to Available!`
    });
  };

  // Handle direct appointment booking from slot
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert("Please fill in patient First Name, Last Name, and Phone Number.");
      return;
    }

    try {
      const response = await fetch(
        "https://allrightdental.com/Backend_Dental/admin_appointment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (result.success) {
        const key = `${formData.room}_${formData.time}`;
        setBlockedSlots((prev) => ({ ...prev, [key]: "booked by call" }));
        setNotification({
          type: "success",
          message: `✅ Appointment confirmed for ${formData.firstName} ${formData.lastName} in ${formData.room} at ${formData.time}!`
        });
        setIsBookingFormOpen(false);
        setSelectedSlotModal(null);
        setFormData({
          firstName: "",
          lastName: "",
          dob: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          room: "",
        });
        fetchSlotData();
      } else {
        setNotification({
          type: "error",
          message: "Error booking appointment: " + (result.message || "Failed")
        });
      }
    } catch (err) {
      setNotification({ type: "error", message: "Network error saving appointment." });
    }
  };

  return (
    <div className="space-y-4 w-full max-w-full font-poppins text-slate-800">
      {/* ================= 1. MODERN HEADER CARD ================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 shrink-0">
            <FaClock />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                Operatory Time Slot Management
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Operatory 1 &amp; 2 Live
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Doctor Shalini Mandapatti, DDS • Operatory Availability &amp; Clinical Capacity Planning
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          <div className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <FaShieldAlt className="text-emerald-600 text-xs" />
            <span>HIPAA Operatory Controls</span>
          </div>

          <button
            type="button"
            onClick={handleUnblockAllOnDate}
            className="text-[11px] font-bold px-3 py-1 rounded-full bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            title="Make all slots available for this selected day"
          >
            <FaUnlock className="text-[9px]" /> Reset Day Available
          </button>

          <button
            type="button"
            onClick={fetchSlotData}
            disabled={isRefreshing}
            className="p-1.5 text-slate-500 hover:text-[#003BC4] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh Slots"
          >
            <FaSync className={`text-xs ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-sm transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : notification.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-blue-50 border-blue-200 text-[#003BC4]"
          }`}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs hover:opacity-75 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* ================= 2. DATE SELECTOR & CLINIC HOURS BAR ================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Date Picker Input */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold text-slate-700 min-w-[80px]">Select Date:</span>
            <div className="relative">
              <ReactDatePicker
                selected={parseLocalDate(selectedDate)}
                onChange={(date) => {
                  if (date && date instanceof Date && !isNaN(date.getTime())) {
                    setSelectedDate(formatLocalDate(date));
                  }
                }}
                filterDate={(d) => d.getDay() !== 0 && d.getDay() !== 2}
                dateFormat="yyyy-MM-dd"
                className="pl-3 pr-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-[#003BC4] text-slate-900 bg-slate-50/50 cursor-pointer shadow-2xs"
              />
            </div>

            {/* Quick Actions */}
            <button
              type="button"
              onClick={() => setSelectedDate(getTodayNY())}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-[#003BC4] border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Today (NY)
            </button>
            <button
              type="button"
              onClick={() => {
                const d = parseLocalDate(selectedDate || getTodayNY()) || new Date();
                d.setDate(d.getDate() + 1);
                if (d.getDay() === 0) d.setDate(d.getDate() + 1); // skip Sun
                if (d.getDay() === 2) d.setDate(d.getDate() + 1); // skip Tue
                setSelectedDate(formatLocalDate(d));
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
            >
              Next Open Day &rarr;
            </button>
          </div>

          {/* Operating Hours Pill */}
          <div className="self-start md:self-auto">
            {isClosed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                🚨 {formattedDayTitle} &bull; Closed ({dayOfWeek === 2 ? "Tuesday" : "Sunday"})
              </span>
            ) : isSaturday ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                ⚠️ {formattedDayTitle} &bull; Saturday Half-Day (9:00 AM – 12:00 PM)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                🟢 {formattedDayTitle} &bull; Regular Hours (10:00 AM – 5:00 PM)
              </span>
            )}
          </div>
        </div>

        {/* Quick Weekday Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Open Days:</span>
          {quickDays.map((item) => {
            const isSelected = selectedDate === item.ymd;
            return (
              <button
                key={item.ymd}
                type="button"
                onClick={() => setSelectedDate(item.ymd)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-[#0B132B] text-white shadow-xs"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <span>{item.dayName}</span>
                <span className="font-extrabold">{item.dayNum}</span>
                {item.isSat && (
                  <span className="text-[9px] font-bold px-1 rounded bg-amber-400 text-amber-950">
                    Half Day
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 3. OPERATORY INFORMATION BAR ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-[#003BC4] flex items-center justify-center text-sm border border-slate-100 shrink-0 mt-0.5">
              <FaDoorOpen />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-extrabold text-slate-900">{room.name}</h4>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${room.badgeColor}`}>
                  {room.id === "Room 1" ? "Lead DDS" : room.id === "Room 2" ? "RDH Hygiene" : "Urgent Care"}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-700 truncate mt-0.5">{room.provider}</p>
              <p className="text-[10px] text-slate-400 truncate">{room.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= 4. MAIN SLOTS GRID TABLE ================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-3">
        {isClosed ? (
          <div className="p-8 bg-rose-50/70 border border-rose-200 text-rose-800 rounded-2xl text-center space-y-2">
            <FaExclamationTriangle className="text-3xl text-rose-500 mx-auto" />
            <h3 className="font-extrabold text-base text-rose-900">
              AllRight Dental is Closed on {dayOfWeek === 2 ? "Tuesdays" : "Sundays"}
            </h3>
            <p className="text-xs text-rose-700 max-w-md mx-auto">
              No appointments or time slot blocks are scheduled on {dayOfWeek === 2 ? "Tuesdays" : "Sundays"}.
              Please select Monday, Wednesday, Thursday, Friday (10:00 AM – 5:00 PM), or Saturday (9:00 AM – 12:00 PM).
            </p>
            <button
              type="button"
              onClick={() => {
                const d = parseLocalDate(selectedDate) || new Date();
                d.setDate(d.getDate() + 1);
                if (d.getDay() === 0) d.setDate(d.getDate() + 1);
                if (d.getDay() === 2) d.setDate(d.getDate() + 1);
                setSelectedDate(formatLocalDate(d));
              }}
              className="mt-2 px-4 py-1.5 bg-[#003BC4] text-white font-bold text-xs rounded-full shadow-xs cursor-pointer hover:bg-blue-700"
            >
              Go to Next Open Day &rarr;
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-600">
                  <th className="py-3 px-4 w-36">Time Slot</th>
                  {rooms.map((room) => (
                    <th key={room.id} className="py-3 px-4 text-center">
                      <div className="font-extrabold text-slate-800">{room.name}</div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {room.id === "Room 1" ? "Doctor Shalini" : room.id === "Room 2" ? "RDH Hygiene" : "Emergency"}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {activeTimes.map((time) => (
                  <tr key={time} className="hover:bg-slate-50/50 transition-colors">
                    {/* Time Slot Label */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 bg-slate-50/40 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <FaClock className="text-slate-400 text-[10px]" />
                        <span>{time}</span>
                      </div>
                    </td>

                    {/* Room Slots */}
                    {rooms.map((room) => {
                      const key = `${room.id}_${time}`;
                      const status = blockedSlots[key];
                      const matchedAppt = getBookedAppointmentForSlot(room.id, time);

                      let badgeText = "Available";
                      let badgeStyle =
                        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300";
                      let icon = <FaCheckCircle className="text-[10px] text-emerald-600" />;

                      if (matchedAppt) {
                        badgeText = `${matchedAppt.firstName} ${matchedAppt.lastName}`;
                        badgeStyle =
                          "bg-blue-50 text-[#003BC4] border-blue-300 hover:bg-blue-100 font-bold";
                        icon = <FaCalendarCheck className="text-[10px] text-[#003BC4]" />;
                      } else if (status === "blocked") {
                        badgeText = "Not Available";
                        badgeStyle =
                          "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-800";
                        icon = <FaLock className="text-[10px] text-slate-500" />;
                      } else if (status === "booked by call") {
                        badgeText = "Booked (Phone)";
                        badgeStyle =
                          "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 font-bold";
                        icon = <FaPhoneAlt className="text-[9px] text-amber-700" />;
                      } else if (status === "booked") {
                        badgeText = "Booked (Online)";
                        badgeStyle =
                          "bg-blue-50 text-[#003BC4] border-blue-300 hover:bg-blue-100 font-bold";
                        icon = <FaCalendarCheck className="text-[10px] text-[#003BC4]" />;
                      }

                      return (
                        <td key={key} className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedSlotModal({
                                room: room.id,
                                roomName: room.name,
                                time,
                                status: matchedAppt ? "booked" : status || "available",
                                patient: matchedAppt
                              })
                            }
                            className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer timeblock-slot-btn ${badgeStyle}`}
                            title={`Click to manage ${room.name} at ${time}`}
                          >
                            {icon}
                            <span className="truncate">{badgeText}</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= 5. SLOT MANAGEMENT MODAL ================= */}
      {selectedSlotModal && (
        <div
          onClick={() => setSelectedSlotModal(null)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003BC4] flex items-center justify-center text-base">
                  <FaClock />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedSlotModal.roomName} &bull; {selectedSlotModal.time}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {formattedDayTitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlotModal(null)}
                className="text-slate-400 hover:text-slate-700 text-base cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Current Status Pill */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Current Operatory Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full ${
                  selectedSlotModal.status === "available"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : selectedSlotModal.status === "blocked"
                    ? "bg-slate-100 text-slate-700 border border-slate-200"
                    : "bg-blue-50 text-[#003BC4] border border-blue-200"
                }`}
              >
                {selectedSlotModal.patient
                  ? `Booked (${selectedSlotModal.patient.firstName} ${selectedSlotModal.patient.lastName})`
                  : selectedSlotModal.status === "blocked"
                  ? "🔒 Blocked / Not Available"
                  : selectedSlotModal.status === "booked by call"
                  ? "📞 Booked over Phone"
                  : "🟢 Available for Booking"}
              </span>
            </div>

            {/* Actions for this slot */}
            {!isBookingFormOpen ? (
              <div className="space-y-2 pt-1">
                {/* 1. If currently blocked -> Offer unblock */}
                {selectedSlotModal.status === "blocked" ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleUnblockSlot(selectedSlotModal.room, selectedSlotModal.time)
                    }
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaUnlock className="text-xs" />
                    <span>Make Available (🟢 Unblock Slot)</span>
                  </button>
                ) : (
                  /* If currently available -> Offer block */
                  <button
                    type="button"
                    onClick={() =>
                      handleBlockSlot(selectedSlotModal.room, selectedSlotModal.time)
                    }
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaLock className="text-xs" />
                    <span>Mark Unavailable (🔒 Block Operatory)</span>
                  </button>
                )}

                {/* 2. Direct Clinical Booking */}
                <button
                  type="button"
                  onClick={() => {
                    setIsBookingFormOpen(true);
                    setFormData((prev) => ({
                      ...prev,
                      date: selectedDate,
                      time: selectedSlotModal.time,
                      room: selectedSlotModal.room
                    }));
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#003BC4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaUserPlus className="text-xs" />
                  <span>Book Patient in this Slot</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSlotModal(null)}
                  className="w-full py-2 px-3 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            ) : (
              /* Quick Patient Booking Form */
              <form onSubmit={handleBookAppointment} className="space-y-3 pt-1">
                <div className="text-xs font-bold text-slate-900 border-b pb-1">
                  Book Patient: {selectedSlotModal.roomName} &bull; {selectedSlotModal.time}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-[#003BC4]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-[#003BC4]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(215) 295-1348"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-[#003BC4]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-[#003BC4]"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-600 font-semibold mb-0.5">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-[#003BC4]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsBookingFormOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#003BC4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
