# 📁 Conance Frontend – Architecture Overview

This document outlines the folder hierarchy and data flow of the **Conance** frontend project.

## Directory Structure

```
frontend/
├─ src/
│   ├─ App.tsx               # Root component & Route definitions
│   ├─ main.tsx              # React entry point
│   ├─ index.css             # Design system tokens & global styles
│   ├─ lib/                  # Core logic & Shared resources
│   │   ├─ api/              # Mock API Layer (Simulates backend)
│   │   │   ├─ apiUtils.ts   # Mock response helpers
│   │   │   ├─ auth.api.ts   # Authentication services
│   │   │   └─ artisan.api.ts # Artisan feature services
│   │   ├─ hooks/            # Custom Hooks & Zustand Stores
│   │   │   ├─ useAuthStore.ts    # Global Auth state
│   │   │   ├─ useArtisanStore.ts # Artisan dashboard state
│   │   │   ├─ useAuth.ts         # Auth logic abstraction
│   │   │   └─ useArtisan.ts      # Artisan logic abstraction
│   │   ├─ components/       # UI Components
│   │   │   ├─ common/       # Atomic components (Button, Input)
│   │   │   └─ artisan/      # Artisan-specific UI modules
│   │   └─ utils/            # Shared utilities & Mock data
│   └─ pages/                # Page-level components (Routes)
│       ├─ artisan/          # Artisan dashboard pages
│       ├─ client/           # Client-specific pages
│       └─ auth/             # Login & Signup pages
```

## Data Flow Pattern

We follow a unidirectional data flow to ensure scalability and ease of debugging:

1.  **UI Component**: Renders data and triggers actions via custom hooks.
2.  **Custom Hook**: Orchestrates logic, connects to Zustand stores, and manages component-level effects.
3.  **Zustand Store**: Maintains the "Source of Truth." It handles async side effects by calling the API layer.
4.  **API Layer**: Isolated services that handle network requests. Currently implemented as a **Mock API** with simulated delays and error handling.

## State Management Principles

Each store typically tracks:
- `data`: The primary resource (e.g., list of jobs).
- `isLoading`: Boolean for global/section-specific loading states.
- `error`: Null or string containing error messages for toast notifications.

## Naming Conventions
- **Components**: PascalCase (e.g., `RequestCard.tsx`)
- **Hooks/Stores**: camelCase with `use` prefix (e.g., `useAuthStore.ts`)
- **APIs**: camelCase with `.api.ts` suffix (e.g., `auth.api.ts`)
- **Tokens**: Use CSS variables from `index.css` (e.g., `var(--primary)`)
