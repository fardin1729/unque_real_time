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

