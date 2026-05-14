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
- [x] **Cards:** Add 16-digit client-side validation before linking a card.
- [x] **Cards:** Add visual success feedback (e.g., toast notification) after detecting subscriptions.
- [x] **Cards:** Refactor "Add Card" flow to select a Bank first (like in the dashboard design). Show Mock Bank as active, and 2-3 dummy banks that show a "Not yet supported" warning when clicked.
- [x] **Cards:** Activate or remove the "Manage Credentials" button in the Security Status section.
- [x] **Analytics:** Remove hardcoded mock data and integrate with backend statistics endpoints.
- [x] **Analytics:** Activate "Weekly", "Monthly", "Yearly" toggle buttons.
- [x] **Analytics:** Activate or remove the three-dot menu on "Monthly Spending Trend" (e.g., add options like View All Data, Monthly, Yearly).
- [x] **Subscriptions:** Ensure top statistics (Total Monthly Spending, Active Services) dynamically calculate based on fetched subscriptions.
- [x] **Subscriptions:** Fix UI state to instantly reflect "Cancelled" status upon successful cancellation without needing a manual refresh.
- [x] **Subscriptions:** Ensure persistent cancellation state; if a card is re-linked, cancelled subscriptions should still show as "Cancelled" in Subscriptions page (but stay hidden in Dashboard Recent Preview). *Note: Ensure this doesn't break card deletion.*

- [x] **Settings:** Fix hardcoded profile data and ensure App Preferences persist changes to the database.
- [x] **Settings (Fix):** Investigate and fix why App Preferences (Dark Mode, Currency, etc.) are not correctly persisting in the database across sessions. (Fixed by expanding AuthResponse and ensuring full sync between Frontend and Backend).
- [x] **Settings (UX):** Implement "Save-on-change" behavior for all preferences (toggles and dropdowns), removing the need for a manual "Save Changes" button in the Preferences section.
- [x] **Settings (Notifications):** Remove "Desktop Notification" option. Focus on "Email Alerts" and the existing in-app Notification Inbox.
- [x] **Settings (Dark Mode):** Implement full Dark Mode support using Tailwind `dark:` classes, synchronized with user backend preference.
- [x] **Settings (Currency - Advanced):** 
    - [x] Implement `CurrencyConversionService` in Backend Core using a real exchange rate API.
    - [x] Update all financial views (Dashboard Summary, Subscriptions List, Analytics) to dynamically convert and display values based on the user's selected currency.
- [x] **Settings:** Add logout button in Settings page.
- [x] **Settings (Security):** Make "Update Password" functional (needs backend `POST /api/user/change-password` and frontend validation).
- [ ] **Settings (Security):** Make "Disable 2FA" toggle functional (needs backend endpoint).
- [ ] **Settings (Security):** Fetch "Active Sessions" from backend instead of hardcoded MacBook/iPhone data, and activate "Log out all devices".
- [ ] **Settings (Security):** Fix "Delete Forever" button so it actually deletes the account via backend instead of just logging out locally.
- [x] **Auth:** Improve Registration error handling (e.g., gracefully showing field errors without clearing form).

<!-- Test Sonuçları (Yorum Satırı) -->
### Auth Testing Issues (Browser Subagent Tespitleri) - ÇÖZÜLDÜ ✅
- [x] **Register (Kayıt) Akışı**: `/register` sayfasında form gönderildiğinde 500 hatası alınıyordu. Backend logları incelendi, veritabanı bağlantı havuzu (HikariCP) ile ilgili geçici bir asılı kalma (transient state) durumu tespit edildi. Backend yeniden başlatılarak ve bağlantılar sıfırlanarak sorun giderildi. Şu anda başarılı bir şekilde 201 Created ve JWT dönüyor.
- [x] **Login (Giriş) Akışı**: Aynı nedenden dolayı alınan 500 hatası çözüldü. Şu anda doğru kimlik bilgileriyle 200 OK ve JWT token başarıyla alınıyor.
- [x] **Sonuç**: Backend'deki asılı kalan process kill edilip yeniden başlatıldı. DB şema uyumsuzlukları ve JWT oluşturma aşamaları test edildi; herhangi bir kod veya konfigürasyon hatası bulunmadı. Doğrudan API üzerinden ve frontend üzerinden sorunsuz çalışıyor.

## Phase 6: Advanced Improvements (Future Scope)
- [ ] **Security:** Migrate JWT storage from `localStorage` to **HttpOnly Cookies** to prevent XSS-based token theft.
- [ ] **Performance (Caching):** Implement **Redis** or Spring Cache for storing frequently accessed exchange rates and user subscription summaries.
- [ ] **Stability (Rate Limiting):** Implement **Spring Security Rate Limiter** or Bucket4j to protect auth endpoints (login/register) from brute-force attacks.
- [ ] **Database Optimization:** Add **DB Indexes** to frequently queried columns like `user_id`, `card_number`, and `transaction_date` for faster data retrieval.
- [ ] **Reliability (Async Tasks):** Use a **Message Queue** (e.g., RabbitMQ or simple Spring `@Async`) for handling non-blocking tasks like sending Email Alerts.
- [ ] **Infrastructure:** Prepare the app for **Load Balancing** (Nginx) and containerization with **Docker** for production readiness.

