import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
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
  // Categories are imported at the top of the file

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

        if (foodData.imageUrl) {
          setImagePreview(foodData.imageUrl);
        }
      } else {
        setError('Food item not found');
      }
    } catch (err) {
      setError('Failed to load food item');
      console.error(err);
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

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
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

      if (isEditMode && foodId) {
        await updateFoodItem(foodId, formData, imageFile);
      } else {
        await addFoodItem(formData, imageFile);
      }

      resetForm();
      onComplete();
    } catch (err) {
      setError(
        `Failed to ${isEditMode ? 'update' : 'add'} food item. Please try again.`
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
          Loading food item...
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6">
      <h3 className="mb-6 border-b border-gray-100 pb-2 text-xl font-bold text-gray-800">
        {isEditMode ? 'Edit Food Item' : 'Add New Food Item'}
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Food Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter food name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
            >
              <option value="">Select a category</option>
              {foodCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
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
            className="block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter a detailed description of the food item"
          />
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-center">
            <input
              id="favorite"
              name="favorite"
              type="checkbox"
              checked={formData.favorite}
              onChange={handleCheckboxChange}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 transition-colors duration-200 focus:ring-blue-500"
            />
            <label
              htmlFor="favorite"
              className="ml-3 block cursor-pointer text-sm font-medium text-gray-700"
            >
              Feature as a favorite item
            </label>
          </div>
          <p className="mt-1 ml-8 text-xs text-gray-500">
            Featured items will be displayed prominently on the website.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Food Image{' '}
            {isEditMode ? '' : <span className="text-red-500">*</span>}
          </label>

          <div className="mt-2">
            {imagePreview && (
              <div className="group relative mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-auto rounded-md object-cover shadow-sm"
                />
                <div className="bg-opacity-0 group-hover:bg-opacity-30 absolute inset-0 flex items-center justify-center rounded-md bg-black transition-all duration-200">
                  <p className="font-medium text-white opacity-0 group-hover:opacity-100">
                    Current image
                  </p>
                </div>
              </div>
            )}

            <div className="mt-1 flex cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition-colors duration-200 hover:border-blue-400">
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
                    className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-blue-500"
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
