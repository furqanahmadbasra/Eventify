import React from 'react';

function MiddlePanel({ startups, onStartupClick }) {
  return (
    <div className="panel middle-panel">
      <h3>Startup Listings</h3>
      <div className="startup-list">
        {startups.map(startup => (
          <div key={startup._id} className="card" onClick={() => onStartupClick(startup)}>
            <div className="card-body">
              <h5>{startup.name}</h5>
              <p>{startup.description}</p>
              <span className="badge bg-primary">{startup.stage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiddlePanel;