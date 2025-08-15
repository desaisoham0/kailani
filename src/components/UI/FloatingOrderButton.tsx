import React, { useState, useEffect } from 'react';
import OnlineOrderingLinks from '../OnlineOrdering/OnlineOrderingLinks';

const FloatingOrderButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.pageYOffset;
      if (
        scrollPosition > 50 &&
        scrollPosition + windowHeight < documentHeight - 20
      ) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

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
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Order food online from Kailani"
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        aria-controls="order-now-dialog"
        className={`baloo-regular fixed right-4 bottom-6 z-50 inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-[#f0c91f] bg-[#e83838] px-5 py-3 text-lg font-bold tracking-wide text-white shadow-[0_4px_0_rgb(25,180,189)] ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#d42323] hover:shadow-[0_3px_0_rgb(25,180,189)] focus-visible:ring-2 focus-visible:ring-[#f0c91f] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:translate-y-0 active:shadow-[0_2px_0_rgb(25,180,189)] motion-reduce:transition-none sm:right-6 sm:text-xl md:right-8 ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <span className="font-semibold text-white">Order Now</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <div
            id="order-now-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-now-title"
            aria-describedby="order-now-desc"
            tabIndex={-1}
            className="relative mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none md:max-h-[90vh] md:rounded-2xl"
          >
            <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-200 bg-white md:rounded-t-2xl">
              <div className="flex items-center justify-between p-4 md:p-6">
                <div>
                  <h2
                    id="order-now-title"
                    className="text-xl font-bold text-gray-800 md:text-2xl"
                  >
                    Order Online
                  </h2>
                  <p
                    id="order-now-desc"
                    className="mt-1 text-sm text-gray-600 md:text-base"
                  >
                    Choose your preferred ordering method
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                  className="cursor-pointer rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:outline-none"
                >
                  <svg
                    className="h-5 w-5 md:h-6 md:w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

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
