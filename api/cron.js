const fetch = require("node-fetch");
const { PORTFOLIO, scoreStock } = require("./_shared");

module.exports = async function handler(req, res) {
  // Verify cron secret (Vercel sends this header)
  // In production, also check: req.headers['authorization'] === `Bearer ${process.env.CRON_SECRET}`

  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(200).json({ ok: false, error: "Telegram not configured" });
  }

  // Step 1: Fetch prices
  const prices = {};
  for (const h of PORTFOLIO) {
    try {
      const url = `https://www.google.com/finance/quote/${h.nse}:NSE`;
      const r = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        timeout: 5000,
      });
      const html = await r.text();
      const match = html.match(/data-last-price="([0-9.]+)"/);
      if (match) prices[h.s] = parseFloat(match[1]);
    } catch (e) { /* skip */ }
  }

  // Step 2: Score
  const scored = PORTFOLIO.map(h => {
    const ltp = prices[h.s] || 0;
    const sc = ltp > 0 ? scoreStock(h.s, ltp) : null;
    return { ...h, l: ltp, sc };
  }).filter(h => h.sc).sort((a, b) => b.sc.tot - a.sc.tot);

  const buyStocks = scored.filter(s => s.sc.zone === "BUY");

  // Step 3: Send Telegram
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
  const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });

  let msg = `🚨 *BUY ZONE ALERT*\n📅 ${date} • ${time}\n\n`;

  if (buyStocks.length === 0) {
    msg += `No stocks in buy zone today\\. ${scored.length} stocks scored\\.`;
  } else {
    msg += buyStocks.slice(0, 12).map(s => {
      const upStr = s.sc.up > 0 ? `\\+${s.sc.up}` : `${s.sc.up}`;
      return `✅ *${s.s}* — ${s.sc.tot}/100\n   ₹${s.l.toFixed(0)} → ₹${s.sc.dcf} \\(${upStr}%\\)\n   _${escMd(s.sc.nw)}_`;
    }).join("\n\n");
    msg += `\n\n📊 *${buyStocks.length}*/${scored.length} in BUY zone`;
  }

  // Summary stats
  const totalInv = scored.reduce((s, h) => s + h.q * h.a, 0);
  const totalCur = scored.reduce((s, h) => s + h.q * h.l, 0);
  const pnl = totalCur - totalInv;
  const pnlPct = ((pnl / totalInv) * 100).toFixed(1);
  msg += `\n\n💰 Portfolio P&L: ${pnl >= 0 ? "\\+" : ""}₹${(pnl / 1000).toFixed(0)}K \\(${pnlPct}%\\)`;

  try {
    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const tgRes = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: msg,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }),
    });
    const tgData = await tgRes.json();

    if (!tgData.ok) {
      // Fallback: send without markdown if formatting fails
      const plainMsg = msg.replace(/[\\*_`\[\]()~>#+\-=|{}.!]/g, "");
      await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: plainMsg }),
      });
    }

    return res.status(200).json({
      ok: true,
      scored: scored.length,
      buyZone: buyStocks.length,
      pricesFound: Object.keys(prices).length,
      telegramSent: true,
    });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message });
  }
};

function escMd(s) {
  return String(s).replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
