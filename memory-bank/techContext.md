# Technical Context

## Technology Stack
- **Frontend Layer**: React.js, TailwindCSS
- **Backend Core**: Java, Spring Boot
- **Database Layer**: PostgreSQL
- **External Integration Simulation**: Isolated Spring Boot module/service (Mock Bank API)

## Development Setup
- Development driven strictly by UI screenshots (Google Stitch) provided by the System Architect.
- Backend environments will require JDK setup and PostgreSQL local/containerized instance.

## Technical Constraints & Guidelines
- **No Real SaaS**: Do not integrate real payment gateways (Stripe, PayPal, etc.).
- **Simplicity**: Keep the application logic tailored only to passing the MVP requirements. Avoid over-engineering edge cases outside the main workflow.
- **Strict Isolation**: Ensure the Mock Bank API runs on a different port or is logically/physically separated enough to require standard HTTP calls from the Main Backend, enforcing the third-party architecture simulation.

## Dependencies & Tools
- Standard Spring Boot Starter dependencies (Web, Data JPA, Security).
- HTTP Client (Spring WebClient or RestTemplate).
- React Router for frontend navigation.
- TailwindCSS for utility-first styling based on designs.
