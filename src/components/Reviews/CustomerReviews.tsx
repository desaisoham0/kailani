import React, { useMemo } from 'react';

// Add a playful, bubbly font (Google Fonts suggestion in comment)
// In your index.html or CSS, import: 
// @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&display=swap');

// Hand-drawn style SVGs for stars and sources
const HandDrawnStar = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="28"
    height="28"
    fill="none"
    stroke="#F7C873"
    strokeWidth="2.5"
    strokeLinejoin="round"
    style={{ filter: 'drop-shadow(0 1px 0 #fff)' }}
  >
    <path
      d="M12 3.5l2.3 5.2 5.7.5-4.3 4.1 1.3 5.5L12 15.5l-5 3.3 1.3-5.5-4.3-4.1 5.7-.5z"
      fill={filled ? '#F7C873' : 'none'}
      stroke="#F7C873"
    />
  </svg>
);

const handDrawnSourceIcons = {
  google: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="14" rx="13" ry="13" fill="#F7F7FA" stroke="#B2DFFC" strokeWidth="2.5" />
      <text x="50%" y="58%" textAnchor="middle" fontFamily="Baloo 2, Comic Sans MS, sans-serif" fontSize="13" fill="#4285F4">G</text>
    </svg>
  ),
  yelp: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="14" rx="13" ry="13" fill="#F7F7FA" stroke="#FFB3B3" strokeWidth="2.5" />
      <text x="50%" y="58%" textAnchor="middle" fontFamily="Baloo 2, Comic Sans MS, sans-serif" fontSize="13" fill="#D32323">Y</text>
    </svg>
  ),
  tripadvisor: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="14" rx="13" ry="13" fill="#F7F7FA" stroke="#B2F7C3" strokeWidth="2.5" />
      <text x="50%" y="58%" textAnchor="middle" fontFamily="Baloo 2, Comic Sans MS, sans-serif" fontSize="13" fill="#34A853">T</text>
    </svg>
  )
};

// Bubbly star rating
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <HandDrawnStar key={i} filled={i < rating} />
    ))}
  </div>
);

export interface Review {
  id: number;
  author: string;
  avatar?: string;
  rating: number; // 1-5
  text: string;
  date: string;
  source: 'google' | 'yelp' | 'tripadvisor'; // Where the review comes from
}

interface CustomerReviewsProps {
  reviews: Review[];
  title?: string;
  subtitle?: string;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = React.memo(({
  reviews,
  title = "Customer Reviews",
  subtitle = "See what our customers say about us"
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Memoize the reviews list
  const memoizedReviews = useMemo(() => reviews, [reviews]);

  // Pastel backgrounds for cards
  const pastelCards = [
    'bg-[#FFF8E7]', // soft yellow
    'bg-[#E7F8FF]', // soft blue
    'bg-[#F7E7FF]', // soft pink
    'bg-[#E7FFF2]', // soft mint
  ];

  // Main return
  return (
    <section
      className="py-16 px-2 md:px-0 bg-[#FCFAF7] font-[\'Baloo 2\', 'Comic Sans MS', 'Comic Neue', sans-serif]"
      style={{ minHeight: 600 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-[#3B3B3B] tracking-tight" style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}>{title}</h2>
          <p className="text-lg md:text-xl text-[#6B6B6B] mb-2" style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}>{subtitle}</p>
        </div>

        {/* Review Card */}
        <div
          className={`rounded-[2.5rem] shadow-xl ${pastelCards[currentIndex % pastelCards.length]} p-8 md:p-12 mb-8 flex flex-col gap-6`}
          style={{ border: '2.5px solid #F7E7B3', minHeight: 320 }}
        >
          <div className="flex items-center gap-4 mb-2">
            <div>{handDrawnSourceIcons[memoizedReviews[currentIndex].source]}</div>
            <StarRating rating={memoizedReviews[currentIndex].rating} />
            <span className="ml-2 text-base text-[#A3A3A3] font-semibold" style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}>{memoizedReviews[currentIndex].date}</span>
          </div>
          <blockquote className="text-2xl md:text-3xl text-[#3B3B3B] italic leading-relaxed" style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif', letterSpacing: 0.5 }}>
            “{memoizedReviews[currentIndex].text}”
          </blockquote>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-16 h-16 rounded-full bg-[#FFF] border-4 border-[#F7C873] flex items-center justify-center text-3xl font-bold shadow-md" style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}>
              {memoizedReviews[currentIndex].avatar ? (
                <img src={memoizedReviews[currentIndex].avatar} alt={memoizedReviews[currentIndex].author} className="w-full h-full object-cover rounded-full" />
              ) : (
                memoizedReviews[currentIndex].author.charAt(0)
              )}
            </div>
            <div>
              <div className="text-xl font-bold text-[#3B3B3B]" style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}>{memoizedReviews[currentIndex].author}</div>
              <div className="text-base text-[#7FC29B] font-semibold">Verified Customer</div>
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setCurrentIndex(currentIndex === 0 ? reviews.length - 1 : currentIndex - 1)}
            className="rounded-full bg-[#F7E7B3] hover:bg-[#F7C873] p-3 shadow border-2 border-[#F7C873] focus:outline-none"
            aria-label="Previous review"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="#F7C873" strokeWidth="2.5" fill="#FFF8E7"/><path d="M17 21l-7-7 7-7" stroke="#F7C873" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="flex items-center gap-2">
            {memoizedReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-4 h-4 rounded-full border-2 border-[#F7C873] ${currentIndex === i ? 'bg-[#F7C873]' : 'bg-[#FFF8E7]'} focus:outline-none`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentIndex((currentIndex + 1) % reviews.length)}
            className="rounded-full bg-[#F7E7B3] hover:bg-[#F7C873] p-3 shadow border-2 border-[#F7C873] focus:outline-none"
            aria-label="Next review"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="#F7C873" strokeWidth="2.5" fill="#FFF8E7"/><path d="M11 7l7 7-7 7" stroke="#F7C873" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Overall Rating & Links */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-[#FFF] rounded-[2rem] shadow-lg p-6 md:p-8 border-2 border-[#F7E7B3]">
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="text-5xl font-bold text-[#F7C873] mb-1" style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}>4.9</div>
            <div className="flex gap-1 mb-1">
              {[...Array(5)].map((_, i) => <HandDrawnStar key={i} filled={true} />)}
            </div>
            <div className="text-base text-[#A3A3A3] font-semibold">Average rating</div>
          </div>
          <div className="h-12 border-l-2 border-[#F7E7B3] hidden md:block"></div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[#3B3B3B] text-lg mb-1">Based on <strong>177 reviews</strong></span>
            <div className="flex items-center gap-2">
              {handDrawnSourceIcons.google}
              <span className="text-base text-[#A3A3A3] font-semibold">Google Reviews</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4 md:mt-0">
            <a
              href="https://www.google.com/search?gs_ssp=eJzj4tVP1zc0LMnIK0hPycgyYLRSNaiwsEw2SjNMTDUySjFOTTY1tDKoMDVMMzEzMUs2S002STYyMPISzE7MzEnMy1XITE4FAB2hFiQ&q=kailani+shave+ice&oq=kailani+&gs_lcrp=EgZjaHJvbWUqFQgBEC4YJxivARjHARiABBiKBRiOBTIPCAAQIxgnGOMCGIAEGIoFMhUIARAuGCcYrwEYxwEYgAQYigUYjgUyBggCEEUYOTIHCAMQABiABDINCAQQLhivARjHARiABDIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBCDIyNjVqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#lrd=0x89c2f1ae22d3ec51:0x51f4646c6ec4c202,3,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#F7C873] hover:bg-[#F7E7B3] text-[#3B3B3B] font-bold px-6 py-3 text-lg shadow border-2 border-[#F7E7B3] transition-colors duration-200"
              style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}
            >
              <span role="img" aria-label="star" className="mr-2">🌟</span>
              Leave us a Google Review
            </a>
            <a
              href="https://maps.app.goo.gl/KWjLfCxkkYvf7qYh8"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#E7F8FF] hover:bg-[#B2DFFC] text-[#3B3B3B] font-bold px-6 py-3 text-lg shadow border-2 border-[#B2DFFC] transition-colors duration-200"
              style={{ fontFamily: 'Baloo 2, Comic Sans MS, Comic Neue, sans-serif' }}
            >
              <span role="img" aria-label="map" className="mr-2">📍</span>
              Find us on Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

// For long review lists, consider virtualization (e.g., react-window) for further performance improvements.

export default CustomerReviews;
