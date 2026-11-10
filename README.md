# Acrostia

**Every name hides a little poem.** A free, instant name-poem generator: type a name, pick an occasion, and get a personalized acrostic or rhyming poem set on a printed-looking card you can download, print, or share.

**Live: https://parthiv95.github.io/acrostia/**

## What it does

- **Poetry studio** at `/studio/`: acrostic or rhyming, a second name for couples, a "from" line for signing, four writing voices (gentle, playful, heartfelt, grand), and no account required
- **60 occasion landing pages**: birthdays, weddings, Diwali, Christmas, Eid, graduations, every family relation, each with its own palette, copy and three sample poems
- **Birthday Discovery**: two hubs plus thirteen readings (birth tree, zodiac, birthstone, birth flower, birth month, birth date, lucky number, moon phase, planet age, life path, Chinese zodiac, golden birthday, name on a cake)
- **Name Discovery**: first letter meanings, a letter-by-letter name reading, and the sealed name secret
- **Export**: download as PNG, print, copy text, copy link, WhatsApp share

## The poem engine

`assets/floral/engine.js` holds the real generator, extracted from the original single-file build and made DOM-free:

- `LETTER_TRAITS` per letter, with gender-aware overrides in `GENDER_TRAITS`
- `OCC_THEMES` and `OCC_TRAITS` for occasion-specific vocabulary
- `CLOSERS` for the signing line, `buildAcrostic`, `buildAcrosticPair`, `buildRhyme`
- 61 occasions of data, no network, no storage, no DOM

It exposes `window.Acrostia`: `acrostic(name, occ)`, `pair(a, b, occ)`, `rhyme(a, b, verse, occ)`, `line(entry)`, `closer(occ)`, `voice(v)`, `label(occ)`, `occasions()`.

**Deep links**: `/studio/?n=Emma&o=birthday&s=acrostic&v=gentle`. Occasion pages also accept `?n=` to fill the card. Old `?n=` links on `/` forward to the studio.

**Self test**: `/studio/?selftest=1` generates a poem and renders the export canvas without downloading anything, then reports through the page title. Useful after any change to the engine or exports.

## Run it locally

No build step. It is a static site:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Project layout

```
index.html            homepage
studio/index.html     the poetry studio (five steps, live card, exports)
<occasion>/           60 occasion pages, one folder each
birthday/             Birthday Discovery hub (thirteen readings)
birthday-profile/     the same ledger, presented as a profile
birth-tree/ zodiac/ … 12 birthday reading pages (plus birthday-cake)
first-letter/         name discovery: initial meanings
name-meaning/         name discovery: letter-by-letter reading
name-secret/          name discovery: the sealed secret
privacy/ terms/ refund-policy/ cookie-policy/
404.html
assets/floral/        engine.js and every optimized image
words/ backgrounds/   reference pages and artwork
sitemap.xml           submitted to Google via robots.txt
sw.js                 offline shell, cache name acrostia-v2-floral
```

## Deploy

GitHub Pages, already enabled: repo **Settings → Pages**, deploy from branch **main**, folder **/(root)**. A push to `main` rebuilds in roughly one to two minutes. The repo must stay public on the free plan.

## Conventions

- **No em dashes** anywhere in copy
- Palette: ivory `#FFF8F3`, blush `#FBE3E8`, burgundy `#6B1F2D`, gold `#C89A4B` and `#8A6420` for small text, plum `#241826` for the ledger pages
- Type: Fraunces for display, Inter for UI, Great Vibes for names in script
- Small text never uses the light gold; anything under 18px sits at 4.5:1 contrast or better
- Every page carries a skip link, visible focus rings, lazy images below the fold, and the SEO title and description it shipped with
- Occasion pages share one template and differ only by accent token, labels and copy, which is what keeps 60 pages consistent
- Images live in `assets/floral/` and are already resized; do not add multi-megabyte originals
- The pre-redesign site is recoverable at commit `2ffcdae`

## Contact

parthivkk123@gmail.com
