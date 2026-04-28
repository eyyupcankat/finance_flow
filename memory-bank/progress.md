# Progress & Roadmap

## Current Status
- **Phase**: Phase 3 — Main Backend
- **What Works**: Full React frontend (7 pages). Mock Bank API fully built — PostgreSQL-backed, seeded test cards, GET transactions + POST cancel endpoints.
- **What's Left to Build**: Main Backend (Spring Boot + PostgreSQL + JWT + OAuth2), Integration.

## Detailed Roadmap (Full-Stack Development Plan)

### Phase 1: Frontend UI/UX Foundation ✅ COMPLETED
- [x] Receive Google Stitch screenshots from the System Architect.
- [x] Initialize React project (Vite) in `/frontend` with TailwindCSS.
- [x] Setup React Router with the following routes:
  - [x] `/login` → Login page (Email/Pass, Google, GitHub)
  - [x] `/register` → Register page (designed consistent with Login — not in screenshots)
  - [x] `/dashboard` → Main user dashboard (protected route)
  - [x] `/cards` → Manage virtual cards (protected route)
  - [x] `/subscriptions` → Detected subscriptions list (protected route)
  - [x] `/analytics` → Analytics overview (protected route)
  - [x] `/settings` → Account settings (protected route)
- [x] Build pixel-perfect pages based on Google Stitch screenshots.
- [x] Build reusable components: Sidebar, Topbar, Layout, ProtectedRoute.
- [x] Implement Axios API service layer with JWT token injection (interceptors).
- [x] Implement frontend Auth context/state management (React Context).
- **NOTE**: Node.js must be installed and `npm install` must be run in `/frontend` before running the dev server.

### Phase 2: Mock Bank API (Isolated Third-Party Simulation) ✅ COMPLETED
- [x] Initialize an isolated Spring Boot project in `/mock-bank-api` (runs on port **8081**).
- [x] Define hardcoded test card scenarios (seeded via DataInitializer on first startup):
  - `4111000000000000` → Full dataset, multiple recurring transactions (Netflix, Spotify, Amazon Prime, Adobe CC + one-time purchases)
  - `4222000000000000` → Transactions with NO recurring items (Starbucks, H&M, Pizza Hut, Shell)
  - `4333000000000000` → Minimal, single-transaction dataset (one coffee purchase)
  - `9999000000000000` → Returns HTTP 404 Card Not Found (handled via CardNotFoundException)
- [x] Implement `GET /api/v1/bank/cards/{cardNumber}/transactions` endpoint.
- [x] Implement `POST /api/v1/bank/cards/{cardNumber}/cancel` endpoint (persists CancellationRecord, returns success).
- [x] Ensure the Mock API has no dependency on the main backend — fully self-contained.
- **NOTE**: Requires PostgreSQL DB named `mockbank`. Copy `.env.example` → `.env` and fill in credentials.

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
