import React from 'react';
import { Link } from 'react-router-dom';
import { SocialMediaLinks } from '../Navigation/SocialMediaLinks';

interface KailaniFooterProps {
  restaurantName: string;
}

const KailaniFooter: React.FC<KailaniFooterProps> = React.memo(
  ({ restaurantName }) => {
    const currentYear = new Date().getFullYear();

    // Ensure restaurantName is provided
    const displayName = restaurantName || 'Kailani';

    return (
      <footer
        className="w-full bg-[#19b4bd] py-6 font-sans text-white"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="mx-auto max-w-6xl px-4">
          {/* Main content in a single row */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Quick Links */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
              <nav>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/"
                      className="text-sm text-white/90 transition-colors hover:text-yellow-400"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/menu"
                      className="text-sm text-white/90 transition-colors hover:text-yellow-400"
                    >
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/jobs"
                      className="text-sm text-white/90 transition-colors hover:text-yellow-400"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-white/90 transition-colors hover:text-yellow-400"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-sm text-white/90 transition-colors hover:text-yellow-400"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Contact</h3>
              <div className="space-y-1 text-sm text-white/90">
                <p>840 River Rd, New Milford, NJ</p>
                <p>
                  <a
                    href="tel:+12014029600"
                    className="transition-colors hover:text-yellow-400"
                  >
                    (201) 402-9600
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:kailanishaveicenj@gmail.com"
                    className="transition-colors hover:text-yellow-400"
                  >
                    kailanishaveicenj@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Follow Us</h3>
              <div className="origin-left scale-75">
                <SocialMediaLinks className="justify-start" />
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-white/20 pt-4">
            <div className="flex flex-col items-center justify-between gap-2 text-sm text-white/80 sm:flex-row">
              <p>
                &copy; {currentYear} {displayName}. All Rights Reserved
              </p>
              <div className="flex gap-4">
                <button className="transition-colors hover:text-white">
                  Privacy
                </button>
                <button className="transition-colors hover:text-white">
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
