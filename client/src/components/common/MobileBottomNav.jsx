import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, BookOpen, ShoppingBag, ArrowRightLeft, MessageSquare, User } from 'lucide-react';
import { selectIsAuthenticated } from '../../store/authSlice';

export default function MobileBottomNav() {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const navItems = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Skills', href: '/skills', icon: BookOpen },
    { label: 'Rentals', href: '/rentals', icon: ShoppingBag },
    { label: 'Barter', href: '/barter', icon: ArrowRightLeft },
    ...(isAuthenticated
      ? [
          { label: 'Chat', href: '/messages', icon: MessageSquare },
          { label: 'Me', href: '/dashboard', icon: User },
        ]
      : [{ label: 'Sign In', href: '/login', icon: User }]),
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-t border-[#e7ded3] pb-safe shadow-lg">
      <div className="grid grid-cols-5 sm:grid-cols-6 h-14 items-center px-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive
                  ? 'text-[#881337] font-bold'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
