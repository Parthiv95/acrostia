# Acrostia site audit report

Date: 2026-11-02
Scope: trust and compliance audit of index.html, policy pages, theme.js, sw.js, sitemap
Commit audited: 8a2a067 (plus sitemap dedupe fix in this commit)

## Verdict

All checklist items from the trust audit pass or are documented as not applicable. One defect was found and fixed during this audit: the previous commit had appended duplicate sitemap entries for privacy/ and terms/, which already existed in the file. Fixed here; sitemap is now 72 unique URLs.

## Checklist results

| Item | Result |
|---|---|
| Privacy policy | PASS: /privacy/ live, linked from footer, in sitemap, verified on parthiv95.github.io |
| Terms of service | PASS: /terms/ live, same |
| Refund policy | PASS: /refund-policy/ states service is free, no payments |
| Cookie policy | PASS: /cookie-policy/ documents the one localStorage key |
| Cookie consent banner | PASS: site-wide via theme.js, dismissed state kept in localStorage, links correct at root and subpage depth |
| Form consents | PASS: contact form opens the visitor's own email app and says so; nothing is submitted or stored |
| Collect only needed data | PASS: no accounts, no analytics, no tracking; poems generated in-browser |
| Third party SDKs | PASS: none. External loads are Google Fonts and Unsplash/Pexels CDNs, disclosed in policy pages |
| Dark patterns | PASS: none found after removing the claim-style note on the contact form |
| Hidden fees | PASS: everything free, stated on refund and terms pages |
| Fake reviews | PASS: five-star hero rating removed (was unsupported) |
| Unsupported claims | PASS: "51 occasions" verified against the OCCASIONS map (exactly 51); star claim removed |
| Alt text | PASS: index.html has zero img tags (CSS backgrounds with labeled links); backgrounds page images all carry descriptive alt text |
| Color contrast | PASS: banner 12.6:1, muted text ~5:1, placeholder darkened to ~4.9:1, accent on white 4.9:1 |
| Keyboard navigation | PASS: real buttons/links throughout, focus-visible outlines added, modal focus traps pre-existed, skip link present |
| Business details | PASS: footer names operator (Parthiv K, India) with contact email |
| Age consent for kids | PASS: privacy page states not directed at under 13, nothing collected |
| Unsubscribe link | N/A: no emails or newsletters exist; privacy page states this |
| Stock image license | PASS: Unsplash and Pexels licenses linked in terms; credits in footer |
| Data deletion | PASS: no server-side data exists; policy pages explain clearing the one local key |

## Also fixed in this commit

- Service worker cache version bumped acrostia-v1 to acrostia-v2: static assets were cached first forever, so returning visitors would not have received theme.js updates (the consent banner) at all.
- Sitemap deduplicated (72 unique URLs, zero duplicates verified programmatically).

## Known limitations

- The 50+ occasion subpages do not carry footer links to the policy pages; they are all reachable via the consent banner on every page (theme.js) and from the main page footer. A scripted footer sweep can add them if wanted.
- Google Fonts loads from a US-hosted CDN; the standard GDPR-recommended self-hosting step is not done. Disclosed in the cookie policy instead.

---

# Acrostia site audit report

Date: 2026-10-30
Scope: index.html, 54 occasion subpages, manifest, README, service worker
Commit audited: 5095f87 (fixes pushed as 0487935)

## Verdict

Site is healthy. All runtime checks passed with zero console errors and zero failed network requests. Two em-dash violations and one functional bug were found and fixed in commit 0487935, now pushed to main.

## Checks run and results

### Static checks

| Check | Result |
|---|---|
| Em dashes (house style: none allowed) | FAIL in README.md (4) and manifest.webmanifest (1), fixed |
| Duplicate element IDs in index.html | PASS, none |
| Leftover "Samples" labels after Examples rename | PASS, none |
| Internal links in index.html resolve on disk | PASS, all resolve |
| Internal links on all 54 subpages resolve on disk | PASS, all resolve (../ paths verified manually as site root) |
| Subpage titles follow pattern "<Occasion> name poem, personalized and free | Acrostia" | PASS (spot-checked birthday, diwali, eid) |
| OG tags present (title, description, type, url, image) | PASS |

### Runtime checks (preview server, desktop and mobile)

| Check | Result |
|---|---|
| Console errors | PASS, none |
| Console warnings | PASS, none |
| Failed network requests | PASS, none |
| All systems present | PASS: watermark canvas, confetti, examples, custom cursor |

### Edge case tests (all passed, no crashes)

1. Empty name submitted: focuses input, shows "Please type a name first"
2. 20-character name: no crash
3. Special characters (Zoë, Ñ, `<>&`, digits): stripped or handled, no crash
4. Rapid clicking of example chips: no crash
5. "Make one like it" with no clipboard permission path: no crash
6. Confetti burst at (0,0) and offscreen coordinates: no crash
7. Numbers-only name input: watermark falls back to default name, no crash
8. Couple mode with special characters in partner name: no crash

### Mobile (375 x 812)

- PASS: no horizontal scroll
- PASS: examples chips wrap cleanly, panel centered
- PASS: custom cursor correctly hidden on touch devices (hover/fine-pointer media query)

### Bug found and fixed

**Partner name leak in examples explorer.** Loading the Wedding example (Raj & Mira) into the studio and then loading a single-name example (Valentine's Priya, Birthday Meera) left "Mira" in the couple field, producing a couple poem where a single-name poem was expected. Fix: single-name examples now clear the partner field. Verified: after Wedding then Valentine's, the field is empty.

### Writing style violations found and fixed

- README.md: 4 em dashes replaced with colons
- manifest.webmanifest: app name "Acrostia — name poems..." became "Acrostia: name poems..."

## Known items not covered by this audit

These need your input or are larger planned upgrades:

1. Analytics choice: Cloudflare Web Analytics (recommended) vs GoatCounter, needs your account
2. Remove the Claude GitHub App: github.com/settings/installations
3. Planned upgrades from the investor review: richer poem word banks, per-occasion OG images, Search Console sitemap

## Test artifact note

Screenshots in the preview pane sometimes show a stuck "LOADING THE STUDIO" screen. That is a test artifact: the browser pane suspends requestAnimationFrame, so the loader never receives the frames it needs to fade. It does not happen for real visitors.
