// src/components/RightPanel.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function RightPanel({ myStartups, onStartupClick }) {
  const navigate = useNavigate();

  return (
    <div className="panel right-panel">
      <button 
        className="btn btn-primary mb-4" 
        onClick={() => navigate('/create-startup')}
      >
        Create New Startup
      </button>

      <h4 className="mt-4">My Startups</h4>
      {myStartups.map(startup => (
        <div key={startup._id} className="card" onClick={() => onStartupClick(startup)}>
          <div className="card-body">
            <h5>{startup.name}</h5>
            <p>{startup.description}</p>
            <span className="badge bg-secondary">{startup.stage}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RightPanel;