import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar"
import Signup from "./components/signup"
import Login from './components/login';
import Eventlookup from './components/Eventlookup';
import EventRegistrationByUser from "./components/EventRegistrationByUser"
import HostAnEvent from './components/host_an_event';
import CreateAnEvent from './components/create_an_event';
import Profile from "./components/Profile";
import AllEventsRegisteredByUser from './components/AllEventsRegisteredByUser';
import AllEventsHostedByUser from './components/AllEventsHostedByUser';
import Heropage from "./components/Heropage";
import Home from './components/Home';
import StartUp from './components/StartUp';
import CreateStartupPage from './components/CreateStartupPage';
import Hoster_seeing_all_register_users from './components/Hoster_seeing_all_register_users';
// import ParticleBackground from "./components/ParticleBackground";

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        {/* <ParticleBackground /> */}
        {/* <Heropage /> */}
        <Routes>
          <Route exact path="/" element={<Heropage />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/eventlookup" element={<Eventlookup />} />
          <Route path="/event-register/:eventID" element={<EventRegistrationByUser />} />
          <Route path="/host_an_event" element={<HostAnEvent />} />
          <Route path="/create_an_event" element={<CreateAnEvent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/AllEventsRegisteredByUser" element={<AllEventsRegisteredByUser />} />
          <Route path="/AllEventsHostedByUser" element={<AllEventsHostedByUser />} />
          <Route exact path="/startup" element={<StartUp />} />
          <Route exact path="/create-startup" element={<CreateStartupPage />} />
          <Route exact path="/Hoster_seeing_all_register_users/:eventId" element={<Hoster_seeing_all_register_users/>} />

        </Routes>
      </Router>
    </>
  );
};

export default App;

