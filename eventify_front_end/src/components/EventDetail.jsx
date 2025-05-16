// import React, { useRef, useState } from 'react';
// import './EventDetail.css';
// import Eventbox from './Eventbox.jsx';
// import { gsap } from 'gsap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the cross icon
// import { Scrollbar } from 'react-scrollbars-custom'; // Import the Scrollbar component
// import useEventStore from "../store/eventStore.js";

// const EventDetail = React.memo(() => {
//   const sidebarRef = useRef(null);
//   const [expanded, setExpanded] = useState(true); // Default to expanded for initial state

//   // Fetch event data from Zustand store
//   const { eventResults } = useEventStore(state => state);

//   const toggleSidebar = () => {
//     // Check if expanded or collapsed and toggle accordingly
//     if (expanded) {
//       gsap.to(sidebarRef.current, {
//         width: "0%", // Collapse to 0% width
//         opacity: 0,  // Fade out opacity
//         duration: 0.3,
//         ease: "sine.out",
//         onComplete: () => {
//           sidebarRef.current.style.display = "none"; // Completely hide the sidebar after animation
//         }
//       });
//     } else {
//       gsap.to(sidebarRef.current, {
//         width: "40%", // Expand to 40% width
//         opacity: 1,  // Full opacity
//         duration: 0.3,
//         ease: "sine.out",
//         onComplete: () => {
//           sidebarRef.current.style.display = "flex"; // Show the sidebar again after animation
//         }
//       });
//     }

//     setExpanded(!expanded); // Toggle the expanded state
//   };

//   return (
//     <div ref={sidebarRef} className={`right_panel ${expanded ? 'expanded' : ''}`}>
//       <button className="sidebar_toggle" onClick={toggleSidebar}>
//         {/* Cross button for toggling */}
//         <FontAwesomeIcon icon={faTimes} size="2x" style={{ color: 'black' }} />
//       </button>

//       <Scrollbar
//         style={{ height: '100%' }} // Ensure full height of the scroll area
//         noScrollX // Disable horizontal scroll
//         autoHide // Enable auto-hide on scroll
//         autoHideTimeout={800} // Time in ms before scrollbar starts to hide
//         autoHideDuration={500} // Duration for scrollbar to fade out (in ms)
//       >
//         <div className="sidebar_content">
//           {/* Loop through eventResults and pass each event to EventBox */}
//           {eventResults.map((event, index) => (
//             <Eventbox key={index} event={event} />
//           ))}
//         </div>
//       </Scrollbar>
//     </div>
//   );
// });

// export default EventDetail;



// // EventDetail.jsx
// import React from 'react';
// import useEventDetailStore from '../store/useEventDetailStore'; // Import the Zustand store
// import './EventDetail.css';

// const EventDetail = () => {
//   const { isPanelOpen, eventData, closePanel } = useEventDetailStore((state) => state); // Get the store values

//   // Don't render the panel if it's not open
//   if (!isPanelOpen) return null;

//   return (
//     <div className="right_panel">
//       <button className="close_button" onClick={closePanel}>X</button>
//       <div>
//         <h2>{eventData?.title}</h2>
//         <p>{eventData?.description}</p>
//         {/* Add any other event data you'd like to show */}
//       </div>
//     </div>
//   );
// };

// export default EventDetail;


// import React from 'react';
// import useEventDetailStore from '../store/useEventDetailStore'; // Import the Zustand store
// import './EventDetail.css';

// const EventDetail = () => {
//   const { isPanelOpen, eventData, closePanel } = useEventDetailStore((state) => state); // Get the store values

//   // Don't render the panel if it's not open
//   if (!isPanelOpen) return null;

//   return (
//     <div className="right_panel">
//       {/* Header div with the close button */}
//       <div className="header">
//         <button className="close_button" onClick={closePanel}>X</button>
//       </div>

//       {/* Event details container */}
//       <div className="event_details">
//         <h2>{eventData?.title}</h2>
//         <p>{eventData?.description}</p>
//         {/* Add any other event data you'd like to show */}
//       </div>
//     </div>
//   );
// };

// export default EventDetail;









// // EventDetail.jsx
// import React from 'react';
// import useEventDetailStore from '../store/useEventDetailStore'; // Import the Zustand store
// import EventDetailBox from './EventDetailBox'; // Import the EventDetailBox component
// import './EventDetail.css';

// const EventDetail = () => {
//   const { isPanelOpen, eventData, closePanel } = useEventDetailStore((state) => state); // Get the store values
//   console.log("we are in the event detail ", eventData);

//   // Don't render the panel if it's not open
//   if (!isPanelOpen) return null;

//   return (
//     <>
//       {/* Overlay for dimming the background when the panel is open */}
//       <div className="overlay"></div>

//       {/* Right panel */}
//       <div className="right_panel">
//         {/* Header with close button */}
//         <div className="header">
//           <button className="close_button" onClick={closePanel}>
//             <i className="fas fa-times"></i>
//           </button>
//         </div>

//         {/* Event details container */}
//         <div className="event_details">
//           <h2>Event Details</h2>
//           {/* Loop through the eventData array and render EventDetailBox for each event */}
//           {eventData?.map((event, index) => (
//             <EventDetailBox key={index} event={event} />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default EventDetail;






















// EventDetail.jsx
import React from 'react';
import useEventDetailStore from '../store/useEventDetailStore'; // Import the Zustand store
import EventDetailBox from './EventDetailBox'; // Import EventDetailBox
import '../styles/EventDetail.css';

const EventDetail = () => {
  const { isPanelOpen, eventData, closePanel } = useEventDetailStore((state) => state); // Get the store values

  // Don't render the panel if it's not open
  if (!isPanelOpen) return null;

  return (
    <>
      {/* Overlay for dimming the background when the panel is open */}
      <div className="overlay"></div>

      {/* Right panel */}
      <div className="right_panel">
        {/* Header with close button */}
        <div className="header">
          <button className="close_button" onClick={closePanel}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Event details container */}
        <div className="event_details">
          <h2>Event Details</h2>

          {/* Check if eventData is an array or a single object */}
          {Array.isArray(eventData) ? (
            // If eventData is an array, loop through it and display all events using EventDetailBox
            eventData.map((event, index) => (
              <EventDetailBox key={index} event={event} />
            ))
          ) : (
            // If eventData is a single event, display it using EventDetailBox
            <EventDetailBox event={eventData} />
          )}
        </div>
      </div>
    </>
  );
};

export default EventDetail;
