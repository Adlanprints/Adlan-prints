import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Terms of Service
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
            Terms & Conditions of Engagement
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            CHAMONVIN LIMITED | International Operating Terms
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">1. Acceptance of Terms</h2>
            <p>
              By accessing and utilizing the website and inquiry submission portals of CHAMONVIN LIMITED, visitors, athletes, travelers, and clients agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">2. Nature of Sports Representation Inquiries</h2>
            <p>
              Submission of an athlete representation inquiry does not create an automatic agency representation agreement. Formal representation is established exclusively through an executed, written representation contract complying with applicable football governing regulations. Chamonvin Limited makes no guarantee of trials, club contracts, or transfer fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">3. Nature of Visa & Immigration Consultation</h2>
            <p>
              Consultations, guidance documents, and eligibility evaluations provided by Chamonvin Limited are strictly advisory. Final decisions regarding visa issuances, residence permits, and travel authorizations rest solely with sovereign government departments and embassies. No consultation guarantees favorable immigration decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">4. Flight Inquiries vs. Confirmed Tickets</h2>
            <p>
              Flight inquiry submissions through our platform constitute requests for itinerary and fare evaluation. Seat reservations, flight schedules, and airline tickets are confirmed only upon issuance of formal e-ticket numbers following receipt of cleared payment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-slate-950">5. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of the jurisdiction of CHAMONVIN LIMITED's incorporation and international commercial standards.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
