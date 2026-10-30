# Acrostia

**Every name hides a little poem.** A free, instant name-poem generator: type a name, pick an occasion, and get a personalized acrostic or rhyming poem painted onto a themed card you can download, print, or share.

Live URL (once GitHub Pages is enabled): https://parthiv95.github.io/acrostia/

## What it does

- **Poem studio**: acrostic ("M is for Modest...") or rhyming verse styles, second name for couples, a "from" line for signing
- **51 occasions**: birthdays, weddings, Diwali, Christmas, Eid, graduations, and more, each with its own landing page
- **Backgrounds**: 12 art scenes, 12 photo backgrounds, or upload your own photo
- **Export**: download as PNG, print, copy text, shareable links, WhatsApp share

## Run it locally

No build step. It's a static site:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy (GitHub Pages)

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**, branch **main**, folder **/(root)**
3. Save: the site goes live at the URL above in a minute or two

> Note: GitHub serves Pages from **public** repos on the free plan. Make the repo public first (Settings → General → Danger Zone → Change visibility).

## Project layout

```
index.html        the entire app (styles, scripts, poem engine)
<occasion>/       51 static SEO landing pages (one folder each)
words/            word list reference page
backgrounds/      scene artwork
og-image.png      social share preview
sitemap.xml       submitted to Google via robots.txt
```

## Structure notes

- Headings h1–h6 use the spring word animation (tension 170, friction 24, stagger 110ms, flex row with `column-gap: 0.3em`): never center headings with text-align, never CSS keyframes
- Writing style: no em dashes anywhere
- Contact email lives in `CONTACT_EMAIL` inside index.html
