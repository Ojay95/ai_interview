# System Design & Data Modeling

## 1. Domain Entities
### User & Subscription
- **User**: ID, Email, PasswordHash, OnboardingStatus, PlanType (FREE, PRO, ELITE).
- **Subscription**: StripeID, Status, CurrentPeriodEnd, RemainingTokens.

### Interview Session
- **Session**: ID, UserID, Role, Level, StartTime, EndTime, OverallScore.
- **Transcript**: SessionID, SenderType (AI/USER), MessageContent, AudioRefURL.
- **Feedback**: SessionID, CategoryScores (JSON), ImprovementBulletPoints.

### CV Analysis
- **Resume**: ID, UserID, FileName, S3_Key, UploadDate.
- **AnalysisReport**: ResumeID, MatchScore, KeywordsFound, KeywordsMissing, AIRecoJSON.

## 2. Scalability Strategy
### Database Partitioning
- Partition the `Transcript` table by `created_at` (monthly) to maintain query performance as history grows to millions of rows.

### Redis for "Live" State
- Use Redis to store active `InterviewSession` metadata. If a server node crashes, another node can resume the state tracking of the session duration.

## 3. AI Integration Strategy
- **Prompt Templating**: Store prompts in the backend (Database or Config Server) rather than hardcoded in the frontend. This allows "Over-the-Air" (OTA) updates to AI behavior without redeploying the app.
- **Token Tracking**: Middleware to intercept AI responses, count tokens, and decrement user quota in real-time.

## 4. Real-time Audio Handling
- While the Frontend interacts with Gemini Live API via WebSockets, the Backend provides **Session Tokens**.
- The Backend generates a ephemeral, signed JWT that authorizes the frontend to talk to Google for exactly the duration of the interview (e.g., 15 mins).