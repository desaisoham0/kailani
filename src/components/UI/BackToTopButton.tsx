import React, { useState, useEffect } from 'react';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Check if user has scrolled down enough to show the button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  // Scroll back to top
  const handleClick = () => {

    // Trigger vibration on mobile devices
    if (navigator.vibrate) {
      navigator.vibrate([100, 30, 200]); // Vibrate for 200ms
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      aria-label="Back to top"
    >
      <div className="button-content">
        <span role="img" aria-hidden="true" className="button-emoji">
          👆
        </span>
      </div>
    </button>
  );
};

export default BackToTopButton;
