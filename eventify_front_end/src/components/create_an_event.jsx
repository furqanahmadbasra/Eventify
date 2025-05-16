


import React, { useState } from 'react';
import '../styles/create_an_event.css';
import MapViewForEvent from './MapViewForEvent';
import { addEvent } from '../utils/addEvent';

const CreateAnEvent = () => {



  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    latitude: '',
    longitude: '',
    city: '',
    country: '',
    category: '',
    seatsAvailable: '',
    price: '',
    eventLink: '',
    contactInfo: '',
    image: null,
    is_online: false,
    eventType: '',
    skillLevel: '',
    audience: '',
    mode: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    // If the input is a file input, use files[0]
    const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    setEventData({
      ...eventData,
      [name]: newValue
    });
  };

  const handleMapClick = async (lat, lng) => {
    setEventData((prevData) => ({
      ...prevData,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    }));

    // Reverse geocoding to get city, country, and location
    const apiKey = '28c78ff8609a460893826748b2e6d0d1';
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
      );
      const data = await response.json();

      // console.log('Reverse Geocoding API Response:', data);

      if (data.results && data.results.length > 0) {
        const { city, country } = data.results[0].components;
        const formatted = data.results[0].formatted;
        // console.log('Formatted Address:', formatted);

        setEventData((prevData) => ({
          ...prevData,
          city: city || '',
          country: country || '',
          location: formatted || ''
        }));
      } else {
        console.error('No results found for reverse geocoding');
      }
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Submitted Event:', eventData);

    addEvent(eventData);

    setEventData({
      title: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      location: '',
      latitude: '',
      longitude: '',
      city: '',
      country: '',
      category: '',
      seatsAvailable: '',
      price: '',
      eventLink: '',
      contactInfo: '',
      image: null,
      is_online: false,
      eventType: '',
      skillLevel: '',
      audience: '',
      mode: '',
      host_user_id: ''
    });
  };

  // const today = new Date().toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  const max = maxDate.toISOString().split("T")[0];

  const today_ = new Date();
  const yyyy = today_.getFullYear();
const mm = String(today_.getMonth() + 1).padStart(2, '0');
const dd = String(today_.getDate()).padStart(2, '0');
const todayStr = `${yyyy}-${mm}-${dd}`;


  return (
    <div className="create-event-container">
      <h2 className="create-event-title">Create an Event</h2>
      <form onSubmit={handleSubmit} className="create-event-form">

        <input
          type="text"
          id="title"
          name="title"
          placeholder="Event title"
          value={eventData.title}
          onChange={handleChange}
          required
        />

        <textarea
          id="description"
          name="description"
          placeholder="Event description"
          value={eventData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Event Date:</label>
        {/* <input
          type="date"
          id="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
          min={today}
        /> */}

        <input
          type="date"
          id="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
          min={todayStr}
          max={max}
        />

        <label>Start Time:</label>
        <input
          type="time"
          id="time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          required
        />

        <label>End Time:</label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={eventData.endTime}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          id="location"
          name="location"
          placeholder="Location"
          value={eventData.location}
          onChange={handleChange}
          readOnly
        />

        <input
          type="text"
          id="latitude"
          name="latitude"
          placeholder="Latitude"
          value={eventData.latitude}
          onChange={handleChange}
          readOnly
        />

        <input
          type="text"
          id="longitude"
          name="longitude"
          placeholder="Longitude"
          value={eventData.longitude}
          onChange={handleChange}
          readOnly
        />

        <input
          type="text"
          id="city"
          name="city"
          placeholder="City"
          value={eventData.city}
          onChange={handleChange}
          readOnly
        />

        <input
          type="text"
          id="country"
          name="country"
          placeholder="Country"
          value={eventData.country}
          onChange={handleChange}
          readOnly
        />

        <div className="map-container">
          <MapViewForEvent onMapClick={handleMapClick} />
        </div>

        <select
          id="category"
          name="category"
          value={eventData.category}
          onChange={handleChange}
          required
        >
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

        <input
          type="number"
          id="seatsAvailable"
          name="seatsAvailable"
          placeholder="Seats Available"
          value={eventData.seatsAvailable}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          id="price"
          name="price"
          placeholder="Price (in USD)"
          value={eventData.price}
          onChange={handleChange}
          required
          min="0"
        />

        <select
          id="eventType"
          name="eventType"
          value={eventData.eventType}
          onChange={handleChange}
          required
        >
          <option value="">Select Event Type</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Seminar">Seminar</option>
          <option value="Workshop">Workshop</option>
          <option value="Conference">Conference</option>
          <option value="Webinar">Webinar</option>
          <option value="Bootcamp">Bootcamp</option>
          <option value="Tech Talk">Tech Talk</option>
        </select>

        <select
          id="skillLevel"
          name="skillLevel"
          value={eventData.skillLevel}
          onChange={handleChange}
          required
        >
          <option value="">Select Skill Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          id="audience"
          name="audience"
          value={eventData.audience}
          onChange={handleChange}
          required
        >
          <option value="">Select Audience</option>
          <option value="Students">Students</option>
          <option value="Professionals">Professionals</option>
          <option value="Startups">Startups</option>
          <option value="Researchers">Researchers</option>
          <option value="Entrepreneurs">Entrepreneurs</option>
          <option value="Investors">Investors</option>
        </select>

        <select
          id="mode"
          name="mode"
          value={eventData.mode}
          onChange={handleChange}
          required
        >
          <option value="">Select Mode</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <input
          type="text"
          id="eventLink"
          name="eventLink"
          placeholder="Event Link"
          value={eventData.eventLink}
          onChange={handleChange}
        />
        <input
          type="text"
          id="contactInfo"
          name="contactInfo"
          placeholder="Contact Info"
          value={eventData.contactInfo}
          onChange={handleChange}
        />
        <label>Upload Event Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
          accept="image/*"
        />
        <input
          type="hidden"
          name="host_user_id"
          value={eventData.host_user_id}
        />
        <button type="submit" className="create-event-button">Create Event</button>
      </form>
    </div>
  );
};

export default CreateAnEvent;
