import React, { useState, useEffect } from 'react';
import './enrolls.css';

const Enrolls = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(null);

  // Fetch all enrollments
  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/enroll');
      const data = await response.json();
      setEnrollments(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Approve enrollment
  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      const response = await fetch(`http://localhost:3000/enroll/${id}/approved`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        alert('Enrollment approved successfully!');
        fetchEnrollments();
      } else {
        alert('Failed to approve enrollment');
      }
      setProcessing(null);
    } catch (error) {
      console.error('Error approving enrollment:', error);
      alert('Failed to approve enrollment');
      setProcessing(null);
    }
  };

  // Reject enrollment
  const handleReject = async (id) => {
    setProcessing(id);
    try {
      const response = await fetch(`http://localhost:3000/enroll/${id}/rejected`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        alert('Enrollment rejected successfully!');
        fetchEnrollments();
      } else {
        alert('Failed to reject enrollment');
      }
      setProcessing(null);
    } catch (error) {
      console.error('Error rejecting enrollment:', error);
      alert('Failed to reject enrollment');
      setProcessing(null);
    }
  };

  // Unenroll (delete enrollment)
  const handleUnenroll = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      setProcessing(id);
      try {
        const response = await fetch(`http://localhost:3000/enroll/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('Enrollment deleted successfully!');
          fetchEnrollments();
        } else {
          alert('Failed to delete enrollment');
        }
        setProcessing(null);
      } catch (error) {
        console.error('Error deleting enrollment:', error);
        alert('Failed to delete enrollment');
        setProcessing(null);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'approved':
        return 'status-badge approved';
      case 'rejected':
        return 'status-badge rejected';
      case 'pending':
        return 'status-badge pending';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="enrolls-container">
      <div className="enrolls-header">
        <h2>Enrollment Requests</h2>
      </div>

      {loading ? (
        <div className="loading">Loading enrollments...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="enrolls-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Duration</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.id}</td>
                    <td>
                      {enrollment.student.firstName} {enrollment.student.lastName}
                    </td>
                    <td>{enrollment.student.email}</td>
                    <td>{enrollment.course.title}</td>
                    <td>{enrollment.course.duration} hrs</td>
                    <td>{formatDate(enrollment.enrollmentDate)}</td>
                    <td>
                      <span className={getStatusClass(enrollment.status)}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {enrollment.status === 'pending' && (
                          <>
                            <button 
                              className="approve-btn"
                              onClick={() => handleApprove(enrollment.id)}
                              disabled={processing === enrollment.id}
                            >
                              Approve
                            </button>
                            <button 
                              className="reject-btn"
                              onClick={() => handleReject(enrollment.id)}
                              disabled={processing === enrollment.id}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button 
                          className="unenroll-btn"
                          onClick={() => handleUnenroll(enrollment.id)}
                          disabled={processing === enrollment.id}
                        >
                          Unenroll
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {enrollments.length === 0 && !loading && (
            <div className="no-enrollments">No enrollment requests found.</div>
          )}
        </>
      )}
    </div>
  );
};

export default Enrolls;