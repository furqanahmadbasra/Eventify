// // Eventbox.jsx
// import React from 'react';
// import useEventDetailStore from '../store/useEventDetailStore'; // Import the Zustand store
// import './Eventbox.css';

// const Eventbox = ({ event }) => {
//   const { openPanel } = useEventDetailStore((state) => state); // Access the function to open the panel

//   if (!event) {
//     // Handle the case where event is not passed or is undefined
//     return <div>No event data available</div>;
//   }

//   return (
//     <div className="event-box">
//       <h3>{event.title}</h3>
//       <p>{event.city}, {event.country}</p>
//       <p>{event.description || "No description available"}</p>
//       <p>Coordinates: ({event.latitude}, {event.longitude})</p>

//       {/* Link to open the right panel with the event data */}
//       <button className="open-panel-btn" onClick={() => openPanel(event)}>
//         see more...
//       </button>
//     </div>
//   );
// };

// export default Eventbox;

// Eventbox.jsx
import React from 'react';
import useEventDetailStore from '../store/useEventDetailStore';
import '../styles/Eventbox.css';

const Eventbox = ({ event }) => {
  const { openPanel } = useEventDetailStore((state) => state);

  if (!event) {
    return <div>No event data available</div>;
  }

  const formattedDate = new Date(event.date).toLocaleDateString();

  return (
    <div className="event-box">
      <h3>{event.title}</h3>
      <p>{event.mode}</p>
      <p>{formattedDate}</p>
      <p>{event.city}, {event.country}</p>
  
      <button className="open-panel-btn" onClick={() => openPanel(event)}>
        see complete details
      </button>
    </div>
  );
};

export default Eventbox;
