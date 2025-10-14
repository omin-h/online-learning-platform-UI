import React, { useState, useEffect } from 'react';
import './instructors.css';

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentInstructorId, setCurrentInstructorId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expertise: '',
    username: ''
  });

  const token = localStorage.getItem('access_token');

  // Fetch all instructors
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/instructors?page=${page}&limit=5&search=${search}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setInstructors(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [page, search]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Update instructor
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/instructors/${currentInstructorId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          expertise: formData.expertise,
          username: formData.username
        }),
      });
      
      if (response.ok) {
        alert('Instructor updated successfully!');
        resetForm();
        fetchInstructors();
      }
    } catch (error) {
      console.error('Error updating instructor:', error);
      alert('Failed to update instructor');
    }
  };

  // Delete instructor
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        const response = await fetch(`http://localhost:3000/instructors/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          alert('Instructor deleted successfully!');
          fetchInstructors();
        }
      } catch (error) {
        console.error('Error deleting instructor:', error);
        alert('Failed to delete instructor');
      }
    }
  };

  // Edit button handler
  const handleEdit = (instructor) => {
    setShowForm(true);
    setCurrentInstructorId(instructor.id);
    setFormData({
      name: instructor.name,
      email: instructor.email,
      expertise: Array.isArray(instructor.expertise) ? instructor.expertise.join(', ') : instructor.expertise,
      username: instructor.username
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      expertise: '',
      username: ''
    });
    setShowForm(false);
    setCurrentInstructorId(null);
  };

  return (
    <div className="instructors-container">
      <div className="instructors-header">
        <h2>Instructor Management</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search instructors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="instructor-form-container">
          <h3>Edit Instructor</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter name"
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
                placeholder="Enter email"
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
                placeholder="Enter expertise (comma separated if multiple)"
              />
            </div>

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

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Update Instructor
              </button>
              <button type="button" className="cancel-button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading instructors...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="instructor-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Expertise</th>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => (
                  <tr key={instructor.id}>
                    <td>{instructor.id}</td>
                    <td>{instructor.name}</td>
                    <td>{instructor.email}</td>
                    <td>
                      {Array.isArray(instructor.expertise) 
                        ? instructor.expertise.join(', ') 
                        : instructor.expertise}
                    </td>
                    <td>{instructor.username}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(instructor)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(instructor.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
              className="page-button"
            >
              Previous
            </button>
            <span className="page-info">Page {page}</span>
            <button 
              onClick={() => setPage(page + 1)}
              disabled={instructors.length < 3}
              className="page-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Instructors;