import React from 'react';
import { ChevronRight } from 'lucide-react';

interface AboutPrivacyProps {
  pageType: 'about' | 'privacy' | 'terms' | 'contact' | 'disclaimer';
  onContinue: () => void;
}

export default function AboutPrivacy({ pageType, onContinue }: AboutPrivacyProps) {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12 animate-fade-in font-sans">
      {pageType === 'about' && (
        <section className="space-y-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Our Mission</span>
          <h1 className="text-4xl font-bold text-black tracking-tight leading-tight">
            Journalism, redefined through verification.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            newstaskk is a next-generation news ecosystem dedicated to editorial excellence, community contribution, and the absolute verification of truth in an age of misinformation.
          </p>

          <div className="aspect-[21/9] w-full overflow-hidden rounded bg-gray-100 my-8 shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=800&h=300" 
              alt="Editorial board"
              className="w-full h-full object-cover filter grayscale"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black uppercase tracking-wide">The newstaskk Pillar</h3>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
              Our platform operates on a decentralized verification model. We believe that journalism should not just be read, but validated. By empowering a global network of contributors, we ensure every headline is backed by rigorous data and multi-source confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-5 border border-gray-100 bg-gray-50/30 rounded-lg">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-2">24/7 Monitoring</h4>
              <p className="text-gray-500 text-xs md:text-sm">Real-time global event tracking powered by community-driven verification intelligence.</p>
            </div>
            <div className="p-5 border border-gray-100 bg-gray-50/30 rounded-lg">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-2">Global Impact</h4>
              <p className="text-gray-500 text-xs md:text-sm">Reaching over 40 million monthly active readers across 120 countries, bringing absolute clarity to complexity.</p>
            </div>
          </div>

          {/* Hidden Entry Point: Small simple Continue Reading link */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-1 text-gray-400 hover:text-black font-semibold text-xs transition-all duration-300 hover:underline cursor-pointer group"
            >
              Continue Reading
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>
      )}

      {pageType === 'privacy' && (
        <section className="space-y-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Security Policy</span>
          <h1 className="text-4xl font-bold text-black tracking-tight leading-tight">
            Commitment to Privacy
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            At newstaskk, we protect the source as much as the truth. Our infrastructure is built on zero-knowledge encryption protocols to ensure that our contributors and readers remain secure in an increasingly surveilled digital landscape. We believe information is a right, and privacy is its guardian.
          </p>

          <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
            <h3 className="text-lg font-bold text-black uppercase tracking-wide mt-6">1. Data Minimization</h3>
            <p>
              We do not track IP addresses, browser agents, or location telemetry across standard page views. Any information provided during voluntary registrations is stored securely inside sandboxed cloud environments.
            </p>
            <h3 className="text-lg font-bold text-black uppercase tracking-wide mt-6">2. Contributor Protection</h3>
            <p>
              For users operating within our specialized peer-to-peer verification and fact-checking editorial network, we utilize end-to-end cryptographic proofs to verify submission validity without revealing real-world credentials to third-party observers.
            </p>
          </div>

          {/* Hidden Entry Point: Small simple Continue link */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-1 text-gray-400 hover:text-black font-semibold text-xs transition-all duration-300 hover:underline cursor-pointer group"
            >
              Continue
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>
      )}

      {pageType === 'terms' && (
        <section className="space-y-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Legal Terms</span>
          <h1 className="text-4xl font-bold text-black tracking-tight leading-tight">
            Terms of Service
          </h1>
          <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
            <p>Welcome to newstaskk. By accessing or using our editorial platform, you agree to comply with and be bound by the following Terms of Service.</p>
            <h3 className="text-base font-bold text-black uppercase tracking-wide mt-4">1. Acceptable Use</h3>
            <p>All news material and recommendations hosted on this site are for general informational purposes. Any modification, syndication, or redistribution of content without direct licensing is prohibited.</p>
            <h3 className="text-base font-bold text-black uppercase tracking-wide mt-4">2. Peer Verification Accounts</h3>
            <p>Contributors inside the verifying ledger system must present accurate credentials. Abuse, submission of false news reports, or manipulation of evaluation workflows will result in immediate termination.</p>
          </div>
        </section>
      )}

      {pageType === 'contact' && (
        <section className="space-y-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Get In Touch</span>
          <h1 className="text-4xl font-bold text-black tracking-tight leading-tight">
            Contact Us
          </h1>
          <p className="text-gray-600 leading-relaxed">
            For editorial tips, press inquiries, or technical support, please write to us at:
          </p>
          <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-lg space-y-2">
            <p className="text-sm text-black"><strong>Editorial Desk:</strong> editor@newstaskk.com</p>
            <p className="text-sm text-black"><strong>Contributor Support:</strong> rewards@newstaskk.com</p>
            <p className="text-sm text-black"><strong>General Inquiries:</strong> contact@newstaskk.com</p>
          </div>
        </section>
      )}

      {pageType === 'disclaimer' && (
        <section className="space-y-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Legal Notice</span>
          <h1 className="text-4xl font-bold text-black tracking-tight leading-tight">
            Disclaimer
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            The articles, software recommendations, and website reviews featured on newstaskk are generated by independent journalists and peer reviewers. While we utilize standard verification practices, we do not warrant the absolute accuracy, completeness, or safety of third-party external services.
          </p>
        </section>
      )}
    </div>
  );
}
