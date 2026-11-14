import React, { useEffect, useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FaCalendarCheck,
  FaSearch,
  FaFilePdf,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaClock,
  FaDoorOpen,
  FaUser,
  FaCalendarAlt,
  FaSync
} from 'react-icons/fa';

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('https://allrightdental.com/Backend_Dental/getRegistration.php');
      const data = await res.json();
      setAppointments(data.data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await fetch(`https://allrightdental.com/Backend_Dental/deleteRegistration.php?id=${id}`);
      fetchAppointments();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEditClick = (appointment) => {
    setEditId(appointment.id);
    setEditData({
      id: appointment.id,
      firstName: appointment.firstName || '',
      lastName: appointment.lastName || '',
      dob: appointment.dob || '',
      date: appointment.date || '',
      time: appointment.time || '',
      room: appointment.room || 'Room 1'
    });
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveAppointment = async () => {
    try {
      await fetch('https://allrightdental.com/Backend_Dental/getRegistration.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      setEditId(null);
      setEditData({});
      fetchAppointments();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const filteredAppointments = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return appointments;
    return appointments.filter((a) =>
      `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase().includes(q) ||
      (a.dob && a.dob.toLowerCase().includes(q)) ||
      (a.date && a.date.toLowerCase().includes(q)) ||
      (a.time && a.time.toLowerCase().includes(q)) ||
      (a.room && a.room.toLowerCase().includes(q))
    );
  }, [appointments, searchTerm]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage) || 1;
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AllRight Dental - Scheduled Appointments Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Doctor Shalini Mandapatti, DDS • Generated on ${new Date().toLocaleDateString('en-US')}`, 14, 27);

    const headers = [['#', 'First Name', 'Last Name', 'DOB', 'Date', 'Time', 'Room']];
    const rows = filteredAppointments.map((a, index) => [
      index + 1,
      a.firstName || '-',
      a.lastName || '-',
      a.dob || '-',
      a.date || '-',
      a.time || '-',
      a.room || '-'
    ]);

    if (rows.length === 0) {
      alert('No appointments available to download.');
      return;
    }

    autoTable(doc, {
      startY: 33,
      head: headers,
      body: rows,
      theme: 'striped',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 59, 196] },
    });

    doc.save('AllRight_Dental_Appointments.pdf');
  };

  const getRoomBadgeClass = (room) => {
    const r = (room || '').toLowerCase();
    if (r.includes('emergency')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (r.includes('room 2')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <FaCalendarCheck className="text-[#003BC4]" />
            <span>Doctor Shalini Mandapatti, DDS • Practice Operatory Schedule</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Appointments & Clinical Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management of confirmed patient appointments and operatory allocations ({appointments.length} active records).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAppointments}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh database"
          >
            <FaSync className={`text-xs ${isRefreshing ? 'animate-spin text-[#003BC4]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#003BC4] to-[#00B7AA] hover:from-[#002fa0] hover:to-[#009b90] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <FaFilePdf className="text-sm" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by patient name, date (YYYY-MM-DD), time, or room..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#003BC4] focus:ring-1 focus:ring-[#003BC4] outline-none text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 whitespace-nowrap">
            <span>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-medium outline-none"
            >
              <option value={10}>10 records</option>
              <option value={25}>25 records</option>
              <option value={50}>50 records</option>
              <option value={100}>100 records</option>
            </select>
          </label>
        </div>
      </div>

      {/* Appointments Data Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-[#003BC4] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-semibold">Loading practice appointments from database...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FaCalendarCheck className="text-3xl text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No appointments found</p>
            <p className="text-xs text-slate-400 mt-1">
              {searchTerm ? 'No matching appointments match your query.' : 'No upcoming appointments currently booked.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Date of Birth</th>
                  <th className="py-3 px-4">Appointment Date</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Operatory</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAppointments.map((a, index) => {
                  const isEditing = editId === a.id;
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400 text-[11px]">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="firstName"
                              value={editData.firstName}
                              onChange={handleInputChange}
                              placeholder="First"
                              className="w-24 px-2 py-1 border border-slate-300 rounded text-xs"
                            />
                            <input
                              type="text"
                              name="lastName"
                              value={editData.lastName}
                              onChange={handleInputChange}
                              placeholder="Last"
                              className="w-24 px-2 py-1 border border-slate-300 rounded text-xs"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-50 text-[#003BC4] font-bold text-xs flex items-center justify-center shrink-0">
                              {(a.firstName || 'P').charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">
                                {a.firstName} {a.lastName}
                              </p>
                              <p className="text-[10px] text-slate-400">Doctor Shalini Patient</p>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* DOB */}
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {isEditing ? (
                          <input
                            type="date"
                            name="dob"
                            value={editData.dob}
                            onChange={handleInputChange}
                            className="px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                        ) : (
                          a.dob || '-'
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="date"
                            name="date"
                            value={editData.date}
                            onChange={handleInputChange}
                            className="px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                            <FaCalendarAlt className="text-slate-400 text-[11px]" />
                            {a.date || '-'}
                          </span>
                        )}
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="time"
                            name="time"
                            value={editData.time}
                            onChange={handleInputChange}
                            className="px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            <FaClock className="text-slate-400 text-[10px]" />
                            {a.time || '-'}
                          </span>
                        )}
                      </td>

                      {/* Room */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <select
                            name="room"
                            value={editData.room}
                            onChange={handleInputChange}
                            className="px-2 py-1 border border-slate-300 rounded text-xs"
                          >
                            <option value="Room 1">Room 1</option>
                            <option value="Room 2">Room 2</option>
                            <option value="Emergency">Emergency</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getRoomBadgeClass(
                              a.room
                            )}`}
                          >
                            <FaDoorOpen className="text-[10px]" />
                            {a.room || 'Room 1'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={saveAppointment}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                              title="Save Changes"
                            >
                              <FaSave />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleEditClick(a)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#003BC4] hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Appointment"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => deleteAppointment(a.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Appointment"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && filteredAppointments.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of{' '}
              {filteredAppointments.length} appointments
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-2 font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
