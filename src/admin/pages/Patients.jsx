import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Patients.css';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchContacts = async () => {
    try {
      const res = await fetch('https://allrightdental.com/Backend_Dental/getContacts.php');
      const data = await res.json();
      setContacts(data.data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      const res = await fetch('https://allrightdental.com/Backend_Dental/deleteContact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (result.success) {
        fetchContacts();
      } else {
        alert(result.message || "Failed to delete contact.");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Server error occurred while deleting.");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const paginatedContacts = contacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="contacts-container bg-white p-6 rounded-xl shadow-md border border-gray-200">
 {/* Header Section */}
<div className="heading-container mb-8">
  <h1>
    <i className="bi bi-person-lines-fill text-white text-3xl"></i>
    Contact Messages
  </h1>
</div>


      <div className="table-wrapper">
        <table className="contacts-table text-sm border border-gray-300">
          <thead>
          <tr>
  <th className="p-3 border bg-[#00B7AA] text-black">Sr. No.</th>
  <th className="p-3 border bg-[#00B7AA] text-black">First Name</th>
  <th className="p-3 border bg-[#00B7AA] text-black">Last Name</th>
  <th className="p-3 border bg-[#00B7AA] text-black">Email</th>
  <th className="p-3 border bg-[#00B7AA] text-black">Phone</th>
  <th className="p-3 border bg-[#00B7AA] text-black">Message</th>
  <th className="p-3 border bg-[#00B7AA] text-black">Actions</th>
</tr>

          </thead>
          <tbody>
          {paginatedContacts.map((c, index) => (
  <tr key={c.id} className="transition-all duration-200 hover:bg-gray-50">
    <td className="border p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
    <td className="border p-3">{c.firstName}</td>
    <td className="border p-3">{c.lastName}</td>
    <td className="border p-3">{c.email}</td>
    <td className="border p-3">{c.phone}</td>
    <td className="border p-3">{c.message}</td>
    <td className="border p-3">
      <button
        onClick={() => deleteContact(c.id)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '600',
          backgroundColor: '#ffe5e5',
          color: '#661111',
          border: '1px solid #ff4d6d',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(255, 77, 109, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ffd6d6';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 77, 109, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ffe5e5';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 77, 109, 0.2)';
        }}
      >
        <i className="bi bi-trash-fill"></i> Delete
      </button>
    </td>
  </tr>
))}

            {contacts.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No contact messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination mt-4 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-btn"
          title="Previous"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          title="Next"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
      <footer className="admin-footer text-center text-light py-3">
  <div>&copy; {new Date().getFullYear()} Developed by TAGRAB LLC. All Rights Reserved.</div>
</footer>
    </div>
  );
}

export default Contacts;
