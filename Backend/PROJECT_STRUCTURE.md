# Spring Boot Project Structure

Recommended structure following **Domain-Driven Design (DDD)** patterns:

```text
com.mockinterview.api
├── common                  # Shared utils, exceptions, and constants
│   ├── config              # Global configs (Redis, Security, CORS)
│   ├── exception           # Custom GlobalExceptionHandler
│   └── util                # JWTUtils, DateUtils
│
├── core                    # Business logic / Domain Layer
│   ├── user                # User & Auth Domain
│   │   ├── dto
│   │   ├── entity
│   │   ├── repository
│   │   └── service
│   │
│   ├── interview           # Interview Logic Domain
│   │   ├── controller      # REST endpoints
│   │   ├── dto             # Request/Response objects
│   │   ├── entity          # JPA Entities
│   │   ├── repository      # Spring Data JPA interfaces
│   │   └── service         # @Service logic
│   │
│   ├── cv                  # CV & ATS Analysis Domain
│   │   ├── controller
│   │   ├── service
│   │   └── model
│   │
│   └── ai                  # Gemini / LLM Integration Layer
│       ├── clients         # Feign or WebClient for External APIs
│       ├── prompts         # Prompt templates
│       └── service
│
├── infrastructure          # External adapters
│   ├── storage             # S3 / File System Implementation
│   ├── payment             # Stripe Integration
│   └── messaging           # Kafka/RabbitMQ Producers
│
└── MockInterviewApplication.java
```

## Build Configuration (Maven/Gradle)
- `spring-boot-starter-web`: REST APIs.
- `spring-boot-starter-data-jpa`: Database interactions.
- `spring-boot-starter-security`: Auth & Protection.
- `spring-boot-starter-validation`: DTO Validation.
- `spring-boot-starter-data-redis`: Caching.
- `spring-ai-google-gemini-spring-boot-starter`: Native Gemini integration.
```