import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from '../context/RouterContext';
import { useConfig } from '../context/ConfigContext';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Trophy,
  Plane,
  UserCheck,
  CalendarCheck
} from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { navigate, openConsultationModal } = useRouter();
  const { config } = useConfig();

  const slides = config?.heroSlider?.slides && config.heroSlider.slides.length === 3
    ? config.heroSlider.slides
    : [
        {
          id: 'slide-1',
          image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=2000&q=85',
          alt: 'A professional football pitch viewed from the stands, with vibrant green grass and stadium atmosphere',
          title: 'International Football Player Representation',
          subtitle: 'Guiding careers from academy to professional global arenas with dedicated, high-quality management on and off the pitch.'
        },
        {
          id: 'slide-2',
          image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=2000&q=85',
          alt: 'A beautifully maintained football field with goalposts and a professional stadium environment',
          title: 'Career Development & Global Opportunities',
          subtitle: 'Strategic scouting, contract navigation, and global opportunities tailored to emerging and elite talents.'
        },
        {
          id: 'slide-3',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2000&q=85',
          alt: 'A high-quality football stadium or pitch featuring a football match atmosphere',
          title: 'Global Travel & Visa Consultation',
          subtitle: 'Seamless tour coordination, flight ticketing, and legitimate immigration consultation for players, families, and travelers.'
        }
      ];

  const intervalSeconds = 6;
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tagline = config?.heroTagline || 'Your vision and Goal is our Priority';

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Continuous automatic slider transition every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleButtonClick = (path: string) => {
    if (path.includes('#consultation')) {
      openConsultationModal();
    } else {
      navigate(path);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[620px] lg:min-h-[720px] flex flex-col justify-between"
      aria-label="Football pitch hero slider"
    >
      {/* Background Slides with Cross-Fade */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt || 'Football pitch stadium view'}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[15000ms] ease-out"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              {/* Premium dark gradient overlay for optimal legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* CONTINUOUS SMOOTH SCROLLING TAGLINE (LEFT TO RIGHT ANIMATION) */}
      <div className="relative z-20 w-full bg-emerald-950/80 border-b border-emerald-500/30 backdrop-blur-md py-3 overflow-hidden select-none">
        <div className="animate-marquee-ltr text-xs sm:text-sm font-extrabold uppercase tracking-widest text-emerald-300 flex items-center">
          {/* Repeating sequence for continuous left-to-right flow */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white drop-shadow-sm font-heading">{tagline}</span>
              <span className="text-emerald-400 font-semibold text-xs tracking-normal">| CHAMONVIN LIMITED</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>International Sports Management & Travel Consulting</span>
          </div>

          {/* Dynamic Slide Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-tight mb-4 drop-shadow-md">
            {slides[currentIndex]?.title || 'Professional Football Representation'}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mb-8 drop-shadow">
            {slides[currentIndex]?.subtitle ||
              "At Chamonvin Limited, our clients' priorities come first, every time. Connecting amateur, semi-pro, and professional talents with global opportunities."}
          </p>

          {/* Hero Call-to-Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {/* Button 1: Explore Our Sports Management */}
            <button
              onClick={() => handleButtonClick('/sports-management')}
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg hover:shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Trophy className="w-4 h-4 text-emerald-200" />
              <span>Explore Sports Management</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Button 2: Explore Travel & Visa Services */}
            <button
              onClick={() => handleButtonClick('/travel-tours')}
              className="px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Plane className="w-4 h-4 text-emerald-400" />
              <span>Explore Travel & Visa Services</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Button 3: Become a Represented Player */}
            <button
              onClick={() => handleButtonClick('/player-representation')}
              className="px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-md shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Become a Represented Player</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Button 4: Book a Consultation */}
            <button
              onClick={() => handleButtonClick('/contact#consultation')}
              className="px-5 py-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-md backdrop-blur-sm transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Book a Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Slider Controls & Indicators */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-between">
        {/* Three slide indicator dots */}
        <div className="flex items-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-10 bg-emerald-500 shadow-sm'
                  : 'w-3 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Previous and Next arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white border border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white border border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
