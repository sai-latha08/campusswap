import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md cs-card p-10 border border-burgundy-100/60 shadow-xl">
        <div className="w-16 h-16 bg-burgundy-50 text-burgundy-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-burgundy-200/50 shadow-inner">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-5xl font-serif font-black text-burgundy-950 mb-2">404</h1>
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-3">Page Not Found</h2>
        <p className="text-stone-600 text-sm mb-8 leading-relaxed">
          The campus path you are looking for doesn't exist or has moved to another building.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2 justify-center"
        >
          <ArrowLeft size={16} />
          Return to Campus Home
        </Link>
      </div>
    </div>
  );
}
