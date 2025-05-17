import React, { useState, useEffect } from 'react';
import '../../styles/footerAnimations.css';

const FloatingOrderButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  // Removing unused state variable
  const [isClicked, setIsClicked] = useState(false);
  
  // Show the floating order button when user scrolls down
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
  
  // Handle click celebration animation
  const handleClick = () => {
    setIsClicked(true);

    // Trigger vibration on mobile devices
    if (navigator.vibrate) {
        navigator.vibrate(200); // Vibrate for 200ms
    }
    
    // Reset the clicked state after the animation completes
    setTimeout(() => {
      setIsClicked(false);
    }, 700);
  };

  return (
    <a
      href="https://order.toasttab.com/online/kailanishaveice"
      target="_blank"
      rel="noopener noreferrer"
      className={`floating-order-button ${isVisible ? 'visible' : ''} ${isClicked ? 'clicked' : ''}`}
      aria-label="Order food online from Kailani"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="icon-container mr-2 relative">
          {/* Notification badge in Duolingo style
          {hasPrompt && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs bounce-slow z-10">
              !
            </div>
          )} */}

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 food-icon-bounce">
            {/* Hawaiian food-themed icon - Pineapple */}
            <circle cx="12" cy="12" r="10" fill="#FFD700" />
            <path d="M12 4c-1.5 0-3.5 2-3.5 6 0 4 1 8 3.5 8s3.5-4 3.5-8c0-4-2-6-3.5-6z" fill="#FFA000" />
            <path d="M12 4c-1.5 0-3.5 2-3.5 6 0 4 1 8 3.5 8s3.5-4 3.5-8c0-4-2-6-3.5-6z" fill="#FF8F00" fillOpacity="0.6" />
            <path d="M8.5 5c0 0-1 1-1 2.5s1 2.5 1 2.5M15.5 5c0 0 1 1 1 2.5s-1 2.5-1 2.5" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M9 10c0.5 0.8 1.8 1.5 3 1.5s2.5-0.7 3-1.5" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 3.5c0.5-1 1.5-1 2-0S12.5 2 12 1.5 11.5 1 11 1.5s-1.5 1-1 2z" fill="#43A047" />
            
            {/* Add small decorative elements */}
            <circle cx="8" cy="14" r="1" fill="#FFF" fillOpacity="0.7" />
            <circle cx="16" cy="14" r="1" fill="#FFF" fillOpacity="0.7" />
            <circle cx="12" cy="16" r="0.5" fill="#FFF" fillOpacity="0.7" />
          </svg>
        </div>
        <span className="order-text">Order Online</span>
      </div>
    </a>
  );
};

export default FloatingOrderButton;
