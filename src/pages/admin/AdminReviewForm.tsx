import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { addReview, updateReview } from '../../firebase/reviewService';

interface AdminReviewFormProps {
  reviewId: string | null;
  onComplete: () => void;
}

export default function AdminReviewForm({ reviewId, onComplete }: AdminReviewFormProps) {
  const [formData, setFormData] = useState<{
    author: string;
    rating: number;
    text: string;
    date: Timestamp;
    source: 'google'; // Only using Google reviews
  }>({
    author: '',
    rating: 5,
    text: '',
    date: Timestamp.now(),
    source: 'google'
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
          source: reviewData.source || 'google'
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
      source: 'google'
    });
    setError(null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setFormData((prev) => ({
        ...prev,
        date: Timestamp.fromDate(date)
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
      setError(`Failed to ${isEditMode ? 'update' : 'add'} review. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading review...</span>
      </div>
    );
  }

  const formattedDate = formData.date 
    ? formData.date.toDate().toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isEditMode ? 'Edit Review' : 'Add New Review'}
        </h3>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
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
        )}
        
        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Author Name
            </label>
            <input
              type="text"
              name="author"
              id="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          

          
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <select
              id="rating"
              name="rating"
              required
              value={formData.rating}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
              Review Source
            </label>
            <select
              id="source"
              name="source"
              required
              value={formData.source}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="google">Google</option>
              <option value="yelp">Yelp</option>
              <option value="tripadvisor">TripAdvisor</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Review Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              value={formattedDate}
              onChange={handleDateChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Review Text
            </label>
            <textarea
              id="text"
              name="text"
              rows={4}
              required
              value={formData.text}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onComplete()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Review' : 'Add Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
