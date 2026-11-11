import React, { useState } from 'react';
import './Login.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'Allrightdental' && password === 'allrightdental25*') {
      setType('success');
      setPopup('Login Successful!');
      localStorage.setItem('isLoggedIn', 'true');
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1500);
    } else {
      setType('error');
      setPopup('Invalid Credentials!');
      setTimeout(() => setPopup(''), 2000);
    }
  };

  return (
    <div className="neon-login-container">
      {popup && (
        <div className={`neon-popup ${type}`}>{popup}</div>
      )}
      <form className="neon-login-box" onSubmit={handleSubmit}>
        <h2 className="neon-title"><i className="bi bi-hospital-fill me-2"></i>Admin Login</h2>
        <div className="neon-input-box">
          <input type="text" required value={username} onChange={e => setUsername(e.target.value)} />
          <label><i className="bi bi-person-fill"></i> Username</label>
        </div>
        <div className="neon-input-box">
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          <label><i className="bi bi-lock-fill"></i> Password</label>
        </div>
        <button className="neon-btn" type="submit">
  <i className="bi bi-box-arrow-in-right me-2"></i> Login
</button>

        {/* <div className="neon-cred">
          <small><b>Username:</b> dentaladmin</small><br />
          <small><b>Password:</b> admin123</small>
        </div> */}
      </form>
    </div>
  );
};

export default Login;
