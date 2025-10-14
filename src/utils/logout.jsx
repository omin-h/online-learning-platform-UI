export const handleLogout = (navigate) => {
  // Clear all data from localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  
  // Navigate to login page
  navigate('/');
};