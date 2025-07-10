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

const Job: React.FC<JobProps> = ({ onSubmit }) => {
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
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
        if (value !== null && key !== 'resume') {
          // Handle resume separately
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
          const errorData = await response
            .json()
            .catch(() => ({ message: 'Server error' }));
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
      setError(
        `There was an error submitting your application: ${errorMessage}. Please check your connection and try again.`
      );
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
    <div className="px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Join Our Team</h1>
          <p className="mx-auto max-w-md text-lg leading-relaxed text-amber-100">
            Ready to start your culinary journey? We're looking for passionate
            people like you!
          </p>
        </div>

        {submitSuccess ? (
          <div className="rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <div className="h-6 w-6 rounded-full bg-green-500"></div>
              </div>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-800">
              Application Sent Successfully!
            </h3>
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              Your application is on its way to us. We'll get back to you soon
              with next steps!
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="transform rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-xl">
            {/* Progress indicator */}

            <form onSubmit={handleSubmit} className="p-8">
              {error && (
                <div className="mb-8 rounded-r-xl border-l-4 border-red-400 bg-red-50 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-red-400"></div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-red-800">
                        Something went wrong
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                        <p className="mt-2 text-xs">
                          Need help? Contact us at{' '}
                          <a
                            href="mailto:contact@kailanirestaurant.com"
                            className="font-medium underline hover:text-red-800"
                          >
                            contact@kailanirestaurant.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="group">
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
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
                      className={`w-full rounded-2xl border-3 px-4 py-3 font-medium transition-all duration-200 ${
                        activeField === 'fullName'
                          ? 'border-pink-400 bg-pink-50 shadow-lg ring-4 ring-pink-100'
                          : 'border-gray-200 bg-white hover:border-pink-300'
                      } text-gray-800 placeholder-gray-400 focus:outline-none`}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
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
                      className={`w-full rounded-2xl border-3 px-4 py-3 font-medium transition-all duration-200 ${
                        activeField === 'email'
                          ? 'border-blue-400 bg-blue-50 shadow-lg ring-4 ring-blue-100'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      } text-gray-800 placeholder-gray-400 focus:outline-none`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
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
                    className={`w-full rounded-2xl border-3 px-4 py-3 font-medium transition-all duration-200 ${
                      activeField === 'phone'
                        ? 'border-green-400 bg-green-50 shadow-lg ring-4 ring-green-100'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    } text-gray-800 placeholder-gray-400 focus:outline-none`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Experience Field */}
                <div className="group">
                  <label
                    htmlFor="experience"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
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
                    className={`w-full rounded-2xl border-3 px-4 py-3 font-medium transition-all duration-200 ${
                      activeField === 'experience'
                        ? 'border-yellow-400 bg-yellow-50 shadow-lg ring-4 ring-yellow-100'
                        : 'border-gray-200 bg-white hover:border-yellow-300'
                    } text-gray-800 placeholder-gray-400 focus:outline-none`}
                    placeholder="e.g., 2 years as a server at busy restaurant"
                  />
                </div>

                {/* Resume Upload */}
                <div className="group">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Resume
                  </label>
                  <div
                    className={`relative rounded-2xl border-3 border-dashed p-6 transition-all duration-200 ${
                      activeField === 'resume'
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-gray-300 bg-gray-50 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      onFocus={() => handleFocus('resume')}
                      onBlur={handleBlur}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="text-center">
                      {fileName ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {fileName}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="mx-auto mb-3 h-10 w-10 rounded-2xl bg-gray-400"></div>
                          <p className="font-medium text-gray-600">
                            Drop your resume here
                          </p>
                          <p className="mt-1 text-sm text-gray-400">
                            PDF, DOC, or DOCX (max 2MB)
                          </p>
                        </div>
                      )}
                      {formData.resume &&
                        formData.resume.size > 2 * 1024 * 1024 && (
                          <p className="mt-2 flex items-center justify-center text-xs text-amber-600">
                            <div className="mr-1 h-4 w-4 rounded-full bg-amber-600"></div>
                            File is large - consider using under 2MB
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="group">
                  <label
                    htmlFor="coverLetter"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Why do you want to join us?{' '}
                    <span className="font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={4}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('coverLetter')}
                    onBlur={handleBlur}
                    className={`w-full resize-none rounded-2xl border-3 px-4 py-3 font-medium transition-all duration-200 ${
                      activeField === 'coverLetter'
                        ? 'border-indigo-400 bg-indigo-50 shadow-lg ring-4 ring-indigo-100'
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    } text-gray-800 placeholder-gray-400 focus:outline-none`}
                    placeholder="I love creating amazing dining experiences and would be thrilled to..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full transform cursor-pointer rounded-2xl border-2 border-b-4 border-green-600 bg-green-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-green-700 hover:to-emerald-700 hover:shadow-xl disabled:border-gray-400 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
