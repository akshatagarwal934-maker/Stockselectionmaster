const fetch = require("node-fetch");
const { PORTFOLIO, scoreStock } = require("./_shared");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Accept token/chatId from body (for setup) or env vars (for production)
  let token, chatId;
  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    token = body.token || process.env.TELEGRAM_BOT_TOKEN;
    chatId = body.chatId || process.env.TELEGRAM_CHAT_ID;
  } else {
    token = process.env.TELEGRAM_BOT_TOKEN;
    chatId = process.env.TELEGRAM_CHAT_ID;
  }

  if (!token || !chatId) {
    return res.status(400).json({ ok: false, error: "Telegram token and chatId required" });
  }

  // Fetch prices
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

  // Score
  const scored = PORTFOLIO.map(h => {
    const ltp = prices[h.s] || 0;
    const sc = ltp > 0 ? scoreStock(h.s, ltp) : null;
    return { ...h, l: ltp, sc };
  }).filter(h => h.sc).sort((a, b) => b.sc.tot - a.sc.tot);

  const buyStocks = scored.filter(s => s.sc.zone === "BUY");
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

  let msg = `🚨 BUY ZONE ALERT\n📅 ${date}\n\n`;
  if (buyStocks.length === 0) {
    msg += `No stocks in buy zone. ${scored.length} scored.`;
  } else {
    msg += buyStocks.slice(0, 12).map(s =>
      `✅ ${s.s} — ${s.sc.tot}/100\n   ₹${s.l.toFixed(0)} → ₹${s.sc.dcf} (${s.sc.up > 0 ? "+" : ""}${s.sc.up}%)\n   ${s.sc.nw}`
    ).join("\n\n");
    msg += `\n\n📊 ${buyStocks.length}/${scored.length} in BUY zone`;
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: msg }),
    });
    const tgData = await tgRes.json();
    return res.status(200).json({ ok: tgData.ok, buyZone: buyStocks.length, scored: scored.length });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};
