import React, { useState } from 'react';

function LeftPanel({ advisors, investors, onProfileClick, loading }) {
  const [activeTab, setActiveTab] = useState('advisors');

  const renderProfiles = (profiles) => {
    if (loading) {
      return <p>Loading profiles...</p>;
    }

    if (profiles.length === 0) {
      return <p>No profiles available.</p>;
    }

    return profiles.map((profile) => (
      <div key={profile.email} className="card" onClick={() => onProfileClick(profile)}>
        <div className="card-body">
          <h5>{profile.fullName}</h5>
          <p className="text-muted">{profile.userType}</p>
          <p><small>Skills: {profile.skills?.join(', ') || 'None listed'}</small></p>
        </div>
      </div>
    ));
  };

  return (
    <div className="panel left-panel">
      <h3>Connect With</h3>
      <div className="tab-buttons">
        <button 
          className={`tab-button ${activeTab === 'advisors' ? 'active' : ''}`}
          onClick={() => setActiveTab('advisors')}
        >
          Advisors
        </button>
        <button 
          className={`tab-button ${activeTab === 'investors' ? 'active' : ''}`}
          onClick={() => setActiveTab('investors')}
        >
          Investors
        </button>
      </div>

      {activeTab === 'advisors' ? renderProfiles(advisors) : renderProfiles(investors)}
    </div>
  );
}

export default LeftPanel;