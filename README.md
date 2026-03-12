# 📊 Buy Zone Monitor — Vercel Edition

Automated portfolio scoring + Telegram alerts, deployed on Vercel.

## Architecture (Vercel-compatible)

```
public/index.html     → Dashboard (static, auto-fetches from API)
api/scores.js         → Serverless: fetches prices + returns scores
api/cron.js           → Serverless: daily job → score → Telegram alert
api/send-alert.js     → Serverless: manual trigger for Telegram
api/_shared.js         → Shared portfolio data + scoring engine
```

**Why this works on Vercel:** No express server, no node-cron.
Each API route is a serverless function. Cron is handled by
Vercel's built-in cron scheduler (or free external cron).

---

## 🚀 Deploy (5 minutes)

### 1. Create Telegram Bot (60 seconds)

1. Open Telegram → search **@BotFather** → send `/newbot`
2. Name it (e.g., "BuyZone Bot") → copy the **Bot Token**
3. Open your new bot in Telegram → send it "hi"
4. Visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
5. Find `"chat":{"id":XXXXXXXX}` → that's your **Chat ID**

### 2. Push to GitHub

1. Create a **private** repo on github.com
2. Upload ALL files keeping this structure:
   ```
   vercel.json
   package.json
   public/index.html
   api/_shared.js
   api/scores.js
   api/cron.js
   api/send-alert.js
   ```

### 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → sign up with GitHub
2. "Add New Project" → import your repo
3. Framework: **Other**
4. Add Environment Variables:
   - `TELEGRAM_BOT_TOKEN` = your bot token
   - `TELEGRAM_CHAT_ID` = your chat ID
5. Deploy!

### 4. Set Up Recurring Alerts

**Option A: Vercel Cron (requires Pro plan, $20/mo)**
Already configured in vercel.json — runs at 10:15 UTC (3:45 PM IST).

**Option B: cron-job.org (FREE — recommended)**
1. Go to [cron-job.org](https://cron-job.org) → free account
2. Create new job:
   - URL: `https://your-site.vercel.app/api/cron`
   - Schedule: Custom → `15 10 * * 1-5` (3:45 PM IST)
   - Method: GET
3. Save. Done. Runs every weekday automatically.

**Option C: GitHub Actions (FREE)**
Create `.github/workflows/cron.yml` in your repo:
```yaml
name: Daily Alert
on:
  schedule:
    - cron: '15 10 * * 1-5'
jobs:
  alert:
    runs-on: ubuntu-latest
    steps:
      - run: curl -s https://your-site.vercel.app/api/cron
```

### 5. Install as Phone App

Open your Vercel URL in Chrome/Safari → ⋮ → "Add to Home Screen"

---

## 🔒 Security

- GitHub repo must be **PRIVATE** (contains portfolio data)
- Telegram bot token + chat ID are in Vercel env vars (encrypted)
- Bot can only send to YOUR chat (can't be used by others)
- No sensitive financial data is exposed via the public API

---

## 📝 Updating Portfolio

When your holdings change, edit the `PORTFOLIO` array in
`api/_shared.js` and push to GitHub. Vercel auto-deploys.

---

## Troubleshooting

**500 error on Vercel:**
- Make sure you have `vercel.json`, `package.json`, and the `api/` folder
- Check Vercel function logs: Dashboard → your project → Functions tab

**Telegram not sending:**
- Verify bot token: `curl https://api.telegram.org/bot<TOKEN>/getMe`
- Verify chat ID: `curl https://api.telegram.org/bot<TOKEN>/getUpdates`
- Make sure you sent a message to the bot first (it needs at least 1)

**Prices showing 0:**
- Google Finance scraping can be rate-limited
- The dashboard still works — scores will be based on last known prices

---

Not financial advice. Consult SEBI-registered advisor.
