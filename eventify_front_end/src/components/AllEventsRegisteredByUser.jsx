import React, { useEffect, useState } from 'react';
import '../styles/AllEventsRegisteredByUser.css';
import ParticleBackground from './ParticleBackground'; // Import the ParticleBackground


const AllEventsRegisteredByUser = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://eventify-ymsb.vercel.app/api/event/registeredEventsByUser', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                    }
                });
                const data = await response.json();

                setEvents(data);

            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchEvents();
    }, []);

    const handleCancel = async (eventId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel registration?');
        if (!confirmCancel) return;

        console.log("we are truing to delte te data ")
        try {

            const response = await fetch(`https://eventify-ymsb.vercel.app/api/event/cancel-registration/${eventId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });

            console.log("the respoce is " , response)

            if (!response.ok) throw new Error('Cancel request failed');

            setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        } catch (error) {
            console.error('Error cancelling registration:', error);
            alert('Failed to cancel registration.');
        }
    };


    if (loading) return <p>Loading events...</p>;

    return (
        <div className="events-container">

                        <ParticleBackground />

            <h2 className="heading">Your Registered Events</h2>

            {events.length === 0 ? (
                <p className="no-events-message">No registered events found.</p>
            ) : (
                <div className="events-grid">
                    {events.map(event => (
                        <div key={event._id} className="event-card">
                            <div className="event-row">
                                <div className="event-image-container">
                                    <img
                                        className="event-image"
                                        src={event.image || 'https://via.placeholder.com/150x100'}
                                        alt="Event"
                                    />
                                </div>
                                <div className="event-details">
                                    <h3 className="event-title">{event.title}</h3>
                                    <p className="event-date">
                                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    <p className="event-description">{event.description}</p>
                                </div>
                            </div>
                            <button
                                className="cancel-button"
                                onClick={() => handleCancel(event._id)}
                            >
                                Cancel Registration
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

};

export default AllEventsRegisteredByUser;
