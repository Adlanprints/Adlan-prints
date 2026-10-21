import React, { useState } from 'react';
import {
  Plane,
  Clock,
  Luggage,
  ShieldAlert,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';

export const FlightServicesPage: React.FC = () => {
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tripType, setTripType] = useState<'Round-Trip' | 'One-Way' | 'Multi-City'>('Round-Trip');
  const [departureCity, setDepartureCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [travelClass, setTravelClass] = useState('Economy');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceNo, setReferenceNo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!privacyConsent) {
      setError('You must accept the terms to submit your flight reservation inquiry.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'flight-services',
          clientName: passengerName,
          email,
          phone,
          privacyConsent,
          subject: `Flight Reservation Inquiry: ${departureCity} to ${destinationCity} (${tripType})`,
          details: {
            passengerName,
            tripType,
            departureCity,
            destinationCity,
            departureDate,
            returnDate: tripType === 'Round-Trip' ? returnDate : undefined,
            travelers,
            travelClass,
            additionalRequirements,
            submittedAt: new Date().toISOString()
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit flight inquiry');
      }

      setReferenceNo(data.referenceNo);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your flight inquiry.');
    } finally {
      setLoading(false);
    }
  };

  const copyRef = () => {
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
            Air Travel Logistics
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white">
            Flight Reservation & Ticketing Assistance
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Professional flight booking consultation, multi-airline routing, sports team delegation travel coordination, and ticket purchase assistance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Important Notice Distinguishing Inquiries vs Booking */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex items-start gap-4 shadow-xs">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="text-xs sm:text-sm text-emerald-950 space-y-1.5 leading-relaxed">
            <h3 className="font-heading font-bold text-base text-emerald-900">
              Clear Notice Regarding Flight Inquiries
            </h3>
            <p>
              This online form submits an official flight reservation and itinerary advisory request. To protect your security, <strong>we do not collect credit or debit card details through public online forms</strong>.
            </p>
            <p className="text-emerald-800 font-medium">
              Submitting this form does not confirm a seat or constitute an issued ticket. A Chamonvin Limited travel consultant will review live carrier seat inventories and provide confirmed flight schedules with verified payment steps.
            </p>
          </div>
        </div>

        {/* Value Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Plane className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-950 mb-2">
              Complex Itinerary Routing
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seamless connections across major global carriers for international players, sports managers, and long-haul travelers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-slate-950 text-emerald-400 flex items-center justify-center mb-4">
              <Luggage className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-950 mb-2">
              Extra Baggage & Sports Kit
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assistance coordinating excess athletic luggage, sports gear allowances, and priority check-in where available.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-950 mb-2">
              Flexible Change Advisory
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Guidance on fare flexibility, airline cancellation terms, date changes, and emergency re-routing support.
            </p>
          </div>
        </div>

        {/* Flight Inquiry Form */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Flight Fare & Routing Request
            </span>
            <h2 className="text-2xl font-heading font-bold text-slate-950 mt-1">
              Passenger & Flight Itinerary Inquiry
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Provide your proposed travel dates and city pairs. A consultant will respond with verified routing and fare options.
            </p>
          </div>

          {referenceNo ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-950">
                Flight Reservation Inquiry Received
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you, <strong>{passengerName}</strong>. Our ticketing desk is evaluating routes for <strong>{departureCity}</strong> to <strong>{destinationCity}</strong>.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-sm mx-auto text-left">
                <span className="text-xs text-emerald-800 font-bold block mb-1">
                  Flight Inquiry Reference Number:
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-mono font-bold text-emerald-900">
                    {referenceNo}
                  </span>
                  <button
                    onClick={copyRef}
                    className="px-2.5 py-1 bg-white border border-emerald-300 text-xs font-semibold text-emerald-800 rounded hover:bg-emerald-100 cursor-pointer"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setReferenceNo(null)}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  Submit Another Flight Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Trip Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Trip Type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Round-Trip', 'One-Way', 'Multi-City'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTripType(type)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        tripType === type
                          ? 'bg-slate-950 text-white border-slate-950'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passenger & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lead Passenger Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="As shown in passport"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp *
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
              </div>

              {/* Cities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Departure City or Airport *
                  </label>
                  <input
                    type="text"
                    required
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    placeholder="e.g. London Heathrow (LHR) or Lagos (LOS)"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination City or Airport *
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="e.g. Madrid (MAD) or Toronto (YYZ)"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Departure Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {tripType === 'Round-Trip' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Return Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Travelers & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Cabin Class
                  </label>
                  <select
                    value={travelClass}
                    onChange={(e) => setTravelClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Economy">Economy Class</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                    <option value="First">First Class</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Requirements (Preferred Airlines, Sports Baggage, Layover limits)
                </label>
                <textarea
                  rows={3}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="Tell us if you need flexible tickets, specific airlines, or sports luggage handling..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Consent */}
              <div className="pt-2">
                <div className="flex items-start gap-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="flightConsent"
                    required
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="flightConsent" className="text-xs text-slate-700 leading-normal">
                    I understand that this inquiry is an itinerary request and does not represent an instant booking or charge. I consent to Chamonvin Limited contacting me with fare options.
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking Routing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Flight Request</span>
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
