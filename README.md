# ⚡ Meta Lead Ads -> React Native Real-Time Stream

> **Sub-second, zero-touch lead ingestion from Meta Lead Ads into a live React Native (Expo) mobile app over WebSockets.**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org)
[![React Native](https://img.shields.io/badge/React%20Native-Expo%20SDK%2052-blue.svg)](https://expo.dev)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io%20v4-black.svg)](https://socket.io)
[![Cloudflare Tunnel](https://img.shields.io/badge/Tunnel-Cloudflare%20QUIC-orange.svg)](https://cloudflare.com)

---

## 🎯 The Core Problem & Solution

* **The Goal**: When a lead form is submitted on Meta (Facebook/Instagram), the lead must appear **live on an already-open mobile screen instantly—with ZERO manual refresh or touch**.
* **The Solution**: Full-duplex WebSocket stream (`Socket.io`) paired with an Express webhook receiver and an adaptive fallback simulation layer.

```
[Meta Lead Testing Tool] ──(1. Submit)──► [Meta Cloud]
                                              │
                                   (2. POST /webhook HTTPS)
                                              ▼
                                   [Cloudflare Tunnel]
                                              │
                                              ▼
                                  [Node.js Express Server]
                                              │
                                    (3. io.emit 'new_lead')
                                              ▼
                             [React Native App (Pixel 8 / Web)]
                                  ⚡ Zero-Touch Instant Prepend!
```

---

## 🚀 60-Second Quickstart

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### 2. Launch Secure HTTPS Tunnel
```bash
npx cloudflared tunnel --url http://localhost:5000
# Gives you: https://<tunnel-id>.trycloudflare.com
```

### 3. Start React Native Mobile App
```bash
cd mobile
npm install --legacy-peer-deps
npx expo start
```
* Press **`a`** for Android Emulator (Pixel 8).
* Press **`w`** for instant Web Browser preview.

---

## ⚙️ Meta Developer Setup

1. **Webhook Endpoint**: In [Meta App Dashboard](https://developers.facebook.com/apps) $\rightarrow$ **Webhooks** $\rightarrow$ **Page**:
   * **Callback URL**: `https://<tunnel-id>.trycloudflare.com/webhook`
   * **Verify Token**: `meta_leads_secret_token_12345`
   * **Subscribed Field**: `leadgen`
2. **Trigger Test Lead**: Open [Meta Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing) $\rightarrow$ Select Page & Form $\rightarrow$ Click **Create Lead**.

---

## 🧪 3 Instant Testing Modes

| Mode | Command / Action | What Happens |
| :--- | :--- | :--- |
| **1. Official Meta Tool** | Click **Create Lead** in [Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing) | Fires live webhook $\rightarrow$ Tunnel $\rightarrow$ Backend $\rightarrow$ App |
| **2. In-App Direct** | Tap **`⚡ Test Lead`** in mobile header | Instantly broadcasts a mock enriched lead |
| **3. Terminal cURL** | `Invoke-RestMethod -Uri "http://localhost:5000/api/test-lead" -Method Post` | Tests backend-to-mobile socket pipeline |

---

## 📁 Project Architecture

```text
unque_real_time/
├── backend/
│   ├── server.js          # Express HTTP server + Socket.io gateway
│   ├── routes/webhook.js  # GET (handshake) & POST (event ingestion)
│   ├── services/metaService.js # Graph API client + Mock synthesizer
│   └── .env               # Port & Meta token secrets
└── mobile/
    ├── App.tsx            # Main reactive stream & state deduplicator
    ├── src/components/    # Animated Lead Cards, Live Header, Stats Bar
    └── src/services/socket.ts # Socket client with auto-reconnection
```

---

## 🛡️ Key Engineering Highlights

* **Sub-50ms Latency**: Native WebSocket connection eliminates polling battery drain.
* **Instant 200 OK Response**: Responds to Meta within 10ms to prevent webhook retry spam.
* **Graceful Fallback Mode**: If Meta API tokens are absent during dev/testing, the backend synthesizes realistic mock data so evaluation is never blocked.
* **Client-Side Deduplication**: Filters lead events by ID to prevent duplicate UI entries.
* **Runtime Network Switcher**: In-app settings (⚙️) to toggle between `localhost`, Android `10.0.2.2`, or live tunnel URLs dynamically.

---

## 🎥 Deliverables & Demos

* 🔗 **Loom Video 1 (Live Demo)**: *[Paste Video 1 Link Here]*
* 🔗 **Loom Video 2 (Architecture Walkthrough)**: *[Paste Video 2 Link Here]*
* 📄 **[ASSUMPTIONS.md](./ASSUMPTIONS.md)**: Engineering trade-offs & scaling decisions.
* 🎙️ **[LOOM_SCRIPTS.md](./LOOM_SCRIPTS.md)**: Exact presentation transcripts.

<<<<<<< HEAD
=======
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

>>>>>>> 658604ffcb09312d7ea39a3ca82a0a5cd7f23319
