import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/Kailani_logo.png';
import '../../styles/fonts.css';


type NavigationItem = {
 readonly label: string;
 readonly href: string;
 readonly isExternalLink: boolean;
};


type NavigationState = {
 readonly currentPath: string;
};


const RESTAURANT_CONFIG = {
 name: 'KAILANI',
 orderUrl: 'https://order.toasttab.com/online/kailanishaveice',
} as const;


const NAVIGATION_ITEMS: readonly NavigationItem[] = [
 { label: 'Home', href: '/', isExternalLink: false },
 { label: 'Menu', href: '/gallery', isExternalLink: false },
 { label: 'Reviews', href: '/reviews', isExternalLink: false },
 { label: 'Order Now', href: RESTAURANT_CONFIG.orderUrl, isExternalLink: true },
 { label: 'Careers', href: '/jobs', isExternalLink: false },
 { label: 'About Us', href: '/about', isExternalLink: false },
 { label: 'Contact', href: '/contact', isExternalLink: false },
] as const;


export const DesktopNavigation = React.memo(() => {
 const location = useLocation();
 const navigationState: NavigationState = { currentPath: location.pathname };


 const BrandLogo = ({ name }: { name: string }) => (
   <Link to="/" className="flex min-w-0 items-center gap-2 md:gap-3 lg:gap-4">
     <img
       src={logoImage}
       srcSet="/Kailani_logo.webp 1x, /Kailani_logo.png 2x"
       sizes="(max-width: 900px) 120px, (max-width: 1200px) 140px, 160px"
       alt="Kailani Logo"
       loading="lazy"
       className="h-10 w-auto flex-shrink-0 md:h-12 lg:h-16 xl:h-20"
     />
     <span
       className="baloo-regular text-2xl font-bold tracking-wide text-[#f7d34f] md:text-3xl lg:text-4xl xl:text-5xl px-0.5"
       style={{
              fontFamily: 'Baloo, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.04em',
              textShadow: '-4px 4px 0px #7F4F00'
            }}
     >
       {name}
     </span>
   </Link>
 );


 const NavigationLink = ({ item, isCurrentPage }: { item: NavigationItem; isCurrentPage: boolean }) => {
   const baseClassName = "baloo-regular relative flex items-center bg-transparent px-2 py-2 text-sm font-semibold transition-all duration-300 ease-out hover:text-white hover:underline hover:decoration-2 hover:decoration-white hover:underline-offset-2 md:px-3 md:py-3 md:text-base lg:px-4 lg:py-3 lg:text-lg xl:px-5 xl:py-4 xl:text-xl";
  
   const linkClassName = `${baseClassName} ${
     isCurrentPage
       ? 'text-white underline decoration-2 decoration-white underline-offset-2'
       : 'text-[#f7d34f]'
   }`;


   if (item.isExternalLink) {
     return (
       <a
         href={item.href}
         target="_blank"
         rel="noopener noreferrer"
         className={linkClassName}
       >
         {item.label}
       </a>
     );
   }


   return (
     <Link
       to={item.href}
       className={linkClassName}
     >
       {item.label}
     </Link>
   );
 };


 const NavigationMenu = ({ items, currentPath }: { items: readonly NavigationItem[]; currentPath: string }) => (
   <nav className="flex min-w-0 flex-1 items-center justify-end gap-1 md:gap-2 lg:gap-3 xl:gap-4">
     {items.map((item) => (
       <NavigationLink
         key={item.label}
         item={item}
         isCurrentPage={currentPath === item.href}
       />
     ))}
   </nav>
 );


 return (
   <header className="sticky top-0 z-30 w-full max-w-full overflow-hidden border-b-2 border-[#ffe0f0] bg-[#e83838] shadow-xl">
     <div className="flex w-full flex-row items-center justify-between border-b-2 border-[#ffe0f0] px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-12 xl:py-6">
       <BrandLogo name={RESTAURANT_CONFIG.name} />
       <NavigationMenu items={NAVIGATION_ITEMS} currentPath={navigationState.currentPath} />
     </div>
   </header>
 );
});