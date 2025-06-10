import React from 'react';
import { Link } from 'react-router-dom';
// import '../../styles/footerAnimations.css';

// Add a playful, bubbly font (Google Fonts suggestion in comment)
// In your index.html or CSS, import: 
// @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&display=swap');

// Hand-drawn style SVGs for footer icons
const HandDrawnBowl = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="28" rx="14" ry="7" fill="#FFF8E7" stroke="#F7C873" strokeWidth="2.5" />
    <path d="M8 28c0 6 24 6 24 0" stroke="#F7C873" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 18c-2-2 2-4 0-6" stroke="#B2DFFC" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M24 18c-2-2 2-4 0-6" stroke="#B2F7C3" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const HandDrawnPineapple = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <ellipse cx="16" cy="22" rx="8" ry="7" fill="#F7C873" stroke="#F7E7B3" strokeWidth="2" />
    <path d="M16 15v-7" stroke="#B2DFFC" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 15l-3-5" stroke="#B2F7C3" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 15l3-5" stroke="#F7B3D7" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const HandDrawnFlower = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="6" fill="#F7B3D7" stroke="#F7C873" strokeWidth="2" />
    <ellipse cx="16" cy="7" rx="3" ry="6" fill="#FFF8E7" stroke="#F7B3D7" strokeWidth="1.5" />
    <ellipse cx="16" cy="25" rx="3" ry="6" fill="#FFF8E7" stroke="#F7B3D7" strokeWidth="1.5" />
    <ellipse cx="7" cy="16" rx="6" ry="3" fill="#FFF8E7" stroke="#F7B3D7" strokeWidth="1.5" />
    <ellipse cx="25" cy="16" rx="6" ry="3" fill="#FFF8E7" stroke="#F7B3D7" strokeWidth="1.5" />
  </svg>
);
const HandDrawnCoconut = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <ellipse cx="16" cy="20" rx="8" ry="7" fill="#F7E7B3" stroke="#B2DFFC" strokeWidth="2" />
    <ellipse cx="16" cy="20" rx="4" ry="3" fill="#FFF" stroke="#B2F7C3" strokeWidth="1.5" />
  </svg>
);

interface KailaniFooterProps {
  restaurantName: string;
}

const KailaniFooter: React.FC<KailaniFooterProps> = ({ restaurantName }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#E7F8FF] pt-0 pb-0" style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}>
      {/* Decorative Pastel Wave */}
      <div className="w-full h-8 bg-gradient-to-r from-[#B2DFFC] via-[#E7F8FF] to-[#B2F7C3] rounded-b-3xl"></div>
      {/* Order Online CTA Banner */}
      <div className="max-w-5xl mx-auto px-4 py-8 rounded-[2.5rem] bg-[#E7F8FF] shadow-xl mt-[-24px] mb-10 flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[#B2DFFC]">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="flex-shrink-0"><HandDrawnBowl /></div>
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-[#3B3B3B] mb-1">Hungry? Don't wait!</h3>
            <p className="text-[#7FC29B] text-base">Fresh Hawaiian flavors delivered to your door</p>
          </div>
        </div>
        <a 
          href="https://order.toasttab.com/online/kailanishaveice" 
          target="_blank" 
          rel="noopener noreferrer"
          className="rounded-full bg-[#B2DFFC] hover:bg-[#E7F8FF] text-[#3B3B3B] font-bold px-8 py-4 text-lg shadow border-2 border-[#B2DFFC] transition-colors duration-200 flex items-center gap-2"
          style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}
        >
          <span>ORDER NOW</span>
          <span style={{ fontSize: 28 }}>🍽️</span>
        </a>
        {/* Decorative hand-drawn food icons */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <HandDrawnPineapple />
          <HandDrawnFlower />
          <HandDrawnCoconut />
        </div>
      </div>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and About */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="text-3xl font-bold mb-4 text-[#3B3B3B]">{restaurantName}</div>
            <p className="text-[#7FC29B] mb-4 text-center md:text-left text-base">
              Experience the taste of Hawaii with our delicious dishes made with aloha!
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="https://facebook.com" aria-label="Facebook" className="rounded-full bg-[#B2DFFC] p-2 hover:bg-[#E7F8FF] transition-colors">
                {/* Hand-drawn style Facebook icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="11" ry="11" fill="#FFF" stroke="#7FC29B" strokeWidth="2"/><path d="M13 8h2V6.5A2.5 2.5 0 0 0 12.5 4h-1A2.5 2.5 0 0 0 9 6.5V8H7v3h2v7h3v-7h2l.5-3H13V8z" stroke="#3B3B3B" strokeWidth="1.5" fill="none"/></svg>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="rounded-full bg-[#F7B3D7] p-2 hover:bg-[#E7F8FF] transition-colors">
                {/* Hand-drawn style Instagram icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="11" ry="11" fill="#FFF" stroke="#B2DFFC" strokeWidth="2"/><rect x="7" y="7" width="10" height="10" rx="4" stroke="#3B3B3B" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="2.5" stroke="#3B3B3B" strokeWidth="1.5" fill="none"/><circle cx="16" cy="8" r="1" fill="#F7B3D7"/></svg>
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="rounded-full bg-[#E7F8FF] p-2 hover:bg-[#B2DFFC] transition-colors">
                {/* Hand-drawn style Twitter icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="11" ry="11" fill="#FFF" stroke="#F7B3D7" strokeWidth="2"/><path d="M7 16c6 0 9-5 9-9v-.5A6.5 6.5 0 0 0 18 5a6.5 6.5 0 0 1-2 .5A3.5 3.5 0 0 0 17 4a6.5 6.5 0 0 1-2 .5A3.5 3.5 0 0 0 7 8.5c0 .3 0 .6.1.9A9.9 9.9 0 0 1 4 5.5s-4 9 5 13c-1.5 1-3.5 1-5 1 9 5 20 0 20-11.5 0-.2 0-.4 0-.6A7.2 7.2 0 0 0 22 6.5" stroke="#3B3B3B" strokeWidth="1.5" fill="none"/></svg>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-[#3B3B3B] mb-3">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-2 text-[#7FC29B] hover:text-[#3B3B3B] text-lg font-semibold">
                  <span style={{ fontSize: 22 }}>🏠</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center gap-2 text-[#7FC29B] hover:text-[#3B3B3B] text-lg font-semibold">
                  <span style={{ fontSize: 22 }}>📖</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="flex items-center gap-2 text-[#7FC29B] hover:text-[#3B3B3B] text-lg font-semibold">
                  <span style={{ fontSize: 22 }}>🍽️</span> Food Gallery
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="flex items-center gap-2 text-[#7FC29B] hover:text-[#3B3B3B] text-lg font-semibold">
                  <span style={{ fontSize: 22 }}>💼</span> Careers
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-[#3B3B3B] mb-3">Contact Us</h3>
            <ul className="space-y-2 text-lg">
              <li className="flex items-center gap-2 text-[#7FC29B]">
                <span style={{ fontSize: 22 }}>📍</span> 840 River Rd, New Milford, NJ
              </li>
              <li className="flex items-center gap-2 text-[#7FC29B]">
                <span style={{ fontSize: 22 }}>📞</span> (201) 402-9600
              </li>
              <li className="flex items-center gap-2 text-[#7FC29B]">
                <span style={{ fontSize: 22 }}>📧</span> aloha@kailani.com
              </li>
              <li className="flex items-center gap-2 text-[#7FC29B]">
                <span style={{ fontSize: 22 }}>🕒</span>
                <Link to="/contact?tab=hours" className="text-[#F7B3D7] hover:text-[#B2DFFC] font-semibold underline ml-1">View all hours</Link>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold text-[#3B3B3B] mb-3">Join Our Ohana</h3>
            <p className="text-[#7FC29B] mb-4 text-base">Subscribe for special offers and updates!</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="rounded-full border-2 border-[#B2DFFC] px-4 py-2 text-lg bg-[#FFF] focus:outline-none focus:border-[#B2DFFC] placeholder-[#B2DFFC]"
                aria-label="Email for newsletter"
              />
              <button type="button" className="rounded-full bg-[#B2DFFC] hover:bg-[#E7F8FF] text-[#3B3B3B] font-bold px-6 py-2 text-lg border-2 border-[#B2DFFC] transition-colors duration-200">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        {/* Bottom section */}
        <div className="mt-12 pt-6 border-t-2 border-[#B2DFFC] w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#B2DFFC] text-base mb-4 md:mb-0">&copy; {currentYear} {restaurantName} | All Rights Reserved</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-base">
              <a href="#" className="text-[#B2DFFC] hover:text-[#3B3B3B]">Privacy Policy</a>
              <a href="#" className="text-[#B2DFFC] hover:text-[#3B3B3B]">Terms of Service</a>
              <a href="#" className="text-[#B2DFFC] hover:text-[#3B3B3B]">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default KailaniFooter;
