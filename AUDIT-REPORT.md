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
