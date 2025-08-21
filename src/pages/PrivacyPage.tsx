import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="prose prose-lg max-w-none">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">
              Privacy Policy
            </h1>

            <div className="space-y-6 text-gray-700">
              <div>
                <p className="mb-4 text-sm text-gray-500">
                  <strong>Last Updated:</strong> August 21, 2025
                </p>
              </div>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Who we are
                </h2>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p>
                    <strong>Kailani Restaurant</strong>
                  </p>
                  <p>
                    840 River Rd
                    <br />
                    New Milford, NJ 07646
                  </p>
                  <p>
                    Phone:{' '}
                    <a href="tel:+12014029600" className="text-blue-600">
                      (201) 402-9600
                    </a>
                  </p>
                  <p>
                    Email:{' '}
                    <a
                      href="mailto:thekailanigroup@gmail.com"
                      className="text-blue-600"
                    >
                      thekailanigroup@gmail.com
                    </a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  What we collect
                </h2>

                <ul className="ml-6 list-disc space-y-1">
                  <li>
                    <strong>Careers form:</strong> Name, email, phone,
                    experience. Sent to the owner’s inbox. Not stored elsewhere
                    by us.
                  </li>
                  <li>
                    <strong>Contact form:</strong> Name, email, message. Sent to
                    the owner’s inbox. Not stored elsewhere by us.
                  </li>
                  <li>
                    <strong>Technical data:</strong> Basic server logs and
                    standard browser data like IP, user agent, and pages viewed,
                    used for security and debugging.
                  </li>
                  <li>
                    <strong>Content data:</strong> Menu names, descriptions, and
                    photos are stored in Firebase. No customer personal data is
                    stored in Firebase.
                  </li>
                </ul>
                <p className="mt-2">
                  We do not process payments on this site. Order links take you
                  to Toast, Uber Eats, Grubhub, or DoorDash. Their policies
                  apply there.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  How We Use Information
                </h2>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Read and respond to inquiries and job applications</li>
                  <li>Operate and secure the site</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Sharing
                </h2>
                <ul className="ml-6 list-disc space-y-1">
                  <li>
                    Service providers that host email and this website may
                    process data on our behalf.
                  </li>
                  <li>Law enforcement or legal requests when required.</li>
                  <li>
                    We do not sell or share personal information for
                    advertising.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Cookies and caching
                </h2>
                <ul className="ml-6 list-disc space-y-1">
                  <li>
                    We use caching so pages load faster. This stores site assets
                    in your browser. It does not store your personal
                    information.
                  </li>
                  <li>
                    We do not use analytics or advertising cookies. If this
                    changes, we will update this policy.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Data retention
                </h2>
                <ul className="ml-6 list-disc space-y-1">
                  <li>
                    Career and contact emails are kept in the owner’s email
                    account as long as needed for operations, then deleted
                    during periodic inbox cleanups.
                  </li>
                  <li>
                    Server logs are kept for a short period for security and
                    troubleshooting.
                  </li>
                  <li>
                    Menu content in Firebase is retained until updated or
                    removed.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Your choices and rights
                </h2>
                <ul className="ml-6 list-disc space-y-1">
                  <li>
                    You can request access or deletion of messages and
                    application emails you sent us.
                  </li>
                  <li>
                    Email:{' '}
                    <a
                      href="mailto:thekailanigroup@gmail.com"
                      className="text-blue-600"
                    >
                      thekailanigroup@gmail.com
                    </a>{' '}
                    and we will verify your request and respond as required by
                    applicable law.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Third party links
                </h2>
                <p>
                  Ordering links go to third party services. Their terms and
                  privacy policies govern your use of those services.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Changes to this policy
                </h2>
                <p>
                  If we make material changes, we will change the date at the
                  top and post the updated policy on this page.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Contact
                </h2>
                <p>
                  Questions or requests:{' '}
                  <a
                    href="mailto:thekailanigroup@gmail.com"
                    className="text-blue-600"
                  >
                    thekailanigroup@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
