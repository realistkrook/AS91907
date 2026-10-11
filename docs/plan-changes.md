# Plan changes

A log of every point where the build departed from the original plan in the
decomposition table, with the reason. This supports the Merit criterion
*"effectively using project management techniques to manage development"* —
a plan that was never changed is weaker evidence than one adjusted in
response to what the project revealed.

Each change is also reflected on the
[Trello board](https://trello.com/b/wx2afstC/as91907-ai-website-project).

---

## 1. Glossary given its own page and navigation item

**Milestone 4.** The decomposition table lists the glossary as a component but
the original site map had no page for it.

**Change:** built as `glossary.html` and added to the navigation.

**Why:** the glossary draws terms from all four written sections, so it does
not belong inside any one of them. Every entry links back to the section
where the term is introduced.

**Checked:** adding an eighth navigation item risked overflowing the link row.
Measured at 870px (just above the point where the menu collapses): still one
line, 24px clearance, no horizontal scroll.

---

## 2. Image gallery reduced to four images

**Milestone 4.** Planned as "visuals for AI applications".

**Change:** four images, three of them historical rather than current
applications.

**Why:** eight freely licensed candidates were assessed and four rejected as
too low-resolution. Photographs of current AI barely exist, because most
modern AI is software with no physical appearance. Padding with stock robot
photography would have made the page worse.

---

## 3. Quiz and contact form dropped

**Milestone 5.** Both were marked **Could** priority in the decomposition
table.

**Change:** not built. The placeholder pages were removed, along with every
link to them. Gallery took their place in the navigation.

**Why:** time was put into Milestone 6 instead. The written implications
discussion and the categorised testing are what the Excellence criterion
rewards; an optional quiz is not. This is the trade-off the MoSCoW priorities
in the decomposition table exist to make.

**Found by testing:** the Milestone 6 baseline run
([`testing/run-1-baseline.md`](testing/run-1-baseline.md)) flagged both
placeholder pages as content failures, and separately found that the gallery
had no current item in the navigation because it was only linked from the
footer. Removing the dropped pages and putting Gallery in the navigation fixed
both.

**Before:** Home · What is AI · History · Applications · Ethics · Glossary · Quiz · Contact
**After:** Home · What is AI · History · Applications · Ethics · Gallery · Glossary

**Reversible:** both pages remain in the Git history (commit `67c6f0b`) if
there is time to build them later.

---

## 4. Link to the source code removed

**Milestone 6.** Every page's footer linked to the GitHub repository.

**Change:** link removed.

**Why:** the repository is private, so the link returned a 404 to every visitor
on all nine pages. Found by the external link check in the baseline test run.

**Reversible:** if the repository is made public, the link can be restored.
