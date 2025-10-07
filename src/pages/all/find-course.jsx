import React, { useState } from 'react';
import './find-course.css';

const FindCourseById = () => {
  const [course, setCourse] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourseById = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/courses/${id}`);
      if (!response.ok) {
        throw new Error('Course not found');
      }
      const data = await response.json();
      setCourse(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setError(error.message);
      setCourse(null);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourseById(courseId);
  };

  return (
    <div className="find-course-container">
      <h2>Find Course by ID</h2>
      
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="number"
          className="course-id-search"
          placeholder="Enter Course ID..."
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {course && (
        <div className="course-details">
          <div className="course-details-header">
            <h3 className="course-title-row">
              {course.title}
              <span className="course-id-badge">ID: {course.id}</span>
            </h3>
          </div>
          
          <div className="course-details-body">
            <div className="detail-section">
              <h4>Description</h4>
              <p>{course.description}</p>
            </div>
            
            <div className="detail-section">
              <h4>Duration</h4>
              <p className="duration-text">{course.duration} hours</p>
            </div>

            {course.instructors && course.instructors.length > 0 && (
              <div className="detail-section">
                <h4>Instructors</h4>
                <div className="instructors-list">
                  {course.instructors.map((instructor, index) => (
                    <div key={index} className="instructor-card">
                      <div className="instructor-avatar">
                        {instructor.name.charAt(0)}
                      </div>
                      <div className="instructor-info">
                        <p className="instructor-name">{instructor.name}</p>
                        <p className="instructor-email">{instructor.email}</p>
                        {instructor.expertise && (
                          <p className="instructor-expertise">
                            {instructor.expertise.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !error && !course && courseId && (
        <div className="no-results">No course found with this ID.</div>
      )}
    </div>
  );
};

export default FindCourseById;