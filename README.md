# Understanding AI — Website

An informational website about artificial intelligence, built for
**NCEA Level 3 Digital Technologies — AS91907 (3.8)**, *"Use complex processes
to develop a digital technologies outcome."*

Built with plain HTML, CSS and JavaScript — no frameworks and no build step, so
any page can be opened directly in a browser.

**Design direction:** clean modern reading UI — cool neutral ground, Geist
sans with a mono companion, one emerald accent, soft corners, light and dark modes. The reasoning is
set out in [`docs/style-guide.md`](docs/style-guide.md).

---

## Running it

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8765
```

Then visit <http://localhost:8765>.

---

## Project structure

```
AS91907/
├── index.html            Homepage + hero          [Milestone 2]
├── what-is-ai.html       Core content page        [Milestone 3 — written]
├── applications.html     Core content page        [Milestone 3 — written]
├── ethics.html           Core content page        [Milestone 3 — written]
├── history.html          Timeline                 [Milestone 4 — built]
├── gallery.html          Image gallery            [Milestone 4 — built]
├── glossary.html         16 defined terms         [Milestone 4 — built]
├── css/style.css         All styling + design tokens
├── fonts/                Self-hosted Geist + Geist Mono, with licences
├── js/nav.js             Menu toggle behaviour
├── images/               4 licensed photographs + credits.json
├── tests/site-check.mjs  Automated test suite      [Milestone 6]
├── trials/               Component trials (Merit evidence)
│   ├── nav-option-a.html        Full link row
│   ├── nav-option-b.html        Collapsed menu
│   ├── timeline-static.html     All entries visible
│   └── timeline-interactive.html Entries expand on click
└── docs/
    ├── implications.md          Implications discussion (Excellence)
    ├── plan-changes.md          Every departure from the original plan
    ├── testing/                 Test reports, content review, screenshots
    ├── style-guide.md      Branding + verified contrast ratios
    ├── check-contrast.py   Re-runnable WCAG checker
    ├── nav-trial-notes.md       Nav trial   ← NEEDS YOUR TESTING DATA
    └── timeline-trial-notes.md  Timeline trial ← NEEDS YOUR TESTING DATA
```

The quiz and contact form (Milestone 5, "Could" priority) were dropped in
favour of Milestone 6 — see [`docs/plan-changes.md`](docs/plan-changes.md).

---

## Progress against the milestones

| # | Milestone | Status |
|---|---|---|
| 1 | Planning & Design | Branding + style guide done; site map still to draw |
| 2 | Site Foundation & Structure | **Built** — opener, nav, colophon; nav trial needs user feedback |
| 3 | Core Content Pages | **Written** — What is AI, Applications, Ethics |
| 4 | Enhanced Content & Interactivity | **Built** — timeline, gallery, glossary; timeline trial needs user feedback |
| 5 | Optional Add-ons | **Dropped** — logged as a plan change |
| 6 | Quality, Accessibility & Launch | **Tested** — all four automated categories pass; Safari/Firefox and trials need a person |

Progress is tracked on the
[Trello board](https://trello.com/b/wx2afstC/as91907-ai-website-project),
which has one card per component from the decomposition table.

---

## Components built so far

| Component | Type | Milestone |
|---|---|---|
| Branding / visual identity | Content | 1 |
| Homepage / opening spread | Structural | 2 |
| Navigation bar | Structural | 2 |
| Footer / colophon | Structural | 2 |
| "What is AI?" page | Content | 3 |
| "Where you meet it" page | Content | 3 |
| "The harder questions" page | Content | 3 |
| "History of AI" timeline | Functional | 4 |
| Image gallery | Functional | 4 |
| Glossary of terms | Content | 4 |

---

## Accessibility

Design decisions made up front rather than retrofitted (see
`docs/style-guide.md` for the reasoning):

- All colour pairings verified against **WCAG 2.1 AA** before any page was
  built — run `python3 docs/check-contrast.py` to re-check.
- Skip link to bypass the navigation.
- Menu toggle labelled with a word rather than a `☰` glyph.
- Visible focus rings on all interactive elements.
- `aria-current="page"` marks the active page; `aria-expanded` tracks the menu.
- `prefers-reduced-motion` respected.
- Descriptive alt text on every image; all four are lazy-loaded.
- Images resampled to 1200px, cutting the gallery from 2045KB to 640KB.
- Fonts self-hosted: no page makes a request to any other domain, so no
  visitor's IP address is shared with Google or anyone else.

Verified in Milestone 6: 0 WCAG 2.2 AA violations on all 7 pages
(axe-core), plus a keyboard walk and skip-link check on every page. See
[`docs/testing/`](docs/testing/README.md).

## Testing

```bash
node tests/site-check.mjs
```

Runs functionality, accessibility, responsive and content checks against
every page and writes a report to `docs/testing/`. Setup and the manual
checks still outstanding are in [`docs/testing/README.md`](docs/testing/README.md).
