# Content review — Test 4 of 4

Manual checks that the automated suite cannot make: whether the writing is
accurate, whether images are described correctly, and whether the spelling is
consistent. Automated content checks (leftover placeholder text, repeated
words, sentence length, readability) are in the test reports alongside this
file.

---

## 1. Image descriptions checked against the actual photographs

The gallery's alt text and captions were first written from the image file
names and Wikimedia titles, without the photographs being looked at. Checking
them against the real images found three errors.

| Image | What the page said | What the photograph shows | Severity |
|---|---|---|---|
| ENIAC | "Two women operating the ENIAC computer" (alt) and "Two operators at ENIAC" (caption) | No people at all. ENIAC panels on museum display behind glass at the University of Pennsylvania. | **High** — a screen-reader user was told something that isn't in the image |
| Gallery intro | "three machines from the history in section 02" | One of the four is a portrait of Alan Turing — a person, not a machine | Medium |
| history.html | "Photographs of three of these machines are in the gallery" | ENIAC and Kismet do not appear in the timeline | Medium |
| Kismet | "mounted on a bench" | In a glass museum case | Low |
| Turing | "wearing a school jacket" | A dark jacket and tie; nothing identifies it as school uniform | Low |

All five were corrected in commit `b196e15`. The lesson: alt text has to be
written by looking at the image. Describing an image from its filename produces
text that sounds right and isn't.

---

## 2. Fact check

Every dated or specific factual claim on the site was checked.

### History timeline

| Claim | Verdict |
|---|---|
| 1950 — Turing, *Computing Machinery and Intelligence*, proposes the imitation game | Correct |
| 1956 — Dartmouth workshop; McCarthy's proposal introduces the term "artificial intelligence" | Correct. The 1955 proposal had four authors; McCarthy is credited with the term |
| Organisers expected significant progress in one summer | Correct — the proposal says so directly |
| 1958 — Rosenblatt's perceptron learns from being told whether it was right | Correct |
| 1966 — ELIZA; Weizenbaum disturbed by how users confided in it | Correct |
| 1969 — Minsky & Papert show single-layer perceptrons cannot learn exclusive-or | Correct |
| 1973 — Lighthill report leads to UK funding cuts | Correct |
| 1980 — XCON in production at Digital Equipment Corporation | Correct |
| 1987 — specialised AI hardware market collapses | Correct |
| 1997 — Deep Blue beats Kasparov; "does not learn … scores them using rules written by people" | **Overstated — corrected.** Deep Blue did not learn as modern systems do, but parts of its evaluation were tuned automatically from grandmaster games, so "rules written by people" was too strong. Now reads "an evaluation designed by chess experts and engineers". |
| 2006 — Hinton and colleagues make deep networks trainable | Correct |
| 2012 — AlexNet, trained on graphics cards, wins ImageNet by a wide margin | Correct |
| 2016 — AlphaGo beats Lee Sedol 4–1; commentators judged some moves mistakes | Correct (Game 2, move 37) |
| 2017 — *Attention Is All You Need* introduces the transformer | Correct |
| 2022 — ChatGPT's public release | Correct (30 November 2022) |

### Other sections

| Claim | Page | Verdict |
|---|---|---|
| Character recognition was once considered AI | What is AI? | Correct — a standard example of the "AI effect" |
| Language models are trained to predict the next word | What is AI? | **Deliberate simplification.** Models predict *tokens*, which are often fragments of words. "Word" is accurate enough for the audience and avoids a term that needs its own definition. |
| Automatic emergency braking and lane keeping are common in new cars | Applications | Correct |
| The competing definitions of algorithmic fairness cannot generally all be satisfied at once | Ethics | Correct — established by Kleinberg, Mullainathan & Raghavan (2016) and Chouldechova (2017) |
| Cash machines did not end bank employment | Ethics | Correct — teller numbers grew for decades after ATMs were introduced |
| Purchase timing can suggest a pregnancy | Ethics | Correct — widely reported retail case (2012) |

---

## 3. Spelling and consistency

- **NZ English throughout.** A scan for American spellings (-ize, color,
  center, behavior, judgment, license as a noun) found none in the page
  content. "Program" is used for software, which is correct in NZ English.
- **Licence / license** used correctly: *licence* as the noun (a licence
  plate, the licences require), *licensed* as the verb.
- **Terms defined consistently.** Every term in the glossary was compared
  against how it is used in the section it links to.

---

## 4. Readability

The automated suite measures sentence length and an approximate Flesch Reading
Ease score on the running prose.

The baseline found **seven sentences over 30 words**. All were split (commits
`b196e15` and `2d9a7a4`), usually where an em dash had been joining two
complete thoughts.

Flesch scores sit around 47–61 ("fairly difficult", typical of quality
journalism). This is partly unavoidable on this subject: *artificial
intelligence* alone is nine syllables, and the formula penalises long words
regardless of whether readers know them. The more useful measure for this
audience is that the average sentence is 14–16 words, and that every technical
term is defined where it first appears.
