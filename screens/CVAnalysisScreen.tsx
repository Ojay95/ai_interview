
import React, { useState, useEffect, useRef } from 'react';
import { 
  Loader2, 
  Download, 
  UploadCloud, 
  Edit3, 
  Paperclip, 
  FileText, 
  CheckCircle2, 
  Zap, 
  Brain, 
  Mic, 
  TrendingUp, 
  CheckSquare, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Check, 
  SearchCode, 
  ExternalLink, 
  Rocket, 
  Copy, 
  Briefcase, 
  ArrowRight 
} from 'lucide-react';
import { User, Screen } from '../types';
import { Logo } from '../constants';
import { analyzeResumeMatch } from '../services/geminiService';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

interface CVAnalysisScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

const CVAnalysisScreen: React.FC<CVAnalysisScreenProps> = ({ user, onNavigate }) => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [jd, setJd] = useState(''); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text = localStorage.getItem('pending_resume_text');
    const name = localStorage.getItem('pending_resume_name');
    
    if (!text) {
      onNavigate(Screen.CVLanding); 
    } else {
      setResumeText(text);
      setFileName(name || 'Uploaded Resume');
    }
  }, [onNavigate]);

  const handleAnalyze = async () => {
    if (!jd.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeMatch(resumeText, jd);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    
    setIsDownloading(true);
    const toastId = toast.loading('Generating report image...');
    
    try {
      // Ensure all fonts are loaded before capturing
      if (document.fonts) {
        await document.fonts.ready;
      }
      
      // Small delay to ensure any animations are settled
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const node = reportRef.current;
      const width = 1400;
      
      // html2canvas is often more reliable for fonts/icons
      const canvas = await html2canvas(node, {
        useCORS: true,
        backgroundColor: '#0d111a',
        width: width,
        windowWidth: width,
        scale: 2, // High quality
        logging: false,
        onclone: (clonedDoc) => {
          const clonedNode = clonedDoc.querySelector('[data-report-container]') as HTMLElement;
          if (clonedNode) {
            clonedNode.style.width = '1400px';
            clonedNode.style.maxWidth = '1400px';
            clonedNode.style.padding = '60px';
            clonedNode.style.margin = '0';
            clonedNode.style.backgroundColor = '#0d111a';
          }
        }
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      saveAs(dataUrl, `CV-Analysis-Report-${fileName.split('.')[0]}.png`);
      toast.success('Report downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('Failed to download report:', err);
      toast.error('Failed to generate report image.', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const currentStats = analysisResult ? [
    { label: 'MATCH SCORE', value: `${analysisResult.matchScore}%`, sub: analysisResult.verdict, icon: TrendingUp, color: 'text-primary' },
    { label: 'KEYWORDS MATCHED', value: analysisResult.matchedKeywords?.length || 0, sub: 'Identified skills', icon: CheckSquare, color: 'text-green-500' },
    { label: 'MISSING SKILLS', value: analysisResult.missingKeywords?.length || 0, sub: 'Gap Analysis', icon: AlertTriangle, color: 'text-orange-500' }
  ] : [
    { label: 'MATCH SCORE', value: '--', sub: 'Paste JD to start', icon: TrendingUp, color: 'text-primary' },
    { label: 'KEYWORDS MATCHED', value: '0', sub: 'Ready to scan', icon: CheckSquare, color: 'text-green-500' },
    { label: 'CRITICAL MISSING', value: '0', sub: 'Ready to scan', icon: AlertTriangle, color: 'text-orange-500' }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0d111a] text-white font-display overflow-hidden">
      <header className="flex items-center justify-between px-4 lg:px-10 py-3 border-b border-white/5 bg-[#0d111a]/80 backdrop-blur-md shrink-0 z-50">
        <div className="flex items-center gap-2 md:gap-4" onClick={() => onNavigate(Screen.Dashboard)}>
          <Logo className="size-6 md:size-8" />
          <h1 className="hidden xs:block text-xs md:text-lg font-bold tracking-tight cursor-pointer">MockInterview.ai</h1>
        </div>
        <nav className="flex items-center gap-3 md:gap-8 text-[8px] md:text-xs font-black uppercase tracking-widest text-text-secondary">
          <button onClick={() => onNavigate(Screen.Dashboard)} className="hover:text-white transition-all">Dashboard</button>
          <button className="text-white border-b-2 border-primary pb-1">CV Analysis</button>
          <button className="hidden sm:block hover:text-white transition-all">Tracker</button>
        </nav>
        <div className="size-7 md:size-8 rounded-full border border-white/10 overflow-hidden bg-slate-700">
           <img src={`https://i.pravatar.cc/150?u=${user?.id || 'default'}`} alt="User" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar space-y-6 md:space-y-10">
        <div ref={reportRef} data-report-container className="max-w-[1400px] mx-auto space-y-6 md:space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 lg:gap-6">
            <div className="space-y-1 lg:space-y-2">
               <h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">Job Match Analysis</h2>
               <p className="text-text-secondary text-[10px] md:text-base font-medium">Compare your CV against target descriptions.</p>
            </div>
            <div className="flex items-center gap-2 lg:gap-3 w-full md:w-auto">
               {analysisResult && (
                 <button 
                   onClick={handleDownloadReport} 
                   disabled={isDownloading}
                   className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 text-[8px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors disabled:opacity-50"
                 >
                    {isDownloading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )}
                    <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download Report'}</span>
                    <span className="sm:hidden">{isDownloading ? '...' : 'PNG'}</span>
                 </button>
               )}
               <button onClick={() => onNavigate(Screen.CVLanding)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 text-[8px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                  <UploadCloud className="size-4" /> <span className="hidden sm:inline">Update Resume</span><span className="sm:hidden">Update</span>
               </button>
               <button onClick={() => onNavigate(Screen.CVEditor)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-xl bg-primary text-white text-[8px] lg:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-hover transition-colors">
                  <Edit3 className="size-4" /> <span className="hidden sm:inline">Edit Resume</span><span className="sm:hidden">Edit</span>
               </button>
            </div>
          </div>

          <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 md:gap-8 items-start">
             
             {/* LEFT COLUMN: Input & Interview Prep */}
             <div className="w-full xl:col-span-4 space-y-6">
               {/* JD Input Card */}
               <div className="bg-[#1c212b] rounded-[24px] md:rounded-[32px] border border-white/5 p-5 md:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">
                     <Paperclip className="size-4" /> Current Resume
                  </div>
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between overflow-hidden group hover:border-primary/30 transition-colors">
                     <div className="flex items-center gap-3 min-w-0">
                        <FileText className="size-4 text-primary shrink-0" />
                        <div className="min-w-0">
                            <span className="text-[10px] md:text-xs font-bold truncate block">{fileName}</span>
                            <span className="text-[9px] text-gray-500 truncate block">Ready for analysis</span>
                        </div>
                     </div>
                     <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                  </div>

                  <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60 pt-2">
                     <FileText className="size-4" /> Target Job Description
                  </div>
                  <textarea 
                    className="w-full h-[180px] md:h-[300px] bg-black/40 border border-white/5 rounded-xl md:rounded-2xl p-4 text-xs md:text-sm text-text-secondary focus:border-primary focus:ring-0 resize-none transition-all placeholder:text-gray-700"
                    placeholder="Paste the requirements of the job you want here..."
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={!jd.trim() || isAnalyzing}
                    className="w-full py-4 rounded-xl md:rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] md:text-[11px] shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:bg-primary-hover transition-all"
                  >
                     {isAnalyzing ? <Loader2 className="size-5 animate-spin" /> : <Zap className="size-5" />}
                     {isAnalyzing ? 'Analyzing Alignment...' : 'Analyze Match'}
                  </button>
               </div>

               {/* Interview Prep Guide (Moved Here) */}
               {analysisResult && (
                  <div className="bg-[#1c212b] rounded-[24px] md:rounded-[32px] border border-white/5 p-6 md:p-8 space-y-6 shadow-xl animate-in fade-in slide-in-from-left-4 duration-500">
                     <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                           <Brain className="size-6" />
                        </div>
                        <div>
                           <h4 className="text-sm md:text-base font-bold">Interview Prep Guide</h4>
                           <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest mt-0.5">Focus Topics</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        {analysisResult.practiceAreas?.map((area: string, i: number) => (
                           <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-black/20 border border-white/5 group hover:border-orange-500/30 transition-all">
                              <div className="size-6 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                              <p className="text-xs md:text-sm font-medium text-gray-300 leading-snug">{area}</p>
                           </div>
                        ))}
                     </div>
                     <button 
                        onClick={() => onNavigate(Screen.JDSetup)}
                        className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                     >
                        <Mic className="size-4" /> Start Mock Interview
                     </button>
                  </div>
               )}
             </div>

             {/* RIGHT COLUMN: Results & Optimization */}
             <div className="w-full xl:col-span-8 space-y-6 md:space-y-8">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                   {currentStats.map((s, i) => (
                      <div key={i} className="bg-[#1c212b] p-5 md:p-6 rounded-2xl md:rounded-[28px] border border-white/5 shadow-xl space-y-3 md:space-y-4">
                         <div className="flex items-center justify-between">
                            <div className={`size-8 md:size-10 rounded-lg bg-white/5 ${s.color} flex items-center justify-center`}>
                               <s.icon className="size-5 md:size-6" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-40">{s.label}</span>
                         </div>
                         <div>
                            <div className="text-xl md:text-2xl font-black">{s.value}</div>
                            <div className={`text-[9px] md:text-[10px] font-bold mt-1 ${s.color}`}>{s.sub}</div>
                         </div>
                      </div>
                   ))}
                </div>

                {analysisResult ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 md:space-y-8">
                      
                      {/* Strategic Verdict Card */}
                      <div className="bg-gradient-to-br from-[#1c212b] to-[#12151c] rounded-[24px] md:rounded-[32px] border border-primary/20 p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck className="size-32" />
                         </div>
                         <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                            <div className="relative size-24 md:size-40 shrink-0">
                               <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="45" fill="none" stroke="#0d111a" strokeWidth="8" />
                                  <circle 
                                     cx="50" cy="50" r="45" fill="none" stroke="#194ce6" strokeWidth="8" 
                                     strokeDasharray="283" 
                                     strokeDashoffset={283 - (283 * (analysisResult.matchScore || 0)) / 100} 
                                     strokeLinecap="round" 
                                     className="transition-all duration-1000 ease-out"
                                  />
                               </svg>
                               <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-lg md:text-3xl font-black">{analysisResult.matchScore}%</span>
                                  <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">Match</span>
                               </div>
                            </div>
                            <div className="space-y-3 md:space-y-4 text-center md:text-left">
                               <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                                  <h3 className="text-lg md:text-3xl font-black">Should you apply?</h3>
                                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-primary/30 w-fit mx-auto md:mx-0">
                                     {analysisResult.verdict}
                                  </span>
                               </div>
                               <p className="text-base md:text-xl font-medium text-white/90 leading-relaxed italic">
                                  "{analysisResult.shouldApply}"
                               </p>
                               <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-2xl">
                                  {analysisResult.overallFeedback}
                               </p>
                            </div>
                         </div>
                      </div>

                      {/* AI Resume Summary Card */}
                      {analysisResult.resumeSummary && (
                        <div className="bg-[#1c212b] rounded-[24px] md:rounded-[32px] border border-white/5 p-6 md:p-8 space-y-4 shadow-xl">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary flex items-center gap-2">
                            <Sparkles className="size-4 text-primary" /> AI Resume Summary
                          </h4>
                          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                            {analysisResult.resumeSummary}
                          </p>
                        </div>
                      )}

                      {/* Skill Gap vs Strengths (Side-by-Side below verdict) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-[#1c212b] rounded-[24px] md:rounded-[32px] border border-white/5 p-6 md:p-8 space-y-6 shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary flex items-center gap-2">
                               <AlertTriangle className="size-4 text-orange-500" /> Skill Gap Analysis
                            </h4>
                            <div className="flex flex-wrap gap-2">
                               {analysisResult.missingKeywords?.map((k: string, i: number) => (
                                  <div key={i} className="px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group hover:bg-orange-500/20 transition-all cursor-default">
                                     {k} <Plus className="size-3" />
                                  </div>
                               ))}
                               {(!analysisResult.missingKeywords || analysisResult.missingKeywords.length === 0) && (
                                 <p className="text-xs text-text-secondary italic">No critical gaps identified.</p>
                               )}
                            </div>
                         </div>

                         <div className="bg-[#1c212b] rounded-[24px] md:rounded-[32px] border border-white/5 p-6 md:p-8 space-y-6 shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary flex items-center gap-2">
                               <CheckCircle2 className="size-4 text-green-500" /> Matched Strengths
                            </h4>
                            <div className="flex flex-wrap gap-2">
                               {analysisResult.matchedKeywords?.map((k: string, i: number) => (
                                  <div key={i} className="px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-default">
                                     {k} <Check className="size-3" />
                                  </div>
                               ))}
                               {(!analysisResult.matchedKeywords || analysisResult.matchedKeywords.length === 0) && (
                                 <p className="text-xs text-text-secondary italic">No matches found yet.</p>
                               )}
                            </div>
                         </div>
                      </div>

                      </div>
                  ) : !isAnalyzing && (
                    <div className="h-[400px] md:h-[500px] flex flex-col items-center justify-center text-center p-8 md:p-12 bg-[#1c212b] rounded-[24px] md:rounded-[32px] border border-white/5 border-dashed">
                       <div className="size-16 md:size-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                          <SearchCode className="size-16 md:size-20 text-text-secondary opacity-20" />
                       </div>
                       <h3 className="text-lg md:text-xl font-bold mb-2">Ready to scan</h3>
                       <p className="text-xs md:text-sm text-text-secondary max-w-sm">Paste a job description to see alignment and get an interview roadmap.</p>
                    </div>
                  )}
               </div>
            </div>

          {/* AI Resume Optimization - Full Width Section */}
          {analysisResult && (
            <div className="space-y-6 md:space-y-8 pt-6 md:pt-10 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between gap-4">
                 <div>
                    <h4 className="text-lg md:text-2xl font-black tracking-tight">AI Resume Optimization</h4>
                    <p className="text-text-secondary text-[10px] md:text-sm">Strategic edits to boost your ATS score and recruiter appeal.</p>
                 </div>
                 <button onClick={() => onNavigate(Screen.CVEditor)} className="hidden sm:flex items-center gap-2 text-primary font-bold text-sm hover:underline shrink-0">
                    Open Editor <ExternalLink className="size-4" />
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                 {analysisResult.recommendations?.map((rec: any, i: number) => (
                   <div key={i} className="bg-[#1c212b] p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 group hover:border-primary/30 transition-all flex flex-col h-full shadow-lg">
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                         <div className="flex items-center gap-3 md:gap-4">
                            <div className={`size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${rec.impact === 'High' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-text-secondary'}`}>
                               <Rocket className="size-5 md:size-6" />
                            </div>
                            <div className="min-w-0">
                               <h5 className="font-bold text-xs md:text-base leading-tight">{rec.title}</h5>
                               <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${rec.impact === 'High' ? 'text-primary' : 'text-text-secondary opacity-60'}`}>{rec.impact} Impact</span>
                                  <span className="text-[8px] md:text-[9px] text-text-secondary opacity-20">•</span>
                                  <span className="text-[8px] md:text-[9px] text-text-secondary font-bold uppercase">ATS Optimized</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      <p className="text-[11px] md:text-sm text-text-secondary leading-relaxed mb-4 md:mb-6 flex-1">
                         {rec.description}
                      </p>
                      <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-black/40 border border-white/5 text-[11px] md:text-sm text-white/90 relative group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                         <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#1c212b] px-2 py-0.5 text-[7px] md:text-[8px] font-black uppercase tracking-widest text-primary border border-primary/20 rounded-full">Suggested Edit</div>
                         <p className="italic leading-relaxed">"{rec.suggestion}"</p>
                         
                         {rec.suggestedBullet && (
                           <div className="mt-4 pt-4 border-t border-white/5">
                             <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-2">Recommended Bullet Point</p>
                             <div className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-white/5 group/copy">
                               <p className="text-xs text-gray-400 flex-1">{rec.suggestedBullet}</p>
                               <button 
                                 onClick={() => {
                                   navigator.clipboard.writeText(rec.suggestedBullet);
                                   setCopiedIndex(i);
                                   setTimeout(() => setCopiedIndex(null), 2000);
                                 }}
                                 className="shrink-0 text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                                 title="Copy to clipboard"
                               >
                                 {copiedIndex === i ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                                 {copiedIndex === i && <span className="text-[8px] font-bold uppercase tracking-widest">Copied</span>}
                               </button>
                             </div>
                           </div>
                         )}
                      </div>
                   </div>
                 ))}
              </div>

              {/* Find Jobs Prompt */}
              <div className="bg-gradient-to-br from-indigo-600 to-primary rounded-[24px] md:rounded-[32px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group mt-12">
                 <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Briefcase className="size-40 md:size-52" />
                 </div>
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                       <h3 className="text-2xl md:text-4xl font-black tracking-tight">Ready to apply?</h3>
                       <p className="text-white/80 text-sm md:text-lg font-medium max-w-xl">
                          We've analyzed your resume. Now let's find the perfect roles that match your new optimized profile.
                       </p>
                    </div>
                    <button 
                       onClick={() => onNavigate(Screen.JobBoard)}
                       className="px-10 py-5 bg-white text-primary font-black rounded-2xl text-xs md:text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all active:scale-95 shadow-2xl flex items-center gap-3"
                    >
                       Find Recommended Jobs
                       <ArrowRight className="size-5" />
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3c4253; border-radius: 10px; }`}</style>
    </div>
  );
};

export default CVAnalysisScreen;
