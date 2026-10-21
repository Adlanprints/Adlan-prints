import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import {
  X,
  CheckCircle2,
  CalendarCheck,
  Send,
  Loader2,
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';
import { InquiryCategory } from '../types';

export const ConsultationModal: React.FC = () => {
  const { isConsultationModalOpen, closeConsultationModal, consultationService } = useRouter();

  const [category, setCategory] = useState<InquiryCategory>(() => {
    if (consultationService === 'sports') return 'sports-management';
    if (consultationService === 'travel') return 'travel-tours';
    if (consultationService === 'visa') return 'visa-consultation';
    if (consultationService === 'flight') return 'flight-services';
    return 'general';
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredMethod, setPreferredMethod] = useState('Online Video Call');
  const [notes, setNotes] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isConsultationModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!privacyConsent) {
      setError('You must accept the privacy policy to submit a consultation request.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          clientName: fullName,
          email,
          phone,
          privacyConsent,
          subject: `Consultation Booking: ${category}`,
          details: {
            preferredDate,
            preferredMethod,
            notes,
            requestedAt: new Date().toISOString()
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit consultation request');
      }

      setSuccessReference(data.referenceNo);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessReference(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setPrivacyConsent(false);
    closeConsultationModal();
  };

  const copyReference = () => {
    if (successReference) {
      navigator.clipboard.writeText(successReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Book a Consultation</h3>
              <p className="text-xs text-slate-400">
                CHAMONVIN LIMITED Sports & Travel Advisory
              </p>
            </div>
          </div>
          <button
            onClick={closeConsultationModal}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {successReference ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-heading font-bold text-slate-900">
                Consultation Request Received!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for contacting Chamonvin Limited. An authorized sports manager or travel consultant will review your details and contact you via your preferred communication method.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-w-sm mx-auto text-left">
                <span className="text-xs text-slate-500 font-medium block">Your Reference Number:</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-mono font-bold text-emerald-700">
                    {successReference}
                  </span>
                  <button
                    onClick={copyReference}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Consultation Category Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  Select Consultation Focus *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InquiryCategory)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="sports-management">Sports Management / Career Advisory</option>
                  <option value="player-representation">Player Representation Evaluation</option>
                  <option value="travel-tours">Travel Planning & Tour Services</option>
                  <option value="visa-consultation">Visa & Immigration Consultation</option>
                  <option value="flight-services">Flight Reservation / Ticketing Assistance</option>
                  <option value="general">General Corporate Inquiry</option>
                </select>
              </div>

              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. David Mensah"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Phone & Preferred Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Consultation Method
                  </label>
                  <select
                    value={preferredMethod}
                    onChange={(e) => setPreferredMethod(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Online Video Call">Online Video Call (Zoom / Teams / Meet)</option>
                    <option value="WhatsApp Call / Chat">WhatsApp Call / Chat</option>
                    <option value="Direct Phone Call">Direct Telephone Call</option>
                    <option value="In-Person Office Meeting">In-Person Office Meeting</option>
                  </select>
                </div>
              </div>

              {/* Preferred Date / Timeframe */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Date or Target Timeframe
                </label>
                <input
                  type="text"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  placeholder="e.g. Next Tuesday morning or ASAP"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Brief Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Overview of Your Goals or Inquiry
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide any relevant details about your football playing background, travel destination, or visa inquiry..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modalConsent"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="modalConsent" className="text-xs text-slate-600 leading-normal">
                  I agree that CHAMONVIN LIMITED may process my contact details solely to coordinate this consultation in accordance with the Privacy Policy.
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeConsultationModal}
                  className="px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm Request</span>
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
