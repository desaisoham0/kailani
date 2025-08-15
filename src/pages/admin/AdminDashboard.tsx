import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../firebase/authService';
import { useAuth } from '../../hooks/useAuth';
import AdminFoodList from './AdminFoodList';
import AdminFoodForm from './AdminFoodForm';
import AdminReviews from './AdminReviews';
import AdminReviewForm from './AdminReviewForm';
import AdminHoursForm from './AdminHoursForm';
import AdminOffers from './AdminOffers';
import AdminOfferForm from './AdminOfferForm';

export default function AdminDashboard() {
  const noop = () => undefined;
  const [activeTab, setActiveTab] = useState<
    | 'food-list'
    | 'food-add'
    | 'reviews-list'
    | 'reviews-add'
    | 'hours'
    | 'offers-list'
    | 'offers-add'
  >('food-list');
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      // Log and keep user on the page if logout fails
      console.error('Failed to logout:', error);
    }
  };

  const handleEditFood = (foodId: string) => {
    setEditingFoodId(foodId);
    setActiveTab('food-add');
    setIsMobileMenuOpen(false);
  };

  const handleFoodFormComplete = () => {
    setEditingFoodId(null);
    setActiveTab('food-list');
  };

  const handleEditReview = (reviewId: string) => {
    setEditingReviewId(reviewId);
    setActiveTab('reviews-add');
    setIsMobileMenuOpen(false);
  };

  const handleReviewFormComplete = () => {
    setEditingReviewId(null);
    setActiveTab('reviews-list');
  };

  const handleEditOffer = (offerId: string) => {
    setEditingOfferId(offerId);
    setActiveTab('offers-add');
    setIsMobileMenuOpen(false);
  };

  const handleOfferFormComplete = () => {
    setEditingOfferId(null);
    setActiveTab('offers-list');
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center" role="status" aria-live="polite">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-t-4 border-b-4 border-blue-500" />
          <p className="mt-4 font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      id: 'food-list' as const,
      label: 'Food Items',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      onClick: noop,
    },
    {
      id: 'food-add' as const,
      label:
        editingFoodId && activeTab === 'food-add'
          ? 'Edit Food Item'
          : 'Add Food Item',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      onClick: () => setEditingFoodId(null),
    },
    {
      id: 'reviews-list' as const,
      label: 'Reviews',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
      onClick: noop,
    },
    {
      id: 'reviews-add' as const,
      label:
        editingReviewId && activeTab === 'reviews-add'
          ? 'Edit Review'
          : 'Add Review',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ),
      onClick: () => setEditingReviewId(null),
    },
    {
      id: 'hours' as const,
      label: 'Hours of Operation',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      onClick: noop,
    },
    {
      id: 'offers-list' as const,
      label: 'Offers & Upcoming',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      onClick: noop,
    },
    {
      id: 'offers-add' as const,
      label:
        editingOfferId && activeTab === 'offers-add'
          ? 'Edit Offer'
          : 'Add Offer',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
      ),
      onClick: () => setEditingOfferId(null),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'food-list':
        return <AdminFoodList onEditFood={handleEditFood} />;
      case 'food-add':
        return (
          <AdminFoodForm
            foodId={editingFoodId}
            onComplete={handleFoodFormComplete}
          />
        );
      case 'reviews-list':
        return <AdminReviews onEditReview={handleEditReview} />;
      case 'reviews-add':
        return (
          <AdminReviewForm
            reviewId={editingReviewId}
            onComplete={handleReviewFormComplete}
          />
        );
      case 'hours':
        return <AdminHoursForm />;
      case 'offers-list':
        return <AdminOffers onEditOffer={handleEditOffer} />;
      case 'offers-add':
        return (
          <AdminOfferForm
            offerId={editingOfferId}
            onComplete={handleOfferFormComplete}
          />
        );
      default:
        return <AdminFoodList onEditFood={handleEditFood} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Toggle menu"
                aria-controls="mobile-nav"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="cursor-pointer rounded-2xl p-2 text-gray-600 ring-1 ring-transparent transition hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Kailani Admin
              </h1>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex cursor-pointer items-center rounded-2xl border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 hover:shadow focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <Transition
          show={isMobileMenuOpen}
          enter="transition duration-150 ease-out"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition duration-100 ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div id="mobile-nav" className="md:hidden">
            <nav className="z-20 bg-white shadow-lg">
              <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={activeTab === item.id ? 'page' : undefined}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      activeTab === item.id
                        ? 'border-l-4 border-blue-500 bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    } cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none`}
                    onClick={() => {
                      handleTabChange(item.id);
                      item.onClick();
                    }}
                  >
                    <span
                      className={`${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </Transition>
      </header>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row">
          <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] bg-white shadow-md md:block md:w-64">
            <div className="px-6 pt-6 pb-3">
              <h2 className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Dashboard
              </h2>
            </div>
            <nav className="space-y-1 px-3 pb-4" aria-label="Admin sections">
              {navItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  aria-current={activeTab === item.id ? 'page' : undefined}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeTab === item.id
                      ? 'border-l-4 border-blue-500 bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } cursor-pointer hover:translate-x-0.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none`}
                  onClick={() => {
                    handleTabChange(item.id);
                    item.onClick();
                  }}
                >
                  <span
                    className={`${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-4 border-b border-gray-200 pb-2 md:hidden">
              <h2 className="text-xl font-medium text-gray-800">
                {navItems.find(item => item.id === activeTab)?.label}
              </h2>
            </div>

            <section
              aria-labelledby="content-title"
              className="rounded-2xl bg-white shadow-sm"
            >
              <h3 id="content-title" className="sr-only">
                {navItems.find(item => item.id === activeTab)?.label}
              </h3>
              <div className="overflow-hidden rounded-2xl">
                {renderContent()}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
