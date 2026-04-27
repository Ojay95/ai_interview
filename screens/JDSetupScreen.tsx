
import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Brain, 
  Sliders, 
  Globe, 
  ChevronDown, 
  Lock, 
  Loader2, 
  Zap 
} from 'lucide-react';
import { Screen, User, InterviewConfig } from '../types';
import { Logo } from '../constants';
import { analyzeJobDescription } from '../services/geminiService';

interface JDSetupScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese (Mandarin)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
  { code: 'ko', name: 'Korean' },
];

const JDSetupScreen: React.FC<JDSetupScreenProps> = ({ user, onNavigate }) => {
  const [context, setContext] = useState('');
  const [language, setLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  
  const isPro = user?.plan === 'pro';
  const isElite = user?.plan === 'elite';
  const isProOrElite = isPro || isElite;
  
  const maxDuration = isElite ? 60 : isPro ? 45 : 10;
  const [duration, setDuration] = useState(Math.min(10, maxDuration));

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setIsGenerating(true);
    
    try {
      const analysis = await analyzeJobDescription(context);
      
      // Fix: Use a type guard to check if analysis returned an error object before accessing properties.
      if ('error' in analysis) {
        throw new Error(analysis.error);
      }

      const config: InterviewConfig = {
        role: analysis.roleName || context.split('\n')[0].slice(0, 50) || 'Professional Candidate',
        experienceLevel: analysis.experienceLevel || experienceLevel,
        techStack: analysis.keySkills || [],
        focusAreas: analysis.recommendedFocusAreas || ['Core Competencies', 'Behavioral Alignment'],
        duration: duration,
        language: language,
        customQuestions: context.trim() 
      };
      
      localStorage.setItem('pending_interview_config', JSON.stringify(config));
      
      const today = new Date().toDateString();
      const usageData = localStorage.getItem(`usage_${user?.id}`);
      const usage = usageData ? JSON.parse(usageData) : { count: 0, date: "" };
      usage.count += 1;
      usage.date = today;
      localStorage.setItem(`usage_${user?.id}`, JSON.stringify(usage));

      onNavigate(Screen.Interview);
    } catch (err) {
      console.error("Failed to analyze context:", err);
      const config: InterviewConfig = {
        role: context.split('\n')[0].slice(0, 50) || 'Professional Candidate',
        experienceLevel: experienceLevel,
        techStack: [],
        focusAreas: ['General Experience', 'Soft Skills', 'Technical Depth'],
        duration: duration,
        language: language,
        customQuestions: context.trim()
      };
      localStorage.setItem('pending_interview_config', JSON.stringify(config));
      onNavigate(Screen.Interview);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0f111a]/95 backdrop-blur-md px-4 lg:px-10 py-3 lg:py-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <Logo className="size-7 lg:size-8" />
          <h2 className="text-sm lg:text-lg font-bold">Session Configuration</h2>
        </div>
        <button onClick={() => onNavigate(Screen.Dashboard)} className="text-text-secondary hover:text-white transition-colors size-8 lg:size-10 rounded-xl hover:bg-white/5 flex items-center justify-center">
          <X className="size-5" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 lg:px-10 py-6 lg:py-10 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10 overflow-y-auto custom-scrollbar">
        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-10">
           <div className="space-y-3 lg:space-y-4 text-left">
              <div className="flex items-center gap-2 text-primary text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em]">
                 <Sparkles className="size-3 lg:size-4" />
                 <span>Sarah Analysis Engine Ready</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight leading-tight">Practice Session</h1>
              <p className="text-text-secondary text-xs lg:text-lg font-medium leading-relaxed opacity-80">
                 Paste the job description, specific questions you want Sarah to ask, or simply describe the role. Sarah will parse and adapt instantly.
              </p>
           </div>

           <div className="relative group">
              <div className="absolute top-4 lg:top-6 left-4 lg:left-6 flex items-center gap-2 text-text-secondary pointer-events-none group-focus-within:text-primary transition-colors">
                 <Brain className="size-3 lg:size-4" />
                 <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Context & Questions</span>
              </div>
              <textarea 
                className="w-full h-[300px] sm:h-[350px] lg:h-[450px] rounded-[24px] lg:rounded-[32px] bg-[#1c212b] border border-white/5 focus:border-primary focus:ring-1 focus:ring-primary text-white p-5 lg:p-8 pt-14 lg:pt-16 text-xs lg:text-base placeholder:text-text-secondary/20 resize-none transition-all shadow-2xl custom-scrollbar"
                placeholder="Example: Senior React Developer role at Google. Please ask me about my experience with micro-frontends and why I prefer Redux over Context."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
              <div className="absolute bottom-4 lg:bottom-6 right-6 lg:right-8 flex items-center gap-2 text-[9px] lg:text-[10px] font-bold text-text-secondary/30 pointer-events-none uppercase tracking-widest">
                 {context.length} characters
              </div>
           </div>
        </div>

        <div className="lg:col-span-4">
           <div className="bg-[#1c212b] rounded-[32px] border border-white/5 p-6 lg:p-8 flex flex-col gap-8 shadow-2xl sticky top-4">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                 <Sliders className="size-5 text-primary" />
                 <h2 className="text-white text-base lg:text-lg font-bold">Calibration</h2>
              </div>

              {/* Language Selector */}
              <div className="space-y-4">
                 <label className="text-text-secondary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Globe className="size-3 lg:size-4" />
                    Interview Language
                 </label>
                 <div className="relative group text-left">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#0f111a] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary transition-all appearance-none outline-none cursor-pointer"
                    >
                       {LANGUAGES.map(lang => (
                         <option key={lang.code} value={lang.name}>{lang.name}</option>
                       ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary size-4 pointer-events-none" />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-text-secondary text-[10px] font-black uppercase tracking-widest">Experience Level</label>
                 <div className="grid grid-cols-2 gap-2">
                    {['Junior', 'Mid', 'Senior', 'Lead'].map(level => (
                      <button 
                        key={level} 
                        onClick={() => setExperienceLevel(level)}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all ${experienceLevel === level ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-[#0f111a] text-text-secondary border-white/5 hover:text-white'}`}
                      >
                        {level}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-text-secondary text-[10px] font-black uppercase tracking-widest">Session Duration</label>
                    <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase ${!isProOrElite && duration > 10 ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'}`}>
                       {duration} MIN
                    </span>
                 </div>
                 <div className="relative pt-2">
                   <input 
                    type="range" 
                    className="w-full h-1.5 bg-[#0f111a] rounded-full appearance-none cursor-pointer accent-primary" 
                    min="5" max={maxDuration} step="5" 
                    value={duration} 
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                   />
                   {!isProOrElite && (
                     <div className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
                           <Lock className="size-3" />
                           Basic Tier Limit
                        </div>
                        <p className="text-text-secondary text-[10px] leading-relaxed">Upgrade for 45-60 min deep sessions.</p>
                        <button 
                          onClick={() => onNavigate(Screen.Subscription)}
                          className="w-full py-2 bg-orange-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors"
                        >
                          View Pricing
                        </button>
                     </div>
                   )}
                 </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleGenerate}
                  disabled={!context.trim() || isGenerating}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${!context.trim() || isGenerating ? 'bg-[#1c212b] text-text-secondary opacity-50 cursor-not-allowed' : 'bg-primary text-white shadow-2xl shadow-primary/30 hover:translate-y-[-2px] active:scale-[0.98]'}`}
                >
                  {isGenerating ? <Loader2 className="size-5 animate-spin" /> : <Zap className="size-5" />}
                  {isGenerating ? 'Analyzing...' : 'Start Session'}
                </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default JDSetupScreen;
