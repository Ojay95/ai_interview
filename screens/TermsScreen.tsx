
import React from 'react';
import { Screen } from '../types';
import { Logo } from '../constants';

interface TermsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const TermsScreen: React.FC<TermsScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
      <nav className="flex items-center justify-between px-6 lg:px-20 py-6 border-b border-white/5 sticky top-0 bg-background-dark/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(Screen.Landing)}>
          <Logo />
          <span className="text-xl font-bold tracking-tight">MockInterview.ai</span>
        </div>
        <button 
          onClick={() => onNavigate(Screen.Landing)}
          className="text-sm font-semibold text-text-secondary hover:text-white transition-colors"
        >
          Back to Home
        </button>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 space-y-12">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-text-secondary text-lg">Effective Date: May 24, 2024</p>
        </header>

        <section className="space-y-8 bg-white/5 p-8 md:p-12 rounded-[32px] border border-white/5">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing or using MockInterview.ai, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Description of Service</h2>
            <p className="text-text-secondary leading-relaxed">
              MockInterview.ai provides an AI-powered platform for practicing job interviews. The service includes voice-to-text processing, AI-generated questions and feedback, and performance analytics.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. User Responsibilities</h2>
            <p className="text-text-secondary leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. You agree not to use the service for any illegal or unauthorized purposes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. Subscription and Payments</h2>
            <p className="text-text-secondary leading-relaxed">
              Certain features require a paid subscription. All fees are non-refundable unless required by law. You can manage your subscription through the account settings.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed">
              MockInterview.ai is provided "as is" without warranty of any kind. We do not guarantee that the practice sessions will lead to successful job placement.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">6. Changes to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update these terms from time to time. Your continued use of the service after such changes constitutes acceptance of the new terms.
            </p>
          </div>
        </section>

        <footer className="text-center pt-8">
           <button 
             onClick={() => onNavigate(Screen.Landing)}
             className="bg-primary hover:bg-primary-hover px-10 py-4 rounded-2xl text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all transform hover:scale-105"
           >
             I Accept
           </button>
        </footer>
      </main>
    </div>
  );
};

export default TermsScreen;
