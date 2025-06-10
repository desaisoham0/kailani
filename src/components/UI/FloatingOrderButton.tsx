import React, { useState, useEffect } from 'react';
// import '../../styles/footerAnimations.css';

const FloatingOrderButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
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
      className={`
        fixed bottom-6 right-6 z-50 group
        bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600
        hover:from-orange-500 hover:via-pink-600 hover:to-purple-700
        text-white font-bold py-4 px-6 rounded-full shadow-2xl
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        backdrop-blur-sm
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
        ${isClicked ? 'animate-bounce' : ''}
      `}
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.3) 0%, 
            rgba(255, 255, 255, 0.1) 50%, 
            rgba(255, 255, 255, 0.05) 100%
          ),
          linear-gradient(135deg, 
            #ff6b35 0%, 
            #f7931e 25%, 
            #ff1744 50%, 
            #e91e63 75%, 
            #9c27b0 100%
          )
        `,
        boxShadow: `
          0 8px 32px rgba(255, 107, 53, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.1)
        `,
      }}
      aria-label="Order food online from Kailani"
      onClick={handleClick}
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
      
      <div className="relative flex items-center gap-3">
        <div className="relative">
          {/* Playful pulsing ring */}
          <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping opacity-75 group-hover:opacity-100" />
          
          {/* Hawaiian shave ice icon */}
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-sm">
              {/* Ice cup base */}
              <path 
                d="M8 16 L24 16 L22 28 L10 28 Z" 
                fill="rgba(255, 255, 255, 0.9)" 
                stroke="rgba(255, 255, 255, 0.3)" 
                strokeWidth="0.5"
              />
              
              {/* Colorful shave ice layers */}
              <ellipse cx="16" cy="15" rx="8" ry="3" fill="#ff6b9d" opacity="0.8" />
              <ellipse cx="16" cy="13" rx="7" ry="2.5" fill="#4ecdc4" opacity="0.8" />
              <ellipse cx="16" cy="11" rx="6" ry="2" fill="#ffe66d" opacity="0.8" />
              <ellipse cx="16" cy="9" rx="5" ry="1.5" fill="#ff6b35" opacity="0.8" />
              
              {/* Sparkles */}
              <circle cx="12" cy="12" r="0.5" fill="white" opacity="0.9" />
              <circle cx="20" cy="10" r="0.5" fill="white" opacity="0.9" />
              <circle cx="16" cy="7" r="0.5" fill="white" opacity="0.9" />
            </svg>
          </div>
        </div>
        
        <span className="text-white font-semibold text-lg tracking-wide drop-shadow-sm">
          Order Now! 🌺
        </span>
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
    </a>
  );
};

export default FloatingOrderButton;