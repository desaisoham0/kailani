import React, { useState } from 'react';
import jobIllustration from '../assets/illustrations/job-illustration.svg';
import successIcon from '../assets/illustrations/success-icon.svg';
import formDecoration from '../assets/illustrations/form-decoration.svg';
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
    <div className="relative max-w-4xl mx-auto p-4 sm:p-6 md:p-8 job-form-container w-full max-w-full overflow-x-hidden">
      {/* Decorative elements */}
      <div className="job-form-decoration job-form-decoration-1"></div>
      <div className="job-form-decoration job-form-decoration-2"></div>
      <div className="job-form-decoration job-form-decoration-3"></div>
      <div className="job-form-decoration job-form-decoration-4"></div>
      
      <div className="relative z-10 w-full max-w-full">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center md:text-left w-full md:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 jua-regular mb-3">Join Our Team</h2>
            <p className="text-gray-600 nunito-sans max-w-md text-sm sm:text-base">
              We're looking for talented individuals who are passionate about food and hospitality. 
              Apply below to start your journey with us!
            </p>
          </div>
          <img 
            src={jobIllustration} 
            alt="Job application" 
            className="w-32 sm:w-40 h-32 sm:h-40 mt-4 md:mt-0 logo-float max-w-full" 
            style={{animationDuration: '8s'}}
          />
        </div>
        
        {submitSuccess ? (
          <div className="job-success-message bg-green-50 border-2 border-green-100 rounded-xl p-6 sm:p-8 text-center w-full max-w-full">
            <img src={successIcon} alt="Success" className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 max-w-full" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 jua-regular mb-3">Application Submitted!</h3>
            <p className="text-gray-600 nunito-sans mb-6 text-sm sm:text-base px-2">
              Thank you for your interest in joining our team. We will review your application and get back to you soon.
            </p>
            <button 
              onClick={() => setSubmitSuccess(false)} 
              className="job-form-button px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Apply for Another Position</span>
              <span className="sm:hidden">Apply Again</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative w-full max-w-full">
            <img 
              src={formDecoration} 
              alt="" 
              className="absolute right-0 -top-10 w-32 sm:w-40 opacity-50 pointer-events-none hidden md:block max-w-full" 
            />
            
            {error && (
              <div className="bg-red-50 border-2 border-red-100 text-red-700 px-3 sm:px-4 py-3 rounded-xl mb-6 relative w-full max-w-full">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 job-form-section w-full max-w-full" style={{ animationDelay: '0.1s' }}>
              <div className={`job-form-field p-1 w-full max-w-full ${activeField === 'fullName' ? 'highlight-field' : ''}`}>
                <label htmlFor="fullName" className="block text-gray-700 font-medium px-3 pt-2 job-form-label text-sm sm:text-base">
                  <span className="text-amber-500 mr-1">•</span> Full Name
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
                  className="w-full max-w-full bg-transparent px-3 py-2 focus:outline-none rounded-lg text-gray-800 text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className={`job-form-field p-1 w-full max-w-full ${activeField === 'email' ? 'highlight-field' : ''}`}>
                <label htmlFor="email" className="block text-gray-700 font-medium px-3 pt-2 job-form-label text-sm sm:text-base">
                  <span className="text-blue-500 mr-1">•</span> Email
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
                  className="w-full max-w-full bg-transparent px-3 py-2 focus:outline-none rounded-lg text-gray-800 text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 job-form-section w-full max-w-full" style={{ animationDelay: '0.2s' }}>
              <div className={`job-form-field p-1 w-full max-w-full ${activeField === 'phone' ? 'highlight-field' : ''}`}>
                <label htmlFor="phone" className="block text-gray-700 font-medium px-3 pt-2 job-form-label text-sm sm:text-base">
                  <span className="text-pink-500 mr-1">•</span> Phone Number
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
                  className="w-full max-w-full bg-transparent px-3 py-2 focus:outline-none rounded-lg text-gray-800 text-sm sm:text-base"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className={`job-form-field p-1 w-full max-w-full ${activeField === 'position' ? 'highlight-field' : ''}`}>
                <label htmlFor="position" className="block text-gray-700 font-medium px-3 pt-2 job-form-label text-sm sm:text-base">
                  <span className="text-purple-500 mr-1">•</span> Position
                </label>
                <select
                  id="position"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('position')}
                  onBlur={handleBlur}
                  className="w-full max-w-full bg-transparent px-3 py-2 focus:outline-none rounded-lg text-gray-800 appearance-none text-sm sm:text-base"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, 
                          backgroundPosition: 'right 0.5rem center', 
                          backgroundRepeat: 'no-repeat', 
                          backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Select a position</option>
                  {availablePositions.map((position) => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6 job-form-section w-full max-w-full" style={{ animationDelay: '0.3s' }}>
              <div className={`job-form-field p-1 w-full max-w-full ${activeField === 'experience' ? 'highlight-field' : ''}`}>
                <label htmlFor="experience" className="block text-gray-700 font-medium px-3 pt-2 job-form-label text-sm sm:text-base">
                  <span className="text-teal-500 mr-1">•</span> Years of Experience
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
                  className="w-full max-w-full bg-transparent px-3 py-2 focus:outline-none rounded-lg text-gray-800 text-sm sm:text-base"
                  placeholder="e.g., 2 years as a server"
                />
              </div>
            </div>
            
            <div className="mb-6 job-form-section w-full max-w-full" style={{ animationDelay: '0.4s' }}>
              <div className={`job-form-field p-3 sm:p-4 w-full max-w-full ${activeField === 'resume' ? 'highlight-field' : ''}`}>
                <label className="block text-gray-700 font-medium mb-2 job-form-label text-sm sm:text-base">
                  <span className="text-amber-500 mr-1">•</span> Resume
                </label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 bg-gray-50 w-full max-w-full">
                  <div className="file-upload-wrapper w-full max-w-full flex justify-center">
                    <label htmlFor="resume" className="file-upload-button text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                  </div>
                  {fileName ? (
                    <div className="file-name-display mt-3 w-full max-w-full text-center">
                      <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            
            <div className="mb-8 job-form-section w-full max-w-full" style={{ animationDelay: '0.5s' }}>
              <div className={`job-form-field p-1 w-full max-w-full ${activeField === 'coverLetter' ? 'highlight-field' : ''}`}>
                <label htmlFor="coverLetter" className="block text-gray-700 font-medium px-3 pt-2 job-form-label text-sm sm:text-base">
                  <span className="text-blue-500 mr-1">•</span> Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={4}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('coverLetter')}
                  onBlur={handleBlur}
                  className="w-full max-w-full bg-transparent px-3 py-2 focus:outline-none rounded-lg text-gray-800 text-sm sm:text-base resize-y min-h-[100px]"
                  placeholder="Tell us why you'd like to work with us..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-center job-form-section w-full max-w-full" style={{ animationDelay: '0.6s' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="job-form-button group relative px-6 sm:px-8 py-3 text-sm sm:text-base"
              >
                <span className="relative z-10">
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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