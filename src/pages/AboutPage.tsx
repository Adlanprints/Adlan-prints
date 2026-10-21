import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useConfig } from '../context/ConfigContext';
import {
  Trophy,
  Plane,
  ShieldCheck,
  Target,
  Eye,
  HeartHandshake,
  Lock,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate, openConsultationModal } = useRouter();
  const { config } = useConfig();

  const about = config?.about || {
    overview: "At Chamonvin Limited, our clients' priorities come first, every time.\n\nChamonvin Limited is an international/global sports management firm specializing in soccer, football, and player representation, with extended services in travel and visa consultation.\n\nWe represent amateur players, semi-professional players, professional players, managers, and teams. We continuously provide dedicated, high-quality service to our clients, whether on or off the pitch.\n\nWe understand what it takes to pursue success at the highest level. We help our clients navigate their careers, identify suitable opportunities, and make informed decisions at every stage of their journey.\n\nOur number-one priority is our clients and their success. Chamonvin Limited is committed to helping clients access suitable opportunities through professional support, communication, and personalized service.",
    mission: "To discover, develop, and represent sports talent globally while providing comprehensive travel, visa, and logistics solutions anchored in transparency, trust, and client success.",
    vision: "To be recognized globally as a premier, ethical sports management and travel consultancy that empowers athletes and travelers to fulfill their highest potential without borders.",
    philosophy: "Our clients' vision and goals stand at the center of everything we do. We offer honest evaluations, long-term career foresight, and meticulous logistical execution.",
    sportsApproach: "We take a holistic approach to player development: from technical profiling and tactical awareness to contract negotiation coordination, international network introductions, and life beyond the pitch.",
    travelApproach: "We provide seamless, lawful, and personalized guidance for international trips, tours, flights, and visa consultations tailored to athletes, business professionals, students, and families.",
    commitment: "Absolute client confidentiality, full transparency in communication, and uncompromising adherence to relevant regulatory and legal frameworks."
  };

  return (
    <div className="w-full bg-white">
      {/* Page Header Banner */}
      <div className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            About CHAMONVIN LIMITED
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight mt-2 text-white">
            Our Purpose, Philosophy & Global Vision
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl">
            A dedicated international sports management and travel consultancy committed to putting clients first on and off the pitch.
          </p>
        </div>
      </div>

      {/* Main Company Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-xs mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-3">
              Company Overview
            </span>
            <div className="text-slate-700 leading-relaxed space-y-4 text-base sm:text-lg">
              {about.overview.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Mission and Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Mission */}
            <div className="p-8 rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/40">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-950 mb-3">
                Our Mission
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {about.mission}
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-2xl border-2 border-slate-800 bg-slate-950 text-white">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                Our Vision
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {about.vision}
              </p>
            </div>
          </div>

          {/* Client-First Service Philosophy */}
          <div className="border border-slate-200 rounded-2xl p-8 sm:p-10 bg-white shadow-xs mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-950">
                Client-First Service Philosophy
              </h3>
            </div>
            <p className="text-slate-700 text-base leading-relaxed">
              {about.philosophy}
            </p>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h3 className="text-2xl font-heading font-bold text-slate-950 mb-6 text-center">
              Our Core Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-emerald-600 font-mono font-bold text-sm block mb-2">01</span>
                <h4 className="font-heading font-bold text-base text-slate-950 mb-1">
                  Client Priority
                </h4>
                <p className="text-xs text-slate-600">
                  Every negotiation, club communication, and itinerary is constructed exclusively around our client's best interest.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-emerald-600 font-mono font-bold text-sm block mb-2">02</span>
                <h4 className="font-heading font-bold text-base text-slate-950 mb-1">
                  Integrity & Truth
                </h4>
                <p className="text-xs text-slate-600">
                  Uncompromising honesty about career assessments and visa eligibility without inflated or fabricated claims.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-emerald-600 font-mono font-bold text-sm block mb-2">03</span>
                <h4 className="font-heading font-bold text-base text-slate-950 mb-1">
                  Confidentiality
                </h4>
                <p className="text-xs text-slate-600">
                  Strict safeguarding of athlete scouting data, personal credentials, and client documentation.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-emerald-600 font-mono font-bold text-sm block mb-2">04</span>
                <h4 className="font-heading font-bold text-base text-slate-950 mb-1">
                  International Reach
                </h4>
                <p className="text-xs text-slate-600">
                  Continuous expansion of verified club networks, scouting relationships, and cross-border logistics.
                </p>
              </div>
            </div>
          </div>

          {/* Operational Approaches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-emerald-600" />
                <h4 className="text-xl font-heading font-bold text-slate-950">
                  Sports Management Approach
                </h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {about.sportsApproach}
              </p>
            </div>

            <div className="p-8 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-6 h-6 text-slate-950" />
                <h4 className="text-xl font-heading font-bold text-slate-950">
                  Travel & Visa Approach
                </h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {about.travelApproach}
              </p>
            </div>
          </div>

          {/* Commitment to Confidentiality & Transparency */}
          <div className="bg-emerald-950 text-white rounded-2xl p-8 sm:p-10 border border-emerald-800 flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Lock className="w-7 h-7" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-xl font-heading font-bold text-white mb-1">
                Our Commitment to Professionalism & Confidentiality
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {about.commitment}
              </p>
            </div>
            <button
              onClick={() => openConsultationModal()}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-md whitespace-nowrap cursor-pointer"
            >
              Consult With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
