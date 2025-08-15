import React, { useState, useEffect } from 'react';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

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

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isVisible}
      title="Back to top"
      aria-label="Back to top"
      className={`fixed bottom-6 left-4 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border-2 border-[#f0c91f] bg-[#19b4bd] p-3 font-bold text-white shadow-[0_4px_0_rgb(232,56,56)] ring-1 ring-white/10 transition-colors transition-shadow transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:bg-[#0c9aa3] hover:shadow-[0_3px_0_rgb(232,56,56)] focus-visible:ring-2 focus-visible:ring-[#f0c91f] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:translate-y-0 active:shadow-[0_2px_0_rgb(232,56,56)] motion-reduce:transform-none motion-reduce:transition-none sm:left-6 md:left-8 ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'} disabled:pointer-events-none disabled:opacity-0`}
    >
      <span className="sr-only">Back to top</span>
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        aria-hidden="true"
        focusable="false"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default BackToTopButton;
