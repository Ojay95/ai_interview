
import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  Star, 
  Loader2, 
  ChevronDown 
} from 'lucide-react';
import { Screen, User } from '../types';
import { Logo } from '../constants';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time from your settings page with one click. Your access will continue until the end of your current billing period."
  },
  {
    question: "How do the monthly token limits work?",
    answer: "Token limits represent the total volume of AI processing available for your plan. 250,000 tokens (Pro) typically covers several hours of deep technical conversation."
  },
  {
    question: "Is there a student discount available?",
    answer: "We offer a 50% discount for students with a valid .edu email. Contact our support team with your credentials to receive a custom promo code."
  },
  {
    question: "What is 'Deep Feedback'?",
    answer: "Deep feedback provides a granular, line-by-line analysis of your transcript, evaluating not just content but also vocal tone, confidence, and filler word usage."
  }
];

interface SubscriptionScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
  onUpdateUser: (user: User) => void;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ user, onNavigate, onUpdateUser }) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const handleUpgrade = (plan: 'pro' | 'elite') => {
    if (!user) return;
    setIsProcessing(plan);
    setTimeout(() => {
      const updatedUser: User = { ...user, plan };
      onUpdateUser(updatedUser);
      setIsProcessing(null);
      onNavigate(Screen.Dashboard);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white overflow-y-auto font-display">
      <header className="flex items-center justify-between px-6 lg:px-20 py-6 border-b border-white/5 sticky top-0 bg-[#0f111a]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(Screen.Dashboard)}>
          <Logo className="size-8" />
          <span className="text-lg font-bold tracking-tight">MockInterview.ai</span>
        </div>
        <button onClick={() => onNavigate(Screen.Dashboard)} className="text-text-secondary hover:text-white transition-colors size-10 rounded-xl hover:bg-white/5 flex items-center justify-center">
          <X className="size-5" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Investment Tiers
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">Elevate your performance.</h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-medium">
            Choose the backbone for your career growth. Built for serious candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {/* Basic Plan */}
          <div className="bg-[#1c212b] border border-white/5 p-8 lg:p-10 rounded-[40px] flex flex-col justify-between hover:border-white/10 transition-all shadow-xl">
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                   <div className="size-2 rounded-full bg-green-500"></div>
                   <h3 className="text-lg font-bold text-green-500/80">Basic</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl lg:text-5xl font-black">$0</span>
                </div>
                <p className="text-text-secondary text-xs mt-4 leading-relaxed font-medium italic opacity-60">Purpose: curiosity, not comfort.</p>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  { text: '3 interviews / week', icon: 'history_toggle_off' },
                  { text: '10 minutes max', icon: 'timer' },
                  { text: 'Basic feedback (score + 2 bullets)', icon: 'chat' },
                  { text: '15,000 tokens / month', icon: 'generating_tokens' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                    <CheckCircle className="size-5 text-green-500/40" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              disabled={user?.plan === 'free'}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {user?.plan === 'free' ? 'Current Tier' : 'Default'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative p-8 lg:p-10 rounded-[40px] bg-gradient-to-b from-primary/10 to-[#1c212b] border border-primary/30 flex flex-col justify-between shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
              Most Popular
            </div>
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                   <div className="size-2 rounded-full bg-primary"></div>
                   <h3 className="text-lg font-bold text-primary">Pro</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl lg:text-5xl font-black">$19</span>
                  <span className="text-text-secondary text-sm font-bold">/mo</span>
                </div>
                <p className="text-text-secondary text-xs mt-4 leading-relaxed font-medium">Your backbone tier. Professional reliability.</p>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  { text: '40 interviews / month', icon: 'verified' },
                  { text: 'Up to 45 minutes', icon: 'verified' },
                  { text: 'Full feedback engine', icon: 'verified' },
                  { text: 'Custom voice selection', icon: 'verified' },
                  { text: '250,000 tokens / month', icon: 'verified' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white font-bold">
                    <ShieldCheck className="size-5 text-primary" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => handleUpgrade('pro')}
              disabled={user?.plan === 'pro' || user?.plan === 'elite' || !!isProcessing}
              className="w-full py-5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing === 'pro' ? <Loader2 className="size-4 animate-spin" /> : null}
              {user?.plan === 'pro' ? 'Current Tier' : isProcessing === 'pro' ? 'Processing...' : 'Upgrade Now'}
            </button>
          </div>

          {/* Elite Plan */}
          <div className="relative p-8 lg:p-10 rounded-[40px] bg-[#1a1c24] border border-purple-500/30 flex flex-col justify-between shadow-2xl overflow-hidden hover:border-purple-500/60 transition-all">
            <div className="absolute top-0 right-0 bg-purple-600 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
              Power Tier
            </div>
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                   <div className="size-2 rounded-full bg-purple-500"></div>
                   <h3 className="text-lg font-bold text-purple-400">Elite</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl lg:text-5xl font-black">$49</span>
                  <span className="text-text-secondary text-sm font-bold">/mo</span>
                </div>
                <p className="text-text-secondary text-xs mt-4 leading-relaxed font-medium">Maximum volume for career switchers.</p>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  { text: '100 interviews / month', icon: 'star' },
                  { text: 'Up to 60 minutes', icon: 'star' },
                  { text: 'Deep feedback + Analytics', icon: 'star' },
                  { text: 'Resume analysis', icon: 'star' },
                  { text: 'Priority queue access', icon: 'star' },
                  { text: '700,000 tokens / month', icon: 'star' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white font-bold">
                    <Star className="size-5 text-purple-400" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => handleUpgrade('elite')}
              disabled={user?.plan === 'elite' || !!isProcessing}
              className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing === 'elite' ? <Loader2 className="size-4 animate-spin" /> : null}
              {user?.plan === 'elite' ? 'Current Tier' : isProcessing === 'elite' ? 'Processing...' : 'Go Elite'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto space-y-12 mb-24">
          <div className="text-center">
             <h2 className="text-2xl md:text-3xl font-black tracking-tight">Got Questions?</h2>
             <p className="text-text-secondary mt-2 font-medium">Clear answers for clear career choices.</p>
          </div>

          <div className="space-y-4">
             {FAQ_DATA.map((faq, i) => (
               <div key={i} className="bg-[#1c212b] border border-white/5 rounded-3xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    className="w-full px-6 lg:px-8 py-5 lg:py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                     <span className="font-bold text-sm lg:text-lg">{faq.question}</span>
                     <span className={`transition-transform duration-300 ${openFAQ === i ? 'rotate-180' : ''}`}>
                        <ChevronDown className="size-5" />
                     </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="px-6 lg:px-8 pb-6 lg:pb-8 text-text-secondary text-sm lg:text-base leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SubscriptionScreen;
