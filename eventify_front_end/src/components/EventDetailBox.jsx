// EventDetailBox.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EventDetailBox.css';

const EventDetailBox = ({ event }) => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate(`/event-register/${event._id}`);
  };

  if (!event) {
    return <div>No event data available</div>;
  }
  
  const detailsBeforeLocation = `${event.description}. It is scheduled on ${new Date(event.date).toLocaleDateString()} and concludes at ${event.endTime}. It is a ${event.eventType} event designed for ${event.audience}.`;
  const locationDetails = `The event will take place at ${event.location} in ${event.city}, ${event.country} (coordinates: ${event.latitude}, ${event.longitude}).`;
  
  return (
    <div className="event-detail-box">
      <div className="event-detail-container">
        <div className="event-detail-image">
          <img
            src={event.image}
            alt={event.title}
          />
        </div>
        <div className="event-detail-info">
          <h3>{event.title}</h3>
          <p className="event-details">
            {detailsBeforeLocation}
            <br /><br />
            {locationDetails}
          </p>
          <button className="register-button" onClick={handleRegisterClick}>
            Wanna Register?
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailBox;
