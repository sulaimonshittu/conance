# Conance API Reference

This document outlines the REST API endpoints available in the Conance backend. All endpoints are prefixed with `/api/v1`.

> [!NOTE]
> **Base URL:** `http://localhost:8080/api/v1`
> **Content-Type:** `application/json` (unless otherwise specified)
> **Currency:** All monetary values are represented in **Kobo** (1 NGN = 100 Kobo) as standard integer types.

---

## 1. Authentication

### Request OTP
Initiate the login or registration flow by requesting a One-Time Password to a user's phone number.
- **Method:** `POST`
- **Endpoint:** `/auth/otp`
- **Body:**
  ```json
  {
    "phone_number": "08012345678"
  }
  ```

### Verify OTP
Verify the OTP to log in.
- **Method:** `POST`
- **Endpoint:** `/auth/verify`
- **Body:**
  ```json
  {
    "phone_number": "08012345678",
    "otp": "123456"
  }
  ```

---

## 2. Jobs & Escrow

### Create a Job (Text)
Clients can post a new job with a description and budget.
- **Method:** `POST`
- **Endpoint:** `/jobs`
- **Body:**
  ```json
  {
    "client_id": "uuid-string",
    "title": "Fix Leaking Pipe",
    "description": "My kitchen sink pipe is leaking heavily",
    "category": "plumbing",
    "budget_kobo": 1500000
  }
  ```

### Create a Job (Voice)
Clients can upload a voice note in local languages. The AI extracts intent, structures the job, and posts it.
- **Method:** `POST`
- **Endpoint:** `/jobs/voice?client_id=<uuid>`
- **Content-Type:** `audio/mp3` or `audio/webm`
- **Body:** Raw audio bytes

### Get Artisan Recommendations for a Job
Returns an AI-ranked list of recommended artisans for a specific job.
- **Method:** `GET`
- **Endpoint:** `/jobs/{id}/recommendations`

### Get Job Recommendations for an Artisan
Returns an AI-ranked list of recommended jobs for a specific artisan based on their profile.
- **Method:** `GET`
- **Endpoint:** `/artisans/{id}/recommendations`

### Assign an Artisan
Client assigns a shortlisted artisan to the job.
- **Method:** `POST`
- **Endpoint:** `/jobs/{id}/assign`
- **Body:**
  ```json
  {
    "artisan_id": "uuid-string"
  }
  ```

### Mark Job as In Progress
Artisan indicates they have started the work.
- **Method:** `POST`
- **Endpoint:** `/jobs/{id}/in-progress`

### Submit Completed Work
Artisan submits photos and notes to mark the job as completed. This triggers the AI vision verification in the background.
- **Method:** `POST`
- **Endpoint:** `/jobs/{id}/submit`
- **Body:**
  ```json
  {
    "artisan_id": "uuid-string",
    "photos": ["https://url-to-photo.jpg"],
    "note": "Fixed the leak successfully."
  }
  ```

### Release Funds
Client approves the submitted work. This triggers the escrow release and initiates the asynchronous payout to the artisan via Squad.
- **Method:** `POST`
- **Endpoint:** `/jobs/{id}/release`
- **Body:**
  ```json
  {
    "client_id": "uuid-string"
  }
  ```

---

## 3. Proposals

### Submit a Proposal
Artisan submits a proposal for an open job.
- **Method:** `POST`
- **Endpoint:** `/jobs/{id}/proposals`
- **Body:**
  ```json
  {
    "artisan_id": "uuid-string",
    "price_kobo": 1200000,
    "eta_minutes": 60,
    "message": "I can arrive in 1 hour to fix this."
  }
  ```

### List Proposals
Client fetches all submitted proposals for their job.
- **Method:** `GET`
- **Endpoint:** `/jobs/{id}/proposals`

### Accept a Proposal
Client accepts a specific proposal.
- **Method:** `POST`
- **Endpoint:** `/proposals/{id}/accept`
- **Body:**
  ```json
  {
    "client_id": "uuid-string"
  }
  ```

---

## 4. Chat & Moderation

### Send Message
Send a message within a job's chat room. The AI asynchronously moderates this message for off-platform leakage or fraud.
- **Method:** `POST`
- **Endpoint:** `/jobs/{id}/messages`
- **Body:**
  ```json
  {
    "sender_id": "uuid-string",
    "body": "Please send me your account number."
  }
  ```

### Get Messages
Retrieve the chat history for a specific job.
- **Method:** `GET`
- **Endpoint:** `/jobs/{id}/messages`

---


## 5. Disputes

### Open a Dispute
Either party can open a dispute if the job encounters issues.
- **Method:** `POST`
- **Endpoint:** `/jobs/{id}/disputes`
- **Body:**
  ```json
  {
    "opener_id": "uuid-string",
    "reason": "The pipe is still leaking."
  }
  ```

### Accept AI Mediation
Accept the AI's proposed resolution for a dispute.
- **Method:** `POST`
- **Endpoint:** `/disputes/{id}/accept-mediation`
- **Body:**
  ```json
  {
    "actor_id": "uuid-string",
    "resolution": {
      "artisan_percentage": 50,
      "client_refund_percentage": 50
    }
  }
  ```

---

## 6. Payments & Squad Integrations

### Account Lookup (KYC)
Verify a bank account number against its bank code (powered by Squad).
- **Method:** `POST`
- **Endpoint:** `/payout/account/lookup`
- **Body:**
  ```json
  {
    "bank_code": "058",
    "account_number": "0123456789"
  }
  ```

### Squad Webhook
Endpoint configured in the Squad dashboard to receive payment events (e.g., `virtual_account_deposit`).
- **Method:** `POST`
- **Endpoint:** `/webhook/squad`
- **Headers Required:** `x-squad-signature` (HMAC-SHA512 of payload)
- **Body:** Standard Squad Event JSON

---

## 7. Direct AI Utilities

### Transcribe Voice
Standalone endpoint to transcribe audio to text.
- **Method:** `POST`
- **Endpoint:** `/ai/transcribe`
- **Content-Type:** `audio/*`
- **Body:** Raw audio bytes
