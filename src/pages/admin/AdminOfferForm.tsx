import { useState, useEffect, Fragment } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Switch, Transition } from '@headlessui/react';
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
        if (offerData.availabilityDate) {
          const date = offerData.availabilityDate.toDate();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          setDateString(`${year}-${month}-${day}`);
        }
        if (offerData.imageUrl) setImagePreview(offerData.imageUrl);
      } else {
        setError('Offer not found');
      }
    } catch {
      setError('Failed to load offer');
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setDateString(dateValue);
    if (dateValue) {
      const timestamp = Timestamp.fromDate(new Date(dateValue));
      setFormData(prev => ({ ...prev, availabilityDate: timestamp }));
    } else {
      setFormData(prev => ({ ...prev, availabilityDate: null }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      if (formData.isUpcoming && !formData.availabilityDate) {
        setError('Availability date is required for upcoming items');
        setLoading(false);
        return;
      }
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
    } catch {
      setError(
        `Failed to ${isEditMode ? 'update' : 'add'} offer. Please try again.`
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
          Loading offer...
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-6 border-b border-gray-100 pb-2 text-xl font-bold text-gray-800">
        {isEditMode ? 'Edit Offer' : 'Add New Offer'}
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
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        ) : null}
      </Transition>

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
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Summer Special"
                aria-describedby="title-help"
              />
              <p id="title-help" className="mt-1 text-xs text-gray-500">
                Keep it short and descriptive.
              </p>
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
                className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Describe the offer or upcoming item"
                aria-describedby="desc-help"
              />
              <p id="desc-help" className="mt-1 text-xs text-gray-500">
                Mention dates, limitations, or eligibility.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2">
                <span className="text-sm font-medium text-gray-700">
                  Active (Show on website)
                </span>
                <Switch
                  checked={formData.isActive}
                  onChange={(val: boolean) =>
                    setFormData(prev => ({ ...prev, isActive: val }))
                  }
                  className={`${
                    formData.isActive ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none`}
                  aria-label="Toggle active status"
                >
                  <span
                    className={`${
                      formData.isActive ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2">
                <span className="text-sm font-medium text-gray-700">
                  Upcoming Item
                </span>
                <Switch
                  checked={formData.isUpcoming}
                  onChange={(val: boolean) =>
                    setFormData(prev => ({ ...prev, isUpcoming: val }))
                  }
                  className={`${
                    formData.isUpcoming ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none`}
                  aria-label="Toggle upcoming status"
                >
                  <span
                    className={`${
                      formData.isUpcoming ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition`}
                  />
                </Switch>
              </div>

              <Transition
                as={Fragment}
                show={formData.isUpcoming}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 -translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-1"
              >
                <div>
                  <label
                    htmlFor="availabilityDate"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Availability Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="availabilityDate"
                    name="availabilityDate"
                    type="date"
                    value={dateString}
                    onChange={handleDateChange}
                    required={formData.isUpcoming}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    aria-describedby="date-help"
                  />
                  <p id="date-help" className="mt-1 text-xs text-gray-500">
                    When will this item be available?
                  </p>
                </div>
              </Transition>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Offer Image
              </span>

              <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition hover:border-blue-400">
                <div className="space-y-2 text-center">
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-40 rounded-2xl object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, imageUrl: '' }));
                        }}
                        className="mt-3 inline-flex cursor-pointer items-center rounded-2xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm ring-1 ring-red-200 transition ring-inset hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                        aria-label="Remove image"
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

                  <div className="flex justify-center text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer rounded-2xl bg-white px-2 font-medium text-blue-600 transition focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-blue-500"
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

        <div className="flex flex-col-reverse items-stretch gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onComplete();
            }}
            disabled={loading}
            className="cursor-pointer rounded-2xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition ring-inset hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
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
