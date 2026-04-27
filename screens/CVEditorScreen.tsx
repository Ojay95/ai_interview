
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Undo2, 
  Redo2, 
  Download, 
  Edit3, 
  Eye, 
  Palette, 
  FileEdit, 
  LayoutGrid, 
  CheckCircle2, 
  Type as TypeIcon 
} from 'lucide-react';
import { Screen, User } from '../types';

interface CVEditorScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

const CVEditorScreen: React.FC<CVEditorScreenProps> = ({ user, onNavigate }) => {
  const [template, setTemplate] = useState('Modern Clean');
  const [bodySize, setBodySize] = useState(10.5);
  const [activeTab, setActiveTab] = useState<'Design' | 'Content'>('Design');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        const availableWidth = window.innerWidth - 48; // padding
        const newScale = Math.min(1, availableWidth / 800);
        setScale(newScale);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0d111a] text-white font-display overflow-hidden relative">
      
      <header className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-3 border-b border-white/5 bg-[#0d111a] shrink-0 z-50">
        <div className="flex items-center gap-3 md:gap-6">
           <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => onNavigate(Screen.Dashboard)}>
              <FileText className="size-5 md:size-6 text-primary" />
              <div className="min-w-0">
                 <h2 className="text-[10px] md:text-sm font-bold leading-none truncate max-w-[100px] md:max-w-none">Resume Editor</h2>
                 <p className="text-[7px] md:text-[9px] text-text-secondary mt-1">Edited 2m ago</p>
              </div>
           </div>
           <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-text-secondary/60">
              <button onClick={() => onNavigate(Screen.Dashboard)} className="hover:text-white transition-all">Dashboard</button>
              <span className="opacity-20">/</span>
              <button onClick={() => onNavigate(Screen.CVAnalysis)} className="hover:text-white transition-all">Resumes</button>
              <span className="opacity-20">/</span>
              <button className="text-white">Edit Layout</button>
           </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-1 mr-2">
               <button className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"><Undo2 className="size-4" /></button>
               <button className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"><Redo2 className="size-4" /></button>
            </div>
           <button className="hidden md:block px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Save Draft</button>
           <button className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-primary text-white text-[8px] md:text-xs font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all flex items-center gap-1.5 md:gap-2">
              <Download className="size-4" />
              <span>Export</span>
           </button>
           <div className="size-7 md:size-8 rounded-full border border-white/10 overflow-hidden bg-slate-700 ml-1">
             <img src={`https://i.pravatar.cc/150?u=${user?.id}`} alt="User" />
           </div>
        </div>
      </header>

      {/* Mobile View Toggle */}
      <div className="lg:hidden flex border-b border-white/5 bg-[#11131a] shrink-0">
         <button onClick={() => setViewMode('edit')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${viewMode === 'edit' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>
            <Edit3 className="size-4" /> Edit
         </button>
         <button onClick={() => setViewMode('preview')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${viewMode === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>
            <Eye className="size-4" /> Preview
         </button>
      </div>

      <main className="flex-1 flex overflow-hidden relative">
         {/* Editor Sidebar */}
         <aside className={`${viewMode === 'edit' ? 'flex' : 'hidden lg:flex'} w-full lg:w-80 border-r border-white/5 bg-[#11131a] flex flex-col shrink-0 z-10`}>
            <div className="flex border-b border-white/5 shrink-0">
               {['Design', 'Content'].map((tab: any) => (
                 <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-white'}`}
                 >
                    {tab === 'Design' ? <Palette className="size-4" /> : <FileEdit className="size-4" />}
                    {tab}
                 </button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-8 md:space-y-10 custom-scrollbar">
               <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary flex items-center gap-2">
                        <LayoutGrid className="size-4" /> Templates
                     </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                     {[
                       { name: 'Modern Clean', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=200&h=260', active: true },
                       { name: 'Executive', img: 'https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&q=80&w=200&h=260' }
                     ].map(t => (
                       <div key={t.name} onClick={() => setTemplate(t.name)} className="space-y-2 cursor-pointer group">
                          <div className={`aspect-[3/4] rounded-xl overflow-hidden border-2 relative transition-all ${template === t.name ? 'border-primary shadow-lg shadow-primary/20' : 'border-white/5 grayscale group-hover:grayscale-0 group-hover:border-white/20'}`}>
                             <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                             {template === t.name && <div className="absolute inset-0 bg-primary/20 flex items-center justify-center"><CheckCircle2 className="size-8 text-white" /></div>}
                          </div>
                          <p className={`text-[9px] md:text-[10px] font-bold text-center ${template === t.name ? 'text-white' : 'text-text-secondary'}`}>{t.name}</p>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary flex items-center gap-2">
                     <TypeIcon className="size-4" /> Typography
                  </h3>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Font Family</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary transition-all">
                           <option>Inter (Sans Serif)</option>
                           <option>JetBrains Mono</option>
                           <option>Roboto Slab</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary uppercase tracking-widest">
                           <span>Size</span>
                           <span className="text-white">{bodySize}pt</span>
                        </div>
                        <input type="range" min="8" max="14" step="0.5" value={bodySize} onChange={(e) => setBodySize(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary" />
                     </div>
                  </div>
               </div>
            </div>
         </aside>

         {/* Canvas Area */}
         <section className={`${viewMode === 'preview' ? 'flex' : 'hidden lg:flex'} flex-1 bg-black/20 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar flex flex-col items-center gap-6 md:gap-10`}>
            {/* A4 Resume Mockup (Visual Only) */}
            <div className="relative" style={{ minHeight: `${1131 * scale}px`, width: `${800 * scale}px` }}>
              <div 
                className="w-[800px] min-h-[1131px] bg-white text-[#1a1c24] p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.5)] origin-top-left absolute left-0 top-0"
                style={{ transform: `scale(${scale})` }}
              >
                 <div className="flex flex-col sm:flex-row justify-between items-start mb-8 md:mb-16 gap-6">
                    <div className="space-y-2">
                       <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Alex Morgan</h1>
                       <p className="text-lg md:text-xl font-medium text-slate-500">Senior Product Designer</p>
                    </div>
                    <div className="text-left sm:text-right text-[10px] md:text-xs font-medium space-y-1 text-slate-500">
                       <p>alex.morgan@email.com</p>
                       <p>+1 (555) 123-4567</p>
                       <p>San Francisco, CA</p>
                       <p className="truncate max-w-[200px]">linkedin.com/in/alexmorgan</p>
                    </div>
                 </div>

                 <div className="h-px w-full bg-slate-200 mb-8 md:mb-12"></div>

                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    <div className="md:col-span-8 space-y-8 md:space-y-12">
                       <section className="space-y-4 md:space-y-6">
                          <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Professional Experience</h2>
                          <div className="space-y-6 md:space-y-8">
                             <div className="space-y-2 md:space-y-3">
                                <div className="flex justify-between items-baseline">
                                   <h3 className="text-base md:text-lg font-bold">Lead UX Designer</h3>
                                   <span className="text-[8px] md:text-[10px] font-medium text-slate-400">2020 - Pres</span>
                                </div>
                                <p className="text-[10px] md:text-xs font-bold text-slate-600">TechFlow Solutions</p>
                                <ul className="text-[10px] md:text-xs space-y-2 list-disc pl-4 text-slate-500 leading-relaxed">
                                   <li>Spearheaded SaaS redesign, 25% engagement lift.</li>
                                   <li>Managed team of 5 designers, weekly critiques.</li>
                                   <li>Design system cut dev time by 40%.</li>
                                </ul>
                             </div>
                          </div>
                       </section>
                    </div>
                 </div>
              </div>
            </div>
         </section>
      </main>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3c4253; border-radius: 10px; }`}</style>
    </div>
  );
};

export default CVEditorScreen;
