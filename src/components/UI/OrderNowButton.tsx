import React from 'react';

interface OrderNowButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const pastelGradient =
  'bg-gradient-to-br from-mint-200 via-peach-200 to-lavender-200';

const OrderNowButton: React.FC<OrderNowButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  children,
}) => {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`
        relative inline-flex items-center justify-center
        px-7 py-4 rounded-2xl font-semibold text-lg
        shadow-lg transition-transform duration-200
        focus:outline-none focus-visible:ring-4 focus-visible:ring-mint-400/70
        ${pastelGradient}
        text-gray-800
        hover:scale-105 active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {/* Playful shine overlay */}
      <span
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
        style={{
          background:
            'linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 100%)',
        }}
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2">
        {/* Optional icon: fun pastel ice or emoji */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 drop-shadow-sm"
          aria-hidden="true"
        >
          <ellipse cx="16" cy="15" rx="8" ry="3" fill="#A7F3D0" opacity="0.8" />
          <ellipse cx="16" cy="13" rx="7" ry="2.5" fill="#FBCFE8" opacity="0.8" />
          <ellipse cx="16" cy="11" rx="6" ry="2" fill="#FDE68A" opacity="0.8" />
          <ellipse cx="16" cy="9" rx="5" ry="1.5" fill="#FECACA" opacity="0.8" />
        </svg>
        <span className="font-bold tracking-wide">
          {children || 'Order Now!'}
        </span>
      </span>
    </button>
  );
};

export default OrderNowButton;
