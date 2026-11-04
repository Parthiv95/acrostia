/* Shared data for Acrostia birthday tools (zodiac, birthstone, flower, tree, luck).
   Loaded by birthday-profile/, zodiac/, birthstone/, birth-flower/, lucky-number/. */
window.FUN = (function () {
  var ZODIAC = [
    { name: "Aries", glyph: "\u2648", from: [3, 21], to: [4, 19], element: "Fire", planet: "Mars", color: "Red", day: "Tuesday", number: 9,
      line: "First out of the gate. Aries energy starts things, says the honest thing, and makes the rest of us brave." },
    { name: "Taurus", glyph: "\u2649", from: [4, 20], to: [5, 20], element: "Earth", planet: "Venus", color: "Green", day: "Friday", number: 6,
      line: "The steady one. Taurus builds things that last, feeds everyone, and does not scare easily." },
    { name: "Gemini", glyph: "\u264A", from: [5, 21], to: [6, 20], element: "Air", planet: "Mercury", color: "Yellow", day: "Wednesday", number: 5,
      line: "Two minds, quick as a spark. Gemini talks to anyone, learns everything, and is never boring twice." },
    { name: "Cancer", glyph: "\u264B", from: [6, 21], to: [7, 22], element: "Water", planet: "The Moon", color: "Silver", day: "Monday", number: 2,
      line: "The keeper of the group. Cancer remembers every birthday and feels every room." },
    { name: "Leo", glyph: "\u264C", from: [7, 23], to: [8, 22], element: "Fire", planet: "The Sun", color: "Gold", day: "Sunday", number: 1,
      line: "Born for the stage. Leo warms the whole party and takes the photo everyone keeps." },
    { name: "Virgo", glyph: "\u264D", from: [8, 23], to: [9, 22], element: "Earth", planet: "Mercury", color: "Green and Brown", day: "Wednesday", number: 5,
      line: "The quiet perfectionist. Virgo spots the one detail everyone missed and fixes it kindly." },
    { name: "Libra", glyph: "\u264E", from: [9, 23], to: [10, 22], element: "Air", planet: "Venus", color: "Pink and Blue", day: "Friday", number: 6,
      line: "The peacemaker with taste. Libra makes sure everyone is heard, and that it all looks beautiful." },
    { name: "Scorpio", glyph: "\u264F", from: [10, 23], to: [11, 21], element: "Water", planet: "Pluto", color: "Dark Red", day: "Tuesday", number: 9,
      line: "The deep one. Scorpio keeps secrets, keeps promises, and sees through everything." },
    { name: "Sagittarius", glyph: "\u2650", from: [11, 22], to: [12, 21], element: "Fire", planet: "Jupiter", color: "Purple", day: "Thursday", number: 3,
      line: "The adventurer. Sagittarius books the ticket, tells the story, and laughs loudest." },
    { name: "Capricorn", glyph: "\u2651", from: [12, 22], to: [1, 19], element: "Earth", planet: "Saturn", color: "Brown and Green", day: "Saturday", number: 8,
      line: "The mountain climber. Capricorn does the work nobody sees and reaches the top anyway." },
    { name: "Aquarius", glyph: "\u2652", from: [1, 20], to: [2, 18], element: "Air", planet: "Saturn", color: "Blue", day: "Saturday", number: 4,
      line: "The original thinker. Aquarius questions everything and is usually right five years early." },
    { name: "Pisces", glyph: "\u2653", from: [2, 19], to: [3, 20], element: "Water", planet: "Neptune", color: "Sea Green", day: "Thursday", number: 7,
      line: "The dreamer with the big heart. Pisces writes the songs and feels what others only sense." }
  ];

  var STONES = [
    { m: "January", stone: "Garnet", line: "a deep red stone carried for protection on long journeys" },
    { m: "February", stone: "Amethyst", line: "a calm violet stone said to keep the mind clear" },
    { m: "March", stone: "Aquamarine", line: "the sea-blue stone sailors kept for safe passage" },
    { m: "April", stone: "Diamond", line: "the hardest thing on earth, and forever" },
    { m: "May", stone: "Emerald", line: "the green stone of spring, renewal and sharp eyes" },
    { m: "June", stone: "Pearl", line: "the only gem made by a living thing, grown with patience" },
    { m: "July", stone: "Ruby", line: "the king of stones, red as a steady heart" },
    { m: "August", stone: "Peridot", line: "a bright olive stone, even found in meteorites" },
    { m: "September", stone: "Sapphire", line: "the blue stone of truth and clear skies" },
    { m: "October", stone: "Opal", line: "every color hiding in one stone, like its people" },
    { m: "November", stone: "Topaz", line: "a warm gold stone said to light up the dark months" },
    { m: "December", stone: "Turquoise", line: "the sky stone, one of the first gems humans ever wore" }
  ];

  var FLOWERS = [
    { m: "January", flower: "Carnation", line: "blooms in the coldest month, which says everything" },
    { m: "February", flower: "Violet", line: "small, modest, and the first color of the year" },
    { m: "March", flower: "Daffodil", line: "the trumpet that announces spring" },
    { m: "April", flower: "Daisy", line: "open by day, closed by night, honest as anything" },
    { m: "May", flower: "Lily of the Valley", line: "tiny bells with a scent worth the whole garden" },
    { m: "June", flower: "Rose", line: "the classic, and June grows the best of them" },
    { m: "July", flower: "Larkspur", line: "tall spires of blue that stand out in any crowd" },
    { m: "August", flower: "Gladiolus", line: "named for the gladiator sword, and it shows" },
    { m: "September", flower: "Aster", line: "a star-shaped flower that keeps blooming late" },
    { m: "October", flower: "Marigold", line: "the festival flower, gold as October light" },
    { m: "November", flower: "Chrysanthemum", line: "the autumn queen, honored across Asia" },
    { m: "December", flower: "Poinsettia", line: "the December star, red when everything else sleeps" }
  ];

  var TREES = [
    { name: "Birch", from: [12, 24], to: [1, 20], line: "the pioneer tree: first to grow back after a forest fire" },
    { name: "Rowan", from: [1, 21], to: [2, 17], line: "the protector tree, planted by doors for good luck" },
    { name: "Ash", from: [2, 18], to: [3, 17], line: "tall, flexible and strong: bends without breaking" },
    { name: "Alder", from: [3, 18], to: [4, 14], line: "grows by water and holds riverbanks together" },
    { name: "Willow", from: [4, 15], to: [5, 12], line: "bends with every storm and never snaps" },
    { name: "Hawthorn", from: [5, 13], to: [6, 9], line: "the fairy tree: flowers in May, fruit in autumn" },
    { name: "Oak", from: [6, 10], to: [7, 7], line: "the king of trees: hundreds of years, deep roots" },
    { name: "Holly", from: [7, 8], to: [8, 4], line: "green through winter when everything else gives up" },
    { name: "Hazel", from: [8, 5], to: [9, 1], line: "the wisdom tree: forks, folklore and finding water" },
    { name: "Vine", from: [9, 2], to: [9, 29], line: "turns whatever soil it gets into something worth toasting" },
    { name: "Ivy", from: [9, 30], to: [10, 27], line: "quiet, patient, and impossible to dislodge" },
    { name: "Reed", from: [10, 28], to: [11, 24], line: "looks fragile, moves whole landscapes by the water" },
    { name: "Elder", from: [11, 25], to: [12, 23], line: "the grandmother tree: flowers, berries and old stories" }
  ];

  var CHINESE = [
    { name: "Rat", line: "quick-witted and resourceful, first through every opportunity" },
    { name: "Ox", line: "patient and dependable, carries the heaviest load without complaint" },
    { name: "Tiger", line: "brave and magnetic, walks into the room everyone else hesitates at" },
    { name: "Rabbit", line: "gentle and sharp-eyed, wins by noticing what others miss" },
    { name: "Dragon", line: "confident and lucky, the sign everyone wants to be" },
    { name: "Snake", line: "wise and calm, thinks three moves ahead" },
    { name: "Horse", line: "free-spirited and tireless, happiest in motion" },
    { name: "Goat", line: "kind and creative, makes every room softer" },
    { name: "Monkey", line: "clever and playful, no puzzle stays unsolved for long" },
    { name: "Rooster", line: "honest and punctual, sees exactly what needs doing" },
    { name: "Dog", line: "loyal to the bone, the friend everyone calls first" },
    { name: "Pig", line: "generous and wholehearted, enjoys life properly" }
  ];

  var BIRTH_NUMBERS = {
    1: "the leader: independent, original, and first to step up",
    2: "the peacemaker: sensitive, fair, and a natural partner",
    3: "the spark: expressive, funny, and creative",
    4: "the builder: practical, loyal, and rock steady",
    5: "the free spirit: curious, adaptable, allergic to routine",
    6: "the caretaker: warm, responsible, family at the center",
    7: "the thinker: private, sharp, drawn to big questions",
    8: "the achiever: ambitious, disciplined, plays the long game",
    9: "the old soul: generous, idealistic, feels the whole world",
    11: "the intuitive: visionary and magnetic, reads what others hide",
    22: "the master builder: big dreams plus the discipline to build them"
  };

  var LIFE_PATHS = {
    1: "a life about leading your own way",
    2: "a life about bringing people together",
    3: "a life about expression and joy",
    4: "a life about building things that last",
    5: "a life about freedom and discovery",
    6: "a life about caring and responsibility",
    7: "a life about learning and depth",
    8: "a life about achievement and strength",
    9: "a life about giving on a grand scale",
    11: "a master number: intuition turned up high",
    22: "a master number: a builder of big things",
    33: "a master number: a teacher at heart"
  };

  var WEEKDAYS = {
    Sunday: "the sun day: born with the lights on",
    Monday: "the moon day: born with a feel for people",
    Tuesday: "the mars day: born with fuel in the tank",
    Wednesday: "the mercury day: born quick and curious",
    Thursday: "the jupiter day: born under the lucky star",
    Friday: "the venus day: born with charm to spare",
    Saturday: "the saturn day: born steady and serious"
  };

  function signFor(m, d) {
    for (var i = 0; i < ZODIAC.length; i++) {
      var z = ZODIAC[i], f = z.from, t = z.to;
      if (f[0] === t[0]) { if (m === f[0] && d >= f[1]) return z; if (m === t[0] && d <= t[1]) return z; }
      else { if ((m === f[0] && d >= f[1]) || (m === t[0] && d <= t[1])) return z; }
    }
    return ZODIAC[9];
  }
  function treeFor(m, d) {
    for (var i = 0; i < TREES.length; i++) {
      var t = TREES[i], f = t.from, o = t.to;
      if ((m === f[0] && d >= f[1]) || (m === o[0] && d <= o[1])) return t;
    }
    return TREES[0];
  }
  function reduceNum(n) { while (n > 9) { n = String(n).split("").reduce(function (a, c) { return a + (+c); }, 0); if (n === 11 || n === 22) return n; } return n; }
  function digitsum(n) { return String(n).split("").reduce(function (a, c) { return a + (+c); }, 0); }
  function lifePath(y, m, d) {
    var s = digitsum(y) + digitsum(m) + digitsum(d);
    while (s > 9 && s !== 11 && s !== 22 && s !== 33) s = digitsum(s);
    return s;
  }
  /* Lunar New Year day (MMDD) per year, the boundary of the Chinese zodiac year.
     1900-1980 verified against the Hong Kong Observatory Gregorian-Lunar calendar
     tables (www.hko.gov.hk/en/gts/time/calendar/text/files/T{year}e.txt); 1900 also
     attested by independent conversion tables. 1981-2030 cross-checked against
     published Chinese New Year tables (travelchinaguide, chinesenewyear.net).
     Years outside the table use a documented late-January fallback. */
  var LNY = [
    "0131","0219","0208","0129","0216","0204","0125","0213", /* 1900-1907 */
    "0202","0122","0210","0130","0218","0206","0126","0214", /* 1908-1915 */
    "0203","0123","0211","0201","0220","0208","0128","0216", /* 1916-1923 */
    "0205","0124","0213","0202","0123","0210","0130","0217", /* 1924-1931 */
    "0206","0126","0214","0204","0124","0211","0131","0219", /* 1932-1939 */
    "0208","0127","0215","0205","0125","0213","0202","0122", /* 1940-1947 */
    "0210","0129","0217","0206","0127","0214","0203","0124", /* 1948-1955 */
    "0212","0131","0218","0208","0128","0215","0205","0125", /* 1956-1963 */
    "0213","0202","0121","0209","0130","0217","0206","0127", /* 1964-1971 */
    "0215","0203","0123","0211","0131","0218","0207","0128", /* 1972-1979 */
    "0216","0205","0125","0213","0202","0220","0209","0129", /* 1980-1987 */
    "0217","0206","0127","0215","0204","0123","0210","0131", /* 1988-1995 */
    "0219","0207","0128","0216","0205","0124","0212","0201", /* 1996-2003 */
    "0122","0209","0129","0218","0207","0126","0214","0203", /* 2004-2011 */
    "0123","0210","0131","0219","0208","0128","0216","0205", /* 2012-2019 */
    "0125","0212","0201","0122","0210","0129","0217","0206", /* 2020-2027 */
    "0126","0213","0203"                                     /* 2028-2030 */
  ];

  function chineseFor(y, m, d) {
    var t = LNY[y - 1900];
    if (!t) return undefined; /* outside 1900-2030: no verified boundary, so no guess */
    var before = m < +t.slice(0, 2) || (m === +t.slice(0, 2) && d < +t.slice(2, 4));
    return CHINESE[(((before ? y - 1 : y) - 1900) % 12 + 12) % 12];
  }

  /* Same year range as the verified lunar table, so every accepted birth date
     also gets an accurate Chinese zodiac. */
  function validDate(y, m, d) {
    y = +y; m = +m; d = +d;
    if (y < 1900 || y > 2030 || m < 1 || m > 12 || d < 1 || d > 31) return false;
    var t = new Date(y, m - 1, d);
    return t.getFullYear() === y && t.getMonth() === m - 1 && t.getDate() === d;
  }

  /* Deterministic lucky numbers: zodiac number, reduced birth day, reduced name sum. */
  function luckyNumbers(m, d, name) {
    var out = [signFor(m, d).number, reduceNum(d)];
    if (name) {
      var w = String(name).toUpperCase().replace(/[^A-Z]/g, ""), sum = 0;
      for (var i = 0; i < w.length; i++) sum += w.charCodeAt(i) - 64;
      if (sum) out.push(reduceNum(sum));
    }
    return out.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  function daysBetween(a, b) { return Math.floor((b - a) / 86400000); }
  function leapYearsSeen(bd, now) {
    var n = 0, y = bd.getFullYear();
    for (; y <= now.getFullYear(); y++) {
      var feb = new Date(y, 1, 29);
      if (feb.getMonth() === 1 && feb > bd && feb <= now) n++;
    }
    return n;
  }
  function ageBreakdown(bd, now) {
    var y = now.getFullYear() - bd.getFullYear(), m = now.getMonth() - bd.getMonth(), d = now.getDate() - bd.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { y: y, m: m, d: d };
  }
  function nextBirthdayIn(bd, now) {
    var t = new Date(now.getFullYear(), bd.getMonth(), bd.getDate());
    if (t <= now) t = new Date(now.getFullYear() + 1, bd.getMonth(), bd.getDate());
    return daysBetween(now, t);
  }
  function fmt(d) { return d.getDate() + ordinal(d.getDate()) + " " + MONTHS[d.getMonth()] + " " + d.getFullYear(); }
  function ordinal(n) { var s = ["th","st","nd","rd"], v = n % 100; return s[(v - 20) % 10] || s[v] || s[0]; }

  return {
    ZODIAC: ZODIAC, STONES: STONES, FLOWERS: FLOWERS, TREES: TREES, CHINESE: CHINESE,
    BIRTH_NUMBERS: BIRTH_NUMBERS, LIFE_PATHS: LIFE_PATHS, WEEKDAYS: WEEKDAYS,
    signFor: signFor, treeFor: treeFor, reduceNum: reduceNum, lifePath: lifePath,
    chineseFor: chineseFor, validDate: validDate, luckyNumbers: luckyNumbers, MONTHS: MONTHS,
    daysBetween: daysBetween, leapYearsSeen: leapYearsSeen, ageBreakdown: ageBreakdown,
    nextBirthdayIn: nextBirthdayIn, fmt: fmt, ordinal: ordinal
  };
})();

(function () {
  var C = {"Aries":[[[14,42],[36,36],[58,30],[82,22]]],"Taurus":[[[18,14],[38,28],[50,36],[62,28],[82,14]]],"Gemini":[[[32,10],[32,30],[32,52]],[[68,10],[68,30],[68,52]],[[32,30],[68,30]]],"Cancer":[[[50,12],[50,32]],[[50,32],[30,52]],[[50,32],[70,52]]],"Leo":[[[18,20],[26,10],[36,14],[38,26],[58,34],[80,42],[86,54],[60,48],[42,38]],[[58,34],[62,20]]],"Virgo":[[[14,22],[30,32],[46,26],[62,36],[78,46],[84,56]],[[46,26],[50,10]]],"Libra":[[[50,12],[30,34],[70,34],[50,12]],[[40,34],[40,52]],[[60,34],[60,52]]],"Scorpio":[[[12,18],[28,28],[44,34],[58,42],[70,52],[80,44],[76,32]],[[12,18],[8,34]]],"Sagittarius":[[[20,44],[44,24],[74,18],[82,36],[66,54],[36,56],[20,44]],[[74,18],[60,40]]],"Capricorn":[[[14,18],[50,30],[86,18],[64,52],[35,52],[14,18]]],"Aquarius":[[[12,34],[28,24],[44,34],[60,24],[76,34],[90,24]],[[44,34],[47,48]],[[76,34],[79,48]]],"Pisces":[[[16,14],[36,36],[50,52],[64,36],[84,14]],[[16,14],[28,10]],[[84,14],[72,10]]]};
  function constSvg(name) {
    var paths = C[name] || [];
    var out = '<svg class="constel" viewBox="0 0 100 62" aria-hidden="true">';
    paths.forEach(function (p) {
      out += '<polyline points="' + p.map(function (q) { return q[0] + "," + q[1]; }).join(" ") + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width=".7"/>';
      p.forEach(function (q) {
        out += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3.1" fill="#fff" opacity=".22"/><circle cx="' + q[0] + '" cy="' + q[1] + '" r="1.5" fill="#fff"/>';
      });
    });
    return out + "</svg>";
  }
  window.FUN.constSvg = constSvg;
})();

(function () {
  var F = window.FUN;
  F.MOON_PHASES = [
    { name: "New Moon", line: "born at the reset. New chapters come naturally to you." },
    { name: "Waxing Crescent", line: "born on the climb. You build momentum and rarely look back." },
    { name: "First Quarter", line: "born at decision time. You commit and push through." },
    { name: "Waxing Gibbous", line: "born almost full. You refine everything you touch." },
    { name: "Full Moon", line: "born at peak light. Big feelings, big presence, big nights." },
    { name: "Waning Gibbous", line: "born to share. You give what you have learned." },
    { name: "Last Quarter", line: "born to let go. You clear what no longer serves you." },
    { name: "Waning Crescent", line: "born near the quiet. You understand things others miss." }
  ];
  F.moonPhase = function (date) {
    var synodic = 29.53058867;
    var ref = Date.UTC(2000, 0, 6, 18, 14);
    var days = (date.getTime() - ref) / 86400000;
    var p = (days % synodic) / synodic;
    if (p < 0) p += 1;
    var idx = Math.floor(p * 8 + 0.5) % 8;
    return { frac: p, idx: idx, illum: Math.round((1 - Math.cos(p * 2 * Math.PI)) / 2 * 100) };
  };
  F.PLANETS = [
    { name: "Mercury", days: 87.97, line: "whipping around the Sun" },
    { name: "Venus", days: 224.7, line: "the bright evening star" },
    { name: "Mars", days: 686.98, line: "the red desert world" },
    { name: "Jupiter", days: 4332.59, line: "the giant with the red storm" },
    { name: "Saturn", days: 10759.22, line: "the one with the rings" },
    { name: "Uranus", days: 30688.5, line: "the sideways ice giant" },
    { name: "Neptune", days: 60182, line: "the deep blue faraway" }
  ];
  F.MONTH_MEANINGS = [
    { m: "January", line: "the opener. Born with new-year grit and a private big heart.", season: "deep winter" },
    { m: "February", line: "the original. Short month, long memory, one-of-a-kind mind.", season: "late winter" },
    { m: "March", line: "the thaw. Born as winter cracks open, full of forward motion.", season: "early spring" },
    { m: "April", line: "the grower. Rain and bloom in one, honest and quick to root.", season: "spring" },
    { m: "May", line: "the bloomer. Everything peaks around you, and so do you.", season: "late spring" },
    { m: "June", line: "the bright one. Longest days for the sunniest of signs.", season: "early summer" },
    { m: "July", line: "the warm one. Midsummer heart, loyal to the core.", season: "high summer" },
    { m: "August", line: "the golden one. Born at the harvest of light, made to shine.", season: "late summer" },
    { m: "September", line: "the harvester. Practical magic, gathered and shared.", season: "early autumn" },
    { m: "October", line: "the vivid one. The loudest colors burn in your month.", season: "autumn" },
    { m: "November", line: "the deep one. First frost, long nights, hidden fires.", season: "late autumn" },
    { m: "December", line: "the cozy one. Longest nights, brightest celebrations.", season: "early winter" }
  ];
  F.goldenBirthday = function (bd) {
    var day = bd.getDate();
    var g = new Date(bd.getTime());
    g.setFullYear(bd.getFullYear() + day);
    return { age: day, date: g };
  };
  F.nthDay = function (bd, n) {
    var d = new Date(bd.getTime());
    d.setDate(d.getDate() + n);
    return d;
  };
})();

(function () {
  var P = ["photo-1765526474510-b48265e14f3c","photo-1778868796463-2a8505a0e34a","photo-1580551844010-58a0a669be6e","photo-1609520934871-d2b769ae407c","photo-1769371720430-3182da84e211","photo-1562690868-60bbe7293e94","photo-1699217394471-ac2b774bd070","photo-1688842832393-62bb403df6a5","photo-1759721270306-ac11a8949b88","photo-1761847516314-8119e020be98","photo-1464820453369-31d2c0b651af","photo-1637538286398-10173661522b"];
  window.FUN.FLOWERS_PHOTOS = P;
})();
