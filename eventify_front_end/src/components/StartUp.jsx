import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LeftPanel from '../components/LeftPanel';
import MiddlePanel from '../components/MiddlePanel';
import RightPanel from '../components/RightPanel';
import ProfileDetail from '../components/ProfileDetail';
import StartupDetail from '../components/StartupDetail';
import CreateStartupPage from '../components/CreateStartupPage';
import '../styles/Startup.css';

function Startup() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showStartupDetail, setShowStartupDetail] = useState(false);
  const navigate = useNavigate();
  const [advisors, setAdvisors] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [myStartups, setMyStartups] = useState([]);
  const [AllStartups, setAllStartups] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);


  const [selectedRole, setSelectedRole] = useState(null);  // <-- add this



  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('https://eventify-ymsb.vercel.app/api/user/get_investors_advisors_profiles', {
          method: 'GET',  // or 'PUT' if updating
          headers: {
            "Content-Type": "application/json", // This tells the server we're sending JSON
            "auth-token": localStorage.getItem("token"),
          }
        });

        if (!response.ok) {
          console.log("we are doome")
        }
        const data = await response.json();

        // console.log(data);

        setAdvisors(data.advisors || []);
        setInvestors(data.investors || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoadingProfiles(false);
      }
    };

    const fetchStartups_OF_USER = async () => {

      try {
        const response = await fetch('https://eventify-ymsb.vercel.app/api/startup/fetchStartups_OF_USER', {
          method: 'GET',  // or 'PUT' if updating
          headers: {
            "Content-Type": "application/json", // This tells the server we're sending JSON
            "auth-token": localStorage.getItem("token"),
          }
        });

        if (!response.ok) {
          console.log("we are doome")
        }
        const data = await response.json();
        // console.log(data);
        setMyStartups(data.startups || []);

        // setAdvisors(data.advisors || []);
        // setInvestors(data.investors || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoadingProfiles(false);
      }

    };

    const fetchALLSTARTUPS = async () => {

      try {
        const response = await fetch('https://eventify-ymsb.vercel.app/api/startup/fetchOtherStartups', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json", // This tells the server we're sending JSON
            "auth-token": localStorage.getItem("token"),
          }
        });

        if (!response.ok) {
          console.log("we are doome")
        }
        const data = await response.json();
        // console.log(data);
        setAllStartups(data.startups || []);

      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoadingProfiles(false);
      }

    };

    fetchStartups_OF_USER();
    fetchALLSTARTUPS();
    fetchProfiles();
  }, []);



  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfile(true);
  };
  const handleStartupClick = (startup, userRole) => {
    setSelectedStartup(startup);
    setSelectedRole(userRole); // <-- track who clicked
    setShowStartupDetail(true);
  };



  return (
    <div className="app-container">
      {showProfile && (
        <ProfileDetail profile={selectedProfile} onClose={() => setShowProfile(false)} />
      )}

      {showStartupDetail && (
        <StartupDetail
          startup={selectedStartup}
          onClose={() => setShowStartupDetail(false)}
          userRole={selectedRole} // <-- pass role here
        />
      )}


      <Routes>
        <Route path="/" element={
          <div className="panels-container">
            <LeftPanel
              advisors={advisors}
              investors={investors}
              onProfileClick={handleProfileClick}
              loading={loadingProfiles}
            />
            <MiddlePanel
              startups={AllStartups}
              onStartupClick={(startup) => handleStartupClick(startup, "user")}
              userRole="user" // <--- sending an extra string
            />
            <RightPanel
              myStartups={myStartups}
              onStartupClick={(startup) => handleStartupClick(startup, "owner")}
              userRole="owner" // <--- sending an extra string
            />
          </div>
        } />
        <Route path="/create-startup" element={<CreateStartupPage />} />
      </Routes>
    </div>
  );
}

export default Startup;
