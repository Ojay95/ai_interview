
import React, { useEffect, useState } from 'react';
import { 
  Download, 
  RefreshCcw, 
  CheckCircle, 
  ArrowUp, 
  Eye, 
  Rocket, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { Screen, User, VisualMetrics } from '../types';
import { GoogleGenAI } from '@google/genai';
import { cleanJsonString } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import { Logo } from '../constants';

interface DetailedCritique {
  question: string;
  userTranscript: string;
  answerStatus: 'Strong Answer' | 'Average Answer' | 'Weak' | 'Lacks Detail';
  statusColor: string;
  critique: string;
  improvedAnswer: string;
}

interface AnalysisData {
  overallScore: number;
  performanceTag: string;
  summary: string;
  keyStrengths: string[];
  growthAreas: string[];
  detailedAnalysis: DetailedCritique[];
  scoreBreakdown: { label: string; value: number }[];
  visualMetrics: VisualMetrics;
}

interface AnalysisScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ user, onNavigate }) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    const rawTranscript = localStorage.getItem('last_interview_transcript');
    const savedRole = localStorage.getItem('last_interview_role') || 'Junior Frontend Developer';
    setRole(savedRole);
    if (rawTranscript) {
      generateAnalysis(JSON.parse(rawTranscript), savedRole);
    } else {
      setIsLoading(false);
    }
  }, []);

  const generateAnalysis = async (transcript: any[], targetRole: string) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || (window as any).GEMINI_API_KEY;
      if (!apiKey) throw new Error("An API Key must be set when running in a browser");
      const ai = new GoogleGenAI({ apiKey });
      const chatHistory = transcript.map(m => `${m.sender}: ${m.text}`).join('\n');
      
      const prompt = `Act as an expert interview coach. Analyze the PROVIDED transcript for a ${targetRole} role.
      Analyze ONLY the questions and answers that appear in the transcript.
      Return JSON exactly in this format:
      {
        "overallScore": number (0-100),
        "performanceTag": "Excellent" | "Professional" | "Needs Improvement",
        "summary": "string",
        "keyStrengths": ["string"],
        "growthAreas": ["string"],
        "scoreBreakdown": [
           {"label": "Technical Knowledge", "value": number},
           {"label": "Cultural Fit", "value": number},
           {"label": "Problem Solving", "value": number},
           {"label": "Communication Skills", "value": number},
           {"label": "Confidence & Clarity", "value": number}
        ],
        "visualMetrics": {
           "eyeContactScore": number,
           "postureScore": number,
           "energyLevel": "High",
           "visualFeedback": "string"
        },
        "detailedAnalysis": [
          {
            "question": "string",
            "userTranscript": "string",
            "answerStatus": "Strong Answer",
            "statusColor": "green",
            "critique": "string",
            "improvedAnswer": "string"
          }
        ]
      }

      TRANSCRIPT:
      ---
      ${chatHistory}
      ---`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json', temperature: 0.1 }
      });

      const data = JSON.parse(cleanJsonString(response.text));
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!analysis) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Interview Analysis: ${role}`, 20, 20);
    doc.text(`Score: ${analysis.overallScore}/100`, 20, 35);
    doc.save(`Analysis_${role.replace(/\s+/g, '_')}.pdf`);
  };

  if (isLoading) return (
    <div className="h-screen w-full bg-[#0f111a] flex flex-col items-center justify-center text-white">
       <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
       <p className="text-sm font-black uppercase tracking-widest animate-pulse">Analyzing Performance...</p>
    </div>
  );

  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-[#0f111a] text-white font-display pb-20 overflow-x-hidden">
      <nav className="flex items-center justify-between px-4 lg:px-12 py-3 lg:py-4 bg-[#111521] border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-2 lg:gap-3">
          <Logo className="size-7 lg:size-8" />
          <span className="text-sm lg:text-lg font-bold">AI Mock Interviewer</span>
        </div>
        <div className="flex items-center gap-4 lg:gap-8 text-[10px] lg:text-sm font-bold text-text-secondary">
          <button onClick={() => onNavigate(Screen.Dashboard)} className="hover:text-white">Dashboard</button>
          <button onClick={() => onNavigate(Screen.JDSetup)} className="hidden sm:block hover:text-white">Practice</button>
          <div className="size-8 lg:size-9 rounded-full bg-slate-700 overflow-hidden">
            <img src={`https://i.pravatar.cc/150?u=${user?.id}`} alt="User" />
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 mt-6 lg:mt-10 space-y-8 lg:space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-xl md:text-3xl font-black tracking-tight">Interview Analysis: {role}</h1>
            <p className="text-text-secondary text-[9px] lg:text-xs uppercase font-bold tracking-widest opacity-60">Session ID: #8392 • Completed Just Now</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownloadReport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] lg:text-xs font-bold">
              <Download className="size-4" /> Save Report
            </button>
            <button onClick={() => onNavigate(Screen.JDSetup)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl bg-primary text-white text-[10px] lg:text-xs font-bold">
              <RefreshCcw className="size-4" /> Retry Interview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#1c212b] rounded-2xl border border-white/5 p-6 lg:p-8 flex flex-col items-center text-center shadow-xl">
               <h3 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-6 lg:mb-8 opacity-60">Overall Performance</h3>
               <div className="relative size-36 lg:size-44 flex items-center justify-center mb-6 lg:mb-8">
                  <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="45" fill="none" stroke="#0d111a" strokeWidth="8" />
                     <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" 
                        strokeDasharray="283" strokeDashoffset={283 - (283 * (analysis?.overallScore || 0)) / 100} 
                        strokeLinecap="round" 
                     />
                     <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                           <stop offset="0%" stopColor="#f59e0b" />
                           <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                     </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-4xl lg:text-5xl font-black tabular-nums">{analysis?.overallScore}</span>
                     <span className="text-xs lg:text-sm font-bold text-text-secondary opacity-40">/ 100</span>
                  </div>
               </div>
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] lg:text-xs font-bold mb-4 lg:mb-6">
                  {analysis?.performanceTag}
               </div>
               <p className="text-[10px] lg:text-xs text-text-secondary leading-relaxed max-w-xs font-medium italic">"{analysis?.summary}"</p>
            </div>

            <div className="bg-[#1c212b] rounded-2xl border border-white/5 p-6 lg:p-8 shadow-xl">
               <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6 lg:mb-8">Score Breakdown</h3>
               <div className="space-y-4 lg:space-y-6">
                  {analysis?.scoreBreakdown.map((s, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                          <span className="text-text-secondary">{s.label}</span>
                          <span className="text-amber-500">{s.value}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${s.value}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
            <div className="bg-[#1c212b] rounded-2xl border border-white/5 p-6 lg:p-8 shadow-xl">
               <h3 className="text-xs font-black uppercase tracking-widest mb-4 lg:mb-6">Key Strengths</h3>
               <ul className="space-y-4 lg:space-y-6">
                  {analysis?.keyStrengths.map((s, i) => (
                    <li key={i} className="flex gap-3 lg:gap-4 items-start">
                       <CheckCircle className="size-4 text-green-500 mt-0.5" />
                       <p className="text-[10px] lg:text-xs text-text-secondary font-medium leading-relaxed">{s}</p>
                    </li>
                  ))}
               </ul>
            </div>
            <div className="bg-[#1c212b] rounded-2xl border border-white/5 p-6 lg:p-8 shadow-xl">
               <h3 className="text-xs font-black uppercase tracking-widest mb-4 lg:mb-6">Areas for Improvement</h3>
               <ul className="space-y-4 lg:space-y-6">
                  {analysis?.growthAreas.map((s, i) => (
                    <li key={i} className="flex gap-3 lg:gap-4 items-start">
                       <ArrowUp className="size-4 text-amber-500 mt-0.5" />
                       <p className="text-[10px] lg:text-xs text-text-secondary font-medium leading-relaxed">{s}</p>
                    </li>
                  ))}
               </ul>
            </div>
            <div className="md:col-span-2 bg-[#1c212b] rounded-2xl border border-white/5 p-6 lg:p-8 shadow-xl flex flex-col md:flex-row gap-6 lg:gap-8 items-center">
               <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                  <div className="size-10 lg:size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <Eye className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-sm font-black uppercase tracking-widest">Visual Presence</h3>
                    <p className="text-[9px] lg:text-[10px] text-text-secondary font-bold uppercase mt-1">Eye Contact & Posture</p>
                  </div>
               </div>
               <div className="h-px md:h-12 w-full md:w-px bg-white/10"></div>
               <div className="flex-1 grid grid-cols-3 gap-4 lg:gap-6 w-full text-center">
                  <div>
                     <div className="text-lg lg:text-xl font-black">{analysis.visualMetrics.eyeContactScore}%</div>
                     <div className="text-[8px] lg:text-[9px] font-black text-text-secondary uppercase">Eye Contact</div>
                  </div>
                  <div>
                     <div className="text-lg lg:text-xl font-black">{analysis.visualMetrics.postureScore}%</div>
                     <div className="text-[8px] lg:text-[9px] font-black text-text-secondary uppercase">Posture</div>
                  </div>
                  <div>
                     <div className="text-lg lg:text-xl font-black text-primary">{analysis.visualMetrics.energyLevel}</div>
                     <div className="text-[8px] lg:text-[9px] font-black text-text-secondary uppercase">Energy</div>
                  </div>
               </div>
               <p className="text-[9px] lg:text-[10px] text-text-secondary italic leading-relaxed md:max-w-xs">{analysis.visualMetrics.visualFeedback}</p>
            </div>
          </div>
        </div>

        {/* Find Jobs Prompt */}
        <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-[24px] lg:rounded-[40px] p-8 lg:p-16 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Rocket className="size-80" />
           </div>
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="space-y-6 text-center lg:text-left">
                 <h3 className="text-3xl lg:text-5xl font-black tracking-tight">Great job on the interview!</h3>
                 <p className="text-white/80 text-sm lg:text-xl font-medium max-w-2xl leading-relaxed">
                    You've practiced and analyzed your performance. You're ready for the real thing. Let's find some active job openings for <strong>{role}</strong> roles.
                 </p>
              </div>
              <button 
                 onClick={() => onNavigate(Screen.JobBoard)}
                 className="w-full lg:w-auto px-12 py-6 bg-white text-primary font-black rounded-2xl text-xs lg:text-base uppercase tracking-widest hover:bg-opacity-90 transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4"
              >
                 Find Recommended Jobs
                 <ArrowRight className="size-5" />
              </button>
           </div>
        </div>

        <div className="pt-6 lg:pt-10 border-t border-white/5">
           <h2 className="text-xl lg:text-2xl font-black tracking-tight mb-6 lg:mb-8">Detailed Question Analysis</h2>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {analysis?.detailedAnalysis.map((qa, i) => (
                <div key={i} className="bg-[#1c212b] rounded-[24px] lg:rounded-[32px] border border-white/5 overflow-hidden shadow-2xl flex flex-col">
                   <div className="px-6 lg:px-8 py-4 lg:py-5 bg-black/20 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 lg:gap-4">
                         <div className="size-8 lg:size-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-[9px] lg:text-[10px] font-black text-text-secondary shrink-0">Q{i+1}</div>
                         <h3 className="text-xs lg:text-sm font-bold truncate">"{qa.question}"</h3>
                      </div>
                      <div className={`self-start sm:self-auto px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[9px] font-black uppercase tracking-widest border border-white/5 flex items-center gap-2 whitespace-nowrap`}>
                         <span className={`size-1 lg:size-1.5 rounded-full ${qa.statusColor === 'green' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                         {qa.answerStatus}
                      </div>
                   </div>

                   <div className="p-6 lg:p-8 space-y-6 lg:space-y-8 flex-1">
                      <div className="space-y-3 lg:space-y-4">
                        <h4 className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Your Transcript</h4>
                        <div className="border-l-[2px] lg:border-l-[3px] border-primary pl-4 lg:pl-6 py-1">
                           <p className="text-[11px] lg:text-sm text-gray-300 leading-relaxed italic">"{qa.userTranscript}"</p>
                        </div>
                      </div>

                      <div className="bg-[#1e2536] rounded-[20px] lg:rounded-[24px] p-5 lg:p-6 space-y-3 lg:space-y-4 border border-primary/10 relative overflow-hidden flex-1">
                        <div className="flex items-center gap-3">
                           <div className="size-7 lg:size-8 rounded-lg bg-primary flex flex-none items-center justify-center text-white shadow-lg shadow-primary/20">
                              <Sparkles className="size-4" />
                           </div>
                           <h4 className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest">AI Coach Suggestion</h4>
                        </div>
                        <div className="space-y-3 lg:space-y-4">
                           <p className="text-[11px] lg:text-xs text-gray-300 leading-relaxed"><strong className="text-primary uppercase text-[9px] lg:text-[10px] tracking-wider mr-2">Critique:</strong> {qa.critique}</p>
                           <div className="bg-[#161b22] border border-white/5 rounded-xl lg:rounded-2xl p-4 lg:p-5 mt-3 lg:mt-4">
                              <p className="text-[10px] lg:text-xs text-gray-400 leading-relaxed italic">"{qa.improvedAnswer}"</p>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisScreen;
