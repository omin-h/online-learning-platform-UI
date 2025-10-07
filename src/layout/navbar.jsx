import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (topic) => {
    setActiveDropdown(activeDropdown === topic ? null : topic);
  };

  const menuItems = [
    {
      title: 'All',
      subtopics: [
        { label: 'All courses', path: '/all-courses' },
        { label: 'Courses by instructor', path: '/courses-by-instructor' },
        { label: 'Find a course', path: '/find-course' }
      ]
    },
    {
      title: 'Admin',
      subtopics: [
        { label: 'Courses', path: '/course' },

      ]
    },
    {
      title: 'Student',
      subtopics: ['Enrolled Courses', 'Progress Tracking']
    },
    {
      title: 'Instructor',
      subtopics: ['Course Creation', 'Student Assessment']
    }
  ];

  const handleSubtopicClick = (path) => {
    navigate(path);
    setActiveDropdown(null);
  }

  return (
    <div className="sidebar">
      <div className="logo-container">
        <h2 className="logo">EduPlatform</h2>
      </div>
      
      <nav className="nav-menu">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-item">
            <button 
              className="nav-button"
              onClick={() => toggleDropdown(item.title)}
            >
              <span>{item.title}</span>
              <span className={`arrow ${activeDropdown === item.title ? 'arrow-up' : 'arrow-down'}`}>
                ▼
              </span>
            </button>
            
            {activeDropdown === item.title && (
              <div className="dropdown">
                {item.subtopics.map((subtopic, subIndex) => {
                  if (typeof subtopic === 'object') {
                    return (
                      <button
                        key={subIndex}
                        className="dropdown-button"
                        onClick={() => handleSubtopicClick(subtopic.path)}
                      >
                        {subtopic.label}
                      </button>
                    );
                  } else {
                    return (
                      <button
                        key={subIndex}
                        className="dropdown-button"
                        // No navigation for string subtopics
                      >
                        {subtopic}
                      </button>
                    );
                  }
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;