import React, { useState, useEffect } from 'react';
import './all-courses.css';

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);



    // Fetch instructors
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch('http://localhost:3000/instructors/instructor-courses');
                const data = await response.json();
                setInstructors(data || []);
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };

        fetchInstructors();
    }, []);


    // Fetch all courses
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/courses?page=${page}&limit=6`);
            const data = await response.json();
            if (page === 1) {
                setCourses(data.data || []);
            } else {
                 setCourses(prev => [...prev, ...(data.data || [])]);
             }
              setHasMore((data.data || []).length === 6);
              setLoading(false);
           } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
      fetchCourses();
    }, [page]);




    // Handle instructor filter change
    const handleInstructorChange = (e) => {
        const instructorId = e.target.value;
        setSelectedInstructor(instructorId);
        setPage(1);
        
        if (instructorId === '') {
            // Reset to all courses - refetch all courses
            fetchCourses();
        } else {
            // Filter courses by selected instructor
            const instructor = instructors.find(inst => inst.id === parseInt(instructorId));
            if (instructor) {
                setCourses(instructor.courseIds || []);
                setHasMore(false);
                setLoading(false);
            }
        }
    };



    // search function
    const filteredCourses = courses.filter(course =>
        course.id.toString().includes(search) ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
    );



    return (
        <div className="all-courses-container">
            <div className="all-courses-header">
                <h2>All Courses</h2>
                <div className="filter-controls">
                    <select 
                        className="instructor-filter"
                        value={selectedInstructor}
                        onChange={handleInstructorChange}
                    >
                        <option value="">All Instructors</option>
                        {instructors.map(instructor => (
                            <option key={instructor.id} value={instructor.id}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className="course-search"
                        placeholder="Search courses..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
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
                            <div className="course-duration">
                                <span className="duration-label">Duration:</span>
                                <span className="duration-value">{course.duration} hours</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredCourses.length === 0 && !loading && (
                <div className="no-courses">No courses found.</div>
            )}
            {hasMore && !loading && !selectedInstructor && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <button className="more-button" onClick={() => setPage(page + 1)}>
                        Load More
                    </button>
                </div>
            )}
            {loading && <div className="loading">Loading courses...</div>}
        </div>
    );
};

export default AllCourses;