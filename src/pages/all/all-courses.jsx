import React, { useState, useEffect } from 'react';
import './all-courses.css';

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    //Fetching courses from the backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:3000/courses?page=1&limit=6');
                const data = await response.json();
                setCourses(data.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // search function
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className="loading">Loading courses...</div>;
    }

    return (
        <div className="all-courses-container">
            <div className="all-courses-header">
                <h2>All Courses</h2>
                <input
                    type="text"
                    className="course-search"
                    placeholder="Search courses..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div className="courses-grid">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="course-card">
                        <div className="course-header">
                            <h3>{course.title}</h3>
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
        </div>
    );
};

export default AllCourses;