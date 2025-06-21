import React, { useState, useEffect } from 'react';
import { getAllReviews, getReviewStats } from '../../firebase/reviewService';

// Professional star rating component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <svg 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// Google Review Icon
const GoogleIcon = () => (
  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-md">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  </div>
);

// Interface for review data
export interface Review {
  id: string | number;
  author: string;
  rating: number; // 1-5
  text: string;
  source: 'google'; // Only using Google reviews
}

interface CustomerReviewsProps {
  reviews?: Review[];
  title?: string;
  subtitle?: string;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ 
  reviews: propReviews, 
  title = "Customer Reviews",
  subtitle = "What Our Customers Say"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch reviews from Firebase if no reviews are provided as props
  useEffect(() => {
    if (propReviews && propReviews.length > 0) {
      setReviews(propReviews);
      // Don't calculate, use the stats from Firebase
      fetchReviewStats();
    } else {
      fetchReviewsAndStats();
    }
  }, [propReviews]);

  const fetchReviewStats = async () => {
    try {
      const stats = await getReviewStats();
      setAverageRating(stats.averageRating);
      setTotalReviews(stats.totalReviews);
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const fetchReviewsAndStats = async () => {
    setLoading(true);
    try {
      // Get reviews
      const fetchedReviews = await getAllReviews();
      const formattedReviews = fetchedReviews.map(review => ({
        ...review,
        id: review.id || '',
        date: review.date?.toDate ? review.date.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : typeof review.date === 'string' ? review.date : ''
      }));
      setReviews(formattedReviews as Review[]);
      
      // Get stats
      const stats = await getReviewStats();
      setAverageRating(stats.averageRating);
      setTotalReviews(stats.totalReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation
  const goToNextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const goToPrevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-[#78350F]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-200 mx-auto"></div>
            <p className="mt-4 text-amber-100 font-sans">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-[#78350F] border-b-2 border-[#ffe0f0]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-wide mb-3 text-[#F5E1A4] baloo-regular">{title}</h2>
          <p className="text-xl text-[#FFFFF0] tracking-wide baloo-regular">{subtitle}</p>
          
          <div className="mt-6 inline-flex justify-center items-center bg-amber-900/40 px-6 py-3 rounded-xl mx-auto">
            <p className="font-bold text-3xl text-[#FFFFFF] mr-3 baloo-regular">{averageRating.toFixed(1)}</p>
            <StarRating rating={Math.round(averageRating)} />
            <p className="ml-3 text-sm text-[#FFFFFF] baloo-regular">({totalReviews} reviews)</p>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mb-12">
            {/* Review Card */}
            <div className="bg-white shadow-lg rounded-2xl p-8 relative">
              <blockquote className="grid md:grid-cols-[auto_1fr] gap-8">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center shadow-md">
                    <span className="text-2xl font-semibold text-amber-800" aria-hidden="true">
                      {reviews[currentIndex].author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <GoogleIcon />
                    <StarRating rating={reviews[currentIndex].rating} />
                  </div>
                </div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <cite className="text-xl font-semibold text-amber-900 not-italic baloo-regular">
                      {reviews[currentIndex].author}
                    </cite>
                  </div>
                  <p className="text-base leading-relaxed text-[#000000] font-sans">
                    "{reviews[currentIndex].text}"
                  </p>
                </div>
              </blockquote>
              
              {/* Navigation buttons */}
              {reviews.length > 1 && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={goToPrevReview}
                    className="px-4 py-2 text-base font-bold font-navigation baloo-regular rounded-full cursor-pointer bg-amber-100 text-amber-900 shadow-[0_6px_0_rgb(217,180,114)] hover:shadow-[0_4px_0px_rgb(217,180,114)] hover:translate-y-1 transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Previous review"
                  >
                    Previous
                  </button>
                  <button
                    onClick={goToNextReview}
                    className="px-4 py-2 text-base font-bold font-navigation baloo-regular rounded-full cursor-pointer bg-amber-100 text-amber-900 shadow-[0_6px_0_rgb(217,180,114)] hover:shadow-[0_4px_0px_rgb(217,180,114)] hover:translate-y-1 transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Next review"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            
            {/* Pagination dots */}
            {reviews.length > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                {reviews.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 ${
                      i === currentIndex ? 'bg-amber-200' : 'bg-amber-600 hover:bg-amber-500'
                    }`}
                    aria-label={`View review ${i + 1}`}
                    aria-current={i === currentIndex ? 'true' : 'false'}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Call to action */}
        <div className="text-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
            <div className="font-bold text-xl text-amber-800 mb-3 baloo-regular">Share your experience!</div>
            <div className="flex justify-center mb-4">
              <StarRating rating={5} />
            </div>
            <button
              onClick={() => window.open("https://www.google.com/search?q=kailani+shave+ice&oq=kailani+shave+ice&gs_lcrp=EgZjaHJvbWUqDwgAECMYJxjjAhiABBiKBTIPCAAQIxgnGOMCGIAEGIoFMhUIARAuGCcYrwEYxwEYgAQYigUYjgUyBwgCEAAYgAQyBwgDEAAYgAQyCAgEEAAYFhgeMgYIBRBFGDwyBggGEEUYPDIGCAcQRRg80gEIMjgzM2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x89c2f1ae22d3ec51:0x51f4646c6ec4c202,3,,,,", "_blank")}
              className="mt-2 px-8 py-4 text-base font-bold font-navigation baloo-regular rounded-full cursor-pointer bg-green-500 text-white shadow-[0_6px_0_rgb(5,150,105)] hover:shadow-[0_4px_0px_rgb(5,150,105)] hover:translate-y-1 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Leave us a Google review"
            >
              <span className="flex items-center">
                Leave us a review
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CustomerReviews);
