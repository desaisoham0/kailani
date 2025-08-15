import React, { useState, useEffect } from 'react';
import { submitForm } from '../services/emailService';
import {
  getHoursOfOperation,
  type HoursOfOperation,
  type DayHours,
} from '../firebase/hoursService';

interface OpeningHours {
  day: string;
  hours: string;
  isToday: boolean;
}

const useHours = () => {
  const [hoursData, setHoursData] = useState<HoursOfOperation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const hours = await getHoursOfOperation();
        setHoursData(hours);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hours');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHours();
  }, []);

  return { hoursData, isLoading, error };
};

const ContactPage: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<'contact' | 'location' | 'hours'>(
    'hours'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [todaysDay, setTodaysDay] = useState<string>('');
  const { hoursData, isLoading: hoursLoading } = useHours();

  useEffect(() => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date().getDay();
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (
      tabParam === 'hours' ||
      tabParam === 'location' ||
      tabParam === 'contact'
    ) {
      setActiveTab(tabParam);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTodaysDay(days[today]);
  }, []);

  const openingHours: OpeningHours[] =
    hoursData?.days.map((day: DayHours) => ({
      day: day.day,
      hours: day.isOpen ? day.hours : 'Closed',
      isToday: day.day === todaysDay,
    })) || [];

  const handleFocus = (field: string) => setActiveField(field);
  const handleBlur = () => setActiveField(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    try {
      const contactFormData = new FormData();
      contactFormData.append('type', 'contact');
      Object.entries(formData).forEach(([key, value]) =>
        contactFormData.append(key, value)
      );
      await submitForm(contactFormData, 'contact');
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setFormError(
        `Failed to send your message: ${errorMessage}. Please try again or contact us directly by phone.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f0c91f] pb-16">
      <div className="relative h-64 w-full overflow-hidden bg-[#19b4bd] sm:h-80 md:h-96">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="font-navigation baloo-regular mb-2 text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-6xl">
            Contact Us
          </h1>
          <p className="nunito-sans max-w-xl px-4 text-lg text-white drop-shadow sm:text-xl md:text-2xl">
            We'd love to hear from you!
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 290"
            className="w-full"
          >
            <path
              fill="#f0c91f"
              fillOpacity="1"
              d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,165.3C960,171,1056,213,1152,213.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-8 w-full px-4 pt-8">
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl bg-white p-2 shadow-lg">
          <div
            className="flex flex-wrap justify-center"
            role="tablist"
            aria-label="Contact sections"
          >
            <button
              type="button"
              onClick={() => setActiveTab('hours')}
              role="tab"
              aria-selected={activeTab === 'hours'}
              aria-controls="hours-panel"
              className={`jua-regular flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-2xl px-3 py-3 text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none sm:px-4 sm:text-lg md:py-4 ${
                activeTab === 'hours'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Hours
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              role="tab"
              aria-selected={activeTab === 'contact'}
              aria-controls="contact-panel"
              className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-2xl px-3 py-3 text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none sm:px-4 sm:text-lg md:py-4 ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">Message Us</span>
              <span className="sm:hidden">Message</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('location')}
              role="tab"
              aria-selected={activeTab === 'location'}
              aria-controls="location-panel"
              className={`jua-regular flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-2xl px-3 py-3 text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none sm:px-4 sm:text-lg md:py-4 ${
                activeTab === 'location'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">Find Us</span>
              <span className="sm:hidden">Find</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full overflow-x-hidden px-4">
        {activeTab === 'contact' && (
          <div
            id="contact-panel"
            role="tabpanel"
            aria-label="Contact form"
            className="mx-auto w-full max-w-4xl overflow-x-hidden"
          >
            <div className="w-full overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="w-full md:flex">
                <div className="relative min-w-0 p-6 sm:p-8 md:w-1/2 md:p-12">
                  <div
                    className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    aria-hidden="true"
                  />
                  {submitSuccess ? (
                    <div
                      className="flex h-full flex-col items-center justify-center"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h2 className="jua-regular mb-2 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                        Thank You!
                      </h2>
                      <p className="nunito-sans text-center text-gray-600">
                        We've received your message and will get back to you
                        soon.
                      </p>
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-8 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="jua-regular mb-2 text-xl font-bold text-indigo-800 sm:text-2xl md:text-3xl">
                        Get in Touch
                      </h2>
                      <p className="nunito-sans mb-6 text-gray-600">
                        Questions, comments, or just want to say aloha? We'd
                        love to hear from you!
                      </p>
                      <form
                        onSubmit={handleSubmit}
                        aria-describedby={formError ? 'form-error' : undefined}
                      >
                        {formError && (
                          <div
                            id="form-error"
                            role="alert"
                            className="relative mb-6 rounded-xl border-2 border-red-100 bg-red-50 px-4 py-3 text-red-700"
                          >
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg
                                  className="h-5 w-5 text-red-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-sm">{formError}</p>
                            </div>
                          </div>
                        )}

                        <div className="mb-4">
                          <div
                            className={`rounded-2xl bg-gray-50 p-3 transition-all ${activeField === 'name' ? 'shadow-sm ring-2 ring-indigo-300' : 'hover:bg-gray-100'} focus-within:ring-2 focus-within:ring-indigo-400`}
                          >
                            <label
                              htmlFor="name"
                              className="nunito-sans mb-1 block font-semibold text-gray-700"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              onFocus={() => handleFocus('name')}
                              onBlur={handleBlur}
                              className="nunito-sans w-full bg-transparent p-2 focus-visible:outline-none"
                              placeholder="Your name"
                              aria-required="true"
                              aria-invalid={false}
                              aria-describedby="name-help"
                              required
                            />
                            <p
                              id="name-help"
                              className="mt-1 text-xs text-gray-500"
                            >
                              How should we address you
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div
                            className={`rounded-2xl bg-gray-50 p-3 transition-all ${activeField === 'email' ? 'shadow-sm ring-2 ring-indigo-300' : 'hover:bg-gray-100'} focus-within:ring-2 focus-within:ring-indigo-400`}
                          >
                            <label
                              htmlFor="email"
                              className="nunito-sans mb-1 block font-semibold text-gray-700"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              onFocus={() => handleFocus('email')}
                              onBlur={handleBlur}
                              className="nunito-sans w-full bg-transparent p-2 focus-visible:outline-none"
                              placeholder="your@email.com"
                              aria-required="true"
                              aria-invalid={false}
                              aria-describedby="email-help"
                              required
                            />
                            <p
                              id="email-help"
                              className="mt-1 text-xs text-gray-500"
                            >
                              We only use this to reply
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div
                            className={`rounded-2xl bg-gray-50 p-3 transition-all ${activeField === 'subject' ? 'shadow-sm ring-2 ring-indigo-300' : 'hover:bg-gray-100'} focus-within:ring-2 focus-within:ring-indigo-400`}
                          >
                            <label
                              htmlFor="subject"
                              className="nunito-sans mb-1 block font-semibold text-gray-700"
                            >
                              Subject
                            </label>
                            <input
                              type="text"
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              onFocus={() => handleFocus('subject')}
                              onBlur={handleBlur}
                              className="nunito-sans w-full bg-transparent p-2 focus-visible:outline-none"
                              placeholder="What's this about?"
                              aria-required="true"
                              aria-invalid={false}
                              aria-describedby="subject-help"
                              required
                            />
                            <p
                              id="subject-help"
                              className="mt-1 text-xs text-gray-500"
                            >
                              A few words is enough
                            </p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <div
                            className={`rounded-2xl bg-gray-50 p-3 transition-all ${activeField === 'message' ? 'shadow-sm ring-2 ring-indigo-300' : 'hover:bg-gray-100'} focus-within:ring-2 focus-within:ring-indigo-400`}
                          >
                            <label
                              htmlFor="message"
                              className="nunito-sans mb-1 block font-semibold text-gray-700"
                            >
                              Message
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              rows={5}
                              value={formData.message}
                              onChange={handleInputChange}
                              onFocus={() => handleFocus('message')}
                              onBlur={handleBlur}
                              className="nunito-sans w-full resize-y bg-transparent p-2 focus-visible:outline-none"
                              placeholder="Your message"
                              aria-required="true"
                              aria-invalid={false}
                              aria-describedby="message-help"
                              required
                            />
                            <p
                              id="message-help"
                              className="mt-1 text-xs text-gray-500"
                            >
                              Include any details that help us assist you
                            </p>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          aria-busy={isSubmitting}
                          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-3 font-bold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
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
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <svg
                                className="ml-2 h-5 w-5"
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
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
                <div className="flex min-w-0 flex-col justify-center bg-indigo-50 p-6 sm:p-8 md:w-1/2 md:p-12">
                  <div
                    className="mx-auto mb-6 flex h-48 w-48 items-center justify-center sm:h-64 sm:w-64"
                    aria-hidden="true"
                  >
                    <div className="relative h-full w-full">
                      <div className="absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500 opacity-10 [animation-duration:3s] motion-safe:animate-pulse" />
                      <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-cyan-500 opacity-10 [animation-duration:4s] motion-safe:animate-pulse" />
                      <div className="absolute top-1/4 right-1/4 h-16 w-16 rounded-full bg-indigo-600 opacity-20" />
                      <div className="absolute bottom-1/4 left-1/3 h-12 w-12 rounded-full bg-teal-400 opacity-20" />
                      <div className="absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-indigo-100 shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="jua-regular font-bold text-gray-700">
                          Phone
                        </h3>
                        <p className="nunito-sans text-gray-600">
                          (201) 402-9600
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="jua-regular font-bold text-gray-700">
                          Email
                        </h3>
                        <p className="nunito-sans text-gray-600">
                          kailanishaveicenj@gmail.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-teal-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="jua-regular font-bold text-gray-700">
                          Address
                        </h3>
                        <p className="nunito-sans text-gray-600">
                          840 River Rd, New Milford, NJ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div
            id="location-panel"
            role="tabpanel"
            aria-label="Location details"
            className="mx-auto w-full max-w-4xl overflow-x-hidden"
          >
            <div className="w-full overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="w-full md:flex">
                <div className="order-2 min-w-0 p-6 sm:p-8 md:order-1 md:w-1/2 md:p-12">
                  <h2 className="jua-regular mb-6 text-xl font-bold text-amber-600 sm:text-2xl md:text-3xl">
                    Visit Us
                  </h2>
                  <p className="nunito-sans mb-8 text-gray-600">
                    We're conveniently located in the heart of Honolulu, just
                    minutes from Waikiki Beach. Come experience the authentic
                    taste of Hawaii in our warm and welcoming restaurant!
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div
                        className="mt-1 mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100"
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="jua-regular text-lg font-bold text-gray-700 sm:text-xl">
                          Our Location
                        </h3>
                        <p className="nunito-sans mb-2 text-gray-600">
                          840 River Rd
                        </p>
                        <p className="nunito-sans mb-2 text-gray-600">
                          New Milford, NJ 07646
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className="mt-1 mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100"
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="jua-regular text-lg font-bold text-gray-700 sm:text-xl">
                          Parking Information
                        </h3>
                        <p className="nunito-sans mb-2 text-gray-600">
                          Free parking available in our restaurant lot.
                          Additional street parking and public parking garage
                          available within a block.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className="mt-1 mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100"
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="jua-regular text-lg font-bold text-gray-700 sm:text-xl">
                          Hours Today
                        </h3>
                        <p className="nunito-sans mb-2 text-gray-600">
                          {todaysDay === 'Monday'
                            ? 'Closed'
                            : todaysDay === 'Friday' ||
                                todaysDay === 'Saturday' ||
                                todaysDay === 'Sunday'
                              ? '11:30 AM - 9:00 PM'
                              : '11:30 AM - 8:00 PM'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://maps.app.goo.gl/KWjLfCxkkYvf7qYh8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-bold text-white shadow-sm transition-all duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Get Directions
                  </a>
                </div>
                <div className="relative order-1 h-72 bg-gradient-to-br from-amber-50 to-amber-100 md:order-2 md:h-auto md:w-1/2">
                  <div
                    className="absolute inset-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    <div className="absolute top-1/4 right-1/4 h-40 w-40 rounded-full bg-amber-200 opacity-40" />
                    <div className="absolute bottom-1/4 left-1/4 h-32 w-32 rounded-full bg-amber-300 opacity-30" />
                    <div className="absolute top-1/2 right-1/3 h-16 w-16 rounded-full bg-amber-400 opacity-20" />
                    <div className="absolute inset-0 opacity-10">
                      <div className="grid h-full grid-cols-6">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div key={i} className="border border-amber-300" />
                        ))}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative transition duration-700 hover:scale-105">
                        <div className="absolute -inset-4 rounded-full bg-amber-200 opacity-30 [animation-duration:3s] motion-safe:animate-pulse" />
                        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div
            id="hours-panel"
            role="tabpanel"
            aria-label="Opening hours"
            className="mx-auto max-w-4xl px-3 sm:px-4"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="relative">
                <div
                  className="h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400"
                  aria-hidden="true"
                />
                <div className="p-4 sm:p-6 lg:p-10">
                  <div className="mb-6 text-center sm:mb-8">
                    <h2 className="jua-regular mb-2 text-xl font-bold text-gray-800 sm:mb-3 sm:text-2xl lg:text-4xl">
                      Opening Hours
                    </h2>
                    <p className="nunito-sans mx-auto max-w-2xl px-2 text-sm text-gray-600 sm:text-base">
                      Come visit us for lunch, dinner, or anytime in between!
                    </p>
                  </div>

                  <div className="mx-auto mb-6 max-w-sm sm:mb-10 sm:max-w-md">
                    {hoursLoading ? (
                      <div
                        className="flex flex-col items-center justify-center space-y-3 py-8 sm:py-12"
                        role="status"
                        aria-live="polite"
                      >
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-500 sm:h-10 sm:w-10" />
                        <span className="text-sm font-medium text-teal-600 sm:text-base">
                          Loading hours...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1.5 sm:space-y-2">
                        {openingHours.map(dayInfo => (
                          <div
                            key={dayInfo.day}
                            className={`flex items-center justify-between rounded-xl px-3 py-3 transition-all duration-200 hover:shadow-sm sm:rounded-2xl sm:px-4 sm:py-4 ${
                              dayInfo.isToday
                                ? 'border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                              {dayInfo.isToday && (
                                <div
                                  className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-teal-500 sm:h-2 sm:w-2"
                                  aria-hidden="true"
                                />
                              )}
                              <span
                                className={`jua-regular truncate text-sm font-semibold sm:text-base ${dayInfo.isToday ? 'text-teal-700' : 'text-gray-800'}`}
                              >
                                {dayInfo.day}
                              </span>
                              {dayInfo.isToday && (
                                <span className="flex-shrink-0 rounded-full bg-teal-500 px-1.5 py-0.5 text-xs font-medium text-white sm:px-2 sm:py-1">
                                  Today
                                </span>
                              )}
                            </div>
                            <span
                              className={`nunito-sans ml-2 flex-shrink-0 text-sm font-medium sm:text-base ${dayInfo.isToday ? 'text-teal-700' : 'text-gray-600'}`}
                            >
                              {dayInfo.hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-6 sm:pt-8">
                    <div className="mb-4 text-center sm:mb-6">
                      <h3 className="jua-regular mb-1 text-lg font-bold text-gray-800 sm:mb-2 sm:text-xl lg:text-2xl">
                        Have Questions?
                      </h3>
                      <p className="nunito-sans px-2 text-sm text-gray-600 sm:text-base">
                        Our friendly staff is here to help with any questions
                        about our hours, menu, or services.
                      </p>
                    </div>
                    <div className="mx-auto max-w-xs sm:max-w-sm">
                      <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-4 sm:p-6">
                        <div className="mb-3 text-center sm:mb-4">
                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 sm:mb-3 sm:h-12 sm:w-12">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-teal-600 sm:h-6 sm:w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <span className="nunito-sans text-sm font-semibold text-teal-800 sm:text-base">
                            Call us anytime
                          </span>
                        </div>
                        <a
                          href="tel:+1-201-402-9600"
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none sm:text-base"
                          aria-label="Call (201) 402-9600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span>(201) 402-9600</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 w-full overflow-hidden rounded-t-3xl bg-[#78350F]">
          <div className="pt-16" />
          <div className="mb-12 text-center">
            <h2 className="jua-regular relative mb-4 inline-block text-2xl font-bold text-white sm:text-3xl">
              Frequently Asked Questions
              <span
                className="absolute -bottom-2 left-0 h-2 w-full rounded-full bg-yellow-100 opacity-50"
                aria-hidden="true"
              />
            </h2>
            <p className="nunito-sans mx-auto max-w-2xl px-4 text-white">
              Find answers to our most commonly asked questions. If you don't
              see what you're looking for, feel free to contact us!
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-6xl gap-6 bg-[#78350F] px-6 pb-16 md:grid-cols-2">
            <div className="w-full transform overflow-hidden rounded-2xl bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="p-6">
                <div
                  className="mb-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="jua-regular mb-3 text-lg font-bold text-gray-800 sm:text-xl">
                  Do you take reservations?
                </h3>
                <p className="nunito-sans text-gray-600">
                  Yes, we recommend making reservations, especially for dinner
                  and weekend visits. You can reserve a table by phone, email,
                  or through our website.
                </p>
              </div>
            </div>

            <div className="w-full transform overflow-hidden rounded-2xl bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="p-6">
                <div
                  className="mb-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="jua-regular mb-3 text-lg font-bold text-gray-800 sm:text-xl">
                  Do you offer takeout and delivery?
                </h3>
                <p className="nunito-sans text-gray-600">
                  Yes, we offer both takeout and delivery options. You can order
                  through our website or by calling us directly. We also partner
                  with major food delivery services.
                </p>
              </div>
            </div>

            <div className="w-full transform overflow-hidden rounded-2xl bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="p-6">
                <div
                  className="mb-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
                    />
                  </svg>
                </div>
                <h3 className="jua-regular mb-3 text-lg font-bold text-gray-800 sm:text-xl">
                  Do you accommodate dietary restrictions?
                </h3>
                <p className="nunito-sans text-gray-600">
                  Absolutely! We offer vegetarian, vegan, and gluten-free
                  options. Please inform your server about any allergies or
                  dietary needs, and we'll do our best to accommodate you.
                </p>
              </div>
            </div>

            <div className="w-full transform overflow-hidden rounded-2xl bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="p-6">
                <div
                  className="mb-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 009.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="jua-regular mb-3 text-lg font-bold text-gray-800 sm:text-xl">
                  Can you host private events?
                </h3>
                <p className="nunito-sans text-gray-600">
                  Yes, we have a private dining area that can accommodate groups
                  of up to 30 guests. It's perfect for birthday celebrations,
                  corporate events, and family gatherings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ContactPage;
