import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../components/Navbar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Registeredpatients.css';

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('https://allrightdental.com/Backend_Dental/getAppointments.php');
    const data = await res.json();
    setAppointments(data.data || []);
  };

  const deleteAppointment = async (id) => {
    await fetch(`https://allrightdental.com/Backend_Dental/deleteAppointment.php?id=${id}`);
    fetchAppointments();
  };

  const handleEditClick = (appointment) => {
    setEditId(appointment.id);
    setEditData({
      id: appointment.id,
      firstName: appointment.first_name,
      lastName: appointment.last_name,
      dob: appointment.dob,
      email: appointment.email,
      phone: appointment.phone
    });
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveAppointment = async () => {
    await fetch('https://allrightdental.com/Backend_Dental/getAppointments.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setEditId(null);
    setEditData({});
    fetchAppointments();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Registration Report', 14, 22);

    const headers = [['Sr. No.', 'First Name', 'Last Name', 'DOB', 'Email', 'Phone']];
    const rows = filteredAppointments.map((a, index) => [
      index + 1,
      a.first_name,
      a.last_name,
      a.dob,
      a.email,
      a.phone
    ]);

    if (rows.length === 0) {
      alert("No appointments available to download.");
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

    doc.save('Registered Patients.pdf');
  };

  const filteredAppointments = appointments.filter((a) => {
    const fullName = (a.first_name + " " + a.last_name).toLowerCase();
    const search = searchTerm.toLowerCase();
  
    return (
      a.first_name.toLowerCase().includes(search) ||   // check first name
      a.last_name.toLowerCase().includes(search) ||    // check last name
      fullName.includes(search) ||                     // check full name
      a.email.toLowerCase().includes(search) ||        // check email
      a.phone.toString().includes(search)              // check phone
    );
  });
  


  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="appointments-container flex-1 p-6 mt-4">
      <div className="appointments-bg min-h-screen flex flex-col">
        <div className="heading-container">
        <h1><i className="bi bi-person-check-fill text-white text-3xl"></i> Registered Patients</h1>

        </div>

        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

{/* Search and Filters */}
<div className="search-bar flex items-center justify-between flex-wrap gap-4 mb-4 w-full">
  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
    Number of Records :
    <select
      className="border border-gray-300 rounded px-2 py-1"
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
    >
      <option value={25}>25</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
  </label>

  <input
    type="text"
    placeholder="Search by fullname, email or phone"
    className="border border-gray-300 rounded px-3 py-2 w-64"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <button
    onClick={downloadPDF}
    className="px-4 py-2 rounded bg-[#00B7AA] text-white hover:bg-[#009e96]"
  >
    <i className="bi bi-file-earmark-arrow-down-fill"></i> Download PDF
  </button>
</div>

{/* Table */}
<div className="table-wrapper max-h-[300px] overflow-y-auto overflow-x-auto border border-gray-300 rounded-md">
  <table className="w-full text-sm text-center border-collapse">
    {/* Table Head */}
    <thead className="bg-[#00B7AA] text-white sticky top-0">
      <tr>
        <th className="p-3 border w-[60px]">Sr. No.</th>
        <th className="p-3 border w-[140px]">First Name</th>
        <th className="p-3 border w-[140px]">Last Name</th>
        <th className="p-3 border w-[140px]">DOB</th>
        <th className="p-3 border w-[260px]">Email</th>
        <th className="p-3 border w-[160px]">Phone</th>
        <th className="p-3 border w-[200px]">Actions</th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody>
      {paginatedAppointments.map((a, index) => (
        <tr key={a.id} className="hover:bg-gray-50">
          {/* Serial Number */}
          <td className="p-2 border">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>

          {/* First Name */}
          <td className="p-2 border">
            {editId === a.id ? (
              <input
                name="firstName"
                value={editData.firstName}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              a.first_name
            )}
          </td>

          {/* Last Name */}
          <td className="p-2 border">
            {editId === a.id ? (
              <input
                name="lastName"
                value={editData.lastName}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              a.last_name
            )}
          </td>

          {/* DOB */}
          <td className="p-2 border">
            {editId === a.id ? (
              <input
                type="date"
                name="dob"
                value={editData.dob}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              a.dob
            )}
          </td>

          {/* Email */}
          <td className="p-2 border text-left">
            {editId === a.id ? (
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              <span className="break-words">{a.email}</span>
            )}
          </td>

          {/* Phone */}
          <td className="p-2 border">
            {editId === a.id ? (
              <input
                name="phone"
                value={editData.phone}
                onChange={handleInputChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              <span className="whitespace-nowrap">{a.phone}</span>
            )}
          </td>

          {/* Actions */}
          <td className="p-2 border text-center">
  {editId === a.id ? (
    <button
      onClick={saveAppointment}
      className="flex items-center gap-1 bg-green-200 hover:bg-green-300 px-3 py-1 rounded"
    >
      <i className="bi bi-check-circle"></i> Save
    </button>
  ) : (
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => handleEditClick(a)}
        className="flex items-center gap-1 bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded"
      >
        <i className="bi bi-pencil-square"></i> Edit
      </button>
      <button
        onClick={() => deleteAppointment(a.id)}
        className="flex items-center gap-1 bg-red-200 hover:bg-red-300 px-3 py-1 rounded"
      >
        <i className="bi bi-trash"></i> Delete
      </button>
    </div>
  )}
</td>

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

export default Appointments;
