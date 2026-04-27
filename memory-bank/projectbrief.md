# Project Brief: FinTrack

## Overview
FinTrack is an "Internet Programming" university course project. It is a user-centric financial tracking and expense comparison system designed as a working Minimum Viable Product (MVP). 

## Core Rules & Constraints
- **Scope Limit**: The project must not be unnecessarily complicated. There will be NO real SaaS billing, NO actual payment integrations, and NO real application subscription setups to sell the app.
- **Objective**: Deliver a clean, functional MVP sufficient to pass the university course.

## Key Features & Workflow
- **Authentication**: Login/Register is mandatory. Supports three methods: Email/Password, Google OAuth, GitHub OAuth.
- **Input**: Authenticated users add virtual card numbers to their account.
- **Card Management**: Cards are persisted per user and can be deleted.
- **Data Retrieval**: The system fetches transaction data from the Mock Bank API for each stored card.
- **Analysis & Detection**: The system analyzes the transactions, identifying those marked with `is_recurring=true` (e.g., Netflix, Spotify).
- **Persistence**: Detected subscriptions are saved to the PostgreSQL database.
- **Output**: Detected subscriptions are flagged and displayed separately as "Auto-Detected Subscriptions".
- **Cancel Action**: Users can press a "Cancel Subscription" button which triggers a mock cancellation request to the Mock Bank API and removes the subscription from the UI and database.

## Mock Bank Test Card Numbers (Finalized)
| Card Number         | Behavior                                    |
|---------------------|---------------------------------------------|
| `4111000000000000`  | Returns a full, rich transaction dataset (with recurring items) |
| `4222000000000000`  | Returns transactions with NO recurring items |
| `4333000000000000`  | Returns a minimal single-transaction dataset |
| `9999000000000000`  | Triggers a `404 Card Not Found` error response |

## Project Folder Structure (Finalized)
```
/int_prog_project
  /frontend          → React + TailwindCSS
  /backend-core      → Main Spring Boot App (business logic, auth, DB)
  /mock-bank-api     → Isolated Spring Boot Mock Bank Server (separate port)
  /memory-bank       → Project documentation
```

## Roles
- **System Architect (User)**: Manages the project, provides UI designs via Google Stitch screenshots, and reviews code.
- **Full-Stack AI Developer (Cascade)**: Implements the system architecture, writes code based strictly on the provided designs and rules, and manages the project's Memory Bank.
