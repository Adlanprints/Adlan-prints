import React from 'react';
import { useRouter } from '../context/RouterContext';
import { AlertCircle, Home, ArrowRight, Trophy, Plane } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="w-full bg-slate-50 min-h-[75vh] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 sm:p-14 border border-slate-200 shadow-xl max-w-lg w-full text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Error 404
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-slate-950 mt-1">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            The page you are looking for may have been moved, updated, or does not exist. Please navigate back to our main portals.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/sports-management')}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sports Services</span>
            </button>
            <button
              onClick={() => navigate('/travel-tours')}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plane className="w-3.5 h-3.5 text-emerald-600" />
              <span>Travel & Visas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
