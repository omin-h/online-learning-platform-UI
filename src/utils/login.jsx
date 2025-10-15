import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import server_url from '../config/config.js';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Determine endpoint based on username
      const endpoint = formData.username === 'admin' 
        ? `${server_url}/auth/login/admin`
        : `${server_url}/auth/login/student`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save token and user data to localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') {
          navigate('/dashboard/all-courses');
        } else if (data.user.role === 'student') {
          navigate('/dashboard/enroll-course');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid username or password');
      }
      setLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please try again.');
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/create-student');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button 
            type="button" 
            className="create-account-button" 
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </form>

        <div className="login-footer">
          <p>Online Learning Platform</p>
        </div>
      </div>
    </div>
  );
};

export default Login;