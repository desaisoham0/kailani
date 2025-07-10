import React from 'react';
import { Link } from 'react-router-dom';
import { SocialMediaLinks } from '../Navigation/SocialMediaLinks';

interface KailaniFooterProps {
  restaurantName: string;
}

const KailaniFooter: React.FC<KailaniFooterProps> = React.memo(({ restaurantName }) => {
  const currentYear = new Date().getFullYear();
  
  // Ensure restaurantName is provided
  const displayName = restaurantName || 'Kailani';
  
  return (
    <footer 
      className="w-full bg-[#19b4bd] py-6 text-white font-sans"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Main content in a single row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <nav>
              <ul className="space-y-1">
                <li><Link to="/" className="text-white/90 hover:text-yellow-400 text-sm transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-white/90 hover:text-yellow-400 text-sm transition-colors">About</Link></li>
                <li><Link to="/menu" className="text-white/90 hover:text-yellow-400 text-sm transition-colors">Menu</Link></li>
                <li><Link to="/contact" className="text-white/90 hover:text-yellow-400 text-sm transition-colors">Contact</Link></li>
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <div className="space-y-1 text-sm text-white/90">
              <p>840 River Rd, New Milford, NJ</p>
              <p><a href="tel:+12014029600" className="hover:text-yellow-400 transition-colors">(201) 402-9600</a></p>
              <p><a href="mailto:kailanishaveicenj@gmail.com" className="hover:text-yellow-400 transition-colors">kailanishaveicenj@gmail.com</a></p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="scale-75 origin-left">
              <SocialMediaLinks className="justify-start" />
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-white/80">
            <p>&copy; {currentYear} {displayName}. All Rights Reserved</p>
            <div className="flex gap-4">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

KailaniFooter.displayName = 'KailaniFooter';

export default KailaniFooter;
