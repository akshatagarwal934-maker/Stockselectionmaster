# 📊 Buy Zone Monitor — Deployment Guide

## What This Does
- **Automatically fetches** live stock prices every weekday at 3:45 PM IST
- **Scores** your 38 stocks using a 7-pillar model (DCF, Valuation, Growth, Quality, Technical, Safety, Governance)
- **Sends WhatsApp alerts** when stocks are in the buy zone (score ≥ 60/100)
- **Web dashboard** accessible from any phone or browser

---

## 🚀 Deploy on Render.com (Recommended — Free)

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) → Sign in (or create free account)
2. Click **"New repository"** → Name it `buyzone-monitor`
3. Set it to **Private** (important — this has your portfolio data)
4. Upload these 4 files:
   - `package.json`
   - `server.js`
   - `render.yaml`
   - `public/index.html` (create a `public` folder first)

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) → Sign up free with GitHub
2. Click **"New" → "Web Service"**
3. Connect your `buyzone-monitor` GitHub repo
4. Render auto-detects settings from `render.yaml`
5. Add **Environment Variables** (critical!):
   - `WHATSAPP_PHONE` → Your phone number (e.g., `919876543210`)
   - `WHATSAPP_APIKEY` → Your CallMeBot API key
6. Click **"Create Web Service"**
7. Wait 2-3 minutes for deploy — you'll get a URL like:
   `https://buyzone-monitor.onrender.com`

### Step 3: Set Up CallMeBot (one-time, 2 minutes)
1. Save **+34 644 51 84 61** in your phone contacts
2. Send this message to that number on WhatsApp:
   **"I allow callmebot to send me messages"**
3. You'll receive your API key within 2-3 minutes
4. Add it as the `WHATSAPP_APIKEY` environment variable on Render

### Step 4: Install as Phone App
1. Open your Render URL in Chrome (Android) or Safari (iPhone)
2. Tap ⋮ menu → **"Add to Home Screen"**
3. It appears as an app icon on your phone

---

## ⏰ How the Cron Works

| Time | Action |
|------|--------|
| 3:45 PM IST Mon–Fri | Fetches live prices → Scores all stocks → Sends WhatsApp if BUY stocks found |

You can change the schedule by modifying the `CRON_SCHEDULE` env variable.
Examples:
- `45 15 * * 1-5` = 3:45 PM weekdays (default)
- `0 9 * * 1-5` = 9:00 AM weekdays (morning alert)
- `*/30 9-15 * * 1-5` = Every 30 min during market hours

---

## 🔒 Security Notes

- Keep your GitHub repo **PRIVATE** — it contains portfolio data
- Render environment variables are encrypted
- CallMeBot credentials are server-side only
- The dashboard has no authentication — consider adding basic auth if concerned
  (add `express-basic-auth` package and protect routes)

---

## 🔄 Keeping Render Free Tier Alive

Render free tier sleeps after 15 min of inactivity. The cron job needs
the server running. Two options:

**Option A:** Use [UptimeRobot](https://uptimerobot.com) (free)
1. Sign up → Add monitor → HTTP → Your Render URL + `/api/health`
2. Set check interval to 5 minutes
3. This pings your server and prevents sleep

**Option B:** Upgrade to Render Starter ($7/month)
- Always-on, no sleep
- Better for production use

---

## 📱 Alternative: Netlify + GitHub Actions (also free)

If Render doesn't work for you:

1. Deploy the `public/index.html` on Netlify (static site)
2. Use GitHub Actions for the cron job:

Create `.github/workflows/daily-alert.yml`:
```yaml
name: Daily Buy Zone Alert
on:
  schedule:
    - cron: '15 10 * * 1-5'  # 3:45 PM IST = 10:15 UTC
jobs:
  alert:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: node send-alert.js
        env:
          WHATSAPP_PHONE: ${{ secrets.WHATSAPP_PHONE }}
          WHATSAPP_APIKEY: ${{ secrets.WHATSAPP_APIKEY }}
```

---

## 📝 Updating Your Portfolio

When your holdings change:
1. Edit the `PORTFOLIO` array in `server.js`
2. Push to GitHub → Render auto-deploys

To update fundamental data (PE ratios, DCF targets etc.):
1. Edit the `DB` object in `server.js`
2. Push to GitHub

---

## Not Financial Advice
This tool is for informational purposes only. DCF models involve
assumptions that may not materialize. Always consult a SEBI-registered
financial advisor before making investment decisions.
