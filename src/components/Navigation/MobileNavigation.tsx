import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/Kailani_logo.png';
import '../../styles/fonts.css';


type NavigationItem = {
 readonly label: string;
 readonly href: string;
 readonly isExternalLink: boolean;
};


type MobileNavigationProps = {
 readonly restaurantName?: string;
};


type MenuState = {
 readonly isMenuOpen: boolean;
};


const RESTAURANT_CONFIG = {
 defaultName: 'KAILANI',
 tagline: 'Hawaiian SHAVE ICE & RAMEN',
 description: 'Your Tropical Food Adventure!',
 orderUrl: 'https://order.toasttab.com/online/kailanishaveice',
} as const;


const NAVIGATION_ITEMS: readonly NavigationItem[] = [
 { label: 'Home', href: '/', isExternalLink: false },
 { label: 'Menu', href: '/gallery', isExternalLink: false },
 { label: 'Order Now', href: RESTAURANT_CONFIG.orderUrl, isExternalLink: true },
 { label: 'Careers', href: '/jobs', isExternalLink: false },
 { label: 'About Us', href: '/about', isExternalLink: false },
 { label: 'Contact', href: '/contact', isExternalLink: false },
] as const;


export const MobileNavigation = React.memo(({ restaurantName }: MobileNavigationProps) => {
 const [menuState, setMenuState] = useState<MenuState>({ isMenuOpen: false });


 const displayName = restaurantName ?? RESTAURANT_CONFIG.defaultName;


 const toggleMenuVisibility = useCallback(() => {
   setMenuState(prevState => {
     const nextMenuState = !prevState.isMenuOpen;
     document.body.style.overflow = nextMenuState ? 'hidden' : 'auto';
     return { isMenuOpen: nextMenuState };
   });
 }, []);


 const closeMenu = useCallback(() => {
   setMenuState({ isMenuOpen: false });
   document.body.style.overflow = 'auto';
 }, []);


 useEffect(() => {
   const handleOutsideClick = (event: MouseEvent) => {
     const clickTarget = event.target as HTMLElement;
     const isClickInsideMenu = clickTarget.closest('[data-menu-content]');
     const isClickOnMenuButton = clickTarget.closest('[data-menu-button]');
    
     if (menuState.isMenuOpen && !isClickInsideMenu && !isClickOnMenuButton) {
       closeMenu();
     }
   };


   if (menuState.isMenuOpen) {
     document.addEventListener('mousedown', handleOutsideClick);
     return () => document.removeEventListener('mousedown', handleOutsideClick);
   }
 }, [menuState.isMenuOpen, closeMenu]);


 const BrandLogo = ({ name }: { name: string }) => (
   <Link to="/" className="flex min-w-0 items-center justify-start gap-2">
     {/* <div className="flex-shrink-0">
       <img
         src={logoImage}
         srcSet="/Kailani_logo.webp 1x, /Kailani_logo.png 2x"
         sizes="(max-width: 600px) 100vw, 48px"
         alt="Kailani Logo"
         loading="lazy"
         className="h-10 w-10 object-contain"
       />
     </div> */}
     <div className="flex items-center justify-center min-w-0">
       <span
         className="baloo-regular text-4xl font-bold tracking-wide text-[#f7d34f]"
         style={{
                fontFamily: 'Baloo, sans-serif',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: '0.04em',
                textShadow: '-3px 3px 0px #7F4F00'
              }}
       >
         {name}
       </span>
     </div>
   </Link>
 );


 const QuickOrderButton = () => (
   <a
     href={RESTAURANT_CONFIG.orderUrl}
     target="_blank"
     rel="noopener noreferrer"
     className="baloo-regular flex items-center bg-transparent px-4 py-2 text-lg font-bold rounded-2xl border-1 border-[#f7d34f] text-white shadow-[0_2px_0_rgb(247,217,84)] transition-all duration-300 ease-out hover:text-white hover:underline hover:decoration-2 hover:decoration-white hover:underline-offset-2"
   >
     Order
   </a>
 );


 const MenuToggleButton = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => (
   <button
     onClick={onToggle}
     data-menu-button
     className="flex items-center justify-center rounded-lg bg-[#f7d34f] p-2 transition-colors duration-300 hover:bg-white"
     aria-label={isOpen ? "Close menu" : "Open menu"}
   >
     <svg
       className="h-6 w-6 text-[#e83838] transition-transform duration-300"
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
   </button>
 );


 const NavigationLink = ({ item, onClick }: { item: NavigationItem; onClick: () => void }) => {
   const baseClassName = "baloo-regular flex items-center justify-center rounded-3xl border-1 border-[#f0c91f] bg-transparent p-4 text-lg font-semibold text-white shadow-[0_6px_0_rgb(247,217,84)] transition-all duration-300 ease-out hover:border-white hover:bg-[#19b4bd]/30 hover:text-[#f0c91f] hover:underline hover:decoration-2 hover:underline-offset-2";
  
   if (item.isExternalLink) {
     return (
       <a
         href={item.href}
         target="_blank"
         rel="noopener noreferrer"
         className={baseClassName}
         style={{ fontFamily: 'Baloo, sans-serif' }}
         onClick={onClick}
       >
         {item.label}
       </a>
     );
   }


   return (
     <Link
       to={item.href}
       className={baseClassName}
       style={{ fontFamily: 'Baloo, sans-serif' }}
       onClick={onClick}
     >
       {item.label}
     </Link>
   );
 };


 const MenuHeader = () => (
  <header className="py-0">
    <div className="container mx-auto flex justify-center">
      <div className="flex flex-row items-center">
        <img
          src={logoImage}
          alt="Kailani Logo"
          className="h-36 w-36 flex-shrink-0"
        />
        <div className="space-y-0">
          <h3 className="baloo-regular text-[#f7d34f] font-bold text-lg sm:text-xl drop-shadow-sm">
            Hawaiian
          </h3>
          <h1 
            className="baloo-regular text-[#f7d34f] font-extrabold text-4xl sm:text-5xl pr-9"
            style={{
              fontFamily: 'Baloo, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.06em',
              textShadow: '-4px 4px 0px #7F4F00'
            }}
          >
            SHAVE ICE
          </h1>
          <h2 
            className="baloo-regular text-white font-bold text-2xl sm:text-3xl"
            style={{
              fontFamily: 'Baloo, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.04em',
              textShadow: '-2px 2px 0px #e85fa8'
            }}
          >
            &amp; Ramen
          </h2>
        </div>
      </div>
    </div>
  </header>
 );


 const NavigationMenu = ({ items, onItemClick }: { items: readonly NavigationItem[]; onItemClick: () => void }) => (
   <nav className="flex flex-1 flex-col gap-4 px-2 pb-20">
     {items.map((item) => (
       <div key={item.label} className="relative">
         <NavigationLink item={item} onClick={onItemClick} />
       </div>
     ))}
   </nav>
 );


 return (
   <>
     <header className="sticky top-0 z-30 w-full max-w-full overflow-hidden border-b-2 border-[#ffe0f0] bg-[#e83838] shadow-xl">
       <div className="flex w-full flex-row items-center justify-between border-b-2 border-[#ffe0f0] px-4 py-3">
         <BrandLogo name={displayName} />
        
         <div className="flex gap-2">
           <QuickOrderButton />
           <MenuToggleButton
             isOpen={menuState.isMenuOpen}
             onToggle={toggleMenuVisibility}
           />
         </div>
       </div>
     </header>
    
     <div
       className={`fixed inset-0 z-40 w-full max-w-full bg-gradient-to-b from-[#e83838] via-[#19b4bd] to-amber-900 backdrop-blur-md transition-all duration-300 ${
         menuState.isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
       }`}
     >
       <div
         data-menu-content
         className="relative z-10 flex h-full w-full max-w-full flex-col overflow-x-hidden overflow-y-auto p-6 pt-20"
       >
         <button
           onClick={closeMenu}
           className="absolute right-6 top-6 rounded-lg bg-[#f0c91f] p-3 text-xl font-bold text-amber-900 transition-colors duration-300 hover:bg-white hover:text-[#19b4bd]"
           aria-label="Close menu"
         >
           <span className="baloo-regular">×</span>
         </button>


         <MenuHeader />
         <NavigationMenu items={NAVIGATION_ITEMS} onItemClick={closeMenu} />
       </div>
     </div>
   </>
 );
});