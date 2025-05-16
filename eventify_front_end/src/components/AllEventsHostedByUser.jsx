

// export default AllEventsHostedByUser;
import React, { useEffect, useState } from 'react';
import "../styles/AllEventsHostedByUser.css";
import UpdateEventModal from './UpdateEventModal';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';

const AllEventsHostedByUser = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);

    const handleUpdate = (event) => {
        setEventToEdit(event);
        setIsModalOpen(true);
    };

    const fetchHostedEvents = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/event/hosted', {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });

            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching hosted events:', error);
        }
    };

    const handleDelete = async (eventId) => {
        try {
            await fetch(`http://localhost:5000/api/event/delete/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });

            setEvents(events.filter(event => event._id !== eventId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleSEEREGISTERED_USERS = (eventId) => {
        navigate(`/Hoster_seeing_all_register_users/${eventId}`);
    };

    useEffect(() => {
        fetchHostedEvents();
    }, []);

    return (
        <div className="events-container">
            <ParticleBackground />

            <h2 className="events-title">Your Hosted Events</h2>
            {events.length === 0 ? (
                <p>No hosted events found.</p>
            ) : (
                <div className="events-grid">
                    {events.map(event => (
                        <div key={event._id} className="event-card">
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-description">{event.description}</p>
                            <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>

                            <div className="button-group">
                                <div className="button-row">
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="btn-delete"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleUpdate(event)}
                                        className="btn-update"
                                    >
                                        Update
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleSEEREGISTERED_USERS(event._id)}
                                    className="btn-primary"
                                >
                                    See Registered Users
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && eventToEdit && (
                <UpdateEventModal
                    event={eventToEdit}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEventToEdit(null);
                    }}
                    onSave={(updatedEvent) => {
                        setEvents(events.map(ev => ev._id === updatedEvent._id ? updatedEvent : ev));
                        setIsModalOpen(false);
                        setEventToEdit(null);
                    }}
                />
            )}
        </div>
    );
};

export default AllEventsHostedByUser;
