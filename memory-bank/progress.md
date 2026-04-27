# Progress & Roadmap

## Current Status
- **Phase**: Initialization & Planning
- **What Works**: Memory Bank initialized. Project guidelines established.
- **What's Left to Build**: Everything (Frontend, Main Backend, Mock Bank API, Database Integrations).

## Detailed Roadmap (Full-Stack Development Plan)

### Phase 1: Frontend UI/UX Foundation (Pending Screenshots)
- [ ] Receive Google Stitch screenshots from the System Architect.
- [ ] Initialize React project (Vite) in `/frontend` with TailwindCSS.
- [ ] Setup React Router with the following routes:
  - `/login` → Login page (Email/Pass, Google, GitHub)
  - `/register` → Register page
  - `/dashboard` → Main user dashboard (protected route)
  - `/cards` → Manage virtual cards (protected route)
  - `/subscriptions` → Detected subscriptions list (protected route)
- [ ] Build pixel-perfect pages based on Google Stitch screenshots.
- [ ] Build reusable components: Navbar, Card, SubscriptionItem, Button, Modal.
- [ ] Implement Axios API service layer with JWT token injection (interceptors).
- [ ] Implement frontend Auth context/state management (React Context or Zustand).

### Phase 2: Mock Bank API (Isolated Third-Party Simulation)
- [ ] Initialize an isolated Spring Boot project in `/mock-bank-api` (runs on port **8081**).
- [ ] Define hardcoded test card scenarios:
  - `4111000000000000` → Full dataset, multiple recurring transactions
  - `4222000000000000` → Transactions with NO recurring items
  - `4333000000000000` → Minimal, single-transaction dataset
  - `9999000000000000` → Returns HTTP 404 Card Not Found
- [ ] Implement `GET /api/v1/bank/cards/{cardNumber}/transactions` endpoint.
- [ ] Implement `POST /api/v1/bank/cards/{cardNumber}/cancel` endpoint (mock cancellation, returns success).
- [ ] Ensure the Mock API has no dependency on the main backend — fully self-contained.

### Phase 3: Main Backend Architecture & Security
- [ ] Initialize the Main Spring Boot project in `/backend-core` (runs on port **8080**).
- [ ] Setup PostgreSQL connection and JPA entities:
  - `User` (id, email, name, provider [LOCAL/GOOGLE/GITHUB], providerId, passwordHash, createdAt)
  - `VirtualCard` (id, user_id FK, cardNumber, label, addedAt)
  - `Subscription` (id, user_id FK, card_id FK, name, amount, currency, billingCycle, detectedAt, status [ACTIVE/CANCELLED])
- [ ] Implement Security configuration:
  - CORS policy: allow `http://localhost:5173` (React dev server)
  - Spring Security filter chain
  - JWT generation, validation, and refresh logic
  - OAuth2 integration for Google and GitHub (Spring Security OAuth2 Client)
- [ ] Implement `WebClient` HTTP client to call the Mock Bank API at `http://localhost:8081`.
- [ ] Implement core business logic services:
  - `CardService`: Add/delete/list cards per user
  - `SubscriptionAnalysisService`: Call Mock Bank -> filter `is_recurring=true` -> persist to DB -> return result
  - `SubscriptionCancellationService`: Call Mock Bank cancel endpoint -> update DB status to CANCELLED
- [ ] Develop all REST API endpoints for Frontend:
  - `POST /api/auth/register` — Email/password registration
  - `POST /api/auth/login` — Email/password login, returns JWT
  - `GET /api/auth/oauth2/google` — Google OAuth redirect
  - `GET /api/auth/oauth2/github` — GitHub OAuth redirect
  - `GET /api/cards` — List user's cards
  - `POST /api/cards` — Add a virtual card
  - `DELETE /api/cards/{id}` — Delete a card
  - `POST /api/subscriptions/detect/{cardId}` — Trigger analysis for a card
  - `GET /api/subscriptions` — List all detected subscriptions for the user
  - `POST /api/subscriptions/{id}/cancel` — Cancel a subscription

### Phase 4: Integration, Testing & Delivery
- [ ] Connect React frontend to Main Backend endpoints.
- [ ] End-to-end test: Login -> Add Card -> Detect Subscriptions -> Cancel Subscription.
- [ ] Test all 4 Mock Bank card scenarios on the frontend.
- [ ] Implement error handling: Invalid Card, API timeout, Unauthorized, OAuth failure.
- [ ] Final UI review against original screenshots.
- [ ] Clean up code, finalize for course delivery.

## Known Issues
- None currently (Project in planning/design phase).
