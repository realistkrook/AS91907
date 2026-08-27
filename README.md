# Understanding AI — Website

An informational website about artificial intelligence, built for
**NCEA Level 3 Digital Technologies — AS91907 (3.8)**, *"Use complex processes
to develop a digital technologies outcome."*

Built with plain HTML, CSS and JavaScript — no frameworks and no build step, so
any page can be opened directly in a browser.

**Design direction:** editorial / Swiss information design — paper ground,
serif prose, mono labels, hairline rules, one accent colour. The reasoning is
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
├── history.html          Timeline                 [Milestone 4 — placeholder]
├── quiz.html             Optional add-on          [Milestone 5 — placeholder]
├── contact.html          Optional add-on          [Milestone 5 — placeholder]
├── css/style.css         All styling + design tokens
├── js/nav.js             Menu toggle behaviour
├── images/               Image assets
├── trials/               Component trials (Merit evidence)
│   ├── nav-option-a.html   Full link row
│   └── nav-option-b.html   Collapsed menu
└── docs/
    ├── style-guide.md      Branding + verified contrast ratios
    ├── check-contrast.py   Re-runnable WCAG checker
    └── nav-trial-notes.md  Nav trial results  ← NEEDS YOUR TESTING DATA
```

Placeholder pages exist so the navigation bar has no broken links while the
site is being built. Each is clearly labelled with the milestone that will
replace it.

---

## Progress against the milestones

| # | Milestone | Status |
|---|---|---|
| 1 | Planning & Design | Branding + style guide done; site map still to draw |
| 2 | Site Foundation & Structure | **Built** — opener, nav, colophon; nav trial needs user feedback |
| 3 | Core Content Pages | **Written** — What is AI, Applications, Ethics |
| 4 | Enhanced Content & Interactivity | Not started — history page is a placeholder |
| 5 | Optional Add-ons | Not started |
| 6 | Quality, Accessibility & Launch | Not started |

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

Full accessibility testing happens in Milestone 6.
