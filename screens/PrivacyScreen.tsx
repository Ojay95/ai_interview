
import React from 'react';
import { Screen } from '../types';
import { Logo } from '../constants';

interface PrivacyScreenProps {
  onNavigate: (screen: Screen) => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onNavigate }) => {
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
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-text-secondary text-lg">Last updated: May 24, 2024</p>
        </header>

        <section className="space-y-6 bg-white/5 p-8 md:p-12 rounded-[32px] border border-white/5">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. Introduction</h2>
            <p className="text-text-secondary leading-relaxed">
              At MockInterview.ai, we take your privacy seriously. This policy describes how we collect, use, and handle your information when you use our website, software, and services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Data We Collect</h2>
            <p className="text-text-secondary leading-relaxed">
              We collect information that you provide directly to us, such as when you create an account, upload a resume, or conduct an AI mock interview. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>Account information (name, email address)</li>
              <li>Voice recordings from interview sessions (processed real-time)</li>
              <li>Resume data and job descriptions</li>
              <li>Usage information and analytics</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. How We Use Your Data</h2>
            <p className="text-text-secondary leading-relaxed">
              Your data is primarily used to provide and improve our mock interview experience. We use AI models (Google Gemini) to analyze your voice and text inputs to provide feedback.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Crucially: <strong>We do not sell your personal data to third parties.</strong>
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. Data Security</h2>
            <p className="text-text-secondary leading-relaxed">
              We implement industry-standard security measures to protect your data. All communication with our servers is encrypted using SSL/TLS.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">5. Your Rights</h2>
            <p className="text-text-secondary leading-relaxed">
              You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.
            </p>
          </div>
        </section>

        <footer className="text-center pt-8">
           <button 
             onClick={() => onNavigate(Screen.Landing)}
             className="bg-primary hover:bg-primary-hover px-10 py-4 rounded-2xl text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all transform hover:scale-105"
           >
             Got it, thanks
           </button>
        </footer>
      </main>
    </div>
  );
};

export default PrivacyScreen;
