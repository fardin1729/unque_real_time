# Meta Lead Ads - React Native Real-Time Integration POC





## Architecture Flow


1. Customer submits Lead via Meta Testing Tool
   
2. Meta Webhook triggers POST /webhook (via ngrok or localtunnel HTTPS)
   
3. Node.js + Express Backend
   Verifies GET /webhook handshake with hub.verify_token
   Replies immediately with 200 EVENT_RECEIVED to prevent retries
   Calls Meta Graph API v19.0 to fetch name, email, and phone

4. Socket.io Server broadcasts event: io.emit('new_lead', leadData)

5. React Native (Expo) Mobile App
   Subscribes to live socket stream
   Prepends new lead card to the top with animation
   Updates automatically with ZERO manual refresh or touch

## Project Structure


meta_leads_rn_poc/
├── backend/
│   ├── server.js              # Express server + Socket.io setup
│   ├── routes/
│   │   ├── webhook.js         # GET /webhook (verification) & POST /webhook (receiver)
│   │   └── api.js             # GET /api/leads, POST /api/test-lead, GET /api/health
│   ├── services/
│   │   └── metaService.js     # Graph API client & field parsing logic
│   ├── .env.example           # Example environment variables
│   └── package.json
├── mobile/
│   ├── App.tsx                # Main mobile screen with live socket listener
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx             # Top bar with Live Connection dot
│   │   │   ├── LeadCard.tsx           # Lead card with animated entry & copy actions
│   │   │   ├── EmptyState.tsx         # Empty state guidance & test button
│   │   │   ├── StatsSummary.tsx       # Lead counter metrics row
│   │   │   └── ServerConfigModal.tsx  # Modal to switch backend server URL
│   │   ├── services/
│   │   │   └── socket.ts              # Socket.io client setup & reconnection logic
│   │   ├── types/
│   │   │   └── lead.ts                # TypeScript data types
│   │   └── constants/
│   │       └── theme.ts               # App colors and spacing
│   ├── app.json
│   └── package.json
├── README.md                  # Complete setup and testing guide
├── ASSUMPTIONS.md             # Technical assumptions and trade-offs
└── LOOM_SCRIPTS.md            # Video presentation scripts (Demo & Architecture)
```

---

## How to Run Locally

### 1. Run Backend Server

Open Terminal 1:
```bash
cd backend
npm install
npm start
```
The backend server will run on `http://localhost:5000`.

---

### 2. Run React Native Mobile App

Open Terminal 2:
```bash
cd mobile
npm install
npx expo start --web
```
- Open in web browser: **`http://localhost:8081`**
- Or scan QR code using **Expo Go** on your Android / iOS phone.

---

## Testing Real-Time Lead Delivery

### Option 1: Quick In-App Testing (No Meta setup needed)
- Open `http://localhost:8081` in your browser.
- Click the **`Test Lead`** button in the header.
- The new lead card will immediately appear at the top of the list with a highlight animation.

### Option 2: Using Terminal / cURL
Open Terminal 3:
```bash
curl -X POST http://localhost:5000/api/test-lead \
     -H "Content-Type: application/json" \
     -d '{"fullName": "Rahul Sharma", "company": "Infosys", "formName": "Bangalore Tech Lead Form"}'
```

---

### Option 3: Full Integration with Meta Lead Ads Testing Tool

1. **Expose your local backend using localtunnel or ngrok**:
   ```bash
   npx localtunnel --port 5000
   ```
   *(Copy the generated HTTPS URL, e.g. `https://random-name.loca.lt`)*

2. **Configure in Meta Developers Portal**:
   - Go to [developers.facebook.com](https://developers.facebook.com/) > Your App > **Webhooks** > Select **Page**.
   - **Callback URL**: `https://random-name.loca.lt/webhook`
   - **Verify Token**: `meta_leads_secret_token_12345`
   - Subscribe to the **`leadgen`** field.

3. **Add Page Access Token in `backend/.env`**:
   ```ini
   META_PAGE_ACCESS_TOKEN=your_page_access_token_here
   ```

4. **Submit Lead in Meta Tool**:
   - Open the [Meta Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing).
   - Select your Page and Form, then click **Create Lead**.
   - Watch the lead arrive on your open mobile screen in `http://localhost:8081` in real time!

---

## Documentation Files
- **[ASSUMPTIONS.md](file:///c:/Users/HP/OneDrive/Desktop/meta_leads_rn_poc/ASSUMPTIONS.md)**: Detailed technical assumptions and design decisions.
- **[LOOM_SCRIPTS.md](file:///c:/Users/HP/OneDrive/Desktop/meta_leads_rn_poc/LOOM_SCRIPTS.md)**: Complete speaking scripts for recording both Loom demo videos.
