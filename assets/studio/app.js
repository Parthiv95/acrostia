(function () {
  var A = window.Acrostia;
  var OCC_MAP = {
    'birthday':'birthday','wedding':'wedding','anniversary':'anniversary','diwali':'diwali',
    'christmas':'christmas','eid':'eid','new baby':'baby','graduation':'graduation',
    'get well':'getwell','thank you':'thanks'
  };
  var NAME_MAX = 40;   // accepted name length
  var POEM_MAX = 20;   // letters on one card
  var qs = new URLSearchParams(location.search);
  var st = {
    name: cleanName(qs.get('n')) || 'Noah',
    name2: cleanName(qs.get('n2')),
    from: (qs.get('from') || '').replace(/[^\p{L}\s'&.-]/gu, '').slice(0, 24),
    occ: OCC_MAP[(qs.get('o') || 'birthday').toLowerCase()] || 'birthday',
    style: (qs.get('s') === 'rhyming' ? 'rhyme' : 'acrostic'),
    voice: qs.get('v') || 'gentle',
    verse: 0,
    font: (['script','keepsake','simple','hand','storybook'].indexOf(qs.get('f')) !== -1 ? qs.get('f') : 'script')
  };

  var el = function (id) { return document.getElementById(id); };
  var nameIn = el('nm'), name2In = el('nm2'), fromIn = el('from');
  var cName = el('cName'), cOcc = el('cOcc'), cPoem = el('cPoem'), bedCap = el('bedCap');
  var hint = el('hint'), prog = el('prog');

  nameIn.value = st.name;
  if (st.name2 && name2In) name2In.value = st.name2;
  if (st.from && fromIn) fromIn.value = st.from;
  if (A) A.voice(st.voice);

  function stripInvalid(v) {
    return (v || '').replace(/[^\p{L}\s'&-]/gu, '').replace(/\s{2,}/g, ' ').slice(0, NAME_MAX);
  }
  function cleanName(v) { return stripInvalid(v).trim(); }
  function poemName(v) {
    var letters = (v || '').replace(/[^\p{L}]/gu, '');
    if (letters.length <= POEM_MAX) return v;
    var first = (v || '').split(' ')[0].replace(/[^\p{L}]/gu, '');
    return first.length && first.length <= POEM_MAX ? first : letters.slice(0, POEM_MAX);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cardLines() {
    if (!A) return [];
    A.voice(st.voice);
    if (st.style === 'rhyme' || !A.canAcrostic(st.name)) {
      var txt = A.rhyme(st.name, st.name2, st.verse, st.occ);
      return txt.split('\n').filter(Boolean).map(function (l) { return { raw: l }; });
    }
    return (st.name2 ? A.pair(poemName(st.name), poemName(st.name2), st.occ) : A.acrostic(poemName(st.name), st.occ));
  }

  function syncChips() {
    if (!A) return;
    var lab = A.label(st.occ).toLowerCase();
    document.querySelectorAll('[data-bench="2"] .chip').forEach(function (c) {
      c.classList.toggle('is-on', c.textContent.trim().toLowerCase() === lab);
    });
    document.querySelectorAll('.v').forEach(function (c) {
      c.classList.toggle('is-on', c.textContent.trim().toLowerCase() === st.voice);
    });
    var seg = document.querySelectorAll('[data-bench="3"] .seg button');
    seg.forEach(function (b, i) { b.classList.toggle('is-on', (st.style === 'rhyme') === (i === 1)); });
  }

  var lastLines = [];

  function lineHTML(l) {
    return '<b>' + esc(l.letter) + '</b> is for ' + esc(l.word) + ', ' + esc(l.desc) +
           (l.suf ? ', ' + esc(l.suf) : '') + (l.who ? ' (' + esc(l.who) + ')' : '');
  }

  var PAIR_OCC = ['couple', 'engagement', 'wedding', 'anniversary', 'valentine', 'silver-anniversary'];
  // each script sets the name and the poem body, the way the old build did
  // One source for the wash that keeps the poem legible over artwork. The screen
  // reads it through --card-scrim and the canvas replays the same stops, so the
  // download can no longer look unlike the preview.
  var SCRIM = { type: 'linear', stops: [[0, 'rgba(255,252,245,.34)'], [0.28, 'rgba(255,252,245,.54)'], [0.5, 'rgba(255,252,245,.62)'], [0.72, 'rgba(255,252,245,.54)'], [1, 'rgba(255,252,245,.34)']] };
  function scrimCss() {
    var stops = SCRIM.stops.map(function (s) { return s[1] + ' ' + Math.round(s[0] * 100) + '%'; }).join(', ');
    if (SCRIM.type === 'linear') return 'linear-gradient(180deg, ' + stops + ')';
    return 'radial-gradient(ellipse at ' + (SCRIM.cx * 100) + '% ' + (SCRIM.cy * 100) + '%, ' + stops + ')';
  }
  try { document.documentElement.style.setProperty('--card-scrim', scrimCss()); } catch (e) {}

  var FONT_MAP = {
    script:    { name: "clamp(2.4rem,4vw,3.4rem) 'Great Vibes', cursive",
                 cv: "88px 'Great Vibes', cursive", caps: false, track: "0",
                 body: "'Great Vibes', cursive", bstyle: "normal", bweight: "400", bsize: ".96", cpx: 1.16 },
    keepsake:  { name: "italic 400 clamp(2rem,3.2vw,2.6rem) Fraunces, Georgia, serif",
                 cv: "italic 400 64px Fraunces, Georgia, serif", caps: false, track: "0",
                 body: "Fraunces, Georgia, serif", bstyle: "italic", bweight: "400", bsize: ".94", cpx: 1 },
    simple:    { name: "600 clamp(1.5rem,2.4vw,2rem) Fraunces, Georgia, serif",
                 cv: "600 52px Fraunces, Georgia, serif", caps: true, track: ".06em",
                 body: "Fraunces, Georgia, serif", bstyle: "normal", bweight: "400", bsize: ".9", cpx: 1 },
    hand:      { name: "clamp(2rem,3.2vw,2.6rem) 'Bradley Hand', 'Segoe Script', cursive",
                 cv: "64px 'Bradley Hand', 'Segoe Script', cursive", caps: false, track: "0",
                 body: "'Bradley Hand', 'Segoe Script', cursive", bstyle: "normal", bweight: "400", bsize: "1.02", cpx: 1.07 },
    storybook: { name: "300 clamp(2rem,3.2vw,2.6rem) Fraunces, Georgia, serif",
                 cv: "300 64px Fraunces, Georgia, serif", caps: false, track: ".02em",
                 body: "Fraunces, Georgia, serif", bstyle: "normal", bweight: "300", bsize: ".94", cpx: 1 }
  };

  function render() {
    syncChips();
    var isPair = PAIR_OCC.indexOf(st.occ) !== -1;
    if (name2In) {
      name2In.disabled = !isPair;
      name2In.placeholder = isPair ? 'for couples' : 'couples occasions only';
      if (!isPair && st.name2) { st.name2 = ''; name2In.value = ''; }
    }
    var cCloser = document.getElementById('cCloser');
    var cFrom = document.getElementById('cFrom');
    var verseBtn = document.getElementById('verseBtn');
    var head = st.name2 ? st.name + ' & ' + st.name2 : st.name;
    cName.textContent = head.length > 26 ? head.slice(0, 25).trim() + '\u2026' : head;
    cName.title = head;
    cOcc.textContent = A ? A.label(st.occ) : st.occ;
    lastLines = cardLines();
    if (cCloser) {
      var isRhyme = st.style === 'rhyme';
      cCloser.textContent = (!isRhyme && A && A.closer) ? (st.name2 ? st.name + ' & ' + st.name2 : st.name) + ', ' + A.closer(st.occ) : '';
      cPoem.classList.toggle('has-closer', !isRhyme);
      cCloser.style.display = (!isRhyme && st.voice !== 'heartfelt') || (!isRhyme) ? '' : 'none';
    }
    if (cFrom) cFrom.textContent = st.from ? 'from ' + st.from : '';
    if (verseBtn) verseBtn.style.display = st.style === 'rhyme' ? '' : 'none';
    var out = '';
    if (st.style === 'rhyme' || !A.canAcrostic(st.name)) {
      lastLines.forEach(function (l) { out += '<li class="verse">' + l.raw + '</li>'; });
    } else {
      lastLines.forEach(function (l, i) {
        out += '<li><button type="button" class="line-reroll" data-i="' + i + '" title="Choose a different word">' + lineHTML(l) + '</button></li>';
      });
    }
    cPoem.innerHTML = out;
    cPoem.classList.toggle('is-verse', st.style === 'rhyme');
    cPoem.classList.toggle('two-col', st.style !== 'rhyme' && lastLines.length > 8);
    var nonLatin = !A.canAcrostic(st.name);
    bedCap.textContent = 'Live card · ' + A.label(st.occ) + ' · ' +
      (nonLatin ? 'rhyming verse, no Latin letters' : st.voice + ' voice') + (st.bg ? ' · your paper' : '');
    nameIn.value = st.name;
  if (st.name2 && name2In) name2In.value = st.name2;
  if (st.from && fromIn) fromIn.value = st.from;
    if (st.style !== 'rhyme' && A) {
      Array.prototype.forEach.call(cPoem.querySelectorAll('.line-reroll'), function (el) {
        el.addEventListener('click', function () {
          var i = +el.dataset.i, l = lastLines[i];
          if (!l || !A.reroll) return;
          var next = A.reroll(l.letter, st.occ, l.word);
          lastLines[i] = next;
          el.innerHTML = lineHTML(next);
          fitCard();
        });
      });
    }
    renderWordBank();
  }


  /* ---------- word bank: every word the current name can use ---------- */
  function renderWordBank() {
    var box = document.getElementById('wordBank');
    var body = document.getElementById('wbBody');
    if (!box || !body || !A || !A.words) return;
    if (st.style === 'rhyme' || !lastLines.length || !A.canAcrostic(st.name)) {
      box.style.display = 'none';
      return;
    }
    box.style.display = '';
    var order = [], byLetter = {};
    lastLines.forEach(function (l, i) {
      if (!byLetter[l.letter]) { byLetter[l.letter] = []; order.push(l.letter); }
      byLetter[l.letter].push(i);
    });
    var html = '';
    order.forEach(function (L) {
      var idx = byLetter[L][0];
      var current = lastLines[idx].word;
      var pool = A.words(L, st.occ).map(function (w) { return w.word; });
      if (pool.indexOf(current) === -1) pool.unshift(current);
      html += '<div class="wb-row"><span class="wb-letter">' + L + '</span><div class="wb-chips">' +
        pool.map(function (w) {
          return '<button type="button" class="wb-chip' + (w === current ? ' is-on' : '') +
            '" data-letter="' + L + '" data-word="' + esc(w) + '">' + esc(w) + '</button>';
        }).join('') + '</div></div>';
    });
    body.innerHTML = html;
    Array.prototype.forEach.call(body.querySelectorAll('.wb-chip'), function (chip) {
      chip.addEventListener('click', function () {
        var L = chip.dataset.letter, word = chip.dataset.word;
        var pool = A.words(L, st.occ);
        var found = null;
        for (var i = 0; i < pool.length; i++) { if (pool[i].word === word) { found = pool[i]; break; } }
        if (!found) { found = { word: word, desc: lastLines[byLetter[L][0]].desc }; }
        var idx = byLetter[L][0];
        lastLines[idx] = { letter: L, word: found.word, desc: found.desc, suf: '' };
        var btn = document.querySelector('.line-reroll[data-i="' + idx + '"]');
        if (btn) btn.innerHTML = lineHTML(lastLines[idx]);
        renderWordBank();
        fitCard();
      });
    });
  }

  /* ---------- card backgrounds ---------- */
  var bgImg = null;

  function applyBg() {
    var card = document.getElementById('cardEl');
    if (!card) return;
    if (!st.bg) {
      card.classList.remove('has-bg');
      card.style.backgroundImage = '';
      return;
    }
    card.classList.add('has-bg');
    card.style.backgroundImage = 'url("' + st.bg + '")';
  }

  var ALLOWED_BG = /^(\.\.\/backgrounds\/[a-z-]+\.png|\.\.\/assets\/floral\/[a-z0-9-]+\.jpg|data:image\/(png|jpe?g|webp);base64,)/;
  function safeBg(src) { return src && ALLOWED_BG.test(src) ? src : null; }

  function setBg(src, btn) {
    src = safeBg(src);
    st.bg = src || null;
    bgImg = null;
    if (src) {
      bgImg = new Image();
      bgImg.src = src;
    }
    document.querySelectorAll('.bgthumb').forEach(function (b) { b.classList.remove('is-on'); });
    if (btn) btn.classList.add('is-on');
    applyBg();
    render();
    var u = new URL(location.href);
    if (src) u.searchParams.set('bg', src); else u.searchParams.delete('bg');
    history.replaceState(null, '', u);
  }

  function initBackgrounds() {
    document.querySelectorAll('.bgthumb[data-bg]').forEach(function (b) {
      b.addEventListener('click', function () { setBg(b.dataset.bg, b); });
    });
    var up = document.getElementById('bgUpload');
    if (up) up.addEventListener('change', function () {
      var f = up.files && up.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type) || f.size > 8 * 1024 * 1024) { up.value = ''; return; }
      var fr = new FileReader();
      fr.onload = function () { setBg(fr.result, up.closest('.bgthumb')); };
      fr.readAsDataURL(f);
    });
  }

  function initOccasions() {
    var sel = document.getElementById('occSel');
    if (!sel || !A) return;
    A.occasions().sort(function (a, b) { return A.label(a).localeCompare(A.label(b)); }).forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o; opt.textContent = A.label(o);
      if (o === st.occ) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function () {
      st.occ = sel.value;
      render();
      syncUrl();
    });
  }

  function syncUrl() {
    var u = new URL(location.href);
    u.searchParams.set('n', st.name);
    u.searchParams.set('o', st.occ);
    u.searchParams.set('s', st.style === 'rhyme' ? 'rhyming' : 'acrostic');
    u.searchParams.set('v', st.voice);
    history.replaceState(null, '', u);
  }

  nameIn.addEventListener('input', function () {
    var live = stripInvalid(nameIn.value);
    if (live !== nameIn.value) nameIn.value = live;
    st.name = live.trim() || 'Noah';
    render(); syncUrl();
  });
  nameIn.addEventListener('blur', function () { nameIn.value = cleanName(nameIn.value); st.name = nameIn.value || 'Noah'; });
  name2In.addEventListener('input', function () {
    var live = stripInvalid(name2In.value);
    if (live !== name2In.value) name2In.value = live;
    st.name2 = live.trim();
    render();
  });
  name2In.addEventListener('blur', function () { name2In.value = cleanName(name2In.value); st.name2 = name2In.value; render(); });
  var kid = document.getElementById('kidTone');
  if (kid) kid.addEventListener('change', function () {
    st.voice = kid.checked ? 'playful' : 'gentle';
    render();
    syncUrl();
  });
  fromIn.addEventListener('input', function () { st.from = fromIn.value.trim(); render(); });
  var verseBtn = document.getElementById('verseBtn');
  if (verseBtn) verseBtn.addEventListener('click', function () {
    var n = (A && A.verseCount) ? A.verseCount(st.occ) : 2;
    st.verse = (st.verse + 1) % Math.max(1, n);
    render();
  });

  document.querySelectorAll('[data-bench="2"] .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      document.querySelectorAll('[data-bench="2"] .chip').forEach(function (x) { x.classList.remove('is-on'); });
      c.classList.add('is-on');
      st.occ = OCC_MAP[c.textContent.trim().toLowerCase()] || 'birthday';
      render(); syncUrl();
    });
  });

  document.querySelectorAll('.v').forEach(function (c) {
    c.addEventListener('click', function () {
      document.querySelectorAll('.v').forEach(function (x) { x.classList.remove('is-on'); });
      c.classList.add('is-on');
      st.voice = c.textContent.trim().toLowerCase();
      render(); syncUrl();
    });
  });

  var seg = document.querySelectorAll('[data-bench="3"] .seg button');
  seg.forEach(function (b, i) {
    b.addEventListener('click', function () {
      seg.forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      st.style = i === 1 ? 'rhyme' : 'acrostic';
      render(); syncUrl();
    });
  });

  function applyFont() {
    var f = FONT_MAP[st.font] || FONT_MAP.script;
    // one typeface per card: the choice sets the name, the poem and the closer
    // together, so a card never reads as two designs stapled to each other
    var cardEl = document.getElementById('cardEl');
    if (cardEl) { cardEl.className = cardEl.className.replace(/\bt-\w+/g, '').trim() + ' t-' + st.font; }
    cName.style.font = f.name;
    cName.style.letterSpacing = f.track || '0';
    cName.style.textTransform = f.caps ? 'uppercase' : 'none';
    cPoem.style.fontFamily = f.body;
    cPoem.style.fontStyle = f.bstyle;
    cPoem.style.fontWeight = f.bweight;
    cPoem.style.letterSpacing = '0';
    var closer = document.getElementById('cCloser');
    if (closer) {
      closer.style.fontFamily = f.body;
      closer.style.fontStyle = f.bstyle;
      closer.style.fontWeight = f.bweight;
    }
    if (typeof fitCard === 'function') fitCard();
  }
  document.querySelectorAll('.fopt').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.fopt').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      st.font = b.dataset.f || 'script';
      applyFont();
      var u = new URL(location.href);
      u.searchParams.set('f', st.font);
      history.replaceState(null, '', u);
    });
  });
  applyFont();

  document.querySelectorAll('.sw').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.sw').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      var card = document.getElementById('cardEl');
      if (card) card.style.background = b.style.background;
    });
  });

  /* ---------- exports ---------- */
  function poemText() {
    var lines = cardLines();
    var head = (st.name2 ? st.name + ' & ' + st.name2 : st.name) + '\n' + A.label(st.occ) + '\n\n';
    var rhyming = st.style === 'rhyme' || !A.canAcrostic(st.name2 ? st.name : st.name);
    if (rhyming) return head + lines.map(function (l) { return l.raw || ''; }).join('\n');
    return head + lines.map(function (l) { return l.letter + ' is for ' + l.word + ', ' + l.desc + (l.suf ? ', ' + l.suf : '') + (l.who ? ' (' + l.who + ')' : ''); }).join('\n');
  }

  function renderPng() {
    var W = 900, H = 1200, cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var x = cv.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#FFFDF8'); g.addColorStop(1, '#FBF3E8');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (bgImg && bgImg.complete && bgImg.naturalWidth) {
      var s = Math.max(W / bgImg.naturalWidth, H / bgImg.naturalHeight);
      var dw = bgImg.naturalWidth * s, dh = bgImg.naturalHeight * s;
      x.drawImage(bgImg, (W - dw) / 2, (H - dh) / 2, dw, dh);
      var sg = SCRIM.type === 'linear'
        ? x.createLinearGradient(0, 0, 0, H)
        : x.createRadialGradient(W * SCRIM.cx, H * SCRIM.cy, 0, W * SCRIM.cx, H * SCRIM.cy, Math.max(W, H) * 0.68);
      SCRIM.stops.forEach(function (s) { sg.addColorStop(s[0], s[1]); });
      x.fillStyle = sg; x.fillRect(0, 0, W, H);
    }
    x.strokeStyle = 'rgba(200,154,75,.55)'; x.lineWidth = 2; x.strokeRect(28, 28, W - 56, H - 56);
    x.strokeStyle = 'rgba(200,154,75,.3)'; x.lineWidth = 1; x.strokeRect(44, 44, W - 88, H - 88);
    x.textAlign = 'center';
    x.fillStyle = '#8A6420';
    var nf = FONT_MAP[st.font] || FONT_MAP.script;
    var label = (st.name2 ? st.name + ' & ' + st.name2 : st.name);
    if (nf.caps) label = label.toUpperCase();
    x.font = nf.cv;
    var npx = parseInt((nf.cv.match(/(\d+)px/) || [0, '0'])[1], 10) || 64;
    var nguard = 0;
    while (x.measureText(label).width > W - 150 && npx > 30 && nguard < 80) {
      npx -= 2;
      x.font = nf.cv.replace(/\d+px/, npx + 'px');
      nguard++;
    }
    x.fillText(label, W / 2, 210);
    x.fillStyle = 'rgba(200,154,75,.8)';
    x.fillRect(W / 2 - 40, 240, 80, 2);
    x.fillStyle = '#5C4A4E';
    x.font = "600 18px Inter, sans-serif";
    x.fillText(A.label(st.occ).toUpperCase(), W / 2, 282);
    var lines = cardLines(), y = 360;
    var rhymeOut = st.style === 'rhyme' || !A.canAcrostic(st.name);
    if (rhymeOut) {
      var bf = FONT_MAP[st.font] || FONT_MAP.script;
      var bs = Math.round(30 * (bf.cpx || 1));
      x.fillStyle = '#3B2B2E'; x.font = bf.bstyle + ' ' + bf.bweight + ' ' + bs + 'px ' + bf.body;
      lines.forEach(function (l) { x.fillText(l.raw, W / 2, y); y += Math.round(52 * (bf.cpx || 1)); });
    } else {
      lines.forEach(function (l) {
        var txt = l.letter + ' is for ' + l.word + ', ' + l.desc + (l.suf ? ', ' + l.suf : '') + (l.who ? ' (' + l.who + ')' : '');
        var bf2 = FONT_MAP[st.font] || FONT_MAP.script;
        var bm = bf2.cpx || 1;
        x.fillStyle = '#6B1F2D'; x.font = bf2.bstyle + ' ' + bf2.bweight + ' ' + Math.round(30 * bm) + 'px ' + bf2.body;
        x.textAlign = 'left'; x.fillText(l.letter, 110, y);
        x.fillStyle = '#3B2B2E'; x.font = bf2.bstyle + ' ' + bf2.bweight + ' ' + Math.round(26 * bm) + 'px ' + bf2.body;
        x.fillText(txt.slice(l.letter.length + 1), 150, y);
        x.textAlign = 'center';
        y += Math.round(56 * (bf2.cpx || 1));
      });
    }
    if (st.from) {
      x.fillStyle = '#5C4A4E'; x.font = "italic 24px Inter, sans-serif";
      x.fillText('from ' + st.from, W / 2, H - 120);
    }
    x.fillStyle = '#C9557B'; x.font = "26px serif"; x.fillText('\u2665', W / 2, H - 78);
    return cv.toDataURL('image/png');
  }

  function download() {
    var a = document.createElement('a');
    a.download = (st.name2 ? st.name + '-' + st.name2 : st.name).toLowerCase().replace(/\s+/g, '-') + '-poem.png';
    a.href = renderPng();
    a.click();
  }

  function copy(txt, btn) {
    if (navigator.clipboard) navigator.clipboard.writeText(txt);
    if (btn) { var old = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = old; }, 1400); }
  }

  var acts = document.querySelectorAll('[data-bench="5"] button');
  acts.forEach(function (b) {
    var t = b.textContent.trim().toLowerCase();
    b.addEventListener('click', function () {
      if (t.indexOf('download') === 0) download();
      else if (t.indexOf('print') === 0) window.print();
      else if (t.indexOf('copy text') === 0) copy(poemText(), b);
      else if (t.indexOf('copy link') === 0) copy(location.href, b);
      else if (t.indexOf('whatsapp') === 0) window.open('https://wa.me/?text=' + encodeURIComponent(poemText() + '\n\n' + location.href), '_blank');
    });
  });

  /* ---------- steps + tilt ---------- */
  var HINTS = {
    1:'One name or two for a couple. The card rewrites as you type.',
    2:'Sixty occasions in the full list. Ten favorites here.',
    3:'Acrostic reads down the name. Rhyming carries it.',
    4:'Paper tone, the script for the name, or your own photograph.',
    5:'Greeting-card size, no watermark, yours to keep.'
  };
  var steps = document.querySelectorAll('.r-step'), benches = document.querySelectorAll('.bench');
  function goStep(n) {
    steps.forEach(function (b, i) {
      b.classList.toggle('is-on', i === n - 1);
      b.classList.toggle('is-done', i < n - 1);
      if (i === n - 1) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    benches.forEach(function (s) { s.classList.toggle('is-on', +s.dataset.bench === n); });
    if (hint) hint.textContent = HINTS[n];
    if (prog) prog.textContent = 'Step ' + n + ' of 5';
  }
  steps.forEach(function (b) { b.addEventListener('click', function () { goStep(+b.dataset.step); }); });
  document.querySelectorAll('[data-goto]').forEach(function (b) { b.addEventListener('click', function () { goStep(+b.dataset.goto); }); });
  var qstep = +qs.get('step');
  if (qstep >= 1 && qstep <= 5) goStep(qstep);

  var bed = document.getElementById('bed'), wrap = document.getElementById('cardWrap');
  var pose = qs.get('pose');
  var fine = matchMedia('(pointer:fine)').matches;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (pose === 'tilt') { wrap.style.setProperty('--rx', '7deg'); wrap.style.setProperty('--ry', '-10deg'); }
  if (fine && !reduced && !pose) {
    var raf, t0 = Date.now();
    (function idle() {
      var t = (Date.now() - t0) / 1000;
      wrap.style.setProperty('--rx', (Math.sin(t * .6) * 2).toFixed(2) + 'deg');
      wrap.style.setProperty('--ry', (Math.cos(t * .45) * 2.6).toFixed(2) + 'deg');
      raf = requestAnimationFrame(idle);
    })();
    bed.addEventListener('pointermove', function (e) {
      cancelAnimationFrame(raf);
      var r = bed.getBoundingClientRect();
      wrap.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 16).toFixed(2) + 'deg');
      wrap.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - .5) * 12).toFixed(2) + 'deg');
    });
    bed.addEventListener('pointerleave', function () { t0 = Date.now(); });
  }

  function fitName() {
    var card = document.getElementById('cardEl');
    if (!card || !cName) return;
    cName.style.fontSize = '';
    cName.style.whiteSpace = 'nowrap';
    var avail = card.clientWidth * 0.86;
    var base = parseFloat(getComputedStyle(cName).fontSize) || 34;
    var size = base, guard = 0;
    while (cName.scrollWidth > avail && size > base * 0.62 && guard < 60) {
      size -= 1; cName.style.fontSize = size + 'px'; guard++;
    }
    if (cName.scrollWidth > avail) cName.style.whiteSpace = 'normal';
  }

  function fitCard() {
    var bed = document.getElementById('bed');
    var card = document.getElementById('cardEl');
    var ul = document.getElementById('cPoem');
    if (!bed || !card || !ul) return;
    ul.classList.remove('fitdown');
    ul.style.removeProperty('--fitsize');
    var maxH = bed.clientHeight * 0.92;
    var size = parseFloat(getComputedStyle(ul).fontSize) || 16;
    var guard = 0;
    while (card.scrollHeight > maxH && size > 10 && guard < 60) {
      size -= 0.5;
      ul.style.setProperty('--fitsize', size + 'px');
      ul.classList.add('fitdown');
      guard++;
    }
  }
  addEventListener('resize', fitCard);

  initBackgrounds();
  initOccasions();
  var qbg = qs.get('bg');
  if (qbg && safeBg(qbg)) {
    var target = document.querySelector('.bgthumb[data-bg="' + qbg.replace(/"/g, '') + '"]');
    setBg(qbg, target);
  }
  render();
  fitCard();

  if (qs.get('selftest')) {
    var report = {};
    try {
      var lines = cardLines();
      report.lines = lines.length;
      var rhyming = st.style === 'rhyme' || !A.canAcrostic(st.name);
      report.first = rhyming ? lines[0].raw.slice(0, 28) : lines[0].letter + ':' + lines[0].word;
      report.text = poemText().length;
      var png = renderPng();
      report.png = png.slice(0, 15);
      report.pngBytes = Math.round(png.length / 1024);
      report.ok = report.lines > 0 && report.text > 20 && png.indexOf('data:image/png') === 0;
    } catch (e) {
      report.ok = false;
      report.err = e.message;
    }
    document.title = 'SELFTEST ' + JSON.stringify(report);
  }
})();

/* Printing used to output the whole studio: header on top of the card, benches,
   footer links, and the poem clipped by the viewport. Print gets its own sheet,
   cloned at print time so it carries whatever the card currently says. */
(function () {
  var root = document.getElementById('printRoot');
  var card = document.getElementById('cardEl');
  if (!root || !card) return;
  function build() {
    root.innerHTML = '';
    var sheet = document.createElement('div');
    sheet.className = 'sheet';
    var clone = card.cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('style');
    // the clone must not duplicate cName/cPoem, or a selector picks up two cards
    [].forEach.call(clone.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
    sheet.appendChild(clone);
    root.appendChild(sheet);
    document.documentElement.classList.add('printing-card');
  }
  function clear() { document.documentElement.classList.remove('printing-card'); }
  addEventListener('beforeprint', build);
  addEventListener('afterprint', clear);
  var btn = [].slice.call(document.querySelectorAll('[data-bench="5"] button'))
    .filter(function (b) { return /^print/i.test(b.textContent.trim()); })[0];
  if (btn) btn.addEventListener('click', build);
})();
