import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faTiktok,
} from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type SocialMediaLink = {
  readonly name: string;
  readonly url: string;
  readonly icon: IconDefinition;
  readonly ariaLabel: string;
};

type SocialMediaLinksProps = {
  readonly className?: string;
};

const SOCIAL_MEDIA_LINKS: readonly SocialMediaLink[] = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/people/Kailani-Shave-Ice-NJ/100086558511217/?_rdr',
    icon: faFacebookF,
    ariaLabel: 'Follow us on Facebook',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/kailanishaveicenj/',
    icon: faInstagram,
    ariaLabel: 'Follow us on Instagram',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/place/Kailani-Shave-Ice-NJ-21568226288998491?language=en',
    icon: faTiktok,
    ariaLabel: 'Follow us on TikTok',
  },
];

export const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  className = '',
}) => {
  const getIconClassName = (socialName: string) => {
    const colorMap = {
      Facebook: 'text-blue-700 hover:text-blue-800',
      Instagram: 'text-pink-600 hover:text-pink-700',
      TikTok: 'text-gray-800 hover:text-gray-900',
    };

    const colors =
      colorMap[socialName as keyof typeof colorMap] ||
      'text-yellow-400 hover:text-yellow-300';
    return `text-2xl md:text-4xl w-12 h-14 md:w-16 md:h-18 ${colors} transition-all duration-250 rounded-xl py-1 border-2 border-b-4 active:border-b-2 border-white/20 hover:border-white/40 flex items-center justify-center hover:translate-y-0 active:translate-y-1 shadow-lg hover:shadow-md active:shadow-sm transform`;
  };

  return (
    <div
      className={`relative flex items-center justify-center gap-4 px-8 py-3 text-gray-700 md:gap-8 ${className}`}
      aria-label="Social Media Links"
    >
      <div className="relative z-10 flex items-center justify-center gap-4 md:gap-8">
        {SOCIAL_MEDIA_LINKS.map(link => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            className="transition-all duration-300"
          >
            <FontAwesomeIcon
              icon={link.icon}
              className={getIconClassName(link.name)}
            />
          </a>
        ))}
      </div>
    </div>
  );
};
