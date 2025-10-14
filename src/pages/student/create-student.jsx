import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './create-student.css';

const CreateStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Create new student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          userName: formData.userName,
          password: formData.password,
          enrollmentDate: new Date().toISOString() // Current date
        }),
      });
      
      if (response.ok) {
        alert('Student account created successfully! Please login.');
        navigate('/');
      } else {
        alert('Failed to create student account');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Failed to create student account');
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      password: ''
    });
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="create-student-container">
      <div className="create-student-header">
        <h2>Register As Student</h2>
      </div>

      <div className="student-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
            <button type="button" className="cancel-button" onClick={handleBackToLogin}>
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;