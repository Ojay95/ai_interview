
import React, { useState } from 'react';
import { 
  UserCircle, 
  AudioLines, 
  CreditCard, 
  UserCheck, 
  LogOut, 
  Lock, 
  Mic2, 
  Play, 
  Brain, 
  Scale, 
  Coffee, 
  Briefcase, 
  Save 
} from 'lucide-react';
import { Screen, User } from '../types';

interface SettingsScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Voice & AI');
  const isPro = user?.plan === 'pro' || user?.plan === 'elite';

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-background-dark overflow-hidden font-display">
      {/* Sidebar - becomes top bar on mobile */}
      <aside className="flex flex-col lg:w-72 bg-[#111318] border-b lg:border-r border-border-dark shrink-0 overflow-y-auto max-h-[40vh] lg:max-h-full">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate(Screen.Dashboard)}>
            <div className="size-10 lg:size-12 rounded-full border-2 border-border-dark bg-gray-600 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
              {user?.name?.slice(0, 2)}
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-white text-sm lg:text-base font-semibold leading-tight truncate">{user?.name}</h1>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8px] lg:text-[10px] font-black tracking-widest border mt-1 w-fit uppercase ${isPro ? 'bg-primary/20 text-primary border-primary/20' : 'bg-white/5 text-text-secondary border-white/10'}`}>
                {user?.plan || 'Free'} Plan
              </span>
            </div>
          </div>
          <nav className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-col gap-2">
            {[
              { label: 'Account', icon: UserCircle },
              { label: 'Voice & AI', icon: AudioLines },
              { label: 'Subscription', icon: CreditCard },
              { label: 'Data & Privacy', icon: UserCheck }
            ].map(tab => (
              <button 
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.label);
                  if (tab.label === 'Subscription') onNavigate(Screen.Subscription);
                }}
                className={`flex items-center gap-3 px-3 py-2 lg:px-4 lg:py-3 rounded-xl transition-all text-xs lg:text-sm ${activeTab === tab.label ? 'bg-primary/10 text-primary border border-primary/20 font-bold' : 'text-text-secondary hover:bg-white/5 font-medium'}`}
              >
                <tab.icon className="size-4 lg:size-5" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 lg:p-6 border-t border-border-dark hidden lg:block">
          {!isPro && (
            <button 
              onClick={() => onNavigate(Screen.Subscription)}
              className="w-full mb-4 py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Upgrade to Pro
            </button>
          )}
          <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-xl h-11 lg:h-12 bg-white/5 hover:bg-white/10 text-white text-xs lg:text-sm font-bold transition-all border border-white/5">
            <LogOut className="size-4 lg:size-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-10 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{activeTab} Preferences</h2>
            <p className="text-sm md:text-lg text-text-secondary">Manage your personalized AI interviewer experience and persona.</p>
          </header>

          <section className="bg-surface-dark rounded-2xl md:rounded-3xl border border-border-dark/50 p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
            {!isPro && (
              <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-[2px] z-10 rounded-2xl md:rounded-3xl flex items-center justify-center p-6">
                 <div className="bg-[#1a1c24] p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-border-dark shadow-2xl w-full max-w-sm text-center space-y-4">
                    <div className="size-10 md:size-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto">
                       <Lock className="size-6" />
                    </div>
                    <h4 className="text-white font-bold text-sm md:text-base">Custom Voices are Pro Only</h4>
                    <p className="text-text-secondary text-[10px] md:text-xs leading-relaxed">Upgrade to Pro to unlock expressive voice models like Shimmer and Kore.</p>
                    <button onClick={() => onNavigate(Screen.Subscription)} className="w-full py-3 bg-primary text-white rounded-xl font-bold text-xs md:text-sm shadow-xl shadow-primary/30 active:scale-95 transition-all">Upgrade for $12/mo</button>
                 </div>
              </div>
            )}
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
               <Mic2 className="size-5 text-primary" />
               <h3 className="text-white text-lg md:text-xl font-bold">Voice Engine</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
               <div className="space-y-3">
                  <label className="text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest">AI Voice Model</label>
                  <select disabled={!isPro} className="w-full h-11 lg:h-12 rounded-xl bg-background-dark border border-border-dark text-white px-4 text-xs lg:text-sm focus:ring-1 focus:ring-primary outline-none disabled:opacity-50">
                     <option>Zephyr (Default)</option>
                     <option>Echo (Male, Neutral)</option>
                     <option>Alloy (Female, Neutral)</option>
                     <option>Shimmer (Female, Expressive)</option>
                     <option>Kore (Male, Professional)</option>
                  </select>
                  <p className="text-text-secondary text-[10px] md:text-xs">Vocal characteristics of your AI interviewer.</p>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <label className="text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Speech Speed</label>
                     <span className="text-primary font-black text-[10px] bg-primary/10 px-2 py-1 rounded">1.2x</span>
                  </div>
                  <input disabled={!isPro} type="range" className="w-full h-1.5 bg-background-dark rounded-full appearance-none accent-primary disabled:opacity-50" min="0.5" max="2.0" step="0.1" defaultValue="1.2" />
                  <div className="flex justify-between text-[8px] md:text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                     <span>Slow</span>
                     <span>Normal</span>
                     <span>Fast</span>
                  </div>
               </div>
            </div>

            <div className="bg-background-dark rounded-2xl p-4 md:p-6 border border-white/5 flex items-center gap-4 md:gap-6 group">
               <button className="size-10 md:size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-105 transition-all">
                  <Play className="size-5 md:size-6 fill-current" />
               </button>
               <div className="min-w-0">
                  <p className="text-white font-bold text-xs md:text-sm">Preview Voice</p>
                  <p className="text-text-secondary text-[10px] md:text-xs mt-0.5 truncate">Hear a sample before saving.</p>
               </div>
            </div>
          </section>

          <section className="bg-surface-dark rounded-2xl md:rounded-3xl border border-border-dark/50 p-6 md:p-8 space-y-8 shadow-2xl">
             <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <Brain className="size-5 text-primary" />
                <h3 className="text-white text-lg md:text-xl font-bold">Interviewer Persona</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'recruiter', icon: Scale, title: 'The Recruiter', desc: 'Formal, direct, behavioral focus.' },
                  { id: 'peer', icon: Coffee, title: 'The Peer', desc: 'Casual, technical, collaborative.', active: true },
                  { id: 'executive', icon: Briefcase, title: 'The Exec', desc: 'High-level, strategic, vision-based.' }
                ].map(persona => (
                  <div key={persona.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${persona.active ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'bg-background-dark border-border-dark hover:border-white/20'}`}>
                     <div className={`size-8 md:size-10 rounded-xl flex items-center justify-center mb-3 md:mb-4 ${persona.active ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary'}`}>
                        <persona.icon className="size-4 md:size-5" />
                     </div>
                     <h4 className="text-white font-bold text-xs md:text-sm mb-1.5">{persona.title}</h4>
                     <p className="text-text-secondary text-[10px] md:text-xs leading-relaxed">{persona.desc}</p>
                  </div>
                ))}
             </div>
          </section>

          <div className="flex items-center justify-end gap-4 md:gap-6 border-t border-white/5 pt-8 pb-10">
             <button onClick={() => onNavigate(Screen.Dashboard)} className="text-xs md:text-sm font-bold text-text-secondary hover:text-white transition-colors px-4 py-2">Cancel</button>
             <button onClick={() => onNavigate(Screen.Dashboard)} className="bg-primary hover:bg-primary-hover px-6 md:px-8 py-3 rounded-xl text-xs md:text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all flex items-center gap-2 active:scale-95">
                <Save className="size-4 md:size-5" />
                Save Preferences
             </button>
          </div>
        </div>
      </main>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3c4253; border-radius: 10px; }`}</style>
    </div>
  );
};

export default SettingsScreen;
