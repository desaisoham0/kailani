import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { addOffer, updateOffer, type Offer } from '../../firebase/offerService';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface AdminOfferFormProps {
  offerId: string | null;
  onComplete: () => void;
}

export default function AdminOfferForm({
  offerId,
  onComplete,
}: AdminOfferFormProps) {
  const [formData, setFormData] = useState<
    Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>
  >({
    title: '',
    description: '',
    imageUrl: '',
    isActive: true,
    isUpcoming: false,
    availabilityDate: null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dateString, setDateString] = useState<string>('');

  useEffect(() => {
    if (offerId) {
      setIsEditMode(true);
      fetchOffer(offerId);
    } else {
      resetForm();
      setIsEditMode(false);
    }
  }, [offerId]);

  const fetchOffer = async (id: string) => {
    try {
      setFetchLoading(true);
      const offerRef = doc(db, 'offers', id);
      const offerDoc = await getDoc(offerRef);

      if (offerDoc.exists()) {
        const offerData = offerDoc.data() as Omit<Offer, 'id'>;
        setFormData({
          title: offerData.title || '',
          description: offerData.description || '',
          isActive: offerData.isActive || false,
          isUpcoming: offerData.isUpcoming || false,
          availabilityDate: offerData.availabilityDate || null,
          imageUrl: offerData.imageUrl || '',
        });

        // Format date for input if it exists
        if (offerData.availabilityDate) {
          const date = offerData.availabilityDate.toDate();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          setDateString(`${year}-${month}-${day}`);
        }

        if (offerData.imageUrl) {
          setImagePreview(offerData.imageUrl);
        }
      } else {
        setError('Offer not found');
      }
    } catch (err) {
      setError('Failed to load offer');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      isActive: true,
      isUpcoming: false,
      availabilityDate: null,
    });
    setImageFile(null);
    setImagePreview(null);
    setDateString('');
    setError(null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setDateString(dateValue);

    if (dateValue) {
      const timestamp = Timestamp.fromDate(new Date(dateValue));
      setFormData(prev => ({
        ...prev,
        availabilityDate: timestamp,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        availabilityDate: null,
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // If it's an upcoming item but no date is set, show error
      if (formData.isUpcoming && !formData.availabilityDate) {
        setError('Availability date is required for upcoming items');
        setLoading(false);
        return;
      }

      // If it's not an upcoming item, clear the availability date
      const submitData = {
        ...formData,
        availabilityDate: formData.isUpcoming
          ? formData.availabilityDate
          : null,
      };

      if (isEditMode && offerId) {
        await updateOffer(offerId, submitData, imageFile);
      } else {
        await addOffer(submitData, imageFile);
      }

      resetForm();
      onComplete();
    } catch (err) {
      setError(
        `Failed to ${isEditMode ? 'update' : 'add'} offer. Please try again.`
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
        <span className="ml-3 font-medium text-blue-600">Loading offer...</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-6 border-b border-gray-100 pb-2 text-xl font-bold text-gray-800">
        {isEditMode ? 'Edit Offer' : 'Add New Offer'}
      </h3>

      {error && (
        <div className="mb-6 animate-pulse rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex">
            <svg
              className="mr-2 h-5 w-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Offer Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Summer Special"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the offer or upcoming item"
              />
            </div>

            <div>
              <label className="mb-3 flex cursor-pointer items-center space-x-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">
                  Active (Show on website)
                </span>
              </label>
            </div>

            <div>
              <label className="mb-3 flex cursor-pointer items-center space-x-3">
                <input
                  type="checkbox"
                  name="isUpcoming"
                  checked={formData.isUpcoming}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">Upcoming Item</span>
              </label>
            </div>

            <div className={formData.isUpcoming ? 'block' : 'hidden'}>
              <label
                htmlFor="availabilityDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Availability Date{' '}
                {formData.isUpcoming && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                id="availabilityDate"
                name="availabilityDate"
                value={dateString}
                onChange={handleDateChange}
                required={formData.isUpcoming}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                When will this item be available?
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Offer Image
              </label>

              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-40 rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, imageUrl: '' }));
                        }}
                        className="mt-2 inline-flex items-center rounded border border-transparent bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}

                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onComplete();
            }}
            disabled={loading}
            className="mr-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="focus:ring-opacity-50 flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-400"
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
                Saving...
              </>
            ) : (
              `${isEditMode ? 'Update' : 'Save'} Offer`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
