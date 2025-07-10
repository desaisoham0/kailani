import React from 'react';
import { Link } from 'react-router-dom';

interface KailaniFooterProps {
  restaurantName: string;
}

const KailaniFooter: React.FC<KailaniFooterProps> = ({ restaurantName }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#19b4bd] pt-12 pb-6 text-white font-sans relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 rounded-br-full bg-white/10"></div>
      <div className="absolute top-1/3 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/4 w-16 h-16 rounded-full bg-white/5"></div>
      
      {/* Order Online CTA Banner */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 baloo-regular rounded-3xl bg-white shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#19b4bd] mb-2">Taste of Hawaii</h3>
          <p className="text-base text-[#003F47]">Fresh flavors delivered straight to your door</p>
        </div>
        <a 
          href="https://order.toasttab.com/online/kailanishaveice" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-8 py-4 text-base font-bold rounded-full bg-[#b8f3f6] text-[#222222]  border-[#0e8a91] shadow-[0_6px_0_rgb(14,138,145)] hover:shadow-[0_4px_0px_rgb(14,138,145)] hover:translate-y-1 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          ORDER NOW
        </a>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 baloo-regular">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo and About */}
          <div className="md:col-span-5 flex flex-col">
            <h2 className="text-2xl font-bold tracking-wide text-white md:text-3xl lg:text-4xl xl:text-5xl px-0.5"
            style={{
                    fontFamily: 'Baloo, sans-serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '0.04em',
                    textShadow: '-4px 4px 0px oklch(70.4% 0.04 256.788)'
                  }}
          >{restaurantName}</h2>
            <p className="text-white/90 mb-6 text-lg leading-relaxed">
              Experience the authentic taste of Hawaii with our delicious dishes made with aloha!
            </p>
            <div className="flex space-x-5 mt-2">
              <a 
                href="https://facebook.com" 
                aria-label="Facebook" 
                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#19b4bd] hover:bg-yellow-400 transition-colors"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 8H17V4h-3.5a4.5 4.5 0 00-4.5 4.5v2.5H6v4h3v8h4v-8h3.5l.5-4h-4v-2.5A.5.5 0 0113.5 8z"/></svg>
              </a>
              <a 
                href="https://instagram.com" 
                aria-label="Instagram" 
                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#19b4bd] hover:bg-yellow-400 transition-colors"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-2.716 0-3.056.012-4.123.06-1.064.049-1.791.218-2.427.465a4.902 4.902 0 00-1.772 1.153A4.902 4.902 0 002.525 5.45c-.247.636-.416 1.363-.465 2.427C2.012 8.944 2 9.284 2 12s.012 3.056.06 4.123c.049 1.064.218 1.791.465 2.427a4.902 4.902 0 001.153 1.772 4.902 4.902 0 001.772 1.153c.636.247 1.363.416 2.427.465 1.067.048 1.407.06 4.123.06s3.056-.012 4.123-.06c1.064-.049 1.791-.218 2.427-.465a4.902 4.902 0 001.772-1.153 4.902 4.902 0 001.153-1.772c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123s-.012-3.056-.06-4.123c-.049-1.064-.218-1.791-.465-2.427a4.902 4.902 0 00-1.153-1.772 4.902 4.902 0 00-1.772-1.153c-.636-.247-1.363-.416-2.427-.465C15.056 2.012 14.716 2 12 2zm0 1.802c2.67 0 2.986.01 4.04.058.976.045 1.505.207 1.858.344.466.181.8.398 1.15.748.35.35.566.684.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.044.976-.207 1.505-.344 1.858-.181.466-.398.8-.748 1.15-.35.35-.684.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.044-1.505-.207-1.858-.344a3.097 3.097 0 01-1.15-.748 3.097 3.097 0 01-.748-1.15c-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.045-.976.207-1.505.344-1.858.181-.466.398-.8.748-1.15.35-.35.684-.567 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.041-.058zm0 11.531a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm0-8.468a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm6.538-.203a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/></svg>
              </a>
              <a 
                href="https://twitter.com" 
                aria-label="Twitter" 
                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#19b4bd] hover:bg-yellow-400 transition-colors"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-3 md:ml-auto">
            <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-white/20">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-white hover:text-yellow-400 text-lg font-medium flex items-center group">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-yellow-400 text-lg font-medium flex items-center group">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-white hover:text-yellow-400 text-lg font-medium flex items-center group">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-white hover:text-yellow-400 text-lg font-medium flex items-center group">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact?tab=hours" className="text-white hover:text-yellow-400 text-lg font-medium flex items-center group">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  Hours & Location
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-white/20">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-3 mt-1 p-1.5 bg-white/10 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <span className="text-white/90 text-lg">840 River Rd, New Milford, NJ</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 p-1.5 bg-white/10 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <span className="text-white/90 text-lg">(201) 402-9600</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 p-1.5 bg-white/10 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className="text-white/90 text-lg">aloha@kailani.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-16 pt-6 border-t border-white/20 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/80 text-base">&copy; {currentYear} {restaurantName} | All Rights Reserved</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-8 text-base">
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default KailaniFooter;
