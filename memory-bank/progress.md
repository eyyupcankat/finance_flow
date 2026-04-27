# Progress & Roadmap

## Current Status
- **Phase**: Initialization & Planning
- **What Works**: Memory Bank initialized. Project guidelines established.
- **What's Left to Build**: Everything (Frontend, Main Backend, Mock Bank API, Database Integrations).

## Detailed Roadmap (Full-Stack Development Plan)

### Phase 1: Frontend UI/UX Foundation (Pending Screenshots)
- [ ] Receive Google Stitch screenshots from the System Architect.
- [ ] Initialize React project (Vite or CRA) with TailwindCSS.
- [ ] Implement foundational routing (React Router).
- [ ] Build pixel-perfect "Virtual Card Input" interface based on designs.
- [ ] Build "Auto-Detected Subscriptions" dashboard/list interface based on designs.
- [ ] Implement frontend state management and API service layers (Axios/Fetch) for future backend integration.

### Phase 2: Mock Bank API (Third-Party Simulation)
- [ ] Initialize an isolated Spring Boot application (or explicitly separated server module running on a different port).
- [ ] Create mock transaction dataset (JSON) containing diverse transactions, specifically ensuring some have `is_recurring=true` (e.g., Netflix, Spotify).
- [ ] Develop REST endpoint: `GET /api/v1/bank/cards/{cardNumber}/transactions`.
- [ ] Test Mock API independently to ensure it functions as a standalone web service.

### Phase 3: Main Backend Architecture & Security
- [ ] Initialize the Main Spring Boot application.
- [ ] Setup PostgreSQL database connection and JPA entities (User, Card, Subscription metrics).
- [ ] Implement basic Security setup: CORS configuration (to allow React local dev), Spring Security, and JWT for session management.
- [ ] Develop internal HTTP Client (using `WebClient` or `RestTemplate`) to send requests to the Mock Bank API.
- [ ] Implement core business logic service:
  - Receive card number from Frontend.
  - Call Mock Bank API.
  - Parse JSON response.
  - Filter transactions where `is_recurring=true`.
  - Format response and save necessary metrics to PostgreSQL.
- [ ] Develop API endpoints for Frontend consumption (e.g., `POST /api/subscriptions/detect`).

### Phase 4: Integration, Testing, and Delivery
- [ ] Connect React frontend API calls to the Main Backend endpoints.
- [ ] Conduct end-to-end flow testing: Enter Card -> Main Backend -> Mock Bank API -> Main Backend Analysis -> Frontend Display.
- [ ] Implement error handling workflows (e.g., Invalid Card, Mock API Timeout, CORS issues).
- [ ] Final UI/UX review against original screenshots.
- [ ] Polish code, remove unnecessary boilerplate, and finalize MVP for course delivery.

## Known Issues
- None currently (Project in setup phase).
