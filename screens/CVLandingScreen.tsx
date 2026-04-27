
import React, { useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { User, Screen } from '../types';
import { Logo } from '../constants';
import { extractTextFromFile } from '../utils/fileHelpers';

// Fix: Define props interface including onNavigate to match expected usage in App.tsx
interface CVLandingScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

const CVLandingScreen: React.FC<CVLandingScreenProps> = ({ onNavigate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // ✅ 1. Extract text purely on the frontend
      const text = await extractTextFromFile(file);
      
      if (text.length < 50) {
        throw new Error("The file seems empty or couldn't be read.");
      }

      // ✅ 2. Save to LocalStorage (simulating a "backend" database)
      localStorage.setItem('pending_resume_text', text);
      localStorage.setItem('pending_resume_name', file.name);

      // ✅ 3. Go to Analysis using onNavigate
      // Fix: Replaced direct navigate call with onNavigate prop
      setTimeout(() => onNavigate(Screen.CVAnalysis), 500);
      
    } catch (err: any) {
      setError(err.message || "Failed to read file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d111a] text-white font-display">
      <nav className="flex items-center px-4 lg:px-8 py-4 lg:py-6 border-b border-white/5">
        {/* Fix: Replaced direct navigate call with onNavigate prop */}
        <div onClick={() => onNavigate(Screen.Dashboard)} className="flex items-center gap-2 lg:gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <Logo className="size-6 lg:size-8" />
          <span className="text-lg lg:text-xl font-bold tracking-tight">MockInterview.ai</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6 text-center">
        <div className="max-w-2xl w-full space-y-6 lg:space-y-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black mb-3 lg:mb-4">Upload your Resume</h1>
            <p className="text-sm lg:text-base text-gray-400">We'll analyze it against your target job description.</p>
          </div>

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-[24px] lg:rounded-3xl p-8 lg:p-12 transition-all duration-300
              flex flex-col items-center justify-center gap-4 lg:gap-6 group
              ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/10 hover:border-white/20 bg-white/5'}
            `}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center animate-pulse">
                <Loader2 className="size-10 lg:size-12 text-primary mb-3 lg:mb-4 animate-spin" />
                <p className="font-bold text-base lg:text-lg">Reading Document...</p>
              </div>
            ) : (
              <>
                <div className="size-16 lg:size-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UploadCloud className="size-8 lg:size-10 text-gray-400 group-hover:text-primary" />
                </div>
                <div>
                  <p className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">Drag & Drop your Resume</p>
                  <p className="text-[10px] lg:text-sm text-gray-500">Supports PDF, TXT, MD</p>
                </div>
                <input 
                  type="file" 
                  id="resume-upload" 
                  className="hidden" 
                  accept=".pdf,.txt,.md"
                  onChange={handleFileInput} 
                />
                <button 
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  className="w-full sm:w-auto px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm lg:text-base"
                >
                  Browse Files
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CVLandingScreen;
