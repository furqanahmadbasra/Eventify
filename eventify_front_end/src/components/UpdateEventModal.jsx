import React, { useState } from 'react';
import '../styles/update_event_modal.css';
import MapViewForEvent from './MapViewForEvent';

const UpdateEventModal = ({ event, onClose, onSave }) => {
    const [updatedEvent, setUpdatedEvent] = useState({ ...event });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
        setUpdatedEvent({ ...updatedEvent, [name]: newValue });
    };

    const handleMapClick = async (lat, lng) => {
        setUpdatedEvent((prevData) => ({
            ...prevData,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
        }));

        const apiKey = '28c78ff8609a460893826748b2e6d0d1';
        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { city, country } = data.results[0].components;
                const formatted = data.results[0].formatted;

                setUpdatedEvent((prevData) => ({
                    ...prevData,
                    city: city || '',
                    country: country || '',
                    location: formatted || ''
                }));
            }
        } catch (error) {
            console.error('Error during reverse geocoding:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = { ...updatedEvent };
            if (body.image instanceof File) {
                const base64 = await toBase64(body.image);
                body.image = base64;
            }

            const response = await fetch(`https://eventify-ymsb.vercel.app/api/event/update_The_Event/${event._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            onSave(data);
            onClose();
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Update Event</h2>

                <div className="update-event-form">
                    <input type="text" name="title" value={updatedEvent.title} onChange={handleChange} required />
                    <textarea name="description" value={updatedEvent.description} onChange={handleChange} required />

                    {/* <input type="date" name="date" value={updatedEvent.date} onChange={handleChange} required /> */}
                    <input
                        type="date"
                        value={updatedEvent.date ? new Date(updatedEvent.date).toISOString().split("T")[0] : ""}
                        onChange={handleChange} required 
                    />
                    <input type="time" name="time" value={updatedEvent.time} onChange={handleChange} required />
                    <input type="time" name="endTime" value={updatedEvent.endTime} onChange={handleChange} required />

                    <input type="text" name="location" value={updatedEvent.location} readOnly />
                    <input type="text" name="latitude" value={updatedEvent.latitude} readOnly />
                    <input type="text" name="longitude" value={updatedEvent.longitude} readOnly />
                    <input type="text" name="city" value={updatedEvent.city} readOnly />
                    <input type="text" name="country" value={updatedEvent.country} readOnly />

                    <MapViewForEvent onMapClick={handleMapClick} />

                    <select name="category" value={updatedEvent.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option value="Tech">Tech</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Blockchain">Blockchain</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                    </select>

                    <input type="number" name="seatsAvailable" value={updatedEvent.seatsAvailable} onChange={handleChange} required />
                    <input type="number" name="price" value={updatedEvent.price} onChange={handleChange} required min="0" />

                    <select name="eventType" value={updatedEvent.eventType} onChange={handleChange} required>
                        <option value="">Select Event Type</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Conference">Conference</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Bootcamp">Bootcamp</option>
                        <option value="Tech Talk">Tech Talk</option>
                    </select>

                    <select name="skillLevel" value={updatedEvent.skillLevel} onChange={handleChange} required>
                        <option value="">Select Skill Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>

                    <select name="audience" value={updatedEvent.audience} onChange={handleChange} required>
                        <option value="">Select Audience</option>
                        <option value="Students">Students</option>
                        <option value="Professionals">Professionals</option>
                        <option value="Startups">Startups</option>
                        <option value="Researchers">Researchers</option>
                        <option value="Entrepreneurs">Entrepreneurs</option>
                        <option value="Investors">Investors</option>
                    </select>

                    <select name="mode" value={updatedEvent.mode} onChange={handleChange} required>
                        <option value="">Select Mode</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>

                    <input type="text" name="eventLink" placeholder="Event Link" value={updatedEvent.eventLink} onChange={handleChange} />
                    <input type="text" name="contactInfo" placeholder="Contact Info" value={updatedEvent.contactInfo} onChange={handleChange} />

                    <label>
                        Online Event:
                        <input type="checkbox" name="is_online" checked={updatedEvent.is_online} onChange={handleChange} />
                    </label>

                    <input type="file" name="image" onChange={handleChange} accept="image/*" />

                    <button onClick={handleSubmit}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateEventModal;