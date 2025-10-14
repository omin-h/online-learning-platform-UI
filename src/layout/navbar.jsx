import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../utils/logout';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  const adminMenuItems = [
    { label: 'All Courses', path: '/dashboard/all-courses' },
    { label: 'Courses', path: '/dashboard/course' },
    { label: 'Students', path: '/dashboard/students' },
    { label: 'Instructors', path: '/dashboard/instructors' },
    { label: 'Create Instructor', path: '/dashboard/create-instructor' },
    { label: 'Enrolls', path: '/dashboard/enrolls' }
  ];

  const studentMenuItems = [
    { label: 'Enroll Course', path: '/dashboard/enroll-course' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const onLogout = () => {
    handleLogout(navigate);
  };

  const menuItems = userRole === 'admin' ? adminMenuItems : studentMenuItems;

  return (
    <div className="sidebar">
      <div className="logo-container">
        <h2 className="logo">EduPlatform</h2>
      </div>
      
      <nav className="nav-menu">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="nav-button"
            onClick={() => handleNavClick(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;