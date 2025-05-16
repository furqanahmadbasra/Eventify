import React, { useRef, useState } from 'react';
import '../styles/Eventcrousal.css';
import Eventbox from './Eventbox.jsx';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Scrollbar } from 'react-scrollbars-custom'; // Import the Scrollbar component
import useEventStore from '../store/useEventStore'; // We need to call fetchEvents from this store


const Eventcrousal = React.memo(() => {
  const sidebarRef = useRef(null);
  const [expanded, setExpanded] = useState(false);


   // Fetch event data from Zustand store
   const { eventResults } = useEventStore(state => state);


  const toggleSidebar = () => {
    if (!expanded) {

  
      gsap.to(sidebarRef.current, {
        width: "30%", // Expand to 20%
        opacity: 1,
        duration: 0.3,
        ease: "sine.out",
      });
    } else {
      gsap.to(sidebarRef.current, {
        width: "2%", // Collapse back to 2%
        opacity: 0.6,
        duration: 0.3,
        ease: "sine.out",
      });
    }

    setExpanded(!expanded); // Toggle the expanded state
  };

  

  return (
    <div ref={sidebarRef} className={`sidebar_wrapper ${expanded ? 'expanded' : ''}`}>
      <button className="sidebar_toggle" onClick={toggleSidebar}>
        {expanded ? (
          <FontAwesomeIcon icon={faArrowLeft} size="1x"  style={{ color: 'black' }}/>
        ) : (
          <FontAwesomeIcon icon={faArrowRight} size="1x"  style={{ color: 'black' }}/>
        )}
      </button>
      <Scrollbar
        style={{ height: '100%' }} // Ensure full height of the scroll area
        noScrollX // Disable horizontal scroll
        autoHide // Enable auto-hide on scroll
        autoHideTimeout={800} // Time in ms before scrollbar starts to hide
        autoHideDuration={500} // Duration for scrollbar to fade out (in ms)
      >
        <div className="sidebar_content">
        {/* Loop through eventResults and pass each event to EventBox */}
          {eventResults.map((event, index) => (
            <Eventbox key={index} event={event} />
          ))}
        </div>
      </Scrollbar>
    </div>
  );
});

export default Eventcrousal;

