# Conance Frontend Architecture

This document provides a detailed overview of the architectural patterns, directory structure, and technical decisions made in the Conance frontend application.

## High-Level Overview

Conance is a mobile-first web application built with **React** and **Vite**. It employs a feature-based modular architecture designed for scalability, maintainability, and clear separation of concerns between different user roles (Artisans and Clients).

## Directory Structure

```txt
src/
├── assets/             # Static assets (images, icons, etc.)
├── lib/                # Core application logic and shared resources
│   ├── api/            # API service layer and mock data
│   ├── components/     # Reusable and feature-specific components
│   ├── hooks/          # Custom hooks and Zustand stores
│   └── utils/          # Helper functions and constants
├── pages/              # Route-level components
│   ├── artisan/        # Artisan-specific pages and layouts
│   ├── client/         # Client-specific pages and layouts
│   ├── auth/           # Authentication flow pages
│   └── ...             # Shared/Global pages (Home, 404)
├── index.css           # Global styles and design system tokens
└── main.tsx            # Application entry point
```

## Folder Responsibilities

### `src/lib/api`
Responsible for all external communication. It currently uses a **Mock API Layer** to simulate backend responses with realistic delays.
- **`*.api.ts`**: Service files that handle specific domains (e.g., `auth.api.ts`, `job.api.ts`).
- **`mock_data.ts`**: Centralized mock data source.
- **`apiUtils.ts`**: Helper for simulating asynchronous responses (`mockResponse`).

### `src/lib/hooks` (and Stores)
Centralizes business logic and global state management using **Zustand**.
- **`use*Store.ts`**: State stores for domains like Auth, Wallet, Chat, and Profile.
- **`useVoiceRecording.ts`**: Logic-heavy hooks for specific browser features.

### `src/lib/components`
Organized by feature domain to keep related components together.
- **`common/`**: Reusable UI primitives (Buttons, Inputs, Loaders).
- **`chat/`, `wallet/`, `profile/`**: Components specific to these complex features.
- **`navbar/`, `footer/`**: Layout-specific navigation components.

### `src/pages`
Contains the "containers" for each route.
- **Layout Wrappers**: `ArtisanLayout` and `ClientLayout` handle role-based authorization and shared UI (Navbar/Footer).
- **Feature Folders**: Nested folders like `client/jobs` organize pages belonging to a specific user journey.

## Feature Implementation Patterns

### 1. Authentication
- Managed via `useAuthStore` with local storage persistence.
- Roles are assigned during signup/login and dictate the available layout and routes.

### 2. Chat System
- Real-time simulation using `useChatStore`.
- Supports context-aware messaging (linked to specific jobs).
- Features a searchable `ChatList` and a detailed `Chat` conversation view.

### 3. Wallet & Financials
- Artisans track `Earnings`, while Clients manage their `Wallet`.
- Integrated with job completion flows to simulate payment transitions.

### 4. Job Management
- **Client Side**: Voice-enabled job posting (`useVoiceRecording` -> `useJobPostingStore`).
- **Artisan Side**: Management of `Requests`, `Ongoing Work`, and `Completed Jobs`.

## State Management Strategy

We use **Zustand** for its simplicity and performance in a mobile-first context.
- **Persistence**: Essential state (Auth, Wallet balances) is persisted via `zustand/middleware/persist`.
- **Loading/Error Handling**: Every store manages its own `isLoading` and `error` states, providing consistent feedback to UI components.

## Routing & Role Access

Routing is handled by `react-router-dom` with a clear hierarchical structure in `App.tsx`:
- **Base Routes**: Accessible to all (Landing page).
- **Protected Artisan Routes**: Wrapped in `ArtisanLayout` (requires `artisan` role).
- **Protected Client Routes**: Wrapped in `ClientLayout` (requires `client` role).

## Scalability & Extension

To add a new feature:
1. Define the API interface in `src/lib/api`.
2. Create a Zustand store in `src/lib/hooks` to manage state.
3. Build domain components in `src/lib/components/[feature]`.
4. Register new pages in `src/pages/[role]/[feature]` and add routes to `App.tsx`.
