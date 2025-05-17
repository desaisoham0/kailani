import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/Kailani_logo.png';

interface NavItem {
  label: string;
  href: string;
  isRouterLink?: boolean;
  icon?: string; // Added icon property for navigation items
}

interface MobileNavigationProps {
  restaurantName?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ restaurantName }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems: NavItem[] = [
    { label: 'Home', href: '/', isRouterLink: true, icon: '🏠' },
    { label: 'Gallery', href: '/gallery', isRouterLink: true, icon: '🖼️' },
    { label: 'Careers', href: '/jobs', isRouterLink: true, icon: '💼' },
    { label: 'About US', href: '/about', isRouterLink: true, icon: '📝' },
    { label: 'Contact', href: '/contact', isRouterLink: true, icon: '📞' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-menu-content') && !target.closest('.mobile-menu-button')) {
        toggleMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 w-full md:hidden shadow-lg header-bg-animated">
        {/* Added decorative elements */}
        <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-amber-300 opacity-20 circle-pulse"></div>
        <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-teal-400 opacity-20 circle-pulse" style={{animationDelay: "0.7s"}}></div>
        
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative group">
              {/* Added playful decoration behind logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-teal-300 rounded-full opacity-20 scale-125 group-hover:scale-150 transition-transform duration-500"></div>
              <img 
                src={logoImage} 
                alt="Kailani Logo" 
                className="h-11 w-auto mr-2 drop-shadow-md transform hover:scale-105 transition-transform duration-300 logo-float" 
                style={{animationDuration: "8s"}}
              />
            </div>
            <div className="text-3xl px-3 font-bold text-gradient-animated font-navigation jua-regular"
                style={{textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
              {restaurantName || 'Kailani'}
            </div>
          </div>
          
          {/* Mobile Menu Button - more playful */}
          <div className="flex space-x-2">
            {/* Order Now CTA button */}
            {/* <a 
              href="#order-now" 
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-800 font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-md flex items-center text-sm"
            >
              <span className="mr-1" role="img" aria-hidden="true">🍽️</span>
              Order
            </a> */}
            
            <button 
              onClick={toggleMenu}
              className="mobile-menu-button relative z-50 flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-md"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <svg 
                className="w-6 h-6 text-gray-800" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              {/* Adding a little dot indicator */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay - more playful and colorful */}
      <div 
        className={`fixed inset-0 z-40 transform transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 58, 0.95) 0%, rgba(45, 45, 90, 0.95) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="mobile-menu-content flex flex-col h-full pt-20 p-6">
          {/* Close button - more playful */}
          <button 
            onClick={toggleMenu} 
            className="absolute top-6 right-6 p-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-800 transition-all duration-300 shadow-md transform hover:rotate-90"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Restaurant name in mobile menu with enhanced styling */}
          <div className="flex items-center justify-center mb-10 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300/20 to-teal-300/20 rounded-full scale-150"></div>
            <img 
              src={logoImage} 
              alt="Kailani Logo" 
              className="h-18 w-auto mr-3 drop-shadow-lg logo-float" 
            />
            <div 
              className="text-3xl font-bold font-navigation jua-regular text-gradient-animated"
              style={{textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}
            >
              {restaurantName || 'Kailani'}
            </div>
          </div>

          {/* Menu items with enhanced playful animation */}
          <nav className="flex flex-col gap-4 px-2">
            {navItems.map((item, index) => (
              item.isRouterLink ? (
                <Link 
                  key={item.label}
                  to={item.href} 
                  className="mobile-menu-item-animation text-xl font-medium font-navigation jua-regular px-5 py-4 text-white rounded-xl transition-all duration-300 hover:bg-gradient-to-r from-amber-500/90 to-amber-400/90 hover:text-gray-800 hover:translate-x-2 flex items-center"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: isOpen ? 1 : 0,
                    transition: `transform 0.3s ease ${index * 0.05}s, opacity 0.3s ease ${index * 0.05}s, background 0.3s ease`
                  }}
                  onClick={toggleMenu}
                >
                  <span className="mr-3 text-2xl" role="img" aria-hidden="true">{item.icon}</span>
                  {item.label}
                  <svg className="w-5 h-5 ml-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <a 
                  key={item.label}
                  href={item.href} 
                  className="mobile-menu-item-animation text-xl font-medium font-navigation jua-regular px-5 py-4 text-white rounded-xl transition-all duration-300 hover:bg-gradient-to-r from-amber-500/90 to-amber-400/90 hover:text-gray-800 hover:translate-x-2 flex items-center"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: isOpen ? 1 : 0,
                    transition: `transform 0.3s ease ${index * 0.05}s, opacity 0.3s ease ${index * 0.05}s, background 0.3s ease`
                  }}
                  onClick={toggleMenu}
                >
                  <span className="mr-3 text-2xl" role="img" aria-hidden="true">{item.icon}</span>
                  {item.label}
                  <svg className="w-5 h-5 ml-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )
            ))}
            
            {/* Order Now CTA button - large and prominent */}
            {/* <a 
              href="#order-now" 
              className="mt-4 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-800 font-bold rounded-xl transition-all duration-300 hover:from-amber-500 hover:to-amber-600 flex items-center justify-center text-xl shadow-lg mobile-menu-item-animation"
              style={{ 
                animationDelay: `${navItems.length * 100 + 100}ms`,
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isOpen ? 1 : 0,
                transition: `transform 0.4s ease ${navItems.length * 0.05 + 0.1}s, opacity 0.4s ease ${navItems.length * 0.05 + 0.1}s`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onClick={toggleMenu}
            >
              <span className="mr-2 text-2xl" role="img" aria-hidden="true">🍽️</span>
              Order Now
            </a> */}
          </nav>

          {/* Enhanced decorative elements */}
          <div className="absolute bottom-10 left-6 w-24 h-24 rounded-full bg-amber-400 opacity-15 circle-pulse"></div>
          <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-teal-400 opacity-15 logo-float"></div>
          <div className="absolute bottom-40 right-10 w-16 h-16 rounded-full bg-pink-400 opacity-15 circle-pulse" style={{animationDelay: "1.2s"}}></div>
          <div className="absolute top-60 left-8 w-12 h-12 rounded-full bg-blue-400 opacity-15 circle-pulse" style={{animationDelay: "0.8s"}}></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400 opacity-10 circle-pulse" style={{animationDuration: "8s", zIndex: -1}}></div>
          
          {/* Added playful waves at the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden leading-none z-0">
            <svg className="absolute bottom-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".15" fill="#FFB800"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".2" fill="#5EEAD4"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" opacity=".25" fill="#EC4899"></path>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};
