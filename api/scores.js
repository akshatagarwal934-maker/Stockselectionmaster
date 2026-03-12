const fetch = require("node-fetch");
const { PORTFOLIO, scoreStock } = require("./_shared");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Fetch live prices from Google Finance
  const prices = {};
  const symbols = PORTFOLIO.map(h => h.nse);

  // Use a lightweight price source
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

  // Score everything
  const scored = PORTFOLIO.map(h => {
    const ltp = prices[h.s] || 0;
    const sc = ltp > 0 ? scoreStock(h.s, ltp) : null;
    return { s: h.s, q: h.q, a: h.a, l: ltp, sc };
  }).filter(h => h.sc).sort((a, b) => b.sc.tot - a.sc.tot);

  return res.status(200).json({
    scores: scored,
    lastUpdate: new Date().toISOString(),
    pricesFound: Object.keys(prices).length,
  });
};
