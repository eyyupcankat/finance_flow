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
- [x] Initialize the Main Spring Boot project in `/backend-core` (runs on port **8080**).
- [x] Setup PostgreSQL connection and JPA entities:
  - `User` (id, email, name, provider [LOCAL/GOOGLE/GITHUB], providerId, passwordHash, createdAt)
  - `VirtualCard` (id, user_id FK, cardNumber, label, addedAt)
  - `Subscription` (id, user_id FK, card_id FK, name, amount, currency, billingCycle, detectedAt, status [ACTIVE/CANCELLED])
- **NOTE**: Copy `.env.example` → `.env` and fill in DB credentials + JWT secret + OAuth2 client IDs before running.
- [x] Implement Security configuration:
  - CORS policy: allow `http://localhost:5173` (React dev server)
  - Spring Security filter chain (stateless, JWT + OAuth2)
  - JWT generation, validation, and refresh logic (jjwt 0.12.6)
  - OAuth2 integration for Google and GitHub (Spring Security OAuth2 Client)
  - `UserPrincipal` implements both `UserDetails` and `OAuth2User`
  - OAuth2 success → JWT generated → redirect to `http://localhost:5173/oauth2/callback?token=...`
- [x] Implement `WebClient` HTTP client to call the Mock Bank API at `http://localhost:8081`.
- [x] Implement core business logic services:
  - `CardService`: Add/delete/list cards per user
  - `SubscriptionAnalysisService`: Call Mock Bank -> filter `is_recurring=true` -> persist to DB -> return result
  - `SubscriptionCancellationService`: Call Mock Bank cancel endpoint -> update DB status to CANCELLED
- [x] Develop all REST API endpoints for Frontend:
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
- [x] Connect React frontend to Main Backend endpoints.
- [x] End-to-end test: Login -> Add Card -> Detect Subscriptions -> Cancel Subscription.
- [x] Test all 4 Mock Bank card scenarios on the frontend.
- [x] Implement error handling: Invalid Card, API timeout, Unauthorized, OAuth failure.
- [ ] Final UI review against original screenshots.
- [ ] Clean up code, finalize for course delivery.

## Known Issues
- None currently (Project in planning/design phase).

### Phase 5: Bug Fixes & Refinements
- [x] **Global:** Fix hardcoded User Profile name/avatar in Topbar to reflect logged-in user.
- [x] **Global:** Remove the floating "+" button on the bottom right.
- [x] **Topbar:** Activate the "?" (Help) button to open a modal/dropdown with dummy FAQ content (questions & answers).
- [x] **Topbar:** Activate the Notifications button to open a dropdown (show "No notifications" if empty, or format notifications if present).
- [x] **Sidebar:** Change "Upgrade Pro Plan" button behavior. Instead of redirecting to login, route to a new Upgrade page showing Free vs Pro plan comparison with dummy features.
- [x] **Dashboard:** Connect "Total Balance", "Monthly Income", and "Monthly Expenses" metrics to backend data.
- [x] **Dashboard:** Fetch "Recent Transactions" dynamically from backend instead of hardcoded data.
- [x] **Dashboard:** Activate "View All" button in Recent Transactions (should open a full transactions view/modal with pagination, e.g., 10 per page).
- [x] **Dashboard:** Activate or remove the search bar in the Topbar.
- [x] **Dashboard:** Update "Subscriptions Preview" to show actual detected subscriptions.
- [ ] **Cards:** Add 16-digit client-side validation before linking a card.
- [ ] **Cards:** Add visual success feedback (e.g., toast notification) after detecting subscriptions.
- [ ] **Cards:** Refactor "Add Card" flow to select a Bank first (like in the dashboard design). Show Mock Bank as active, and 2-3 dummy banks that show a "Not yet supported" warning when clicked.
- [ ] **Cards:** Activate or remove the "Manage Credentials" button in the Security Status section.
- [ ] **Subscriptions:** Ensure top statistics (Total Monthly Spending, Active Services) dynamically calculate based on fetched subscriptions.
- [ ] **Subscriptions:** Fix UI state to instantly reflect "Cancelled" status upon successful cancellation without needing a manual refresh.
- [ ] **Analytics:** Remove hardcoded mock data and integrate with backend statistics endpoints.
- [ ] **Analytics:** Activate "Weekly", "Monthly", "Yearly" toggle buttons.
- [ ] **Analytics:** Activate or remove the three-dot menu on "Monthly Spending Trend" (e.g., add options like View All Data, Monthly, Yearly).
- [ ] **Settings:** Fix hardcoded profile data and ensure App Preferences persist changes to the database.
- [ ] **Settings (Security):** Make "Update Password" functional (needs backend `POST /api/user/change-password` and frontend validation).
- [ ] **Settings (Security):** Make "Disable 2FA" toggle functional (needs backend endpoint).
- [ ] **Settings (Security):** Fetch "Active Sessions" from backend instead of hardcoded MacBook/iPhone data, and activate "Log out all devices".
- [ ] **Settings (Security):** Fix "Delete Forever" button so it actually deletes the account via backend instead of just logging out locally.
- [ ] **Auth:** Improve Registration error handling (e.g., gracefully showing field errors without clearing form).
