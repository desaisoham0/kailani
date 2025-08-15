import React from 'react';
import Job from '../components/ApplyJob';
import { submitForm } from '../services/emailService';

const JobsPage = () => {
  const handleJobSubmit = async (formData: FormData) => {
    try {
      await submitForm(formData, 'job');
    } catch {
      throw new Error('Failed to submit application');
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden border-b-2 border-[#ffe0f0] bg-[#f0c91f]">
      <a
        href="#application"
        className="sr-only fixed top-4 left-4 z-50 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-[#222222] shadow-sm ring-2 ring-white/80 ring-offset-2 ring-offset-[#19b4bd] focus:not-sr-only focus:outline-none"
      >
        Skip to application
      </a>

      <header className="bg-[#19b4bd]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="baloo-regular mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Join Our Team
            </h1>
            <div
              className="mx-auto mb-6 h-px w-24 bg-white"
              aria-hidden="true"
            />
            <p className="nunito-sans mx-auto max-w-2xl text-base leading-relaxed text-white sm:text-lg">
              At Kailani, we&apos;re more than just colleagues. We&apos;re a
              family dedicated to creating exceptional dining experiences. If
              you&apos;re passionate about food, hospitality, and creating
              memorable moments, we&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[#f0c91f]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="jua-regular mb-3 text-2xl font-bold text-[#222222] sm:text-3xl md:text-4xl">
                Benefits of Joining Kailani
              </h2>
              <p className="mx-auto max-w-2xl text-base text-[#222222] sm:text-lg">
                We value our team members and offer a range of benefits to
                support your career and wellbeing.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              <li className="h-full">
                <article className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all focus-within:-translate-y-1 focus-within:shadow-md hover:-translate-y-1 hover:shadow-md md:p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="jua-regular mb-2 text-center text-xl font-bold text-yellow-500">
                    Competitive Pay
                  </h3>
                  <p className="text-center text-[#002F4B]">
                    We offer competitive wages and opportunities for advancement
                    as you grow with us.
                  </p>
                </article>
              </li>

              <li className="h-full">
                <article className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all focus-within:-translate-y-1 focus-within:shadow-md hover:-translate-y-1 hover:shadow-md md:p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="jua-regular mb-2 text-center text-xl font-bold text-sky-500">
                    Friendly Team
                  </h3>
                  <p className="text-center text-[#002F4B]">
                    Join our diverse and supportive team that works together
                    like a family.
                  </p>
                </article>
              </li>

              <li className="h-full">
                <article className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all focus-within:-translate-y-1 focus-within:shadow-md hover:-translate-y-1 hover:shadow-md md:p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-pink-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <h3 className="jua-regular mb-2 text-center text-xl font-bold text-pink-500">
                    Growth Opportunities
                  </h3>
                  <p className="text-center text-[#002F4B]">
                    We believe in promoting from within and helping our
                    employees develop their careers.
                  </p>
                </article>
              </li>
            </ul>
          </div>
        </section>

        <section
          id="application"
          aria-labelledby="application-title"
          className="bg-[#78350F]"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2
                id="application-title"
                className="jua-regular mb-6 text-center text-2xl font-bold text-white sm:text-3xl"
              >
                Apply Now
              </h2>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur sm:p-6 md:p-8">
                <Job onSubmit={handleJobSubmit} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default React.memo(JobsPage);
