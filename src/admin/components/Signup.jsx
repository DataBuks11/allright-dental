import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Signup', formData);
    // Add your signup logic
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Admin Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name:</label>
          <input type="text" name="name" className="form-control" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input type="email" name="email" className="form-control" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input type="password" name="password" className="form-control" required onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
        <p className="mt-3">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
