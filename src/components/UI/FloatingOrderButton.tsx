import React, { useState, useEffect } from 'react';

const FloatingOrderButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Show the floating order button when user scrolls down, but hide at bottom
  useEffect(() => {
    const toggleVisibility = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.pageYOffset;
      
      // Show button when scrolled down but not at bottom
      if (scrollPosition > 50 && scrollPosition + windowHeight < documentHeight - 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    // Initial check
    toggleVisibility();
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <a
      href="https://order.toasttab.com/online/kailanishaveice"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed bottom-6 right-4 z-50
        bg-[#e83838] hover:bg-[#d42323]
        text-white font-bold py-3 px-4
        rounded-lg border-2 border-[#f0c91f]
        shadow-[0_4px_0_rgb(25,180,189)]
        transition-colors duration-200
        flex items-center gap-2
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      aria-label="Order food online from Kailani"
    >
      <div className="relative w-6 h-6">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          {/* Ice cup base */}
          <path 
            d="M8 16 L24 16 L22 28 L10 28 Z" 
            fill="white"
          />
          
          {/* Colorful shave ice layers */}
          <ellipse cx="16" cy="15" rx="8" ry="3" fill="#f0c91f" />
          <ellipse cx="16" cy="13" rx="7" ry="2.5" fill="#19b4bd" />
          <ellipse cx="16" cy="11" rx="6" ry="2" fill="#f0c91f" />
          <ellipse cx="16" cy="9" rx="5" ry="1.5" fill="#e83838" />
        </svg>
      </div>
        
      <span className="font-semibold text-white">
        Order Now
      </span>
    </a>
  );
};

export default FloatingOrderButton;