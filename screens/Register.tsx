import React, { useState } from 'react';
import { LayoutGrid, Eye, EyeOff } from 'lucide-react';
import { Screen } from '../types';
import { Logo, ROUTES } from '../constants';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import toast from 'react-hot-toast';

interface RegisterScreenProps {
  onNavigate: (screen: Screen) => void;
}

const Register: React.FC<RegisterScreenProps> = ({ onNavigate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Connects to RegisterRequest in backend
      await apiClient.post('/auth/register', {
        firstName,
        lastName,
        email,
        password
      });

      toast.success('Account created! Please login.');
      onNavigate(Screen.Login);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark transition-colors duration-300">
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24 overflow-y-auto bg-background-light dark:bg-background-dark">
          <header className="absolute top-8 left-6 lg:left-20 xl:left-24 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(Screen.Landing)}>
            <Logo />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MockInterview.ai</span>
          </header>

          <div className="w-full max-w-[440px] mx-auto mt-16 lg:mt-0">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Get started for free</h1>
              <p className="text-slate-600 dark:text-text-secondary text-base">Create an account to ace your next interview. No credit card required.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark py-2.5 px-4 text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-[#252833] transition-colors">
                <img alt="Google" className="h-5 w-5" src="https://www.google.com/favicon.ico"/>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark py-2.5 px-4 text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-[#252833] transition-colors">
                <LayoutGrid className="size-5" />
                GitHub
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-border-dark"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase text-slate-500 dark:text-text-secondary">
                <span className="bg-background-light dark:bg-background-dark px-2">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-white" htmlFor="firstName">First Name</label>
                  <input
                      className="w-full rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark h-11 px-4 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      id="firstName"
                      placeholder="John"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-white" htmlFor="lastName">Last Name</label>
                  <input
                      className="w-full rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark h-11 px-4 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      id="lastName"
                      placeholder="Doe"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-white" htmlFor="email">Email Address</label>
                <input
                    className="w-full rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark h-11 px-4 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-white" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                      className="w-full rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark h-11 px-4 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      id="password"
                      placeholder="Min. 8 characters"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                  <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center rounded-xl h-12 px-4 bg-primary hover:bg-primary-hover text-white text-base font-bold shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    'Create Account'
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-600 dark:text-text-secondary">
              Already have an account?
              <button onClick={() => onNavigate(Screen.Login)} className="ml-1 font-medium text-primary hover:underline transition-colors">Log in</button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 relative bg-slate-900 dark:bg-surface-dark overflow-hidden">
          <div className="absolute inset-0 z-0 h-full w-full bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('https://picsum.photos/1024/1024')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 dark:from-[#111827]/90 via-slate-800/80 dark:via-[#1e1b4b]/80 to-slate-900 dark:to-[#111827]/90"></div>
          <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 w-full h-full">
            <div className="mb-10">
              <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                Ace your next interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">AI confidence.</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                The world's most advanced voice-driven practice platform. Simulate real interview scenarios and get instant, brutally honest feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;