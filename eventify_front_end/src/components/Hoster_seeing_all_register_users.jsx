// export default Hoster_seeing_all_register_users;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/Hoster_seeing_all_register_users.css";

const Hoster_seeing_all_register_users = () => {
  const { eventId } = useParams();
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const res = await fetch(`https://eventify-ymsb.vercel.app/api/event/AllRegisteredUsers/${eventId}`, {
          headers: {
            'auth-token': localStorage.getItem('token'),
          },
        });

        if (!res.ok) throw new Error('Failed to fetch registered users');

        const data = await res.json();
        setRegisteredUsers(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRegisteredUsers();
  }, [eventId]);

  const filteredUsers = registeredUsers.filter((user) => {
    const fullName = user?.profile?.fullName || '';
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <p className="registered-users-loading">Loading...</p>;
  if (error) return <p className="registered-users-error">Error: {error}</p>;

  return (
    <div className="registered-users-outer">
      <div className="registered-users-container">
        <h2 className="registered-users-heading">Users Registered for Event</h2>
        <p className="registered-users-info">Total Registered Users: {registeredUsers.length}</p>

        <input
          type="text"
          placeholder="Search by name or email..."
          className="registered-users-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="registered-users-table-wrapper">
          <table className="registered-users-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={user?.profile?.profilePic || 'https://via.placeholder.com/60'}
                      alt="Profile"
                      className="registered-users-img"
                    />
                  </td>
                  <td>{user?.profile?.fullName || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt || Date.now()).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hoster_seeing_all_register_users;
