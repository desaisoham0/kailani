import { useState, useEffect } from 'react';
import {
  getAllOffers,
  deleteOffer,
  type Offer,
} from '../../firebase/offerService';
import { formatDistanceToNow } from 'date-fns';

interface AdminOffersProps {
  onEditOffer: (offerId: string) => void;
}

export default function AdminOffers({ onEditOffer }: AdminOffersProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const offersData = await getAllOffers();
      setOffers(offersData);
    } catch (err) {
      setError('Failed to load offers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (offerId: string) => {
    if (confirmDelete !== offerId) {
      setConfirmDelete(offerId);
      return;
    }

    try {
      setIsDeleting(offerId);
      await deleteOffer(offerId);
      setOffers(prevOffers => prevOffers.filter(offer => offer.id !== offerId));
    } catch (err) {
      setError('Failed to delete the offer');
      console.error(err);
    } finally {
      setIsDeleting(null);
      setConfirmDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-3 font-medium text-blue-600">
          Loading offers...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
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
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
            <div className="mt-2 text-sm text-red-700">
              <button
                onClick={loadOffers}
                className="font-medium underline hover:text-red-600"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          Offers &amp; Upcoming Items
        </h3>
      </div>

      {offers.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No offers yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new offer.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Offer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Availability
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Created
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {offers.map(offer => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                        {offer.imageUrl ? (
                          <img
                            className="h-10 w-10 object-cover"
                            src={offer.imageUrl}
                            alt={offer.title}
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center bg-gray-200 text-gray-500">
                            <svg
                              className="h-6 w-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {offer.title}
                        </div>
                        <div className="max-w-xs truncate text-sm text-gray-500">
                          {offer.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {offer.isUpcoming && (
                      <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800">
                        Upcoming
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {offer.isUpcoming && offer.availabilityDate ? (
                      <span>
                        {new Date(
                          offer.availabilityDate.seconds * 1000
                        ).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>Available now</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {offer.createdAt ? (
                      <span
                        title={new Date(
                          offer.createdAt.seconds * 1000
                        ).toLocaleString()}
                      >
                        {formatDistanceToNow(
                          new Date(offer.createdAt.seconds * 1000),
                          { addSuffix: true }
                        )}
                      </span>
                    ) : (
                      'Unknown'
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => onEditOffer(offer.id!)}
                      className="mr-4 text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    {confirmDelete === offer.id ? (
                      <div className="inline-flex">
                        <button
                          onClick={() => handleDelete(offer.id!)}
                          disabled={isDeleting === offer.id}
                          className={`mr-2 text-red-600 hover:text-red-900 ${isDeleting === offer.id ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          {isDeleting === offer.id ? 'Deleting...' : 'Confirm'}
                        </button>
                        <button
                          onClick={cancelDelete}
                          disabled={isDeleting === offer.id}
                          className={`text-gray-600 hover:text-gray-900 ${isDeleting === offer.id ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(offer.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
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
