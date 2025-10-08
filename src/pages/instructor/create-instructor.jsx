import React, { useState } from 'react';
import './create-instructor.css';

const CreateInstructor = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expertise: '',
    username: '',
    password: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Create new instructor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Convert expertise string to array
      const expertiseArray = formData.expertise.split(',').map(item => item.trim()).filter(item => item);
      
      const response = await fetch('http://localhost:3000/instructors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          expertise: expertiseArray,
          username: formData.username,
          password: formData.password
        }),
      });
      
      if (response.ok) {
        alert('Instructor created successfully!');
        resetForm();
      } else {
        alert('Failed to create instructor');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error creating instructor:', error);
      alert('Failed to create instructor');
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      expertise: '',
      username: '',
      password: '',
    });
  };

  return (
    <div className="create-instructor-container">
      <div className="create-instructor-header">
        <h2>Create New Instructor</h2>
      </div>

      <div className="instructor-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
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

          <div className="form-group">
            <label>Expertise *</label>
            <input
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              required
              placeholder="Enter expertise areas (comma separated, e.g., Networking, IME)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
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
              {loading ? 'Creating...' : 'Create Instructor'}
            </button>
            <button type="button" className="cancel-button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInstructor;