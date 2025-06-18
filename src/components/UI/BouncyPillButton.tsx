import React from 'react';
import type { ReactNode } from 'react';

interface BouncyPillButtonProps {
  text: ReactNode;
  isActive?: boolean;
  activeStyle?: string;
  onClick: () => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * BouncyPillButton - A playful, animated pill-shaped button component
 * 
 * Features:
 * - Pill shape (rounded-full)
 * - Bouncy hover animation (scale-105)
 * - Press animation (scale-95)
 * - Shadow lifting effect
 * - Active/inactive states with customizable styles
 */
const BouncyPillButton: React.FC<BouncyPillButtonProps> = ({
  text,
  isActive = false,
  activeStyle = '',
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const defaultStyle = 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50';
  
  return (
    <button
      className={`px-6 py-3 font-bold text-lg font-navigation baloo-regular cursor-pointer rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
        isActive ? activeStyle : defaultStyle
      } ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {text}
    </button>
  );
};

export default BouncyPillButton;
