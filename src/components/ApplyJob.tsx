import React, { useState } from 'react';
import { submitForm } from '../services/emailService';

interface JobFormData {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  resume: File | null;
  coverLetter: string;
}

interface JobProps {
  onSubmit?: (formData: FormData) => Promise<void>;
}

const Job: React.FC<JobProps> = ({ 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<JobFormData>({
    fullName: '',
    email: '',
    phone: '',
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
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-lg text-amber-100 max-w-md mx-auto leading-relaxed">
            Ready to start your culinary journey? We're looking for passionate people like you!
          </p>
        </div>
        
        {submitSuccess ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-amber-200">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Application Sent Successfully!</h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Your application is on its way to us. We'll get back to you soon with next steps!
            </p>
            <button 
              onClick={() => setSubmitSuccess(false)} 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-amber-200 overflow-hidden">
            {/* Progress indicator */}
            
            <form onSubmit={handleSubmit} className="p-8">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 bg-red-400 rounded-full mt-0.5"></div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-red-800">Something went wrong</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                        <p className="mt-2 text-xs">
                          Need help? Contact us at <a href="mailto:contact@kailanirestaurant.com" className="underline font-medium hover:text-red-800">contact@kailanirestaurant.com</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className={`w-full px-4 py-3 rounded-2xl border-3 transition-all duration-200 font-medium ${
                        activeField === 'fullName' 
                          ? 'border-pink-400 ring-4 ring-pink-100 shadow-lg bg-pink-50' 
                          : 'border-gray-200 hover:border-pink-300 bg-white'
                      } focus:outline-none text-gray-800 placeholder-gray-400`}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
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
                      className={`w-full px-4 py-3 rounded-2xl border-3 transition-all duration-200 font-medium ${
                        activeField === 'email' 
                          ? 'border-blue-400 ring-4 ring-blue-100 shadow-lg bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      } focus:outline-none text-gray-800 placeholder-gray-400`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                {/* Phone Field */}
                <div className="group">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className={`w-full px-4 py-3 rounded-2xl border-3 transition-all duration-200 font-medium ${
                      activeField === 'phone' 
                        ? 'border-green-400 ring-4 ring-green-100 shadow-lg bg-green-50' 
                        : 'border-gray-200 hover:border-green-300 bg-white'
                    } focus:outline-none text-gray-800 placeholder-gray-400`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                {/* Experience Field */}
                <div className="group">
                  <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Experience
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
                    className={`w-full px-4 py-3 rounded-2xl border-3 transition-all duration-200 font-medium ${
                      activeField === 'experience' 
                        ? 'border-yellow-400 ring-4 ring-yellow-100 shadow-lg bg-yellow-50' 
                        : 'border-gray-200 hover:border-yellow-300 bg-white'
                    } focus:outline-none text-gray-800 placeholder-gray-400`}
                    placeholder="e.g., 2 years as a server at busy restaurant"
                  />
                </div>
                
                {/* Resume Upload */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume
                  </label>
                  <div className={`relative border-3 border-dashed rounded-2xl p-6 transition-all duration-200 ${
                    activeField === 'resume' 
                      ? 'border-purple-400 bg-purple-50' 
                      : 'border-gray-300 hover:border-purple-300 bg-gray-50'
                  }`}>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      onFocus={() => handleFocus('resume')}
                      onBlur={handleBlur}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      {fileName ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{fileName}</span>
                        </div>
                      ) : (
                        <div>
                          <div className="w-10 h-10 bg-gray-400 rounded-2xl mx-auto mb-3"></div>
                          <p className="text-gray-600 font-medium">Drop your resume here</p>
                          <p className="text-sm text-gray-400 mt-1">PDF, DOC, or DOCX (max 2MB)</p>
                        </div>
                      )}
                      {formData.resume && formData.resume.size > 2 * 1024 * 1024 && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center justify-center">
                          <div className="w-4 h-4 bg-amber-600 rounded-full mr-1"></div>
                          File is large - consider using under 2MB
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Cover Letter */}
                <div className="group">
                  <label htmlFor="coverLetter" className="block text-sm font-semibold text-gray-700 mb-2">
                    Why do you want to join us? <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={4}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('coverLetter')}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-2xl border-3 transition-all duration-200 resize-none font-medium ${
                      activeField === 'coverLetter' 
                        ? 'border-indigo-400 ring-4 ring-indigo-100 shadow-lg bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    } focus:outline-none text-gray-800 placeholder-gray-400`}
                    placeholder="I love creating amazing dining experiences and would be thrilled to..."
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer bg-green-500 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none border-2 border-b-4 border-green-600 hover:border-green-700 disabled:border-gray-400"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                      Sending your application...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span>Submit Application</span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Job;