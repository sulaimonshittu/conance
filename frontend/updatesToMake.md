# Conance — Frontend × Backend API Integration Report

> Generated: 2026-05-16 · Backend spec: `backend/docs/api/openapi.yaml` (v1.0.0)
> Server: `http://localhost:8080/api/v1`

---

## Overview

The Conance frontend is currently **100% mock-driven**. The backend OpenAPI spec documents
**14 endpoints** across Auth, Jobs, Proposals, Chat, Disputes, AI, and Payments.

This report documents every gap, mismatch, and recommended action for both teams, and
describes the frontend refactors already applied to align with the backend contract.

---

## 1. Endpoint Coverage Map

| # | Backend Endpoint | Method | Frontend Service | Frontend Status |
|---|---|---|---|---|
| 1 | `/auth/otp` | POST | `auth.api.ts → requestOtp` | ✅ Aligned (mock) |
| 2 | `/auth/verify` | POST | `auth.api.ts → verifyOtp` | ✅ Aligned (mock) |
| 3 | `/jobs` | POST | `job.api.ts → submitJob` | ✅ Aligned (mock, payload fixed) |
| 4 | `/jobs/voice` | POST | ❌ Not used | ⚠️ Unmapped — see §3 |
| 5 | `/jobs/{id}/recommendations` | GET | `job.api.ts → fetchRecommendedArtisans` | ⚠️ Wrong path (see §5) |
| 6 | `/artisans/{id}/recommendations` | GET | ❌ Not used | ⚠️ Unmapped |
| 7 | `/jobs/{id}/proposals` POST | POST | `artisan.api.ts → sendProposal` | ⚠️ Payload mismatch (see §5) |
| 8 | `/jobs/{id}/proposals` GET | GET | ❌ Not used by client | ⚠️ Unmapped |
| 9 | `/proposals/{id}/accept` | POST | ❌ Not used | ⚠️ Unmapped |
| 10 | `/jobs/{id}/messages` | POST | `chat.api.ts → sendMessage` | ✅ Aligned (body/sender_id fixed) |
| 11 | `/jobs/{id}/disputes` | POST | ❌ Not used | ⚠️ Unmapped |
| 12 | `/disputes/{id}/accept-mediation` | POST | ❌ Not used | ⚠️ Unmapped |
| 13 | `/jobs/{id}/submit` | POST | `chat.api.ts → startJob` (close) | ⚠️ Partial — see §5 |
| 14 | `/jobs/{id}/release` | POST | `chat.api.ts → sendMaterialPayment` | ⚠️ Partial — see §5 |
| 15 | `/jobs/{id}/assign` | POST | ❌ Not used | ⚠️ Unmapped |
| 16 | `/jobs/{id}/in-progress` | POST | ❌ Not used | ⚠️ Unmapped |
| 17 | `/ai/transcribe` | POST | `job.api.ts → transcribeVoice` | ✅ Aligned (mock, annotated) |
| 18 | `/payout/account/lookup` | POST | ❌ Not used | ⚠️ Unmapped — see §3 |

---

## 2. Schema Mismatches (Fixed in This Session)

| Field / Area | Frontend (Before) | Backend (API Spec) | Fix Applied |
|---|---|---|---|
| Auth credentials | `email + password` | `phone_number + otp` | `auth.api.ts` rewritten to OTP flow |
| Chat message content | `text: string` | `body: string` | `body` added as canonical field; `text` kept as deprecated alias |
| Chat message sender | `senderId` (local alias) | `sender_id` (UUID) | `apiClient.ts` camelCase→snake_case interceptor handles this |
| Job budget | `budgetMin`, `budgetMax` (Naira) | `budget_kobo` (integer, Kobo) | `ngnToKobo()` helper added; `BackendJobPayload` type added |
| Job payload | No `client_id` | `client_id` (UUID required) | `BackendJobPayload.clientId` added; real call must populate from auth store |
| Proposal fields | `artisanId`, `price` (Naira) | `artisan_id`, `price_kobo`, `eta_minutes` | `ProposalPayload` type added in `job.api.ts` |
| Job status values | `"pending" \| "analysing" \| "matched" \| "posted"` | Not enumerated | Expanded to include `"funded" \| "active" \| "completed" \| "disputed"` |
| Job response | No `squad_virtual_account` | `squad_virtual_account: string` | `squadVirtualAccount` added to `SubmittedJob` — this is the job funding account |

---

## 3. Missing Backend Endpoints (Frontend Needs But Backend Lacks)

These features exist in the frontend but have **no corresponding endpoint** in the OpenAPI spec.
All remain mocked until the backend team adds them.

### 3.1 User Profile / Identity — **CRITICAL**
```
GET  /users/me              → current user's profile (role, name, phone, avatar, walletBalance)
PATCH /users/me             → update name, avatar, about
GET  /artisans/{id}         → public artisan profile (title, skills, rating, portfolio)
GET  /artisans/search?q=    → search artisans by name, category, or skill
```
**Frontend modules affected:** `useProfileStore`, `useArtisanStore`, `artisanApi.searchArtisans`,
`artisanApi.getArtisanDetails`, `profile.api.ts`, `ArtisanDetails.tsx`, `SearchForArtisan.tsx`.

**Expected response (GET /users/me):**
```json
{
  "id": "uuid",
  "phone_number": "+2348000000000",
  "role": "artisan | client",
  "name": "string",
  "avatar_url": "string | null",
  "wallet_balance_kobo": 0
}
```

### 3.2 Wallet / Balance — **HIGH**
```
GET  /wallet/balance        → { escrow_kobo, released_kobo, available_kobo, virtual_account }
POST /wallet/fund           → initiate funding (returns Squad virtual account)
GET  /wallet/transactions   → paginated transaction history
```
**Frontend modules affected:** `useWalletStore`, `artisanApi.getWalletSummary`, `artisanApi.fundWallet`,
`Wallet.tsx`, `Summary.tsx`, artisan `Earnings.tsx`, `TransactionHistory.tsx`.

**Expected response (GET /wallet/balance):**
```json
{
  "escrow_kobo": 60000,
  "released_kobo": 70000,
  "available_kobo": 0,
  "virtual_account": {
    "bank_name": "Wema Bank",
    "account_number": "0123456789",
    "account_name": "Conance Escrow — Squad"
  }
}
```

### 3.3 Job Wallet / Per-Job Funding — **HIGH** (new flow added in this sprint)
```
POST /jobs/{id}/wallet      → create a dedicated wallet for a job
POST /jobs/{id}/wallet/fund → confirm transfer received (or use Squad webhook)
POST /jobs/{id}/publish     → make job public after funding confirmed
GET  /jobs/{id}/wallet      → { funded_amount_kobo, estimated_budget_kobo, status }
```
**Frontend modules affected:** `jobWallet.api.ts`, `useJobPostingStore.ts`, `JobFundingPanel.tsx`.

> 💡 **NOTE:** The backend `POST /jobs` response already returns `squad_virtual_account` which IS
> the per-job funding account. The frontend's `JobFundingPanel` should use this value from the
> `submitJob` response instead of creating a separate wallet endpoint.
> **Recommended simplification:** Remove `POST /jobs/{id}/wallet` — use `squad_virtual_account`
> from the `POST /jobs` response directly.

### 3.4 Chat History — **HIGH**
```
GET  /jobs/{id}/messages     → paginated message history
```
**Frontend modules affected:** `chatApi.getChatContext`, `useChatStore.fetchChatData`.

**Expected response:**
```json
[
  { "id": "uuid", "job_id": "uuid", "sender_id": "uuid", "body": "string",
    "redacted_body": "string | null", "created_at": "ISO8601" }
]
```

### 3.5 Job Listing & Details — **HIGH**
```
GET  /jobs?client_id=&status=  → list client's jobs (paginated)
GET  /jobs/{id}                → single job detail
GET  /jobs?artisan_id=&status= → list artisan's assigned jobs
```
**Frontend modules affected:** `JobsGiven.tsx`, `JobDetails.tsx`, `artisanApi.getActiveProjects`,
`artisanApi.getFinishedProjects`, `artisanApi.getRequests`.

### 3.6 Artisan Job Requests / Proposals — **MEDIUM**
```
GET  /artisans/{id}/proposals   → proposals the artisan has submitted
GET  /artisans/{id}/jobs        → assigned/active jobs for artisan
```
**Frontend modules affected:** `useArtisanStore.fetchRequests`, `useArtisanStore.fetchProjects`,
`RequestsPage`, `Work.tsx`.

### 3.7 AI Price Estimation — **MEDIUM**
```
POST /ai/price-estimate   → { description } → { min_kobo, max_kobo, typical_kobo, breakdown[] }
```
**Frontend modules affected:** `jobApi.getPriceEstimate`, `PriceEstimate.tsx`.

> Currently this is done client-side in `analyseJob` as part of the combined AI analysis flow.
> Backend `/ai/transcribe` only returns a transcript — full analysis (pricing, category, tags)
> has no documented backend endpoint.

### 3.8 AI Job Analysis (Structured) — **MEDIUM**
```
POST /ai/analyse-job   → { description } → { category, title, tags, confidence, pricing_estimate }
```
**Frontend modules affected:** `jobApi.analyseJob`, `useJobPostingStore.analyseJob`.

> `/jobs/voice` partially covers this for voice-only flow, but text-based analysis has no endpoint.

### 3.9 Profile Management — **MEDIUM**
```
PATCH /users/me/password     → change password
PATCH /users/me/locations    → update service locations
POST  /artisans/me/portfolio → upload portfolio item (multipart/form-data)
DELETE /artisans/me/portfolio/{id} → delete portfolio item
GET   /skills               → list available skill categories
```
**Frontend modules affected:** `profile.api.ts`, `useProfileStore`.

### 3.10 Notifications — **LOWER PRIORITY**
```
GET  /notifications         → list unread notifications
POST /notifications/read    → mark as read
```
**Frontend modules affected:** No dedicated component yet, but the artisan dashboard and
chat screen both imply real-time notification support.

---

## 4. Endpoints Usable Now (Real API Ready)

These endpoints exist in the backend spec and the frontend is already shaped to use them.
Switch from mock to real by replacing `mockResponse()` with `apiPost()`/`apiGet()` from `apiClient.ts`.

| Endpoint | Frontend Action | Notes |
|---|---|---|
| `POST /auth/otp` | `authApi.requestOtp(phone)` | Auth pages need OTP UI (currently email-based) |
| `POST /auth/verify` | `authApi.verifyOtp(phone, otp)` | Store JWT from `token` field |
| `POST /jobs` | `jobApi.submitJob(draft)` | Pass `clientId` from auth store; convert budget to Kobo |
| `POST /ai/transcribe` | `jobApi.transcribeVoice(blob)` | Send as `audio/mp3` binary; response is `text/plain` |
| `POST /jobs/{id}/messages` | `chatApi.sendMessage(jobId, body, senderId)` | `body` and `sender_id` now correctly named |
| `POST /jobs/{id}/proposals` | `artisanApi.sendProposal` | Update payload to use `ProposalPayload` type |
| `POST /proposals/{id}/accept` | Not yet implemented | Needed for the client accept-proposal flow |
| `POST /jobs/{id}/release` | `chatApi.sendMaterialPayment` | Rename + align payload with `client_id` |
| `POST /payout/account/lookup` | Not yet implemented | Use for bank account validation in withdrawal flow |
| `POST /jobs/{id}/disputes` | Not yet implemented | Dispute button exists in chat but no API call |
| `POST /jobs/{id}/assign` | Not yet implemented | Needed when client accepts a proposal (alternative to /proposals/{id}/accept) |
| `POST /jobs/{id}/in-progress` | `chatApi.startJob` (partial) | Align payload; currently no body sent |
| `POST /jobs/{id}/submit` | Not yet implemented | Artisan marks work done; needs photos array |

---

## 5. Detailed Mismatches Per Feature

### 5.1 Authentication Flow

**Current:** Email + role dropdown → fake login.
**Required:** Phone number → OTP request → OTP verify → JWT token.

**Frontend change needed in `Login.tsx` / `SignUp.tsx`:**
- Replace email/password fields with phone number input
- Add OTP input screen (step 2)
- Store `token` from `/auth/verify` response in `localStorage["auth-storage"]`
- Remove `password` field entirely — backend does not use passwords

**Missing from backend spec:**
- No role assignment endpoint — backend must return `role` in verify response or via `/users/me`
- No token refresh endpoint — add `POST /auth/refresh` with `{ refresh_token }`
- No logout/invalidation endpoint — add `POST /auth/logout`

### 5.2 Voice Job Posting

**Frontend current flow:** `transcribeVoice()` (mock) → edit text → `submitJob()`.
**Backend unified flow:** `POST /jobs/voice` with raw audio → returns `{ job, transcript, intent }`.

**Recommendation:**
- Use `POST /ai/transcribe` for the transcript preview step (matches current UX)
- Then use `POST /jobs` with the finalised text for job creation
- OR use `POST /jobs/voice` as a one-shot flow (skip the preview step)

The frontend's two-step flow (`transcribe` → `submit`) is architecturally sound. Map it as:
1. `POST /ai/transcribe` → show editable transcript
2. `POST /jobs` → create job after user confirmation

### 5.3 Chat / Messaging

**Fixed fields:** `text` → `body`, `senderId` → `sender_id` (handled by `apiClient.ts` interceptor).

**Still missing:**
- `GET /jobs/{id}/messages` — load history on chat open
- WebSocket / SSE for real-time message delivery (polling is the fallback)
- `redacted_body` display — if `redacted_body` is non-null, show it with an AI moderation notice

**Recommended real-time strategy:**
```
Option A (simple):  Poll GET /jobs/{id}/messages every 3s when chat is open
Option B (optimal): WebSocket wss://api/v1/jobs/{id}/ws for push delivery
Option C (future):  Server-Sent Events (SSE) endpoint
```

### 5.4 Proposals

`artisanApi.sendProposal` sends `{ id, proposal: string }` (text only).
Backend `POST /jobs/{id}/proposals` requires `{ artisan_id, price_kobo, eta_minutes, message? }`.

**Fix needed in `artisan.api.ts → sendProposal`:**
```ts
// Replace current signature:
sendProposal: async (jobId: string, proposal: string)

// With backend-aligned signature:
sendProposal: async (jobId: string, payload: ProposalPayload)
// where ProposalPayload = { artisanId, priceKobo, etaMinutes, message? }
```

The `RequestJob.tsx` UI must be updated to collect `price` and `ETA` from the artisan, not just free text.

### 5.5 Escrow Release (`/jobs/{id}/release`)

`chatApi.sendMaterialPayment` is mapped to this endpoint conceptually but:
- Does not send `client_id` in the body
- The frontend uses it for "material payments" (partial) — unclear if backend supports partial release
- The final payment release ("Release Milestone" button in `JobDetails.tsx`) also maps here

**Recommendation for backend:** Add `amount_kobo` (optional) to `/jobs/{id}/release` to support partial milestone releases.

### 5.6 Bank Account Lookup (`/payout/account/lookup`)

This endpoint is documented and ready in the backend (Squad integration).
The artisan withdrawal/payout UI (`useWalletStore`, `Summary.tsx`) needs a form that:
1. Takes `bank_code` + `account_number`
2. Calls `POST /payout/account/lookup` to validate
3. Shows returned `account_name` for confirmation before submitting

---

## 6. Frontend Architecture Changes Applied

### 6.1 `src/lib/api/apiClient.ts` — **NEW FILE**
Central Axios instance with:
- Auto `Authorization: Bearer <token>` header from `localStorage["auth-storage"]`
- Request interceptor: `camelCase` body → `snake_case` (frontend → backend)
- Response interceptor: `snake_case` → `camelCase` (backend → frontend)
- Standardised `{ data, success, message }` response envelope
- 15s timeout, centralized error normalisation

**To activate real API:** Set `VITE_API_BASE_URL=http://localhost:8080/api/v1` in `frontend/.env`
and replace `mockResponse()` calls with `apiPost()`/`apiGet()` from `apiClient.ts`.

### 6.2 `src/lib/api/auth.api.ts` — **REWRITTEN**
- Added `requestOtp(phoneNumber)` → `POST /auth/otp`
- Added `verifyOtp(phoneNumber, otp)` → `POST /auth/verify`
- Added `OtpRequest`, `OtpResponse`, `VerifyOtpResponse` types matching backend schema
- `login()` and `register()` kept as deprecated stubs to avoid breaking the store
- `AuthUser` now uses `phoneNumber` instead of `email`

### 6.3 `src/lib/api/chat.api.ts` — **FIELD FIX**
- `ChatMessage.body` added as the canonical field (matches `Message.body` in spec)
- `ChatMessage.text` kept as a deprecated alias
- `ChatMessage.redactedBody` added for moderation display
- `sendMessage` parameter renamed from `text` to `body`
- Real API path annotated: `POST /jobs/{id}/messages`

### 6.4 `src/lib/api/job.api.ts` — **TYPE ALIGNMENT**
- `BackendJobPayload` type added (matches POST /jobs schema)
- `ProposalPayload` type added (matches POST /jobs/{id}/proposals schema)
- `ngnToKobo()` / `koboToNgn()` helpers added
- `SubmittedJob` extended with `clientId`, `budgetKobo`, `squadVirtualAccount`
- Job status enum expanded to include backend values
- Real API paths annotated in JSDoc for `transcribeVoice` and `submitJob`

---

## 7. Recommended Backend API Improvements

### 7.1 Add to OpenAPI Spec (Missing Endpoints)
```yaml
GET  /users/me
PATCH /users/me
GET  /artisans/{id}
GET  /artisans/search
GET  /jobs             # list with filters: client_id, artisan_id, status
GET  /jobs/{id}        # single job detail
GET  /jobs/{id}/messages  # chat history (GET counterpart)
GET  /wallet/balance
GET  /wallet/transactions
POST /ai/analyse-job
POST /ai/price-estimate
POST /auth/refresh
POST /notifications/read
```

### 7.2 Define Status Enums
Add `enum` values to `Job.status` in components/schemas:
```yaml
status:
  type: string
  enum: [draft, awaiting_funding, funded, open, assigned, in_progress, submitted, completed, disputed, cancelled]
```

### 7.3 Add `role` to Auth Response
`POST /auth/verify` should return `role` so the frontend knows which dashboard to show:
```yaml
properties:
  token: {type: string}
  role: {type: string, enum: [client, artisan]}
  message: {type: string}
```

### 7.4 Add Error Schemas
Document standard error responses:
```yaml
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        success: {type: boolean, example: false}
        message: {type: string}
        code: {type: string}  # e.g. "INSUFFICIENT_FUNDS", "INVALID_OTP"
```

### 7.5 Add Pagination
All list endpoints should support:
```yaml
parameters:
  - name: limit
    in: query
    schema: {type: integer, default: 20}
  - name: offset
    in: query
    schema: {type: integer, default: 0}
```

### 7.6 Add `amount_kobo` to `/jobs/{id}/release`
To support partial milestone payments:
```yaml
properties:
  client_id: {type: string, format: uuid}
  amount_kobo: {type: integer, description: "Partial release amount. Omit for full release."}
```

### 7.7 Add Authentication Docs to All Secured Endpoints
Every endpoint except `/auth/otp` and `/auth/verify` should include:
```yaml
security:
  - bearerAuth: []
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### 7.8 Document Squad Webhook
The funding flow relies on Squad webhooks but no webhook endpoint is documented:
```
POST /webhooks/squad   → receives Squad payment confirmation events
```
Document the expected payload and security (HMAC signature validation).

### 7.9 Add `description` to Job Schema
`Job` schema in components is missing `description`, `category`, and `location`:
```yaml
Job:
  properties:
    id: ...
    client_id: ...
    title: ...
    description: {type: string}  # MISSING
    category: {type: string}     # MISSING
    location: {type: string}     # MISSING
    status: ...
    budget_kobo: ...
    squad_virtual_account: ...
    created_at: {type: string, format: date-time}  # MISSING
```

---

## 8. Real-Time / Webhook Readiness

| Feature | Current | Recommended |
|---|---|---|
| Chat messages | Optimistic UI, no push | Poll `GET /jobs/{id}/messages` every 3s in chat view |
| Job status changes | Not implemented | Poll `GET /jobs/{id}` or WebSocket |
| Wallet funding | "I've Made the Transfer" button | Backend Squad webhook → update job status → push to client |
| Proposal received | Not implemented | Poll `GET /jobs/{id}/proposals` or WebSocket |
| Dispute resolution | Not implemented | Poll `GET /disputes/{id}` |

**Architecture note:** `apiClient.ts` is SSE/WebSocket-agnostic. Add a separate
`realtimeClient.ts` that wraps `EventSource` or `WebSocket` for push channels.

---

## 9. Auth & Role Concerns

| Concern | Status | Action |
|---|---|---|
| Token storage | `localStorage["auth-storage"]` via Zustand persist | ✅ Fine for hackathon; consider `httpOnly` cookie for production |
| Token in headers | `apiClient.ts` reads from storage automatically | ✅ Applied |
| Role-based routing | Frontend checks `role` from Zustand store | ⚠️ Backend must return `role` in `/auth/verify` |
| Token expiry | No refresh flow | ⚠️ Backend: `ACCESS_TTL=15m`, add `POST /auth/refresh` |
| Logout cleanup | Clears Zustand state only | ✅ Fine for mock; add server-side token invalidation when ready |
| Protected routes | Not enforced with JWT validation | ⚠️ Add route guards that redirect to `/login` on 401 response |

---

## 10. Integration Priority Checklist

### 🔴 Do First (Blocking)
- [ ] Backend: Add `GET /users/me` returning `{ id, phone_number, role, name }`
- [ ] Backend: Add `role` to `POST /auth/verify` response
- [x] Frontend: Migrate `Login.tsx` / `SignUp.tsx` to phone + OTP UI
- [x] Frontend: Wire `authApi.requestOtp` and `authApi.verifyOtp` to real backend
- [x] Frontend: Store JWT from `verifyOtp` response in `auth-storage`

### 🟡 Do Second (Core Features)
- [ ] Backend: Add `GET /jobs?client_id=` and `GET /jobs/{id}` endpoints
- [ ] Backend: Add `GET /wallet/balance` and `GET /wallet/transactions`
- [ ] Backend: Add `GET /jobs/{id}/messages` for chat history
- [x] Frontend: Replace mock chat with real `POST /jobs/{id}/messages` (and GET history)
- [x] Frontend: Fix `sendProposal` payload to use `{ artisanId, priceKobo, etaMinutes, message }`
- [ ] Frontend: Wire `POST /proposals/{id}/accept` for the client hire flow

### 🟢 Do Third (Polish)
- [ ] Backend: Add artisan search (`GET /artisans/search`)
- [ ] Backend: Document Squad webhook (`POST /webhooks/squad`)
- [ ] Frontend: Add polling for chat and job status updates
- [ ] Frontend: Implement `POST /payout/account/lookup` in withdrawal UI
- [ ] Frontend: Implement `POST /jobs/{id}/disputes` from chat screen
- [ ] Backend: Add AI analysis endpoint (`POST /ai/analyse-job`)
- [ ] Frontend: Activate `apiClient.ts` by setting `VITE_API_BASE_URL`
