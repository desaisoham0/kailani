import React from 'react';
import { MobileNavigation } from '../Navigation/MobileNavigation';
import { DesktopNavigation } from '../Navigation/DesktopNavigation';
import { useIsMobile, useIsDesktop } from '../../hooks/useMediaQuery';

interface RestaurantHeaderProps {
  restaurantName?: string;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurantName }) => {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  return (
    <div className="restaurant-header-wrapper relative">
      {isMobile && <MobileNavigation restaurantName={restaurantName} />}
      {isDesktop && <DesktopNavigation restaurantName={restaurantName} />}
      
      {/* Enhanced decorative elements for playfulness */}
      <div className="hidden md:block absolute top-0 right-0 w-28 h-28 -mt-10 -mr-10 z-0">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300 opacity-20 circle-pulse"></div>
      </div>
      <div className="hidden md:block absolute bottom-0 left-0 w-20 h-20 -mb-6 -ml-6 z-0">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-300 opacity-20 circle-pulse" 
             style={{animationDelay: '1s', animationDuration: '4s'}}></div>
      </div>
      
      {/* Additional playful elements with enhanced colors */}
      <div className="hidden md:block absolute top-20 right-32 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-300 to-amber-300 opacity-30 circle-pulse"
           style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
      <div className="hidden md:block absolute bottom-12 right-48 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-25 circle-pulse"
           style={{animationDelay: '1.5s', animationDuration: '5s'}}></div>
      
      {/* New decorative elements */}
      <div className="hidden md:block absolute top-16 left-40 w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-red-400 opacity-30 circle-pulse"
           style={{animationDelay: '0.7s', animationDuration: '4.5s'}}></div>
      <div className="hidden md:block absolute bottom-8 left-80 w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 opacity-25 circle-pulse"
           style={{animationDelay: '2s', animationDuration: '5.5s'}}></div>
           
      {/* Subtle wave on top */}
      <div className="absolute -top-2 left-0 w-full h-16 overflow-hidden z-0 opacity-10 hidden md:block">
        <svg className="absolute top-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                fill="#ffffff"></path>
        </svg>
      </div>
    </div>
  );
};