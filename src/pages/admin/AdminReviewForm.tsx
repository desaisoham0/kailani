import { useState, useEffect, Fragment } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { addReview, updateReview } from '../../firebase/reviewService';
import { RadioGroup, Transition } from '@headlessui/react';

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
    source: 'google';
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
    } catch {
      setError('Failed to load review');
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
    } catch {
      setError(
        `Failed to ${isEditMode ? 'update' : 'add'} review. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-t-4 border-b-4 border-blue-500"
        />
        <span
          className="ml-3 font-medium text-blue-600"
          role="status"
          aria-live="polite"
        >
          Loading review...
        </span>
      </div>
    );
  }

  const formattedDate = formData.date
    ? formData.date.toDate().toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-6 border-b border-gray-100 pb-2 text-xl font-bold text-gray-800">
        {isEditMode ? 'Edit Review' : 'Add New Review'}
      </h3>

      <Transition
        as={Fragment}
        show={!!error}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        {error ? (
          <div
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
            aria-live="assertive"
          >
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
              <span>{error}</span>
            </div>
          </div>
        ) : null}
      </Transition>

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
              id="author"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Customer name"
              aria-describedby="author-help"
            />
            <p id="author-help" className="text-xs text-gray-500">
              Enter the public display name from the review.
            </p>
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
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-describedby="source-help"
            >
              <option value="google">Google</option>
            </select>
            <p id="source-help" className="text-xs text-gray-500">
              Only Google reviews are supported.
            </p>
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-1 block text-sm font-medium text-gray-700">
            Rating <span className="text-red-500">*</span>
          </legend>

          <RadioGroup
            value={formData.rating}
            onChange={(val: number) =>
              setFormData(prev => ({ ...prev, rating: val }))
            }
          >
            <RadioGroup.Label className="sr-only">
              Select star rating
            </RadioGroup.Label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <RadioGroup.Option
                  key={star}
                  value={star}
                  className={({ checked }) =>
                    `cursor-pointer rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${checked ? 'ring-2 ring-blue-500' : 'ring-0'}`
                  }
                >
                  {() => (
                    <span
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      role="img"
                    >
                      <svg
                        className={`h-7 w-7 transition-colors ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </fieldset>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Review Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              value={formattedDate}
              onChange={handleDateChange}
              className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-describedby="date-help"
            />
            <p id="date-help" className="text-xs text-gray-500">
              Use the date the review was posted.
            </p>
          </div>

          <div className="space-y-2 md:col-span-1">
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
              className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="What did the customer say?"
              aria-describedby="text-help"
            />
            <p id="text-help" className="text-xs text-gray-500">
              Keep it concise and accurate.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onComplete}
            className="cursor-pointer rounded-2xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition ring-inset hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0A12 12 0 000 12h4z"
                  />
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
