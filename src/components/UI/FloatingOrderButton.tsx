import React, { useState, useEffect } from 'react';
import OnlineOrderingLinks from '../OnlineOrdering/OnlineOrderingLinks';

const FloatingOrderButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  // Handle modal keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          fixed bottom-6 right-4 z-50
          bg-[#e83838] hover:bg-[#d42323]
          text-white font-bold py-3 px-6 baloo-regular tracking-wide text-xl
          rounded-lg border-2 border-[#f0c91f]
          shadow-[0_4px_0_rgb(25,180,189)]
          transition-colors duration-200
          flex items-center gap-2
          ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-label="Order food online from Kailani"
        aria-haspopup="dialog"
      >
        <span className="font-semibold text-white">
          Order Now
        </span>
      </button>

      {/* Modal for Order Now */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] md:max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl md:rounded-t-2xl z-10">
              <div className="flex items-center justify-between p-4 md:p-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Order Online</h2>
                  <p className="text-gray-600 text-sm md:text-base mt-1">Choose your preferred ordering method</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 md:p-6 pb-6 md:pb-8">
              <OnlineOrderingLinks 
                className="mb-0" 
                isDropdown={true}
                onLinkClick={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingOrderButton;