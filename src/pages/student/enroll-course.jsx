import React, { useState, useEffect } from 'react';
import './enroll-course.css';

const EnrollCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/courses?page=${page}&limit=6`);
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

  // Handle enrollment
  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      const response = await fetch('http://localhost:3000/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseId,
          studentId: 1, // Fixed student ID
          enrollmentDate: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        alert('Successfully enrolled in the course!');
        // Add course to enrolled set
        setEnrolledCourses(prev => new Set([...prev, courseId]));
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to enroll in course');
      }
      setEnrolling(null);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
      setEnrolling(null);
    }
  };

  // Check if course is enrolled
  const isEnrolled = (courseId) => enrolledCourses.has(courseId);

  // Search function
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.description.toLowerCase().includes(search.toLowerCase())
  );

  // Get button text and class
  const getButtonText = (courseId) => {
    if (enrolling === courseId) return 'Enrolling...';
    if (isEnrolled(courseId)) return 'Pending';
    return 'Enroll Now';
  };

  const getButtonClass = (courseId) => {
    if (isEnrolled(courseId)) return 'enroll-button pending';
    return 'enroll-button';
  };

  return (
    <div className="enroll-course-container">
      <div className="enroll-course-header">
        <h2>Available Courses</h2>
        <input
          type="text"
          className="course-search"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <>
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3 className="course-title-row">
                    {course.title}
                    <span className="course-id-ball">{course.id}</span>
                  </h3>
                </div>
                
                <div className="course-body">
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-info">
                    <div className="course-duration">
                      <span className="duration-label">Duration:</span>
                      <span className="duration-value">{course.duration} hours</span>
                    </div>
                    
                    {course.instructors && course.instructors.length > 0 && (
                      <div className="course-instructors">
                        <span className="instructors-label">Instructors:</span>
                        <span className="instructors-value">
                          {course.instructors.map(i => i.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="course-footer">
                  <button 
                    className={getButtonClass(course.id)}
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolling === course.id || isEnrolled(course.id)}
                  >
                    {getButtonText(course.id)}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && !loading && (
            <div className="no-courses">No courses found.</div>
          )}

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
              disabled={courses.length < 6}
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

export default EnrollCourse;