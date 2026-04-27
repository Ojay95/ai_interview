
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bot, 
  User as UserIcon, 
  SendHorizonal, 
  ListChecks, 
  Check 
} from 'lucide-react';
import { Screen, User, InterviewConfig } from '../types';
import { Logo } from '../constants';
import { GoogleGenAI, Type } from '@google/genai';

interface OnboardingScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ user, onNavigate }) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: `Hi ${user?.name}! I'm Sarah, your AI interview coach. To get started, what role are you preparing for and in what language would you like to conduct the interview?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(15);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleStartInterview = async () => {
    setIsFinalizing(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || (window as any).GEMINI_API_KEY;
      if (!apiKey) throw new Error("An API Key must be set when running in a browser");
      const ai = new GoogleGenAI({ apiKey });
      const result = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: [{
          role: 'user',
          parts: [{ text: `Based on this interview setup conversation, extract the interview configuration in JSON format.
          Conversation: ${JSON.stringify(messages)}` }]
        }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              experienceLevel: { type: Type.STRING },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              duration: { type: Type.NUMBER },
              language: { type: Type.STRING, description: "The language the interview should be conducted in (default: English)" }
            },
            required: ['role', 'experienceLevel', 'techStack', 'focusAreas', 'duration', 'language']
          }
        }
      });
      
      const configData = JSON.parse(result.text || '{}');
      const isElite = user?.plan === 'elite';
      const isPro = user?.plan === 'pro';
      
      let finalDuration = configData.duration || 15;
      if (isElite) finalDuration = Math.min(60, finalDuration);
      else if (isPro) finalDuration = Math.min(45, finalDuration);
      else finalDuration = Math.min(10, finalDuration);

      const config: InterviewConfig = {
        ...configData,
        duration: finalDuration,
        language: configData.language || 'English',
        customQuestions: ''
      };

      localStorage.setItem('pending_interview_config', JSON.stringify(config));
      
      const today = new Date().toDateString();
      const usage = JSON.parse(localStorage.getItem(`usage_${user?.id}`) || '{"count": 0, "date": ""}');
      usage.count = (usage.date === today) ? usage.count + 1 : 1;
      usage.date = today;
      localStorage.setItem(`usage_${user?.id}`, JSON.stringify(usage));

      onNavigate(Screen.Interview);
    } catch (err: any) {
      console.error("Failed to finalize config:", err);
      const fallback: InterviewConfig = {
        role: messages.find(m => m.sender === 'user')?.text || 'Professional Role',
        experienceLevel: 'Senior',
        techStack: ['General Skills'],
        focusAreas: ['Core Competencies'],
        duration: user?.plan === 'elite' ? 60 : user?.plan === 'pro' ? 45 : 10,
        language: 'English',
        customQuestions: ''
      };
      localStorage.setItem('pending_interview_config', JSON.stringify(fallback));
      onNavigate(Screen.Interview);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    const newMessages = [...messages, { sender: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || (window as any).GEMINI_API_KEY;
      if (!apiKey) throw new Error("An API Key must be set when running in a browser");
      const ai = new GoogleGenAI({ apiKey });
      const contents = newMessages.map(m => ({
        role: m.sender === 'ai' ? 'model' as const : 'user' as const,
        parts: [{ text: m.text }]
      }));

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: `You are Sarah, a helpful AI Interview Coach. Help ${user?.name} set up an interview.
          COLLECT: 1. Role, 2. Experience Level, 3. Skills/Focus, 4. Duration, 5. Language.
          PLAN LIMITS: ${user?.plan === 'elite' ? '60' : user?.plan === 'pro' ? '45' : '10'} minutes max.
          IMPORTANT: Respond in the language the user is using if they switch to Spanish, French, etc., or confirm their chosen language.
          Once all details are known, end with "Ready to start?" to trigger the button.`
        }
      });

      const aiResponse = result.text || "I'm sorry, I didn't quite catch that.";
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);

      const lowerResp = aiResponse.toLowerCase();
      if (lowerResp.includes("ready to start") || lowerResp.includes("ready?")) {
        setProgress(100);
      } else {
        setProgress(prev => Math.min(90, prev + 15));
      }

    } catch (err: any) {
      console.error("Gemini Error:", err);
      setMessages(prev => [...prev, { sender: 'ai', text: "I'm having a little trouble connecting. Could you repeat that?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d111a] text-white overflow-hidden font-display">
      <header className="flex items-center justify-between px-6 lg:px-10 py-4 bg-[#161b22] border-b border-white/5 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Logo className="size-8" />
          <div>
            <h2 className="text-base font-bold leading-none">Interview Setup</h2>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Persona: Sarah</p>
          </div>
        </div>
        <button onClick={() => onNavigate(Screen.Dashboard)} className="size-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-all">
           <X className="size-5" />
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 lg:p-8 gap-6 overflow-hidden">
        <section className="flex-1 flex flex-col bg-[#1c212b] rounded-3xl border border-white/5 shadow-2xl overflow-hidden min-h-0 relative">
           <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 scroll-smooth" ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} className={`flex items-start gap-3 md:gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                   <div className={`size-8 md:size-10 rounded-2xl flex items-center justify-center shrink-0 ${m.sender === 'ai' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                      {m.sender === 'ai' ? <Bot className="size-5 md:size-6" /> : <UserIcon className="size-5 md:size-6" />}
                   </div>
                   <div className={`flex flex-col gap-1.5 max-w-[85%] ${m.sender === 'user' ? 'items-end' : ''}`}>
                      <div className={`p-4 md:p-5 rounded-2xl shadow-sm text-sm lg:text-base leading-relaxed whitespace-pre-wrap ${m.sender === 'ai' ? 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none' : 'bg-primary text-white rounded-tr-none'}`}>
                         {m.text}
                      </div>
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">{m.sender === 'ai' ? 'Sarah' : 'You'}</span>
                   </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-4 animate-in fade-in duration-200">
                   <div className="size-10 rounded-2xl bg-primary/20 text-primary border border-primary/20 flex items-center justify-center">
                      <Bot className="size-6" />
                   </div>
                   <div className="flex items-center gap-1.5 bg-white/5 p-4 rounded-2xl rounded-tl-none w-20 justify-center">
                      <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
                      <div className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                   </div>
                </div>
              )}
           </div>

           <div className="p-4 md:p-6 bg-black/20 border-t border-white/5">
              <div className="relative flex items-center gap-3 md:gap-4 max-w-4xl mx-auto">
                 <input 
                  ref={inputRef}
                  className="flex-1 h-12 md:h-14 rounded-2xl bg-[#0d111a] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary text-white pl-4 md:pl-6 text-sm md:text-base outline-none transition-all placeholder:text-text-secondary/50" 
                  placeholder="Type your answer..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 />
                 <button onClick={handleSend} disabled={!input.trim() || isTyping} className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30 hover:bg-primary-hover disabled:opacity-50 transition-all active:scale-95">
                    <SendHorizonal className="size-5 md:size-6" />
                 </button>
              </div>
           </div>
        </section>

        <aside className="lg:w-[350px] flex flex-col gap-4 md:gap-6 shrink-0 lg:h-full overflow-y-auto">
           <div className="bg-[#1c212b] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h4 className="text-white font-bold text-base">Progress</h4>
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Calibration</p>
                 </div>
                 <div className="text-xl md:text-2xl font-black text-primary tabular-nums">{progress}%</div>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                 <div className="h-full bg-primary rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
           </div>

           <div className="flex-1 bg-[#1c212b] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl flex flex-col">
              <h4 className="text-white font-bold text-sm mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
                 <ListChecks className="size-5 text-primary" />
                 Checklist
              </h4>
              <div className="space-y-6 flex-1">
                 {[
                   { label: 'Role & Language', done: progress >= 25 },
                   { label: 'Experience Level', done: progress >= 50 },
                   { label: 'Focus Areas', done: progress >= 75 },
                   { label: 'Calibration Complete', done: progress >= 100 },
                 ].map((step, i) => (
                   <div key={i} className="flex gap-4">
                      <div className={`size-8 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${step.done ? 'bg-primary/20 text-primary border-primary/20' : 'bg-black/20 text-text-secondary border-white/5'}`}>
                        {step.done ? <Check className="size-4" /> : i + 1}
                      </div>
                      <div className="pt-0.5 text-left">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${step.done ? 'text-primary' : 'text-text-secondary'}`}>{step.label}</p>
                        <p className={`text-xs font-medium mt-0.5 ${step.done ? 'text-white' : 'text-text-secondary/40'}`}>{step.done ? 'Confirmed' : 'Pending'}</p>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="pt-8 mt-auto">
                <button 
                  onClick={handleStartInterview}
                  disabled={progress < 100 || isFinalizing} 
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${progress === 100 ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary-hover active:scale-95' : 'bg-black/20 text-text-secondary border border-white/5 opacity-50 cursor-not-allowed'}`}
                >
                  {isFinalizing ? 'Initializing Session...' : progress === 100 ? 'Start Mock Interview' : 'Answer Sarah to Start'}
                </button>
              </div>
           </div>
        </aside>
      </main>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3c4253; border-radius: 10px; }`}</style>
    </div>
  );
};

export default OnboardingScreen;
