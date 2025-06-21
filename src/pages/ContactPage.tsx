import React, { useState, useEffect } from 'react';
import { submitForm } from '../services/emailService';
import { getHoursOfOperation } from '../firebase/hoursService';
import type { DayHours } from '../firebase/hoursService';

interface OpeningHours {
  day: string;
  hours: string;
  isToday: boolean;
}

const ContactPage: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<'contact' | 'location' | 'hours'>('hours');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [todaysDay, setTodaysDay] = useState<string>('');
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get today's day and fetch hours of operation from Firestore
  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');

    if (tabParam === 'hours' || tabParam === 'location' || tabParam === 'contact') {
      setActiveTab(tabParam);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    setTodaysDay(days[today]);
    
    // Fetch hours from Firestore
    const fetchHours = async () => {
      try {
        setLoading(true);
        const hoursData = await getHoursOfOperation();
        
        // Map the hours data to our OpeningHours interface
        const formattedHours = hoursData.days.map(day => ({
          day: day.day,
          hours: day.isOpen ? day.hours : 'Closed',
          isToday: day.day === days[today]
        }));
        
        setOpeningHours(formattedHours);
      } catch (error) {
        console.error('Error fetching hours of operation:', error);
        // Fallback to default hours if there's an error
        setOpeningHours([
          { day: 'Monday', hours: 'Closed', isToday: todaysDay === 'Monday' },
          { day: 'Tuesday', hours: '11:30 AM - 8:00 PM', isToday: todaysDay === 'Tuesday' },
          { day: 'Wednesday', hours: '11:30 AM - 8:00 PM', isToday: todaysDay === 'Wednesday' },
          { day: 'Thursday', hours: '11:30 AM - 8:00 PM', isToday: todaysDay === 'Thursday' },
          { day: 'Friday', hours: '11:30 AM - 9:00 PM', isToday: todaysDay === 'Friday' },
          { day: 'Saturday', hours: '11:30 AM - 9:00 PM', isToday: todaysDay === 'Saturday' },
          { day: 'Sunday', hours: '11:30 AM - 9:00 PM', isToday: todaysDay === 'Sunday' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHours();
  }, []);

  const handleFocus = (field: string) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    
    try {
      // Create a FormData object for the contact form
      const contactFormData = new FormData();
      
      // Add form type
      contactFormData.append('type', 'contact');
      
      // Add form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        contactFormData.append(key, value);
      });
      
      // Submit form using our email service
      await submitForm(contactFormData, 'contact');
      
      // Handle successful submission
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      // Display error message to user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setFormError(`Failed to send your message: ${errorMessage}. Please try again or contact us directly by phone.`);
    } finally {
      setIsSubmitting(false);
    }
  };  return (
    <div className="min-h-screen pb-16 w-full overflow-x-hidden bg-[#f0c91f]">
      {/* Section 1: Hero Section */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-[#19b4bd] w-full">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl text-white font-bold font-navigation baloo-regular mb-2 drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white max-w-xl nunito-sans px-4 drop-shadow">
            We'd love to hear from you!
          </p>
        </div>
        
        {/* Wave decorative element */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 290" className="w-full">
            <path fill="#f0c91f" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,165.3C960,171,1056,213,1152,213.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Section 2: Tabbed Navigation and Content */}
      <div className="mx-auto px-4 pt-8 -mt-8 relative z-20 w-full">
        <div className="bg-white rounded-xl shadow-lg p-2 max-w-2xl mx-auto mb-10">
          <div className="flex flex-wrap justify-center">
            <button 
              onClick={() => setActiveTab('hours')}
              className={`flex-1 min-w-0 px-3 sm:px-4 py-3 md:py-4 rounded-lg text-sm sm:text-lg font-bold transition-all jua-regular flex items-center justify-center cursor-pointer ${
                activeTab === 'hours' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              Hours
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`flex-1 min-w-0 px-3 sm:px-4 py-3 md:py-4 rounded-lg text-sm sm:text-lg font-bold transition-all flex items-center justify-center cursor-pointer ${
                activeTab === 'contact' 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="hidden sm:inline">Message Us</span>
              <span className="sm:hidden">Message</span>
            </button>
            <button 
              onClick={() => setActiveTab('location')}
              className={`flex-1 min-w-0 px-3 sm:px-4 py-3 md:py-4 rounded-lg text-sm sm:text-lg font-bold transition-all jua-regular flex items-center justify-center cursor-pointer ${
                activeTab === 'location' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="hidden sm:inline">Find Us</span>
              <span className="sm:hidden">Find</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Content sections */}
      <div className="mx-auto px-4 w-full overflow-x-hidden">
        {/* Contact Form Section */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto w-full overflow-x-hidden"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-full">
              <div className="md:flex w-full">
                <div className="md:w-1/2 p-6 sm:p-8 md:p-12 relative min-w-0">
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                  
                  {submitSuccess ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-4 jua-regular text-center">Thank You!</h2>
                      <p className="text-gray-600 nunito-sans text-center">
                        We've received your message and will get back to you soon.
                      </p>
                      <button 
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-indigo-700"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 jua-regular text-indigo-800">Get in Touch</h2>
                      <p className="text-gray-600 mb-8 nunito-sans">
                        Questions, comments, or just want to say aloha? We'd love to hear from you!
                      </p>
                      
                      <form onSubmit={handleSubmit}>
                        {formError && (
                          <div className="bg-red-50 border-2 border-red-100 text-red-700 px-4 py-3 rounded-lg mb-6 relative">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-red-700">{formError}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <div className={`bg-gray-50 rounded-lg p-2 transition-all ${activeField === 'name' ? 'shadow-md ring-2 ring-indigo-300' : 'hover:bg-gray-100'}`}>
                            <label htmlFor="name" className="block text-gray-700 mb-1 nunito-sans font-semibold">
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
                              className="w-full bg-transparent focus:outline-none p-2 nunito-sans"
                              placeholder="Your name"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className={`bg-gray-50 rounded-lg p-2 transition-all ${activeField === 'email' ? 'shadow-md ring-2 ring-indigo-300' : 'hover:bg-gray-100'}`}>
                            <label htmlFor="email" className="block text-gray-700 mb-1 nunito-sans font-semibold">
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
                              className="w-full bg-transparent focus:outline-none p-2 nunito-sans"
                              placeholder="Your email address"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className={`bg-gray-50 rounded-lg p-2 transition-all ${activeField === 'subject' ? 'shadow-md ring-2 ring-indigo-300' : 'hover:bg-gray-100'}`}>
                            <label htmlFor="subject" className="block text-gray-700 mb-1 nunito-sans font-semibold">
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
                              className="w-full bg-transparent focus:outline-none p-2 nunito-sans"
                              placeholder="What's this about?"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-6">
                          <div className={`bg-gray-50 rounded-lg p-2 transition-all ${activeField === 'message' ? 'shadow-md ring-2 ring-indigo-300' : 'hover:bg-gray-100'}`}>
                            <label htmlFor="message" className="block text-gray-700 mb-1 nunito-sans font-semibold">
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
                              className="w-full bg-transparent focus:outline-none p-2 nunito-sans"
                              placeholder="Your message"
                              required
                            ></textarea>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
                <div className="md:w-1/2 bg-indigo-50 p-6 sm:p-8 md:p-12 flex flex-col justify-center min-w-0">
                  <div className="w-48 sm:w-64 h-48 sm:h-64 mx-auto mb-6 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Tailwind CSS decorative elements */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-indigo-500 rounded-full opacity-10 animate-pulse" style={{ animationDuration: '3s' }}></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500 rounded-full opacity-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
                      <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-indigo-600 rounded-full opacity-20"></div>
                      <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-teal-400 rounded-full opacity-20"></div>
                      
                      {/* Envelope icon in the center */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Direct contact info */}
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 jua-regular">Phone</h3>
                        <p className="text-gray-600 nunito-sans">(201) 402-9600</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 jua-regular">Email</h3>
                        <p className="text-gray-600 nunito-sans">aloha@kailani.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 jua-regular">Address</h3>
                        <p className="text-gray-600 nunito-sans">840 River Rd, New Milford, NJ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Location Section */}
        {activeTab === 'location' && (
          <div className="max-w-4xl mx-auto w-full overflow-x-hidden"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-full">
              <div className="md:flex w-full">
                <div className="md:w-1/2 p-6 sm:p-8 md:p-12 order-2 md:order-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 jua-regular text-amber-600">Visit Us</h2>
                  <p className="text-gray-600 mb-8 nunito-sans">
                    We're conveniently located in the heart of Honolulu, just minutes from Waikiki Beach. 
                    Come experience the authentic taste of Hawaii in our warm and welcoming restaurant!
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-700 jua-regular text-lg sm:text-xl">Our Location</h3>
                        <p className="text-gray-600 nunito-sans mb-2">840 River Rd</p>
                        <p className="text-gray-600 nunito-sans mb-2">New Milford, NJ 07646</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-700 jua-regular text-lg sm:text-xl">Parking Information</h3>
                        <p className="text-gray-600 nunito-sans mb-2">
                          Free parking available in our restaurant lot. 
                          Additional street parking and public parking garage available within a block.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-700 jua-regular text-lg sm:text-xl">Hours Today</h3>
                        <p className="text-gray-600 nunito-sans mb-2">
                          {todaysDay === 'Monday' ? 'Closed' : 
                           (todaysDay === 'Friday' || todaysDay === 'Saturday' || todaysDay === 'Sunday') ? 
                           '11:30 AM - 9:00 PM' : '11:30 AM - 8:00 PM'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Get directions button */}
                  <a 
                    href="https://maps.app.goo.gl/KWjLfCxkkYvf7qYh8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Get Directions
                  </a>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 h-72 md:h-auto relative bg-gradient-to-br from-amber-50 to-amber-100">
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Decorative elements using Tailwind CSS */}
                    <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-amber-200 rounded-full opacity-40"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-amber-300 rounded-full opacity-30"></div>
                    <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-amber-400 rounded-full opacity-20"></div>
                    
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="grid grid-cols-6 h-full">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div key={i} className="border border-amber-300"></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Location pin and decorative elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative transform transition hover:scale-105 duration-700">
                        <div className="absolute -inset-4 bg-amber-200 rounded-full opacity-30 animate-pulse" style={{ animationDuration: '3s' }}></div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg relative z-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
        
        {/* Hours Section */}
        {activeTab === 'hours' && (
          <div className="mx-auto w-full overflow-x-hidden">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-full">
              <div className="md:flex w-full">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500"></div>
                  
                  <div className="w-full p-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 jua-regular text-teal-600">Opening Hours</h2>
                    <p className="text-gray-600 mb-8 nunito-sans">
                      We're open 6 days a week to serve you the best Hawaiian flavors. 
                      Come visit us for lunch, dinner, or anytime in between!
                    </p>
                    
                    <div className="border-t border-gray-200 py-4">
                      {loading ? (
                        <div className="py-8 flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-teal-500 mr-2"></div>
                          <span className="text-teal-600">Loading hours...</span>
                        </div>
                      ) : (
                        openingHours.map((dayInfo) => (
                          <div 
                            key={dayInfo.day}
                            className={`flex justify-between py-3 border-b border-gray-100 ${dayInfo.isToday ? 'bg-teal-50 p-3 rounded-lg' : ''} hover:translate-x-1 transition-transform`}
                        >
                          <div className="flex items-center">
                            {dayInfo.isToday && (
                              <span className="w-3 h-3 bg-teal-500 rounded-full mr-3 animate-pulse"></span>
                            )}
                            <span className={`font-bold jua-regular ${dayInfo.isToday ? 'text-teal-700' : 'text-gray-800'}`}>
                              {dayInfo.day}
                              {dayInfo.isToday && <span className="ml-2 text-xs bg-teal-500 text-white px-2 py-1 rounded-full">Today</span>}
                            </span>
                          </div>
                          <span className={`nunito-sans ${dayInfo.isToday ? 'text-teal-700 font-bold' : 'text-gray-600'}`}>
                            {dayInfo.hours}
                          </span>
                        </div>
                      ))
                      )}
                    </div>

                    {/* Call Enquiry Section - Combined into Hours section */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 jua-regular text-teal-700">Have a question?</h3>
                      <div className="bg-teal-50 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <span className="text-teal-800 font-medium">Call us for any enquiries</span>
                        </div>
                        <p className="text-gray-600 nunito-sans mb-4">
                          Need more information? Our friendly staff is here to help you with any questions about our hours, menu, or services.
                        </p>
                        <a 
                          href="tel:+1-201-402-9600" 
                          className="inline-flex items-center py-2 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          (201) 402-9600
                        </a>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Section 3: FAQ Section */}
        <div className="w-full mt-16 overflow-hidden bg-[#78350F] rounded-t-3xl">
          <div className="pt-16"></div>
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold jua-regular text-white mb-4 relative inline-block">
              Frequently Asked Questions
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-yellow-100 opacity-50 rounded-full"></span>
            </h2>
            <p className="text-white nunito-sans max-w-2xl mx-auto px-4">
              Find answers to our most commonly asked questions. If you don't see what you're looking for, feel free to contact us!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto px-6 pb-16 bg-[#78350F]">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full max-w-full">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 jua-regular text-gray-800">Do you take reservations?</h3>
                <p className="text-gray-600 nunito-sans">
                  Yes, we recommend making reservations, especially for dinner and weekend visits. 
                  You can reserve a table by phone, email, or through our website.
                </p>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full max-w-full">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 jua-regular text-gray-800">Do you offer takeout and delivery?</h3>
                <p className="text-gray-600 nunito-sans">
                  Yes, we offer both takeout and delivery options. You can order through our website 
                  or by calling us directly. We also partner with major food delivery services.
                </p>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full max-w-full">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 jua-regular text-gray-800">Do you accommodate dietary restrictions?</h3>
                <p className="text-gray-600 nunito-sans">
                  Absolutely! We offer vegetarian, vegan, and gluten-free options. Please inform your 
                  server about any allergies or dietary needs, and we'll do our best to accommodate you.
                </p>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full max-w-full">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 jua-regular text-gray-800">Can you host private events?</h3>
                <p className="text-gray-600 nunito-sans">
                  Yes, we have a private dining area that can accommodate groups of up to 30 guests. 
                  It's perfect for birthday celebrations, corporate events, and family gatherings.
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
