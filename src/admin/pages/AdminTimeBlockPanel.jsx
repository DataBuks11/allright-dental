import React, { useState, useEffect } from 'react'; 
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AdminTimeBlockPanel.css';

// Safe local date parser (immune to UTC midnight shifts in US Eastern or any client timezone)
const parseLocalDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  // Local noon (12:00:00) guarantees no day boundary jump
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
  const [showOptions, setShowOptions] = useState(null);
  const [showForm, setShowForm] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState("info"); 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    room: '',
  });

  const rooms = ['Room 1', 'Room 2', 'Emergency'];

  // Regular weekday slots: 10:00 AM – 5:00 PM (8 slots)
  const times = Array.from({ length: 8 }, (_, i) => {
    const hour = 10 + i;
    const displayHour = hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${period}`;
  });

  // Saturday-specific slots: 9:00 AM – 12:00 PM strictly (Half day, 4 morning slots)
  const saturdayTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

  // Day of week analysis for selectedDate
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

  // Determine which times to use based on selected date
  const getFilteredTimes = () => {
    if (!selectedDate || isClosed) return [];
    if (isSaturday) return saturdayTimes;
    return times;
  };

  const filteredTimes = getFilteredTimes();

  // fetch blocked slots
  useEffect(() => {
    if (!selectedDate) return;

    fetch(`https://allrightdental.com/Backend_Dental/getBlockedSlots.php?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        const slots = {};
        if (Array.isArray(data)) {
          data.forEach(({ room, time, status }) => {
            slots[`${room}_${time}`] = status;
          });
        }
        setBlockedSlots(slots);
      })
      .catch((err) => console.error(err));
  }, [selectedDate]);

  // toggle Not Available
  const handleMakeUnavailable = async (room, time) => {
    const key = `${room}_${time}`;

    await fetch(`https://allrightdental.com/Backend_Dental/blockSlot.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate, room, time }),
    });

    setBlockedSlots((prev) => ({ ...prev, [key]: 'blocked' }));
    setShowOptions(null);
  };

  // handle popup auto-hide
  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage(null);
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);
  
  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Step 1: Save appointment in DB
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
  
        // Step 2: Send confirmation email
        const emailResponse = await fetch(
          "https://allrightdental.com/Backend_Dental/sendAppointmentMail.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
  
        const emailResult = await emailResponse.json();
  
        if (emailResult.status === "success") {
          setPopupMessage("✅ Appointment booked & email sent successfully!");
          setPopupType("success");
        } else {
          setPopupMessage("⚠️ Appointment saved but email failed.");
          setPopupType("warning");
        }
  
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
        setShowForm(null);
      } else {
        setPopupMessage("❌ Error: " + result.message);
        setPopupType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setPopupMessage("⚠️ Something went wrong. Please try again.");
      setPopupType("error");
    }
  };

  return (
    <div className="contacts-container bg-white p-6 rounded-xl shadow-md border border-gray-200 fade-in">
      {/* Heading */}
      <div className="heading-container mb-8">
        <h1>Time Slot Management</h1>
      </div>

      {/* Date Picker & Controls */}
      <div className="mb-6 flex items-center flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <label htmlFor="date-picker" className="text-base font-bold text-gray-700 min-w-[100px]">
          Select Date:
        </label>
        <div className="relative w-[230px]">
          <ReactDatePicker
            id="date-picker"
            filterDate={(d) => d.getDay() !== 0 && d.getDay() !== 2}
            selected={parseLocalDate(selectedDate)}
            onChange={(date) => {
              if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
                setSelectedDate("");
                return;
              }
              setSelectedDate(formatLocalDate(date));
            }}
            className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg w-full font-bold text-gray-800 text-base focus:ring-2 focus:ring-[#00B7AA] focus:outline-none"
            dateFormat="yyyy-MM-dd"
            placeholderText="YYYY-MM-DD"
            popperPlacement="bottom-start"
            withPortal
          />
        </div>

        {/* Quick Date Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedDate(getTodayNY())}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 border border-teal-300 hover:bg-teal-100 transition"
          >
            Today (NY)
          </button>
          <button
            type="button"
            onClick={() => {
              const d = parseLocalDate(selectedDate || getTodayNY()) || new Date();
              d.setDate(d.getDate() + 1);
              if (d.getDay() === 0) d.setDate(d.getDate() + 1); // skip Sunday
              if (d.getDay() === 2) d.setDate(d.getDate() + 1); // skip Tuesday
              setSelectedDate(formatLocalDate(d));
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 transition"
          >
            Next Open Day &rarr;
          </button>
        </div>

        {/* Day & Hours Badge */}
        {selectedDate && (
          <div className="ml-auto flex items-center">
            {isClosed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-red-100 text-red-800 border border-red-300">
                🚨 {formattedDayTitle} — Closed ({dayOfWeek === 2 ? "Tuesday" : "Sunday"})
              </span>
            ) : isSaturday ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-amber-100 text-amber-900 border border-amber-300">
                ⚠️ {formattedDayTitle} — Half Day (9:00 AM – 12:00 PM)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                🟢 {formattedDayTitle} — Regular Hours (10:00 AM – 5:00 PM)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Slots Section */}
      {selectedDate && (
        <div className="p-6 bg-white rounded-2xl shadow-lg w-full max-w-6xl mx-auto mt-6 border border-gray-200">
          {/* Operating Hours Banner */}
          {isClosed ? (
            <div className="p-8 bg-red-50 border-2 border-red-300 text-red-800 rounded-xl text-center my-2">
              <h4 className="font-bold text-xl mb-1">
                🚨 AllRight Dental is Closed on {dayOfWeek === 2 ? "Tuesdays" : "Sundays"}
              </h4>
              <p className="text-sm font-medium">
                No appointments or slot blocks are scheduled on {dayOfWeek === 2 ? "Tuesdays" : "Sundays"}.
                Please select Monday, Wednesday, Thursday, Friday (10:00 AM – 5:00 PM), or Saturday (9:00 AM – 12:00 PM).
              </p>
            </div>
          ) : (
            <>
              {isSaturday ? (
                <div className="mb-4 p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg text-amber-900 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="font-bold text-sm">
                      ⚠️ Saturday Half-Day Schedule: 9:00 AM – 12:00 PM
                    </span>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Clinic closes promptly at 12:00 PM noon. 4 morning appointment slots per room (Room 1, Room 2, Emergency).
                    </p>
                  </div>
                  <span className="text-xs bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Morning Half-Day
                  </span>
                </div>
              ) : (
                <div className="mb-4 p-3.5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-emerald-900 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="font-bold text-sm">
                      🟢 Regular Clinic Schedule: 10:00 AM – 5:00 PM
                    </span>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Full-day operating hours. 8 hourly appointment slots per room (Room 1, Room 2, Emergency).
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Full Day
                  </span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed border border-gray-300">
                  <thead className="bg-blue-100 text-blue-800">
                    <tr>
                      <th className="py-3 px-4 text-left border-r border-gray-300 w-36">Time Slot</th>
                      {rooms.map((room) => (
                        <th key={room} className="py-3 px-4 text-center font-semibold border-r border-gray-300">
                          {room}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTimes.map((time) => (
                      <tr key={time} className="border-t border-gray-200">
                        <td className="py-2.5 px-4 font-semibold text-gray-800 border-r border-gray-200 bg-gray-50">{time}</td>
                        {rooms.map((room) => {
                          const key = `${room}_${time}`;
                          const status = blockedSlots[key];

                          let buttonText = '🟢 Available';
                          let bgColor = 'bg-green-500 hover:bg-green-600 text-black';

                          if (status === 'blocked') {
                            buttonText = '🔒 Not Available';
                            bgColor = 'bg-gray-600 hover:bg-gray-700 text-white';
                          } else if (status === 'booked by call') {
                            buttonText = '📞 Booked (Call)';
                            bgColor = 'bg-yellow-600 hover:bg-yellow-800 text-white';
                          } else if (status === 'booked') {
                            buttonText = '🔒 Booked (Online)';
                            bgColor = 'bg-red-600 hover:bg-red-800 text-white';
                          }

                          return (
                            <td key={key} className="py-2 px-2 text-center border-r border-gray-200 relative">
                              <button
                                onClick={() => setShowOptions(showOptions === key ? null : key)}
                                className={`w-full py-1.5 rounded-md transition duration-200 text-sm font-semibold ${bgColor}`}
                              >
                                {buttonText}
                              </button>

                              {/* Options dropdown */}
                              {showOptions === key && (
                                <div className="absolute z-10 bg-white border shadow rounded-md mt-1 w-44 left-1/2 -translate-x-1/2">
                                  {status === undefined && (
                                    <>
                                      <button
                                        onClick={() => {
                                          handleMakeUnavailable(room, time);
                                          setShowOptions(null);
                                        }}
                                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                                      >
                                        🔒 Not Available
                                      </button>

                                      <button
                                        onClick={() => {
                                          setShowOptions(null);
                                          setShowForm(key);
                                          setFormData((prev) => ({
                                            ...prev,
                                            date: selectedDate,
                                            time,
                                            room,
                                          }));
                                        }}
                                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                                      >
                                        📞 Booked Over Call
                                      </button>
                                    </>
                                  )}

                                  {status === 'blocked' && (
                                    <>
                                      <button
                                        onClick={async () => {
                                          await fetch(`https://allrightdental.com/Backend_Dental/unblockSlot.php`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ date: selectedDate, room, time }),
                                          });
                                          setBlockedSlots((prev) => {
                                            const updated = { ...prev };
                                            delete updated[key];
                                            return updated;
                                          });
                                          setShowOptions(null);
                                        }}
                                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                                      >
                                        🟢 Available
                                      </button>

                                      <button
                                        onClick={() => {
                                          setShowOptions(null);
                                          setShowForm(key);
                                          setFormData((prev) => ({
                                            ...prev,
                                            date: selectedDate,
                                            time,
                                            room,
                                          }));
                                        }}
                                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                                      >
                                        📞 Booked Over Call
                                      </button>
                                    </>
                                  )}

                                  {status === 'booked' && (
                                    <>
                                      <button
                                        onClick={async () => {
                                          await fetch(`https://allrightdental.com/Backend_Dental/unblockSlot.php`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ date: selectedDate, room, time }),
                                          });
                                          setBlockedSlots((prev) => {
                                            const updated = { ...prev };
                                            delete updated[key];
                                            return updated;
                                          });
                                          setShowOptions(null);
                                        }}
                                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                                      >
                                        🟢 Available
                                      </button>

                                      <button
                                        onClick={() => {
                                          handleMakeUnavailable(room, time);
                                          setShowOptions(null);
                                        }}
                                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                                      >
                                        🔒 Not Available
                                      </button>
                                    </>
                                  )}

                                  {status === 'booked by call' && (
                                    <>
                                      <button
                                        onClick={async () => {
                                          await fetch(`https://allrightdental.com/Backend_Dental/unblockSlot.php`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ date: selectedDate, room, time }),
                                          });
                                          setBlockedSlots((prev) => {
                                            const updated = { ...prev };
                                            delete updated[key];
                                            return updated;
                                          });
                                          setShowOptions(null);
                                        }}
                                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                                      >
                                        🟢 Available
                                      </button>

                                      <button
                                        onClick={() => {
                                          handleMakeUnavailable(room, time);
                                          setShowOptions(null);
                                        }}
                                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                                      >
                                        🔒 Not Available
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Booking Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[550px] relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setShowForm(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              ✖
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-blue-700">
              📞 Booked Slot (Over Call)
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* First Name */}
              <div className="flex items-center gap-1">
                <label className="w-32 text-sm font-semibold text-gray-700">
                  First Name :
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="flex items-center gap-1">
                <label className="w-32 text-sm font-semibold text-gray-700">
                  Last Name :
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              {/* DOB */}
              <div className="flex items-center gap-1">
                <label className="w-32 text-sm font-semibold text-gray-700">
                  Date of Birth :
                </label>
                <ReactDatePicker
                  selected={formData.dob ? parseLocalDate(formData.dob.includes('/') ? `${formData.dob.split('/')[2]}-${formData.dob.split('/')[0].padStart(2, '0')}-${formData.dob.split('/')[1].padStart(2, '0')}` : formData.dob) : null}
                  onChange={(date) => {
                    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return;
                    const formatted = date.toLocaleDateString("en-US"); // MM/DD/YYYY
                    setFormData({ ...formData, dob: formatted });
                  }}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex items-center gap-1">
                <label className="w-32 text-sm font-semibold text-gray-700">
                  Email :
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-1">
                <label className="w-32 text-sm font-semibold text-gray-700">
                  Phone :
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              {/* Booking Info Summary */}
              <div className="text-sm text-gray-700 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg mt-4">
                Booking for <b className="text-blue-700">{formData.room}</b> at{' '}
                <b className="text-blue-700">{formData.time}</b> on{' '}
                <b className="text-blue-700">{formData.date}</b>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
                >
                  ✅ Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {popupMessage && (
        <div className="popup-overlay">
          <div className={`popup-box ${popupType}`}>
            <p>{popupMessage}</p>
            <button onClick={() => setPopupMessage(null)}>OK</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="admin-footer text-center text-gray-600 mt-10 pt-4 border-t">
        <div>&copy; {new Date().getFullYear()} Developed by TAGRAB LLC. All Rights Reserved.</div>
      </footer>
    </div>
  );
}
