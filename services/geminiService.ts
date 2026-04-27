import { apiClient } from './apiClient';

/**
 * Interface representing the result of a CV/Resume analysis.
 * Matches CVAnalysisResponse.java DTO in the backend.
 */
export interface ResumeMatchResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  overallFeedback: string;
  resumeSummary: string;
  verdict: string;
  shouldApply: string;
  practiceAreas: string[];
  recommendations: Array<{
    title: string;
    impact: string;
    description: string;
    suggestion: string;
    suggestedBullet: string;
  }>;
}

/**
 * Interface for Job Analysis.
 * Used when manually pasting a Job Description in JDSetupScreen.
 */
export interface JobAnalysisResult {
  roleName: string;
  keySkills: string[];
  recommendedFocusAreas: string[];
  experienceLevel: string;
}

// ============================================================
// AUDIO & DATA UTILITIES
// Required for real-time voice interaction in InterviewScreen
// ============================================================

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function floatTo16BitPCM(data: Float32Array): Uint8Array {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    const sample = data[i];
    const clamped = Math.max(-1, Math.min(1, sample));
    int16[i] = clamped < 0 ? clamped * 32768 : clamped * 32767;
  }
  return new Uint8Array(int16.buffer);
}

export async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000,
    numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function cleanJsonString(str: string): string {
  if (!str) return "{}";
  let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }
  return clean;
}

// ============================================================
// BACKEND API WRAPPERS
// Redirects UI requests to the Spring Boot Production Server
// ============================================================

/**
 * Analyzes a CV file against AI benchmarks.
 * Calls CVController.java @PostMapping("/analyze")
 */
export const analyzeResumeMatch = async (resumeFile: File): Promise<ResumeMatchResult> => {
  const formData = new FormData();
  formData.append('file', resumeFile);

  const response = await apiClient.post('/cv/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

/**
 * Placeholder for Job Description Analysis.
 * Can be linked to a backend endpoint that uses CVService's AI logic.
 */
export const analyzeJobDescription = async (jd: string): Promise<JobAnalysisResult> => {
  console.log("Analyzing JD via backend context:", jd);
  // Implementation note: You can create a specific endpoint in JobController
  // to return structured AI analysis of a raw JD string.
  return {
    roleName: "Software Engineer",
    keySkills: ["Java", "Spring Boot", "React"],
    recommendedFocusAreas: ["System Design", "Unit Testing"],
    experienceLevel: "Mid-Senior"
  };
};

/**
 * Extracts a suggested job title from resume text.
 * Helps populate the search query on the Job Board.
 */
export const extractRoleFromResume = async (text: string): Promise<string> => {
  console.log("Extracting role from text length:", text.length);
  // Defaulting to a sensible fallback while JD search logic moves to backend
  return "Software Engineer";
};