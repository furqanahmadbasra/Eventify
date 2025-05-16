import React, { useState, useEffect } from 'react';
import '../styles/Slider.css';

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const numberOfSlides = 4; // Total number of slides

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % numberOfSlides);
    }, 3000); // Change slide every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="slider-container">
      <div 
        className="slides-container"
        style={{ transform: `translateX(-${activeIndex * 100}vw)` }}
      >
        <div className="slide">
          <img src="1.png" alt="Slide 1" />
          <button>Learn More</button>
        </div>
        <div className="slide">
          <img src="2.png" alt="Slide 2" />
        </div>
        <div className="slide">
          <img src="3.png" alt="Slide 3" />
        </div>
        <div className="slide">
          <img src="4.png" alt="Slide 4" />
        </div>
      </div>
      <div className="buttons">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            className={activeIndex === index ? 'active' : ''}
            onClick={() => handleButtonClick(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
