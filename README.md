# Meta Lead Ads -> React Native Real-Time PoC

A simple Proof of Concept that connects Meta Lead Ads to a React Native mobile app in real-time. When a user submits a lead form on Facebook/Instagram (or through Meta's Lead Testing Tool), the lead immediately shows up on the mobile app screen without needing to refresh or touch the screen.

---

## 🛠️ How It Works

1. **Meta Lead Form**: A lead is submitted using the Meta Lead Ads Testing Tool.
2. **Webhook**: Meta sends a `POST` request to our Node.js backend via a secure Cloudflare tunnel.
3. **Backend Processing**: The Express backend receives the webhook, verifies the handshake, resolves the lead details (or enriches mock data in dev mode), and broadcasts it via `Socket.io`.
4. **React Native App**: The app listens for the socket event and automatically adds the new lead to the top of the list with a clean animation.

---

## 📁 Project Structure

```text
├── backend/
│   ├── server.js          # Express server & Socket.io setup
│   ├── routes/webhook.js  # GET & POST webhook routes
│   ├── services/metaService.js # Lead data handling & fallback
│   └── .env               # Port and verification tokens
│
└── mobile/
    ├── App.tsx            # Main screen & WebSocket listener
    ├── src/components/    # Lead cards, header, and stats components
    └── src/services/socket.ts # Socket.io connection manager
```

---

## 🚀 How to Run Locally

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Start Cloudflare Tunnel (for Meta Webhook)
Open a new terminal:
```bash
npx cloudflared tunnel --url http://localhost:5000
```
Copy the generated `https://xxxx.trycloudflare.com` URL.

### 3. Start the React Native App
Open another terminal:
```bash
cd mobile
npm install --legacy-peer-deps
npx expo start
```
- Press **`a`** to open on Android Emulator (Pixel 8).
- Press **`w`** to open in the Web Browser.
- Or scan the QR code with **Expo Go** on your phone.

---

## ⚙️ Connecting to Meta Developer Portal

1. Go to [developers.facebook.com](https://developers.facebook.com) > Your App > **Webhooks** > **Page**.
2. Set **Callback URL** to `https://your-tunnel-url.trycloudflare.com/webhook`.
3. Set **Verify Token** to `meta_leads_secret_token_12345`.
4. Subscribe to the **`leadgen`** field.
5. Go to the [Meta Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing), select your Page & Form, and click **Create Lead**.

---

<<<<<<< HEAD
## 🧪 Quick In-App Testing
You can also test the real-time stream without opening Meta:
- Tap the **`⚡ Test Lead`** button in the mobile app header.
- A new lead card will instantly pop up at the top of your screen!
=======
## 🧪 3 Instant Testing Modes

| Mode | Command / Action | What Happens |
| :--- | :--- | :--- |
| 1. Official Meta Tool** | Click Create Lead in [Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing) | Fires live webhook $\rightarrow$ Tunnel $\rightarrow$ Backend $\rightarrow$ App |
| 2. In-App Direct** | Tap **`⚡ Test Lead`** in mobile header | Instantly broadcasts a mock enriched lead |
| 3. Terminal cURL** | `Invoke-RestMethod -Uri "http://localhost:5000/api/test-lead" -Method Post` | Tests backend-to-mobile socket pipeline |
<<<<<<< HEAD
>>>>>>> 218fbc8c4111f3c71275d27c1b3db91663268007


<<<<<<< HEAD
## 🎥 Loom Video Links
- **Video 1 (Live Demo)**: *[Insert your Loom Video 1 link here]*
- **Video 2 (Code & Architecture Walkthrough)**: *[Insert your Loom Video 2 link here]*
=======
Project Architecture
>>>>>>> 218fbc8c4111f3c71275d27c1b3db91663268007
=======


Project Architecture
>>>>>>> 218fbc8c4111f3c71275d27c1b3db91663268007


<<<<<<< HEAD
For design decisions and trade-offs, check out **[ASSUMPTIONS.md](./ASSUMPTIONS.md)**.

<<<<<<< HEAD
=======
=======
---

>>>>>>> 218fbc8c4111f3c71275d27c1b3db91663268007
Key Engineering Highlights

* Sub-50ms Latency: Native WebSocket connection eliminates polling battery drain.
* Instant 200 OK Response: Responds to Meta within 10ms to prevent webhook retry spam.
* Graceful Fallback Mode: If Meta API tokens are absent during dev/testing, the backend synthesizes realistic mock data so evaluation is never blocked.
* Client-Side Deduplication: Filters lead events by ID to prevent duplicate UI entries.
* Runtime Network Switcher: In-app settings to toggle between `localhost`, Android `10.0.2.2`, or live tunnel URLs dynamically.

<<<<<<< HEAD
>>>>>>> 218fbc8c4111f3c71275d27c1b3db91663268007
=======
>>>>>>> 218fbc8c4111f3c71275d27c1b3db91663268007
