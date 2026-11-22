/* Acrostia birthday profile: one date in, the whole ledger out.
 *
 * The page has carried the promise ("thirteen readings of one date") since the
 * redesign, with a date field wired to nothing. This fills it: every reading the
 * site already computes, on one page, each linking to its own fuller page.
 */
(function () {
  var F = window.FUN;
  if (!F) return;

  var KEY = 'acrostia-birth-date';
  var MON = F.MONTHS;

  var CARDS = [
    { id: 'tree', label: 'Birth tree', href: '../birth-tree/' },
    { id: 'date', label: 'Birth date', href: '../birth-date/' },
    { id: 'month', label: 'Birth month', href: '../birth-month/' },
    { id: 'stone', label: 'Birthstone', href: '../birthstone/' },
    { id: 'flower', label: 'Birth flower', href: '../birth-flower/' },
    { id: 'sign', label: 'Zodiac', href: '../zodiac/' },
    { id: 'chinese', label: 'Chinese year', href: '../chinese-zodiac/' },
    { id: 'path', label: 'Life path', href: '../life-path/' },
    { id: 'weekday', label: 'The day you arrived', href: '' },
    { id: 'golden', label: 'Golden birthday', href: '../golden-birthday/' },
    { id: 'moon', label: 'Moon that night', href: '../moon-phase/' },
    { id: 'lucky', label: 'Lucky numbers', href: '../lucky-number/' }
  ];

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  function readings(d, name) {
    var y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
    var tree = F.treeFor(m + 1, day);
    var sign = F.signFor(m + 1, day);
    var chinese = F.chineseFor(y, m + 1, day);
    var path = F.lifePath(y, m + 1, day);
    var golden = F.goldenBirthday(d);
    var moon = F.moonPhase(d);
    var moonPhase = F.MOON_PHASES[moon.idx] || {};
    var lucky = F.luckyNumbers(m + 1, day, name || '');
    var dn = F.reduceNum(String(day));
    var dnVal = F.BIRTH_NUMBERS[dn] ? dn : day;
    var stamp = day + F.ordinal(day);
    var wd = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];

    return {
      tree: { value: tree.name, line: cap(tree.line) + '.', note: MON[tree.from[0] - 1] + ' ' + tree.from[1] + ' to ' + MON[tree.to[0] - 1] + ' ' + tree.to[1] },
      date: { value: String(dnVal), line: cap(F.BIRTH_NUMBERS[dnVal] || ''), note: dnVal === day ? 'the ' + stamp + ' of the month' : 'the ' + stamp + ' reduces to ' + dnVal },
      month: { value: MON[m], line: cap(F.MONTH_MEANINGS[m].line), note: cap(F.MONTH_MEANINGS[m].season) },
      stone: { value: F.STONES[m].stone, line: cap(F.STONES[m].line) + '.', note: 'by the modern list' },
      flower: { value: F.FLOWERS[m].flower, line: cap(F.FLOWERS[m].line) + '.', note: 'by the modern list' },
      sign: { value: sign.name, line: cap(sign.line || ''), note: sign.element + ', ruled by ' + sign.planet },
      chinese: { value: chinese.name, line: cap(chinese.line) + '.', note: 'born ' + y },
      path: { value: String(path), line: cap(F.LIFE_PATHS[path] || ''), note: 'from every digit of the date' },
      weekday: { value: wd, line: cap(F.WEEKDAYS[wd] || ''), note: F.fmt(d) },
      golden: { value: String(golden.age), line: 'The year your age matched the date: you turned ' + golden.age + ' on your ' + stamp + '.', note: 'the one to celebrate big' },
      moon: { value: moonPhase.name || '', line: cap(moonPhase.line || ''), note: moon.illum + '% lit' },
      lucky: { value: lucky.join(' · '), line: 'Drawn from the date and the letters of the name.', note: 'for the bold' }
    };
  }

  function css() {
    if (document.getElementById('pfCss')) return;
    var s = document.createElement('style');
    s.id = 'pfCss';
    s.textContent = [
      '.pf-wrap{max-width:1180px;margin:0 auto;padding:0 clamp(16px,3vw,40px) clamp(30px,4vw,56px)}',
      '.pf-head{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin:clamp(10px,2vw,22px) 0 .4rem}',
      '.pf-head h2{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:clamp(1.5rem,2.4vw,2rem);margin:0;color:var(--ivory-lt)}',
      '.pf-date{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}',
      '.pf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:clamp(10px,1.4vw,16px);margin-top:clamp(14px,2vw,22px)}',
      '.pf-card{border:1px solid rgba(200,154,75,.32);background:rgba(246,233,228,.045);padding:1rem 1.1rem 1.1rem;position:relative;text-decoration:none;color:inherit;display:block}',
      '.pf-card:hover{border-color:rgba(200,154,75,.7);background:rgba(246,233,228,.07)}',
      '.pf-card .k{font-size:.58rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}',
      '.pf-card .v{font-family:Fraunces,Georgia,serif;font-size:clamp(1.3rem,2vw,1.7rem);line-height:1.1;margin:.45rem 0 .4rem;color:var(--ivory-lt)}',
      '.pf-card .l{font-size:.85rem;line-height:1.55;color:rgba(246,233,228,.72)}',
      '.pf-card .n{margin-top:.5rem;font-size:.66rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(246,233,228,.45)}',
      '.pf-cta{margin-top:clamp(16px,2.4vw,26px);display:flex;gap:.8rem;flex-wrap:wrap;align-items:center}'
    ].join('');
    document.head.appendChild(s);
  }

  function render(date) {
    css();
    var host = document.getElementById('pfOut');
    if (!host) return;
    var name = '';
    var nameEl = document.querySelector('input[name="name"], #pfName');
    if (nameEl) name = nameEl.value;
    var r = readings(date, name);
    var cards = CARDS.map(function (c) {
      var item = r[c.id];
      if (!item) return '';
      var tag = c.href ? 'a href="' + c.href + '"' : 'div';
      var close = c.href ? 'a' : 'div';
      return '<' + tag + ' class="pf-card"><span class="k">' + c.label + '</span>' +
        '<div class="v">' + item.value + '</div>' +
        '<div class="l">' + (item.line || '') + '</div>' +
        (item.note ? '<div class="n">' + item.note + '</div>' : '') +
        '</' + close + '>';
    }).join('');

    host.innerHTML = '<div class="pf-head"><h2>Your ledger</h2><span class="pf-date">' + F.fmt(date) + '</span></div>' +
      '<div class="pf-grid">' + cards + '</div>' +
      '<div class="pf-cta"><a class="pill" href="../studio/">Turn one of these into a poem</a></div>';
  }

  /* validDate takes numbers, not a string: passing the ISO value straight in made
     it return false and the whole ledger stayed empty */
  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return null;
    var y = +m[1], mo = +m[2], da = +m[3];
    return F.validDate(y, mo, da) ? new Date(y, mo - 1, da, 12) : null;
  }

  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function boot() {
    var input = document.querySelector('.entry input[type="date"]');
    var form = document.querySelector('.entry');
    if (!input || !form) return;

    var q = new URLSearchParams(location.search).get('d');
    var saved = q || localStorage.getItem(KEY) || '';
    var startDate = parseISO(saved);
    if (startDate) {
      input.value = saved;
      render(startDate);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input.value) return;
      localStorage.setItem(KEY, input.value);
      var u = new URL(location.href); u.searchParams.set('d', input.value);
      history.replaceState(null, '', u);
      var picked = parseISO(input.value);
      if (picked) render(picked);
      var out = document.getElementById('pfOut');
      if (out) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
