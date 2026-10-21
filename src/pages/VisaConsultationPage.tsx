import React, { useState } from 'react';
import {
  FileText,
  Users,
  Briefcase,
  GraduationCap,
  HardHat,
  Home,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const VisaConsultationPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [visaType, setVisaType] = useState('Visitor / Tourist Visa');
  const [purposeOfTravel, setPurposeOfTravel] = useState('');
  const [intendedTimeframe, setIntendedTimeframe] = useState('');
  const [preferredMethod, setPreferredMethod] = useState('Video Call Consultation');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceNo, setReferenceNo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = [
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: 'Family Reunion Visa Consultation',
      description: 'Advisory on spousal sponsorship, dependent children pathways, and family reunification requirements under official statutory migration rules.'
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: 'Visitor & Tourist Visa Consultation',
      description: 'Guidance on genuine visitor criteria, tie-to-home-country evidence, bank statement documentation, and purpose-of-visit letters.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      title: 'Business Visa Consultation',
      description: 'Advisory for corporate meetings, international conferences, trade delegations, and commercial prospecting permits.'
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
      title: 'Study Visa Guidance',
      description: 'Assistance for prospective international students on admission confirmations (CAS/I-20), tuition proof, and study visa requirements.'
    },
    {
      icon: <HardHat className="w-6 h-6 text-emerald-600" />,
      title: 'Skilled Worker & Employment Pathways',
      description: 'Clarifying employer-sponsored work visas, points-based immigration eligibility, and legally recognized overseas employment frameworks.'
    },
    {
      icon: <Home className="w-6 h-6 text-emerald-600" />,
      title: 'Permanent Residency Pathway Guidance',
      description: 'Strategic long-term mapping for eligible skilled professionals, sports personalities, and families seeking lawful permanent residency routes.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!privacyConsent) {
      setError('You must accept the privacy and legal disclaimer to proceed.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'visa-consultation',
          clientName: fullName,
          email,
          phone,
          privacyConsent,
          subject: `Visa Advisory Inquiry: ${visaType} (${destinationCountry})`,
          details: {
            countryOfResidence,
            destinationCountry,
            visaType,
            purposeOfTravel,
            intendedTimeframe,
            preferredMethod,
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
      setError(err.message || 'An error occurred while submitting your consultation inquiry.');
    } finally {
      setLoading(false);
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
      {/* Page Header */}
      <div className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 inline-block mb-3">
            Visa & Immigration Advisory
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white">
            International Visa Consultation
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Professional consultation on legal entry criteria, application preparation, and verified immigration documentation for athletes, families, students, and professionals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* MANDATORY PROMINENT LEGAL DISCLAIMER */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 sm:p-8 flex items-start gap-4 shadow-xs">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="text-xs sm:text-sm text-amber-950 space-y-2 leading-relaxed">
            <h3 className="font-heading font-bold text-base text-amber-950">
              Statutory Immigration & Visa Advisory Notice
            </h3>
            <p>
              Visa and immigration decisions are made exclusively by the relevant sovereign government authorities, high commissions, and embassies. Official requirements, criteria, and processing times are determined solely by government immigration departments and are subject to policy updates.
            </p>
            <p className="font-semibold">
              Chamonvin Limited provides consultative advisory, application guidance, and documentation preparation assistance. Consultation does not guarantee visa approval, employment, or permanent residency. We do not provide unauthorized legal representation where regulated local licensing is required.
            </p>
          </div>
        </div>

        {/* Visa Categories Grid */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Service Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-950 mt-1">
              Explore Our Visa Advisory Categories
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Select the relevant category below to fast-track your initial consultation inquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                    {cat.icon}
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-950 mb-2">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setVisaType(cat.title);
                    window.scrollTo({ top: 1100, behavior: 'smooth' });
                  }}
                  className="w-full py-2 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Select Pathway</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Visa Consultation Inquiry Form */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Initial Assessment
            </span>
            <h2 className="text-2xl font-heading font-bold text-slate-950 mt-1">
              Request a Visa Consultation
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              We collect only the essential preliminary details to evaluate eligibility. Confidential documentation is submitted during formal review.
            </p>
          </div>

          {referenceNo ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-950">
                Visa Consultation Inquiry Logged
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you, <strong>{fullName}</strong>. A visa consultant has been assigned to assess your requested destination and visa category.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-sm mx-auto text-left">
                <span className="text-xs text-emerald-800 font-bold block mb-1">
                  Your Inquiry Reference Code:
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

              <div className="pt-4">
                <button
                  onClick={() => setReferenceNo(null)}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  Submit Another Consultation Request
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

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
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

              {/* Phone & Country of Residence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Current Country of Residence *
                  </label>
                  <input
                    type="text"
                    required
                    value={countryOfResidence}
                    onChange={(e) => setCountryOfResidence(e.target.value)}
                    placeholder="e.g. Nigeria, Ghana, UK"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Intended Destination & Visa Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Intended Destination Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    placeholder="e.g. United Kingdom, Canada, Schengen Area"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type of Visa or Immigration Pathway *
                  </label>
                  <select
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Family Reunion Visa Consultation">Family Reunion Visa</option>
                    <option value="Visitor & Tourist Visa Consultation">Visitor & Tourist Visa</option>
                    <option value="Business Visa Consultation">Business & Conference Visa</option>
                    <option value="Study Visa Guidance">Study Visa Guidance</option>
                    <option value="Skilled Worker & Employment Pathways">Skilled Worker / Employment Pathway</option>
                    <option value="Permanent Residency Pathway Guidance">Permanent Residency Guidance</option>
                    <option value="Athletic / Sports Personality Visa">Athletic / Sports Personality Visa</option>
                    <option value="Other Immigration Category">Other Category</option>
                  </select>
                </div>
              </div>

              {/* Purpose & Timeframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Purpose of Travel *
                  </label>
                  <input
                    type="text"
                    required
                    value={purposeOfTravel}
                    onChange={(e) => setPurposeOfTravel(e.target.value)}
                    placeholder="e.g. Family visit, University enrolment, Sports trial"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Intended Travel Date / Timeframe
                  </label>
                  <input
                    type="text"
                    value={intendedTimeframe}
                    onChange={(e) => setIntendedTimeframe(e.target.value)}
                    placeholder="e.g. Within 3 months / September 2026"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Consultation Method
                </label>
                <select
                  value={preferredMethod}
                  onChange={(e) => setPreferredMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Video Call Consultation">Video Conference (Google Meet / Zoom)</option>
                  <option value="WhatsApp Consultation">WhatsApp Voice / Chat</option>
                  <option value="Direct Phone Call">Direct Phone Call</option>
                  <option value="In-Person Office Appointment">In-Person Office Appointment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Details or Previous Visa History (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention any previous visa grants, refusals (if applicable), or specific questions..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Legal & Privacy Consent */}
              <div className="pt-2">
                <div className="flex items-start gap-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="visaConsent"
                    required
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="visaConsent" className="text-xs text-slate-700 leading-normal">
                    I acknowledge that visa decisions are solely made by immigration authorities and that Chamonvin Limited provides consultative guidance without guarantees of visa issuance. I consent to the processing of my inquiry details.
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
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request Visa Consultation</span>
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
