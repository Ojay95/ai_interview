import React, { useEffect, useState } from 'react';
import {
  LayoutGrid,
  FileText,
  Briefcase,
  History,
  BarChart3,
  Settings,
  LogOut,
  X,
  Menu,
  Brain,
  Flame,
  Mic,
  CheckSquare,
  ThumbsUp,
  Target,
  TrendingUp,
  Lightbulb,
  Code2,
  Layout,
  Eye
} from 'lucide-react';
import { Screen, User } from '../types';
import { apiClient } from '../services/apiClient';

interface DashboardScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate, onLogout }) => {
  const [usageStats, setUsageStats] = useState({ used: 0, total: 3 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Align plan check with backend Uppercase Enums (FREE, PRO, ELITE)
  const isFree = user?.plan === 'FREE';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Points to AnalyticsController.java @GetMapping("/stats")
        const response = await apiClient.get('/analytics/stats');
        setUsageStats({
          used: response.data.totalInterviews || 0,
          total: response.data.maxQuota || 3
        });
      } catch (error) {
        console.error("Could not fetch usage stats", error);
      }
    };

    if (user) fetchStats();
  }, [user]);

  const interviewsLeft = Math.max(0, usageStats.total - usageStats.used);

  const handleStartInterview = (targetScreen: Screen) => {
    if (interviewsLeft <= 0) {
      onNavigate(Screen.Subscription);
    } else {
      onNavigate(targetScreen);
    }
    setIsSidebarOpen(false);
  };

  return (
      <div className="flex h-screen w-full bg-[#0f111a] text-white overflow-hidden font-display">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 w-64 border-r border-white/5 flex flex-col shrink-0 bg-[#0f111a] z-[70] transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 space-y-1">
            <div className="flex items-center justify-between mb-10 px-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg text-white">
                  <Brain className="size-5" />
                </div>
                <div>
                  <h1 className="font-bold text-sm tracking-tight leading-none">AI Interviewer</h1>
                  <p className="text-[10px] text-text-secondary mt-1 font-black uppercase tracking-widest">
                    {user?.plan || 'FREE'} Tier
                  </p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-text-secondary">
                <X className="size-5" />
              </button>
            </div>

            <nav className="space-y-1">
              <button onClick={() => onNavigate(Screen.Dashboard)} className="flex items-center w-full gap-3 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
                <LayoutGrid className="size-5" />
                Dashboard
              </button>
              <button onClick={() => onNavigate(Screen.CVLanding)} className="flex items-center w-full gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5 transition-all text-sm font-medium">
                <FileText className="size-5" />
                CV Analysis
              </button>
              <button onClick={() => onNavigate(Screen.JobBoard)} className="flex items-center w-full gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5 transition-all text-sm font-medium">
                <Briefcase className="size-5" />
                Job Board
              </button>
              {/* ... other nav items */}
            </nav>
          </div>

          <div className="mt-auto p-6 space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase text-text-secondary">Quota</span>
                <span className="text-[10px] font-black text-primary">{interviewsLeft}/{usageStats.total} left</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(interviewsLeft / usageStats.total) * 100}%` }}></div>
              </div>
            </div>

            {isFree && (
                <button
                    onClick={() => onNavigate(Screen.Subscription)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white text-xs font-black uppercase tracking-widest"
                >
                  Upgrade to Pro
                </button>
            )}

            <div className="flex items-center gap-3 py-4 border-t border-white/5">
              <div className="size-10 rounded-full border border-white/10 overflow-hidden bg-slate-700">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="User" />
              </div>
              <div className="flex-1 min-w-0">
                {/* Aligned with backend firstName/lastName */}
                <p className="text-sm font-bold truncate leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                </p>
                <p className="text-xs text-text-secondary truncate mt-1">{user?.email}</p>
              </div>
              <button onClick={onLogout} className="text-text-secondary hover:text-white transition-colors">
                <LogOut className="size-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-14 custom-scrollbar space-y-8 md:space-y-12">
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="w-full lg:w-auto">
              {/* Using standardized firstName field */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-2">
                Ready to ace it, {user?.firstName || 'Candidate'}?
              </h2>
              <div className="flex items-center gap-2 text-text-secondary">
                <Flame className="size-5 text-orange-500" fill="currentColor" />
                <p className="text-sm font-medium">Your account is active. Let's start practicing.</p>
              </div>
            </div>
            {/* ... action buttons */}
          </header>

          {/* Statistics and recent sessions logic would follow same pattern:
            fetch from /api/v1/interviews/history or /api/v1/analytics/stats */}
        </main>
      </div>
  );
};

export default DashboardScreen;