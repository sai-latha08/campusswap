import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 font-display">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-3">Page Not Found</h2>
        <p className="text-slate-600 text-sm mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Return to Home
        </Link>
      </div>
    </div>
  );
}
