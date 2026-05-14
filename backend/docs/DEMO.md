# Conance Demo Guide

Follow these steps to demonstrate the end-to-end hackathon flow.

## Prerequisites
1. Start all services by simply running the start script in your terminal:
   ```cmd
   .\start.bat
   ```
   *(This will automatically start Docker, run migrations, seed the database, and open two new windows for the API server and background worker.)*

## 1. Create a Job
Client Tunde posts a plumbing job.

```bash
curl -X POST http://localhost:8080/api/v1/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "0191c955-0810-7e8c-8000-000000000001",
    "title": "Fix Leaking Pipe",
    "description": "My kitchen sink pipe is leaking heavily",
    "category": "plumbing",
    "budget_kobo": 1500000
  }'
```

*(Note down the `id` returned from this request. Replace `<JOB_ID>` and `<VIRTUAL_ACCOUNT>` in subsequent steps)*

## 2. Match Artisans (AI)
Get an AI-ranked list of recommended artisans.

```bash
curl -X GET http://localhost:8080/api/v1/jobs/<JOB_ID>/recommendations
```

## 3. Submit a Proposal
Mama Chika submits a proposal.

```bash
curl -X POST http://localhost:8080/api/v1/jobs/<JOB_ID>/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "artisan_id": "0191c955-0810-7e8c-8000-000000000002",
    "price_kobo": 1200000,
    "eta_minutes": 60,
    "message": "I can fix this in 1 hour."
  }'
```

## 4. Assign Artisan
Client accepts the proposal and assigns the artisan.

```bash
curl -X POST http://localhost:8080/api/v1/jobs/<JOB_ID>/assign \
  -H "Content-Type: application/json" \
  -d '{"artisan_id": "0191c955-0810-7e8c-8000-000000000002"}'
```

## 5. Fund Escrow (Simulate Squad Webhook)
Simulate the client transferring funds to the job's virtual account.
Edit `scripts/squad-simulate-webhook.ps1` and set `virtual_account_number` to the one generated for the job.

```powershell
.\scripts\squad-simulate-webhook.ps1
```
*(Job status changes to `funded`)*

## 6. Submit Work + AI Photo Verification
Artisan completes the job and uploads photos.

```bash
curl -X POST http://localhost:8080/api/v1/jobs/<JOB_ID>/submit \
  -H "Content-Type: application/json" \
  -d '{
    "artisan_id": "0191c955-0810-7e8c-8000-000000000002",
    "photos": ["https://example.com/fixed_pipe.jpg"],
    "note": "All done! No more leaks."
  }'
```
*(AI vision verifies the plumbing photo in the background)*

## 7. Release Funds & Payout
Client approves the work. Funds are released and the background worker executes the Squad Transfer.

```bash
curl -X POST http://localhost:8080/api/v1/jobs/<JOB_ID>/release \
  -H "Content-Type: application/json" \
  -d '{"client_id": "0191c955-0810-7e8c-8000-000000000001"}'
```

*(Watch the worker logs to see the payout processed!)*
