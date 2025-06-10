import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/Kailani_logo.png';

interface NavItem {
  label: string;
  href: string;
  isRouterLink?: boolean;
  icon?: string; // Added icon property for navigation items
}

interface MobileNavigationProps {
  restaurantName?: string;
}

export const MobileNavigation = React.memo(({ restaurantName }: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItem[] = useMemo(() => [
    { label: 'Home', href: '/', isRouterLink: true, icon: '🏠' },
    { label: 'Gallery', href: '/gallery', isRouterLink: true, icon: '🖼️' },
    { label: 'Careers', href: '/jobs', isRouterLink: true, icon: '💼' },
    { label: 'About Us', href: '/about', isRouterLink: true, icon: '📝' },
    { label: 'Contact', href: '/contact', isRouterLink: true, icon: '📞' },
  ], []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => {
      // Prevent scrolling when menu is open
      document.body.style.overflow = !prev ? 'hidden' : 'auto';
      return !prev;
    });
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-menu-content') && !target.closest('.mobile-menu-button')) {
        toggleMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleMenu]);

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 w-full max-w-full md:hidden shadow-lg overflow-x-hidden border-b-2 border-[#ffe0f0]" style={{ background: 'linear-gradient(120deg, #e0f7fa 0%, #fffbe9 100%)', fontFamily: 'Baloo, jua, sans-serif' }}>
        <div className="container mx-auto py-5 px-4 flex justify-between items-center max-w-full relative bg-transparent" style={{fontFamily: 'Baloo, jua, sans-serif'}}>
          <div className="flex items-center min-w-0 flex-1" style={{fontFamily: 'Baloo, jua, sans-serif'}}>
            <div>
              <img 
                src={logoImage}
                srcSet="/Kailani_logo.webp 1x, /Kailani_logo.png 2x"
                sizes="(max-width: 600px) 100vw, 48px"
                alt="Kailani Logo"
                loading="lazy"
                className="h-12 w-auto mr-2 rounded-full bg-white p-1 shadow border-2 border-[#ffe0f0]"
              />
            </div>
            <div className="flex flex-col items-start bg-[#e0f7fa] px-3 py-1 rounded-2xl" style={{boxShadow: '0 2px 8px #a8e6cf33', fontFamily: 'Baloo, jua, sans-serif'}}>
              <span className="text-3xl font-bold" style={{
                letterSpacing: '1px',
                color: '#ffe066', // pastel yellow
                textShadow: '0 2px 16px #a47149, 0 1px 0 #fffbe9, 0 0 2px #a8e6cf', // brown shadow
                fontFamily: 'Baloo, jua, sans-serif'
              }}>{restaurantName || 'Kailani'}</span>
              <span className="text-base sm:text-lg font-bold jua-regular mt-0.5" style={{color: '#00bfae', textShadow: '0 1px 0 #fffbe9, 0 0 2px #a8e6cf', fontFamily: 'Baloo, jua, sans-serif'}}>Hawaiian SHAVE ICE & RAMEN</span>
            </div>
          </div>
          
          {/* Mobile Menu Button - more playful */}
          <div className="flex space-x-2">
            {/* Order Now CTA button */}
            <a 
              href="https://order.toasttab.com/online/kailanishaveice"
              target="_blank" 
              className="group relative flex items-center px-3 py-2 text-sm font-bold jua-regular transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: '3px solid rgba(255, 255, 255, 0.4)',
                color: '#FFFFFF',
              }}
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-1 text-base transform group-hover:scale-110 transition-transform duration-300">🍽️</span>
                Order
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 2s ease infinite'
                }}
              />
            </a>
            
            <button 
              onClick={toggleMenu}
              className="mobile-menu-button group relative flex items-center justify-center p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FF6B9D 0%, #FFD93D 50%, #4ECDC4 100%)',
                border: '3px solid rgba(255, 255, 255, 0.4)',
              }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <svg 
                className="w-6 h-6 text-white relative z-10 transition-transform duration-300 group-hover:rotate-180" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(45deg, #A8E6CF, #FF8E9B, #FFB74D)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 2s ease infinite'
                }}
              />
            </button>
          </div>
        </div>
        
        {/* Mobile decorative elements - right side */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-5">
          <div className="absolute top-2 right-2 w-2 h-2 bg-white/20 rounded-full animate-bounce opacity-60" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-6 right-4 w-1.5 h-1.5 bg-yellow-300/30 rounded-full animate-bounce opacity-50" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute bottom-2 right-6 w-2 h-2 bg-teal-300/25 rounded-full animate-bounce opacity-40" style={{animationDelay: '2s', animationDuration: '3.5s'}}></div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay - Playful, pastel, static design */}
      <div 
        className={`fixed inset-0 z-40 w-full max-w-full bg-[#fdf6fb] bg-opacity-95 backdrop-blur-md transition-none ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ boxShadow: '0 0 0 100vw #fdf6fbcc', borderTop: '4px solid #ffe0f0' }}
      >
        <div className="mobile-menu-content flex flex-col h-full pt-14 p-6 w-full max-w-full overflow-x-hidden overflow-y-auto relative z-10">
          {/* Close button - static, hand-drawn style */}
          <button 
            onClick={toggleMenu} 
            className="absolute top-4 right-6 p-3 rounded-2xl bg-[#ffe0f0] border-2 border-[#ffb6d5] text-[#ff6b9d] font-bold text-xl shadow hover:bg-[#fffbe9] transition-none"
            aria-label="Close menu"
          >
            <span style={{fontFamily: 'jua, sans-serif'}}>✕</span>
          </button>

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-3 mt-6 gap-3">
              <span className="inline-block text-3xl" role="img" aria-label="flower">🌺</span>
              <img 
                src={logoImage} 
                alt="Kailani Logo" 
                className="h-14 w-auto rounded-full bg-white p-1 border-2 border-[#ffe0f0] shadow"
              />
              <span className="inline-block text-3xl" role="img" aria-label="wave">🌊</span>
            </div>
            <div className="text-3xl font-bold jua-regular text-[#ff6b9d] drop-shadow-sm">{restaurantName || 'Kailani'}</div>
            <div className="text-lg font-bold text-[#4ecdc4] jua-regular mt-1">Hawaiian SHAVE ICE & RAMEN</div>
            <div className="text-[#ffb6d5] font-medium jua-regular text-base mt-2">🏝️ Your Tropical Food Adventure! 🏝️</div>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col gap-4 px-2 flex-1 pb-20">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.isRouterLink ? (
                  <Link 
                    to={item.href} 
                    className="flex items-center gap-4 p-5 rounded-3xl bg-white border-2 border-[#e0f7fa] shadow-sm hover:bg-[#fdf6fb] transition-none"
                    style={{boxShadow: '0 2px 8px #a8e6cf33', fontFamily: 'Baloo, jua, sans-serif'}}
                    onClick={toggleMenu}
                  >
                    <span className="text-2xl" role="img" aria-hidden="true">{item.icon}</span>
                    <span className="font-bold text-lg jua-regular text-[#00bfae] tracking-wide" style={{fontFamily: 'Baloo, jua, sans-serif'}}>{item.label}</span>
                  </Link>
                ) : (
                  <a 
                    href={item.href} 
                    className="flex items-center gap-4 p-5 rounded-3xl bg-white border-2 border-[#e0f7fa] shadow-sm hover:bg-[#fdf6fb] transition-none"
                    style={{boxShadow: '0 2px 8px #a8e6cf33', fontFamily: 'Baloo, jua, sans-serif'}}
                    onClick={toggleMenu}
                  >
                    <span className="text-2xl" role="img" aria-hidden="true">{item.icon}</span>
                    <span className="font-bold text-lg jua-regular text-[#00bfae] tracking-wide" style={{fontFamily: 'Baloo, jua, sans-serif'}}>{item.label}</span>
                  </a>
                )}
              </div>
            ))}
            {/* Order Now CTA in mobile menu */}
            <div className="relative mt-6">
              <a 
                href="https://order.toasttab.com/online/kailanishaveice" 
                target="_blank"
                className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#a8e6cf] border-2 border-[#4ecdc4] shadow-sm hover:bg-[#d0f5ea] transition-none"
                style={{boxShadow: '0 2px 8px #a8e6cf33', fontFamily: 'Baloo, jua, sans-serif'}}
                onClick={toggleMenu}
              >
                <span className="text-4xl mb-2" role="img" aria-label="order">🍽️</span>
                <span className="font-bold text-2xl text-[#00796b] jua-regular tracking-wide" style={{fontFamily: 'Baloo, jua, sans-serif'}}>Order Now!</span>
                <span className="text-[#4ecdc4] text-sm font-medium mt-1">Start your tropical feast!</span>
              </a>
            </div>
          </nav>
          {/* Fun bottom decoration */}
          <div className="text-center mt-8">
            <div className="flex justify-center space-x-3 mb-4">
              <span className="text-3xl" role="img" aria-label="wave">🌊</span>
              <span className="text-3xl" role="img" aria-label="pineapple">🍍</span>
              <span className="text-3xl" role="img" aria-label="flower">🌺</span>
            </div>
            <div className="text-[#ffb6d5] font-medium jua-regular">Aloha! Let's explore together! 🏄‍♀️</div>
          </div>
        </div>
      </div>
    </>
  );
});
