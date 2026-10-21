import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Legal & Governance
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Effective Date: Current | CHAMONVIN LIMITED
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">1. Overview</h2>
            <p>
              CHAMONVIN LIMITED ("we", "us", or "our") respects the privacy rights of all clients, football players, guardians, managers, and website visitors. This Privacy Policy details how we collect, process, safeguard, and retain information submitted through our public website and consultation portals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">2. Information We Collect</h2>
            <p>
              We collect information strictly necessary to deliver sports representation assessments and travel/visa advisory:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Contact Details:</strong> Full name, verified email address, telephone/WhatsApp numbers, and country of residence.</li>
              <li><strong>Player Scouting Data:</strong> Playing level, positions, clubs, highlight footage URLs, playing history, and career goals.</li>
              <li><strong>Travel & Visa Details:</strong> Destination countries, proposed travel dates, visa category interest, and flight routing preferences.</li>
              <li><strong>Administrative Metadata:</strong> Unique inquiry reference numbers, submission timestamps, and consultation logs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">3. Safeguarding Minors & Academy Talents</h2>
            <p>
              For youth and academy players under the age of 18, we require explicit parental or legal guardian consent prior to conducting in-depth representation assessments or publishing authorized profiles. We never make minor athlete contact details or private evaluations publicly accessible.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">4. Confidentiality & Non-Disclosure</h2>
            <p>
              Private inquiries, scouting reports, and internal consultation notes are stored on protected servers and are accessible only to authorized Chamonvin Limited personnel. We do not sell, rent, or trade client personal information to third-party marketers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">5. Payment Security</h2>
            <p>
              We do not collect credit card, debit card, or sensitive financial payment details through ordinary public web forms. All financial transactions are managed via verified, secure, and regulated payment or invoicing procedures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">6. Contacting the Data Protection Officer</h2>
            <p>
              If you wish to request deletion, review, or correction of your submitted inquiry data, please contact our administrative desk at <strong>info@chamonvin.com</strong> quoting your assigned reference number.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
