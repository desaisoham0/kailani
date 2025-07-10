import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { addReview, updateReview } from '../../firebase/reviewService';

interface AdminReviewFormProps {
  reviewId: string | null;
  onComplete: () => void;
}

export default function AdminReviewForm({
  reviewId,
  onComplete,
}: AdminReviewFormProps) {
  const [formData, setFormData] = useState<{
    author: string;
    rating: number;
    text: string;
    date: Timestamp;
    source: 'google'; // Only using Google reviews as per the original code
  }>({
    author: '',
    rating: 5,
    text: '',
    date: Timestamp.now(),
    source: 'google',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (reviewId) {
      setIsEditMode(true);
      fetchReview(reviewId);
    } else {
      resetForm();
      setIsEditMode(false);
    }
  }, [reviewId]);

  const fetchReview = async (id: string) => {
    try {
      setFetchLoading(true);
      const reviewRef = doc(db, 'reviews', id);
      const reviewDoc = await getDoc(reviewRef);

      if (reviewDoc.exists()) {
        const reviewData = reviewDoc.data();
        setFormData({
          author: reviewData.author || '',
          rating: reviewData.rating || 5,
          text: reviewData.text || '',
          date: reviewData.date || Timestamp.now(),
          source: reviewData.source || 'google',
        });
      } else {
        setError('Review not found');
      }
    } catch (err) {
      setError('Failed to load review');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      author: '',
      rating: 5,
      text: '',
      date: Timestamp.now(),
      source: 'google',
    });
    setError(null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value,
    }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setFormData(prev => ({
        ...prev,
        date: Timestamp.fromDate(date),
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      if (isEditMode && reviewId) {
        await updateReview(reviewId, formData);
      } else {
        await addReview(formData);
      }

      resetForm();
      onComplete();
    } catch (err) {
      setError(
        `Failed to ${isEditMode ? 'update' : 'add'} review. Please try again.`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-3 font-medium text-blue-600">
          Loading review...
        </span>
      </div>
    );
  }

  const formattedDate = formData.date
    ? formData.date.toDate().toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  // Star rating component
  const renderStarRating = () => {
    return (
      <div className="mb-4 flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
            className="cursor-pointer focus:outline-none"
            aria-label={`Rate ${star} stars`}
          >
            <svg
              className={`h-8 w-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-150`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-white p-6">
      <h3 className="mb-6 border-b border-gray-100 pb-2 text-xl font-bold text-gray-800">
        {isEditMode ? 'Edit Review' : 'Add New Review'}
      </h3>

      {error && (
        <div className="mb-6 animate-pulse rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex">
            <svg
              className="mr-2 h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              id="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Customer name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="source"
              className="block text-sm font-medium text-gray-700"
            >
              Review Source <span className="text-red-500">*</span>
            </label>
            <select
              id="source"
              name="source"
              required
              value={formData.source}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
            >
              <option value="google">Google</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="rating"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Rating <span className="text-red-500">*</span>
          </label>
          {renderStarRating()}
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="sr-only"
            aria-hidden="true"
          >
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Review Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            value={formattedDate}
            onChange={handleDateChange}
            className="block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="text"
            className="block text-sm font-medium text-gray-700"
          >
            Review Text <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            rows={4}
            required
            value={formData.text}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="What did the customer say?"
          />
        </div>

        <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onComplete}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-[0_4px_0_rgb(203,213,225)] transition-all duration-200 hover:translate-y-1 hover:bg-gray-50 hover:shadow-[0_2px_0_rgb(203,213,225)] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-[0_6px_0_rgb(29,78,216)] transition-all duration-200 hover:translate-y-1 hover:bg-blue-700 hover:shadow-[0_3px_0_rgb(29,78,216)] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Saving...'}
              </>
            ) : isEditMode ? (
              'Update Review'
            ) : (
              'Add Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
