import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Navbar';
import './Dashboard.css'; 

const Dashboard = () => {
  const [time, setTime] = useState(new Date());
  const [counts, setCounts] = useState({
    appointments: 0,
    contacts: 0,
    patients: 0,
    slots: 0,
    calendar: 0
  });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch counts from backend
  useEffect(() => {
    fetch("https://allrightdental.com/Backend_Dental/dashboard_counts.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCounts(data.data);
        }
      })
      .catch(err => console.error("Error fetching counts:", err));
  }, []);

  const formatTime = (date) => date.toLocaleTimeString();
  const greeting = time.getHours() < 12
    ? 'Good Morning'
    : time.getHours() < 18
    ? 'Good Afternoon'
    : 'Good Evening';

  return (
    <div className="d-flex dashboard-container">
      <Sidebar />
      <div className="dashboard-content text-center animate-zoom-in">
        <h2 className="mb-3 text-white">
          <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
        </h2>
        <p className="lead text-light">{greeting}, Welcome to the <b>Allright Dental Clinic</b> Admin Panel</p>
        <p className="text-light mb-4" style={{ fontSize: '1.2rem' }}>{formatTime(time)}</p>

        {/* Row 1 - 3 Cards */}
        <div className="dashboard-cards d-flex justify-content-center gap-4 flex-wrap mb-4">
          {/* Appointments */}
          <div className="card-box glass-card">
            <h5><i className="bi bi-calendar-check-fill me-2 text-success"></i>Appointments</h5>
            <h2 className="text-light">{counts.appointments}</h2>
            <p className='text-light'>Manage all patient bookings</p>
            <Link to="/admin/appointments" className="btn btn-outline-success mt-2 text-light">Go</Link>
          </div>

          {/* Contacts */}
          <div className="card-box glass-card">
            <h5><i className="bi bi-person-lines-fill me-2 text-info"></i>Contacts</h5>
            <h2 className="text-light">{counts.contacts}</h2>
            <p className='text-light'>Review contact queries</p>
            <Link to="/admin/patients" className="btn btn-outline-info mt-2 text-light">Go</Link>
          </div>

          {/* Registered Patients */}
          <div className="card-box glass-card">
            <h5><i className="bi bi-people-fill me-2 text-warning"></i>Registered Patients</h5>
            <h2 className="text-light">{counts.patients}</h2>
            <p className='text-light'>View and manage registered patients</p>
            <Link to="/admin/registeredpatients" className="btn btn-outline-warning mt-2 text-light">Go</Link>
          </div>
        </div>

        {/* Row 2 - 2 Cards */}
        <div className="dashboard-cards d-flex justify-content-center gap-4 flex-wrap">
          {/* Time Slot */}
          <div className="card-box glass-card">
            <h5><i className="bi bi-clock-fill me-2 text-primary"></i>Time Slot Management</h5>
            <h2 className="text-light">{counts.slots}</h2>
            <p className='text-light'>Manage available appointment slots</p>
            <Link to="/admin/timing" className="btn btn-outline-primary mt-2 text-light">Go</Link>
          </div>

          {/* Calendar */}
          <div className="card-box glass-card">
            <h5><i className="bi bi-calendar3 me-2 text-danger"></i>Calendar</h5>
            <h2 className="text-light">{counts.slots}</h2>
            <p className='text-light'>View appointments on calendar</p>
            <Link to="/admin/calendar" className="btn btn-outline-danger mt-2 text-light">Go</Link>
          </div>

          {/* Past Appointments */}
          <div className="card-box glass-card">
            <h5>
            <i className="bi bi-hourglass-split me-2"></i>Past Appointments
           </h5>
           <h2 className="text-light">{counts.pastAppointments}</h2>
          <p className="text-light">View all completed or past appointments</p>
          <Link to="/admin/past-appointments" className="btn btn-outline-secondary mt-2 text-light">
          Go
          </Link>
         </div>
        </div>

        {/* Footer */}
        <footer className="admin-footer text-center text-light py-3 mt-auto">
          <div>&copy; {new Date().getFullYear()} Developed by TAGRAB LLC. All Rights Reserved.</div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
