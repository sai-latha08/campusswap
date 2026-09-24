import { Link } from 'react-router-dom';
import { Globe, Share2 } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Skills Exchange', href: '/skills' },
    { label: 'Item Rentals', href: '/rentals' },
    { label: 'Skill-for-Item Barter', href: '/barter' },
    { label: 'Reputation & Reviews', href: '/reviews' },
  ],
  Community: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Trust & Safety', href: '/#trust' },
    { label: 'Campus Guidelines', href: '#' },
    { label: 'Student Directory', href: '/users' },
  ],
  Account: [
    { label: 'Sign In', href: '/login' },
    { label: 'Register with .EDU', href: '/register' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Notifications', href: '/notifications' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-zinc-900 text-white rounded flex items-center justify-center font-black text-[10px]">
                CS
              </div>
              <span className="font-extrabold text-base text-zinc-900 font-display">
                CampusSwap
              </span>
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
              The student-to-student sharing platform combining skill exchange, item rentals, and cash-free barter agreements.
            </p>
            <p className="mt-2 text-zinc-400 font-medium text-xs">
              "Learn. Share. Rent. Grow."
            </p>

            <div className="flex gap-2 mt-4">
              <a
                href="#"
                className="w-7 h-7 bg-zinc-100 hover:bg-zinc-200 rounded-md flex items-center justify-center text-zinc-600 transition-colors"
                aria-label="Campus Network"
              >
                <Globe size={13} />
              </a>
              <a
                href="#"
                className="w-7 h-7 bg-zinc-100 hover:bg-zinc-200 rounded-md flex items-center justify-center text-zinc-600 transition-colors"
                aria-label="Share"
              >
                <Share2 size={13} />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-zinc-950 font-bold text-xs uppercase tracking-wider mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-zinc-500 hover:text-zinc-950 text-xs transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} CampusSwap. Open student network.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-700 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
