import React from 'react';
import { useRouter } from '../context/RouterContext';
import {
  Trophy,
  Users,
  Compass,
  FileCheck2,
  Network,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Layers
} from 'lucide-react';

export const SportsManagementPage: React.FC = () => {
  const { navigate, openConsultationModal } = useRouter();

  const services = [
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: 'Amateur Player Representation',
      description: 'Guiding grassroots and amateur talents transitioning into competitive, structured league systems with player profiling and development planning.'
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-600" />,
      title: 'Semi-Professional Player Representation',
      description: 'Bridging the critical leap between semi-pro tiers and full-time professional leagues through verified assessment and strategic exposure.'
    },
    {
      icon: <Trophy className="w-6 h-6 text-emerald-600" />,
      title: 'Professional Player Representation',
      description: 'Full-service career management for professional footballers, including contract coordination, endorsement guidance, and international mobility support.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      title: 'Manager & Coach Representation',
      description: 'Strategic career advisory and network positioning for football managers, technical directors, and coaching personnel.'
    },
    {
      icon: <Network className="w-6 h-6 text-emerald-600" />,
      title: 'Team & Club Support',
      description: 'Assisting clubs and football academies with talent scouting reports, squad requirements, and international tour match coordination.'
    },
    {
      icon: <Compass className="w-6 h-6 text-emerald-600" />,
      title: 'Player Career Planning & Development',
      description: 'Holistic career path mapping: tactical development, physical conditioning consultation, and preparing athletes for sustained longevity.'
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-emerald-600" />,
      title: 'Player Profile & Portfolio Preparation',
      description: 'Standardized video highlight preparation, statistical metric dossier assembly, and Transfermarkt/Wyscout-compliant athlete profiling.'
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
      title: 'International Opportunity Navigation',
      description: 'Cross-border representation assistance navigating foreign league registration criteria, cultural transitions, and immigration advisory.'
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Header */}
      <div className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966915_1px,transparent_1px),linear-gradient(to_bottom,#05966915_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 inline-block mb-3">
            Core Specialization
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white max-w-3xl">
            International Sports & Football Player Management
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
            Representing amateur, semi-professional, and professional footballers, managers, and teams with dedicated guidance on and off the pitch.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Primary Required Action Button */}
            <button
              onClick={() => navigate('/player-representation')}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Request Sports Management Support</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/players')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-md backdrop-blur-sm transition-all cursor-pointer"
            >
              Browse Represented Players
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              End-to-End Representation
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 mt-1">
              Comprehensive Football Management Services
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              We provide structured, ethical, and personalized representation tailored to each athlete's career stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-950 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Development & Network Integration */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Strategic Career Pathways
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 mt-1 mb-6">
                Guiding Athletes Through Every Stage of Their Football Career
              </h2>
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>
                  Pursuing a football career at the highest level requires far more than natural talent. It requires informed decisions, professional profile preparation, contract coordination, and mental preparation for high-pressure environments.
                </p>
                <p>
                  At Chamonvin Limited, we act as an objective, dedicated partner. We work with players and their families to identify realistic opportunities, avoid common contractual pitfalls, and ensure every move aligns with sustainable, long-term progression.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 font-medium">
                    Strict adherence to FIFA and national football association representation guidelines.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 font-medium">
                    Protection and safeguarding for minor athletes and academy talents with parental involvement.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 font-medium">
                    Transparent communication between athlete, family, and football clubs.
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate('/player-representation')}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Request Sports Management Support</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-950 text-white rounded-2xl p-8 sm:p-10 border border-slate-800">
              <h3 className="text-2xl font-heading font-bold text-white mb-4">
                What We Look For in Players
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Chamonvin Limited considers athletes based on competitive video footage, verified playing history, and professional character.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <h4 className="font-heading font-bold text-sm text-emerald-400 mb-1">
                    Technical & Tactical Proficiency
                  </h4>
                  <p className="text-xs text-slate-300">
                    Strong foundational touch, decision-making speed, positional awareness, and competitive work rate.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <h4 className="font-heading font-bold text-sm text-emerald-400 mb-1">
                    Verified Match Footage
                  </h4>
                  <p className="text-xs text-slate-300">
                    High-quality full match recordings or organized highlight reels against competitive opposition.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <h4 className="font-heading font-bold text-sm text-emerald-400 mb-1">
                    Discipline & Coachability
                  </h4>
                  <p className="text-xs text-slate-300">
                    Dedication to professional standards on and off the pitch, respect for coaching staff, and continuous improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANDATORY LEGAL & ETHICAL DISCLAIMER */}
      <section className="py-12 bg-amber-50/70 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-700 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-amber-950 mb-1">
                Transparency & Ethical Representation Notice
              </h4>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                Chamonvin Limited upholds strict international football integrity standards. We do not promise, guarantee, or sell contracts, trials, transfers, or professional careers. Opportunities are determined solely by football clubs, scouting staff, and verified sporting merit. Beware of fraudulent agencies asking for upfront guarantees; Chamonvin Limited operates transparently with written agreements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
