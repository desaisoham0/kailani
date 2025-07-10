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
      <section className="bg-[#19b4bd] px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center md:mb-12">
            <h1 className="baloo-regular relative mb-6 inline-block text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Join Our Team
            </h1>
            <div className="mx-auto mb-6 h-1 w-24 bg-white"></div>
            <p className="nunito-sans mx-auto max-w-2xl px-4 text-base leading-relaxed text-white sm:text-lg">
              At Kailani, we're more than just colleagues - we're a family
              dedicated to creating exceptional dining experiences. If you're
              passionate about food, hospitality, and creating memorable
              moments, we'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 - Benefits with #f0c91f background */}
      <section className="bg-[#f0c91f] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="jua-regular mb-4 text-2xl font-bold text-[#222222] sm:text-3xl md:text-4xl">
              Benefits of Joining Kailani
            </h2>
            <p className="mx-auto max-w-2xl text-base text-[#222222] sm:text-lg">
              We value our team members and offer a range of benefits to support
              your career and wellbeing.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-8 px-4 md:grid-cols-3">
            <div className="w-full transform rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-2 hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="jua-regular mb-3 text-center text-xl font-bold text-yellow-500">
                Competitive Pay
              </h3>
              <p className="text-center text-[#002F4B]">
                We offer competitive wages and opportunities for advancement as
                you grow with us.
              </p>
            </div>

            <div className="w-full transform rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-2 hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="jua-regular mb-3 text-center text-xl font-bold text-sky-500">
                Friendly Team
              </h3>
              <p className="text-center text-[#002F4B]">
                Join our diverse and supportive team that works together like a
                family.
              </p>
            </div>

            <div className="w-full transform rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-2 hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-pink-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="jua-regular mb-3 text-center text-xl font-bold text-pink-500">
                Growth Opportunities
              </h3>
              <p className="text-center text-[#002F4B]">
                We believe in promoting from within and helping our employees
                develop their careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Application Form with #78350F background */}
      <section className="bg-[#78350F] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl">
            <Job onSubmit={handleJobSubmit} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(JobsPage);
