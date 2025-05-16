import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiZap, FiUser, FiPlus, FiLogOut } from 'react-icons/fi';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Left Side - Brand & Main Nav */}
      <div className="nav-left">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          Eventify
        </div>

        {isLoggedIn && (
          <div className="main-nav">
            <NavButton icon={<FiHome />} path="/home" label="Home" />
            <NavButton icon={<FiCalendar />} path="/eventlookup" label="Events" />
            <NavButton icon={<FiZap />} path="/startup" label="Startups" />
          </div>
        )}
      </div>

      {/* Right Side - Auth/Profile */}
      <div className="nav-right">
        {isLoggedIn ? (
          <>
            <div 
              className="profile-circle"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <FiUser className="profile-icon" />
            </div>

            {/* Profile Side Menu */}
            <div className={`profile-menu ${isProfileMenuOpen ? 'open' : ''}`}>
              <ProfileMenuItem icon={<FiPlus />} path="/host_an_event" label="Create Event" />
              <ProfileMenuItem icon={<FiCalendar />} path="/AllEventsRegisteredByUser" label="My Events" />
              <ProfileMenuItem icon={<FiCalendar />} path="/AllEventsHostedByUser" label="My Hosted Events" />
              <ProfileMenuItem icon={<FiUser />} path="/profile" label="My Profile" />
              <div className="menu-divider"></div>
              <button className="menu-item logout" onClick={handleLogout}>
                <FiLogOut className="icon" />
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <NavButton path="/login" label="Get Started" isPrimary />
          </div>
        )}
      </div>
    </nav>
  );
};

// Reusable Components
const NavButton = ({ icon, path, label, isPrimary = false }) => {
  return (
    <Link 
      to={path} 
      className={`nav-button ${isPrimary ? 'primary' : ''}`}
    >
      {icon && <span className="icon">{icon}</span>}
      <span className="label">{label}</span>
    </Link>
  );
};

const ProfileMenuItem = ({ icon, path, label }) => {
  return (
    <Link to={path} className="menu-item">
      <span className="icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;