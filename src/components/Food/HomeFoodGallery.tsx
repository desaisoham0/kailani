import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { GalleryImage } from './FoodGallery';

interface HomeFoodGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
  maxImages?: number;
}

const HomeFoodGallery: React.FC<HomeFoodGalleryProps> = React.memo(({
  images,
  title = "Food Gallery",
  subtitle = "A glimpse of our delicious creations",
  maxImages = 6
}) => {
  // Memoize the sliced images array
  const displayImages = useMemo(() => images.slice(0, maxImages), [images, maxImages]);

  return (
    <section
      className="py-16 relative overflow-hidden w-full max-w-full"
      style={{ background: "linear-gradient(120deg, #fffde4 0%, #e0f7fa 100%)" }} // lemon & sky gradient
    >
      <div className="container mx-auto px-4 relative z-10 max-w-full">
        <div className="text-center mb-12">
          <span className="inline-flex items-center justify-center mb-4">
            {/* Hand-drawn style icon (SVG) */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="24" cy="24" rx="22" ry="18" fill="#ffe0f0" stroke="#fbbf24" strokeWidth="2.5"/>
              <path d="M14 30 Q24 38 34 30" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <circle cx="18" cy="22" r="2.5" fill="#fbbf24"/>
              <circle cx="30" cy="22" r="2.5" fill="#fbbf24"/>
            </svg>
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-2 font-navigation jua-regular text-indigo-900 tracking-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-indigo-700 max-w-2xl mx-auto nunito-sans mb-2 font-semibold">
            {subtitle}
          </p>
        </div>

        {/* Image gallery grid - Compact, even grid with invisible squares */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2 auto-rows-[1fr]">
          {displayImages.map((image, idx) => (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-2xl bg-transparent flex items-center justify-center aspect-square"
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                className="object-cover rounded-2xl w-full h-full"
                draggable="false"
                style={{ aspectRatio: '1/1', width: '100%', height: '100%' }}
                loading="lazy"
                srcSet={image.imageUrl + ' 1x, ' + image.imageUrl + ' 2x'}
              />
              {/* Overlay with title at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-2 py-2">
                <h3 className="text-white font-bold font-navigation jua-regular text-xs md:text-sm truncate">
                  {image.title}
                </h3>
              </div>
              {/* Show a faded overlay on the last image if there are more images */}
              {idx === displayImages.length - 1 && images.length > maxImages && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-2xl">
                  <span className="text-white text-2xl md:text-3xl font-bold font-navigation jua-regular">+{images.length - maxImages}</span>
                  <span className="text-white text-xs md:text-sm mt-1">more</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button - Playful, static */}
        <div className="mt-12 text-center">
          <Link to="/gallery">
            <button
              className="px-8 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-2 bg-pink-200 text-pink-700 border-pink-300 shadow-md hover:bg-pink-100 transition-none hover:animate-bounce-short active:scale-95"
              style={{ boxShadow: '0 6px 0 #fbbf24' }}
            >
              <span className="inline-block mr-2 align-middle">
                {/* Hand-drawn style gallery icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="4" fill="#ffe0f0" stroke="#fbbf24" strokeWidth="1.5"/>
                  <circle cx="7.5" cy="10" r="1.5" fill="#fbbf24"/>
                  <path d="M2 17l5-5c1-1 2.5-1 3.5 0l3 3 2-2c1-1 2.5-1 3.5 0l2 2" stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
              View Full Gallery
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
});

export default HomeFoodGallery;
