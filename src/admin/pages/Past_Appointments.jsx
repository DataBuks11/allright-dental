import React, { useEffect, useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FaHistory,
  FaSearch,
  FaFilePdf,
  FaCalendarAlt,
  FaClock,
  FaDoorOpen,
  FaSync
} from 'react-icons/fa';

const PastAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchPastAppointments();
  }, []);

  const fetchPastAppointments = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('https://allrightdental.com/Backend_Dental/getPastAppointments.php');
      const data = await res.json();
      setAppointments(data.data || []);
    } catch (err) {
      console.error('Failed to load past appointments:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
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
    doc.text('AllRight Dental - Historical Past Appointments Report', 14, 20);
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
      alert('No past appointments available to download.');
      return;
    }

    autoTable(doc, {
      startY: 33,
      head: headers,
      body: rows,
      theme: 'striped',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [11, 19, 43] },
    });

    doc.save('AllRight_Dental_Past_Appointments.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
            <FaHistory className="text-slate-500" />
            <span>Doctor Shalini Mandapatti, DDS • Clinical History & Archives</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Past Appointments & Encounter Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Archived records of completed patient encounters ({appointments.length} historical logs).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPastAppointments}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh database"
          >
            <FaSync className={`text-xs ${isRefreshing ? 'animate-spin text-[#003BC4]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <FaFilePdf className="text-sm" />
            <span>Export Archive PDF</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="relative w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search past records by patient name, date, time, or room..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#003BC4] focus:ring-1 focus:ring-[#003BC4] outline-none text-slate-800"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-slate-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-semibold">Loading past appointment archives...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FaHistory className="text-3xl text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No past appointment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Date of Birth</th>
                  <th className="py-3 px-4">Completed Date</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Operatory Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAppointments.map((a, index) => (
                  <tr key={a.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400 text-[11px]">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.firstName} {a.lastName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{a.dob || '-'}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <FaCalendarAlt className="text-slate-400 text-[11px]" />
                        {a.date || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{a.time || '-'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <FaDoorOpen className="text-[10px]" />
                        {a.room || 'Room 1'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredAppointments.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <p>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of{' '}
              {filteredAppointments.length} logs
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

export default PastAppointments;
