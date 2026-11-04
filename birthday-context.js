/* Shared birthday context for Acrostia birthday tools.
   sessionStorage only: the context lives in this tab and does NOT sync across
   tabs, windows or devices. A birthday entered on any connected page prefills
   the others in the same tab. The context is never written into a URL; sharing
   stays an explicit action on each page. Partial entries are allowed (a month
   picked on birthstone can pair with a day entered on birth-date); stored
   fields are re-validated on every read, and missing, unreadable or stale
   data is discarded silently. Birth-date eligibility also lives here,
   separate from the calendar-range checks in fun-data.js: a stored birth
   date must be a real calendar date and cannot lie in the future. */
window.BDAY = (function () {
  var KEY = "acrostia-bd-context-v1";

  function okRange(v, lo, hi) { return typeof v === "number" && v >= lo && v <= hi && v % 1 === 0; }

  /* Is (d, m, y) a date someone can have been born on? It must be a real
     calendar date (leap years respected) and must not lie in the future.
     Returns { ok: true } or { ok: false, why: "calendar" | "future" }. */
  var DIM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function leap(y) { return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0); }
  function eligible(d, m, y) {
    d = +d; m = +m; y = +y;
    var t = new Date(), ty = t.getFullYear();
    if (!okRange(m, 1, 12) || !okRange(d, 1, 31)) return { ok: false, why: "calendar" };
    if (!okRange(y, 1900, 2030)) return { ok: false, why: y > 2030 ? "future" : "calendar" };
    if (d > DIM[m - 1] + (m === 2 && leap(y) ? 1 : 0)) return { ok: false, why: "calendar" };
    if (y > ty || y * 10000 + m * 100 + d > ty * 10000 + (t.getMonth() + 1) * 100 + t.getDate()) return { ok: false, why: "future" };
    return { ok: true };
  }

  function valid(c) {
    if (!c || c.v !== 1) return false;
    if (c.d !== undefined && !okRange(c.d, 1, 31)) return false;
    if (c.m !== undefined && !okRange(c.m, 1, 12)) return false;
    if (c.y !== undefined && !okRange(c.y, 1900, new Date().getFullYear())) return false;
    if (c.n !== undefined && (typeof c.n !== "string" || c.n.length > 18)) return false;
    if (c.d !== undefined && c.m !== undefined && c.y !== undefined && !eligible(c.d, c.m, c.y).ok) return false;
    return c.d !== undefined || c.m !== undefined || c.y !== undefined || c.n !== undefined;
  }

  function clean(c) {
    var o = {};
    ["d", "m", "y", "n"].forEach(function (k) { if (c[k] !== undefined) o[k] = c[k]; });
    return o;
  }

  function get() {
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || "null");
      return valid(c) ? clean(c) : null;
    } catch (e) { return null; }
  }

  /* Merge a partial entry into the stored context; fields not given keep their
     stored values. A change that would make any stored field invalid is
     rejected and the last good context is kept. */
  function set(p) {
    if (!p || typeof p !== "object") return get();
    var c = get() || {};
    ["d", "m", "y", "n"].forEach(function (k) {
      if (p[k] !== undefined && p[k] !== null && p[k] !== "") {
        c[k] = k === "n" ? String(p[k]).slice(0, 18) : +p[k];
      }
    });
    var chk = { v: 1, d: c.d, m: c.m, y: c.y, n: c.n };
    if (!valid(chk)) return get();
    try { sessionStorage.setItem(KEY, JSON.stringify(chk)); } catch (e) { return get(); }
    return get();
  }

  function clear() { try { sessionStorage.removeItem(KEY); } catch (e) {} }

  return { get: get, set: set, clear: clear, eligible: eligible };
})();

/* Birthday profile chip: a small link to the Birthday Discovery hub, injected
   into the header of every page that loads this file. It shows the stored
   context as a short label and stays hidden until a context exists. The hub
   itself opts out with <body data-bd-hub>. Everything here is defensive and
   fails silently so a hostile or unusual document can never break a page. */
(function () {
  var B = window.BDAY;
  if (!B) return;
  var M3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function label(c) {
    c = c || B.get();
    if (!c || (!c.d && !c.m)) return "";
    var t = c.n || "Birthday";
    if (c.d && c.m) t += " · " + c.d + " " + M3[c.m - 1];
    return t;
  }
  function chip() {
    try {
      var d = document;
      if (typeof d.querySelector !== "function") return null;
      return d.querySelector(".bd-chip");
    } catch (e) { return null; }
  }
  function update() {
    try {
      var a = chip();
      if (!a) return;
      var t = label();
      a.style.display = t ? "" : "none";
      a.textContent = t;
    } catch (e) {}
  }
  var _set = B.set, _clear = B.clear;
  B.set = function (p) { var r = _set(p); update(); return r; };
  B.clear = function () { _clear(); update(); };
  B._chipUpdate = update;
  function place() {
    try {
      var d = document;
      if (typeof d.querySelector !== "function") return;            /* test harness stub */
      if (d.body && typeof d.body.hasAttribute === "function" &&
          d.body.hasAttribute("data-bd-hub")) return;               /* the hub carries its own header */
      if (chip()) { update(); return; }
      var header = d.querySelector("header");
      var top = header ? header.querySelector(".top-cta") : null;
      var host = header || d.querySelector(".top");
      if (!host) return;
      var dark = !header; /* old-template pages use a .top line on a dark ground */
      var style = d.createElement("style");
      style.textContent =
        ".bd-chip{display:inline-flex;align-items:center;gap:.45rem;margin-right:.8rem;" +
        "font:600 .82rem Onest,system-ui,sans-serif;color:#241d12;text-decoration:none;" +
        "border:1.5px solid #dccfae;border-radius:999px;padding:.42rem .85rem;" +
        "background:rgba(253,249,241,.75);white-space:nowrap}" +
        ".bd-chip:hover{border-color:#7a4a12}" +
        ".bd-chip.dark{color:#f3ecd9;border-color:rgba(243,236,217,.45);background:rgba(0,0,0,.18)}" +
        ".bd-chip.dark:hover{border-color:#f4b840}";
      (d.head || d.documentElement).appendChild(style);
      var a = d.createElement("a");
      a.className = dark ? "bd-chip dark" : "bd-chip";
      a.href = "../birthday-profile/";
      a.setAttribute("aria-label", "Birthday discovery hub");
      if (top) top.parentNode.insertBefore(a, top); else host.appendChild(a);
      update();
    } catch (e) {}
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", place);
    else place();
  }
})();
