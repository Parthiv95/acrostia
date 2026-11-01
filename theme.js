/* Acrostia seasonal themes: the site dresses for the holiday automatically. */
(function () {
  "use strict";
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var q = new URLSearchParams(location.search).get("season");
  var now = new Date();
  var md = (now.getMonth() + 1) * 100 + now.getDate();
  var y = now.getFullYear();
  function inWin(a, b) { return a <= b ? (md >= a && md <= b) : (md >= a || md <= b); }
  var DIWALI = { 2025: 1018, 2026: 1108, 2027: 1028, 2028: 1017 }; /* Lakshmi Puja, approx */
  var EIDFITR = { 2026: 320, 2027: 310, 2028: 226 }; /* Eid al-Fitr, approx */
  var mode = null;
  if (q && q !== "off") mode = q;
  else if (inWin(207, 214)) mode = "valentine";
  else if (inWin(1024, 1031)) mode = "halloween";
  else if (inWin(1213, 1226)) mode = "christmas";
  else if (inWin(1227, 103)) mode = "newyear";
  else if (DIWALI[y] && inWin(DIWALI[y] - 2, DIWALI[y] + 1)) mode = "diwali";
  else if (EIDFITR[y] && inWin(EIDFITR[y] - 1, EIDFITR[y] + 1)) mode = "eid";
  if (!mode) return;

  document.documentElement.setAttribute("data-season", mode);

  var cv = document.createElement("canvas");
  cv.id = "seasonFx";
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2147483000;";
  document.body.appendChild(cv);
  var x = cv.getContext("2d");

  var CONF = {
    christmas:  { n: 70, dir: 1 },
    newyear:    { n: 60, dir: 1 },
    halloween:  { n: 16, dir: 1 },
    valentine:  { n: 22, dir: -1 },
    diwali:     { n: 26, dir: -1 },
    eid:        { n: 14, dir: -1 }
  }[mode];

  var W, H, parts = [];
  function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
  size();
  addEventListener("resize", size);

  var EMOJI = { halloween: ["🎃", "🦇", "🕸️"], diwali: ["✨", "🪔", "✨"], eid: ["🌙", "⭐"] };
  var HEARTS = ["♥", "❤️", "💕"];
  var GOLD = ["#f4b840", "#e2694a", "#f6d08a", "#c94277"];

  function spawn(initial) {
    var p = { x: Math.random() * W, ph: Math.random() * 6.28, sw: 0.4 + Math.random() * 0.9, y: undefined };
    if (mode === "christmas") {
      p.r = 1.2 + Math.random() * 2.4; p.v = 0.35 + Math.random() * 0.9; p.a = 0.35 + Math.random() * 0.5;
    } else if (mode === "newyear") {
      p.r = 3 + Math.random() * 5; p.v = 0.6 + Math.random() * 1.4; p.rot = Math.random() * 6.28; p.vr = (Math.random() - 0.5) * 0.12;
      p.c = GOLD[Math.floor(Math.random() * GOLD.length)]; p.a = 0.7 + Math.random() * 0.3;
    } else if (mode === "halloween") {
      p.ch = EMOJI.halloween[Math.floor(Math.random() * 3)]; p.s = 11 + Math.random() * 11; p.v = 0.25 + Math.random() * 0.6; p.a = 0.55 + Math.random() * 0.35;
    } else if (mode === "valentine") {
      p.ch = HEARTS[Math.floor(Math.random() * 3)]; p.s = 10 + Math.random() * 13; p.v = 0.3 + Math.random() * 0.7; p.a = 0.35 + Math.random() * 0.4;
    } else if (mode === "diwali") {
      p.ch = EMOJI.diwali[Math.floor(Math.random() * 3)]; p.s = 10 + Math.random() * 12; p.v = 0.25 + Math.random() * 0.6; p.a = 0.5 + Math.random() * 0.4;
    } else {
      p.ch = EMOJI.eid[Math.floor(Math.random() * 2)]; p.s = 12 + Math.random() * 12; p.v = 0.2 + Math.random() * 0.5; p.a = 0.4 + Math.random() * 0.35;
    }
    if (CONF.dir === 1) p.y = initial ? Math.random() * H : -20;
    else p.y = initial ? Math.random() * H : H + 20;
    return p;
  }
  for (var i = 0; i < CONF.n; i++) parts.push(spawn(true));

  var running = true, scheduled = false;
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running && !scheduled) { scheduled = true; tick(); }
  });

  function step() {
    x.clearRect(0, 0, W, H);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.ph += 0.012 + p.sw * 0.008;
      if (CONF.dir === 1) { p.y += p.v; if (p.y > H + 24) parts[i] = spawn(false); }
      else { p.y -= p.v; if (p.y < -24) parts[i] = spawn(false); }
      var xx = p.x + Math.sin(p.ph) * 22 * p.sw;
      x.globalAlpha = p.a;
      if (mode === "christmas") {
        var light = false;
        try { var bg = getComputedStyle(document.body).backgroundColor, m = bg.match(/\d+/g); light = m && (+m[0] + +m[1] + +m[2]) > 500; } catch (e) {}
        x.fillStyle = light ? "rgba(122,148,196,.85)" : "#fff";
        x.beginPath(); x.arc(xx, p.y, p.r, 0, 7); x.fill();
      } else if (mode === "newyear") {
        p.rot += p.vr;
        x.save(); x.translate(xx, p.y); x.rotate(p.rot);
        x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r * 0.3, p.r, p.r * 0.6);
        x.restore();
      } else {
        x.font = p.s + "px serif"; x.textAlign = "center";
        x.fillText(p.ch, xx, p.y);
      }
    }
    x.globalAlpha = 1;
  }
  function tick() { if (!running) { scheduled = false; return; } step(); requestAnimationFrame(tick); }
  scheduled = true; tick();
})();
