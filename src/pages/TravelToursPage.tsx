import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  Copy,
  Check,
  ShieldAlert,
  Plane,
  Luggage,
  Sparkles
} from 'lucide-react';
import { TravelPackage } from '../types';

export const TravelToursPage: React.FC = () => {
  const { openConsultationModal } = useRouter();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Travel Consultation Request Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [numberOfTravelers, setNumberOfTravelers] = useState('1');
  const [packageType, setPackageType] = useState('Custom Tour Package');
  const [requirements, setRequirements] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceNo, setReferenceNo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPackages() {
      try {
        setLoading(true);
        const res = await fetch('/api/public/travel-packages');
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        }
      } catch (err) {
        console.error('Failed to load travel packages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!privacyConsent) {
      setError('You must accept the privacy policy to submit your travel inquiry.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'travel-tours',
          clientName: fullName,
          email,
          phone,
          privacyConsent,
          subject: `Travel & Tour Inquiry: ${destination || 'Custom Destination'} (${numberOfTravelers} travelers)`,
          details: {
            destination,
            travelDates,
            numberOfTravelers,
            packageType,
            requirements,
            submittedAt: new Date().toISOString()
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setReferenceNo(data.referenceNo);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your travel request.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    if (referenceNo) {
      navigator.clipboard.writeText(referenceNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 inline-block mb-3">
            Global Travel Consulting
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white">
            Travel, Tours & Bespoke Itineraries
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Personalized travel planning, family vacations, international sports team logistics, and comprehensive tour itineraries coordinated by experienced advisors.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Core Services Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-950 mb-2">
              Tailored Travel Planning
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Custom-crafted travel schedules designed for individual professionals, sports delegations, and vacationers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-slate-950 text-emerald-400 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-950 mb-2">
              Family & Group Tours
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Group flight bookings, accommodation coordination, airport transfers, and private guided excursions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Luggage className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-950 mb-2">
              Sports Delegation Logistics
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Logistics for football teams, players traveling for international trials, tournaments, and pre-season camps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-slate-950 text-emerald-400 flex items-center justify-center mb-4">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-950 mb-2">
              Transit & Document Advisory
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cross-referencing travel transit rules, entry requirements, health declarations, and customs advisory.
            </p>
          </div>
        </div>

        {/* Dynamic Travel Packages from DB */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Curated Packages
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-950 mt-1">
                Featured Tour & Destination Packages
              </h2>
            </div>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-56 bg-slate-900 overflow-hidden relative">
                      <img
                        src={pkg.coverImageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
                        alt={pkg.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-xs text-white font-bold text-xs flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{pkg.destination}</span>
                      </div>
                      {pkg.duration && (
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold text-[11px]">
                          {pkg.duration}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading font-bold text-xl text-slate-950 mb-2">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                        {pkg.description}
                      </p>

                      {pkg.inclusions && pkg.inclusions.length > 0 && (
                        <div className="space-y-1 mb-4 text-xs text-slate-700">
                          <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                            Key Inclusions:
                          </span>
                          {pkg.inclusions.slice(0, 3).map((inc, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {pkg.price && (
                        <span className="text-base font-bold text-slate-950">
                          {pkg.currency || '$'}{pkg.price}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setDestination(pkg.destination);
                        setRequirements(`Inquiring about: ${pkg.title}`);
                        window.scrollTo({ top: 900, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
                    >
                      Inquire Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-slate-200 text-center max-w-xl mx-auto shadow-xs">
              <Luggage className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                Custom Tailored Travel Planning
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Rather than generic cookie-cutter holiday bookings, Chamonvin Limited designs customized itineraries built around your exact destinations, flight preferences, group sizes, and budget expectations.
              </p>
              <button
                onClick={() => openConsultationModal('travel')}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
              >
                Request Custom Itinerary
              </button>
            </div>
          )}
        </div>

        {/* Travel Consultation Request Form */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Start Planning
            </span>
            <h2 className="text-2xl font-heading font-bold text-slate-950 mt-1">
              Submit a Travel & Tour Consultation Request
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Tell us about your desired destination and dates. A travel specialist will curate options and respond promptly.
            </p>
          </div>

          {referenceNo ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-950">
                Travel Consultation Request Logged
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Your travel inquiry has been received. Our concierge will review flight availability, lodging, and itinerary possibilities.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-sm mx-auto text-left">
                <span className="text-xs text-emerald-800 font-bold block mb-1">
                  Inquiry Reference Code:
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-mono font-bold text-emerald-900">
                    {referenceNo}
                  </span>
                  <button
                    onClick={copyCode}
                    className="px-2.5 py-1 bg-white border border-emerald-300 text-xs font-semibold text-emerald-800 rounded hover:bg-emerald-100 cursor-pointer"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setReferenceNo(null)}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 cursor-pointer"
              >
                Submit New Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Michael O'Connor"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7700 900823"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Intended Destination(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Madrid, London, Dubai"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={numberOfTravelers}
                    onChange={(e) => setNumberOfTravelers(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Proposed Travel Dates or Season
                  </label>
                  <input
                    type="text"
                    value={travelDates}
                    onChange={(e) => setTravelDates(e.target.value)}
                    placeholder="e.g. July 2026 or flexible"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Package Focus
                  </label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Custom Tour Package">Custom Leisure & Sightseeing Tour</option>
                    <option value="Sports Delegation / Team Camp">Sports Delegation / Team Camp</option>
                    <option value="Family Holiday Package">Family Holiday Package</option>
                    <option value="Corporate / Business Travel">Corporate / Business Travel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Requirements or Preferred Accommodations
                </label>
                <textarea
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Tell us about special requests (hotel stars, dietary needs, local transport, match tickets)..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="travelConsent"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="travelConsent" className="text-xs text-slate-600">
                  I agree that Chamonvin Limited may process my details to respond to this travel inquiry. I acknowledge that prices and availability are confirmed only after itinerary finalization.
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Travel Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
