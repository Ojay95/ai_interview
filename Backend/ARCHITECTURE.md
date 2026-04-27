# Backend Architecture - MockInterview.ai

## Core Principles
1. **Scalability**: Designed as a **Modular Monolith** capable of transitioning to **Microservices** as traffic grows.
2. **Security**: Zero-trust approach using Spring Security and JWT with asymmetric keys (RSA).
3. **Resilience**: Implementation of Circuit Breakers (Resilience4j) for AI and Payment API integrations.
4. **Performance**: Aggressive caching strategy for analytics and user configurations.

## High-Level Tech Stack
- **Runtime**: Java 21 (LTS)
- **Framework**: Spring Boot 3.4+
- **Security**: Spring Security + OAuth2 / JWT
- **Database**: PostgreSQL (Primary Relational)
- **Caching/PubSub**: Redis (Session metadata, rate-limiting)
- **Object Storage**: AWS S3 or MinIO (Resume PDF/Docx storage)
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Monitoring**: Prometheus & Grafana via Spring Actuator

## System Flow
1. **Request Entry**: Nginx/Load Balancer handles SSL termination.
2. **API Gateway**: Spring Cloud Gateway (or internal Filter) handles rate-limiting and Auth verification.
3. **Service Layer**: 
    - `UserService`: Manages profile and onboarding states.
    - `InterviewService`: Tracks session lifecycle, durations, and transcript persistence.
    - `CVService`: Handles resume metadata, versioning, and processing hooks.
    - `AIService`: Proxies and logs interactions with the Google GenAI SDK (Gemini).
4. **Data Persistence**: Async writing to DB for analytics to ensure low latency for the user.