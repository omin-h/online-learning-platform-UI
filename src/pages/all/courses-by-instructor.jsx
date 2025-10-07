import React, { useState, useEffect } from 'react';
import './courses-by-instructor.css';

const CoursesByInstructor = () => {
  const [courses, setCourses] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [instructorId, setInstructorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoursesByInstructor = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/courses/instructor/${id}`);
      if (!response.ok) {
        throw new Error('Instructor not found');
      }
      const data = await response.json();
      setCourses(data);
      
      // Extract instructor details from first course
      if (data.length > 0 && data[0].instructors && data[0].instructors.length > 0) {
        setInstructor(data[0].instructors[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.message);
      setCourses([]);
      setInstructor(null);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCoursesByInstructor(instructorId);
  };

  return (
    <div className="courses-by-instructor-container">
      <h2>Courses by Instructor</h2>
      
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="number"
          className="instructor-search"
          placeholder="Enter Instructor ID..."
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {instructor && (
        <div className="instructor-details">
          <div className="instructor-info">
            <div className="instructor-header">
              <div className="instructor-avatar">{instructor.name.charAt(0)}</div>
              <div>
                <h3>{instructor.name}</h3>
                <p className="instructor-email">{instructor.email}</p>
              </div>
            </div>
            <div className="instructor-meta">
              <div className="meta-item">
                <span className="meta-label">Username:</span>
                <span className="meta-value">{instructor.username}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Expertise:</span>
                <span className="meta-value">{instructor.expertise.join(', ')}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Total Courses:</span>
                <span className="meta-value">{courses.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {courses.length > 0 && (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3 className="course-title-row">
                  {course.title}
                  <span className="course-id-ball">{course.id}</span>
                </h3>
              </div>
              <div className="course-body">
                <p className="course-description">{course.description}</p>
                <div className="course-duration">
                  <span className="duration-label">Duration:</span>
                  <span className="duration-value">{course.duration} hours</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && courses.length === 0 && instructorId && (
        <div className="no-results">No courses found for this instructor.</div>
      )}
    </div>
  );
};

export default CoursesByInstructor;