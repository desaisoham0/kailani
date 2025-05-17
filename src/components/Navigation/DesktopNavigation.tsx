import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/Kailani_logo.png';

interface NavItem {
  label: string;
  href: string;
  isRouterLink?: boolean;
  icon?: string; // Added icon property for navigation items
}

interface DesktopNavigationProps {
  restaurantName?: string;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ restaurantName }) => {
  const navItems: NavItem[] = [
    { label: 'Home', href: '/', isRouterLink: true },
    { label: 'Gallery', href: '/gallery', isRouterLink: true},
    { label: 'Careers', href: '/jobs', isRouterLink: true},
    { label: 'About US', href: '/about', isRouterLink: true},
    { label: 'Contact', href: '/contact', isRouterLink: true},
  ];

  return (
    <header 
      className="sticky top-0 z-30 w-full shadow-lg overflow-hidden header-bg-animated" 
    >
      {/* Decorative elements */}
      <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-amber-300 opacity-20 circle-pulse"></div>
      <div className="absolute -bottom-5 -right-5 w-16 h-16 rounded-full bg-teal-400 opacity-20 circle-pulse" style={{animationDelay: "1s"}}></div>
      <div className="absolute top-6 right-32 w-8 h-8 rounded-full bg-pink-400 opacity-20 circle-pulse" style={{animationDelay: "1.5s"}}></div>
      
      <div className="container mx-auto py-4 px-4 flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <Link to="/" className="group relative">
            {/* Added playful decoration behind logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-teal-300 rounded-full opacity-20 scale-125 group-hover:scale-150 transition-transform duration-500"></div>
            <img 
              src={logoImage} 
              alt="Kailani Logo" 
              className="h-14 w-auto mr-3 drop-shadow-md transform group-hover:scale-110 transition-transform duration-300 logo-float" 
            />
          </Link>
          <div 
            className="text-5xl px-5 font-bold font-navigation jua-regular text-gradient-animated"
            style={{textShadow: '0 2px 4px rgba(0,0,0,0.15)'}}
          >
            {restaurantName || 'Kailani'}
          </div>
        </div>
        <nav className="hidden md:flex space-x-3">
          {navItems.map((item) => (
            item.isRouterLink ? (
              <Link
                key={item.label}
                to={item.href}
                className="nav-link flex items-center px-4 py-2.5 text-lg text-white font-medium font-navigation jua-regular relative transition-all duration-300 hover:text-amber-400 group nav-link-hover-effect rounded-full hover:bg-white/10 backdrop-blur-sm"
              >
                <span className="mr-1.5 text-xl" role="img" aria-hidden="true">{item.icon}</span>
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-amber-400 to-teal-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="nav-link flex items-center px-4 py-2.5 text-lg text-white font-medium font-navigation jua-regular relative transition-all duration-300 hover:text-amber-400 group nav-link-hover-effect rounded-full hover:bg-white/10 backdrop-blur-sm"
              >
                <span className="mr-1.5 text-xl" role="img" aria-hidden="true">{item.icon}</span>
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-amber-400 to-teal-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            )
          ))}
          {/* Call to action button
          <a 
            href="#order-now" 
            className="ml-2 px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-800 font-bold rounded-full transition-all duration-300 hover:from-amber-500 hover:to-amber-600 hover:scale-105 shadow-lg flex items-center"
          >
            <span className="mr-1.5 text-xl" role="img" aria-hidden="true">🍽️</span>
            Order Now
          </a> */}
        </nav>
      </div>
    </header>
  );
};