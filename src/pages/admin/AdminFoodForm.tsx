import { useState, useEffect, Fragment } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Listbox, Switch, Transition } from '@headlessui/react';
import {
  addFoodItem,
  updateFoodItem,
  type FoodItem,
} from '../../firebase/foodService';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { foodCategories } from '../../data/categories';

interface AdminFoodFormProps {
  foodId: string | null;
  onComplete: () => void;
}

export default function AdminFoodForm({
  foodId,
  onComplete,
}: AdminFoodFormProps) {
  const [formData, setFormData] = useState<
    Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>
  >({
    name: '',
    description: '',
    category: '',
    favorite: false,
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (foodId) {
      setIsEditMode(true);
      fetchFoodItem(foodId);
    } else {
      resetForm();
      setIsEditMode(false);
    }
  }, [foodId]);

  const fetchFoodItem = async (id: string) => {
    try {
      setFetchLoading(true);
      const foodRef = doc(db, 'food-items', id);
      const foodDoc = await getDoc(foodRef);
      if (foodDoc.exists()) {
        const foodData = foodDoc.data() as Omit<FoodItem, 'id'>;
        setFormData({
          name: foodData.name || '',
          description: foodData.description || '',
          category: foodData.category || '',
          favorite: foodData.favorite || false,
          imageUrl: foodData.imageUrl || '',
        });
        if (foodData.imageUrl) setImagePreview(foodData.imageUrl);
      } else {
        setError('Food item not found');
      }
    } catch {
      setError('Failed to load food item');
    } finally {
      setFetchLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      favorite: false,
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'favorite' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        setError('Image size should be less than 1MB');
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
      if (isEditMode && foodId) {
        await updateFoodItem(foodId, formData, imageFile);
      } else {
        await addFoodItem(formData, imageFile);
      }
      resetForm();
      onComplete();
    } catch {
      setError(
        `Failed to ${isEditMode ? 'update' : 'add'} food item. Please try again.`
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
          Loading food item...
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-6 border-b border-gray-100 pb-2 text-xl font-bold text-gray-800">
        {isEditMode ? 'Edit Food Item' : 'Add New Food Item'}
      </h3>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
            <p>{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Food Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter food name"
              aria-describedby="name-help"
            />
            <p id="name-help" className="text-xs text-gray-500">
              Use a clear, customer-friendly name.
            </p>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </span>
            <Listbox
              value={formData.category}
              onChange={(val: string) =>
                setFormData(prev => ({ ...prev, category: val }))
              }
            >
              <div className="relative">
                <Listbox.Button
                  className="relative w-full cursor-pointer rounded-2xl border border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="Select category"
                >
                  <span className="block truncate">
                    {formData.category || 'Select a category'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {foodCategories.map(cat => (
                      <Listbox.Option
                        key={cat}
                        value={cat}
                        className={({ active }) =>
                          `cursor-pointer px-3 py-2 select-none ${
                            active
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <div className="flex items-center justify-between">
                            <span
                              className={`truncate ${selected ? 'font-semibold' : 'font-normal'}`}
                            >
                              {cat}
                            </span>
                            {selected && (
                              <svg
                                className="h-4 w-4 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293A1 1 0 003.293 10.707l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <p className="text-xs text-gray-500">
              Choose the best matching category.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter a detailed description of the food item"
            aria-describedby="desc-help"
          />
          <p id="desc-help" className="text-xs text-gray-500">
            Include key ingredients and any dietary notes.
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-medium text-gray-700">
                Feature as a favorite item
              </span>
              <p className="mt-1 text-xs text-gray-600">
                Featured items are highlighted on the site.
              </p>
            </div>
            <Switch
              checked={formData.favorite}
              onChange={(val: boolean) =>
                setFormData(prev => ({ ...prev, favorite: val }))
              }
              className={`${
                formData.favorite ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 cursor-pointer rounded-full transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none`}
              aria-label="Toggle favorite"
            >
              <span
                className={`${
                  formData.favorite ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition`}
              />
            </Switch>
          </div>
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium text-gray-700">
            Food Image{' '}
            {isEditMode ? '' : <span className="text-red-500">*</span>}
          </span>

          <Transition
            as={Fragment}
            show={!!imagePreview}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
          >
            <div className="relative mb-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-auto rounded-2xl object-cover shadow-sm"
                />
              )}
              <span className="sr-only">Current image preview</span>
            </div>
          </Transition>

          <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition hover:border-blue-400">
            <div className="space-y-1 text-center">
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
                    required={!isEditMode && !imagePreview}
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
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
              'Update Food Item'
            ) : (
              'Save Food Item'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
