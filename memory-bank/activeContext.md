# Active Context

## Current Work Focus
- Architecture is fully finalized. Awaiting the first Google Stitch UI screenshot to commence frontend React development.

## Recent Changes
- Finalized all core architectural decisions with the System Architect.
- Updated `projectbrief.md` with auth flow, card management, subscription persistence, cancel feature, test card numbers, and folder structure.
- Rebuilt `progress.md` with a detailed 4-phase full-stack roadmap.

## Finalized Decisions (Locked)
- **Auth**: Mandatory login/register via Email/Password + Google OAuth + GitHub OAuth.
- **Cards**: Persisted per user in DB, deletable via UI.
- **Subscriptions**: Saved to PostgreSQL after detection, cancellable via "Cancel Subscription" button.
- **Mock Bank Test Cards**: 4 scenarios defined (`4111...`, `4222...`, `4333...`, `9999...`).
- **Folder Layout**: `/frontend`, `/backend-core`, `/mock-bank-api`.
- **Ports**: Frontend → 5173, Backend-core → 8080, Mock Bank API → 8081.

## Next Steps
1. Receive Google Stitch UI screenshots from the System Architect.
2. Analyze each screen's layout, typography, color palette, and component structure.
3. Initialize `/frontend` (Vite + React + TailwindCSS).
4. Build pages and components strictly matching the screenshots.
