import { useState, useEffect, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Optimized image component with:
 * - Lazy loading
 * - Error handling
 * - Placeholder support
 * - Progressive loading (blur-up technique)
 */
const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  sizes = '100vw',
  width,
  height,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDIiPjwvc3ZnPg==',
  loading = 'lazy'
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setImgSrc(placeholder);
    setIsLoaded(false);
    setIsError(false);
    
    // Only load the real image if src is provided and valid
    if (src && src !== placeholder) {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setImgSrc(src);
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        setIsError(true);
      };
    }
  }, [src, placeholder]);

  // Show error state
  if (isError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  // Main image with transition effect
  return (
    <div className="relative overflow-hidden" style={{ width: width || 'auto', height: height || 'auto' }}>
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-60'}`}
        loading={loading}
        sizes={sizes}
        width={width}
        height={height}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
