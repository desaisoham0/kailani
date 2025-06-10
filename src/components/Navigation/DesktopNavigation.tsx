import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/Kailani_logo.png';

interface NavItem {
  label: string;
  href: string;
  isRouterLink?: boolean;
}

const icons = ['🏠','🖼️','💼','📝','📞'];

export const DesktopNavigation = React.memo(() => {
  const location = useLocation();
  const navItems = useMemo<NavItem[]>(() => [
    { label: 'Home', href: '/', isRouterLink: true },
    { label: 'Gallery', href: '/gallery', isRouterLink: true},
    { label: 'Careers', href: '/jobs', isRouterLink: true},
    { label: 'About Us', href: '/about', isRouterLink: true},
    { label: 'Contact', href: '/contact', isRouterLink: true},
  ], []);

  return (
    <header 
      className="sticky top-0 z-30 w-full shadow-xl overflow-hidden max-w-full bg-[#fdf6fb] border-b-2 border-[#ffe0f0]"
    >
      {/* Top Section - Logo and Restaurant Name centered */}
      <div className="w-full py-8 px-4 md:px-8 flex flex-col items-center justify-center gap-2 border-b-2 border-[#ffe0f0]" style={{background: 'linear-gradient(120deg, #fdf6fb 0%, #a8e6cf 40%, #ffd6e0 70%, #fffbe9 100%)'}}>
        <Link to="/" className="flex items-center gap-4">
          <div className="relative">
            {/* Hand-drawn style logo border */}
            <span className="absolute -inset-2 rounded-full border-4 border-dashed border-[#ffe0f0]" />
            <img 
              src={logoImage} 
              srcSet="/Kailani_logo.webp 1x, /Kailani_logo.png 2x"
              sizes="(max-width: 600px) 100vw, 300px"
              alt="Kailani Logo" 
              loading="lazy"
              className="h-20 md:h-24 w-auto rounded-full bg-white p-2 shadow-lg border-2 border-[#ffe0f0]"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-4xl md:text-5xl font-bold drop-shadow-lg" style={{
              letterSpacing: '1px',
              color: '#ffe066', // pastel yellow
              textShadow: '0 2px 16px #a47149, 0 1px 0 #fffbe9, 0 0 2px #a8e6cf', // brown shadow
              fontFamily: 'Baloo, jua, sans-serif'
            }}>
              Kailani
            </span>
            <span className="text-lg md:text-2xl font-bold mt-1" style={{color: '#00bfae', textShadow: '0 1px 0 #fffbe9, 0 0 2px #a8e6cf', fontFamily: 'Baloo, jua, sans-serif'}}>
              Hawaiian SHAVE ICE & RAMEN
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="w-full flex justify-center items-center gap-4 md:gap-8 py-4 bg-[#fffbe9] border-t-2 border-[#ffe0f0]">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-lg jua-regular transition-colors border-2 shadow-sm ${
                isActive
                  ? 'bg-[#ffe0f0] text-[#ff6b9d] border-[#ffb6d5]'
                  : 'bg-white text-[#4ecdc4] border-[#e0f7fa] hover:bg-[#fdf6fb] hover:text-[#ff6b9d]'
              }`}
              style={{boxShadow: '0 2px 8px #ffe0f033'}}
            >
              <span className="text-2xl" aria-hidden>{icons[index]}</span>
              {item.label}
            </Link>
          );
        })}
        {/* Order Now CTA button - Playful, pastel style */}
        <a 
          href="https://order.toasttab.com/online/kailanishaveice" 
          target="_blank"
          className="ml-2 px-6 py-3 rounded-2xl font-bold text-lg jua-regular bg-[#a8e6cf] text-[#00796b] border-2 border-[#4ecdc4] shadow-sm hover:bg-[#d0f5ea] transition-colors"
          style={{boxShadow: '0 2px 8px #a8e6cf33'}}
        >
          <span className="text-2xl mr-2" aria-hidden>🍽️</span>
          Order Now
        </a>
      </nav>
    </header>
  );
});