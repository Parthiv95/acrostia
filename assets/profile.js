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
    { id: 'age', label: 'Age today', href: '' },
    { id: 'lived', label: 'Days on earth', href: '' },
    { id: 'next', label: 'Next birthday', href: '' },
    { id: 'conception', label: 'Date of conception', href: '' },
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
    { id: 'lucky', label: 'Lucky colour and day', href: '../zodiac/' },
    { id: 'numbers', label: 'Lucky numbers', href: '../lucky-number/' }
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
    var today = new Date();
    var age = F.ageBreakdown(d, today);
    var lived = F.daysBetween(d, today);
    var nextIn = F.nextBirthdayIn(d, today);
    var leaps = F.leapYearsSeen(d, today);
    var conception = new Date(d.getTime() - 266 * 86400000);
    var wd = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];

    return {
      lived: { value: lived.toLocaleString(), line: 'Days on earth, counting today.', note: String(leaps) + ' leap years so far' },
      next: { value: nextIn === 0 ? 'Today' : nextIn + ' days', line: nextIn === 0 ? 'It is today. Light something.' : 'Until the next birthday.', note: 'the one to plan for' },
      conception: { value: F.fmt(conception), line: 'About nine months before, give or take.', note: 'give or take a week' },
      age: { value: age.y + (age.y === 1 ? ' year, ' : ' years, ') + age.m + (age.m === 1 ? ' month' : ' months'), line: lived.toLocaleString() + ' days on earth so far.', note: nextIn === 0 ? 'happy birthday' : 'next birthday in ' + nextIn + ' days' },
      tree: { value: tree.name, line: cap(tree.line) + '.', note: MON[tree.from[0] - 1] + ' ' + tree.from[1] + ' to ' + MON[tree.to[0] - 1] + ' ' + tree.to[1] },
      date: { value: String(dnVal), line: cap(F.BIRTH_NUMBERS[dnVal] || ''), note: dnVal === day ? 'the ' + stamp + ' of the month' : 'the ' + stamp + ' reduces to ' + dnVal },
      month: { value: MON[m], line: cap(F.MONTH_MEANINGS[m].line), note: cap(F.MONTH_MEANINGS[m].season) },
      stone: { value: F.STONES[m].stone, line: cap(F.STONES[m].line) + '.', note: 'by the modern list' },
      flower: { value: F.FLOWERS[m].flower, line: cap(F.FLOWERS[m].line) + '.', note: 'by the modern list' },
      sign: { value: sign.name, line: cap(sign.line || ''), note: sign.element + ', ruled by ' + sign.planet },
      lucky: { value: sign.color + ' · ' + sign.day, line: 'Lucky colour and day from ' + sign.name + '.', note: 'lucky number ' + sign.number },
      chinese: { value: chinese.name, line: cap(chinese.line) + '.', note: 'born ' + y },
      path: { value: String(path), line: cap(F.LIFE_PATHS[path] || ''), note: 'from every digit of the date' },
      weekday: { value: wd, line: cap(F.WEEKDAYS[wd] || ''), note: F.fmt(d) },
      golden: { value: String(golden.age), line: 'The year your age matched the date: you turned ' + golden.age + ' on your ' + stamp + '.', note: 'the one to celebrate big' },
      moon: { value: moonPhase.name || '', line: cap(moonPhase.line || ''), note: moon.illum + '% lit' },
      numbers: { value: lucky.join(' · '), line: 'Drawn from the date and the letters of the name.', note: 'for the bold' }
    };
  }

  function css() {
    if (document.getElementById('pfCss')) return;
    var s = document.createElement('style');
    s.id = 'pfCss';
    s.textContent = [
      '.pf-wrap{max-width:1180px;margin:0 auto;padding:0 clamp(16px,3vw,40px) clamp(30px,4vw,56px)}',
      '.pf-head{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin:clamp(10px,2vw,22px) 0 .4rem}',
      '.pf-head h2{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:clamp(1.5rem,2.4vw,2rem);margin:0;color:var(--ink)}',
      '.pf-date{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-deep)}',
      '.pf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:clamp(10px,1.4vw,16px);margin-top:clamp(14px,2vw,22px)}',
      '.pf-card{border:1px solid rgba(200,154,75,.32);background:rgba(255,255,255,.6);padding:1rem 1.1rem 1.1rem;position:relative;text-decoration:none;color:inherit;display:block}',
      '.pf-card:hover{border-color:rgba(200,154,75,.7);background:rgba(255,255,255,.85)}',
      '.pf-card .k{font-size:.58rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold-deep)}',
      '.pf-card .v{font-family:Fraunces,Georgia,serif;font-size:clamp(1.3rem,2vw,1.7rem);line-height:1.1;margin:.45rem 0 .4rem;color:var(--ink)}',
      '.pf-card .l{font-size:.85rem;line-height:1.55;color:rgba(36,29,18,.75)}',
      '.pf-card .n{margin-top:.5rem;font-size:.66rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(36,29,18,.5)}',
      '.pf-cta{margin-top:clamp(16px,2.4vw,26px);display:flex;gap:.8rem;flex-wrap:wrap;align-items:center}',
      '.pf-dl{appearance:none;border:1px solid rgba(200,154,75,.55);background:transparent;color:var(--gold-deep);padding:.7rem 1.3rem;border-radius:999px;font-size:.8rem;letter-spacing:.06em;cursor:pointer;font-family:inherit}',
      '.pf-dl:hover{background:rgba(200,154,75,.12)}',
      '.pf-link{color:rgba(36,29,18,.75);text-decoration:none;font-size:.86rem;border-bottom:1px solid rgba(200,154,75,.45);padding-bottom:2px}',
      '.pf-link:hover{color:var(--gold)}',
      '.pf-cardwrap{max-width:620px;margin:clamp(16px,2.4vw,26px) auto 0;text-align:center}',
      '.pf-cardwrap canvas{width:100%;height:auto;display:block;border:1px solid rgba(200,154,75,.45);box-shadow:0 18px 44px rgba(0,0,0,.15)}',
      '.pf-cardhint{font-size:.74rem;color:rgba(36,29,18,.55);margin-top:.6rem}',
      '.pf-share{margin-top:1rem;border:1.5px dashed rgba(200,154,75,.5);border-radius:14px;padding:1rem 1.1rem;text-align:left}',
      '.pf-share-note{font-size:.82rem;line-height:1.6;color:rgba(36,29,18,.78);margin:0 0 .8rem}',
      '.pf-share-row{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}',
      '.pf-share-row input{flex:1 1 240px;min-width:0;font:500 .8rem ui-monospace,Menlo,Consolas,monospace;color:#241826;background:#fff;border:1px solid rgba(200,154,75,.5);border-radius:10px;padding:.55rem .7rem}',
      '.pf-share-row .pf-dl,.pf-share-row a.pf-dl{padding:.55rem 1rem;text-decoration:none;display:inline-flex;align-items:center}'
    ].join('');
    document.head.appendChild(s);
  }


  /* ---------- the downloadable profile card ----------
     Ported from the Nov 4 Birthday Discovery build: an ivory sheet with the
     photo in a gold ring, a zodiac panel, THE BASICS, SIGNS AND NUMBERS, the
     month's stone, flower and tree and the lucky strip. Drawn onto a visible
     canvas so it can be screenshotted too. */
  function drawCard(date, name, mount) {
    var W = 1080, H = 1500;
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var x = cv.getContext('2d');
    var WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    var m = date.getMonth(), d = date.getDate(), y = date.getFullYear();
    var MON = F.MONTHS;
    var z = F.signFor(m + 1, d);
    var ch = F.chineseFor(y, m + 1, d);
    var today = new Date();
    var age = F.ageBreakdown(date, today);
    var lived = F.daysBetween(date, today);
    var next = F.nextBirthdayIn(date, today);
    var leaps = F.leapYearsSeen(date, today);
    var conception = new Date(date.getTime() - 266 * 86400000);
    var dn = F.reduceNum(d);
    var lp = F.lifePath(y, m + 1, d);
    var title = (name || 'This date') + '’s big day';

    function fitTitle(txt, size, max) {
      var s = size;
      x.font = '600 ' + s + 'px Fraunces, Georgia, serif';
      while (s > 30 && x.measureText(txt).width > max) { s -= 2; x.font = '600 ' + s + 'px Fraunces, Georgia, serif'; }
      return s;
    }
    function wrapWords(txt, font, maxW) {
      x.font = font;
      var words = txt.split(' '), lines = [], cur = '';
      words.forEach(function (w2) {
        var t = cur ? cur + ' ' + w2 : w2;
        if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w2; } else cur = t;
      });
      if (cur) lines.push(cur);
      return lines;
    }
    function section(t, yTop) {
      x.textAlign = 'left';
      x.fillStyle = '#b57718'; x.font = '600 22px Verdana, sans-serif';
      x.fillText(t, 100, yTop);
      x.strokeStyle = 'rgba(226,165,42,.55)'; x.lineWidth = 1.5;
      x.beginPath(); x.moveTo(100 + x.measureText(t).width + 20, yTop - 7); x.lineTo(W - 100, yTop - 7); x.stroke();
    }
    function cell(k, v, xx, yy, w) {
      x.textAlign = 'left';
      x.fillStyle = '#8a7a5f'; x.font = '600 20px Verdana, sans-serif';
      x.fillText(String(k).toUpperCase(), xx, yy);
      v = String(v);
      var fs = 30;
      x.font = fs + 'px Georgia, serif';
      while (fs > 19 && x.measureText(v).width > w) { fs -= 1; x.font = fs + 'px Georgia, serif'; }
      x.fillStyle = '#241d12';
      x.fillText(v, xx, yy + 38);
      x.strokeStyle = 'rgba(220,207,174,.6)'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(xx, yy + 56); x.lineTo(xx + w, yy + 56); x.stroke();
    }

    function draw(img) {
      var bg = x.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#fffdf6'); bg.addColorStop(1, '#f8efdb');
      x.fillStyle = bg; x.fillRect(0, 0, W, H);
      var g1 = x.createRadialGradient(150, 130, 20, 150, 130, 540);
      g1.addColorStop(0, 'rgba(244,200,90,.2)'); g1.addColorStop(1, 'rgba(244,200,90,0)');
      x.fillStyle = g1; x.fillRect(0, 0, W, 720);
      var g2 = x.createRadialGradient(W - 130, H - 280, 20, W - 130, H - 280, 580);
      g2.addColorStop(0, 'rgba(224,122,88,.11)'); g2.addColorStop(1, 'rgba(224,122,88,0)');
      x.fillStyle = g2; x.fillRect(0, H - 820, W, 820);
      var seed = 20261114;
      function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
      var cols = ['rgba(226,165,42,.38)', 'rgba(214,110,76,.28)', 'rgba(122,158,98,.28)', 'rgba(96,134,182,.26)', 'rgba(226,165,42,.26)'];
      for (var ci = 0; ci < 80; ci++) {
        var cx2 = 60 + rnd() * (W - 120), cy2 = 60 + rnd() * (H - 210);
        var sz = 3 + rnd() * 6;
        x.save(); x.translate(cx2, cy2); x.rotate(rnd() * Math.PI);
        x.fillStyle = cols[Math.floor(rnd() * cols.length)];
        var kind = rnd();
        if (kind < .45) x.fillRect(-sz, -sz * .4, sz * 2, sz * .8);
        else if (kind < .8) { x.beginPath(); x.arc(0, 0, sz * .6, 0, 7); x.fill(); }
        else { x.beginPath(); x.moveTo(0, -sz); x.lineTo(sz, sz); x.lineTo(-sz, sz); x.closePath(); x.fill(); }
        x.restore();
      }
      function sprig(sx, sy, rot) {
        x.save(); x.translate(sx, sy); x.rotate(rot);
        x.strokeStyle = 'rgba(196,148,52,.5)'; x.lineWidth = 3;
        x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(75, 10, 150, 60); x.stroke();
        x.fillStyle = 'rgba(196,148,52,.42)';
        [26, 54, 84, 116, 142].forEach(function (t, ti) {
          x.save(); x.translate(t, t * .13 + t * t * .0018); x.rotate(ti % 2 ? -.9 : .5);
          x.beginPath(); x.ellipse(10, 0, 15, 5.5, 0, 0, 7); x.fill(); x.restore();
        });
        x.restore();
      }
      sprig(0, 0, 0); sprig(W, 0, Math.PI / 2); sprig(W, H - 104, Math.PI); sprig(0, H - 104, -Math.PI / 2);
      x.fillStyle = '#e2a52a'; x.fillRect(0, H - 104, W, 78);

      /* header */
      x.textAlign = 'center';
      x.fillStyle = '#b57718'; x.font = '600 26px Verdana, sans-serif';
      x.fillText('B I R T H D A Y   P R O F I L E', W / 2, 122);
      x.fillStyle = '#241d12';
      x.font = '600 ' + fitTitle(title, 72, 880) + 'px Fraunces, Georgia, serif';
      x.fillText(title, W / 2, 202);
      x.fillStyle = '#8a7a5f'; x.font = 'italic 32px Georgia, serif';
      x.fillText(F.fmt(date) + '  ·  born on a ' + WD, W / 2, 252);

      /* photo left */
      var pcx = 292, pcy = 458, pr = 156;
      x.save();
      x.beginPath(); x.arc(pcx, pcy, pr, 0, 7); x.clip();
      if (img) {
        var s = Math.max(2 * pr / img.width, 2 * pr / img.height);
        x.drawImage(img, pcx - img.width * s / 2, pcy - img.height * s / 2, img.width * s, img.height * s);
      } else {
        x.fillStyle = '#f3e2bd'; x.fillRect(pcx - pr, pcy - pr, pr * 2, pr * 2);
        x.fillStyle = '#b57718'; x.font = '130px Georgia, serif';
        x.fillText('❀', pcx, pcy + 46);
      }
      x.restore();
      x.beginPath(); x.arc(pcx, pcy, pr, 0, 7);
      x.save(); x.shadowColor = 'rgba(226,165,42,.55)'; x.shadowBlur = 26;
      x.lineWidth = 9; x.strokeStyle = '#e2a52a'; x.stroke(); x.restore();
      x.beginPath(); x.arc(pcx, pcy, pr + 15, 0, 7);
      x.lineWidth = 2; x.strokeStyle = '#dccfae'; x.stroke();

      /* zodiac panel right */
      var zx = 716;
      x.textAlign = 'center';
      x.fillStyle = '#241d12'; x.font = '92px Georgia, serif';
      x.fillText(z.glyph + '︎', zx, 402);
      x.font = '600 ' + fitTitle(z.name, 56, 460) + 'px Fraunces, Georgia, serif';
      x.fillText(z.name, zx, 476);
      x.fillStyle = '#b57718'; x.font = '600 23px Verdana, sans-serif';
      x.fillText(MON[z.from[0] - 1] + ' ' + z.from[1] + ' to ' + MON[z.to[0] - 1] + ' ' + z.to[1], zx, 512);
      x.fillStyle = '#8a7a5f'; x.font = '25px Verdana, sans-serif';
      x.fillText(z.element + ' · ruled by ' + z.planet, zx, 550);
      var zl = wrapWords(z.line || '', 'italic 24px Georgia, serif', 460).slice(0, 2);
      x.font = 'italic 24px Georgia, serif';
      x.fillStyle = '#8a7a5f';
      zl.forEach(function (ln, li) { x.fillText(ln, zx, 586 + li * 30); });

      /* paper sheet behind the facts */
      x.fillStyle = 'rgba(255,253,246,.72)';
      x.strokeStyle = 'rgba(214,201,168,.6)'; x.lineWidth = 1.5;
      x.beginPath();
      if (x.roundRect) x.roundRect(72, 632, W - 144, 760, 26); else x.rect(72, 632, W - 144, 760);
      x.fill(); x.stroke();

      /* the basics */
      section('THE BASICS', 662);
      cell('Age', age.y + ' years, ' + age.m + ' months, ' + age.d + ' days', 100, 706, 420);
      cell('Born on a', WD, 560, 706, 420);
      cell('Days on earth', lived.toLocaleString() + ' and counting', 100, 798, 420);
      cell('Next birthday', next === 0 ? 'It is today!' : 'in ' + next + ' days', 560, 798, 420);
      cell('Leap years seen', leaps + (leaps === 1 ? ' leap year so far' : ' leap years so far'), 100, 890, 420);
      cell('Date of conception', 'probably ' + F.fmt(conception), 560, 890, 420);

      /* signs and numbers */
      section('SIGNS AND NUMBERS', 988);
      cell('Star sign', z.glyph + '︎ ' + z.name, 100, 1032, 420);
      cell('Chinese zodiac', (ch && ch.name) || '-', 560, 1032, 420);
      cell('Birth number', dn + ' · ' + (F.BIRTH_NUMBERS[dn] || '').split(':')[0], 100, 1124, 420);
      cell('Life path', lp + ' · ' + (F.LIFE_PATHS[lp] || ''), 560, 1124, 420);

      /* born in month */
      section('BORN IN ' + MON[m].toUpperCase(), 1222);
      cell('Birthstone', F.STONES[m].stone, 100, 1266, 262);
      cell('Birth flower', F.FLOWERS[m].flower, 393, 1266, 262);
      cell('Birth tree', F.treeFor(m + 1, d).name, 686, 1266, 294);

      /* lucky strip */
      x.fillStyle = 'rgba(226,165,42,.16)';
      x.fillRect(100, 1336, W - 200, 46);
      x.textAlign = 'center';
      var lucky = 'Lucky color ' + z.color + '  ·  Lucky day ' + z.day + '  ·  Lucky number ' + z.number;
      var lfs = 25;
      x.font = '600 ' + lfs + 'px Verdana, sans-serif';
      while (lfs > 17 && x.measureText(lucky).width > W - 240) { lfs -= 1; x.font = '600 ' + lfs + 'px Verdana, sans-serif'; }
      x.fillStyle = '#241d12';
      x.fillText(lucky, W / 2, 1367);

      /* footer */
      x.fillStyle = '#241c05'; x.font = 'italic 30px Georgia, serif';
      x.fillText('made with Acrostia', W / 2, H - 54);
      x.strokeStyle = '#e2a52a'; x.lineWidth = 5;
      x.strokeRect(26, 26, W - 52, H - 52);
      x.strokeStyle = '#dccfae'; x.lineWidth = 2;
      x.strokeRect(42, 42, W - 84, H - 84);
    }

    document.fonts.ready.then(function () {
      function go(img) { draw(img); mount(cv); }
      if (profilePhoto && profilePhoto.complete && profilePhoto.naturalWidth) { go(profilePhoto); return; }
      var fl = new Image();
      fl.onload = function () { go(fl); };
      fl.onerror = function () { go(null); };
      fl.src = '../assets/entry/flowers/' + (m + 1) + '.jpg';
    });
  }

  var profilePhoto = null;

  /* The Nov 4 export: a PNG blob named after the person, not the date. */
  function downloadCard(cv, name) {
    try {
      cv.toBlob(function (b) {
        if (!b) return;
        var a = document.createElement('a');
        a.download = ((name || 'birthday').toLowerCase().replace(/\s+/g, '-')) + '-profile.png';
        a.href = URL.createObjectURL(b);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        if (window.__goldBurst) window.__goldBurst(window.innerWidth / 2, window.innerHeight / 2);
      }, 'image/png');
    } catch (e) {
      var btn = document.querySelector('.pf-cta .pf-dl');
      if (btn) btn.textContent = 'Screenshot the card above to save it';
    }
  }

  function shareLink(date, name) {
    return location.href.split('?')[0] + '?n=' + encodeURIComponent(name || '') + '&d=' + iso(date);
  }

  function render(date) {
    css();
    var host = document.getElementById('pfOut');
    if (!host) return;
    var name = '';
    var nameEl = document.querySelector('.pf-name');
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
      '<div class="pf-cardwrap" id="pfCardWrap"></div>' +
      '<div class="pf-cta">' +
      '<button class="pf-dl" type="button">Download profile card</button>' +
      '<button class="pf-dl" type="button" data-share>Create share link</button>' +
      '<a class="pf-link" href="../studio/">or turn one of these into a poem &rarr;</a></div>' +
      '<div class="pf-share" hidden><p class="pf-share-note"><strong>Sharing is your choice.</strong> The link below carries the name and birth date you entered, so anyone who opens it sees this same profile. It contains nothing else, and nothing is sent anywhere until you copy or share it.</p>' +
      '<div class="pf-share-row"><input readonly aria-label="Share link">' +
      '<button class="pf-dl" type="button" data-copy>Copy link</button>' +
      '<a class="pf-dl" data-wa href="#" target="_blank" rel="noopener">Open on WhatsApp</a></div></div>';

    drawCard(date, name, function (cv) {
      var wrap = host.querySelector('#pfCardWrap');
      if (!wrap) return;
      wrap.appendChild(cv);
      var hint = document.createElement('p');
      hint.className = 'pf-cardhint';
      hint.textContent = 'Your card, ready to share. Add a photo above and it lands in the gold ring; with no photo, your birth flower takes the spot.';
      wrap.appendChild(hint);
    });

    var dl = host.querySelector('.pf-cta .pf-dl');
    if (dl) dl.addEventListener('click', function () { downloadCard(host.querySelector('#pfCardWrap canvas'), name); });

    var shareBtn = host.querySelector('[data-share]');
    var panel = host.querySelector('.pf-share');
    if (shareBtn && panel) shareBtn.addEventListener('click', function () {
      var open = !panel.hidden;
      panel.hidden = open;
      shareBtn.textContent = open ? 'Create share link' : 'Hide share link';
      if (!open) {
        var link = shareLink(date, name);
        var z2 = F.signFor(date.getMonth() + 1, date.getDate());
        var ch2 = F.chineseFor(date.getFullYear(), date.getMonth() + 1, date.getDate());
        var msg = (name ? name.charAt(0).toUpperCase() + name.slice(1) : 'This date') + '’s birthday profile (' + F.fmt(date) + '): ' + z2.glyph + '︎ ' + z2.name +
          ', Chinese zodiac ' + ((ch2 && ch2.name) || '-') + ', birthstone ' + F.STONES[date.getMonth()].stone +
          ', birth flower ' + F.FLOWERS[date.getMonth()].flower + ', lucky number ' + z2.number + '. See yours: ' + link;
        var inp = panel.querySelector('input');
        inp.value = link;
        panel.querySelector('[data-wa]').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
        inp.focus(); inp.select();
      }
    });

    var copyBtn = host.querySelector('[data-copy]');
    if (copyBtn && panel) copyBtn.addEventListener('click', function () {
      var inp = panel.querySelector('input');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(inp.value);
      else { inp.focus(); inp.select(); document.execCommand('copy'); }
    });
  }

  /* validDate takes numbers, not a string: passing the ISO value straight in made
     it return false and the whole ledger stayed empty */
  /* reject future dates at every entry point: typed, shared link (?d=), or saved —
     a birth date cannot be in the future, and the age maths go negative on one */
  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return null;
    var y = +m[1], mo = +m[2], da = +m[3];
    var d = F.validDate(y, mo, da) ? new Date(y, mo - 1, da, 12) : null;
    if (!d || d.getTime() > new Date().setHours(23, 59, 59, 999)) return null;
    return d;
  }

  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function boot() {
    var input = document.querySelector('.entry input[type="date"]');
    var form = document.querySelector('.entry');
    if (!input || !form) return;
    var t = new Date();
    input.max = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); /* today — the picker cannot offer a future birth date */

    var qs = new URLSearchParams(location.search);
    var q = qs.get('d');
    var qn = qs.get('n');
    if (qn) { var nin = document.querySelector('.pf-name'); if (nin) nin.value = qn; }
    var saved = q || localStorage.getItem(KEY) || '';
    var startDate = parseISO(saved);
    if (startDate) {
      input.value = saved;
      render(startDate);
    }

    var photoIn = document.querySelector('.pf-photo');
    if (photoIn) photoIn.addEventListener('change', function () {
      var f = photoIn.files && photoIn.files[0];
      if (!f) { profilePhoto = null; return; }
      if (!/^image\//.test(f.type) || f.size > 8 * 1024 * 1024) { photoIn.value = ''; return; }
      var fr = new FileReader();
      fr.onload = function () {
        profilePhoto = new Image();
        profilePhoto.onload = function () { /* redraw so the photo lands in the gold ring on screen and in the download */
          var picked = parseISO(input.value);
          if (picked) render(picked);
        };
        profilePhoto.src = fr.result;
      };
      fr.readAsDataURL(f);
    });

    var nameIn = document.querySelector('.pf-name');
    if (nameIn) nameIn.addEventListener('change', function () {
      var picked = parseISO(input.value);
      if (picked) render(picked);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input.value) return;
      var picked = parseISO(input.value);
      if (!picked) { showNote('That date is not valid, or it has not happened yet. Pick today or earlier.'); return; }
      localStorage.setItem(KEY, input.value);
      var u = new URL(location.href); u.searchParams.set('d', input.value);
      history.replaceState(null, '', u);
      render(picked);
      var out = document.getElementById('pfOut');
      if (out) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* one-line feedback under the form for invalid or future dates */
    function showNote(msg) {
      var n = document.querySelector('.entry-note');
      if (!n) {
        n = document.createElement('p');
        n.className = 'entry-note';
        n.style.cssText = 'margin:.5rem 0 0;color:#8a3324;font-size:.85rem';
        form.after(n);
      }
      n.textContent = msg;
      n.hidden = false;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
