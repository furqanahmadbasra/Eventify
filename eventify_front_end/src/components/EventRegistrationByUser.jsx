// EventRegistrationByUser.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import useEventStore from '../store/useEventStore';
import '../styles/EventRegistrationByUser.css';

const EventRegistrationByUser = () => {
  const { eventID } = useParams();
  const { eventResults } = useEventStore();

  const event = eventResults.find(e => e._id === eventID);

  if (!event) return <p>Event not found.</p>;

  const handleRegister = async () => {
    try {
      const response = await fetch(`https://eventify-ymsb.vercel.app/api/event/register/${event._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registered successfully!');
      } else {
        alert(result.message || 'Failed to register.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error registering user');
    }
  };

  return (
    <div className="event-registration-container">

      <div className="event-card-wrapper">
        <div className='event-header-title1'>Event Registration By User </div>
        <div className="event-header-title">{event.title}</div>

        <div className="event-main-content">
          <div className="event-left-panel">
            <img
              src={event.image}
              alt={event.title}
              className="event-image-flyer"
            />
          </div>

          <div className="event-middle-panel">
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>City:</strong> {event.city}</p>
            <p><strong>Country:</strong> {event.country}</p>
            <p><strong>Mode:</strong> {event.mode}</p>
            <p><strong>Skill Level:</strong> {event.skillLevel}</p>
            <p><strong>Event Type:</strong> {event.eventType}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Audience:</strong> {event.audience}</p>
          </div>

          <div className="event-right-panel">
            <div className="event-info-box">
              <p><strong>Seats:</strong> {event.seatsAvailable}</p>
              <p><strong>Price:</strong> ${event.price}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            </div>
            <button
              onClick={handleRegister}
              className="event-register-btn"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationByUser;
