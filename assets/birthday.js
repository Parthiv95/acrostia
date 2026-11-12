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
