# Birthday Discovery audit

Date: 2026-11-03
Scope: every birthday-related page and shared asset in the repo, inspected from source. Nothing was modified. This document is the phase-one deliverable: inventory, findings, and a proposed architecture. No pages were redesigned and no functionality was removed or added.

## 1. Route inventory

Live base: `https://parthiv95.github.io/acrostia/` (GitHub Pages, deploy from branch `main`, folder `/root`). All subpage assets are referenced with relative paths (`../fun-data.js`), so every route already works under the `/acrostia/` base path.

### Birthday-related pages (12)

| Route | Title | Source | Template generation |
|---|---|---|---|
| `/birthday/` | Birthday name poem (SEO landing) | `birthday/index.html` | Old template (static, no tool) |
| `/birthday-profile/` | Full birthday profile | `birthday-profile/index.html` | New template (tool page) |
| `/birthday-cake/` | Name on a birthday cake | `birthday-cake/index.html` | New template |
| `/birth-date/` | Birth date meaning (day-of-month reading) | `birth-date/index.html` | Old template (tool, day only) |
| `/birth-flower/` | Birth flower by month | `birth-flower/index.html` | New template |
| `/birth-month/` | Birth month meaning | `birth-month/index.html` | New template |
| `/birthstone/` | Birthstone by month | `birthstone/index.html` | New template |
| `/golden-birthday/` | Golden birthday calculator | `golden-birthday/index.html` | New template |
| `/lucky-number/` | Lucky number finder | `lucky-number/index.html` | New template |
| `/moon-phase/` | Birthday moon phase | `moon-phase/index.html` | New template |
| `/planet-age/` | Age on other planets | `planet-age/index.html` | New template |
| `/zodiac/` | Zodiac sign finder | `zodiac/index.html` | New template |

Features the project brief mentioned that do **not** exist as routes and were not invented:

- Birth Tree: exists only as a fact inside the birthday profile (data in `fun-data.js` `TREES`), not as its own page.
- Life Path Number: exists only as a fact inside the birthday profile (`LIFE_PATHS`), not as its own page.
- Chinese Zodiac: exists only as a fact inside the birthday profile (`CHINESE`), not as its own page.

These three are natural candidates for new discovery pages in a later phase.

### Adjacent name-based pages (not date-based, in scope only as navigation neighbors)

`/first-letter/`, `/name-meaning/`, `/name-secret/` (old template). `birth-date/` links to these three; they do not link back into the birthday cluster except via `../`.

### Related infrastructure

| Asset | Role |
|---|---|
| `index.html` | The poem studio (single page). Occasion routing via `?o=`, 61 occasion landing pages link back with `?o=<key>` |
| `fun-data.js` | Shared birthday data and calculation library, cache-busted `?v=3`, loaded by 9 pages |
| `theme.js` | Seasonal particle effects + site-wide consent banner, loaded by every page |
| `sw.js` | Service worker, `acrostia-v2`, network-first for pages, cache-first for assets |
| `sitemap.xml` | 83 URL entries, includes all 12 birthday routes |
| `manifest.webmanifest` | PWA shell, `start_url: "./"`, relative scope |
| `robots.txt` | Allows all, points at sitemap |

## 2. Existing functionality inventory

### The studio (index.html)

- Acrostic and rhyming poem generation, fully client side. 51 occasions in the `OCCASIONS` map; deep links `?o=birthday` open the right tab and chip.
- State synced to the URL (`n`, `o`, `s`, `v`, `f`, `p`) via `history.replaceState`; shared links trigger a "share funnel" banner.
- Download as PNG card, print, copy text, WhatsApp share. Upload-your-own background. Writing voices and poem fonts.
- Birthday presence on the main page: the `#fun` section has two large cards (birthday profile, name meaning) and a text link row (birth-date, first-letter, name-secret, zodiac, birthstone, birth-flower, birthday-cake, lucky-number). Moon phase, planet age, golden birthday and birth month are **not linked from the main page**.

### Discovery pages (new template, 10 pages)

Each follows the same skeleton: brand header linking `../`, `main` with H1 + lede, a `.tool` card with date controls (native selects for day / month / year, no `<input type=date>`), a result card, optional grid of tappable entries (all 12 zodiac signs, 12 stones, 12 flowers, 12 months, 7 planets), a "Surprise me" randomizer, SEO prose + FAQ, then a 10-card "More birthday fun" grid cross-linking the other discovery pages.

Page by page:

| Page | Inputs | Output | Download / share | Cross-links |
|---|---|---|---|---|
| birthday-profile | name, day, month, year, optional photo upload | Age breakdown, weekday, leap years, days lived, conception estimate, next birthday, western + Chinese zodiac, birthstone, flower, tree, birth number, life path, lucky color/day/number | Canvas profile card PNG, copy link, WhatsApp share, all with `?n=&d=&m=&y=` | 10-card grid |
| birthday-cake | name only | Animated name piped on a real cake photo (canvas, Great Vibes) | PNG download with footer strip | 10-card grid |
| birth-date | day of month only | Day-of-month personality reading (31 hand-written entries, inline `BD` map) | None | Only to first-letter / name-meaning / name-secret |
| birth-flower | month | Flower card with Unsplash photo background | None | 10-card grid |
| birth-month | month | Month meaning card | None | 10-card grid |
| birthstone | month | Gem SVG + Pexels photo card | None | 10-card grid |
| golden-birthday | day, month, year | Golden birthday date, plus 10,000th and 25,000th day | None | 10-card grid |
| lucky-number | name, day, month | Pool of numbers (sign number, birth number, name numerology) with a random pick presented as "your lucky number" | None | 10-card grid |
| moon-phase | day, month, year | Moon phase SVG, illumination %, lunar day | None | 10-card grid |
| planet-age | day, month, year | Age on Jupiter (default) and 4 other planets, next planet birthday | None | 10-card grid |
| zodiac | day, month | Sign card with animated constellation canvas | None | 10-card grid |

### Old-template pages (5)

Georgia serif body, pink `#E91E63` button, no shared CSS with the rest of the site.

Two birthday-cluster pages:

- `birthday/`: static SEO landing linking to `../?o=birthday`.
- `birth-date/`: the only old-template page with a tool, and the only birthday page with zero download/share affordances and no birthday-cluster links.

Three adjacent name-related pages (not date-based): `first-letter/`, `name-meaning/`, `name-secret/`. They sit next to the birthday cluster in navigation but belong to the name-discovery group.

## 3. Calculation inventory (all client side, all in `fun-data.js` unless noted)

| Calculation | Function | Method | Used by |
|---|---|---|---|
| Western zodiac sign | `signFor(m, d)` | Boundary table, Capricorn handles year wrap; falls back to Capricorn | birthday-profile, zodiac, lucky-number |
| Chinese zodiac animal | inline in birthday-profile: `CHINESE[(y - 1900) % 12]` | Year-only modular arithmetic, 1900 = Rat | birthday-profile |
| Birth tree | `treeFor(m, d)` | 13 boundary ranges, Celtic tree calendar | birthday-profile |
| Birthstone | `STONES[m - 1]` | Month lookup | birthday-profile, birthstone |
| Birth flower | `FLOWERS[m - 1]` | Month lookup | birthday-profile, birth-flower, birth-month |
| Birth number | `reduceNum(d)` | Digit reduction, keeps 11 and 22 as master numbers | birthday-profile, lucky-number |
| Life path | `lifePath(y, m, d)` | Digit sum of y+m+d reduced, keeps 11 / 22 / 33 | birthday-profile |
| Name number | inline in lucky-number | A=1 letter sum, then `reduceNum` | lucky-number |
| Lucky number | inline in lucky-number | Picks randomly from {sign number, birth number, name number, random 1-99} | lucky-number |
| Exact age | `ageBreakdown(bd, now)` | Calendar-aware y/m/d | birthday-profile |
| Days lived | `daysBetween` | ms difference / 86400000 | birthday-profile |
| Leap years seen | `leapYearsSeen` | Loops Feb 29 per year | birthday-profile |
| Next birthday | `nextBirthdayIn` | Next occurrence of m/d | birthday-profile |
| Conception estimate | inline in birthday-profile | `bd - 266 days` | birthday-profile |
| Weekday meaning | `WEEKDAYS` | `Date.getDay()` lookup | birthday-profile |
| Moon phase | `moonPhase(date)` | Synodic month 29.53058867 d from reference new moon 2000-01-06 18:14 UTC | moon-phase |
| Planet ages | inline in planet-age + `PLANETS` orbital day counts | `daysLived / orbital period` | planet-age |
| Golden birthday | `goldenBirthday(bd)` | Age = day-of-month; date = birthday + that many years | golden-birthday |
| Nth day | `nthDay(bd, n)` | Date + n days | golden-birthday |
| Month meanings | `MONTH_MEANINGS` | Static copy | birth-month |
| Day-of-month readings | inline `BD` map in birth-date | Static copy, 31 entries | birth-date |
| Day ordinal suffix | `ordinal(n)` in fun-data.js and a separate inline `suffix(d)` in birth-date | Two independent implementations | several |

## 4. Data dependencies

- `fun-data.js` (259 lines, vanilla IIFE exposing `window.FUN`): ZODIAC (with element, planet, color, day, number, blurb), STONES, FLOWERS, TREES, CHINESE, BIRTH_NUMBERS, LIFE_PATHS, WEEKDAYS, MOON_PHASES, PLANETS, MONTH_MEANINGS, FLOWERS_PHOTOS, constellation line data + `constSvg()`, and the helpers above. Comments say it is loaded by 5 pages; in fact 10 load it (`birthday-cake/` loads it but never calls `FUN`).
- Google Fonts: Fraunces + Onest on every tool page; Great Vibes additionally on `birthday-cake/`; the main page also loads Caveat and Playfair Display. All from `fonts.googleapis.com`.
- Images: Unsplash and Pexels CDN photos for card backgrounds and grid tiles (12 Pexels IDs for birthstone, 12 Unsplash IDs for birth flowers, one chocolate-cake photo). `FLOWERS_PHOTOS` is duplicated: it exists in `fun-data.js` and is copy-pasted as `FPHOTOS` inside `birth-flower/index.html`.
- No network APIs, no analytics, no storage beyond the single `acrostia-consent` localStorage key. No birthday state is persisted anywhere today.
- Query-string parameter names per page: birthday-profile `n,d,m,y`; lucky-number `n,d,m`; moon-phase, planet-age, golden-birthday `d,m,y`; zodiac, lucky-number `d,m`; birthstone, birth-flower, birth-month `m`; birthday-cake and birth-date: none.

## 5. Existing bugs and limitations

### Correctness

1. **Birth number 11 renders "undefined"**: `reduceNum(29)` returns master number 11, but `BIRTH_NUMBERS` only has keys 1-9. On `birthday-profile/`, a day-29 birth date renders "11 · undefined" both in the page fact and the canvas card (`BIRTH_NUMBERS[r.bn].split(":")` would throw inside `renderCard`). Day 29 is the only trigger (28 reduces to 10 then 1).
2. **Chinese zodiac ignores Lunar New Year**: `(y - 1900) % 12` assigns the animal by calendar year only. Everyone born in January or February (roughly Jan 1 to Feb 20 depending on year) gets the wrong animal. Affects `birthday-profile/`.
3. **Master number inconsistency**: `reduceNum` preserves 11 and 22 but not 33; `lifePath` preserves 11, 22 and 33. Same person can get a 33 life path but a reduced 6 birth number by design, but the asymmetric helpers make future reuse error-prone.
4. **Invalid dates accepted everywhere**: every "Surprise me" can pick Feb 30 or Apr 31; `new Date(2001, 1, 29)` silently rolls to Mar 1. The controls allow Feb 29 for non-leap years. Results shift by a day or a month with no warning. Golden birthday for Feb 29 births lands on Mar 1 via `setFullYear`.
5. **Golden birthday copy glitch**: the line reads "Turning 26 on the 26th 26 already happened: 26 January 2016", the age is printed twice (`F.ordinal(g.age)` followed by `g.age`) and "already happened:" reads awkwardly.
6. **planet-age title mismatch**: the page is titled and indexed as "How old am I on Mars?" but the default result card shows Jupiter; Mars is only a small tag. SEO promise and content disagree.
7. **lucky-number is not deterministic**: the headline number is partly random on every click, while the page copy and birthday-profile FAQ promise "the same birthday always gives the same profile". Two pages in the same cluster contradict each other about what a birthday reading is.
8. **`treeFor` boundary style differs from `signFor`**: it cannot represent a same-month start and end range and has no year-wrap marker; it works today because the 13 ranges happen to tile the year, but any future edit can silently break it. It also lacks the explicit wrap that Capricorn has.

### Consistency and architecture

9. **No shared birthday context**: every page has its own selects, defaults (Jan 26 1990-ish, or "this year - 30" on the profile), and URL params. A visitor re-enters their birth date on every page. Nothing is persisted (localStorage or sessionStorage) and links between pages carry no date params.
10. **Two birthday-cluster pages use the old unthemed template** (`birthday/`, `birth-date/`; Georgia, `#E91E63` pink buttons) and sit outside the birthday cross-link grid. `birth-date/` is a birthday page that the other birthday pages never link to. (The old template also covers the three adjacent name pages `first-letter/`, `name-meaning/`, `name-secret/`, which are not birthday pages.)
11. **`birthday-cake/` loads `fun-data.js` but never uses it**; it also runs a `requestAnimationFrame` loop forever with no `visibilitychange` pause and no `prefers-reduced-motion` guard (the zodiac sky canvas does both correctly, so the pattern exists in-repo).
12. **Duplicated data**: month names redeclared as literals in 8 pages; `FLOWERS_PHOTOS` duplicated between `fun-data.js` and `birth-flower/`; `STONE`/`FLOWER` name arrays re-typed inside `birth-month/`; ordinal suffix implemented twice; each page re-implements the day/month/year select builder.
13. **Copy drift on the main page**: FAQ says "51 of them" while a hero ticker says "61 occasions" and the README says 51. `birthday/` landing says "All 61 occasions".
14. **Malformed CSS in `zodiac/`**: `.tool { box-shadow: 0 18px 44px 0 18px 44px rgba(60,40,90,.08) }` is invalid (duplicated lengths) so the tool card loses its shadow on that page.
15. **Unreachable from the main page**: moon-phase, planet-age, golden-birthday and birth-month have no link from `index.html` at all (only the sibling grids on the other tool pages).

### Privacy

16. **Birth date and name in shareable URLs**: `birthday-profile/` copy-link and WhatsApp share produce `?n=Emma&d=26&m=1&y=1990`. A birth date plus name is personal data; links get pasted into group chats and indexed by accident. The FAQ actively encourages it. Rule for the redesign: a person's name and date of birth must never be silently added to a shareable URL. Sharing becomes an explicit action that explains what the link contains ("this link includes this name and birth date") before the link is created; a neutral "Copy link" button that quietly includes birth data does not qualify. No backend is introduced for this: the link stays a plain query-string URL, just one the user chose to make knowingly.

### Minor

17. Canonical URLs use `Parthiv95.github.io` (capital P) everywhere; GitHub normalizes but it is inconsistent with the README's lowercase form.
18. `og:image` is the generic studio image on all discovery pages; no page-specific share preview.
19. Conception-date estimate ("probably …") may land badly for some audiences. Design rule: it is not promoted as an important birthday fact in the discovery experience. It stays clearly optional and approximate (tucked into the full profile with its "probably" framing), or is omitted from the primary flow entirely.

## 6. Proposed Birthday Discovery architecture

### Goal

One interconnected experience: enter your date of birth once per session, then every discovery reads the same context. Existing routes are preserved; the site stays static, client-side only, and GitHub Pages compatible.

### Shape: hub + spokes, no framework

Keep the current static-file architecture. Add a Birthday Discovery home that owns the single date entry, and make each existing discovery page a spoke that reads shared context. No build step, no router library, no new dependencies.

```
/acrostia/
  index.html              (studio, unchanged behavior)
  birthday/               (SEO landing for the cluster; becomes the hub's lightweight twin)
  birthday-profile/       (spoke: the full reading, also acts as profile editor)
  zodiac/  birthstone/  birth-flower/  birth-month/
  lucky-number/  moon-phase/  planet-age/  golden-birthday/
  birthday-cake/  birth-date/         (brought into cluster + new template)
  [future] birth-tree/  chinese-zodiac/  life-path/   (promoted from profile facts)
```

### Shared context: a tiny `birthday-context.js`

A new shared script (loaded alongside `fun-data.js`, ~60 lines) that owns the visitor's birthday for the session:

- `BC.get()` returns `{d, m, y, name}` or null.
- `BC.set(d, m, y, name)` validates (real calendar date, not Feb 30; year 1900 to today) and persists to `sessionStorage` under one key, `acrostia-bd`. Session-only by default, so nothing outlives the tab; this matches the site's no-collection posture and the cookie policy gets one extra documented key.
- **Context guarantee (same tab only)**: the initial implementation guarantees preservation across same-tab navigation (link clicks between the hub and spokes). `sessionStorage` does not sync across tabs, and no cross-tab synchronization is claimed or implemented: a newly opened tab starts fresh, and a visitor arriving from an external shared link is seeded by that link's URL parameters, which then become the session context. Any cross-tab behavior would be a separately implemented and tested feature.
- `BC.bind(selectDay, selectMonth, selectYear)` syncs existing selects both ways, so each page keeps its own inputs working.
- `BC.hasProfile()` / a small profile chip in each page header showing the date, with a "change" affordance.
- URL params still win on load (deep links keep working) and are then written into session context, so a visitor arriving on a shared profile link carries it across every spoke.
- Sharing stays opt-in: the only surface that puts a birth date in a URL remains an explicit "Create share link" action with a plain-language confirmation, not a generic "Copy link" button.

### The hub

`birthday-profile/` already does 80 percent of the hub's job. Rather than a new page, promote it: it becomes the Birthday Discovery home ("Your birthday, the whole story") with (a) the single date entry, (b) the full profile, and (c) a discovery grid that hands the chosen date to each spoke. `/birthday/` stays the SEO landing and links to it. The main page's `#fun` section links to the hub and gains the four currently-unlinked tools.

### Preserving routes

No route moves or disappears. Old-template pages get the new shell but keep their URLs, copy targets, and canonical tags. Query params gain no breaking changes: every old parameter keeps its meaning.

## 7. Shared data model

`fun-data.js` stays the single source of truth (bump to `?v=4` when touched). Consolidations, all additive:

- `FUN.MONTHS` (names + short names), `FUN.makeDateInputs(container)` or `BC.bind` for the select boilerplate.
- `FUN.validDate(y, m, d)` calendar validation, used by context and by "Surprise me".
- `BIRTH_NUMBERS` gains entries only for the results the existing reduction can actually return, namely master numbers 11 and 22 (day 29 reduces to 11; day 22 reduces to 4, but the entry keeps the map total if the algorithm ever yields it). The reduction algorithm itself is unchanged, and no synthetic entries are invented for 10 to 31. Life Path master-number handling, including 33, stays separate in `LIFE_PATHS`.
- One `FUN.ordinal` (delete the birth-date inline copy).
- Chinese zodiac moves into `FUN.chineseFor(y, m, d)` with a lookup of the accurate, published Lunar New Year dates for every supported birth year (1900 to 2030, the full range of the year selectors). No guessed or approximate boundary dates. Years outside the table (not selectable today) fall back to the calendar-year rule, documented as such; the profile stops inlining `(y - 1900) % 12`.
- `TREES`, `LIFE_PATHS`, `CHINESE` get their own spoke pages reusing the exact same lookups, so hub, spokes and future pages can never disagree.
- Lucky number becomes deterministic: `FUN.luckyNumbers(m, d, name)` returns the derived set; the page presents the set (with the "spirit number" called out) instead of a random pick. The randomizer stays as an explicit "roll again" affordance.

## 8. Navigation structure

- **Hub grid**: every spoke reachable in one tap from `birthday-profile/`, each tile echoing its own visual identity.
- **Sibling strip**: keep the existing 10-card "More birthday fun" grid on all spokes, add the three future pages when they exist, add `birth-date/` and `birthday-cake/` everywhere they are missing, and make the strip consistent (today `birth-date/` has none and `birthday-cake/`'s old-template siblings link nothing).
- **Header**: brand to home, plus a persistent "Birthday" link to the hub on every spoke; the profile chip shows the active date in-session.
- **Main page**: `#fun` section reorganized as one birthday row (hub card + all spokes) instead of two cards plus a text list; footer "Occasions" keeps its current role.
- **Breadcrumbs** stay unnecessary; the cluster is one level deep and the sibling strip is the way back.

## 9. Proposed design direction per category

The ten new-template pages already set a strong pattern: each owns a tinted palette (`:root` tokens per page), Fraunces display + Onest body, a hero result card, and an identity-specific art treatment. Keep and extend that; do not homogenize the personalities:

| Category | Existing personality | Direction |
|---|---|---|
| Hub / profile | Warm gold press, keepsake card | The "front page of the birthday newspaper": masthead, profile as the lead story, spokes as sections |
| Zodiac | Midnight sky, animated constellations | Keep; add the birth-chart-adjacent facts (element, planet) as star-map annotations |
| Birthstone | Deep green vault, cut-gem SVGs | Keep; facet rendering keyed to the actual stone color per month |
| Birth flower | Rose-tinted botanical, photo tiles | Keep; press-flower illustration style, photo optional |
| Birth month | Plum seasonal almanac | Keep; twelve month "almanac pages" |
| Lucky number | Amber numerology desk | Restyle to the deterministic set: a hand of numbers, one highlighted |
| Moon phase | Indigo night, SVG moon | Keep; a month-lunar-calendar strip showing the whole birth month's phases |
| Planet age | Violet observatory | Keep; fix the Mars-first promise, planet selector as an orrery row |
| Golden birthday | Gold celebration | Keep; a countdown treatment when upcoming, an "it already shone" archival treatment when past |
| Birthday cake | Cocoa bakery | Keep; bring under the shared shell, respect reduced motion and hidden tabs for the piping animation |
| Birth date | (old template) | Adopt the cluster shell with a "day-stone" personality: 31 small daily emblems |
| Chinese zodiac (new) | Paper-cut red and gold | Lantern-festival palette, animal as a paper-cut mark |
| Birth tree (new) | Forest green woodcut | Ring-texture card, the tree's woodcut mark |
| Life path (new) | Indigo chalkboard numerology | Big numeral, path-of-numbers motif |

Motion budget: one signature animation per page max (zodiac's sky is the model: paused when hidden, disabled under reduced motion).

## 10. Implementation sequence

Each phase ships on its own, nothing breaks mid-sequence, and the acceptance checklist can be tested at every gate.

1. **Fix the calculation layer first** (`fun-data.js` to `?v=4`): BIRTH_NUMBERS 11/22/33 gap, `chineseFor` with lunar boundaries, `validDate`, single `ordinal`, deterministic `luckyNumbers`, `FUN.MONTHS`. No UI change, every page immediately more correct.
2. **Add `birthday-context.js`**: session-scoped context with `BC.bind`; wire it into the 10 new-template spokes (each page keeps its selects, they just sync). Enter once, works everywhere; the hub criterion is met even before the hub is redesigned.
3. **Redesign the hub**: `birthday-profile/` promoted to Birthday Discovery home, profile chip in all spoke headers, explicit opt-in share link replacing silent copy-link.
4. **Adopt the cluster shell on old-template pages**: `birth-date/`, then `birthday/` landing alignment; add missing sibling-strip entries.
5. **New spokes**: birth-tree, chinese-zodiac, life-path, reusing existing data.
6. **Main page + SEO**: `#fun` birthday row with all spokes, page-specific og images, copy-count cleanup (51 vs 61), sitemap additions for the three new pages.

Estimate by feel: phase 1-2 are small pure-JS steps; 3 is the main design lift; 4-6 are mechanical once the shell exists.

## 11. Testing and acceptance criteria

Mapped to the eleven-item checklist:

| # | Criterion | How it is verified |
|---|---|---|
| 1 | All existing birthday pages identified | Section 1 of this document; 12 routes confirmed in source and sitemap |
| 2 | A central Birthday Discovery home exists | Hub reachable from main page `#fun`, header of every spoke, and `/birthday/` |
| 3 | Enter birth date once per session | Set date on the hub, navigate to every spoke without re-entering; `sessionStorage` key documented; URL params still override |
| 4 | Discoveries retain context | Change the date on any spoke, visit a sibling, the change carried |
| 5 | Each category has its own visual personality | Per-page palette and art treatment survives the unification (section 9 table) |
| 6 | Navigation works correctly | Sibling strip complete on all spokes; zero dead links (scripted href check against the route table) |
| 7 | Calculations consistent across pages | One implementation per fact in `fun-data.js`; scripted spot-checks: day-29 profile, Jan/Feb Chinese zodiac, Feb 29 births, same zodiac on hub and `/zodiac/` |
| 8 | Keepsake download reflects the profile | Hub card renders the session date after date changes on spokes; day-29 card no longer renders "undefined" |
| 9 | Poem generation intact | Studio regression pass: acrostic + rhyme, `?o=birthday`, download, print, copy, WhatsApp; `fun-data.js` changes touch nothing the studio imports (it imports none of it today) |
| 10 | Desktop and mobile work | 1440 / 768 / 390 widths on hub and every spoke, zero new console errors, touch targets intact |
| 11 | GitHub Pages base path preserved | All assets relative; smoke test on `parthiv95.github.io/acrostia/` after deploy; no absolute `/` asset links introduced |

Plus the standing gates: no birth date or name in any URL without an explicit user action; context lives in `sessionStorage` and is guaranteed for same-tab navigation only (new tabs start fresh; external links seed context via their parameters; no cross-tab sync claimed); all existing routes, query parameters, calculations, SEO content, PWA behavior and GitHub Pages compatibility preserved; cookie policy updated for the one new key before phase 2 ships.

Phase 1 verification gates (run before phase 2 starts): calculation test suite over the shared library; day 29 and day 22 birth numbers; January and February Chinese zodiac boundaries against the lunar table; leap-year and invalid-date handling (Feb 29 real and fake, Apr 31, year boundaries 1900 and current); lucky-number consistency (same inputs, same derived set every time).
