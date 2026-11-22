/* Acrostia birthday readings: turns a real date into the entry on the page.
   Requires fun-data.js (window.FUN). Reads ?d=YYYY-MM-DD, else the last date
   used on this device. Renders into #eNo / #eStone / #eRange / #eBody. */
(function () {
  var F = window.FUN;
  if (!F) return;

  var KEY = 'acrostia-birth-date';
  var MON = F.MONTHS;

  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function parse(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    if (isNaN(d) || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[3]) return null;
    return d;
  }
  function stored() { try { return parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function save(d) { try { localStorage.setItem(KEY, iso(d)); } catch (e) {} }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }

  var qd = new URLSearchParams(location.search).get('d');
  var date = parse(qd) || stored();

  function entry(kind, d) {
    var m = d.getMonth();
    switch (kind) {
      case 'birth-tree': {
        var t = F.treeFor(m + 1, d.getDate());
        return { no: 'Entry · tree window', stone: t.name,
                 range: MON[t.from[0] - 1] + ' ' + t.from[1] + ' to ' + MON[t.to[0] - 1] + ' ' + t.to[1],
                 body: cap(t.line) + '.' };
      }
      case 'zodiac': {
        var z = F.signFor(m + 1, d.getDate());
        return { no: 'Entry · sign', stone: z.name,
                 range: z.element + ' element, ruled by ' + z.planet,
                 body: z.line };
      }
      case 'birthstone': {
        var s = F.STONES[m];
        return { no: 'Entry · stone', stone: s.stone, range: MON[m] + ', by the modern list',
                 body: cap(s.line) + '.' };
      }
      case 'birth-flower': {
        var f = F.FLOWERS[m];
        return { no: 'Entry · flower', stone: f.flower, range: MON[m] + ', by the modern list',
                 body: cap(f.line) + '.' };
      }
      case 'birth-month': {
        var mm = F.MONTH_MEANINGS[m];
        return { no: 'Entry · month', stone: MON[m], range: cap(mm.season),
                 body: cap(mm.line).replace(/\.$/, '') + '.' };
      }
      case 'birth-date': {
        var n = String(d.getDate());
        var bn = F.BIRTH_NUMBERS[n] || F.BIRTH_NUMBERS[F.reduceNum ? F.reduceNum(n) : n];
        var parts = String(bn || '').split(':');
        return { no: 'Entry · day ' + n, stone: cap(parts[0] || n),
                 range: 'the ' + F.ordinal(+n) + ' day of ' + MON[m],
                 body: parts[1] ? cap(parts[1].trim()) + '.' : '' };
      }
      case 'lucky-number': {
        var ln = F.luckyNumbers(m + 1, d.getDate());
        var num = Array.isArray(ln) ? ln[0] : ln;
        return { no: 'Entry · number', stone: String(num),
                 range: 'from ' + F.fmt(d),
                 body: 'Read from the whole date, this is the number that keeps turning up for you: in seat numbers, queues and the dates you notice.' };
      }
      case 'moon-phase': {
        var ph = F.moonPhase(d);
        var mp = F.MOON_PHASES[ph.idx];
        return { no: 'Entry · phase', stone: mp.name,
                 range: ph.illum + '% lit on ' + F.fmt(d),
                 body: cap(mp.line) };
      }
      case 'planet-age': {
        var ab = F.ageBreakdown(d, new Date());
        var years = ab.y + (ab.m ? ab.m / 12 : 0);
        var out = F.PLANETS.slice(0, 4).map(function (p) {
          return p.name + ': ' + Math.floor((years * 365.25) / p.days) + ' years';
        }).join(' · ');
        return { no: 'Entry · planets', stone: years.toFixed(1), range: 'Earth years lived',
                 body: out + '. Mercury flatters, Neptune does the opposite.' };
      }
      case 'life-path': {
        var lp = F.lifePath(d.getFullYear(), d.getMonth() + 1, d.getDate());
        return { no: 'Entry · path', stone: String(lp),
                 range: 'summed from ' + F.fmt(d),
                 body: cap(F.LIFE_PATHS[lp] || '') + '.' };
      }
      case 'chinese-zodiac': {
        var ch = F.chineseFor(d.getFullYear(), m + 1, d.getDate());
        return { no: 'Entry · animal', stone: ch.name,
                 range: 'the year beginning at Lunar New Year, ' + d.getFullYear(),
                 body: cap(ch.line) + '.' };
      }
      case 'golden-birthday': {
        var g = F.goldenBirthday(d);
        var passed = new Date(g.date) < new Date();
        return { no: 'Entry · golden', stone: g.age + F.ordinal(g.age) + ' birthday',
                 range: 'when age equals day of the month',
                 body: 'Your golden birthday falls on ' + F.fmt(new Date(g.date)) +
                       (passed ? ', already behind you. Most people miss it entirely.' : ', still ahead of you.') };
      }
      default: return null;
    }
  }


  /* ---------- entry artwork ----------
     One gold emblem per reading type, sitting in the empty half of the entry card.
     Per-item artwork would mean over a hundred images; a type emblem keeps the
     card balanced without pretending to show a particular stone or flower. */
  var ART = {
    'birthstone': '<path d="M60 26 L96 58 L60 134 L24 58 Z"/><path d="M24 58 L96 58"/><path d="M60 26 L60 134"/><path d="M42 58 L60 26 L78 58 L60 134"/>',
    'birth-flower': '<circle cx="60" cy="58" r="13"/><ellipse cx="60" cy="34" rx="9" ry="15"/><ellipse cx="60" cy="82" rx="9" ry="15"/><ellipse cx="36" cy="58" rx="15" ry="9"/><ellipse cx="84" cy="58" rx="15" ry="9"/><path d="M60 96 C60 118 60 126 60 140"/><path d="M60 112 C48 104 40 108 36 116"/><path d="M60 124 C72 116 80 120 84 128"/>',
    'birth-month': '<circle cx="60" cy="70" r="34"/><path d="M88 52 A34 34 0 1 0 88 92 A28 28 0 1 1 88 52"/><circle cx="60" cy="18" r="2.4"/><circle cx="104" cy="70" r="2.4"/><circle cx="60" cy="122" r="2.4"/><circle cx="16" cy="70" r="2.4"/>',
    'birth-tree': '<path d="M60 138 L60 76"/><path d="M60 96 C44 92 34 80 34 66"/><path d="M60 88 C76 84 86 72 86 58"/><path d="M60 76 C52 62 54 48 60 36"/><path d="M34 66 C30 56 34 46 42 42"/><path d="M86 58 C90 48 86 38 78 34"/>',
    'zodiac': '<circle cx="34" cy="44" r="3"/><circle cx="66" cy="30" r="3"/><circle cx="92" cy="60" r="3"/><circle cx="70" cy="94" r="3"/><circle cx="36" cy="112" r="3"/><circle cx="58" cy="70" r="3"/><path d="M34 44 L58 70 L66 30 M58 70 L92 60 M58 70 L70 94 M58 70 L36 112"/>',
    'birth-date': '<circle cx="60" cy="70" r="36"/><path d="M60 44 L60 70 L78 82"/>',
    'birth-time': '<circle cx="60" cy="70" r="34"/><path d="M60 40 L60 70 L84 58"/>',
    'life-path': '<path d="M60 130 C20 110 100 92 60 70 C20 48 100 30 60 14"/>'
  };
  function mountArt(kind, month, signIndex) {
    if (!kind) return;
    var card = document.querySelector('.entrycard'); if (!card) return;
    var host = card.querySelector('.ecard-art');
    if (!host) {
      host = document.createElement('div');
      host.className = 'ecard-art';
      host.setAttribute('aria-hidden', 'true');
      card.appendChild(host);
    }
    if (!document.getElementById('ecardArtCss')) {
      var s = document.createElement('style'); s.id = 'ecardArtCss';
      s.textContent = '.ecard-art{position:absolute;right:clamp(4px,1.4vw,20px);top:50%;transform:translateY(-50%);width:min(38%,260px);pointer-events:none;z-index:0}' +
        '.ecard-art img{width:100%;height:auto;display:block;opacity:.95;mix-blend-mode:screen;' +
        '-webkit-mask-image:radial-gradient(ellipse at 50% 50%, #000 52%, transparent 76%);' +
        'mask-image:radial-gradient(ellipse at 50% 50%, #000 52%, transparent 76%)}' +
        '.ecard-art svg{width:100%;height:auto;fill:none;stroke:#C89A4B;stroke-width:1.6;opacity:.45;stroke-linecap:round;stroke-linejoin:round}' +
        '.entrycard>*:not(.ecard-art){position:relative;z-index:1}' +
        '@media (max-width:700px){.ecard-art{display:none}}';
      document.head.appendChild(s);
    }
    var typePlate = {
      'birthstone': 'stone', 'birth-tree': 'tree', 'zodiac': 'zodiac',
      'birth-month': 'moon', 'birth-date': 'moon', 'birth-time': 'moon', 'life-path': 'moon'
    }[kind];
    var src = '';
    if (kind === 'birth-flower' && month >= 0) src = '../assets/entry/flowers/' + (month + 1) + '.jpg';
    else if (kind === 'zodiac' && signIndex >= 0) src = '../assets/entry/zodiac/' + (signIndex + 1) + '.jpg';
    else if (kind === 'birthstone' && month >= 0) src = '../assets/entry/stones/' + (month + 1) + '.jpg';
    else if (typePlate) src = '../assets/entry/' + typePlate + '.jpg';

    if (src) {
      host.innerHTML = '<img src="' + src + '" alt="">';
      var img = host.firstChild;
      var fellBack = false;
      img.onerror = function () {
        if (!fellBack && typePlate) { fellBack = true; img.src = '../assets/entry/' + typePlate + '.jpg'; return; }
        host.innerHTML = svgFor(kind);
      };
    } else {
      host.innerHTML = svgFor(kind);
    }
  }

  function svgFor(kind) {
    var body = ART[kind] || '<path d="M30 120 C60 90 60 50 90 20"/><circle cx="90" cy="20" r="3"/><circle cx="30" cy="120" r="3"/>';
    return '<svg viewBox="0 0 120 160" role="presentation">' + body + '</svg>';
  }

  function render(d) {
    var kind = document.body.getAttribute('data-reading');
    if (!kind || !d) return;
    var e = entry(kind, d);
    if (!e) return;
    var set = function (id, v) { var el = document.getElementById(id); if (el && v) el.textContent = v; };
    set('eNo', e.no);
    set('eStone', e.stone);
    set('eRange', e.range);
    set('eBody', e.body);
    var signIndex = -1;
    if (kind === 'zodiac' && F && F.ZODIAC) {
      var zz = F.signFor(d.getMonth() + 1, d.getDate());
      for (var zi = 0; zi < F.ZODIAC.length; zi++) { if (F.ZODIAC[zi].name === zz.name) { signIndex = zi; break; } }
    }
    mountArt(kind, d.getMonth(), signIndex);
  }

  /* a date field in the hero, so the reading is changeable without leaving */
  function mountForm(d) {
    var hero = document.querySelector('.hero') || document.querySelector('.ledger .wrap') || document.querySelector('main .wrap');
    if (!hero || document.getElementById('bdDate')) return;
    var wrap = document.createElement('form');
    wrap.className = 'bd-date';
    wrap.setAttribute('novalidate', '');
    wrap.innerHTML = '<label for="bdDate">Your date of birth</label>' +
      '<input id="bdDate" type="date" name="d" value="' + (d ? iso(d) : '') + '" max="' +
      new Date().toISOString().slice(0, 10) + '">' +
      '<button type="submit">Read it</button>' +
      '<p class="bd-note"></p>';
    var css = document.createElement('style');
    css.textContent = '.bd-date{margin-top:1.4rem;display:flex;flex-wrap:wrap;gap:.5rem;align-items:end}' +
      '.bd-date label{width:100%;font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:#6E5A5E}' +
      '.bd-date input{border:1px solid rgba(200,154,75,.55);background:rgba(255,253,248,.9);color:#2C2024;' +
      'border-radius:999px;padding:.6rem 1rem;font:inherit;font-size:.9rem}' +
      '.bd-date button{border:0;border-radius:999px;background:#6B1F2D;color:#FFF6F0;padding:.65rem 1.2rem;' +
      'font:600 .78rem/1 Inter,sans-serif;cursor:pointer}' +
      '.bd-date button:hover{background:#84293A}' +
      '.bd-note{margin:.5rem 0 0;font-size:.72rem;color:#6E5A5E}';
    var lede = hero.querySelector('.lede');
    hero.appendChild(css);
    if (lede && lede.parentNode) lede.parentNode.insertBefore(wrap, lede.nextSibling);
    else hero.appendChild(wrap);
    var input = wrap.querySelector('#bdDate');
    var note = wrap.querySelector('.bd-note');
    wrap.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dd = parse(input.value);
      if (!dd) { note.textContent = 'Pick a real date first.'; return; }
      save(dd);
      date = dd;
      render(dd);
      var u = new URL(location.href);
      u.searchParams.set('d', iso(dd));
      history.replaceState(null, '', u);
      if (note) note.textContent = 'Showing ' + F.fmt(dd);
    });
    if (d && note) note.textContent = 'Showing ' + F.fmt(d);
  }

  render(date);
  mountForm(date);

  window.Birthday = { date: date, iso: iso, save: save, render: render };
})();
