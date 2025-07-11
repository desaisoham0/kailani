import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/Kailani_logo.png';
import OnlineOrderingLinks from '../OnlineOrdering/OnlineOrderingLinks';
import '../../styles/fonts.css';

type NavigationItem = {
  readonly label: string;
  readonly href: string;
  readonly isExternalLink: boolean;
  readonly ariaLabel?: string;
};

type MobileNavigationProps = {
  readonly restaurantName?: string;
};

const RESTAURANT_CONFIG = {
  defaultName: 'KAILANI',
  tagline: 'Hawaiian SHAVE ICE & RAMEN',
  description: 'Your Tropical Food Adventure!',
  orderUrl: 'https://order.toasttab.com/online/kailanishaveice',
} as const;

const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
    isExternalLink: false,
    ariaLabel: 'Go to homepage',
  },
  {
    label: 'Menu',
    href: '/menu',
    isExternalLink: false,
    ariaLabel: 'View our menu gallery',
  },
  {
    label: 'Order Now',
    href: RESTAURANT_CONFIG.orderUrl,
    isExternalLink: true,
    ariaLabel: 'Order food online (opens in new tab)',
  },
  {
    label: 'Careers',
    href: '/jobs',
    isExternalLink: false,
    ariaLabel: 'View job opportunities',
  },
  {
    label: 'About Us',
    href: '/about',
    isExternalLink: false,
    ariaLabel: 'Learn about us',
  },
  {
    label: 'Contact',
    href: '/contact',
    isExternalLink: false,
    ariaLabel: 'Contact information',
  },
] as const;

export const MobileNavigation = React.memo(
  ({ restaurantName }: MobileNavigationProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const location = useLocation();
    const menuRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const displayName = restaurantName ?? RESTAURANT_CONFIG.defaultName;

    const toggleMenuVisibility = useCallback(() => {
      setIsMenuOpen(prevState => {
        const nextMenuState = !prevState;
        // Prevent body scroll when menu opens
        if (nextMenuState) {
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.top = `-${window.scrollY}px`;
          document.body.style.width = '100%';
        } else {
          const scrollY = document.body.style.top;
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
        }
        return nextMenuState;
      });
    }, []);

    const closeMenu = useCallback(() => {
      setIsMenuOpen(false);
      // Restore body scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          if (isOrderModalOpen) {
            setIsOrderModalOpen(false);
          } else if (isMenuOpen) {
            closeMenu();
          }
        }
      },
      [isMenuOpen, isOrderModalOpen, closeMenu]
    );

    // Cleanup body overflow on unmount
    useEffect(() => {
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
      };
    }, []);

    // Handle escape key
    useEffect(() => {
      if (isMenuOpen || isOrderModalOpen) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [isMenuOpen, isOrderModalOpen, handleKeyDown]);

    // Handle body scroll for order modal
    useEffect(() => {
      if (isOrderModalOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOrderModalOpen]);

    // Focus management
    useEffect(() => {
      if (isMenuOpen && closeButtonRef.current) {
        closeButtonRef.current.focus();
      } else if (!isMenuOpen && closeButtonRef.current) {
        // Remove focus from close button when menu closes
        closeButtonRef.current.blur();
      }
    }, [isMenuOpen]);

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        const clickTarget = event.target as HTMLElement;
        const isClickInsideMenu = clickTarget.closest('[data-menu-content]');
        const isClickOnMenuButton = clickTarget.closest('[data-menu-button]');

        if (isMenuOpen && !isClickInsideMenu && !isClickOnMenuButton) {
          closeMenu();
        }
      };

      if (isMenuOpen) {
        document.addEventListener('mousedown', handleOutsideClick);
        return () =>
          document.removeEventListener('mousedown', handleOutsideClick);
      }
    }, [isMenuOpen, closeMenu]);

    const BrandLogo = React.memo(({ name }: { name: string }) => (
      <Link
        to="/"
        className="flex min-w-0 items-center justify-start gap-2"
        aria-label="Go to homepage"
        onClick={closeMenu}
      >
        <div className="flex min-w-0 items-center justify-center">
          <span
            className="baloo-regular pt-1 text-4xl font-bold tracking-wide text-[#f7d34f]"
            style={{
              fontFamily: 'Baloo, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.04em',
              textShadow: '-3px 3px 0px #7F4F00',
            }}
            aria-hidden="true"
          >
            {name}
          </span>
        </div>
      </Link>
    ));
    BrandLogo.displayName = 'BrandLogo';

    const QuickOrderButton = React.memo(() => (
      <button
        onClick={() => setIsOrderModalOpen(true)}
        className="baloo-regular flex transform items-center rounded-2xl border-1 border-b-4 border-[#f7d34f] bg-transparent px-4 py-2 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:bg-yellow-500 hover:text-white hover:underline hover:decoration-white hover:decoration-2 hover:underline-offset-2 hover:shadow-xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#e83838] focus:outline-none active:translate-y-1 active:border-b-1 active:shadow-md"
        aria-label="Order food online"
        aria-haspopup="dialog"
      >
        Order
      </button>
    ));
    QuickOrderButton.displayName = 'QuickOrderButton';

    const MenuToggleButton = React.memo(
      ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => (
        <button
          onClick={onToggle}
          data-menu-button
          className="flex transform items-center justify-center rounded-full bg-[#f7d34f] p-2 shadow-lg transition-all duration-200 hover:bg-yellow-500 hover:shadow-xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#e83838] focus:outline-none active:translate-y-1 active:shadow-md"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-menu"
        >
          <svg
            className="h-6 w-6 text-[#e83838] transition-transform duration-300"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )
    );
    MenuToggleButton.displayName = 'MenuToggleButton';

    const NavigationLink = React.memo(
      ({
        item,
        onClick,
        isCurrentPage,
      }: {
        item: NavigationItem;
        onClick: () => void;
        isCurrentPage: boolean;
      }) => {
        const baseClassName =
          'baloo-regular flex items-center justify-center rounded-3xl border-1 border-[#f0c91f] bg-transparent p-4 text-lg font-semibold text-white shadow-[0_6px_0_rgb(247,217,84)] transition-all duration-300 ease-out hover:border-white hover:bg-[#19b4bd]/30 hover:text-[#f0c91f] hover:underline hover:decoration-2 hover:underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#19b4bd]';

        const linkClassName = `${baseClassName} ${
          isCurrentPage ? 'border-white bg-[#19b4bd]/30 text-[#f0c91f]' : ''
        }`;

        const commonProps = {
          className: linkClassName,
          style: { fontFamily: 'Baloo, sans-serif' },
          'aria-label': item.ariaLabel || item.label,
          'aria-current': isCurrentPage ? ('page' as const) : undefined,
          onClick,
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
          <Link to={item.href} {...commonProps}>
            {item.label}
          </Link>
        );
      }
    );
    NavigationLink.displayName = 'NavigationLink';

    const MenuHeader = React.memo(() => {
      const handleImageError = (
        event: React.SyntheticEvent<HTMLImageElement>
      ) => {
        console.warn('Menu header logo image failed to load');
        event.currentTarget.style.display = 'none';
      };

      return (
        <header className="py-0" role="banner">
          <div className="container mx-auto flex justify-center">
            <div className="flex flex-row items-center">
              <img
                src={logoImage}
                alt="Kailani restaurant logo"
                className="h-36 w-36 flex-shrink-0"
                onError={handleImageError}
                width="144"
                height="144"
              />
              <div className="space-y-0">
                <h3 className="milkshake-regular text-lg font-bold text-[#f7d34f] drop-shadow-sm sm:text-xl">
                  Hawaiian
                </h3>
                <h1
                  className="baloo-regular pr-9 text-4xl font-extrabold text-[#f7d34f] sm:text-5xl"
                  style={{
                    fontFamily: 'Baloo, sans-serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '0.06em',
                    textShadow: '-4px 4px 0px #7F4F00',
                  }}
                >
                  SHAVE ICE
                </h1>
                <h2
                  className="baloo-regular text-2xl font-bold text-white sm:text-3xl"
                  style={{
                    fontFamily: 'Baloo, sans-serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '0.04em',
                    textShadow: '-2px 2px 0px #e85fa8',
                  }}
                >
                  &amp; Ramen
                </h2>
              </div>
            </div>
          </div>
        </header>
      );
    });
    MenuHeader.displayName = 'MenuHeader';

    const NavigationMenu = React.memo(
      ({
        items,
        onItemClick,
        currentPath,
      }: {
        items: readonly NavigationItem[];
        onItemClick: () => void;
        currentPath: string;
      }) => (
        <nav
          className="flex flex-1 flex-col gap-4 px-2 pb-20"
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          {items.map(item => (
            <div key={item.href} className="relative">
              <NavigationLink
                item={item}
                onClick={onItemClick}
                isCurrentPage={currentPath === item.href}
              />
            </div>
          ))}
        </nav>
      )
    );
    NavigationMenu.displayName = 'NavigationMenu';

    return (
      <>
        <header
          className="sticky top-0 z-30 w-full max-w-full overflow-hidden border-b-2 border-[#ffe0f0] bg-[#e83838] shadow-xl"
          role="banner"
        >
          <div className="flex w-full flex-row items-center justify-between border-b-2 border-[#ffe0f0] px-4 py-3">
            <BrandLogo name={displayName} />

            <div className="flex gap-2">
              <QuickOrderButton />
              <MenuToggleButton
                isOpen={isMenuOpen}
                onToggle={toggleMenuVisibility}
              />
            </div>
          </div>
        </header>

        <div
          id="mobile-navigation-menu"
          className={`fixed inset-0 z-40 w-full max-w-full bg-gradient-to-b from-[#e83838] via-[#19b4bd] to-amber-900 backdrop-blur-md transition-all duration-300 ${
            isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
          aria-hidden={!isMenuOpen}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-header"
          {...(!isMenuOpen && { inert: true })}
        >
          <div
            ref={menuRef}
            data-menu-content
            className="relative z-10 flex h-full w-full max-w-full flex-col overflow-x-hidden overflow-y-auto p-6 pt-20"
          >
            <button
              ref={closeButtonRef}
              onClick={closeMenu}
              className="absolute top-6 right-6 transform rounded-full border-b-4 bg-[#f0c91f] p-3 text-xl font-bold text-amber-900 shadow-lg transition-all duration-200 hover:bg-yellow-500 hover:text-[#19b4bd] hover:shadow-xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#19b4bd] focus:outline-none active:translate-y-1 active:border-b-1 active:shadow-md"
              aria-label="Close menu"
              tabIndex={isMenuOpen ? 0 : -1}
            >
              <span className="baloo-regular" aria-hidden="true">
                ×
              </span>
            </button>

            <MenuHeader />
            <NavigationMenu
              items={NAVIGATION_ITEMS}
              onItemClick={closeMenu}
              currentPath={location.pathname}
            />
          </div>
        </div>

        {/* Mobile Order Modal */}
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
              onClick={() => setIsOrderModalOpen(false)}
            />

            {/* Modal Content - Mobile-optimized */}
            <div className="animate-slide-up relative mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:animate-none sm:rounded-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-200 bg-white sm:rounded-t-2xl">
                <div className="flex items-center justify-between p-4 sm:p-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                      Order Online
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 sm:text-base">
                      Choose your preferred ordering method
                    </p>
                  </div>{' '}
                  <button
                    onClick={() => setIsOrderModalOpen(false)}
                    className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 pb-6 sm:p-6 sm:pb-8">
                <OnlineOrderingLinks
                  className="mb-0"
                  isDropdown={true}
                  onLinkClick={() => setIsOrderModalOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

MobileNavigation.displayName = 'MobileNavigation';
