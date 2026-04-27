
import React from 'react';
import { AudioLines } from 'lucide-react';

export const APP_NAME = "MockInterview.ai";

export const GEMINI_MODELS = {
  // Use gemini-3-flash-preview for basic text and analysis tasks
  TEXT_ANALYSIS: 'gemini-3-flash-preview',
  // Use gemini-2.5-flash-native-audio-preview-12-2025 for real-time conversation
  LIVE_INTERVIEW: 'gemini-2.5-flash-native-audio-preview-12-2025',
} as const;

export const ROUTES = {
  LANDING: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  DASHBOARD: '/dashboard',
  ONBOARDING: '/onboarding',
  JD_SETUP: '/jd-setup',
  INTERVIEW: '/interview',
  ANALYSIS: '/analysis',
  CV_LANDING: '/cv',
  CV_ANALYSIS: '/cv/analysis',
  CV_EDITOR: '/cv/editor',
  JOB_BOARD: '/jobs',
  SETTINGS: '/settings',
  SUBSCRIPTION: '/subscription',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  CONTACT: '/contact'
} as const;

export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
  ELITE: 'elite'
} as const;

export const Logo: React.FC<{ className?: string }> = ({ className = "size-9" }) => (
  <div className={`flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 ${className}`}>
    <AudioLines className="size-5 lg:size-6" />
  </div>
);

