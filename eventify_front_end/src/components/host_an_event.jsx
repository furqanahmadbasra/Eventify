import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/host_an_event.css';

const HostAnEvent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create_an_event');
  };

  return (
    <div className="host-event-container">
      <div className="overlay"></div>
      
      <div className="host-event-content">
        <h1>Host Your Own Event</h1>
        <p>
          Transform your ideas into unforgettable experiences. Whether you're planning a chic local meetup or an innovative virtual conference, our platform is designed for creators who demand excellence.
        </p>
        <p>
          With our intuitive event creation form, you can quickly set up your event by entering just a few details – from the event title, description, and schedule, to an automatically generated location using an interactive map.
        </p>
        <button className="create-event-button" onClick={handleClick}>
          Create Event
        </button>

               <div className="host-event-features">
          <h2>Experience Our Exclusive Features</h2>
          <div className="features-gallery">
            <img
              src="https://img.freepik.com/free-vector/gift-shopping-checklist-girl-cartoon-character-buying-presents-online-e-commerce-gift-card-promotion-birthday-anniversary-bonus-vector-isolated-concept-metaphor-illustration_335657-1282.jpg?t=st=1746902802~exp=1746906402~hmac=317ecff9641ae44ae2fb4b9ad4d873845b743867f17d9a4a7685e33c144e13f9&w=826"
              alt="Seamless Event Creation"
            />
            <img
              src="https://media.istockphoto.com/id/2172856677/photo/time-and-business-management-target-time-reduce-concept-business-woman-show-virtual-clock-in.jpg?s=1024x1024&w=is&k=20&c=4fkC1IEfko8UMB2P-exBpkmxWBzwHcJ5r2ZmG49E-wc="
              alt="Real-Time Management"
            />
            <img
              src="https://jaro-website.s3.ap-south-1.amazonaws.com/2023/05/Future-Trends-of-Advanced-Analytics.jpg"
              alt="Advanced Analytics"
            />
          </div>
          <div className="features-video">
            <h3>See It in Action</h3>
           <iframe width="560" height="315" src="https://www.youtube.com/embed/qcTG5NXzuR0" frameborder="0" allowfullscreen></iframe>

          </div>
     
        <div className="host-event-details">
          <h2>How It Works</h2>
          <p>
            When you choose to create an event, you’ll be guided through a sleek and user-friendly form. Provide a catchy title, a detailed description, set the date and time, while our integrated map feature automatically fills in the location – including city, country, and geo-coordinates.
          </p>
          <p>
            Next, define key parameters such as category, skill level, intended audience, and event type. Our system ensures that location-related fields remain auto-populated and read-only for accuracy, letting you focus on curating a standout event.
          </p>
        </div>



        </div>

      </div>
    </div>
  );
};

export default HostAnEvent;
