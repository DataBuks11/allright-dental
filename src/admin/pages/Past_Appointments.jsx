import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../components/Navbar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Appointments.css';

const PastAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // fixed, since dropdown removed

  useEffect(() => {
    fetchPastAppointments();
  }, []);

  const fetchPastAppointments = async () => {
    const res = await fetch('https://allrightdental.com/Backend_Dental/getPastAppointments.php');
    const data = await res.json();
    setAppointments(data.data || []);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Past Appointments Report', 14, 22);

    const headers = [['Sr. No.', 'First Name', 'Last Name', 'DOB', 'Date', 'Time', 'Room']];

    const rows = filteredAppointments.map((a, index) => [
      index + 1,
      a.firstName,
      a.lastName,
      a.dob,
      a.date,
      a.time,
      a.room,
    ]);

    if (rows.length === 0) {
      alert('No past appointments available to download.');
      return;
    }

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: rows,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 183, 170] },
    });

    doc.save('Past_Appointments.pdf');
  };

  const filteredAppointments = appointments.filter((a) =>
    (a.firstName + ' ' + a.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.dob && a.dob.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.date && a.date.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.time && a.time.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.room && a.room.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="appointments-container flex-1 bg-gray-50 p-6 mt-4">
      <div className="appointments-bg min-h-screen flex flex-col">
        
        {/* Heading */}
        <div className="heading-container">
          <h1> <i className="bi bi-hourglass-split me-2"></i> Past Appointments</h1>
        </div>

        <div className="flex flex-1">
          <Sidebar />

          <div className="flex-1 p-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

              {/* Search + PDF */}
              <div className="search-bar flex items-center justify-between flex-wrap gap-4 mb-4 w-full">

                <input
                  type="text"
                  placeholder="Search by name, date, time, or room"
                  className="border border-gray-300 rounded px-3 py-2 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 rounded bg-[#00B7AA] text-white hover:bg-[#009e96] flex items-center gap-2"
                >
                  <i className="bi bi-file-earmark-arrow-down-fill"></i>
                  Download PDF
                </button>
              </div>

              {/* Table */}
              <div className="table-wrapper max-h-[300px] overflow-y-auto overflow-x-auto border border-gray-300 rounded-md">
                <table className="w-full text-sm text-center border-collapse">
                  <thead className="bg-[#00B7AA] text-white sticky top-0">
                    <tr>
                      <th className="p-3 border w-[60px]">Sr. No.</th>
                      <th className="p-3 border w-[150px]">First Name</th>
                      <th className="p-3 border w-[150px]">Last Name</th>
                      <th className="p-3 border w-[140px]">DOB</th>
                      <th className="p-3 border w-[160px]">Date</th>
                      <th className="p-3 border w-[140px]">Time</th>
                      <th className="p-3 border w-[140px]">Room</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedAppointments.map((a, index) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-2 border">{a.firstName}</td>
                        <td className="p-2 border">{a.lastName}</td>
                        <td className="p-2 border">{a.dob}</td>
                        <td className="p-2 border">{a.date}</td>
                        <td className="p-2 border">{a.time}</td>
                        <td className="p-2 border">{a.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </div>

      <footer className="admin-footer text-center text-light py-3">
        <div>&copy; {new Date().getFullYear()} Developed by TAGRAB LLC. All Rights Reserved.</div>
      </footer>
    </div>
  );
};

export default PastAppointments;
