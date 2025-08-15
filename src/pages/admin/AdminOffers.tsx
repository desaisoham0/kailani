import { useState, useEffect, Fragment } from 'react';
import {
  getAllOffers,
  deleteOffer,
  type Offer,
} from '../../firebase/offerService';
import { Dialog, Transition } from '@headlessui/react';
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
    } catch {
      setError('Failed to load offers');
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
      setOffers(prev => prev.filter(o => o.id !== offerId));
    } catch {
      setError('Failed to delete the offer');
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
        <div
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-t-4 border-b-4 border-blue-500"
        />
        <span
          className="ml-3 font-medium text-blue-600"
          role="status"
          aria-live="polite"
        >
          Loading offers...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-200">
        <div className="flex items-start gap-3">
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
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
            <div className="mt-2">
              <button
                onClick={loadOffers}
                className="cursor-pointer rounded-2xl px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const offerToDelete = offers.find(o => o.id === confirmDelete) || null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          Offers &amp; Upcoming Items
        </h3>
      </div>

      {offers.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
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
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase sm:px-6"
                >
                  Offer
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase sm:px-6 md:table-cell"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase sm:px-6"
                >
                  Availability
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase sm:px-6 lg:table-cell"
                >
                  Created
                </th>
                <th scope="col" className="px-4 py-3 text-right sm:px-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {offers.map(offer => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl ring-1 ring-gray-200">
                        {offer.imageUrl ? (
                          <img
                            className="h-12 w-12 object-cover"
                            src={offer.imageUrl}
                            alt={offer.title}
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center bg-gray-200 text-gray-500">
                            <svg
                              className="h-6 w-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
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
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {offer.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 max-w-[42ch] text-sm text-gray-500">
                          {offer.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2 md:hidden">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {offer.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {offer.isUpcoming && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                              Upcoming
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="hidden px-4 py-4 sm:px-6 md:table-cell">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {offer.isUpcoming && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 sm:px-6">
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

                  <td className="hidden px-4 py-4 text-sm text-gray-600 sm:px-6 lg:table-cell">
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

                  <td className="px-4 py-4 text-right sm:px-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEditOffer(offer.id!)}
                        className="cursor-pointer rounded-2xl px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-blue-200 transition ring-inset hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id!)}
                        className="cursor-pointer rounded-2xl px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm ring-1 ring-red-200 transition ring-inset hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Transition appear show={!!confirmDelete} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={cancelDelete}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-md">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <Dialog.Panel className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                      <svg
                        className="h-5 w-5 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
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
                    </div>
                    <div className="min-w-0">
                      <Dialog.Title className="text-base font-semibold text-gray-900">
                        Delete offer?
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-gray-600">
                        {offerToDelete
                          ? `This will permanently remove "${offerToDelete.title}".`
                          : 'This will permanently remove the item.'}
                      </Dialog.Description>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={cancelDelete}
                      className="cursor-pointer rounded-2xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition ring-inset hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        confirmDelete && handleDelete(confirmDelete)
                      }
                      disabled={
                        !!(confirmDelete && isDeleting === confirmDelete)
                      }
                      aria-busy={
                        !!(confirmDelete && isDeleting === confirmDelete)
                      }
                      className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-red-400"
                    >
                      {confirmDelete && isDeleting === confirmDelete ? (
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
                          Deleting...
                        </>
                      ) : (
                        'Confirm delete'
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
