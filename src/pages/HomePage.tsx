import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { HeroSlider } from '../components/HeroSlider';
import {
  Trophy,
  Plane,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Users2,
  FileCheck,
  CheckCircle,
  Clock,
  Compass,
  FileText,
  UserCheck
} from 'lucide-react';
import { PlayerProfile, NewsArticle } from '../types';

export const HomePage: React.FC = () => {
  const { navigate, openConsultationModal } = useRouter();
  const [featuredPlayers, setFeaturedPlayers] = useState<PlayerProfile[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    async function loadPublicData() {
      try {
        const [playersRes, newsRes] = await Promise.all([
          fetch('/api/public/players'),
          fetch('/api/public/news')
        ]);

        if (playersRes.ok) {
          const players: PlayerProfile[] = await playersRes.json();
          setFeaturedPlayers(players.filter((p) => p.isFeatured || p.isPublished).slice(0, 3));
        }
        if (newsRes.ok) {
          const news: NewsArticle[] = await newsRes.json();
          setLatestNews(news.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching homepage dynamic content:', err);
      } finally {
        setLoadingContent(false);
      }
    }
    loadPublicData();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section with Football Pitch Slider, Continuous Left-to-Right Tagline, and CTA Buttons */}
      <HeroSlider />

      {/* Official Approved Introduction Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
              Official Company Profile
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight">
              Our Clients' Priorities Come First, Every Time.
            </h2>
          </div>

          <div className="prose prose-lg mx-auto text-slate-700 leading-relaxed space-y-6 text-center sm:text-left bg-slate-50 p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-lg font-medium text-slate-900 leading-relaxed">
              At Chamonvin Limited, our clients' priorities come first, every time.
            </p>
            <p>
              Chamonvin Limited is an international/global sports management firm specializing in soccer, football, and player representation, with extended services in travel and visa consultation.
            </p>
            <p>
              We represent amateur players, semi-professional players, professional players, managers, and teams. We continuously provide dedicated, high-quality service to our clients, whether on or off the pitch.
            </p>
            <p>
              We understand what it takes to pursue success at the highest level. We help our clients navigate their careers, identify suitable opportunities, and make informed decisions at every stage of their journey.
            </p>
            <p className="font-semibold text-emerald-900 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
              Our number-one priority is our clients and their success. Chamonvin Limited is committed to helping clients access suitable opportunities through professional support, communication, and personalized service.
            </p>
          </div>

          {/* TWO CLEARLY SEPARATED SERVICE HIGHLIGHTS */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Highlight 1: Sports Management */}
            <div className="bg-white rounded-2xl p-8 border-2 border-emerald-600/20 hover:border-emerald-600 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                  <Trophy className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Primary Specialization
                </span>
                <h3 className="text-2xl font-heading font-bold text-slate-950 mt-1 mb-3">
                  Sports Management
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Professional football representation, player development, career support, and football opportunities. We guide players through contract evaluations, scouting pathways, and transparent career planning.
                </p>

                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Amateur, Semi-Professional & Professional Representation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Manager, Coach & Football Club Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Profile Structuring, Scouting & International Opportunities</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => navigate('/sports-management')}
                  className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm hover:text-emerald-800 transition-colors cursor-pointer group/link"
                >
                  <span>Explore Sports Management</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/player-representation')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md cursor-pointer"
                >
                  Apply for Representation
                </button>
              </div>
            </div>

            {/* Highlight 2: Travel and Visa Consultancy */}
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-slate-800 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-slate-950 text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                  <Plane className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Extended Global Services
                </span>
                <h3 className="text-2xl font-heading font-bold text-slate-950 mt-1 mb-3">
                  Travel & Visa Consultancy
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Travel planning, tour services, flight reservations, and consultation and assistance with eligible visa application processes for athletes, business travelers, students, and families.
                </p>

                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Family, Visitor, Study & Work Visa Consultation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Flight Ticket Reservations & Travel Itinerary Planning</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Personalized Destination Packages & Group Tours</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => navigate('/travel-tours')}
                  className="inline-flex items-center gap-2 text-slate-950 font-bold text-sm hover:text-emerald-700 transition-colors cursor-pointer group/link"
                >
                  <span>Explore Travel & Tours</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/visa-consultation')}
                  className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-md cursor-pointer"
                >
                  Visa Advisory
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PLAYERS SECTION (STRICTLY FROM DB - NO FAKE ROSTER) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Talent Showcase
              </span>
              <h2 className="text-3xl font-heading font-extrabold text-slate-950 mt-1">
                Represented Football Players
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Official directory of verified footballers represented and managed by Chamonvin Limited.
              </p>
            </div>
            <button
              onClick={() => navigate('/players')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 bg-white border border-slate-300 px-4 py-2.5 rounded-md hover:border-emerald-600 transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>View Full Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {featuredPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-64 bg-slate-900 overflow-hidden">
                      <img
                        src={player.photoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'}
                        alt={player.fullName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-xs text-emerald-400 font-bold text-xs">
                        {player.playingLevel}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                        {player.position} • {player.nationality}
                      </div>
                      <h4 className="text-xl font-heading font-bold text-slate-950 mb-2">
                        {player.fullName}
                      </h4>
                      <p className="text-slate-600 text-xs line-clamp-3 mb-4">
                        {player.shortBio}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => navigate(`/players`)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                    >
                      View Profile Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Professional Empty State as required by prompt */
            <div className="bg-white rounded-2xl p-10 sm:p-14 border border-dashed border-slate-300 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-950 mb-2">
                Official Player Roster Under Administrative Review
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                In strict adherence to international representation protocols and data privacy for minors and professional athletes, Chamonvin Limited publishes player profiles only following verified contractual authorization and mutual consent.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/player-representation')}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Submit Representation Inquiry
                </button>
                <button
                  onClick={() => openConsultationModal('sports')}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                >
                  Consult with a Manager
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE CHAMONVIN LIMITED */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              The Chamonvin Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 mt-1">
              Why Choose Chamonvin Limited?
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              We bridge the gap between football talent and global opportunity through honest representation, legal diligence, and comprehensive travel solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-4">
                <Users2 className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-950 mb-2">
                Client-First Priority
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Your vision and goal are our highest priority. We align every career step and travel plan strictly with our clients' long-term objectives.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-slate-950 text-emerald-400 flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-950 mb-2">
                International Reach
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Operating internationally with football networks, club connections, and cross-border travel logistics across Europe, the Americas, Africa, and beyond.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-950 mb-2">
                Integrity & Transparency
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                No false promises or unverified claims. We provide realistic appraisals, legal clarity, and transparent communication at all times.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-slate-950 text-emerald-400 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-950 mb-2">
                Dual Domain Synergy
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Seamless harmony between sports management and international travel/visa consultation ensures athletes and travelers move with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE EXPLANATION OF THE CLIENT INQUIRY PROCESS */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Clear & Straightforward
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
              How Our Client Inquiry Process Works
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              From your initial inquiry to customized guidance, our three-step engagement is transparent, structured, and responsive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-mono font-bold text-lg flex items-center justify-center mb-6">
                01
              </div>
              <h4 className="font-heading font-bold text-xl text-white mb-3">
                Inquiry & Profile Submission
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Submit an online inquiry via our dedicated forms for player representation, sports management, travel, visa advisory, or flight bookings.
              </p>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>Instant Reference Number Generated</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-lg flex items-center justify-center mb-6">
                02
              </div>
              <h4 className="font-heading font-bold text-xl text-white mb-3">
                Evaluation & Strategy Session
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Our authorized staff reviews your credentials, playing footage, or travel requirements. We schedule a tailored consultation via video call, phone, or in person.
              </p>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Rapid 24-48 Hour Professional Review</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-mono font-bold text-lg flex items-center justify-center mb-6">
                03
              </div>
              <h4 className="font-heading font-bold text-xl text-white mb-3">
                Dedicated Execution & Support
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Whether executing contract representation, player career planning, or managing flight itineraries and visa document preparation, we stand by you every step.
              </p>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Confidential & Professional Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST NEWS & COMPANY UPDATES */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Insights & Updates
              </span>
              <h2 className="text-3xl font-heading font-extrabold text-slate-950 mt-1">
                Latest News & Career Bulletins
              </h2>
            </div>
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 bg-slate-50 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>View All News</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={item.coverImageUrl || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-2 block">
                        {item.category}
                      </span>
                      <h4 className="font-heading font-bold text-lg text-slate-950 mb-2 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-600 text-xs line-clamp-3 mb-4">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => navigate('/news')}
                      className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      Read Article →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center max-w-lg mx-auto">
              <FileText className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-heading font-bold text-base text-slate-900 mb-1">
                News Articles in Preparation
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Authoritative sports insights, player announcements, and travel advisories will be published here as verified updates are issued.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Subscribe for Company Announcements →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CONSULTATION CALL TO ACTION SECTION */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight">
            “Your vision and Goal is our Priority”
          </h2>
          <p className="text-emerald-50 text-base max-w-2xl mx-auto leading-relaxed">
            Whether you are a rising football talent aiming for professional representation or an international traveler seeking visa guidance, Chamonvin Limited provides personalized, honest, and high-standard advisory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openConsultationModal()}
              className="px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Book a Consultation Now
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-md shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Contact Our Head Office
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
