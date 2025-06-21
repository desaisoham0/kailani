import React, { useState } from 'react';
import { submitForm } from '../services/emailService';

interface JobFormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  resume: File | null;
  coverLetter: string;
}

interface JobProps {
  availablePositions?: string[];
  onSubmit?: (formData: FormData) => Promise<void>;
}

const Job: React.FC<JobProps> = ({ 
  availablePositions = ['Server', 'Chef', 'Host/Hostess', 'Bartender', 'Kitchen Staff'],
  onSubmit 
}) => {
  const [formData, setFormData] = useState<JobFormData>({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
    coverLetter: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Create a FormData object to handle file upload
      const submitFormData = new FormData();
      
      // Add form type
      submitFormData.append('type', 'job');
      
      // Handle regular form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== 'resume') { // Handle resume separately
          submitFormData.append(key, value);
        }
      });
      
      // Handle resume file upload separately
      if (formData.resume) {
        submitFormData.append('resume', formData.resume);
      }

      // If there's a custom submission handler, use it
      if (onSubmit) {
        await onSubmit(submitFormData);
      } else {
        // Use the email service - with proper handling for file uploads
        const response = await submitForm(submitFormData, 'job');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Server error' }));
          throw new Error(errorData.message || 'Failed to submit application');
        }
      }

      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        resume: null,
        coverLetter: '',
      });
      setFileName('');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`There was an error submitting your application: ${errorMessage}. Please check your connection and try again.`);
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  return (
    <div className="relative max-w-4xl mx-auto p-4 rounded-2xl sm:p-6 md:p-8 w-full overflow-x-hidden bg-white shadow-lg">
      <div className="relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#19b4bd] mb-3 font-['Jua']">Join Our Team</h2>
            <p className="text-gray-600 font-['Nunito_Sans'] max-w-md mx-auto text-sm sm:text-base">
              We're looking for talented individuals who are passionate about food and hospitality. 
              Apply below to start your journey with us!
            </p>
          </div>
        </div>
        
        {submitSuccess ? (
          <div className="bg-[#e6f7f8] border-2 border-[#19b4bd] rounded-xl p-6 sm:p-8 text-center w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-[#19b4bd] text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#19b4bd] font-['Jua'] mb-3">Application Submitted!</h3>
            <p className="text-gray-600 font-['Nunito_Sans'] mb-6 text-sm sm:text-base px-2">
              Thank you for your interest in joining our team. We will review your application and get back to you soon.
            </p>
            <button 
              onClick={() => setSubmitSuccess(false)} 
              className="bg-[#19b4bd] hover:bg-[#148f96] text-white rounded-md px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-colors duration-200"
            >
              <span className="hidden sm:inline">Apply for Another Position</span>
              <span className="sm:hidden">Apply Again</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative w-full">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md mb-6 relative w-full">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <span className="block break-words">{error}</span>
                      <span className="block mt-2 text-xs break-words">
                        If this error persists, please contact us directly at <a href="mailto:contact@kailanirestaurant.com" className="underline font-medium">contact@kailanirestaurant.com</a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 w-full">
              <div className="w-full">
                <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1 text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('fullName')}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 rounded-md border ${activeField === 'fullName' ? 'border-[#19b4bd] ring-1 ring-[#19b4bd] ring-opacity-50' : 'border-gray-300'} focus:outline-none focus:border-[#19b4bd] focus:ring-1 focus:ring-[#19b4bd] text-gray-800 text-sm sm:text-base`}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 rounded-md border ${activeField === 'email' ? 'border-[#19b4bd] ring-1 ring-[#19b4bd] ring-opacity-50' : 'border-gray-300'} focus:outline-none focus:border-[#19b4bd] focus:ring-1 focus:ring-[#19b4bd] text-gray-800 text-sm sm:text-base`}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 w-full">
              <div className="w-full">
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-1 text-sm">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('phone')}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 rounded-md border ${activeField === 'phone' ? 'border-[#19b4bd] ring-1 ring-[#19b4bd] ring-opacity-50' : 'border-gray-300'} focus:outline-none focus:border-[#19b4bd] focus:ring-1 focus:ring-[#19b4bd] text-gray-800 text-sm sm:text-base`}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="position" className="block text-gray-700 font-medium mb-1 text-sm">
                  Position
                </label>
                <select
                  id="position"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('position')}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 rounded-md border ${activeField === 'position' ? 'border-[#19b4bd] ring-1 ring-[#19b4bd] ring-opacity-50' : 'border-gray-300'} focus:outline-none focus:border-[#19b4bd] focus:ring-1 focus:ring-[#19b4bd] text-gray-800 text-sm sm:text-base bg-white`}
                >
                  <option value="">Select a position</option>
                  {availablePositions.map((position) => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6 w-full">
              <label htmlFor="experience" className="block text-gray-700 font-medium mb-1 text-sm">
                Years of Experience
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                required
                value={formData.experience}
                onChange={handleInputChange}
                onFocus={() => handleFocus('experience')}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 rounded-md border ${activeField === 'experience' ? 'border-[#19b4bd] ring-1 ring-[#19b4bd] ring-opacity-50' : 'border-gray-300'} focus:outline-none focus:border-[#19b4bd] focus:ring-1 focus:ring-[#19b4bd] text-gray-800 text-sm sm:text-base`}
                placeholder="e.g., 2 years as a server"
              />
            </div>
            
            <div className="mb-6 w-full">
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Resume
              </label>
              <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                <div className="w-full flex flex-col items-center justify-center">
                  <label htmlFor="resume" className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md cursor-pointer text-sm sm:text-base inline-flex items-center hover:bg-gray-50">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline text-[#19b4bd]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    onFocus={() => handleFocus('resume')}
                    onBlur={handleBlur}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  {fileName ? (
                    <div className="mt-3 w-full text-center">
                      <svg className="w-4 h-4 mr-1 inline-block text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm break-all">{fileName}</span>
                      {formData.resume && formData.resume.size > 2 * 1024 * 1024 && (
                        <p className="text-xs text-amber-600 mt-1">
                          Large files may cause submission issues. Consider using a file under 2MB.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center px-2">Upload PDF, DOC, or DOCX (Recommended: under 2MB)</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-8 w-full">
              <label htmlFor="coverLetter" className="block text-gray-700 font-medium mb-1 text-sm">
                Cover Letter (Optional)
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={4}
                value={formData.coverLetter}
                onChange={handleInputChange}
                onFocus={() => handleFocus('coverLetter')}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 rounded-md border ${activeField === 'coverLetter' ? 'border-[#19b4bd] ring-1 ring-[#19b4bd] ring-opacity-50' : 'border-gray-300'} focus:outline-none focus:border-[#19b4bd] focus:ring-1 focus:ring-[#19b4bd] text-gray-800 text-sm sm:text-base resize-y min-h-[100px]`}
                placeholder="Tell us why you'd like to work with us..."
              ></textarea>
            </div>
            
            <div className="flex justify-center w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#19b4bd] hover:bg-[#148f96] cursor-pointer text-white font-semibold rounded-md px-6 sm:px-8 py-3 text-sm sm:text-base border-2 border-[#0b7980] shadow-[0_6px_0_rgb(11,121,128)] transition-colors duration-200"
              >
                <span className="relative z-10">
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Submitting...</span>
                      <span className="sm:hidden">Submitting</span>
                    </span>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Submit Application</span>
                      <span className="sm:hidden">Submit</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Job;