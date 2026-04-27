
import React, { useState } from 'react';
import { Mail, Users, MapPin, Check } from 'lucide-react';
import { Screen } from '../types';
import { Logo } from '../constants';

interface ContactScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ContactScreen: React.FC<ContactScreenProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <header className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none">Get in touch</h1>
            <p className="text-text-secondary text-xl font-medium leading-relaxed">
              Have questions about our platform or enterprise plans? We're here to help you land that dream job.
            </p>
          </header>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Mail className="size-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Email Support</h3>
                <p className="text-text-secondary">support@mockinterview.ai</p>
                <p className="text-text-secondary text-sm mt-1">We typically respond within 24 hours.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="size-14 rounded-2xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0">
                <Users className="size-7 text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Enterprise Sales</h3>
                <p className="text-text-secondary">sales@mockinterview.ai</p>
                <p className="text-text-secondary text-sm mt-1">Custom coaching solutions for teams.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <MapPin className="size-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Headquarters</h3>
                <p className="text-text-secondary">San Francisco, CA</p>
                <p className="text-text-secondary text-sm mt-1">USA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-8 md:p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
           {submitted ? (
             <div className="text-center py-20 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="size-20 bg-teal-400 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-teal-400/20">
                   <Check className="size-10" />
                </div>
                <h2 className="text-3xl font-black">Message Sent!</h2>
                <p className="text-text-secondary max-w-sm mx-auto">
                   Thank you for reaching out. A member of our team will get back to you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-bold hover:underline"
                >
                  Send another message
                </button>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white uppercase tracking-widest opacity-60">First Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Alex" 
                      className="w-full h-14 rounded-2xl bg-background-dark border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary px-6 outline-none transition-all placeholder:opacity-30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white uppercase tracking-widest opacity-60">Last Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Morgan" 
                      className="w-full h-14 rounded-2xl bg-background-dark border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary px-6 outline-none transition-all placeholder:opacity-30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white uppercase tracking-widest opacity-60">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="alex@example.com" 
                    className="w-full h-14 rounded-2xl bg-background-dark border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary px-6 outline-none transition-all placeholder:opacity-30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white uppercase tracking-widest opacity-60">Message</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="How can we help you?" 
                    className="w-full rounded-2xl bg-background-dark border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary p-6 outline-none transition-all placeholder:opacity-30 resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all transform active:scale-95"
                >
                  Send Message
                </button>
             </form>
           )}
        </div>
      </main>
    </div>
  );
};

export default ContactScreen;
