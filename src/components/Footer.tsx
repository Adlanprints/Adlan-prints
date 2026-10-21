import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useConfig } from '../context/ConfigContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Globe,
  AlertCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, openConsultationModal } = useRouter();
  const { config } = useConfig();

  const companyName = config?.companyName || 'CHAMONVIN LIMITED';
  const logoUrl = config?.logoUrl;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Footer Banner - Quick Consultation CTA */}
      <div className="bg-emerald-900/60 border-b border-emerald-800/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Start Your Journey Today
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Ready to elevate your football career or plan your next journey?
            </h3>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Connect with our dedicated sports managers and international travel consultants for personalized, professional advisory.
            </p>
          </div>
          <button
            onClick={() => openConsultationModal()}
            className="whitespace-nowrap px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-md shadow-lg transition-all cursor-pointer flex items-center gap-2 group"
          >
            <span>Book a Consultation</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Company Profile & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="cursor-pointer select-none inline-block mb-2"
            >
              <img
                src={logoUrl || 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg'}
                alt="CHAMONVIN LIMITED"
                className="h-16 w-auto object-contain rounded bg-white/10 p-1.5 hover:opacity-90 transition-opacity"
              />
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              CHAMONVIN LIMITED is an international sports management firm specializing in soccer, football, and player representation, with comprehensive services in travel, tours, flight reservations, and visa consultation.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{config?.contact.officeAddress || 'London, United Kingdom & International Representative Hubs'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${config?.contact.phone || '+442079460912'}`} className="hover:text-white">
                  {config?.contact.phone || '+44 20 7946 0912'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${config?.contact.email || 'info@chamonvin.com'}`} className="hover:text-white">
                  {config?.contact.email || 'info@chamonvin.com'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{config?.contact.businessHours || 'Mon – Fri: 9:00 AM – 6:00 PM GMT'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Sports Management */}
          <div>
            <h4 className="text-white font-heading font-bold text-base mb-4 tracking-wide uppercase border-b border-slate-800 pb-2">
              Sports Management
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/sports-management')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Overview & Services</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/players')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Our Players Directory</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/player-representation')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium text-emerald-400"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  <span>Player Representation Form</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/sports-management')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Amateur & Pro Pathways</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/sports-management')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Manager & Club Support</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Travel & Visa Services */}
          <div>
            <h4 className="text-white font-heading font-bold text-base mb-4 tracking-wide uppercase border-b border-slate-800 pb-2">
              Travel & Visas
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/travel-tours')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Travel & Tour Packages</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/visa-consultation')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Visa Consultation</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/flight-services')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Flight Ticket Assistance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/visa-consultation')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Family & Visitor Visas</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/visa-consultation')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Study & Work Pathways</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Navigation & Legal */}
          <div>
            <h4 className="text-white font-heading font-bold text-base mb-4 tracking-wide uppercase border-b border-slate-800 pb-2">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  About Chamonvin
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/news')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  News & Career Updates
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Regulatory Disclaimer Section */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-500 leading-relaxed">
          <div className="flex items-start gap-2.5 bg-slate-900/50 p-3.5 rounded border border-slate-800">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300">Visa & Immigration Notice:</strong> Visa and immigration decisions are made exclusively by the relevant government immigration departments, embassies, and high commissions. Chamonvin Limited provides consultative advisory, application guidance, and documentation preparation. Consultation does not guarantee visa approval, employment, or permanent residency.
            </p>
          </div>
          <div className="flex items-start gap-2.5 bg-slate-900/50 p-3.5 rounded border border-slate-800">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300">Sports Management Notice:</strong> Chamonvin Limited represents athletes, managers, and clubs with integrity. We do not promise or guarantee professional contracts, club trials, or transfer fees; opportunities depend strictly on athlete talent, club requirements, and verified assessments.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Brand Bar */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} CHAMONVIN LIMITED. All rights reserved. Registered & Operating Internationally.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-slate-300 cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/terms')} className="hover:text-slate-300 cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-slate-300 cursor-pointer">
              Client Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
