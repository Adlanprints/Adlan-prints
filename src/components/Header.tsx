import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useConfig } from '../context/ConfigContext';
import {
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Globe2,
  CalendarCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate, openConsultationModal } = useRouter();
  const { config } = useConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'SPORTS MANAGEMENT', path: '/sports-management' },
    { label: 'OUR PLAYERS', path: '/players' },
    { label: 'PLAYER REPRESENTATION', path: '/player-representation' },
    { label: 'TRAVEL & TOURS', path: '/travel-tours' },
    { label: 'VISA CONSULTATION', path: '/visa-consultation' },
    { label: 'FLIGHT SERVICES', path: '/flight-services' },
    { label: 'NEWS & UPDATES', path: '/news' },
    { label: 'CONTACT US', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const logoUrl = config?.logoUrl || 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top Bar for Contact & International Reach */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Globe2 className="w-3.5 h-3.5" />
              Global Sports Management & Travel Consulting
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <a
              href={`tel:${config?.contact.phone || '+442079460912'}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              {config?.contact.phone || '+44 20 7946 0912'}
            </a>
            <a
              href={`mailto:${config?.contact.email || 'info@chamonvin.com'}`}
              className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              {config?.contact.email || 'info@chamonvin.com'}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Mon-Fri: 9AM - 6PM GMT
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Area: Only the provided logo link */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center cursor-pointer select-none py-1 group"
          >
            <img
              src={logoUrl}
              alt="CHAMONVIN LIMITED"
              className="h-14 sm:h-16 w-auto max-w-[240px] object-contain rounded hover:opacity-95 transition-opacity"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-2.5 py-2 text-[12px] font-bold tracking-wider uppercase transition-all rounded cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600 font-extrabold'
                      : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Consultation CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openConsultationModal()}
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-md shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              Book a Consultation
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-md text-slate-700 hover:text-emerald-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-800 hover:bg-slate-50 hover:text-emerald-600'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openConsultationModal();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold tracking-wide rounded-md shadow text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                Book a Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
