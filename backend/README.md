# Conance Backend

A financial trust layer for Nigerian artisans, built with Go, PostgreSQL/PostGIS, Squad API, and Google Gemini.

## Features
- **Escrow State Machine**: Secure job payments using Squad Virtual NUBANs.
- **AI Artisan Matching**: Proximity and skill-based matching via Gemini.
- **AI Work Verification**: Visual proof-of-work validation using Gemini Vision.
- **Double-Entry Ledger**: Precise financial auditing in NGN Kobo.
- **OTP Auth**: Phone-based authentication via Redis.

## Prerequisites
- Docker & Docker Compose
- Go 1.25+
- Google Gemini API Key
- Squad Sandbox Secret Key

## Setup

1. **Clone & Environment**:
   ```bash
   cp .env.example .env
   # Update GEMINI_API_KEY and SQUAD_SECRET_KEY in .env
   ```

2. **Infrastructure**:
   ```bash
   docker-compose up -d
   ```

3. **Database Migrations**:
   Apply the migrations in order:
   - `db/migrations/000001_init_schema.up.sql`
   - `db/migrations/000002_proposals_chat_disputes.up.sql`

4. **Run Server**:
   ```bash
   cd cmd/api
   go run main.go
   ```

## Build (Windows EXE)

From the `backend` folder:

```powershell
.\build.ps1
.\run.ps1
```

This produces: `backend/bin/conance-api.exe`

## API Documentation

The full API specification is available in OpenAPI format:
- **Specification**: [openapi.yaml](docs/api/openapi.yaml)
- **Base URL**: `http://localhost:8080/api/v1`

### Quick Test Examples (Curl)

**1. Request OTP**
```bash
curl -X POST http://localhost:8080/api/v1/auth/otp \
     -H "Content-Type: application/json" \
     -d '{"phone_number": "+2348030000000"}'
```

**2. Create Job (Escrow)**
```bash
curl -X POST http://localhost:8080/api/v1/jobs \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": "550e8400-e29b-41d4-a716-446655440000",
       "title": "Fix Kitchen Sink",
       "description": "Leaking pipe under the sink",
       "category": "Plumbing",
       "budget_kobo": 500000
     }'
```

**3. AI Voice Transcription**
```bash
curl -X POST http://localhost:8080/api/v1/ai/transcribe \
     -H "Content-Type: audio/mp3" \
     --data-binary @voice_note.mp3
```

**4. Submit Proposal (Artisan bids on job)**
```bash
curl -X POST http://localhost:8080/api/v1/jobs/550e8400-e29b-41d4-a716-446655440000/proposals \
     -H "Content-Type: application/json" \
     -d '{
       "artisan_id": "11111111-1111-1111-1111-111111111111",
       "price_kobo": 450000,
       "eta_minutes": 120,
       "message": ""
     }'
```

**5. Send Chat Message (Moderated)**
```bash
curl -X POST http://localhost:8080/api/v1/jobs/550e8400-e29b-41d4-a716-446655440000/messages \
     -H "Content-Type: application/json" \
     -d '{
       "sender_id": "11111111-1111-1111-1111-111111111111",
       "body": "I can do this today. I will arrive in 2 hours."
     }'
```

**6. Open Dispute (AI mediator suggests split)**
```bash
curl -X POST http://localhost:8080/api/v1/jobs/550e8400-e29b-41d4-a716-446655440000/disputes \
     -H "Content-Type: application/json" \
     -d '{
       "opener_id": "550e8400-e29b-41d4-a716-446655440000",
       "reason": "The work was incomplete"
     }'
```
