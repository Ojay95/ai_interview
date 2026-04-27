import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Standardizing to framer-motion
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Filter,
  ArrowLeft,
  Building2,
  Globe,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Screen, Job } from '../types';
import { apiClient } from '../services/apiClient';
import toast from 'react-hot-toast';

interface JobBoardScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const JobBoardScreen: React.FC<JobBoardScreenProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // 1. Fetch Real Jobs from PostgreSQL via Backend
  const fetchJobs = async () => {
    setIsSearching(true);
    try {
      // Points to JobController.java @GetMapping
      const response = await apiClient.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      toast.error("Could not load job board.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. Handle Seeding (If board is empty)
  const handleSeedJobs = async () => {
    setIsSearching(true);
    try {
      toast.loading("AI is generating real jobs...", { id: 'seed' });
      // Points to JobController.java @PostMapping("/seed")
      await apiClient.post(`/jobs/seed?industry=${searchQuery || 'Technology'}`);
      toast.success("Job board populated!", { id: 'seed' });
      fetchJobs();
    } catch (error) {
      toast.error("Failed to seed jobs.", { id: 'seed' });
    } finally {
      setIsSearching(false);
    }
  };

  return (
      <div className="min-h-screen bg-[#0f111a] text-white font-display">
        <header className="bg-[#0f111a] border-b border-white/5 sticky top-0 z-30 backdrop-blur-md bg-opacity-80">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate(Screen.Dashboard)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-black text-white">AI Job Board</h1>
            </div>
            {/* Seed Button if board is empty */}
            {jobs.length === 0 && !isSearching && (
                <button
                    onClick={handleSeedJobs}
                    className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-xl text-primary text-xs font-bold"
                >
                  Generate Jobs
                </button>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Filters (Logic can be connected to backend filtering later) */}
            <div className="lg:col-span-3">
              {/* ... UI for filters from your original code ... */}
            </div>

            <div className="lg:col-span-9 space-y-8">
              {/* Real Job List Mapping */}
              <div className="space-y-6">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className="bg-[#1c212b] border border-white/5 rounded-2xl p-6 hover:border-primary/30 cursor-pointer transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                                <Building2 className="w-6 h-6 text-slate-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-black text-white">{job.title}</h3>
                                <p className="text-sm text-slate-400 font-medium">{job.company} • {job.location}</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                            {job.type}
                        </span>
                          </div>
                          <p className="mt-4 text-slate-400 text-xs leading-relaxed line-clamp-2">{job.description}</p>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-[#1c212b] rounded-3xl border border-white/5">
                      <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                      <h3 className="text-xl font-bold">No jobs found</h3>
                      <p className="text-slate-500 mb-6 text-sm">Use the button above to generate some jobs for your profile.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Modal logic remains same, just ensure it uses selectedJob fields */}
      </div>
  );
};