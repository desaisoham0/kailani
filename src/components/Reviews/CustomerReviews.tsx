import React, { useState, useEffect } from 'react';
import {
  getAllReviews,
  getReviewStats,
  type Review,
  type ReviewStats,
} from '../../firebase/reviewService';
import { Timestamp } from 'firebase/firestore';

const StarRating = ({ rating }: { rating: number }) => (
  <div
    className="flex items-center gap-1"
    aria-label={`Rating ${rating} out of 5`}
  >
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

const GoogleIcon = () => (
  <div
    className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
    aria-hidden="true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  </div>
);

const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    lastUpdated: Timestamp.now(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewsAndStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [reviewsData, statsData] = await Promise.all([
          getAllReviews(),
          getReviewStats(),
        ]);
        setReviews(reviewsData);
        setReviewStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviewsAndStats();
  }, []);

  return { reviews, reviewStats, isLoading };
};

interface CustomerReviewsProps {
  reviews?: Review[];
  title?: string;
  subtitle?: string;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews: propReviews,
  title = 'Customer Reviews',
  subtitle = 'What Our Customers Say',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { reviews: directReviews, reviewStats, isLoading } = useReviews();
  const reviews =
    propReviews && propReviews.length > 0 ? propReviews : directReviews;
  const averageRating = reviewStats.averageRating;
  const totalReviews = reviewStats.totalReviews;

  const goToNextReview = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % reviews.length);
  };

  const goToPrevReview = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + reviews.length) % reviews.length
    );
  };

  if (isLoading) {
    return (
      <section className="bg-[#78350F] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center" role="status" aria-live="polite">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-amber-200" />
            <p className="mt-4 font-sans text-amber-100">Loading reviews</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const active = reviews[currentIndex];

  return (
    <section className="border-b-2 border-[#ffe0f0] bg-[#78350F] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h2 className="baloo-regular mb-3 text-3xl font-semibold tracking-wide text-[#F5E1A4] md:text-4xl">
            {title}
          </h2>
          <p className="baloo-regular text-xl tracking-wide text-[#FFFFF0]">
            {subtitle}
          </p>
          <div className="mx-auto mt-6 inline-flex items-center justify-center rounded-xl bg-amber-900/40 px-6 py-3">
            <p
              className="baloo-regular mr-3 text-3xl font-bold text-[#FFFFFF]"
              aria-label="Average rating"
            >
              {averageRating.toFixed(1)}
            </p>
            <StarRating rating={Math.round(averageRating)} />
            <p
              className="baloo-regular ml-3 text-sm text-[#FFFFFF]"
              aria-label="Total reviews"
            >
              ({totalReviews} reviews)
            </p>
          </div>
        </header>

        <div className="mb-12">
          <div className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <figure className="grid items-start gap-6 md:grid-cols-[auto_1fr] md:gap-8">
              <div className="flex flex-shrink-0 flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 shadow-md">
                  <span
                    className="text-2xl font-semibold text-amber-800"
                    aria-hidden="true"
                  >
                    {active.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <GoogleIcon />
                  <span className="sr-only">Google review</span>
                  <StarRating rating={active.rating} />
                </div>
              </div>

              <div id="review-panel" aria-live="polite">
                <figcaption className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="baloo-regular text-xl font-semibold text-amber-900">
                    {active.author}
                  </span>
                </figcaption>
                <p className="font-sans text-base leading-relaxed text-[#000000]">
                  {active.text}
                </p>
              </div>
            </figure>

            {reviews.length > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={goToPrevReview}
                  className="baloo-regular cursor-pointer touch-manipulation rounded-2xl bg-amber-100 px-4 py-2 text-base font-bold text-amber-900 shadow-[0_5px_0_rgb(217,180,114)] ring-1 ring-transparent transition-all duration-150 ease-out select-none hover:shadow-[0_3px_0_rgb(217,180,114)] hover:ring-amber-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0.5 active:scale-95 active:shadow-[0_2px_0_rgb(217,180,114)] active:duration-100 active:ease-in"
                  aria-label="Previous review"
                  aria-controls="review-panel"
                >
                  Previous
                </button>
                <button
                  onClick={goToNextReview}
                  className="baloo-regular cursor-pointer touch-manipulation rounded-2xl bg-amber-100 px-4 py-2 text-base font-bold text-amber-900 shadow-[0_5px_0_rgb(217,180,114)] ring-1 ring-transparent transition-all duration-150 ease-out select-none hover:shadow-[0_3px_0_rgb(217,180,114)] hover:ring-amber-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0.5 active:scale-95 active:shadow-[0_2px_0_rgb(217,180,114)] active:duration-100 active:ease-in"
                  aria-label="Next review"
                  aria-controls="review-panel"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {reviews.length > 1 && (
            <div className="mt-6 flex justify-center gap-3">
              {reviews.map((_: Review, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-3 w-3 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:outline-none ${
                    i === currentIndex
                      ? 'bg-amber-200'
                      : 'bg-amber-600 hover:bg-amber-500'
                  }`}
                  aria-label={`View review ${i + 1}`}
                  aria-current={i === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="inline-block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="baloo-regular mb-3 text-xl font-bold text-amber-800">
              Share your experience!
            </div>
            <div className="mb-4 flex justify-center">
              <StarRating rating={5} />
            </div>
            <button
              onClick={() =>
                window.open(
                  'https://www.google.com/search?q=kailani+shave+ice&oq=kailani+shave+ice&gs_lcrp=EgZjaHJvbWUqDwgAECMYJxjjAhiABBiKBTIPCAAQIxgnGOMCGIAEGIoFMhUIARAuGCcYrwEYxwEYgAQYigUYjgUyBwgCEAAYgAQyBwgDEAAYgAQyCAgEEAAYFhgeMgYIBRBFGDwyBggGEEUYPDIGCAcQRRg80gEIMjgzM2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x89c2f1ae22d3ec51:0x51f4646c6ec4c202,3,,,,',
                  '_blank'
                )
              }
              className="baloo-regular mt-2 inline-flex cursor-pointer touch-manipulation items-center justify-center rounded-2xl bg-green-500 px-8 py-4 text-base font-bold text-white shadow-[0_6px_0_rgb(5,150,105)] ring-1 ring-transparent transition-all duration-150 ease-out select-none hover:shadow-[0_5px_0_rgb(5,150,105)] hover:ring-green-400 focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0.5 active:scale-95 active:shadow-[0_2px_0_rgb(5,150,105)] active:duration-100 active:ease-in"
              aria-label="Leave us a Google review"
            >
              <span className="flex items-center">
                Leave us a review
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
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
