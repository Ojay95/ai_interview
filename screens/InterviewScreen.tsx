import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AudioLines,
  RotateCw,
  Mic,
  MicOff,
  Play,
  Pause,
  PhoneOff
} from 'lucide-react';
import { Screen, User, InterviewConfig } from '../types';
import { apiClient } from '../services/apiClient'; // cite: 31
import toast from 'react-hot-toast';

interface InterviewScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({ user, onNavigate }) => {
  // --- UI State ---
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState<{ sender: 'Sarah' | 'You'; text: string; time: string }[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null); // cite: 33, 35
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [isSarahTyping, setIsSarahTyping] = useState(false);

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  // --- Cleanup Utility ---
  const cleanupAll = useCallback(() => {
    isMounted.current = false;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const saved = localStorage.getItem('pending_interview_config');
    if (saved) setConfig(JSON.parse(saved));
    return () => cleanupAll();
  }, [cleanupAll]);

  // --- Logic: Start Session (Connect to Backend) ---
  const handleJoinSession = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      // 1. Request Media Permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      // 2. Initialize Backend Session
      // Matches InterviewController.java @PostMapping("/start")
      const response = await apiClient.post('/interviews/start', {
        jobId: localStorage.getItem('selected_job_id') || 1,
        cvId: localStorage.getItem('selected_cv_id') || 1
      });

      setSessionId(response.data.id);
      setIsSessionActive(true);
      toast.success("Sarah is in the room.");
    } catch (err) {
      toast.error("Failed to connect to AI server. Ensure backend is awake.");
      cleanupAll();
    } finally {
      setIsConnecting(false);
    }
  };

  // --- Logic: Chat Flow ---
  const sendMessageToSarah = async (text: string) => {
    if (!sessionId || !text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscript(p => [...p, { sender: 'You', text, time }]);
    setIsSarahTyping(true);

    try {
      // Matches InterviewController.java @PostMapping("/chat")
      const response = await apiClient.post('/interviews/chat', {
        sessionId: sessionId,
        userMessage: text
      });

      setTranscript(p => [...p, {
        sender: 'Sarah',
        text: response.data.aiResponse, // cite: 38
        time
      }]);
    } catch (error) {
      toast.error("Sarah is having connection issues.");
    } finally {
      setIsSarahTyping(false);
    }
  };

  const handleFinish = async () => {
    if (sessionId) {
      // Matches InterviewController.java @PostMapping("/analyze")
      toast.promise(apiClient.post('/interviews/analyze', { sessionId }), {
        loading: 'Saving session...',
        success: 'Interview saved!',
        error: 'Could not save session'
      });
    }
    cleanupAll();
    onNavigate(Screen.Analysis);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [transcript, isSarahTyping]);

  return (
      <div className="flex flex-col h-screen bg-[#0f121a] text-white overflow-hidden font-display">
        <nav className="flex items-center justify-between px-4 lg:px-8 py-3 bg-[#161b22]/90 border-b border-white/5 shrink-0 z-50">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <AudioLines className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold">MockInterview.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-black text-primary tabular-nums bg-primary/10 px-3 py-1 rounded-full border border-primary/20">{formatTime(timer)}</div>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} className="size-8 rounded-full border border-white/10" alt="User" />
          </div>
        </nav>

        {!isSessionActive ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
              <div className="size-24 bg-primary/10 rounded-[32px] flex items-center justify-center border border-primary/20">
                {isConnecting ? <RotateCw className="size-12 text-primary animate-spin" /> : <Mic className="size-12 text-primary" />}
              </div>
              <button onClick={handleJoinSession} disabled={isConnecting} className="w-full max-w-xs py-4 bg-primary rounded-2xl font-bold uppercase tracking-widest text-xs">
                {isConnecting ? 'Initializing Room...' : 'Start Interview'}
              </button>
            </div>
        ) : (
            <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6 p-6 overflow-hidden min-h-0">
              <section className="lg:col-span-3 flex lg:flex-col gap-6">
                <div className="bg-[#1c212b] rounded-3xl border border-white/5 overflow-hidden relative aspect-square">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 px-2 py-0.5 rounded-full bg-black/60 text-[10px]">You</div>
                </div>
                <div className="bg-[#1c212b] rounded-3xl border border-white/5 overflow-hidden relative aspect-square">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600" alt="Sarah" className="w-full h-full object-cover grayscale brightness-75" />
                  <div className="absolute bottom-6 left-6 text-white font-black">Sarah</div>
                </div>
              </section>

              <section className="lg:col-span-9 flex flex-col bg-[#1c212b] rounded-[32px] border border-white/5 shadow-2xl overflow-hidden relative">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar pb-32">
                  {transcript.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] font-black uppercase text-text-secondary mb-2">{m.sender}</span>
                        <div className={`p-5 rounded-2xl max-w-[85%] text-sm ${m.sender === 'Sarah' ? 'bg-white/5 text-gray-300' : 'bg-primary text-white shadow-lg'}`}>
                          {m.text}
                        </div>
                      </div>
                  ))}
                  {isSarahTyping && (
                      <div className="flex flex-col items-start opacity-60">
                        <div className="p-5 rounded-2xl bg-white/5 flex gap-1">
                          <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                  )}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#1c212b] via-[#1c212b] to-transparent">
                  <div className="flex gap-4">
                    <input
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all"
                        placeholder="Type your response..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            sendMessageToSarah(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                    />
                    <button onClick={handleFinish} className="px-6 py-4 bg-red-600/10 text-red-500 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all">
                      <PhoneOff className="size-5" />
                    </button>
                  </div>
                </div>
              </section>
            </main>
        )}
        <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3c4253; border-radius: 10px; }`}</style>
      </div>
  );
};

export default InterviewScreen;