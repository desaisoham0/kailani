import React from 'react';

interface OnlineOrderingLinksProps {
  className?: string;
  isDropdown?: boolean;
  onLinkClick?: () => void;
}

const OnlineOrderingLinks: React.FC<OnlineOrderingLinksProps> = ({ className = '', isDropdown = false, onLinkClick }) => {
  const orderingOptions = [
    {
      name: 'Toast',
      type: 'pickup',
      url: 'https://order.toasttab.com/online/kailanishaveice',
      bgColor: 'bg-sky-500',
      hoverColor: 'hover:bg-sky-600',
      description: 'Order for Pickup'
    },
    {
      name: 'Uber Eats',
      type: 'delivery',
      url: '#', // Replace with actual Uber Eats URL
      bgColor: 'bg-black',
      hoverColor: 'hover:bg-gray-800',
      description: 'Delivery'
    },
    {
      name: 'DoorDash',
      type: 'delivery',
      url: '#', // Replace with actual DoorDash URL
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      description: 'Delivery'
    },
    {
      name: 'Grubhub',
      type: 'delivery',
      url: '#', // Replace with actual Grubhub URL
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      description: 'Delivery'
    }
  ];

  return (
    <div className={`online-ordering-links ${className}`}>
      {!isDropdown && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Online</h2>
          <p className="text-gray-600 text-lg">Choose your preferred ordering method</p>
        </div>
      )}
      
      <div className={`grid gap-4 ${isDropdown ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {orderingOptions.map((option, index) => (
          <div key={index} className="flex flex-col items-center">
            <a
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onLinkClick}
              className={`
                ${option.bgColor} ${option.hoverColor}
                text-white font-semibold py-3 px-4 rounded-lg
                transition-all duration-300 transform hover:scale-105
                shadow-lg hover:shadow-xl
                flex flex-col items-center justify-center
                w-full text-center
                group cursor-pointer
                ${isDropdown ? 'min-h-[80px] text-sm' : 'min-h-[120px]'}
              `}
            >
              <div className="text-center">
                <div className={`font-bold ${isDropdown ? 'text-base sm:text-md' : 'text-lg sm:text-xl'}`}>{option.name}</div>
                <div className={`opacity-90 ${isDropdown ? 'text-sm sm:text-xs' : 'text-base sm:text-sm'}`}>{option.description}</div>
              </div>
            </a>
          </div>
        ))}
      </div>
      
      {!isDropdown && (
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Pickup available through Toast • Delivery available through Uber Eats, DoorDash, and Grubhub
          </p>
        </div>
      )}
    </div>
  );
};

export default OnlineOrderingLinks;