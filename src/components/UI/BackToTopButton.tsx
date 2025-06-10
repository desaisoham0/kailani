import React, { useState, useEffect } from 'react';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
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
  
  // Scroll back to top with animation
  const handleClick = () => {
    setIsClicked(true);

    // Trigger vibration on mobile devices
    if (navigator.vibrate) {
      navigator.vibrate([100, 30, 200]); // Pattern vibration
    }

    // Reset the clicked state after animation completes
    setTimeout(() => {
      setIsClicked(false);
    }, 600);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`
        fixed bottom-6 left-6 z-50 group
        bg-gradient-to-br from-blue-400 via-teal-500 to-green-600
        hover:from-blue-500 hover:via-teal-600 hover:to-green-700
        text-white font-bold p-4 rounded-full shadow-2xl
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        backdrop-blur-sm cursor-pointer
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
        ${isClicked ? 'animate-pulse' : ''}
      `}
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.3) 0%, 
            rgba(255, 255, 255, 0.1) 50%, 
            rgba(255, 255, 255, 0.05) 100%
          ),
          linear-gradient(135deg, 
            #3b82f6 0%, 
            #06b6d4 35%, 
            #10b981 70%, 
            #059669 100%
          )
        `,
        boxShadow: `
          0 8px 32px rgba(59, 130, 246, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.1)
        `,
        width: '64px',
        height: '64px',
        cursor: 'pointer !important'
      }}
      aria-label="Back to top"
    >
      {/* Glossy overlay */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at top left, 
              rgba(255, 255, 255, 0.6) 0%, 
              rgba(255, 255, 255, 0.2) 50%, 
              transparent 70%
            )
          `
        }}
      />
      
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="relative">
          {/* Playful pulsing ring */}
          <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping opacity-75 group-hover:opacity-100" />
          
          {/* Up arrow icon */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 drop-shadow-sm transform group-hover:-translate-y-0.5 transition-transform duration-200"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M5 15l7-7 7 7" 
              />
            </svg>
            
            {/* Sparkle effects */}
            <div className="absolute -top-1 -right-1 w-2 h-2">
              <div 
                className="w-full h-full bg-white rounded-full opacity-80 animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
            </div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5">
              <div 
                className="w-full h-full bg-white rounded-full opacity-60 animate-pulse"
                style={{ animationDelay: '1s' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated border shine effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `
            conic-gradient(
              transparent, 
              rgba(255, 255, 255, 0.3), 
              transparent
            )
          `,
          animation: 'spin 3s linear infinite'
        }}
      />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div 
          className="absolute w-1 h-1 bg-white rounded-full animate-bounce"
          style={{ 
            top: '20%', 
            left: '30%', 
            animationDelay: '0.2s',
            animationDuration: '1.5s'
          }}
        />
        <div 
          className="absolute w-1 h-1 bg-white rounded-full animate-bounce"
          style={{ 
            top: '70%', 
            right: '25%', 
            animationDelay: '0.8s',
            animationDuration: '1.2s'
          }}
        />
      </div>
    </button>
  );
};

export default BackToTopButton;