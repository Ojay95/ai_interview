import React from 'react';
import { 
  X, 
  Menu, 
  Star, 
  Mic, 
  FileText, 
  BarChart, 
  Play, 
  Brain, 
  Mic2, 
  Zap, 
  Shield, 
  CheckCircle, 
  Plus
} from 'lucide-react';
import { Screen } from '../types';
import { Logo } from '../constants';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuthStore } from '../store/useAuthStore';

interface LandingScreenProps {
  onNavigate: (screen: Screen) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  const { bypassAuth } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleQuickPractice = () => {
    bypassAuth();
    onNavigate(Screen.Dashboard);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">
      <nav className="flex items-center justify-between px-6 lg:px-20 py-4 lg:py-6 border-b border-black/5 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <Logo className="size-8 lg:size-10" />
          <span className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white">MockInterview.ai</span>
        </div>

        {/* Center Menu - Hidden on Mobile */}
        <div className="hidden lg:flex items-center gap-8">
          <button className="text-sm font-medium text-slate-600 dark:text-text-secondary hover:text-primary dark:hover:text-white transition-colors">Features</button>
          <button className="text-sm font-medium text-slate-600 dark:text-text-secondary hover:text-primary dark:hover:text-white transition-colors">How it Works</button>
          <button className="text-sm font-medium text-slate-600 dark:text-text-secondary hover:text-primary dark:hover:text-white transition-colors">Pricing</button>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <button 
            onClick={() => onNavigate(Screen.SignIn)}
            className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-text-secondary hover:text-primary dark:hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => onNavigate(Screen.SignUp)}
            className="bg-primary hover:bg-primary-hover px-4 lg:px-6 py-2 rounded-xl text-xs lg:text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all"
          >
            Get Started
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-slate-900 dark:text-white"
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-black/5 dark:border-white/5 p-6 flex flex-col gap-6 lg:hidden animate-in slide-in-from-top duration-300">
            <button className="text-left text-lg font-bold text-slate-900 dark:text-white">Features</button>
            <button className="text-left text-lg font-bold text-slate-900 dark:text-white">How it Works</button>
            <button className="text-left text-lg font-bold text-slate-900 dark:text-white">Pricing</button>
            <div className="h-px bg-black/5 dark:border-white/5"></div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-text-secondary">Appearance</span>
              <ThemeToggle />
            </div>
            <button 
              onClick={() => onNavigate(Screen.SignIn)}
              className="w-full py-4 rounded-2xl border border-black/5 dark:border-white/10 text-slate-900 dark:text-white font-bold"
            >
              Sign In
            </button>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center px-6 lg:px-20 py-10 lg:py-20 gap-10 lg:gap-16 relative">
          <div className="flex-1 flex flex-col gap-6 lg:gap-8 z-10 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 dark:bg-white/5 backdrop-blur-md border border-primary/10 dark:border-white/10 text-primary dark:text-teal-400 text-[10px] lg:text-xs font-medium">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary dark:bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary dark:bg-teal-400"></span>
              </span>
              New: Advanced Voice Analytics 2.0
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight tracking-tight px-4 sm:px-0">
              Master your next <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:to-teal-400">
                interview with AI confidence.
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0">
              The world's most advanced voice-driven practice platform. Simulate real interview scenarios and get instant, brutally honest feedback to land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-4 px-4 sm:px-0">
              <button 
                onClick={handleQuickPractice}
                className="bg-primary hover:bg-primary-hover px-8 py-4 rounded-2xl text-base lg:text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all transform hover:scale-105"
              >
                Start Free Practice
              </button>
              <button className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-8 py-4 rounded-2xl text-base lg:text-lg font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 backdrop-blur-sm transition-all">
                Watch Demo
              </button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-4 border-t border-slate-200 dark:border-white/10 pt-8 mt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 dark:bg-gray-600 flex items-center justify-center text-xs text-slate-900 dark:text-white font-bold">
                    {['AM', 'JL', 'RK'][i-1]}
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-white dark:border-background-dark bg-primary flex items-center justify-center text-[10px] font-bold text-white">+10k</div>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-0.5 text-amber-500 dark:text-amber-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="size-3 lg:size-4 fill-current" />)}
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-gray-400">Trusted by 10,000+ professionals</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-[600px] aspect-square relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/10 dark:to-teal-500/10 rounded-3xl blur-[120px]"></div>
            <div className="relative z-10 h-full w-full glass-card rounded-3xl border border-black/5 dark:border-white/10 p-10 flex flex-col gap-8 shadow-2xl">
                <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                      <Mic className="size-7" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-bold text-lg">Interview with Sarah</p>
                      <p className="text-slate-500 dark:text-text-secondary text-sm">Live Voice Session</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-primary/10 dark:bg-teal-400/10 text-primary dark:text-teal-400 rounded-full text-xs font-bold border border-primary/20 dark:border-teal-400/20">LIVE</div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex gap-4">
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-gray-600 flex-shrink-0"></div>
                      <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-gray-300">
                        "Tell me about a time you had to deal with a difficult team member..."
                      </div>
                  </div>
                  <div className="flex gap-4 flex-row-reverse">
                      <div className="size-8 rounded-full bg-primary flex-shrink-0"></div>
                      <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-2xl rounded-tr-none border border-primary/20 text-sm text-primary dark:text-white">
                        "I once worked with a developer who was consistently late on deliverables. I scheduled a one-on-one to..."
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-gray-600 flex-shrink-0"></div>
                      <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-gray-300">
                        "That's a great approach. How did they respond to that feedback?"
                      </div>
                  </div>
                </div>

                <div className="flex items-center justify-center h-20 gap-1">
                  {[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1].map((h, i) => (
                      <div key={i} className="w-1.5 bg-primary rounded-full" style={{ height: `${h * 10}%`, opacity: 0.3 + (h/10) }}></div>
                  ))}
                </div>
            </div>
          </div>
        </section>

        {/* Social Proof: Trust Indicators */}
        <section className="px-6 lg:px-20 py-10 lg:py-12 border-y border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
          <p className="text-center text-[10px] sm:text-sm font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-[0.2em] mb-8 lg:mb-10">
            Our candidates land jobs at top tech companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 lg:gap-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {['Google', 'Meta', 'Amazon', 'Netflix', 'Microsoft', 'Apple'].map(company => (
              <span key={company} className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">{company}</span>
            ))}
          </div>
        </section>

        {/* Core Feature Highlights */}
        <section className="px-6 lg:px-20 py-16 lg:py-32 bg-background-light dark:bg-background-dark relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(25,76,230,0.05)_0%,transparent_70%)] pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-20 px-4">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6">Built for the modern candidate.</h2>
            <p className="text-lg lg:text-xl text-slate-600 dark:text-gray-400">Everything you need to go from "Applying" to "Hired" in one powerful platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {[
              {
                title: 'AI Voice Interviews',
                desc: 'Real-time, low-latency voice conversations that feel like a real human recruiter.',
                icon: <Mic className="size-6 lg:size-7" />,
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-600/10 dark:bg-blue-400/10'
              },
              {
                title: 'ATS Resume Optimization',
                desc: 'Scan your resume against job descriptions and get a score before you ever hit apply.',
                icon: <FileText className="size-6 lg:size-7" />,
                color: 'text-teal-600 dark:text-teal-400',
                bg: 'bg-teal-600/10 dark:bg-teal-400/10'
              },
              {
                title: 'Detailed Feedback',
                desc: 'Brutally honest analysis of your tone, confidence, and content quality after every session.',
                icon: <BarChart className="size-6 lg:size-7" />,
                color: 'text-purple-600 dark:text-purple-400',
                bg: 'bg-purple-600/10 dark:bg-purple-400/10'
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-6 lg:p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-primary/20 dark:hover:border-white/10 transition-all group text-left">
                <div className={`size-12 lg:size-14 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-sm lg:text-base text-slate-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* User Journey: 3-Step Guide */}
        <section className="px-6 lg:px-20 py-16 lg:py-32 bg-slate-50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 w-full text-center lg:text-left">
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-8 lg:mb-12">Your path to the offer <br className="hidden lg:block"/>in 3 simple steps.</h2>
                <div className="space-y-8 lg:space-y-12">
                  {[
                    { step: '01', title: 'Upload & Analyze', desc: 'Upload your resume and the job description. Our AI identifies the exact skills and keywords recruiters are looking for.' },
                    { step: '02', title: 'Practice with AI', desc: 'Engage in a live, voice-driven mock interview tailored specifically to that job role and your experience level.' },
                    { step: '03', title: 'Refine & Get Hired', desc: 'Review your performance analytics, fix your weak spots, and walk into the real interview with total confidence.' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-center lg:items-start gap-4 lg:gap-6">
                      <div className="text-3xl lg:text-4xl font-black text-primary/20 font-mono">{item.step}</div>
                      <div>
                        <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-sm lg:text-base text-slate-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-2xl">
                  <img src="https://picsum.photos/seed/interview/1200/800" alt="Platform Preview" className="w-full h-full object-cover opacity-50 dark:opacity-50" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-20 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/50 cursor-pointer hover:scale-110 transition-transform">
                      <Play className="size-10 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ATS Compatibility */}
        <section className="px-6 lg:px-20 py-16 lg:py-32 bg-background-light dark:bg-background-dark">
          <div className="max-w-5xl mx-auto glass-card p-8 sm:p-12 lg:p-20 rounded-3xl lg:rounded-[40px] border border-black/5 dark:border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 size-64 bg-primary/5 dark:bg-primary/10 blur-[100px] -mr-32 -mt-32"></div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6">Works with every major ATS.</h2>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-gray-400 mb-8 lg:mb-12 max-w-2xl mx-auto">
              Don't let a robot reject you before a human even sees your resume. Our optimization engine is built to beat the algorithms of the world's most popular systems.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-16 opacity-60 dark:opacity-50">
              {['Workday', 'Greenhouse', 'Lever', 'Taleo', 'iCIMS', 'BambooHR'].map(ats => (
                <div key={ats} className="px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs lg:text-sm tracking-tight text-center flex-1 min-w-[100px] max-w-[140px]">
                  {ats}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Voice Intelligence: Technical Deep-Dive */}
        <section className="px-6 lg:px-20 py-16 lg:py-32 bg-slate-50 dark:bg-white/[0.01]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
             <div className="flex-1 order-2 lg:order-1 w-full max-w-2xl mx-auto lg:mx-0">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
                      <div className="size-10 rounded-xl bg-teal-600/10 dark:bg-teal-400/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                         <Brain className="size-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">NLP Engine</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-500">Processing complex sentence structures in real-time with 99.2% accuracy.</p>
                   </div>
                   <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-4 sm:mt-8">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                         <Mic2 className="size-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Prosody Analysis</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-500">Detecting confidence levels through pitch, pace, and hesitation markers.</p>
                   </div>
                   <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
                      <div className="size-10 rounded-xl bg-purple-600/10 dark:bg-purple-400/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                         <Zap className="size-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Ultra-Low Latency</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-500">Sub-200ms response times for a natural, conversational flow.</p>
                   </div>
                   <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-4 sm:mt-8">
                      <div className="size-10 rounded-xl bg-amber-600/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                         <Shield className="size-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Privacy First</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-500">End-to-end encryption for all voice data and personal information.</p>
                   </div>
                </div>
             </div>
             <div className="flex-1 order-1 lg:order-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold mb-6">
                  THE TECHNOLOGY
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 lg:mb-8 tracking-tight">The intelligence <br className="hidden sm:block"/>behind the voice.</h2>
                <p className="text-base lg:text-xl text-slate-600 dark:text-gray-400 leading-relaxed mb-8">
                  We don't just use standard LLMs. Our proprietary Voice Intelligence layer analyzes over 50 different vocal markers to provide feedback that was previously only possible with a human career coach.
                </p>
                <ul className="space-y-4 inline-block text-left">
                  {[
                    'Dynamic context-aware questioning',
                    'Sentiment and emotional intelligence tracking',
                    'Industry-specific vocabulary recognition',
                    'Real-time hesitation and filler word detection'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm lg:text-base text-slate-700 dark:text-gray-300 font-medium">
                      <CheckCircle className="size-4 text-teal-600 dark:text-teal-400" />
                      {item}
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 lg:px-20 py-16 lg:py-32 bg-background-light dark:bg-background-dark">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Loved by job seekers.</h2>
            <p className="text-base lg:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto px-4">Real stories from people who landed their dream roles.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {[
              {
                name: 'Alex Rivera',
                role: 'Software Engineer at Google',
                text: 'The voice feedback was a game changer. It caught my "umms" and "likes" that I never even noticed. Landed my L5 role 3 weeks later.',
                avatar: 'AR'
              },
              {
                name: 'Sarah Chen',
                role: 'Product Manager at Meta',
                text: 'I was struggling with behavioral questions. MockInterview.ai helped me structure my STAR responses perfectly. Highly recommend!',
                avatar: 'SC'
              },
              {
                name: 'Marcus Thorne',
                role: 'Data Scientist at Amazon',
                text: 'The ATS optimization alone is worth the price. My response rate from applications went from 5% to nearly 40%.',
                avatar: 'MT'
              }
            ].map((t, i) => (
              <div key={i} className="glass-card p-6 lg:p-8 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col gap-6 text-left">
                <div className="flex gap-1 text-amber-500 dark:text-amber-400">
                  {[1,2,3,4,5].map(s => <Star key={s} className="size-3 lg:size-4 fill-current" />)}
                </div>
                <p className="text-sm lg:text-base text-slate-700 dark:text-gray-300 italic font-medium">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="size-10 lg:size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm lg:text-base">{t.avatar}</div>
                  <div>
                    <p className="text-sm lg:text-base text-slate-900 dark:text-white font-bold">{t.name}</p>
                    <p className="text-[10px] lg:text-xs text-slate-500 dark:text-text-secondary font-medium uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 lg:px-20 py-16 lg:py-32 bg-slate-50 dark:bg-white/[0.02]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white text-center mb-12 lg:mb-16 tracking-tight">Common Questions</h2>
            <div className="space-y-4 lg:space-y-6">
              {[
                { q: 'How accurate is the AI feedback?', a: 'Our AI is trained on thousands of successful interview transcripts and recruiter feedback. It provides 95%+ accuracy on technical content and vocal delivery markers.' },
                { q: 'Is my data and voice recording secure?', a: 'Yes. We use enterprise-grade encryption. Your recordings are processed in real-time and are never sold to third parties. You have full control over your data.' },
                { q: 'Does it work for non-tech roles?', a: 'Absolutely. While we have deep expertise in tech, our platform supports over 500+ job categories including Marketing, Sales, Finance, and Operations.' },
                { q: 'Can I use it for free?', a: 'Yes! We offer a free tier that includes basic resume analysis and one mock interview session per month to get you started.' }
              ].map((faq, i) => (
                <div key={i} className="glass-card p-6 lg:p-8 rounded-2xl border border-black/5 dark:border-white/5">
                  <h3 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between gap-4 text-left">
                    {faq.q}
                    <Plus className="size-5 text-slate-400 dark:text-text-secondary flex-shrink-0" />
                  </h3>
                  <p className="text-xs lg:text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium text-left">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 lg:px-20 py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 blur-[150px] -z-10"></div>
          <div className="max-w-5xl mx-auto text-center px-4">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 lg:mb-8 leading-tight tracking-tight">
              Ready to land your <br className="hidden sm:block"/>dream job?
            </h2>
            <p className="text-base lg:text-xl text-slate-600 dark:text-gray-400 mb-8 lg:mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 10,000+ professionals who are using AI to master their interview skills and get hired faster.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 lg:gap-6">
              <button 
                onClick={handleQuickPractice}
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover px-10 py-5 rounded-2xl text-lg lg:text-xl font-bold text-white shadow-2xl shadow-primary/40 transition-all transform hover:scale-105 active:scale-95"
              >
                Get Started for Free
              </button>
              <button className="w-full sm:w-auto bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-10 py-5 rounded-2xl text-lg lg:text-xl font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 backdrop-blur-sm transition-all active:scale-95">
                View Pricing
              </button>
            </div>
            <p className="mt-8 text-xs lg:text-sm text-slate-500 dark:text-text-secondary font-medium tracking-wide">No credit card required. Start practicing in 60 seconds.</p>
          </div>
        </section>
      </main>

      <footer className="px-6 lg:px-20 py-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50 dark:bg-background-dark/50">
        <div className="flex items-center gap-3 opacity-80 dark:opacity-60">
          <Logo className="size-7" />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">MockInterview.ai</span>
        </div>
        <div className="flex gap-8 text-sm text-slate-600 dark:text-text-secondary">
          <button 
            onClick={() => onNavigate(Screen.Privacy)} 
            className="hover:text-primary dark:hover:text-white transition-colors"
          >
            Privacy
          </button>
          <button 
            onClick={() => onNavigate(Screen.Terms)} 
            className="hover:text-primary dark:hover:text-white transition-colors"
          >
            Terms
          </button>
          <button 
            onClick={() => onNavigate(Screen.Contact)} 
            className="hover:text-primary dark:hover:text-white transition-colors"
          >
            Contact
          </button>
        </div>
        <div className="text-sm text-slate-500 dark:text-text-secondary">
          © 2024 MockInterview.ai. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingScreen;
