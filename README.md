# Meta Lead Ads -> React Native Real-Time Ingestion System
## Developer & Operations Manual (Proof of Concept)

A production-grade, end-to-end integration manual demonstrating instantaneous, zero-touch lead ingestion from Meta Lead Ads into a live React Native (Expo) mobile application over WebSockets.

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [System Architecture & Data Flow](#2-system-architecture--data-flow)
3. [Project Directory Structure](#3-project-directory-structure)
4. [Prerequisites & Environment Requirements](#4-prerequisites--environment-requirements)
5. [Step-by-Step Installation & Setup Manual](#5-step-by-step-installation--setup-manual)
6. [Meta Developer Portal & Webhook Configuration](#6-meta-developer-portal--webhook-configuration)
7. [Verification & Testing Guide](#7-verification--testing-guide)
8. [API & Webhook Specifications](#8-api--webhook-specifications)
9. [Troubleshooting & FAQ](#9-troubleshooting--faq)
10. [Deliverables & Video Demonstration Links](#10-deliverables--video-demonstration-links)

---

## 1. Executive Summary & Problem Statement

### The Objective
To build a resilient Proof of Concept (PoC) where:
> **When a user submits a Meta Lead Ad form (simulated via Meta's Lead Testing Tool), the submitted lead appears live in an already-open React Native app screen without any manual action, pull-to-refresh, or touch interaction on the device.**

### Key Performance Indicators (KPIs)
- **Sub-Second Delivery**: End-to-end event transmission under 100 milliseconds via full-duplex WebSockets.
- **Zero-Touch Ingestion**: Fully reactive state management updating the UI instantly upon socket emission.
- **High Resilience**: Automatic fallback simulation layer enabling testing even during Meta API downtime or sandbox credential expirations.

---

## 2. System Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│             Meta Lead Ads Testing Tool                 │
│         (or Live Facebook/Instagram Lead Form)         │
└───────────────────────────┬────────────────────────────┘
                            │ (1) User Submits Form
                            ▼
┌────────────────────────────────────────────────────────┐
│             Meta Webhook Dispatcher                    │
└───────────────────────────┬────────────────────────────┘
                            │ (2) POST /webhook (HTTPS via Cloudflare Tunnel)
                            ▼
┌────────────────────────────────────────────────────────┐
│         Node.js + Express Backend Server               │
│  - Webhook Verification Handshake (GET /webhook)       │
│  - Asynchronous Event Dispatcher (POST /webhook)       │
│  - Meta Graph API v19.0 Client + Fallback Synthesizer  │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
  (3) GET /{leadgen_id}                   │ (4) io.emit('new_lead', payload)
               │                          │     Full-duplex WebSocket stream
               ▼                          ▼
┌──────────────────────────┐   ┌──────────────────────────────────────────┐
│     Meta Graph API       │   │     React Native (Expo) Mobile App       │
│  Resolves: Name, Email,  │   │  - Persistent Socket.io Client           │
│  Phone, Form ID          │   │  - Zero-touch state prepend ([lead, ...])│
└──────────────────────────┘   │  - Animated Cards & Haptic Feedback      │
                               └──────────────────────────────────────────┘
```

---

## 3. Project Directory Structure

```text
unque_real_time/
├── backend/                           # Node.js + Express + Socket.io Server
│   ├── server.js                      # Core HTTP & WebSocket server entry point
│   ├── routes/
│   │   ├── webhook.js                 # GET /webhook (handshake) & POST /webhook (receiver)
│   │   └── api.js                     # REST endpoints: /api/leads, /api/test-lead, /api/health
│   ├── services/
│   │   └── metaService.js             # Meta Graph API integration & mock lead synthesizer
│   ├── .env                           # Server environment variables
│   ├── .env.example                   # Environment configuration template
│   └── package.json                   # Backend dependencies and scripts
│
├── mobile/                            # React Native (Expo) Mobile Application
│   ├── App.tsx                        # Main UI container & WebSocket lifecycle manager
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx             # Live pulsating connection status indicator
│   │   │   ├── LeadCard.tsx           # Animated card component with copy & dialer actions
│   │   │   ├── EmptyState.tsx         # Modern placeholder & trigger guide
│   │   │   ├── StatsSummary.tsx       # Live metric badges (Total Leads, Graph API, Stream)
│   │   │   └── ServerConfigModal.tsx  # Dynamic runtime backend switcher (localhost / LAN / Tunnel)
│   │   ├── services/
│   │   │   └── socket.ts              # Socket.io client configuration & reconnect logic
│   │   ├── types/
│   │   │   └── lead.ts                # TypeScript interfaces & data contracts
│   │   └── constants/
│   │       └── theme.ts               # Dark modern theme palette & typography
│   ├── app.json                       # Expo application manifest
│   └── package.json                   # Mobile dependencies and build scripts
│
├── README.md                          # Comprehensive Developer & Operations Manual
├── ASSUMPTIONS.md                     # Engineering trade-offs & architectural rationale
└── LOOM_SCRIPTS.md                    # Exact spoken scripts for Video 1 & Video 2
```

---

## 4. Prerequisites & Environment Requirements

| Requirement | Minimum Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | v18.0.0+ (LTS recommended) | Backend runtime & Metro bundler execution |
| **npm** | v9.0.0+ | Package manager |
| **Cloudflare Tunnel (`cloudflared`)** | Bundled via `npx` | Secure public HTTPS reverse proxy for Meta Webhooks |
| **Android Studio / Emulator** | Pixel 8 (API 34+) or Expo Go | Mobile client rendering & testing |
| **Meta Developer Account** | Free Developer Tier | Webhook registration & Lead Ads Testing Tool access |

---

## 5. Step-by-Step Installation & Setup Manual

### Step 5.1: Backend Server Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `backend/.env`:
   ```env
   # Server Port
   PORT=5000

   # Meta Webhook Verification Token (Matches Meta App settings)
   META_VERIFY_TOKEN=meta_leads_secret_token_12345

   # Meta Graph API Page Access Token (Optional in dev mode)
   META_PAGE_ACCESS_TOKEN=

   # Meta Graph API Version
   META_GRAPH_API_VERSION=v19.0
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   *Expected output:*
   ```text
   🚀 Server listening on http://localhost:5000
   📡 Socket.io real-time engine ready
   ```

---

### Step 5.2: Launch Public HTTPS Tunnel

In a separate terminal, expose port `5000` to the internet using Cloudflare Tunnel:
```bash
npx cloudflared tunnel --url http://localhost:5000
```
*Note the generated public URL (e.g. `https://your-tunnel-name.trycloudflare.com`).*

---

### Step 5.3: Mobile Application Setup

1. Open another terminal and navigate to `mobile/`:
   ```bash
   cd mobile
   npm install --legacy-peer-deps
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

3. Launch on your desired target:
   - **Android Emulator**: Press **`a`** (Ensure Android Emulator is booted).
   - **Web Browser Preview**: Press **`w`** (Opens at `http://localhost:8081`).
   - **Physical Device**: Scan the QR code using the **Expo Go** app.

---

## 6. Meta Developer Portal & Webhook Configuration

### 6.1 Create Meta Business App
1. Navigate to **[Meta for Developers](https://developers.facebook.com/apps)**.
2. Click **Create App** $\rightarrow$ Select **Other** $\rightarrow$ Choose **Business** as the app type.
3. Name the app `Meta Leads PoC` and complete creation.

### 6.2 Configure Webhook Subscription
1. Under **Add Products**, locate **Webhooks** and click **Set up**.
2. Select **Page** from the dropdown menu.
3. Click **Subscribe to this object** (or Edit Subscription):
   - **Callback URL**: `https://<YOUR_CLOUDFLARE_SUBDOMAIN>.trycloudflare.com/webhook`
   - **Verify Token**: `meta_leads_secret_token_12345`
4. Click **Verify and Save**.
5. In the Webhook Fields table, locate **`leadgen`** and toggle it to **Subscribed**.

### 6.3 Link Facebook Page
1. Ensure your dummy Facebook Page is subscribed under **Page Subscriptions** inside the Meta Webhooks dashboard.

---

## 7. Verification & Testing Guide

### Test Mode A: Official Meta Lead Ads Testing Tool (Primary Requirement)
1. Open the **[Meta Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing)**.
2. Select your **Page** and **Instant Lead Form**.
3. If an existing test lead exists, click **Delete Lead** first.
4. Click the blue **Create Lead** button.
5. **Verify**: The lead appears instantaneously at the top of the mobile screen on your device with **zero manual refresh**.

### Test Mode B: In-App Direct Trigger (Developer Verification)
1. Open the mobile app.
2. Tap the **`⚡ Test Lead`** button in the header.
3. **Verify**: A simulated lead with realistic contact fields is synthesized by the backend and broadcasted to all connected devices.

### Test Mode C: PowerShell / Terminal cURL
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/test-lead" -Method Post -ContentType "application/json" -Body '{"fullName": "Rahul Sharma", "company": "Infosys", "formName": "Website Contact Form"}'
```

---

## 8. API & Webhook Specifications

### `GET /webhook` (Meta Handshake Verification)
- **Query Parameters**:
  - `hub.mode`: `"subscribe"`
  - `hub.verify_token`: Verification string defined in `.env`
  - `hub.challenge`: Random integer/string issued by Meta
- **Response**: Returns `hub.challenge` with `200 OK` if token matches; `403 Forbidden` otherwise.

### `POST /webhook` (Meta Event Ingestion)
- **Payload Structure**:
  ```json
  {
    "object": "page",
    "entry": [{
      "id": "PAGE_ID",
      "time": 1725240000,
      "changes": [{
        "field": "leadgen",
        "value": {
          "leadgen_id": "1234567890123456",
          "form_id": "987654321098765",
          "created_time": 1725240000
        }
      }]
    }]
  }
  ```
- **Response**: Immediately sends `200 EVENT_RECEIVED` to satisfy Meta's 20-second timeout threshold.

### WebSocket Event: `new_lead`
- **Emission**: `io.emit('new_lead', leadObject)`
- **Data Contract**:
  ```typescript
  interface Lead {
    id: string;
    leadgenId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    company: string;
    formName: string;
    adName: string;
    createdAt: string;
    receivedAt: string;
    isSimulated: boolean;
  }
  ```

---

## 9. Troubleshooting & FAQ

#### Q1: Why does Meta say "The callback URL or verify token couldn't be validated"?
- **Check 1**: Ensure your backend server is actively running on port 5000 (`npm run dev`).
- **Check 2**: Verify that your Cloudflare Tunnel is running and forwarding to `http://localhost:5000`.
- **Check 3**: Ensure `/webhook` is appended to your callback URL in Meta.

#### Q2: Why does Android Emulator fail to connect to `localhost:5000`?
- On Android emulators, `localhost` refers to the emulator's internal loopback. Use `http://10.0.2.2:5000` or configure it via the in-app **Settings (⚙️)** modal.

---

## 10. Deliverables & Video Demonstration Links

| Deliverable | Description | Resource Link |
| :--- | :--- | :--- |
| **Video 1: Live Demo** | Split-screen live demonstration of Meta Lead Tool $\rightarrow$ React Native zero-touch update (Max 5 mins) | *[Add your Loom Video 1 URL here]* |
| **Video 2: Architecture** | Deep dive into codebase, Webhook security, and Socket.io stream (4–5 mins) | *[Add your Loom Video 2 URL here]* |
| **Technical Assumptions** | Documentation of design trade-offs and scaling strategies | [ASSUMPTIONS.md](./ASSUMPTIONS.md) |
| **Video Presentation Scripts** | Word-for-word scripts for recording both demonstration videos | [LOOM_SCRIPTS.md](./LOOM_SCRIPTS.md) |
