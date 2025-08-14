import React from 'react';
import { Link } from 'react-router-dom';
import { SocialMediaLinks } from '../Navigation/SocialMediaLinks';

interface KailaniFooterProps {
  restaurantName: string;
}

const KailaniFooter: React.FC<KailaniFooterProps> = React.memo(
  ({ restaurantName }) => {
    const currentYear = new Date().getFullYear();
    const displayName = restaurantName || 'Kailani';

    return (
      <footer
        className="w-full bg-[#19b4bd] py-8 font-sans text-white md:py-10"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            <section
              aria-labelledby="footer-quick-links"
              className="rounded-2xl border border-white/15 p-5 shadow-sm"
            >
              <h3
                id="footer-quick-links"
                className="mb-4 text-lg font-semibold"
              >
                Quick Links
              </h3>
              <nav aria-label="Footer navigation">
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="inline-flex items-center rounded-md text-sm text-white/90 underline-offset-4 transition hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19b4bd] focus-visible:outline-none"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/menu"
                      className="inline-flex items-center rounded-md text-sm text-white/90 underline-offset-4 transition hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19b4bd] focus-visible:outline-none"
                    >
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/jobs"
                      className="inline-flex items-center rounded-md text-sm text-white/90 underline-offset-4 transition hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19b4bd] focus-visible:outline-none"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="inline-flex items-center rounded-md text-sm text-white/90 underline-offset-4 transition hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19b4bd] focus-visible:outline-none"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="inline-flex items-center rounded-md text-sm text-white/90 underline-offset-4 transition hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19b4bd] focus-visible:outline-none"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
            </section>

            <section
              aria-labelledby="footer-contact"
              className="rounded-2xl border border-white/15 p-5 shadow-sm"
            >
              <h3 id="footer-contact" className="mb-4 text-lg font-semibold">
                Contact
              </h3>
              <address className="space-y-2 text-sm text-white/90 not-italic">
                <p>840 River Rd, New Milford, NJ</p>
                <p>
                  <a
                    href="tel:+12014029600"
                    className="inline-flex items-center rounded-md underline-offset-4 transition hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19b4bd] focus-visible:outline-none"
                  >
                    (201) 402-9600
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:kailanishaveicenj@gmail.com"
                    className="inline-flex items-center rounded-md underline-offset-4 transition hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19b4bd] focus-visible:outline-none"
                  >
                    kailanishaveicenj@gmail.com
                  </a>
                </p>
              </address>
            </section>

            <section
              aria-labelledby="footer-follow"
              className="rounded-2xl border border-white/15 p-5 shadow-sm"
            >
              <h3 id="footer-follow" className="mb-4 text-lg font-semibold">
                Follow Us
              </h3>
              <div className="origin-left scale-90 transform-gpu sm:scale-95 md:scale-100">
                <SocialMediaLinks className="justify-start" />
              </div>
            </section>
          </div>

          <div className="mt-8 border-t border-white/20 pt-5">
            <div className="flex flex-col items-center justify-between gap-3 text-sm text-white/80 sm:flex-row">
              <p className="text-center sm:text-left">
                &copy; {currentYear} {displayName}. All Rights Reserved
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-2xl px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-white/25 transition ring-inset focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19b4bd] focus-visible:outline-none active:translate-y-px disabled:opacity-50"
                  aria-label="Privacy policy"
                >
                  Privacy
                </button>
                <button
                  type="button"
                  className="rounded-2xl px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-white/25 transition ring-inset focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19b4bd] focus-visible:outline-none active:translate-y-px disabled:opacity-50"
                  aria-label="Terms and conditions"
                >
                  Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

KailaniFooter.displayName = 'KailaniFooter';

export default KailaniFooter;
