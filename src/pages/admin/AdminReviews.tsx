import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { 
  getAllReviews, 
  deleteReview,
  getReviewStats,
  updateReviewStats,
  type Review
} from '../../firebase/reviewService';

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
      // Get reviews
      const items = await getAllReviews();
      setReviews(items);
      
      // Get saved stats
      const stats = await getReviewStats();
      setTotalReviews(stats.totalReviews);
      setAverageRating(stats.averageRating);
    } catch (err) {
      setError('Failed to load reviews. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update stats
  const handleUpdateStats = async () => {
    try {
      await updateReviewStats({
        totalReviews: totalReviews,
        averageRating: averageRating
      });
      setStatsUpdated(true);
      setTimeout(() => setStatsUpdated(false), 3000);
    } catch (err) {
      setError('Failed to update review stats');
      console.error(err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      setDeleteInProgress(id);
      await deleteReview(id);
      const updatedReviews = reviews.filter(review => review.id !== id);
      setReviews(updatedReviews);
      
      // We don't update the stats here automatically
      // Stats are now manually set by the admin
    } catch (err) {
      setError('Failed to delete the review. Please try again.');
      console.error(err);
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
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Reviews Statistics
          </h3>
          <p className="max-w-2xl mt-1 text-sm text-gray-500">
            Overview of customer reviews
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5">
          <div className="mt-1 sm:mt-0">
            <div className="mb-4">
              <label htmlFor="totalReviews" className="block text-sm font-medium text-gray-700">
                Total reviews
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="totalReviews"
                  id="totalReviews"
                  value={totalReviews}
                  onChange={(e) => setTotalReviews(parseInt(e.target.value) || 0)}
                  min="0"
                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="averageRating" className="block text-sm font-medium text-gray-700">
                Average rating (out of 5)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="averageRating"
                  id="averageRating"
                  value={averageRating}
                  onChange={(e) => setAverageRating(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="5"
                  step="0.1"
                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                />
              </div>
              <div className="mt-2 flex">
                {[1, 2, 3, 4, 5].map((star) => (
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
            </div>
            
            <div className="mb-4">
              <button
                onClick={handleUpdateStats}
                className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 shadow-[0_6px_0_rgb(29,78,216)] hover:shadow-[0_3px_0_rgb(29,78,216)] hover:translate-y-1 transition-all duration-200 cursor-pointer"
              >
                Save Stats
              </button>
              {statsUpdated && (
                <span className="ml-3 text-sm text-green-600">Stats updated successfully!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new review.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Author</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Source</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Review Text</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">{review.author.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{review.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                        {review.source}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {formatDate(review.date)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {review.text}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 text-right">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => onEditReview(review.id!)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id!)}
                          disabled={deleteInProgress === review.id}
                          className={`${
                            deleteInProgress === review.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-900 cursor-pointer'
                          }`}
                        >
                          {deleteInProgress === review.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
