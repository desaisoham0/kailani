import React, { useState, useEffect } from 'react';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Show button when scrolled down, but hide at bottom
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
  
  // Scroll back to top without animation
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`
        fixed bottom-6 left-4 z-50
        bg-[#19b4bd] hover:bg-[#0c9aa3]
        text-white font-bold p-3
        rounded-lg border-2 border-[#f0c91f]
        shadow-[0_4px_0_rgb(232,56,56)]
        transition-colors duration-200
        w-12 h-12 flex items-center justify-center cursor-pointer
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      aria-label="Back to top"
    >
      {/* Simple up arrow icon */}
      <svg 
        viewBox="0 0 24 24" 
        className="w-6 h-6"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M5 15l7-7 7 7" 
        />
      </svg>
    </button>
  );
};

export default BackToTopButton;