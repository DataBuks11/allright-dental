import React, { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./Calendar.css";

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

// Generate upcoming open clinic dates in US Eastern Time (Morrisville, PA)
const getUpcomingDatesNY = (count = 10) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayNYStr = formatter.format(new Date());
  const [y, m, d] = todayNYStr.split("-").map(Number);

  const result = [];
  let offset = 0;
  while (result.length < count) {
    const dateObj = new Date(y, m - 1, d + offset, 12, 0, 0);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    // Skip Sunday (0) and Tuesday (2) (Monday open)
    if (dayOfWeek !== 0 && dayOfWeek !== 2) {
      const yStr = dateObj.getFullYear();
      const mStr = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dStr = String(dateObj.getDate()).padStart(2, "0");
      const ymd = `${yStr}-${mStr}-${dStr}`;

      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });
      const dayNum = dateObj.getDate();
      const isSaturday = dayOfWeek === 6;

      result.push({
        ymd,
        dayName,
        monthName,
        dayNum,
        isSaturday,
        dayOfWeek,
      });
    }
    offset++;
  }
  return result;
};

export default function Calendar() {
  const upcomingDates = getUpcomingDatesNY(10);
  const [selectedDate, setSelectedDate] = useState(() => upcomingDates[0]?.ymd || "");
  const [blockedSlots, setBlockedSlots] = useState({});

  const selectedDateObj = parseLocalDate(selectedDate);
  const selectedDayOfWeek = selectedDateObj ? selectedDateObj.getDay() : null;
  const isSaturday = selectedDayOfWeek === 6;
  const isClosed = selectedDayOfWeek === 0 || selectedDayOfWeek === 2;

  // Saturday-specific slots (9:00 AM – 12:00 PM strictly - 4 morning slots)
  const saturdayTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

  // Regular weekday slots (10:00 AM – 5:00 PM - 8 slots)
  const regularTimes = Array.from({ length: 8 }, (_, i) => {
    const hour = 10 + i;
    const displayHour = hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? "PM" : "AM";
    return `${displayHour}:00 ${period}`;
  });

  const timesList = isSaturday ? saturdayTimes : regularTimes;

  // Fetch blocked slots & auto-refresh every 2s
  useEffect(() => {
    if (!selectedDate) return;
    const fetchBlockedSlots = () => {
      fetch(`https://allrightdental.com/Backend_Dental/getBlockedSlots.php?date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => {
          const slots = {};
          if (Array.isArray(data)) {
            data.forEach((appt) => {
              const slotKey = `${appt.room}_${appt.time}`;
              slots[slotKey] = appt.status;
            });
          }
          setBlockedSlots(slots);
        })
        .catch(() => setBlockedSlots({}));
    };

    fetchBlockedSlots();
    const interval = setInterval(fetchBlockedSlots, 2000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  return (
    <div className="calendar-page-container">
      <div className="heading-container mb-8">
        <h1>
          <FaRegCalendarAlt className="text-white text-3xl" />
          Available Slots
        </h1>
      </div>

      {/* Date Tabs */}
      <div className="calendar-date-tabs">
        {upcomingDates.map((item) => {
          const isActive = selectedDate === item.ymd;
          return (
            <button
              key={item.ymd}
              onClick={() => setSelectedDate(item.ymd)}
              className={`${isActive ? "active" : "inactive"} relative flex flex-col items-center`}
              title={item.isSaturday ? "Saturday (Half Day: 9am - 12pm)" : "Weekday (10am - 5pm)"}
            >
              <span className="text-sm font-semibold">{item.dayName}</span>
              <span className="text-xs font-medium uppercase tracking-wider">{item.monthName}</span>
              <span className="text-lg font-extrabold">{item.dayNum}</span>
              {item.isSaturday && (
                <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-full mt-1">
                  Half Day
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Operating Hours Banner */}
      {selectedDate && (
        <div className="mb-6">
          {isClosed ? (
            <div className="bg-red-50 border-2 border-red-300 text-red-800 p-6 rounded-2xl text-center my-4 w-full">
              <h4 className="font-bold text-lg mb-1">
                🚨 Clinic Closed on {selectedDayOfWeek === 2 ? "Tuesdays" : "Sundays"}
              </h4>
              <p className="text-sm">
                No room or emergency appointments are scheduled on {selectedDayOfWeek === 2 ? "Tuesdays" : "Sundays"}.
              </p>
            </div>
          ) : isSaturday ? (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-amber-900 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-bold text-base flex items-center gap-2">
                  <span>⚠️</span> Saturday Half-Day Operating Hours: 9:00 AM – 12:00 PM
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  The clinic closes promptly at 12:00 PM noon. 4 morning appointment slots per room.
                </p>
              </div>
              <span className="bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Morning Half-Day
              </span>
            </div>
          ) : (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl text-emerald-900 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-bold text-base flex items-center gap-2">
                  <span>🟢</span> Regular Operating Hours: 10:00 AM – 5:00 PM
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Full day clinical schedule. 8 hourly appointment slots per room across Room 1, Room 2, and Emergency.
                </p>
              </div>
              <span className="bg-emerald-200 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Regular Hours
              </span>
            </div>
          )}
        </div>
      )}

      {/* Room Grid */}
      {selectedDate && !isClosed && (
        <div className="calendar-room-grid">
          {["Room 1", "Room 2", "Emergency"].map((room) => (
            <div key={room} className="calendar-room">
              <h3>{room}</h3>
              {timesList.map((time) => {
                const slotKey = `${room}_${time}`;
                const status = blockedSlots?.[slotKey];

                let slotClass = "calendar-slot-green";
                let slotText = time;

                if (status === "blocked") {
                  slotClass = "calendar-slot-gray";
                  slotText = `${time} 🔒 Not Available`;
                } else if (status === "booked by call") {
                  slotClass = "calendar-slot-yellow";
                  slotText = `${time} 📞 Booked (Call)`;
                } else if (status === "booked") {
                  slotClass = "calendar-slot-red";
                  slotText = `${time} ❌ Booked`;
                }

                return (
                  <div key={slotKey} className={`calendar-slot-button ${slotClass}`}>
                    {slotText}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="admin-footer text-center text-gray-600 mt-10 pt-4 border-t">
        <div>
          &copy; {new Date().getFullYear()} Developed by TAGRAB LLC. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
