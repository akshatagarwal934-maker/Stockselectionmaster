// ═══════════════════════════════════════════════════════════════
// SHARED: Portfolio data, fundamentals DB, and scoring engine
// ═══════════════════════════════════════════════════════════════

const PORTFOLIO = [
  {s:"KPITTECH",q:306,a:1170.58,nse:"KPITTECH"},
  {s:"ALKYLAMINE",q:73,a:1988.22,nse:"ALKYLAMINE"},
  {s:"ASIANPAINT",q:117,a:2577.93,nse:"ASIANPAINT"},
  {s:"GMMPFAUDLR",q:72,a:1094.96,nse:"GMMPFAUDLR"},
  {s:"RELAXO",q:19,a:1017.56,nse:"RELAXO"},
  {s:"IEX",q:157,a:186.61,nse:"IEX"},
  {s:"DEEPAKNTR",q:15,a:2151.33,nse:"DEEPAKNTR"},
  {s:"HAPPSTMNDS",q:25,a:798.21,nse:"HAPPSTMNDS"},
  {s:"HINDUNILVR",q:70,a:2297.43,nse:"HINDUNILVR"},
  {s:"ETERNAL",q:120,a:254.13,nse:"ETERNAL"},
  {s:"ROSSARI",q:5,a:1095.99,nse:"ROSSARI"},
  {s:"BEPL",q:180,a:94.23,nse:"BEPL"},
  {s:"AMRUTANJAN",q:5,a:875.29,nse:"AMRUTANJAN"},
  {s:"NSLNISP",q:35,a:83.01,nse:"NSLNISP"},
  {s:"KWIL",q:70,a:43.88,nse:"KWALITY"},
  {s:"AARTIDRUGS",q:6,a:528.03,nse:"AARTIDRUGS"},
  {s:"SBICARD",q:26,a:722.13,nse:"SBICARD"},
  {s:"SUBEXLTD",q:10,a:42.05,nse:"SUBEXLTD"},
  {s:"RECLTD",q:1,a:615.2,nse:"RECLTD"},
  {s:"DRREDDY",q:10,a:1219.2,nse:"DRREDDY"},
  {s:"EQUITASBNK",q:154,a:50.30,nse:"EQUITASBNK"},
  {s:"REDINGTON",q:20,a:162.75,nse:"REDINGTON"},
  {s:"LALPATHLAB",q:10,a:964.93,nse:"LALPATHLAB"},
  {s:"LAURUSLABS",q:10,a:502.8,nse:"LAURUSLABS"},
  {s:"KOTAKBANK",q:100,a:329.49,nse:"KOTAKBANK"},
  {s:"PIDILITIND",q:18,a:1088.98,nse:"PIDILITIND"},
  {s:"HDFCLIFE",q:85,a:581.25,nse:"HDFCLIFE"},
  {s:"NAVINFLUOR",q:2,a:3339.75,nse:"NAVINFLUOR"},
  {s:"CAMS",q:45,a:509.12,nse:"CAMS"},
  {s:"POWERGRID",q:44,a:122.60,nse:"POWERGRID"},
  {s:"DMART",q:50,a:3751.42,nse:"DMART"},
  {s:"ICICIBANK",q:18,a:750.64,nse:"ICICIBANK"},
  {s:"HDFCBANK",q:214,a:785.03,nse:"HDFCBANK"},
  {s:"SAIL",q:320,a:98.49,nse:"SAIL"},
  {s:"BAJFINANCE",q:90,a:632.03,nse:"BAJFINANCE"},
  {s:"CDSL",q:42,a:478.34,nse:"CDSL"},
  {s:"HDFCAMC",q:40,a:1364.13,nse:"HDFCAMC"},
  {s:"DIVISLAB",q:16,a:3315.56,nse:"DIVISLAB"},
];

const DB = {
  KPITTECH:{pe:35.6,roe:14.2,de:.05,dy:.33,rg:32.1,pg:28.5,pr:39.4,hi:1434.5,lo:672.5,dcf:890,sec:"IT/Auto",nw:"Q3 PAT missed by 30%"},
  ASIANPAINT:{pe:52.8,roe:26.8,de:.15,dy:1.3,rg:8.2,pg:3.5,pr:52.6,hi:3395,lo:2155,dcf:2680,sec:"Paints",nw:"Q3 PAT -4.56% YoY"},
  HDFCBANK:{pe:18.5,roe:16.8,de:null,dy:1.2,rg:22.5,pg:11.5,pr:25.5,hi:1100,lo:827.6,dcf:1050,sec:"Banking",nw:"Q3 PAT +11.5%"},
  HINDUNILVR:{pe:34.35,roe:32.1,de:.02,dy:2.28,rg:6.8,pg:5.2,pr:61.9,hi:2705,lo:2114,dcf:2480,sec:"FMCG",nw:"Q3 PAT +121% YoY"},
  BAJFINANCE:{pe:34.61,roe:20.5,de:4.2,dy:.4,rg:25.8,pg:18.2,pr:54.9,hi:1102.5,lo:821.13,dcf:1080,sec:"NBFC",nw:"Rev +17.5% YoY"},
  DMART:{pe:95.2,roe:13.5,de:.02,dy:0,rg:22.5,pg:15.8,pr:74.6,hi:5484,lo:3400,dcf:4200,sec:"Retail",nw:"Rev +17% YoY"},
  DIVISLAB:{pe:67.9,roe:16,de:.01,dy:.47,rg:15.2,pg:22.8,pr:51.9,hi:7071.5,lo:4955,dcf:6800,sec:"Pharma",nw:"Margins 35%+"},
  CDSL:{pe:54.2,roe:29.7,de:0,dy:1,rg:25.2,pg:19.1,pr:15,hi:1828.9,lo:1047.45,dcf:1450,sec:"Mkt Infra",nw:"170M demat, 80% share"},
  ALKYLAMINE:{pe:42.5,roe:18.4,de:.08,dy:.5,rg:-2.5,pg:-15.2,pr:67.8,hi:2120,lo:1260,dcf:1580,sec:"Chem",nw:"Demand recovering"},
  HDFCAMC:{pe:35.2,roe:27,de:0,dy:1.8,rg:18.5,pg:22.1,pr:52.5,hi:4865,lo:2440,dcf:3200,sec:"AMC",nw:"AUM ₹70L+ Cr"},
  CAMS:{pe:32.5,roe:34.5,de:0,dy:1.6,rg:20.2,pg:18.8,pr:22.8,hi:870,lo:530,dcf:820,sec:"Fin Svcs",nw:"RTA ~70% share"},
  GMMPFAUDLR:{pe:35.8,roe:11.8,de:.35,dy:.4,rg:12.5,pg:5.8,pr:52.3,hi:1490,lo:820,dcf:1050,sec:"Cap Gds",nw:"Order book healthy"},
  HDFCLIFE:{pe:78.5,roe:10,de:null,dy:.5,rg:12.5,pg:8.2,pr:49.9,hi:762,lo:576,dcf:740,sec:"Insurance",nw:"VNB positive"},
  ICICIBANK:{pe:18.2,roe:17.2,de:null,dy:.8,rg:28.5,pg:24.8,pr:0,hi:1430,lo:1130,dcf:1520,sec:"Banking",nw:"Apple Pay talks"},
  ETERNAL:{pe:null,roe:-2.5,de:.05,dy:0,rg:65.2,pg:null,pr:0,hi:300,lo:190,dcf:280,sec:"Food Tech",nw:"Blinkit strong"},
  DEEPAKNTR:{pe:28.5,roe:14.8,de:.12,dy:.4,rg:5.2,pg:-8.5,pr:49.8,hi:3340,lo:1440,dcf:1850,sec:"Chem",nw:"Phenol done"},
  SAIL:{pe:18.5,roe:4.5,de:.55,dy:2.8,rg:2.5,pg:-12.5,pr:65,hi:175,lo:95,dcf:165,sec:"Steel",nw:"Prices recovering"},
  POWERGRID:{pe:17.2,roe:16.2,de:1.5,dy:3.5,rg:8.5,pg:12.2,pr:51.3,hi:367,lo:270,dcf:340,sec:"Power",nw:"₹1.5L Cr pipeline"},
  DRREDDY:{pe:19.8,roe:17.6,de:.08,dy:.8,rg:12.8,pg:18.5,pr:26.7,hi:1550,lo:1115,dcf:1480,sec:"Pharma",nw:"US generics strong"},
  PIDILITIND:{pe:65.2,roe:24.2,de:.02,dy:.6,rg:12.5,pg:15.2,pr:69.8,hi:1675,lo:1260,dcf:1580,sec:"Adhesives",nw:"Market leader"},
  KOTAKBANK:{pe:19.2,roe:13.2,de:null,dy:.1,rg:18.5,pg:14.8,pr:25.9,hi:465,lo:370,dcf:450,sec:"Banking",nw:"Q3 PAT +4%"},
  HAPPSTMNDS:{pe:22.5,roe:25.8,de:.18,dy:1.2,rg:18.5,pg:12.2,pr:53.1,hi:920,lo:380,dcf:520,sec:"IT Svcs",nw:"Digital resilient"},
  SBICARD:{pe:32.5,roe:16,de:3.5,dy:.3,rg:22.5,pg:8.5,pr:68.6,hi:860,lo:640,dcf:820,sec:"Cards",nw:"Spends growing"},
  EQUITASBNK:{pe:8.5,roe:14.2,de:null,dy:0,rg:28.5,pg:35.2,pr:0,hi:90,lo:50,dcf:72,sec:"SFB",nw:"Deposits healthy"},
  LALPATHLAB:{pe:52.8,roe:20,de:.02,dy:.9,rg:8.5,pg:5.2,pr:54.6,hi:1590,lo:980,dcf:1550,sec:"Diagnostics",nw:"Hub-spoke growing"},
  LAURUSLABS:{pe:42.5,roe:13.6,de:.28,dy:.4,rg:8.5,pg:-5.2,pr:27.2,hi:1185,lo:455,dcf:1180,sec:"CDMO",nw:"CDMO scaling"},
  IEX:{pe:28.5,roe:28.8,de:0,dy:1.8,rg:5.2,pg:2.8,pr:0,hi:215,lo:115,dcf:155,sec:"Exchange",nw:"Volumes growing"},
  REDINGTON:{pe:14.5,roe:17.2,de:.15,dy:2.2,rg:12.5,pg:8.5,pr:0,hi:280,lo:175,dcf:285,sec:"IT Dist",nw:"Cloud growing"},
  NAVINFLUOR:{pe:52.5,roe:14.8,de:.15,dy:.3,rg:8.5,pg:5.2,pr:26.5,hi:7100,lo:3500,dcf:6500,sec:"Fluoro",nw:"HPP scaling"},
  RELAXO:{pe:55.8,roe:9.8,de:.05,dy:.3,rg:5.2,pg:-18.5,pr:71.2,hi:900,lo:290,dcf:420,sec:"Footwear",nw:"Rural sluggish"},
  BEPL:{pe:12.5,roe:9.6,de:.08,dy:.8,rg:2.5,pg:-5.2,pr:62.5,hi:138,lo:72,dcf:98,sec:"Plastics",nw:"Utilization up"},
  AARTIDRUGS:{pe:18.2,roe:12.2,de:.18,dy:.6,rg:5.2,pg:-8.5,pr:54.8,hi:600,lo:340,dcf:420,sec:"Pharma",nw:"API demand up"},
  AMRUTANJAN:{pe:22.5,roe:16.8,de:0,dy:1.2,rg:12.5,pg:8.5,pr:48.2,hi:920,lo:530,dcf:680,sec:"Health",nw:"Pain mgmt growing"},
  ROSSARI:{pe:28.5,roe:9.8,de:.35,dy:.3,rg:15.2,pg:-12.5,pr:52.8,hi:920,lo:440,dcf:580,sec:"Chem",nw:"HPPC growing"},
  RECLTD:{pe:6.8,roe:22,de:7.2,dy:3.2,rg:18.5,pg:22.5,pr:52.6,hi:654,lo:320,dcf:420,sec:"Pwr NBFC",nw:"Lending robust"},
  SUBEXLTD:{pe:null,roe:-8.5,de:.45,dy:0,rg:-5.2,pg:null,pr:0,hi:16,lo:7,dcf:10,sec:"Telecom",nw:"Rev pressured"},
  KWIL:{pe:null,roe:-6.8,de:.85,dy:0,rg:-8.5,pg:null,pr:55.2,hi:55,lo:21,dcf:28,sec:"Retail",nw:"Restructuring"},
  NSLNISP:{pe:null,roe:-12.5,de:1.2,dy:0,rg:-15.2,pg:null,pr:42.5,hi:85,lo:35,dcf:35,sec:"Steel",nw:"Ops stressed"},
};

function scoreStock(sym, ltp) {
  const f = DB[sym];
  if (!f || !ltp || ltp <= 0) return null;
  const up = ((f.dcf - ltp) / ltp) * 100;
  const dcfS = Math.min(20, Math.max(0, up * 0.8));
  const val = f.pe ? Math.min(15, Math.max(0, (50 - f.pe) * 0.5)) : 5;
  const grw = Math.min(15, Math.max(0, ((f.rg || 0) + (f.pg || 0)) * 0.2));
  const qlt = Math.min(15, Math.max(0, (f.roe || 0) * 0.5));
  const rng = f.hi - f.lo;
  const pos = rng > 0 ? (ltp - f.lo) / rng : 0.5;
  const tch = Math.min(15, Math.max(0, (1 - pos) * 15));
  const dv = Math.min(5, (f.dy || 0) * 1.5);
  const dt = f.de !== null ? Math.min(5, Math.max(0, (1 - f.de) * 5)) : 2.5;
  const saf = dv + dt;
  const gov = Math.min(10, (f.pr || 0) * 0.15);
  const tot = +(dcfS + val + grw + qlt + tch + saf + gov).toFixed(1);
  return { tot, zone: tot >= 60 ? "BUY" : tot >= 45 ? "HOLD" : "AVOID", up: +up.toFixed(1), dcf: f.dcf, sec: f.sec, nw: f.nw };
}

module.exports = { PORTFOLIO, DB, scoreStock };
