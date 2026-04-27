# 🎙️ MockInterview.ai 

**Master your next interview with AI-powered confidence.**

MockInterview.ai is a world-class, responsive web platform designed to help job seekers prepare for interviews through high-fidelity, real-time voice simulations. Leveraging Google's latest **Gemini 2.5 and 3.0 models**, the platform offers a personalized coaching experience that adapts to any job description.

---

## 🚀 Key Features

### 1. Real-Time Voice Conversations
*   **Gemini Live API**: Uses the `gemini-2.5-flash-native-audio` model for low-latency, human-like verbal interactions.
*   **Adaptive Persona**: Features "Sarah," an AI Lead HR Manager who probes technical and behavioral skills based on your target role.
*   **Live Transcription**: Real-time display of both user and AI turns during the session.

### 2. Intelligent CV Analysis & Editor
*   **ATS Compatibility Scoring**: Upload your resume and a job description to get a match percentage and identified keyword gaps.
*   **Interactive Resume Editor**: A mobile-optimized A4 mockup editor allowing you to refine your layout and content based on AI suggestions.
*   **Keyword Optimization**: AI-driven recommendations for adding missing industry-specific skills.

### 3. Deep Performance Analytics
*   **STAR Method Feedback**: Every interview answer is analyzed for Situation, Task, Action, and Result.
*   **Score Breakdown**: Performance metrics across Technical Knowledge, Communication, Cultural Fit, and Confidence.
*   **Improved Answer Generation**: Provides "Platinum Standard" versions of your answers to help you improve.

### 4. Enterprise-Grade UI/UX
*   **Dark-First Aesthetic**: A sleek, high-contrast design optimized for focus.
*   **Mobile Optimized**: Responsive layouts across all critical flows, from the dashboard to the resume editor.
*   **Tiered Subscription Model**: Support for Free, Pro, and Elite tiers with varying session durations and features.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19 (Functional Components, Hooks)
*   **Styling**: Tailwind CSS (JIT, Plugins)
*   **AI Engine**: [Google Generative AI SDK (@google/genai)](https://www.npmjs.com/package/@google/genai)
*   **Voice Processing**: Web Audio API (PCM-16 encoding/decoding)
*   **Icons**: Material Symbols Outlined
*   **Persistence**: Browser LocalStorage for session history and user state.

---

## 📦 Project Structure

```text
├── App.tsx                 # Root application component and router
├── index.tsx               # Entry point for React
├── index.html              # HTML shell with Tailwind and ImportMaps
├── types.ts                # Global TypeScript definitions
├── constants.tsx           # Shared constants and UI components (Logo)
├── metadata.json           # App permissions and configuration
├── services/
│   └── geminiService.ts    # AI utilities, Audio processing, and API wrappers
└── screens/
    ├── LandingScreen.tsx   # Entry point with value proposition
    ├── DashboardScreen.tsx # User hub and performance tracking
    ├── InterviewScreen.tsx # High-fidelity voice interview interface
    ├── CVLandingScreen.tsx # Resume upload and management
    ├── CVEditorScreen.tsx  # Responsive A4 resume editing tool
    └── AnalysisScreen.tsx  # Detailed post-interview feedback
```

---

## ⚙️ Setup & Installation

### Prerequisites
*   A modern browser (Chrome/Edge/Firefox) with Microphone access enabled.
*   A [Google AI Studio API Key](https://aistudio.google.com/app/apikey).

### Environment Variables
The application expects the following environment variable:
*   `process.env.API_KEY`: Your Google Gemini API Key.

### Local Development
Since this project uses ESM modules via ImportMaps, you can serve it with any static file server:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/mock-interview-ai.git
    cd mock-interview-ai
    ```

2.  **Serve the application**:
    If you have Python:
    ```bash
    python -m http.server 8000
    ```
    Or using Node's `serve`:
    ```bash
    npx serve .
    ```

3.  **Access the app**:
    Open `http://localhost:8000` in your browser.

---

## 🤖 AI Implementation Notes

### Voice Processing
The platform converts browser `Float32Array` audio data into **16-bit PCM** format for the Gemini Live API. It uses a `ScriptProcessorNode` (configured for 16kHz) to stream input and the `AudioContext.decodeAudioData` paradigm for smooth playback of model turns.

### Context Windows
Interview sessions are seeded with a detailed `systemInstruction` that includes:
*   Candidate's experience level.
*   Target job requirements.
*   Tier-based duration limits (Basic: 10m, Pro: 45m, Elite: 60m).

---

## 📄 License
MIT License - Copyright (c) 2024 MockInterview.ai

---

*Built with ❤️ for professionals aiming for the stars.*
