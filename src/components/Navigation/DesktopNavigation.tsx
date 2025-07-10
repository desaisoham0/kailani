import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/Kailani_logo.png';
import '../../styles/fonts.css';


type NavigationItem = {
 readonly label: string;
 readonly href: string;
 readonly isExternalLink: boolean;
 readonly ariaLabel?: string;
};


const RESTAURANT_CONFIG = {
 name: 'KAILANI',
 orderUrl: 'https://order.toasttab.com/online/kailanishaveice',
} as const;


const NAVIGATION_ITEMS: readonly NavigationItem[] = [
 { label: 'Home', href: '/', isExternalLink: false, ariaLabel: 'Go to homepage' },
 { label: 'Menu', href: '/gallery', isExternalLink: false, ariaLabel: 'View our menu gallery' },
 { label: 'Order Now', href: RESTAURANT_CONFIG.orderUrl, isExternalLink: true, ariaLabel: 'Order food online (opens in new tab)' },
 { label: 'Careers', href: '/jobs', isExternalLink: false, ariaLabel: 'View job opportunities' },
 { label: 'About Us', href: '/about', isExternalLink: false, ariaLabel: 'Learn about us' },
 { label: 'Contact', href: '/contact', isExternalLink: false, ariaLabel: 'Contact information' },
] as const;


export const DesktopNavigation = React.memo(() => {
 const location = useLocation();
 const currentPath = location.pathname;

 const BrandLogo = React.memo(({ name }: { name: string }) => {
   const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
     console.warn('Logo image failed to load');
     event.currentTarget.style.display = 'none';
   };

   return (
     <Link 
       to="/" 
       className="flex min-w-0 items-center gap-2 md:gap-3 lg:gap-4"
       aria-label="Go to homepage"
     >
       <img
         src={logoImage}
         alt="Kailani restaurant logo"
         loading="lazy"
         className="h-10 w-auto flex-shrink-0 md:h-12 lg:h-16 xl:h-20"
         onError={handleImageError}
         width="80"
         height="80"
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
         aria-hidden="true"
       >
         {name}
       </span>
     </Link>
   );
 });
 BrandLogo.displayName = 'BrandLogo';


 const NavigationLink = React.memo(({ item, isCurrentPage }: { item: NavigationItem; isCurrentPage: boolean }) => {
   const baseClassName = "baloo-regular relative flex items-center bg-transparent px-2 py-2 text-sm font-semibold transition-all duration-300 ease-out hover:text-white hover:underline hover:decoration-2 hover:decoration-white hover:underline-offset-2 md:px-3 md:py-3 md:text-base lg:px-4 lg:py-3 lg:text-lg xl:px-5 xl:py-4 xl:text-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#e83838]";
  
   const linkClassName = `${baseClassName} ${
     isCurrentPage
       ? 'text-white underline decoration-2 decoration-white underline-offset-2'
       : 'text-[#f7d34f]'
   }`;

   const commonProps = {
     className: linkClassName,
     'aria-label': item.ariaLabel || item.label,
     'aria-current': isCurrentPage ? 'page' as const : undefined,
   };

   if (item.isExternalLink) {
     return (
       <a
         href={item.href}
         target="_blank"
         rel="noopener noreferrer"
         {...commonProps}
       >
         {item.label}
       </a>
     );
   }

   return (
     <Link
       to={item.href}
       {...commonProps}
     >
       {item.label}
     </Link>
   );
 });
 NavigationLink.displayName = 'NavigationLink';


 const NavigationMenu = React.memo(({ items, currentPath }: { items: readonly NavigationItem[]; currentPath: string }) => (
   <nav 
     className="flex min-w-0 flex-1 items-center justify-end gap-1 md:gap-2 lg:gap-3 xl:gap-4"
     role="navigation"
     aria-label="Main navigation"
   >
     {items.map((item) => (
       <NavigationLink
         key={item.href}
         item={item}
         isCurrentPage={currentPath === item.href}
       />
     ))}
   </nav>
 ));
 NavigationMenu.displayName = 'NavigationMenu';

 return (
   <header 
     className="sticky top-0 z-30 w-full max-w-full overflow-hidden border-b-2 border-[#ffe0f0] bg-[#e83838] shadow-xl"
     role="banner"
   >
     <div className="flex w-full flex-row items-center justify-between border-b-2 border-[#ffe0f0] px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-12 xl:py-6">
       <BrandLogo name={RESTAURANT_CONFIG.name} />
       <NavigationMenu items={NAVIGATION_ITEMS} currentPath={currentPath} />
     </div>
   </header>
 );
});

DesktopNavigation.displayName = 'DesktopNavigation';