import React from 'react';

interface OnlineOrderingLinksProps {
  className?: string;
  isDropdown?: boolean;
  onLinkClick?: () => void;
}

const OnlineOrderingLinks: React.FC<OnlineOrderingLinksProps> = ({
  className = '',
  isDropdown = false,
  onLinkClick,
}) => {
  const orderingOptions = [
    {
      name: 'Toast',
      type: 'pickup',
      url: 'https://order.toasttab.com/online/kailanishaveice',
      bgColor: 'bg-sky-500',
      hoverColor: 'hover:bg-sky-600',
      description: 'Order for Pickup',
    },
    {
      name: 'Uber Eats',
      type: 'delivery',
      url: '#',
      bgColor: 'bg-black',
      hoverColor: 'hover:bg-gray-800',
      description: 'Delivery',
    },
    {
      name: 'DoorDash',
      type: 'delivery',
      url: '#',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      description: 'Delivery',
    },
    {
      name: 'Grubhub',
      type: 'delivery',
      url: '#',
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      description: 'Delivery',
    },
  ];

  return (
    <section className={`online-ordering-links ${className}`}>
      {!isDropdown && (
        <header className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Order Online
          </h2>
          <p className="mx-auto max-w-prose text-lg text-gray-600">
            Choose your preferred ordering method
          </p>
        </header>
      )}

      <nav aria-label="Online ordering options" className="mx-auto max-w-6xl">
        <ul
          role="list"
          className={`grid gap-4 sm:gap-5 lg:gap-6 ${isDropdown ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}
        >
          {orderingOptions.map((option, index) => (
            <li key={index} className="flex">
              <a
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onLinkClick}
                aria-label={`${option.name} ${option.description}`}
                className={`${option.bgColor} ${option.hoverColor} group relative flex w-full flex-col items-center justify-center rounded-2xl p-4 text-center font-semibold text-white shadow-sm transition-colors transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 sm:p-5 ${isDropdown ? 'min-h-20 text-sm' : 'min-h-28'}`}
              >
                <span
                  className={`${isDropdown ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}
                >
                  {option.name}
                </span>
                <span
                  className={`opacity-90 ${isDropdown ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}
                >
                  {option.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {!isDropdown && (
        <div className="mt-8 text-center">
          <p className="mx-auto max-w-prose text-sm leading-relaxed text-gray-500">
            Pickup available through Toast • Delivery available through Uber
            Eats, DoorDash, and Grubhub
          </p>
        </div>
      )}
    </section>
  );
};

export default OnlineOrderingLinks;
