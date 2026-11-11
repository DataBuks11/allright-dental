import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";
import "../App.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/admin');
    }, 1200);
  };

  return (
    <>
      {/* Logout popup */}
      {showPopup && <div className="logout-popup">Logged out successfully!</div>}

      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i className="bi bi-list"></i>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <i className="bi bi-gear-fill sidebar-logo-icon"></i>
          <span className="admin-title animated-title">
            Allright Dental Admin
          </span>
        </div>

        <ul className="nav flex-column mb-auto">
          <li className="nav-item">
            <NavLink to="/admin/dashboard" className="nav-link" activeclassname="active">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/voice-receptionist" className="nav-link text-info fw-bold" activeclassname="active">
              <i className="bi bi-mic-fill me-2 text-info"></i> Voice AI Platform (Sarah)
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/registeredpatients" className="nav-link" activeclassname="active">
              <i className="bi bi-people-fill me-2"></i> Registered Patients
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/calendar" className="nav-link" activeclassname="active">
              <i className="bi bi-calendar-event me-2"></i> Calendar
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/appointments" className="nav-link" activeclassname="active">
              <i className="bi bi-calendar-check-fill me-2"></i> Appointments
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/patients" className="nav-link" activeclassname="active">
              <i className="bi bi-person-fill me-2"></i> Contacts
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/timing" className="nav-link" activeclassname="active">
              <i className="bi bi-clock-history me-2"></i> Time Slot Management
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/past-appointments" className="nav-link" activeclassname="active">
              <i className="bi bi-hourglass-split me-2"></i> Past Appointments
            </NavLink>
          </li>
        </ul>

        <hr />
        <button onClick={handleLogout} className="btn btn-outline-light w-100 mt-2">
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
