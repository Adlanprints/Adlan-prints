import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useConfig } from '../context/ConfigContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { InquiryCategory } from '../types';

export const ContactPage: React.FC = () => {
  const { navigate } = useRouter();
  const { config } = useConfig();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<InquiryCategory>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceNo, setReferenceNo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!privacyConsent) {
      setError('Please accept our privacy policy to send your message.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          clientName: name,
          email,
          phone,
          subject,
          privacyConsent,
          details: {
            message,
            submittedAt: new Date().toISOString()
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setReferenceNo(data.referenceNo);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending your message.');
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
            Direct Communication
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white">
            Contact Chamonvin Limited
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Our international management and travel advisory teams are available to discuss player representation, sports projects, bespoke travel, and visa inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Company Details Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
              <h3 className="font-heading font-bold text-xl text-slate-950">
                Official Head Office & Hubs
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">
                      Office Address
                    </span>
                    <span>{config?.contact.officeAddress || 'London, United Kingdom & International Representative Hubs'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">
                      Telephone
                    </span>
                    <a href={`tel:${config?.contact.phone || '+442079460912'}`} className="hover:text-emerald-700 font-medium">
                      {config?.contact.phone || '+44 20 7946 0912'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">
                      WhatsApp Line
                    </span>
                    <a
                      href={`https://wa.me/${(config?.contact.whatsapp || '+447700900823').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-700 font-medium"
                    >
                      {config?.contact.whatsapp || '+44 7700 900823'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">
                      Email Address
                    </span>
                    <a href={`mailto:${config?.contact.email || 'info@chamonvin.com'}`} className="hover:text-emerald-700 font-medium">
                      {config?.contact.email || 'info@chamonvin.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">
                      Business Hours
                    </span>
                    <span>{config?.contact.businessHours || 'Monday – Friday: 9:00 AM – 6:00 PM GMT'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialized Portal Links */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">
                Looking for Specific Services?
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                For fast-track processing, use our dedicated service application forms:
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => navigate('/player-representation')}
                  className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold text-emerald-400 flex items-center justify-between cursor-pointer"
                >
                  <span>Player Representation Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/visa-consultation')}
                  className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-200 flex items-center justify-between cursor-pointer"
                >
                  <span>Visa Consultation Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/flight-services')}
                  className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-200 flex items-center justify-between cursor-pointer"
                >
                  <span>Flight Ticketing Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* General Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm">
              <div className="mb-8 border-b border-slate-100 pb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Direct Messaging
                </span>
                <h2 className="text-2xl font-heading font-bold text-slate-950 mt-1">
                  Send a General Message
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Fill in your inquiry details below. All submissions receive an official tracking reference number.
                </p>
              </div>

              {referenceNo ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-slate-950">
                    Message Successfully Sent!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you, <strong>{name}</strong>. An authorized representative will review your message and reply via email or phone.
                  </p>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-sm mx-auto text-left">
                    <span className="text-xs text-emerald-800 font-bold block mb-1">
                      Tracking Reference Number:
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
                      Send Another Message
                    </button>
                  </div>
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Marcus Sterling"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inquiry Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as InquiryCategory)}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="general">General Corporate Inquiry</option>
                        <option value="sports-management">Sports Management / Career Consultation</option>
                        <option value="player-representation">Player Representation</option>
                        <option value="travel-tours">Travel & Tour Planning</option>
                        <option value="visa-consultation">Visa Consultation</option>
                        <option value="flight-services">Flight Reservation Assistance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Partnership inquiry, scouting question, or travel date inquiry"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here with as much helpful detail as possible..."
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Privacy Consent */}
                  <div className="pt-2">
                    <div className="flex items-start gap-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        id="contactConsent"
                        required
                        checked={privacyConsent}
                        onChange={(e) => setPrivacyConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="contactConsent" className="text-xs text-slate-700 leading-normal">
                        I agree that Chamonvin Limited may store and process my contact details to reply to this inquiry in accordance with privacy regulations.
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
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
