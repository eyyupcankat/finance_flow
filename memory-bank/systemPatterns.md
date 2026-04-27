# System Patterns

## Architecture Overview
The project follows a standard modern Full-Stack architecture but incorporates a specific microservice-like integration pattern to satisfy the project requirements.

### 1. Frontend (React + TailwindCSS)
- Acts as the presentation layer.
- Components are built strictly visually based on provided Google Stitch screenshots.
- Communicates exclusively with the Main Backend via REST APIs.

### 2. Main Backend (Java + Spring Boot)
- Houses the core business logic.
- Serves as the intermediary between the frontend client and the banking data.
- Handles data parsing, analysis (filtering `is_recurring=true`), and database interactions.

### 3. Mock Bank API (Isolated Service Integration)
- **CRITICAL RULE**: This is not just a standard internal service or mock class within the main backend. 
- It must be architected to simulate an entirely isolated, third-party bank server.
- The Main Backend must perform actual HTTP requests (e.g., using `RestTemplate` or `WebClient`) over a network to communicate with this Mock API, just as it would with a real external banking provider.

## Key Technical Decisions
- **Database**: PostgreSQL will be used to store any necessary persistent data (e.g., user details, parsed subscriptions, or caching mechanism if required).
- **Security & Networking**: 
  - Implementation of standard CORS policies so the React frontend can talk to the Spring Boot backend.
  - JWT (JSON Web Tokens) for basic authentication/authorization if user sessions are required.
- **Frontend Approach**: Visual-first development. No code generation starts until the exact screenshot is analyzed.
