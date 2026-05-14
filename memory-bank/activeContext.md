# Active Context

## Current Work Focus
- Architecture is fully finalized. Awaiting the first Google Stitch UI screenshot to commence frontend React development.

## Recent Changes
- Finalized all core architectural decisions with the System Architect.
- Updated `projectbrief.md` with auth flow, card management, subscription persistence, cancel feature, test card numbers, and folder structure.
- Rebuilt `progress.md` with a detailed 4-phase full-stack roadmap.
- **New Discovery**: Explored "App Preferences" in Settings with a new test account. Confirmed that preferences (Dark Mode, Currency, Notifications) persist in the database but lack frontend implementation.
- **Roadmap Update**: Added specific goals to `progress.md` for Dark Mode, Dynamic Currency formatting, and Notification logic.

## Finalized Decisions (Locked)
- **Auth**: Mandatory login/register via Email/Password + Google OAuth + GitHub OAuth.
- **Cards**: Persisted per user in DB, deletable via UI.
- **Subscriptions**: Saved to PostgreSQL after detection, cancellable via "Cancel Subscription" button.
- **Mock Bank Test Cards**: 4 scenarios defined (`4111...`, `4222...`, `4333...`, `9999...`).
- **Folder Layout**: `/frontend`, `/backend-core`, `/mock-bank-api`.
- **Ports**: Frontend → 5173, Backend-core → 8080, Mock Bank API → 8081.

## Next Steps
1. **Persistence Debugging**: Investigate why preferences are not saving correctly in the database despite the API calls.
2. **Currency Engine**: Research and implement a basic `CurrencyConversionService` in the backend core to handle real-world value conversions.
3. **UX Overhaul**: Refactor `SettingsPage.jsx` to remove the manual save button and implement auto-saving for toggles/dropdowns.
4. **Cleanup**: Remove "Desktop Notification" references across the stack (Entity, DTOs, Frontend).
