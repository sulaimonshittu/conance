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
   The schema is located in `db/migrations/000001_init_schema.up.sql`. Apply it to your PostgreSQL instance.

4. **Run Server**:
   ```bash
   cd cmd/api
   go run main.go
   ```

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
