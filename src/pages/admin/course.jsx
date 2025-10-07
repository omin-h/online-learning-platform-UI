import React, { useState, useEffect } from 'react';
import './course.css';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [page, setPage] = useState(1);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    instructorIds: ''
  });

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/courses?page=${page}&limit=5`);
      const data = await response.json();
      setCourses(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Create new course
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const instructorIdsArray = formData.instructorIds.split(',').map(id => parseInt(id.trim()));
      const response = await fetch('http://localhost:3000/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          duration: parseInt(formData.duration),
          instructorIds: instructorIdsArray
        }),
      });
      
      if (response.ok) {
        alert('Course created successfully!');
        resetForm();
        fetchCourses();
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  // Update course
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const instructorIdsArray = formData.instructorIds.split(',').map(id => parseInt(id.trim()));
      const response = await fetch(`http://localhost:3000/courses/${currentCourseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          duration: parseInt(formData.duration),
          instructorIds: instructorIdsArray
        }),
      });
      
      if (response.ok) {
        alert('Course updated successfully!');
        resetForm();
        fetchCourses();
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`http://localhost:3000/courses/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('Course deleted successfully!');
          fetchCourses();
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  // Edit button handler
  const handleEdit = (course) => {
    setEditMode(true);
    setShowForm(true);
    setCurrentCourseId(course.id);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration.toString(),
      instructorIds: course.instructors ? course.instructors.map(i => i.id).join(', ') : ''
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      instructorIds: ''
    });
    setShowForm(false);
    setEditMode(false);
    setCurrentCourseId(null);
  };

  return (
    <div className="course-container">
      <div className="course-header">
        <h2>Course Management</h2>
        <button 
          className="add-button"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

      {showForm && (
        <div className="course-form-container">
          <h3>{editMode ? 'Edit Course' : 'Create New Course'}</h3>
          <form onSubmit={editMode ? handleUpdate : handleCreate}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter course title"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter course description"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Duration (hours) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="Enter duration in hours"
              />
            </div>

            <div className="form-group">
              <label>Instructor IDs *</label>
              <input
                type="text"
                name="instructorIds"
                value={formData.instructorIds}
                onChange={handleChange}
                required
                placeholder="Enter instructor IDs (comma separated, e.g., 1, 2)"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editMode ? 'Update Course' : 'Create Course'}
              </button>
              <button type="button" className="cancel-button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="course-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Instructors</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.title}</td>
                    <td>{course.description}</td>
                    <td>{course.duration} hrs</td>
                    <td>
                      {course.instructors && course.instructors.length > 0
                        ? course.instructors.map(i => i.name).join(', ')
                        : 'N/A'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(course)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(course.id)}
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
              disabled={courses.length < 5}
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

export default Course;