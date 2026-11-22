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
    // keepsake reads at a glance; the script is a deliberate choice, not the default
    photo: '',
    font: (['script','keepsake','simple','hand','storybook'].indexOf(qs.get('f')) !== -1 ? qs.get('f') : 'keepsake')
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
    // taking the first word gave a one line poem for a name like "c ej cejj ...",
    // because the first word happened to be one letter long
    return letters.slice(0, POEM_MAX);
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

  function pairName() {
    return st.name2 ? st.name + ' and ' + st.name2 : st.name;
  }

  function lineHTML(l, withWho) {
    return '<b>' + esc(l.letter) + '</b> is for ' + esc(l.word) + ', ' + esc(l.desc) +
           (l.suf ? ', ' + esc(l.suf) : '') + (withWho && l.who ? ' (' + esc(l.who) + ')' : '');
  }

  /* Couples used to alternate letter by letter, so the card read N E O M A M H A
     and every line ended in "(Noah)". Group by owner instead: one labelled block
     per name, each spelling that name down its own column. */
  function pairBlocks(lines) {
    var order = [], by = {};
    lines.forEach(function (l) {
      var who = l.who || '';
      if (!by[who]) { by[who] = []; order.push(who); }
      by[who].push(l);
    });
    return order.map(function (who) { return { who: who, lines: by[who] }; });
  }

  var PAIR_OCC = ['couple', 'engagement', 'wedding', 'anniversary', 'valentine', 'silver-anniversary'];
  // each script sets the name and the poem body, the way the old build did
  // One source for the wash that keeps the poem legible over artwork. The screen
  // reads it through --card-scrim and the canvas replays the same stops, so the
  // download can no longer look unlike the preview.
  var SCRIM = { type: 'linear', stops: [[0, 'rgba(255,252,245,.38)'], [0.28, 'rgba(255,252,245,.58)'], [0.5, 'rgba(255,252,245,.66)'], [0.72, 'rgba(255,252,245,.58)'], [1, 'rgba(255,252,245,.38)']] };
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
      name2In.placeholder = isPair ? 'second name' : 'couples only';
      if (!isPair && st.name2) { st.name2 = ''; name2In.value = ''; }
    }
    var cCloser = document.getElementById('cCloser');
    var cFrom = document.getElementById('cFrom');
    var verseBtn = document.getElementById('verseBtn');
    var head = pairName();
    cName.textContent = head.length > 26 ? head.slice(0, 25).trim() + '\u2026' : head;
    cName.title = head;
    cOcc.textContent = A ? A.label(st.occ) : st.occ;
    lastLines = cardLines();
    if (cCloser) {
      var isRhyme = st.style === 'rhyme';
      cCloser.textContent = (!isRhyme && A && A.closer) ? pairName() + ', ' + A.closer(st.occ) : '';
      cPoem.classList.toggle('has-closer', !isRhyme);
      cCloser.style.display = (!isRhyme && st.voice !== 'heartfelt') || (!isRhyme) ? '' : 'none';
    }
    if (cFrom) cFrom.textContent = st.from ? 'from ' + st.from : '';
    if (verseBtn) verseBtn.style.display = st.style === 'rhyme' ? '' : 'none';
    var out = '';
    if (st.style === 'rhyme' || !A.canAcrostic(st.name)) {
      lastLines.forEach(function (l) { out += '<li class="verse">' + l.raw + '</li>'; });
    } else if (st.name2 && isPair) {
      pairBlocks(lastLines).forEach(function (g) {
        out += '<li class="pair-name">' + esc(g.who) + '</li>';
        g.lines.forEach(function (l) {
          var i = lastLines.indexOf(l);
          out += '<li><button type="button" class="line-reroll" data-i="' + i + '">' + lineHTML(l) + '</button></li>';
        });
      });
    } else {
      lastLines.forEach(function (l, i) {
        out += '<li><button type="button" class="line-reroll" data-i="' + i + '">' + lineHTML(l) + '</button></li>';
      });
    }
    cPoem.innerHTML = out;
    cPoem.classList.toggle('is-verse', st.style === 'rhyme');
    var letters = (st.name + (st.name2 || '')).replace(/[^A-Za-z]/g, '').length;
    var wide = letters > 12 || lastLines.length > 12;
    var wrap = document.getElementById('cardWrap');
    if (wrap) wrap.classList.toggle('is-wide', wide);
    document.getElementById('cardEl').classList.toggle('is-wide', wide);
    cPoem.classList.toggle('two-col', st.style !== 'rhyme' && lastLines.length > 8);
    cPoem.classList.toggle('three-col', wide && st.style !== 'rhyme' && lastLines.length > 14);
    var nonLatin = !A.canAcrostic(st.name);
    bedCap.textContent = 'Live card · ' + A.label(st.occ) + ' · ' +
      (nonLatin ? 'rhyming verse, no Latin letters' : st.voice + ' voice') + bgNote();
    if (document.activeElement !== nameIn) nameIn.value = st.name;
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
  }

  /* the caption used to say "your paper" for a stock template, as if the visitor
     had uploaded it; name what is actually on the card */
  function bgNote() {
    if (!st.bg) return '';
    var on = document.querySelector('.bgthumb.is-on[data-bg]');
    if (!on || !on.title) return /^photo-/i.test(st.bg) ? ' · photo background' : ' · your photo';
    return ' · ' + on.title.toLowerCase() + ' template';
  }

  /* ---------- card backgrounds ---------- */
  var bgImg = null;
  var photoImg = null;

  /* ---------- portrait ---------- */
  function applyPhoto() {
    var wrap = document.getElementById('cPhotoWrap');
    var img = document.getElementById('cPhoto');
    var clear = document.getElementById('photoClear');
    if (!wrap || !img) return;
    if (st.photo) {
      img.src = st.photo;
      wrap.classList.add('has');
      if (clear) clear.hidden = false;
      if (!photoImg || photoImg.src !== st.photo) { photoImg = new Image(); photoImg.src = st.photo; }
    } else {
      wrap.classList.remove('has');
      img.removeAttribute('src');
      if (clear) clear.hidden = true;
      photoImg = null;
    }
  }

  var photoIn = document.getElementById('photoIn');
  if (photoIn) photoIn.addEventListener('change', function () {
    var f = photoIn.files && photoIn.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type) || f.size > 8 * 1024 * 1024) { photoIn.value = ''; return; }
    var fr = new FileReader();
    fr.onload = function () { st.photo = fr.result; applyPhoto(); fitCard(); };
    fr.readAsDataURL(f);
    photoIn.value = '';
  });
  var photoClear = document.getElementById('photoClear');
  if (photoClear) photoClear.addEventListener('click', function () { st.photo = ''; applyPhoto(); fitCard(); });

  function applyBg() {
    var card = document.getElementById('cardEl');
    if (!card) return;
    if (!st.bg) {
      card.classList.remove('has-bg');
      card.style.backgroundImage = '';
      return;
    }
    card.classList.add('has-bg');
    card.style.backgroundImage = 'url("' + bgSrc(st.bg) + '")';
  }

  var ALLOWED_BG = /^(\.\.\/assets\/(?:floral|templates)\/[a-z0-9-]+\.jpg|photo-[0-9a-z-]+|data:image\/(png|jpe?g|webp);base64,)/i;
  /* /backgrounds/ links carry an Unsplash id rather than a path. Resolving it here
     keeps the shared URL short and gives the canvas a CORS-clean image. */
  function bgSrc(v) {
    if (!v) return '';
    if (/^photo-[0-9a-z-]+$/i.test(v)) {
      return 'https://images.unsplash.com/' + v + '?auto=format&fit=crop&q=80&w=900&h=1200';
    }
    return v;
  }
  function safeBg(src) { return src && ALLOWED_BG.test(src) ? src : null; }

  function setBg(src, btn) {
    src = safeBg(src);
    st.bg = src || null;
    bgImg = null;
    if (src) {
      bgImg = new Image();
      if (/^https?:/i.test(bgSrc(src))) bgImg.crossOrigin = 'anonymous';
      bgImg.src = bgSrc(src);
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
    var v = live.trim();
    // an empty field is allowed to stay empty: forcing the last name back made it
    // impossible to clear the box, you could only type over the old name
    if (!v) return;
    st.name = v;
    render(); syncUrl();
  });
  nameIn.addEventListener('blur', function () {
    nameIn.value = cleanName(nameIn.value);
    if (!nameIn.value) return;
    st.name = nameIn.value;
    render(); syncUrl();
  });
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
    var wide = !!(document.getElementById('cardEl') || {}).classList &&
               document.getElementById('cardEl').classList.contains('is-wide');
    var W = wide ? 1200 : 900, H = wide ? 900 : 1200, cv = document.createElement('canvas');
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
    var label = pairName();
    if (nf.caps) label = label.toUpperCase();
    x.font = nf.cv;
    var npx = parseInt((nf.cv.match(/(\d+)px/) || [0, '0'])[1], 10) || 64;
    var nguard = 0;
    while (x.measureText(label).width > W - 150 && npx > 30 && nguard < 80) {
      npx -= 2;
      x.font = nf.cv.replace(/\d+px/, npx + 'px');
      nguard++;
    }
    var shift = 0;
    if (st.photo && photoImg && photoImg.complete && photoImg.naturalWidth) {
      var pr = wide ? 62 : 86, pcx = W / 2, pcy = wide ? 92 : 104;
      x.save(); x.beginPath(); x.arc(pcx, pcy, pr, 0, Math.PI * 2); x.closePath(); x.clip();
      var ps = Math.max((pr * 2) / photoImg.naturalWidth, (pr * 2) / photoImg.naturalHeight);
      var pw = photoImg.naturalWidth * ps, ph = photoImg.naturalHeight * ps;
      x.drawImage(photoImg, pcx - pw / 2, pcy - ph / 2, pw, ph);
      x.restore();
      x.beginPath(); x.arc(pcx, pcy, pr, 0, Math.PI * 2);
      x.strokeStyle = 'rgba(200,154,75,.55)'; x.lineWidth = 2; x.stroke();
      shift = (pcy + pr) - 34;
    }
    x.fillText(label, W / 2, (wide ? 150 : 210) + shift);
    x.fillStyle = 'rgba(200,154,75,.8)';
    x.fillRect(W / 2 - 40, (wide ? 180 : 240) + shift, 80, 2);
    x.fillStyle = '#5C4A4E';
    x.font = "600 18px Inter, sans-serif";
    x.fillText(A.label(st.occ).toUpperCase(), W / 2, (wide ? 222 : 282) + shift);
    var lines = cardLines(), y = (wide ? 300 : 360) + shift;
    var rhymeOut = st.style === 'rhyme' || !A.canAcrostic(st.name);
    if (rhymeOut) {
      var bf = FONT_MAP[st.font] || FONT_MAP.script;
      var bs = Math.round(30 * (bf.cpx || 1));
      x.fillStyle = '#3B2B2E'; x.font = bf.bstyle + ' ' + bf.bweight + ' ' + bs + 'px ' + bf.body;
      lines.forEach(function (l) { x.fillText(l.raw, W / 2, y); y += Math.round(52 * (bf.cpx || 1)); });
    } else {
      var bf2 = FONT_MAP[st.font] || FONT_MAP.script;
      var bm = bf2.cpx || 1;
      var colW = wide ? Math.floor((W - 170) / 2) : W;

      function wrapText(text, maxW, font) {
        x.font = font;
        var words = String(text).split(' '), out = [], cur = '';
        words.forEach(function (w) {
          var t = cur ? cur + ' ' + w : w;
          if (x.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else { cur = t; }
        });
        if (cur) out.push(cur);
        return out;
      }

      // the poem is measured before it is drawn: canvas does not wrap, so a long
      // line used to run straight out of the card
      function layout(items, tsize, maxW) {
        var font = bf2.bstyle + ' ' + bf2.bweight + ' ' + tsize + 'px ' + bf2.body;
        var lh = Math.round(tsize * 1.62), gap = Math.round(tsize * 0.5), h = 0;
        var wrapped = items.map(function (l) {
          var body = 'is for ' + l.word + ', ' + l.desc + (l.suf ? ', ' + l.suf : '');
          var parts = wrapText(body, maxW, font);
          h += (parts.length - 1) * lh + lh + gap;
          return { l: l, parts: parts };
        });
        return { wrapped: wrapped, lh: lh, gap: gap, height: h };
      }

      var perCol = wide ? Math.ceil(lines.length / 2) : lines.length;
      var cols = wide ? [lines.slice(0, perCol), lines.slice(perCol)] : [lines];
      var room = Math.max(120, (H - (wide ? 150 : 140)) - y);
      var tsize = Math.round((wide ? 23 : 26) * bm);
      var plan, guard = 0;
      do {
        plan = cols.map(function (set) { return layout(set, tsize, (wide ? colW : W) - 160); });
        var tallest = Math.max.apply(null, plan.map(function (p2) { return p2.height; }));
        if (tallest <= room || tsize <= 13) break;
        tsize -= 1; guard++;
      } while (guard < 20);

      function drawColumn(p2, x0, y0) {
        var yy = y0;
        p2.wrapped.forEach(function (item) {
          x.textAlign = 'left';
          x.fillStyle = '#6B1F2D';
          x.font = bf2.bstyle + ' ' + bf2.bweight + ' ' + Math.round(tsize * 1.15) + 'px ' + bf2.body;
          x.fillText(item.l.letter, x0, yy);
          x.fillStyle = '#3B2B2E';
          x.font = bf2.bstyle + ' ' + bf2.bweight + ' ' + tsize + 'px ' + bf2.body;
          item.parts.forEach(function (part, i) { x.fillText(part, x0 + 40, yy + i * p2.lh); });
          yy += (item.parts.length - 1) * p2.lh + p2.lh + p2.gap;
        });
        return yy;
      }

      // couples get the same labelled blocks as the card, or the download would
      // show a different poem from the one on screen
      if (st.name2 && PAIR_OCC.indexOf(st.occ) !== -1) {
        pairBlocks(lines).forEach(function (g) {
          x.textAlign = 'left';
          x.fillStyle = '#8A6420'; x.font = '600 17px Inter, sans-serif';
          x.fillText(g.who.toUpperCase(), 110, y);
          x.fillStyle = 'rgba(200,154,75,.75)'; x.fillRect(110, y + 10, 34, 2);
          var single = layout(g.lines, tsize, W - 200);
          y = drawColumn(single, 110, y + 42) + 14;
        });
        x.textAlign = 'center';
      } else {
        var ys = [];
        plan.forEach(function (p2, i) { ys.push(drawColumn(p2, wide ? (95 + i * colW) : 110, y)); });
        y = Math.max.apply(null, ys);
        x.textAlign = 'center';
      }
      x.textAlign = 'center';
    }
    // the card shows a closing line; the file never did
    var isRhymeOut = st.style === 'rhyme' || !A.canAcrostic(st.name);
    if (!isRhymeOut && A.closer) {
      var cf = FONT_MAP[st.font] || FONT_MAP.script;
      x.fillStyle = '#6B1F2D';
      x.font = cf.bstyle + ' ' + cf.bweight + ' ' + (wide ? 26 : 28) + 'px ' + cf.body;
      x.fillText(pairName() + ', ' + A.closer(st.occ), W / 2, H - (wide ? 116 : 150));
    }
    if (st.from) {
      x.fillStyle = '#5C4A4E'; x.font = 'italic 22px Inter, sans-serif';
      x.fillText('from ' + st.from, W / 2, H - (wide ? 74 : 108));
    }
    x.fillStyle = '#C9557B'; x.font = '26px serif'; x.fillText('\u2665', W / 2, H - (wide ? 34 : 68));
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
    // the name used to clip the moment it was longer than the card
    var nm = document.getElementById('cName');
    if (nm) {
      nm.style.removeProperty('font-size');
      nm.style.whiteSpace = 'nowrap';
      var base = parseFloat(getComputedStyle(nm).fontSize) || 40;
      var room = card.clientWidth - 32;
      var size2 = base, g2 = 0;
      while (nm.scrollWidth > room && size2 > base * 0.42 && g2 < 90) { size2 -= 1; nm.style.fontSize = size2 + 'px'; g2++; }
      if (nm.scrollWidth > room) nm.style.whiteSpace = 'normal';
    }
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
  function build() {
    // resolve both at print time: this script runs before the container exists in
    // the document, and a card reference captured at load can go stale
    var root = document.getElementById('printRoot');
    var live = document.getElementById('cardEl');
    if (!root || !live) return;
    root.innerHTML = '';
    var sheet = document.createElement('div');
    sheet.className = 'sheet' + (live.classList.contains('is-wide') ? ' is-wide' : '');
    var clone = live.cloneNode(true);
    clone.removeAttribute('id');
    // the template lives in an inline background, so keep it; only the 3D tilt and
    // sizing have to go, or print would come out as plain ivory paper
    var art = live.style.backgroundImage || (live.className.indexOf('has-bg') !== -1 ? getComputedStyle(live).backgroundImage : '');
    clone.removeAttribute('style');
    if (art) {
      clone.style.backgroundImage = art;
      clone.style.backgroundSize = 'cover';
      clone.style.backgroundPosition = 'center';
      clone.style.backgroundRepeat = 'no-repeat';
    }
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
