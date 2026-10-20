# Implications discussion

**Milestone 6.** Trello card: *"Write implications discussion (EXCELLENCE)"*

AS91907 at Excellence asks for two things: *synthesising* information gained
from the planning, testing and trialling of components, and *discussing how
that information led to* a high-quality outcome. So each section below
follows the same chain — **what was found → what was changed → what the
evidence now shows** — and points to the commit or test report that proves it.

> **Before submitting:** this is an evidence record of what happened in the
> build, written so every claim can be checked. For assessment, the discussion
> must be in the student's own words. The two trials also still need real
> tester results (marked ⚠️ below); nothing here has been invented to fill
> that gap.

Evidence referenced throughout:
[baseline test run](testing/run-1-baseline.md) ·
[final test run](testing/test-report.md) ·
[content review](testing/content-review.md) ·
[plan changes](plan-changes.md) ·
[style guide](style-guide.md) ·
[nav trial](nav-trial-notes.md) ·
[timeline trial](timeline-trial-notes.md)

---

## 1. Accessibility

**Colour contrast was tested before anything was built, and it caught a real
failure.** The tertiary grey was first chosen by eye as `#8A867C`. Measured
against the page background it scored **3.45:1** — below the WCAG 2.1 AA
minimum of 4.5:1. It was darkened to `#6E6A60` (5.12:1) before any page used
it. Every colour pairing on the site now passes AA; most pass AAA
([style guide](style-guide.md), `docs/check-contrast.py`).

The point worth drawing out is *when* it was found. A contrast failure found in
Milestone 6 would have meant restyling every page. Found in Milestone 1, it
cost one hex code.

**The most serious accessibility defect was invisible to automated testing.**
The ENIAC photograph's alt text read *"Two women operating the ENIAC
computer"*. There are no people in the photograph — it shows the machine on
museum display behind glass. A screen-reader user was being told something
that isn't there. The automated audit passed this page, because it can confirm
that alt text *exists* but not that it is *true*. It was found only by
checking each description against the actual image
([content review §1](testing/content-review.md)). Three of the four gallery
descriptions were wrong in some way; all were corrected (commit `b196e15`).

That changed how the rest of testing was approached: an automated pass was
treated as the minimum, not as proof.

**Other accessibility work, each verified by the final test run:**

| Decision | Evidence it works |
|---|---|
| Skip link as the first focusable element | The test presses Tab, then Enter, then Tab again, and confirms focus lands inside the main content rather than back in the navigation — on all 7 pages |
| Visible focus ring on every interactive element | A Tab-key walk checks every stop for a visible indicator; none missing |
| Heading outline with no skipped levels | Baseline found `history.html` jumped from h1 to h3, because the era labels were paragraphs. Promoted to h2 (commit `c0fe7c2`); appearance unchanged |
| `aria-current` marks the current page | Every page has exactly one current item. Baseline found the gallery had **none**, because it was only linked from the footer — fixed by moving it into the navigation |
| Menu button says "Menu" rather than showing ☰ | Clearer to screen readers and to anyone who doesn't know the three-line convention |
| `prefers-reduced-motion` respected | Transitions disabled for users who request it |

**Result:** axe-core reports **0 WCAG 2.2 AA violations on all 7 pages**
([final run §2](testing/test-report.md)).

---

## 2. Usability

**Navigation.** Two structures were trialled: a full link row and a collapsed
menu (`trials/nav-option-a.html`, `nav-option-b.html`). The live site uses each
where it is strongest — the full row on wide screens, where showing the whole
site costs nothing, and the menu on narrow ones, where the row would wrap.

> ⚠️ **Tester results needed.** Record them in
> [nav-trial-notes.md](nav-trial-notes.md), then summarise here: what testers
> did, how long the "find the History page" task took on each version, and
> whether it confirmed or overturned the hybrid.

**Touch targets.** Responsive testing measured the mobile menu button at
32×27px. That passes the WCAG 2.2 minimum of 24px, so the test passed — but on
a phone that button is the *only* way into the navigation, so passing the
minimum wasn't good enough. It now measures 48×44px, the comfortable
touch-target size, without the visible word moving (commit `e72a9d2`).

**Readability.** The baseline found seven sentences over 30 words. All were
split, usually where an em dash had been joining two complete thoughts
(commits `b196e15`, `2d9a7a4`). The average sentence is now 11–17 words.
Flesch Reading Ease sits around 47–62 — "fairly difficult" — but this is partly
unavoidable: *artificial intelligence* is nine syllables, and the formula
penalises long words whether or not readers know them. More useful for this
audience is that every technical term is defined where it first appears and
collected in the glossary.

**Wayfinding.** A numbered contents index on the homepage states the reading
order. Each section ends with a link to the next. Each glossary entry links
back to where the term is used in context.

---

## 3. Functionality

**Testing the tests.** The first run of the automated suite reported failures
that were not real: lazy-loaded images cancelled mid-request when the test
navigated away, network timeouts reported as broken links, and headings merged
into prose so that readability scores were distorted (one "sentence" was 93
words long — three separate index rows glued together). All three were fixed
in the harness *before* the baseline was recorded, so the baseline reflects
the site and not the tool. Trusting the first run would have meant "fixing"
problems that didn't exist.

**Real defects found and fixed:**

| Found by | Defect | Fix |
|---|---|---|
| External link check | "Source on GitHub" returned **404 on all 9 pages** — the repository is private | Link removed (commit `c8798b5`) |
| Content check | Quiz and contact pages still read "not yet written" | Both dropped as a plan change — see §7 |
| Nav state check | Gallery had no current item in the navigation | Gallery moved into the navigation |

**Timeline trial.** The static and interactive timelines differed in ways that
were measurable, not just matters of taste. Collapsed entries are invisible to
the browser's own Ctrl+F, print as headlines only, and disappear entirely if
JavaScript fails. The live page uses the static version, because collapsing
solves a density problem that 14 entries in five labelled eras don't have
([timeline trial](timeline-trial-notes.md)).

> ⚠️ **Tester results needed** in [timeline-trial-notes.md](timeline-trial-notes.md)
> before this decision is final.

**Result:** 0 broken internal links, 0 console errors, every page reachable
from the homepage, and the mobile menu opens, closes with Escape and returns
focus correctly on every page ([final run §1, §3](testing/test-report.md)).

---

## 4. Aesthetics

**The first design was replaced because it carried no information.** The
original version used a dark navy background, a cyan-to-violet gradient
headline, a glowing blob, and a grid of three identical cards with decorative
icons. Every element was a default — the same template as countless AI product
pages — and none of it said anything about this site.

The replacement takes its cue from the content. The site is almost entirely
explanatory prose, so it is designed like something made to be *read*: paper
background, serif text, a margin column for section numbers, and hairline
rules instead of boxes ([style guide](style-guide.md)). There is a secondary
argument too — a guide claiming AI is widely misunderstood is more credible
when it isn't wearing the visual clichés of AI marketing.

**Consistency is tested, not assumed.** The test suite confirms the header and
footer are byte-for-byte identical on every page, apart from which item is
marked current.

**Image optimisation is both functional and aesthetic.** The four gallery
photographs were resampled to 1200px and recompressed, cutting the page from
**2,045KB to 640KB** — a 69% reduction — with no visible loss at the size they
are displayed.

---

## 5. Intellectual property

Three of the four photographs are licensed **CC BY-SA**, which *legally
requires* attribution, a link to the licence, and a statement of any changes.
That is why each credit sits directly under its photograph, names the
photographer, links the licence, and states that the image was resized and
recompressed. The fourth is public domain.

Image sourcing applied a quality bar: eight candidates were assessed and four
rejected as too low-resolution. Freely licensed photographs of *current* AI
barely exist, because most modern AI is software with no physical appearance.
Rather than pad the gallery with stock robot photography, it stops at four and
says why on the page.

Both typefaces (Geist and Geist Mono) are released under the SIL Open
Font License 1.1. Once the fonts were hosted on this site (see §6), the site
was *redistributing* them rather than just linking to Google's copies — and the
licence requires that it travel with the files. Both licence texts now sit in
`/fonts` beside the font files. All written content is original.

---

## 6. Privacy

**Dropping the contact form removed a privacy implication.** The form would
have collected names and email addresses, raising questions about what is
stored, where, and for how long. The site now collects no personal data.

**A privacy problem was found while writing this discussion, and fixed.** The
fonts were loaded from Google Fonts, so every visitor's browser contacted
Google's servers and sent their IP address — before they had read a word. A
German court ruled in 2022 that embedding Google Fonts this way breached EU
privacy law.

The fonts are now hosted on this site. Only the Latin and Latin Extended
subsets are included; Latin Extended carries the macron vowels used in te reo
Māori, which a New Zealand site should render properly. The browser downloads a
subset only when the page uses a character from it, so visitors download about
the same amount as before.

**Verified, not assumed.** Two checks were added to the test suite: one records
every request each page makes to another domain, and one confirms both fonts
actually loaded. The second matters because a broken font path fails silently
— the page falls back to Georgia and still looks plausible. Before trusting
the checks, they were run against the old version, where they correctly
reported `fonts.googleapis.com` and `fonts.gstatic.com` on every page. On the
current version: **no page makes a request to any other domain**, and both
fonts load on every page ([final run §1](testing/test-report.md)).

The site now sends a visitor's data to no one but this site. It also works
fully offline, and no longer depends on a third party staying available.

---

## 7. Sustainability, future-proofing and project scope

**No framework, no build step, no third parties.** The site is plain HTML,
CSS and a single 47-line script, with its fonts and images stored alongside it.
There are no dependencies to update, nothing to compile, and no outside service
whose shutdown or change of terms could break it. Any page can be opened
directly in a browser, with or without a network connection.

**The test suite makes the site maintainable.** `tests/site-check.mjs` re-runs
every check in about a minute. Anyone changing the site later can confirm they
haven't broken links, accessibility or layout, rather than relying on
remembering what to check.

**Scope was managed, not just executed.** The quiz and contact form were
*Could* priority in the decomposition table. When time was short, they were
dropped in favour of Milestone 6, because the categorised testing and this
discussion are what Excellence rewards and an optional quiz is not. The change
is recorded in [plan-changes.md](plan-changes.md); both pages remain in the Git
history if there is time to build them later.

---

## 8. Synthesis — what the process as a whole showed

Looking across planning, trialling and testing together, three patterns stand
out.

**The cost of a defect depended almost entirely on when it was found.** The
contrast failure caught in Milestone 1 cost one value. The heading-structure
problem caught in Milestone 6 needed a change to one page. The gallery
descriptions — written in Milestone 4 without looking at the images — needed
five corrections across two pages. Each was the same *kind* of mistake: a
decision made without checking it. The difference was how much had been built
on top of it before the check happened.

**Automated testing found the most problems; manual testing found the worst
one.** The suite found the broken link on every page, the heading skip, the
missing nav state and the long sentences — problems a person could easily
overlook across seven pages. But the most serious defect, alt text describing
people who weren't in a photograph, passed every automated check. Neither
method alone would have been enough.

**Writing the discussion was itself a form of testing.** The font privacy
problem was not found by any test — it surfaced while writing §6, by asking
what data the site sends and to whom. Once found, it became a test, so it
cannot quietly come back.

**Passing a test and being good enough are different things.** The menu button
passed the 24px minimum, and was enlarged anyway because of how important it
is on a phone. The Flesch scores "failed" a plain-English target, and were
explained rather than chased, because the formula penalises vocabulary the
subject requires. Using test results well meant reading them, not just
counting passes.

> ⚠️ **To complete this section:** once the two trials have tester results, add
> what they revealed. If either trial overturned the decision made here, that
> is the strongest single piece of evidence for this standard — it shows
> information from trialling directly changing the outcome.
