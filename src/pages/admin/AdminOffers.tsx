import { useState, useEffect } from 'react';
import { getAllOffers, deleteOffer, type Offer } from '../../firebase/offerService';
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
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-3 text-blue-600 font-medium">Loading offers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Offers &amp; Upcoming Items
        </h3>
      </div>
      
      {offers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No offers yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new offer.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                        {offer.imageUrl ? (
                          <img 
                            className="h-10 w-10 object-cover" 
                            src={offer.imageUrl} 
                            alt={offer.title} 
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 flex items-center justify-center text-gray-500">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{offer.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {offer.isUpcoming && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Upcoming
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {offer.isUpcoming && offer.availabilityDate ? (
                      <span>
                        {new Date(offer.availabilityDate.seconds * 1000).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>Available now</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {offer.createdAt ? (
                      <span title={new Date(offer.createdAt.seconds * 1000).toLocaleString()}>
                        {formatDistanceToNow(new Date(offer.createdAt.seconds * 1000), { addSuffix: true })}
                      </span>
                    ) : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditOffer(offer.id!)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    {confirmDelete === offer.id ? (
                      <div className="inline-flex">
                        <button
                          onClick={() => handleDelete(offer.id!)}
                          disabled={isDeleting === offer.id}
                          className={`text-red-600 hover:text-red-900 mr-2 ${isDeleting === offer.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isDeleting === offer.id ? 'Deleting...' : 'Confirm'}
                        </button>
                        <button
                          onClick={cancelDelete}
                          disabled={isDeleting === offer.id}
                          className={`text-gray-600 hover:text-gray-900 ${isDeleting === offer.id ? 'opacity-50 cursor-not-allowed' : ''}`}
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
