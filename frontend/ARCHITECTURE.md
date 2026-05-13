# 📁 Conance Frontend – Architecture Overview

This document outlines the folder hierarchy of the **Conance** frontend project, making it easy to navigate and understand where each piece lives.

```
frontend/
├─ .gitignore                # Git ignore rules
├─ ARCHITECTURE.md           # ← You are here!
├─ DESIGN.md                 # Design guidelines & UI decisions
├─ README.md                 # Project overview & setup
├─ eslint.config.js          # ESLint configuration
├─ index.html                # Main HTML entry point
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ vite.config.ts             # Vite bundler configuration
├─ node_modules/            # Dependencies (auto‑generated)
├─ public/                  # Static assets (favicon, robots.txt, …)
│   └─ …
└─ src/                     # **Source code**
    ├─ App.tsx               # Root component with router setup
    ├─ main.tsx              # React entry point (creates root)
    ├─ index.css             # Tailwind import (global styles)
    ├─ assets/               # Images, icons, etc.
    │   └─ …
    ├─ lib/                  # Re‑usable library code
    │   ├─ api/               # API helpers & clients
    │   │   ├─ artisan.ts
    │   │   ├─ client.ts
    │   │   ├─ auth.ts
    │   │   └─ mock_data.ts
    │   └─ components/        # UI components
    │       └─ common/          
    │           ├─ Button.tsx            # Custom button component
    │           ├─ Input.tsx             # Input wrapper
    │           ├─ Loader.tsx            # Loading spinner
    │           └─ modals/                # Modal implementations
    │               ├─ ModalNavbar.tsx   # Top navigation bar (modal style)
    │               ├─ ModalDesktop.tsx  # Desktop‑styled modal container
    │               └─ ModalMobile.tsx   # Mobile‑styled slide‑up drawer
    └─ pages/                # Page‑level components (routes)
        ├─ BaseLayout.tsx      # Layout wrapper with <Outlet/>
        ├─ Home.tsx            # Home page example
        ├─ auth/                # Authentication pages
        │   ├─ Login.tsx
        │   └─ SignUp.tsx
        └─ … (future pages)
```

## How to Use This Structure
- **`src/lib/components/common`**: Place reusable UI pieces here. They are imported throughout the app.
- **`src/lib/api`**: Centralize all network calls; keep them thin and focused.
- **`src/pages`**: Each page corresponds to a route defined in `App.tsx` and typically renders inside `<Outlet />` of `BaseLayout`.
- **`src/lib/components/common/modals`**: Contains modal components (`ModalNavbar`, `ModalDesktop`, `ModalMobile`) that can be invoked from any page.
- **`public`**: Static files served as‑is (e.g., favicon, manifest).

Feel free to extend this tree as new features are added. The hierarchical view helps you locate files quickly and maintain a clean separation between layout, UI components, API logic, and page routes.
