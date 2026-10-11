# Testing evidence — Milestone 6

Everything here maps to one of the Milestone 6 cards on the
[Trello board](https://trello.com/b/wx2afstC/as91907-ai-website-project).

| Trello card | Evidence | How it was tested |
|---|---|---|
| Test 1 of 4: Functionality | [test-report.md §1](test-report.md) | Automated: every internal link and image requested on every page; console errors captured; current nav item checked; header and footer compared across pages; reachability crawl from the homepage; external links requested |
| Test 2 of 4: Usability & accessibility | [test-report.md §2](test-report.md) · [`../check-contrast.py`](../check-contrast.py) | Automated: axe-core WCAG 2.2 AA audit; Tab-key walk checking for a visible focus ring at every stop; skip link activated and confirmed to land in the main content; heading outline. Colour contrast checked by script |
| Test 3 of 4: Cross-browser & responsive | [test-report.md §3](test-report.md) · screenshots | Automated in Chromium at 375 / 768 / 1280px: overflow, menu opened and closed with Escape, focus return, touch-target size. **Safari and Firefox still need testing by hand** — see below |
| Test 4 of 4: Content | [content-review.md](content-review.md) · [test-report.md §4](test-report.md) | Manual: every image description checked against the photograph; every factual claim checked; spelling. Automated: leftover placeholder text, repeated words, sentence length, readability |
| Write implications discussion | [`../implications.md`](../implications.md) | Draws on all of the above |

---

## Before and after

The suite was run before any fixes ([run-1-baseline.md](run-1-baseline.md)) and
after them ([test-report.md](test-report.md)). Comparing the two shows testing
directly changing the outcome — the evidence the Merit criterion asks for:
*"effectively using information from testing and trialling to improve the
functionality."*

| Category | Baseline | Final |
|---|---|---|
| Functionality | **FAIL** — 404 on all 9 pages; gallery had no current nav item | PASS |
| Accessibility | **FAIL** — `history.html` skipped from h1 to h3 | PASS — 0 WCAG violations on all 7 pages |
| Responsive | PASS, but menu button 32×27px | PASS — menu button 48×44px |
| Content | **FAIL** — placeholder text on 2 pages; 7 sentences over 30 words | PASS |

The baseline doesn't show the most serious defect of all — alt text describing
people who weren't in a photograph — because automated tools cannot detect it.
That was found by the manual content review.

Screenshots for each run are kept separately so the "before" images are never
overwritten: [`screenshots/run-1-baseline/`](screenshots/run-1-baseline/) and
[`screenshots/test-report/`](screenshots/test-report/).

---

## Still to do by hand

These need a person and cannot be automated here:

- [ ] **Safari and Firefox.** The automated run used Chromium only. Open the
      site in both (Safari is on every Mac), check each page at desktop width
      and with the window narrowed, and screenshot it. Label the screenshots
      *Cross-browser testing*.
- [ ] **A real phone.** Open the deployed site on an actual phone and use the
      menu with a thumb.
- [ ] **Screen reader.** Turn on VoiceOver (Cmd + F5 on a Mac), navigate a page
      by headings (VO + Cmd + H), and listen to the gallery image descriptions.
- [ ] **The two trials.** Both need feedback from at least three people — see
      [nav-trial-notes.md](../nav-trial-notes.md) and
      [timeline-trial-notes.md](../timeline-trial-notes.md).

---

## Re-running the tests

Needs Node.js, Playwright and axe-core:

```bash
npm install -g playwright axe-core
npx playwright install chromium
node tests/site-check.mjs
```

Writes `docs/testing/test-report.md` and fresh screenshots. Pass a filename to
keep a separate run, e.g. `node tests/site-check.mjs run-3.md`.

### A note on the harness itself

The first run reported failures that weren't real. Three bugs in the test
script were fixed before the baseline was recorded: lazy-loaded images
cancelled mid-request counted as failures, network timeouts counted as broken
links, and headings merged into prose distorted the readability scores.

One result is reported as **unverified** rather than passed or failed: four
links to Wikimedia Commons could not be reached from the test machine because
of a network problem, not an error from the links. They should be re-checked
with a working connection.
