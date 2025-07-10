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
      if (
        scrollPosition > 50 &&
        scrollPosition + windowHeight < documentHeight - 20
      ) {
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
        className={`baloo-regular fixed right-4 bottom-6 z-50 flex items-center gap-2 rounded-lg border-2 border-[#f0c91f] bg-[#e83838] px-6 py-3 text-xl font-bold tracking-wide text-white shadow-[0_4px_0_rgb(25,180,189)] transition-colors duration-200 hover:bg-[#d42323] ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'} `}
        aria-label="Order food online from Kailani"
        aria-haspopup="dialog"
      >
        <span className="font-semibold text-white">Order Now</span>
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
          <div className="animate-slide-up relative mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl md:max-h-[90vh] md:rounded-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-200 bg-white md:rounded-t-2xl">
              <div className="flex items-center justify-between p-4 md:p-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                    Order Online
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 md:text-base">
                    Choose your preferred ordering method
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <svg
                    className="h-5 w-5 md:h-6 md:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 pb-6 md:p-6 md:pb-8">
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
