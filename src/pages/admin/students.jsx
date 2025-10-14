import React, { useState, useEffect } from 'react';
import './students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    enrollmentDate: ''
  });


  const token = localStorage.getItem('access_token');

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/students?page=${page}&limit=5&search=${search}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      });
      const data = await response.json();
      setStudents(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Update student
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/students/${currentStudentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          userName: formData.userName,
          enrollmentDate: formData.enrollmentDate
        }),
      });
      
      if (response.ok) {
        alert('Student updated successfully!');
        resetForm();
        fetchStudents();
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student');
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`http://localhost:3000/students/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          alert('Student deleted successfully!');
          fetchStudents();
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  // Edit button handler
  const handleEdit = (student) => {
    setShowForm(true);
    setCurrentStudentId(student.id);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      userName: student.userName,
      enrollmentDate: student.enrollmentDate ? student.enrollmentDate.split('T')[0] : ''
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      enrollmentDate: ''
    });
    setShowForm(false);
    setCurrentStudentId(null);
  };

  return (
    <div className="students-container">
      <div className="students-header">
        <h2>Student Management</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="student-form-container">
          <h3>Edit Student</h3>
          <form onSubmit={handleUpdate}>
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
              <label>Enrollment Date *</label>
              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Update Student
              </button>
              <button type="button" className="cancel-button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Enrollment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.userName}</td>
                    <td>{student.enrollmentDate}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(student.id)}
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
              disabled={students.length < 10}
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

export default Students;