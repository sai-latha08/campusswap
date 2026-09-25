import { Link } from 'react-router-dom';
import { Globe, Share2, ShieldCheck, Heart } from 'lucide-react';
import Logo from './Logo';

const footerLinks = {
  Platform: [
    { label: 'Skills Exchange', href: '/skills' },
    { label: 'Item Rentals', href: '/rentals' },
    { label: 'Skill-for-Item Barter', href: '/barter' },
    { label: 'Reputation & Reviews', href: '/reviews' },
  ],
  Explore: [
    { label: 'Browse Mentors', href: '/skills' },
    { label: 'Equipment Catalog', href: '/rentals' },
    { label: 'Barter Trades', href: '/barter' },
    { label: 'Notifications', href: '/notifications' },
  ],
  Account: [
    { label: 'Sign In', href: '/login' },
    { label: 'Register with .EDU', href: '/register' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Public Profile', href: '/profile' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#fdfbf7] border-t border-[#e7ded3] text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center mb-3">
              <Logo />
            </Link>
            <p className="text-stone-500 text-xs leading-relaxed max-w-sm">
              The verified student resource-sharing platform combining skill mentorship, physical item rentals, and 0-cash barter agreements.
            </p>
            <p className="mt-2 text-[#881337] font-semibold text-xs">
              "Learn. Share. Rent. Grow."
            </p>

            <div className="flex items-center gap-2 mt-4 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#166534] px-2.5 py-1 rounded-full border border-[#a7f3d0] font-semibold">
                <ShieldCheck size={13} /> Verified Peer Network
              </span>
            </div>
          </div>

          {/* Nav Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-stone-900 font-bold text-xs uppercase tracking-wider mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-stone-500 hover:text-[#881337] text-xs transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-[#ede5d8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} CampusSwap. Open student sharing network.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Built for verified student communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
