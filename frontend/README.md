# Conance - Artisan Service Marketplace

Conance is a mobile-first marketplace platform designed to bridge the gap between clients and skilled local artisans (carpenters, plumbers, tailors, etc.). The platform leverages AI-assisted job posting and voice recording to simplify the process of finding and hiring the right professionals.

## Core Features

- **Role-Based Experience**: Tailored dashboards for both Artisans (Earnings, Requests, Portfolio) and Clients (Search, Job Posting, Wallet).
- **AI-Powered Job Posting**: Clients can post jobs via voice or text; the system structures the requirements automatically.
- **Real-Time Communication**: Integrated chat system with context-aware conversation history.
- **Secure Payments**: Built-in wallet and earning management systems.
- **Professional Portfolios**: Artisans can showcase their work, manage skills, and set pricing.

## Application Flows

### Client Flow
1. **Onboarding**: Select "Hire an Artisan" and sign up.
2. **Discover**: Search for artisans by category or location.
3. **Post a Job**: Use voice or text to describe the task.
4. **Chat**: Message artisans to discuss details and negotiate.
5. **Manage**: Track active jobs and manage payments through the Wallet.

### Artisan Flow
1. **Onboarding**: Select "Find Work" and create a professional profile.
2. **Setup**: Add skills, hourly rates, and portfolio images.
3. **Requests**: Receive and respond to incoming job inquiries.
4. **Work**: Manage active tasks and communicate with clients.
5. **Earnings**: Track completed jobs and monitor financial growth.

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4 (using CSS variables & `@theme`)
- **State Management**: Zustand (with Persistence)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **API Simulation**: Axios with a custom Mock API layer

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the frontend directory
cd conance/frontend

# Install dependencies
npm install
```

### Running the Project
```bash
# Start development server
npm run dev
```
The app will be available at `http://localhost:5173`.

### Available Scripts
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Generates the production build in the `dist/` folder.
- `npm run preview`: Locally previews the production build.

## Project Structure & Architecture

For a deep dive into how the project is organized and how to extend features, please refer to:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Project structure, state management, and data flow.
- [DESIGN.md](./DESIGN.md) - Design system tokens, typography, and UI patterns.

## Contribution Guidelines

- **Naming**: Use PascalCase for components and camelCase for hooks/functions.
- **Modularity**: Keep components focused on a single responsibility. Place feature-specific components in `src/lib/components/[feature]`.
- **State**: Use Zustand stores for global/shared state and keep UI state local where possible.
- **Mocking**: When adding new features, extend the mock API in `src/lib/api` to simulate backend behavior.
