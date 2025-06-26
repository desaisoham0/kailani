import React from 'react';
import Job from '../components/ApplyJob';
import { submitForm } from '../services/emailService';

const JobsPage = () => {
  const handleJobSubmit = async (formData: FormData) => {
    // Custom logic to submit the form data using our email service
    try {
      await submitForm(formData, 'job');
    } catch (error) {
      console.error('Error in job submission:', error);
      throw new Error('Failed to submit application');
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden border-b-2 border-[#ffe0f0] bg-[#f0c91f]">
      {/* Section 1 - Header with #19b4bd background */}
      <section className="bg-[#19b4bd] py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl baloo-regular font-bold text-white mb-6 relative inline-block">
              Join Our Team
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-white nunito-sans text-base sm:text-lg px-4 leading-relaxed">
              At Kailani, we're more than just colleagues - we're a family dedicated to creating exceptional dining experiences.
              If you're passionate about food, hospitality, and creating memorable moments, we'd love to hear from you!
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-10">
            <div className="w-full max-w-md">
              {/* Custom Team Illustration using Tailwind */}
              <div className="relative bg-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex justify-center items-end space-x-4 mb-4">
                  {/* Team Member 1 - Chef */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 01-1-1V9a1 1 0 011-1h4a1 1 0 011 1v2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="w-12 h-8 bg-white rounded-t-full"></div>
                    <span className="text-xs text-white/80 mt-1">Chef</span>
                  </div>
                  
                  {/* Team Member 2 - Server */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="w-16 h-10 bg-white rounded-t-full"></div>
                    <span className="text-xs text-white/80 mt-1">Server</span>
                  </div>
                  
                  {/* Team Member 3 - Manager */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="w-12 h-8 bg-white rounded-t-full"></div>
                    <span className="text-xs text-white/80 mt-1">Manager</span>
                  </div>
                </div>
                
                {/* Connecting lines */}
                <div className="flex justify-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-0.5 bg-white/30"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-8 h-0.5 bg-white/30"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-8 h-0.5 bg-white/30"></div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-300 rounded-full"></div>
                <div className="absolute bottom-6 left-4 w-2 h-2 bg-pink-300 rounded-full"></div>
                <div className="absolute top-1/2 right-6 w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
              </div>
            </div>
            <div className="w-full max-w-md text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 jua-regular">Why Work With Us?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Collaborative and supportive work environment</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Opportunities for professional growth and skill development</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Competitive wages and benefits package</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Benefits with #f0c91f background */}
      <section className="bg-[#f0c91f] py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] mb-4 jua-regular">
              Benefits of Joining Kailani
            </h2>
            <p className="max-w-2xl mx-auto text-[#222222] text-base sm:text-lg">
              We value our team members and offer a range of benefits to support your career and wellbeing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 w-full">
            <div className="bg-white rounded-xl p-6 shadow-md transform transition-all hover:-translate-y-2 hover:shadow-lg w-full">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4 flex-shrink-0 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B3D0B] mb-3 jua-regular text-center">Competitive Pay</h3>
              <p className="text-[#002F4B] text-center">We offer competitive wages and opportunities for advancement as you grow with us.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md transform transition-all hover:-translate-y-2 hover:shadow-lg w-full">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 flex-shrink-0 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B3D0B] mb-3 jua-regular text-center">Friendly Team</h3>
              <p className="text-[#002F4B] text-center">Join our diverse and supportive team that works together like a family.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md transform transition-all hover:-translate-y-2 hover:shadow-lg w-full">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4 flex-shrink-0 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B3D0B] mb-3 jua-regular text-center">Growth Opportunities</h3>
              <p className="text-[#002F4B] text-center">We believe in promoting from within and helping our employees develop their careers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Application Form with #78350F background */}
      <section className="bg-[#78350F] py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 jua-regular">
              Apply Today
            </h2>
            <p className="max-w-2xl mx-auto text-white/90 text-base sm:text-lg mb-8">
              Fill out the form below to start your journey with Kailani Restaurant.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Job 
              availablePositions={['Server', 'Chef', 'Host/Hostess', 'Manager', 'Bartender', 'Line Cook', 'Dishwasher']} 
              onSubmit={handleJobSubmit}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(JobsPage);