import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import {
  UserCheck,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Shield,
  Video,
  FileText,
  Lock
} from 'lucide-react';

export const PlayerRepresentationPage: React.FC = () => {
  const { navigate } = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [dob, setDob] = useState('');
  const [playingLevel, setPlayingLevel] = useState<'Academy' | 'Amateur' | 'Semi-Professional' | 'Professional'>('Amateur');
  const [position, setPosition] = useState('Center Back');
  const [currentClub, setCurrentClub] = useState('');
  const [experience, setExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [goalsMessage, setGoalsMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceNo, setReferenceNo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!privacyConsent) {
      setError('You must consent to our privacy policy to submit your representation inquiry.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'player-representation',
          clientName: fullName,
          email,
          phone,
          privacyConsent,
          subject: `Player Representation Application: ${fullName} (${position} - ${playingLevel})`,
          details: {
            country,
            dateOfBirth: dob,
            playingLevel,
            position,
            currentClub,
            experience,
            portfolioUrl,
            goalsMessage,
            submittedAt: new Date().toISOString()
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setReferenceNo(data.referenceNo);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your inquiry.');
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
            Athlete Representation
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white">
            Apply for Player Representation
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Submit your profile for review by Chamonvin Limited's sports management team. We evaluate amateur, semi-professional, and professional footballers seeking structured career advancement.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {referenceNo ? (
          /* Confirmation State */
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-heading font-extrabold text-slate-950">
              Representation Inquiry Submitted
            </h2>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Thank you, <strong>{fullName}</strong>. Your profile has been securely recorded in our private management database. Our scouting and legal assessment team will review your playing footage and experience.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 max-w-md mx-auto text-left">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Your Official Submission Reference Number
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-900">
                  {referenceNo}
                </span>
                <button
                  onClick={copyRef}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 text-xs font-bold rounded hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left max-w-xl mx-auto space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-900 text-sm">Next Steps:</div>
              <p>• Save your reference number for all future inquiries regarding this application.</p>
              <p>• Our management team typically completes technical assessments within 3–5 business days.</p>
              <p>• We do not publish your submitted profile publicly without prior contractual authorization.</p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setReferenceNo(null);
                  setFullName('');
                  setEmail('');
                  setPhone('');
                  setGoalsMessage('');
                  setPrivacyConsent(false);
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
              >
                Submit Another Inquiry
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-heading font-bold text-slate-950">
                Football Player Profile Questionnaire
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Please provide accurate playing information and working video links. Submissions are strictly confidential.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2 mb-6">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  1. Contact & Identity
                </h3>

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
                      placeholder="e.g. Samuel Adeyemi"
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
                      placeholder="player@example.com"
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
                      Country of Residence *
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United Kingdom"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Football Profile Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  2. Footballing Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Playing Level *
                    </label>
                    <select
                      value={playingLevel}
                      onChange={(e) => setPlayingLevel(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Academy">Academy / Youth Tier</option>
                      <option value="Amateur">Amateur League</option>
                      <option value="Semi-Professional">Semi-Professional</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Position *
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Goalkeeper">Goalkeeper</option>
                      <option value="Right Back">Right Back</option>
                      <option value="Left Back">Left Back</option>
                      <option value="Center Back">Center Back</option>
                      <option value="Defensive Midfielder">Defensive Midfielder (CDM)</option>
                      <option value="Central Midfielder">Central Midfielder (CM)</option>
                      <option value="Attacking Midfielder">Attacking Midfielder (CAM)</option>
                      <option value="Right Winger">Right Winger</option>
                      <option value="Left Winger">Left Winger</option>
                      <option value="Striker / Center Forward">Striker / Center Forward</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Club or Team
                    </label>
                    <input
                      type="text"
                      value={currentClub}
                      onChange={(e) => setCurrentClub(e.target.value)}
                      placeholder="e.g. AFC Academy or Free Agent"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Playing History & Experience *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Outline your previous clubs, academy training, leagues competed in, and notable tournament achievements..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Player Highlight Reel & Video Dossier (YouTube / Video URL)
                  </label>
                  <div className="relative">
                    <Video className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or Drive link"
                      className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Please provide unlisted or public links. Highlight reels or full-match footage are strongly recommended.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Career Goals & What You Seek from Management *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={goalsMessage}
                    onChange={(e) => setGoalsMessage(e.target.value)}
                    placeholder="Describe your current football ambitions, target leagues or countries, and why you are seeking representation with Chamonvin Limited..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Privacy Consent Checkbox */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="repConsent"
                    required
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="repConsent" className="text-xs text-slate-700 leading-normal">
                    <span className="font-semibold text-slate-900 block mb-0.5">
                      Privacy & Data Confidentiality Consent *
                    </span>
                    I hereby consent that CHAMONVIN LIMITED may securely store and evaluate the sporting details and contact information provided above solely for athlete scouting and management assessment. I understand that submitting this inquiry does not constitute a guaranteed contract, trial, or transfer, and that my information will never be sold or published publicly without my written consent.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating & Recording...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Representation Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
