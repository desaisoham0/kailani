import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="prose prose-lg max-w-none">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">
              Terms of Service
            </h1>

            <div className="space-y-6 text-gray-700">
              <div>
                <p className="mb-4 text-sm text-gray-500">
                  <strong>Last Updated:</strong> August 21, 2025
                </p>
              </div>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Acceptance
                </h2>
                <p>By using this site, you agree to these Terms.</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Purpose of this site
                </h2>
                <p>
                  This site provides menu information, location details, and
                  links to place orders on third party services. We do not take
                  payments or orders on this site.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Careers and contact
                </h2>
                <ul className="mt-2 ml-6 list-disc space-y-1">
                  <li>
                    <strong>Careers page:</strong> You may submit your name,
                    email, phone, and experience. Submissions are sent to the
                    owner’s email for review.
                  </li>
                  <li>
                    <strong>Contact page:</strong> You may send us a message and
                    your email so we can reply.
                  </li>
                  <li>
                    You confirm your submissions are accurate and you have the
                    right to send them.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Ordering via third parties
                </h2>
                <p>
                  Order buttons link to Toast, Uber Eats, Grubhub, or DoorDash.
                  Those services handle account creation, ordering, payments,
                  delivery, fees, and refunds under their terms. We are not
                  responsible for outages or issues on those platforms.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Menu and availability
                </h2>
                <p>
                  Menu items, photos, prices, and availability may change
                  without notice. Photos are illustrative.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Allergens
                </h2>
                <p>
                  Food may come into contact with common allergens. If you have
                  a severe allergy, contact the restaurant before ordering or
                  dining.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Changes to these Terms
                </h2>
                <p>
                  We may update these Terms. The updated version will be posted
                  here with a new date.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  Contact
                </h2>
                <p>
                  Questions about these Terms:{' '}
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

export default TermsPage;
