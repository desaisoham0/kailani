import React from 'react';
import { MobileNavigation } from '../Navigation/MobileNavigation';
import { DesktopNavigation } from '../Navigation/DesktopNavigation';
import { useIsMobile } from '../../hooks/useMediaQuery';


interface RestaurantHeaderProps {
 restaurantName?: string;
}


export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurantName }) => {
 const isMobile = useIsMobile();


 return (
   <div className="restaurant-header-wrapper relative w-full max-w-full overflow-x-hidden">
     {isMobile ? (
       <MobileNavigation restaurantName={restaurantName} />
     ) : (
       <DesktopNavigation />
     )}
   </div>
 );
};