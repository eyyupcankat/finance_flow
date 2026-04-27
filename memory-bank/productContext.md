# Product Context

## Why This Project Exists
FinTrack is developed as a practical, hands-on university project for an "Internet Programming" course. It aims to demonstrate full-stack web development skills while solving a realistic, user-centric financial problem.

## Problems It Solves
Users often lose track of their various digital subscriptions (Netflix, Spotify, gym memberships, etc.) linked to their credit cards. FinTrack solves this by automatically categorizing and highlighting these recurring expenses, providing immediate visibility into subscription-based spending.

## How It Should Work
1. The user accesses the web application.
2. The user enters a virtual card number into the intuitive UI.
3. Behind the scenes, the main backend communicates with an external, isolated Mock Bank API to retrieve simulated transaction data.
4. The main backend filters this data to find transactions flagged as recurring.
5. The frontend displays these specific transactions in a clean, isolated list of "Auto-Detected Subscriptions".

## User Experience Goals
- **Pixel-Perfect UI**: The frontend must strictly match the Google Stitch designs provided by the System Architect.
- **Simplicity**: A clean, modern interface using TailwindCSS that avoids overwhelming the user with unnecessary financial jargon or complex SaaS elements.
- **Responsiveness**: Immediate visual feedback when processing the virtual card number and displaying the results.
