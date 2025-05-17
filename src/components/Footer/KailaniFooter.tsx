import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/footerAnimations.css';

interface KailaniFooterProps {
  restaurantName: string;
}

const KailaniFooter: React.FC<KailaniFooterProps> = ({ restaurantName }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer-bg relative overflow-hidden mt-12">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-amber-400 via-cyan-500 to-purple-500 footer-wave"></div>
      
      <div className="footer-bubble bubble-1"></div>
      <div className="footer-bubble bubble-2"></div>
      <div className="footer-bubble bubble-3"></div>
      
      {/* Prominent Order Online CTA Banner */}
      <div className="relative z-10 px-4 py-6 order-banner overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="order-banner-icon bounce-slow mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                {/* Hawaiian cuisine themed icon: bowl with steam */}
                <path d="M12 2C6.48 2 2 6.48 2 12c0 2.21.74 4.26 1.98 5.92C5.23 19.58 7.66 20 12 20c4.34 0 6.77-.42 8.02-2.08C21.26 16.26 22 14.21 22 12 22 6.48 17.52 2 12 2z" />
                <path d="M7.5 14.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm5.5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm5.5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" />
                <path d="M10 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fillOpacity="0.7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white jua-regular">Hungry? Don't wait!</h3>
              <p className="text-white opacity-90 nunito-sans text-sm md:text-base">Fresh Hawaiian flavors delivered to your door</p>
            </div>
          </div>
          <a 
            href="https://order.toasttab.com/online/kailanishaveice" 
            target="_blank" 
            rel="noopener noreferrer"
            className="order-banner-button"
            aria-label="Order Online from Kailani"
          >
            <span>ORDER NOW</span>
            <span className="order-banner-button-icon">🍽️</span>
          </a>
        </div>
        
        {/* Decorative food icons */}
        <div className="food-icon food-icon-1">🍍</div>
        <div className="food-icon food-icon-2">🌺</div>
        <div className="food-icon food-icon-3">🥥</div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="text-2xl font-bold mb-4 jua-regular text-white footer-logo">
              {restaurantName}
            </div>
            <p className="text-teal-100 mb-4 nunito-sans text-center md:text-left">
              Experience the taste of Hawaii with our delicious dishes made with aloha!
            </p>
            
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="social-icon facebook" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="https://instagram.com" className="social-icon instagram" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://twitter.com" className="social-icon twitter" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link"
                    onClick={() => {
                        window.scrollTo(0, 0);
                    }}
                >
                  <span className="footer-link-icon">🏠</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link"
                    onClick={() => {
                        window.scrollTo(0, 0);
                    }}
                >
                  <span className="footer-link-icon">📖</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="footer-link"
                    onClick={() => {
                        window.scrollTo(0, 0);
                    }}
                >
                  <span className="footer-link-icon">🍽️</span> Food Gallery
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="footer-link"
                    onClick={() => {
                        window.scrollTo(0, 0);
                    }}
                >
                  <span className="footer-link-icon">💼</span> Careers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-links">
              <li className="footer-contact-item">
                <span className="footer-link-icon">📍</span> 840 River Rd, New Milford, NJ
              </li>
              <li className="footer-contact-item">
                <span className="footer-link-icon">📞</span> (201) 402-9600
              </li>
              <li className="footer-contact-item">
                <span className="footer-link-icon">📧</span> aloha@kailani.com
              </li>
              <li className="footer-contact-item group relative">
                <span className="footer-link-icon">🕒</span> 
                <Link 
                    to="/contact?tab=hours" 
                    className="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium transition-all duration-300 transform hover:translate-x-1 group-hover:translate-x-1"
                    aria-label="View our detailed opening hours"
                    onClick={() => {
                        window.scrollTo(0, 0);
                        }}
                >
                    <span className="text-xs bg-gradient-to-r from-amber-500 to-amber-400 text-white px-2 py-1 rounded-full">
                    View all hours
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
                </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="footer-heading">Join Our Ohana</h3>
            <p className="text-teal-100 mb-4 nunito-sans">
              Subscribe for special offers and updates!
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="footer-input" 
                aria-label="Email for newsletter"
              />
              <button type="button" className="footer-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-6 border-t border-teal-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-teal-200 text-sm nunito-sans mb-4 md:mb-0">
              &copy; {currentYear} {restaurantName} | All Rights Reserved
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-teal-200 hover:text-white transition-colors nunito-sans">Privacy Policy</a>
              <a href="#" className="text-teal-200 hover:text-white transition-colors nunito-sans">Terms of Service</a>
              <a href="#" className="text-teal-200 hover:text-white transition-colors nunito-sans">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default KailaniFooter;
