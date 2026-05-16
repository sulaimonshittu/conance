# Conance

**Connecting Artisans and Clients with Trust.**

Conance is a service marketplace built for the modern African economy. It leverages AI-driven matching and escrow-protected payments to ensure that every job — from a leaking pipe to a custom-made gown — is handled with transparency, quality, and trust.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)

---

## Overview

Conance connects skilled artisans with clients who need work done. The platform uses AI to match the right artisan to each job based on proximity and reputation, while escrow-protected payments ensure funds are only released when the client is satisfied.

---

## Core Features

- **AI-Powered Voice Jobs** — Artisans can post and find jobs using local dialects via Gemini multimodal transcription.
- **Escrow-Protected Payments** — Payments are secured via Squad (HabariPay) virtual accounts and released only upon job satisfaction.
- **Smart Recommendations** — A Gemini-driven ranking system matches the best artisans to the right jobs based on proximity and trust scores.
- **Trust-Based Reputation** — A dynamic scoring system that builds artisan credibility over time.
- **Background Workers** — Asynchronous job processing for escrow management and payment webhook handling.

---

## Tech Stack

### Backend

| Layer           | Technology                          |
|-----------------|-------------------------------------|
| Language        | Go 1.25                             |
| HTTP Router     | Chi v5                              |
| Database        | PostgreSQL 15 with PostGIS          |
| Cache / Queue   | Redis 7                             |
| AI              | Google Gemini 2.5 Flash             |
| Payments        | Squad by HabariPay                  |
| Containerization| Docker and Docker Compose           |
| Migrations      | golang-migrate                      |
| Code Generation | sqlc                                |

### Frontend

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | React 19                          |
| Language    | TypeScript 6                      |
| Build Tool  | Vite 8                            |
| Styling     | Tailwind CSS 4                    |
| State       | Zustand                           |
| Routing     | React Router DOM 7                |
| HTTP Client | Axios                             |
| Forms       | React Hook Form                   |

---

## Project Structure

```
conance/
├── backend/
│   ├── cmd/
│   │   ├── api/              # Main API server entry point
│   │   └── worker/           # Background job processor (escrow and webhooks)
│   ├── internal/
│   │   ├── ai/               # Gemini AI service and transcription logic
│   │   ├── api/              # HTTP handlers (REST controllers)
│   │   ├── payment/          # Squad API integration
│   │   ├── repository/       # Database access layer (SQL)
│   │   └── service/          # Core business logic (escrow, jobs)
│   ├── db/
│   │   └── migrations/       # SQL schema migrations
│   ├── docs/
│   │   ├── API.md            # Endpoint reference
│   │   └── DEMO.md           # Step-by-step demo guide
│   ├── scripts/
│   │   ├── seed.go           # Database seeder
│   │   └── squad-simulate-webhook.ps1  # Webhook simulation script
│   ├── docker-compose.yml    # PostgreSQL and Redis service definitions
│   ├── go.mod
│   ├── sqlc.yaml             # sqlc code generation config
│   └── start.bat             # One-click startup script (Windows)
├── frontend/
│   ├── src/                  # React application source
│   ├── public/               # Static assets
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Prerequisites

Ensure the following are installed before setting up the project:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — for running PostgreSQL and Redis containers
- [Go 1.25+](https://go.dev/dl/) — for building and running the backend
- [Node.js 20+](https://nodejs.org/) — for running the frontend
- A Google Gemini API key
- Squad (HabariPay) API credentials

---

## Setup and Installation

### 1. Clone the Repository

```bash
git clone <repo-url>
cd conance
```

### 2. Configure Environment Variables

The application requires environment variables for both the backend and the frontend.

#### Backend Configuration

Navigate to the `backend` directory and create an `.env` file:

```bash
cd backend
cp .env.example .env
```

**Backend `.env` Reference:**

| Variable | Description | Default / Example |
|---|---|---|
| `ENV` | Environment type (`dev` or `prod`). | `dev` |
| `HTTP_ADDR` | Port where the backend API will run. | `:8080` |
| `JWT_SECRET` | Secret key for signing JWT auth tokens. | `change_me` |
| `ACCESS_TTL` | Lifespan of JWT access tokens. | `15m` |
| `REFRESH_TTL` | Lifespan of JWT refresh tokens. | `720h` |
| `DATABASE_URL` | PostgreSQL connection string. | `postgres://conance_user:conance_password@localhost:5432/conance_db?sslmode=disable` |
| `REDIS_URL` | Redis connection string. | `redis://localhost:6379/0` |
| `SQUAD_BASE_URL` | Base URL for Squad API. | `https://sandbox-api-d.squadco.com` |
| `SQUAD_SECRET_KEY` | Squad API Secret Key. | `sandbox_sk_...` |
| `SQUAD_PUBLIC_KEY` | Squad API Public Key. | `sandbox_pk_...` |
| `SQUAD_MERCHANT_ID` | Squad Merchant ID. | `SB7AX74J3X` |
| `SQUAD_WEBHOOK_SECRET` | Secret to verify incoming Squad webhooks. | `your_webhook_secret_here` |
| `GEMINI_API_KEY` | API Key for Google Gemini (used for AI matching & voice). | `AIza...` |

#### Frontend Configuration

Navigate to the `frontend` directory and create an `.env` file:

```bash
cd ../frontend
cp .env.example .env  # Or create it manually
```

**Frontend `.env` Reference:**

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL pointing to the running backend API. | `http://localhost:8080/api/v1` |

---

## Running the Application

### Option A: Quick Start (Windows)

A single script handles starting Docker containers, running database migrations, seeding the database, and launching both the API server and the background worker.

**Terminal 1 (Backend):**
```cmd
.\backend\start.bat
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

### Option B: Manual Start (Any OS)

If you are not on Windows or prefer to start things manually:

**1. Start Infrastructure (Docker):**
```bash
cd backend
docker compose up -d
```

**2. Start the Backend API Server:**
```bash
cd backend
go run ./cmd/api
```

**3. Start the Background Worker:**
(In a new terminal window)
```bash
cd backend
go run ./cmd/worker
```

**4. Start the Frontend:**
(In a new terminal window)
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## Development & Testing

### Simulating a Squad Webhook (Development)

Use the provided PowerShell script to simulate an incoming payment webhook during local testing. This bypasses the need for an internet-exposed webhook URL when testing the escrow flow locally.

```powershell
.\backend\scripts\squad-simulate-webhook.ps1
```

---

## API Documentation

- **Full endpoint reference:** [backend/docs/API.md](backend/docs/API.md)
- **Guided job lifecycle walkthrough:** [backend/docs/DEMO.md](backend/docs/DEMO.md)
