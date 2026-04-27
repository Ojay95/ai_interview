
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Screen } from './types.ts';
import { ROUTES } from './constants.tsx';
import { useAuthStore } from './store/useAuthStore.ts';

// Screens
import LandingScreen from './screens/LandingScreen.tsx';
import SignInScreen from './screens/SignInScreen.tsx';
import SignUpScreen from './screens/SignUpScreen.tsx';
import DashboardScreen from './screens/DashboardScreen.tsx';
import OnboardingScreen from './screens/OnboardingScreen.tsx';
import JDSetupScreen from './screens/JDSetupScreen.tsx';
import InterviewScreen from './screens/InterviewScreen.tsx';
import AnalysisScreen from './screens/AnalysisScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import SubscriptionScreen from './screens/SubscriptionScreen.tsx';
import CVLandingScreen from './screens/CVLandingScreen.tsx';
import CVAnalysisScreen from './screens/CVAnalysisScreen.tsx';
import CVEditorScreen from './screens/CVEditorScreen.tsx';
import { JobBoardScreen } from './screens/JobBoardScreen.tsx';
import PrivacyScreen from './screens/PrivacyScreen.tsx';
import TermsScreen from './screens/TermsScreen.tsx';
import ContactScreen from './screens/ContactScreen.tsx';

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to={ROUTES.SIGN_IN} replace />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleNavigate = (target: Screen) => {
    const routeMap: Record<Screen, string> = {
      [Screen.Landing]: ROUTES.LANDING,
      [Screen.SignIn]: ROUTES.SIGN_IN,
      [Screen.SignUp]: ROUTES.SIGN_UP,
      [Screen.Dashboard]: ROUTES.DASHBOARD,
      [Screen.Onboarding]: ROUTES.ONBOARDING,
      [Screen.JDSetup]: ROUTES.JD_SETUP,
      [Screen.Interview]: ROUTES.INTERVIEW,
      [Screen.Analysis]: ROUTES.ANALYSIS,
      [Screen.Settings]: ROUTES.SETTINGS,
      [Screen.Subscription]: ROUTES.SUBSCRIPTION,
      [Screen.CVLanding]: ROUTES.CV_LANDING,
      [Screen.CVAnalysis]: ROUTES.CV_ANALYSIS,
      [Screen.CVEditor]: ROUTES.CV_EDITOR,
      [Screen.JobBoard]: ROUTES.JOB_BOARD,
      [Screen.Privacy]: ROUTES.PRIVACY,
      [Screen.Terms]: ROUTES.TERMS,
      [Screen.Contact]: ROUTES.CONTACT,
      [Screen.ForgotPassword]: ROUTES.SIGN_IN,
    };
    const path = routeMap[target] || ROUTES.LANDING;
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LANDING);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white selection:bg-primary/30 transition-colors duration-300">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--toast-bg, #ffffff)',
            color: 'var(--toast-color, #1e293b)',
            border: '1px solid rgba(0,0,0,0.05)'
          },
          className: 'dark:!bg-[#1c212b] dark:!text-white dark:!border-white/10'
        }}
      />
      <Routes>
        <Route path={ROUTES.LANDING} element={<LandingScreen onNavigate={handleNavigate} />} />
        <Route path={ROUTES.SIGN_IN} element={<SignInScreen onNavigate={handleNavigate} />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUpScreen onNavigate={handleNavigate} onLogin={() => {}} />} />
        <Route path={ROUTES.PRIVACY} element={<PrivacyScreen onNavigate={handleNavigate} />} />
        <Route path={ROUTES.TERMS} element={<TermsScreen onNavigate={handleNavigate} />} />
        <Route path={ROUTES.CONTACT} element={<ContactScreen onNavigate={handleNavigate} />} />

        <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardScreen user={user} onNavigate={handleNavigate} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path={ROUTES.ONBOARDING} element={<ProtectedRoute><OnboardingScreen user={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path={ROUTES.JD_SETUP} element={<ProtectedRoute><JDSetupScreen user={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path={ROUTES.INTERVIEW} element={<ProtectedRoute><InterviewScreen user={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path={ROUTES.ANALYSIS} element={<ProtectedRoute><AnalysisScreen user={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        
        <Route path={ROUTES.CV_LANDING} element={<ProtectedRoute><CVLandingScreen user={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path={ROUTES.CV_ANALYSIS} element={<ProtectedRoute><CVAnalysisScreen user={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path={ROUTES.CV_EDITOR} element={<ProtectedRoute><CVEditorScreen user={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        
        <Route path={ROUTES.JOB_BOARD} element={<ProtectedRoute><JobBoardScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
        
        <Route path={ROUTES.SETTINGS} element={<ProtectedRoute><SettingsScreen user={user} onNavigate={handleNavigate} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path={ROUTES.SUBSCRIPTION} element={<ProtectedRoute><SubscriptionScreen user={user} onNavigate={handleNavigate} onUpdateUser={() => {}} /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
