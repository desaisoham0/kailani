import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import {
  getAllReviews,
  deleteReview,
  getReviewStats,
  updateReviewStats,
  type Review,
} from '../../firebase/reviewService';
import { Transition } from '@headlessui/react';

interface AdminReviewsProps {
  onEditReview: (reviewId: string) => void;
}

export default function AdminReviews({ onEditReview }: AdminReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [statsUpdated, setStatsUpdated] = useState(false);

  useEffect(() => {
    fetchReviewsAndStats();
  }, []);

  const fetchReviewsAndStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getAllReviews();
      setReviews(items);
      const stats = await getReviewStats();
      setTotalReviews(stats.totalReviews);
      setAverageRating(stats.averageRating);
    } catch {
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStats = async () => {
    try {
      await updateReviewStats({
        totalReviews: totalReviews,
        averageRating: averageRating,
      });
      setStatsUpdated(true);
      setTimeout(() => setStatsUpdated(false), 3000);
    } catch {
      setError('Failed to update review stats');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      setDeleteInProgress(id);
      await deleteReview(id);
      const updatedReviews = reviews.filter(review => review.id !== id);
      setReviews(updatedReviews);
    } catch {
      setError('Failed to delete the review. Please try again.');
    } finally {
      setDeleteInProgress(null);
    }
  };

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          aria-hidden
          className="h-8 w-8 animate-spin rounded-full border-t-4 border-b-4 border-blue-500"
        />
        <span
          className="ml-3 font-medium text-blue-600"
          role="status"
          aria-live="polite"
        >
          Loading reviews...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-start gap-2">
          <svg
            className="h-5 w-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Reviews Statistics
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Overview of customer reviews
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="totalReviews"
                className="block text-sm font-medium text-gray-700"
              >
                Total reviews
              </label>
              <input
                type="number"
                name="totalReviews"
                id="totalReviews"
                value={totalReviews}
                onChange={e => setTotalReviews(parseInt(e.target.value) || 0)}
                min={0}
                className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-describedby="totalReviews-help"
              />
              <p id="totalReviews-help" className="mt-1 text-xs text-gray-500">
                Manually set the total number of public reviews.
              </p>
            </div>

            <div>
              <label
                htmlFor="averageRating"
                className="block text-sm font-medium text-gray-700"
              >
                Average rating (out of 5)
              </label>
              <input
                type="number"
                name="averageRating"
                id="averageRating"
                value={averageRating}
                onChange={e =>
                  setAverageRating(parseFloat(e.target.value) || 0)
                }
                min={0}
                max={5}
                step={0.1}
                className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-describedby="averageRating-help"
              />
              <div className="mt-2 flex" aria-hidden="true">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p id="averageRating-help" className="mt-1 text-xs text-gray-500">
                This value is displayed publicly.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleUpdateStats}
              className="inline-flex cursor-pointer items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Save Stats
            </button>
            <Transition
              show={statsUpdated}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <span className="text-sm text-green-600">
                Stats updated successfully!
              </span>
            </Transition>
          </div>
        </div>
      </section>

      {reviews.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 py-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new review.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-sm ring-1 ring-black/5">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pr-3 pl-4 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase sm:pl-6"
                >
                  Author
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase"
                >
                  Source
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase"
                >
                  Review Text
                </th>
                <th scope="col" className="py-3.5 pr-4 pl-3 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {reviews.map(review => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="py-4 pr-3 pl-4 text-sm sm:pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                        <span className="font-medium text-gray-600">
                          {review.author?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {review.author}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-700">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg
                          key={star}
                          className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-700">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 capitalize">
                      {review.source}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-700">
                    {formatDate(review.date)}
                  </td>
                  <td className="max-w-xs truncate px-3 py-4 text-sm text-gray-700">
                    {review.text}
                  </td>
                  <td className="px-3 py-4 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEditReview(review.id!)}
                        className="cursor-pointer rounded-2xl px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-blue-200 transition ring-inset hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id!)}
                        disabled={deleteInProgress === review.id}
                        className={`cursor-pointer rounded-2xl px-3 py-1.5 text-sm font-medium shadow-sm ring-1 transition ring-inset focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                          deleteInProgress === review.id
                            ? 'cursor-not-allowed bg-red-50 text-red-400 ring-red-200'
                            : 'text-red-600 ring-red-200 hover:bg-red-50 hover:text-red-700'
                        }`}
                        aria-busy={deleteInProgress === review.id}
                      >
                        {deleteInProgress === review.id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
