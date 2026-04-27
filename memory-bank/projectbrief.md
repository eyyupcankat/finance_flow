# Project Brief: FinTrack

## Overview
FinTrack is an "Internet Programming" university course project. It is a user-centric financial tracking and expense comparison system designed as a working Minimum Viable Product (MVP). 

## Core Rules & Constraints
- **Scope Limit**: The project must not be unnecessarily complicated. There will be NO real SaaS billing, NO actual payment integrations, and NO real application subscription setups to sell the app.
- **Objective**: Deliver a clean, functional MVP sufficient to pass the university course.

## Key Features & Workflow
- **Input**: Users will input a virtual card number into the system.
- **Data Retrieval**: The system fetches transaction data associated with this card.
- **Analysis & Detection**: The system analyzes the transactions, identifying those marked with `is_recurring=true` (e.g., Netflix, Spotify).
- **Output**: These identified recurring expenses are flagged and displayed separately as "Auto-Detected Subscriptions".

## Roles
- **System Architect (User)**: Manages the project, provides UI designs via Google Stitch screenshots, and reviews code.
- **Full-Stack AI Developer (Cascade)**: Implements the system architecture, writes code based strictly on the provided designs and rules, and manages the project's Memory Bank.
