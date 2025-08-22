import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/Kailani_logo.png';
import OnlineOrderingLinks from '../OnlineOrdering/OnlineOrderingLinks';
import '../../styles/fonts.css';

type NavigationItem = {
  readonly label: string;
  readonly href: string;
  readonly isExternalLink: boolean;
  readonly ariaLabel?: string;
  readonly hasDropdown?: boolean;
};

const RESTAURANT_CONFIG = {
  name: 'KAILANI',
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
    href: '#',
    isExternalLink: false,
    ariaLabel: 'Order food online',
    hasDropdown: true,
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

export const DesktopNavigation = React.memo(() => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const BrandLogo = React.memo(({ name }: { name: string }) => {
    const handleImageError = (
      event: React.SyntheticEvent<HTMLImageElement>
    ) => {
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
          className="baloo-regular truncate px-0.5 text-2xl font-bold tracking-wider text-[#f7d34f] drop-shadow-[-4px_4px_0_#7F4F00] md:text-3xl lg:text-4xl xl:text-5xl"
          aria-hidden="true"
        >
          {name}
        </span>
      </Link>
    );
  });
  BrandLogo.displayName = 'BrandLogo';

  const NavigationLink = React.memo(
    ({
      item,
      isCurrentPage,
    }: {
      item: NavigationItem;
      isCurrentPage: boolean;
    }) => {
      const baseClassName =
        'baloo-regular group relative inline-flex items-center rounded-md bg-transparent px-2 py-2 text-sm font-semibold transition-all duration-300 ease-out md:px-3 md:py-3 md:text-base lg:px-4 lg:py-3 lg:text-lg xl:px-5 xl:py-4 xl:text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#e83838]';

      const linkClassName = `${baseClassName} ${
        isCurrentPage ? 'text-white' : 'text-[#f7d34f] hover:text-white'
      }`;

      const commonProps = {
        className: linkClassName,
        'aria-label': item.ariaLabel || item.label,
        'aria-current': isCurrentPage ? ('page' as const) : undefined,
      };

      // Handle modal for "Order Now"
      if (item.hasDropdown) {
        return (
          <button
            onClick={() => setIsModalOpen(true)}
            className={`${linkClassName} cursor-pointer appearance-none border-none ring-1 ring-white/20 ring-inset hover:bg-white/5 hover:ring-white/40`}
            aria-haspopup="dialog"
          >
            <span className="relative">
              {item.label}
              <span
                className={`pointer-events-none absolute inset-x-0 -bottom-1 h-0.5 origin-left transform bg-white transition-transform duration-300 ease-out ${
                  isCurrentPage
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
                aria-hidden="true"
              />
            </span>
          </button>
        );
      }

      if (item.isExternalLink) {
        return (
          <a href={item.href} rel="noopener noreferrer" {...commonProps}>
            <span className="relative">
              {item.label}
              <span
                className={`pointer-events-none absolute inset-x-0 -bottom-1 h-0.5 origin-left transform bg-white transition-transform duration-300 ease-out ${
                  isCurrentPage
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
                aria-hidden="true"
              />
            </span>
          </a>
        );
      }

      return (
        <Link to={item.href} {...commonProps}>
          <span className="relative">
            {item.label}
            <span
              className={`pointer-events-none absolute inset-x-0 -bottom-1 h-0.5 origin-left transform bg-white transition-transform duration-300 ease-out ${
                isCurrentPage
                  ? 'scale-x-100'
                  : 'scale-x-0 group-hover:scale-x-100'
              }`}
              aria-hidden="true"
            />
          </span>
        </Link>
      );
    }
  );
  NavigationLink.displayName = 'NavigationLink';

  const NavigationMenu = React.memo(
    ({
      items,
      currentPath,
    }: {
      items: readonly NavigationItem[];
      currentPath: string;
    }) => (
      <nav
        className="flex min-w-0 flex-1 items-center justify-end gap-1 md:gap-2 lg:gap-3 xl:gap-4"
        role="navigation"
        aria-label="Main navigation"
      >
        {items.map(item => (
          <NavigationLink
            key={item.href}
            item={item}
            isCurrentPage={currentPath === item.href}
          />
        ))}
      </nav>
    )
  );
  NavigationMenu.displayName = 'NavigationMenu';

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full max-w-full overflow-hidden border-b border-[#ffe0f0]/60 bg-[#e83838] shadow-xl backdrop-blur supports-[backdrop-filter]:bg-[#e83838]"
        role="banner"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-4 py-3 sm:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-12 xl:py-6">
          <BrandLogo name={RESTAURANT_CONFIG.name} />
          <NavigationMenu items={NAVIGATION_ITEMS} currentPath={currentPath} />
        </div>
      </header>

      {/* Modal for Order Now */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl transition-all duration-300 md:max-h-[90vh] md:rounded-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-200 bg-white md:rounded-t-2xl">
              <div className="flex items-center justify-between p-4 md:p-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                    Order Online
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 md:text-base">
                    Choose your preferred ordering method
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <svg
                    className="h-5 w-5 md:h-6 md:w-6"
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
            <div className="p-4 pb-6 md:p-6 md:pb-8">
              <OnlineOrderingLinks
                className="mb-0"
                isDropdown={true}
                onLinkClick={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
});

DesktopNavigation.displayName = 'DesktopNavigation';
