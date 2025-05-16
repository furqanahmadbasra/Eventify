// Eventlookup.jsx
import React from 'react';
import Filterpanel from './Filterpanel';
import MapView from './MapView';
import Eventcrousal from './Eventcrousal';
import EventDetail from './EventDetail';

const Eventlookup = () => {
  return (
    <div className="filterOptionsArea">
      <Filterpanel />
      <Eventcrousal />
      <EventDetail /> {/* EventDetail is displayed when the panel is open */}
      <div className="App">
        <MapView /> {/* MapView component with interactive markers */}
      </div>
    </div>
  );
};

export default Eventlookup;
