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

Copy the example environment file and fill in your credentials:

```bash
cp backend/.env.example backend/.env
```

See the [Environment Variables](#environment-variables) section for a full reference.

### 3. Start the Application (Windows)

A single script handles everything — it starts the Docker containers, runs database migrations, seeds the database, and launches both the API server and the background worker:

```cmd
.\backend\start.bat
```

### 4. Start the Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` by default.

---

## Running the Application

### Backend Only (manual)

Start the infrastructure services:

```bash
cd backend
docker compose up -d
```

Run the API server:

```bash
go run ./cmd/api
```

Run the background worker (in a separate terminal):

```bash
go run ./cmd/worker
```

### Simulating a Squad Webhook (Development)

Use the provided PowerShell script to simulate an incoming payment webhook during local testing:

```powershell
.\backend\scripts\squad-simulate-webhook.ps1
```

---

## API Documentation

Full endpoint documentation is available in [backend/docs/API.md](backend/docs/API.md).

For a guided walkthrough of the full job lifecycle, see [backend/docs/DEMO.md](backend/docs/DEMO.md).

---

