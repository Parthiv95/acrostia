# Acrostia

**Every name hides a little poem.**

A free, instant name-poem generator. Type a name, pick an occasion, and get a personalized acrostic or rhyming poem set on a card you can download, print or share.

**Live: https://parthiv95.github.io/acrostia/**

## What you can do

- Write an acrostic or a rhyming poem for one name, or two for a couple
- Choose from 60 occasions: birthdays, weddings, Diwali, Christmas, Eid, graduations, and every family relation
- Read your birthday thirteen different ways, from birth tree to life path
- Explore what a name means, letter by letter
- Download the card as a picture, print it, copy the link, or send it on WhatsApp

No account, no payment, no watermark.

## Run it locally

It is a static site with no build step:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy

Hosted on GitHub Pages from the `main` branch, root folder. Pushing to `main` publishes the site in a minute or two.

## Project layout

```
index.html        homepage
studio/           the poem studio
<occasion>/       60 occasion pages
birthday/         Birthday Discovery
first-letter/     Name Discovery
assets/floral/    images and the poem engine
sitemap.xml       search engines
```

## Contact

parthivkk123@gmail.com

Developer notes, conventions and the engine API live in [docs/ENGINE.md](docs/ENGINE.md).
