#!/usr/bin/env node
/* ==========================================================================
   Site check — automated test suite for Milestone 6
   AS91907 Digital Technologies 3.8

   Runs the four Milestone 6 test categories against every page and writes
   a dated Markdown report plus screenshots to docs/testing/.

     1. Functionality   — links, navigation, reachability, menu behaviour
     2. Accessibility   — axe-core WCAG 2.2 AA audit, keyboard walk, headings
     3. Responsive      — horizontal overflow and layout at three widths
     4. Content         — leftover placeholders, repeated words, readability

   Usage:
     node tests/site-check.mjs                 -> docs/testing/test-report.md
     node tests/site-check.mjs run-1.md        -> docs/testing/run-1.md

   Requires Playwright and axe-core (installed globally, or point
   EXTRA_MODULES at a node_modules folder). CHROMIUM_PATH can point at a
   specific Chromium build if Playwright's default one is not installed.

   The script serves the site itself on a random local port, so no separate
   web server is needed.
   ========================================================================== */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "docs", "testing");
const REPORT_NAME = process.argv[2] || "test-report.md";
const REPORT = path.join(OUT_DIR, REPORT_NAME);
// Each run keeps its own screenshots, so a later run never overwrites the
// "before" evidence from an earlier one.
const SHOT_SUB = REPORT_NAME.replace(/\.md$/, "");
const SHOT_DIR = path.join(OUT_DIR, "screenshots", SHOT_SUB);

const WIDTHS = [375, 768, 1280];                       // phone, tablet, desktop
const SHOT_PAGES = ["index.html", "what-is-ai.html", "history.html", "gallery.html"];
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/* ---------- dependency loading ------------------------------------------ */
const require = createRequire(import.meta.url);
const searchRoots = [
  process.env.EXTRA_MODULES,
  (() => { try { return execSync("npm root -g").toString().trim(); } catch { return null; } })(),
].filter(Boolean);

function load(name) {
  try { return require(name); } catch {}
  for (const r of searchRoots) { try { return require(path.join(r, name)); } catch {} }
  throw new Error(`Cannot find "${name}". Install it with: npm install -g ${name}`);
}
function resolveFile(rel) {
  try { return require.resolve(rel); } catch {}
  for (const r of searchRoots) { const p = path.join(r, rel); if (fs.existsSync(p)) return p; }
  throw new Error(`Cannot find "${rel}". Install it with: npm install -g axe-core`);
}

const { chromium } = load("playwright");
const AXE_SRC = fs.readFileSync(resolveFile("axe-core/axe.min.js"), "utf8");
const AXE_VERSION = JSON.parse(fs.readFileSync(resolveFile("axe-core/package.json"), "utf8")).version;

/* ---------- tiny static server ------------------------------------------ */
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".jpg": "image/jpeg", ".png": "image/png", ".json": "application/json", ".svg": "image/svg+xml",
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); return res.end("not found");
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const PAGES = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))
  .sort((a, b) => (a === "index.html" ? -1 : b === "index.html" ? 1 : a.localeCompare(b)));

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
fs.mkdirSync(SHOT_DIR, { recursive: true });

const R = { func: {}, a11y: {}, resp: {}, content: {}, external: [], graph: {} };
const fetchStatus = async (url) => {
  try {
    const r = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(12000),
      headers: { "User-Agent": "AS91907-site-check/1.0 (student project link checker)" } });
    return r.status;
  } catch (e) { return `error: ${e.cause?.code || e.name}`; }
};

/* ======================================================================== */
/* 1. FUNCTIONALITY + 2. ACCESSIBILITY (desktop width)                       */
/* ======================================================================== */
const externalLinks = new Map();

for (const file of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [], localFailures = [], thirdPartyFailures = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => consoleErrors.push(e.message));
  const note = (url, msg) => (url.startsWith(BASE) ? localFailures : thirdPartyFailures).push(msg);
  page.on("response", (r) => { if (r.status() >= 400) note(r.url(), `${r.status()} ${r.url()}`); });
  // ERR_ABORTED means the browser cancelled the request — usually because the test
  // navigated away while a lazy-loaded image was still arriving. Not a site fault.
  page.on("requestfailed", (r) => { const e = r.failure()?.errorText || "";
    if (!e.includes("ERR_ABORTED")) note(r.url(), `${e} ${r.url()}`); });

  const resp = await page.goto(`${BASE}/${file}`, { waitUntil: "load" });
  await page.waitForTimeout(400);

  // --- links -------------------------------------------------------------
  const links = await page.$$eval("a[href]", (as) =>
    as.map((a) => ({ href: a.getAttribute("href"), abs: a.href, text: a.textContent.trim().slice(0, 40) })));
  const internal = [...new Set(links.filter((l) => l.abs.startsWith("http://127.0.0.1"))
    .map((l) => l.abs.split("#")[0]))];
  const imgSrcs = await page.$$eval("img[src]", (is) => [...new Set(is.map((i) => i.src))]);
  for (const u of imgSrcs) if (u.startsWith("http://127.0.0.1")) internal.push(u);
  const broken = [];
  for (const u of internal) {
    const s = await fetchStatus(u);
    if (s !== 200) broken.push(`${s} ${u.replace(BASE + "/", "")}`);
  }
  for (const l of links.filter((l) => /^https?:/.test(l.abs) && !l.abs.startsWith("http://127.0.0.1"))) {
    if (!externalLinks.has(l.abs)) externalLinks.set(l.abs, { text: l.text, pages: new Set() });
    externalLinks.get(l.abs).pages.add(file);
  }
  R.graph[file] = internal.filter((u) => u.endsWith(".html")).map((u) => u.replace(BASE + "/", "")).filter((u) => u.endsWith(".html"));

  // Shared components must be identical on every page apart from which nav
  // item is marked current; compared after the loop.
  R.shared ||= { header: {}, footer: {} };
  const shared = await page.evaluate(() => {
    const norm = (el) => el ? el.outerHTML.replace(/ aria-current="page"/g, "").replace(/\s+/g, " ") : "MISSING";
    return { header: norm(document.querySelector("header.masthead")), footer: norm(document.querySelector("footer.colophon")) };
  });
  (R.shared.header[shared.header] ||= []).push(file);
  (R.shared.footer[shared.footer] ||= []).push(file);

  const nav = await page.evaluate(() => ({
    navLinks: document.querySelectorAll(".nav__link").length,
    current: document.querySelectorAll('[aria-current="page"]').length,
    currentHref: document.querySelector('[aria-current="page"]')?.getAttribute("href") || null,
  }));

  R.func[file] = {
    status: resp?.status(), consoleErrors, localFailures, thirdPartyFailures,
    internalLinks: internal.length - imgSrcs.length, images: imgSrcs.length, broken, ...nav,
  };

  // --- axe-core ------------------------------------------------------------
  await page.addScriptTag({ content: AXE_SRC });
  const axe = await page.evaluate(async (tags) => {
    const strict = await window.axe.run(document, { runOnly: { type: "tag", values: tags } });
    const bp = await window.axe.run(document, { runOnly: { type: "tag", values: ["best-practice"] } });
    const shape = (v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
      targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) });
    return { violations: strict.violations.map(shape), passes: strict.passes.length,
             incomplete: strict.incomplete.map(shape), bestPractice: bp.violations.map(shape) };
  }, AXE_TAGS);

  // --- headings, images, language -------------------------------------------
  const struct = await page.evaluate(() => {
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
    const skips = [];
    for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) skips.push(`h${hs[i - 1]}→h${hs[i]}`);
    const imgs = [...document.images];
    return { h1: hs.filter((h) => h === 1).length, headingSkips: skips,
      images: imgs.length, imagesNoAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
      lang: document.documentElement.lang, title: document.title };
  });

  // --- keyboard walk ----------------------------------------------------------
  await page.goto(`${BASE}/${file}`, { waitUntil: "load" });
  const stops = [];
  for (let i = 0; i < 120; i++) {
    await page.keyboard.press("Tab");
    const s = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      const cs = getComputedStyle(e);
      const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
      const r = e.getBoundingClientRect();
      return { tag: e.tagName.toLowerCase(), cls: (e.className || "").toString().split(" ")[0],
        text: (e.getAttribute("aria-label") || e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28),
        ring, onScreen: r.width > 0 && r.height > 0 };
    });
    if (!s) break;
    if (stops.length && s.text === stops[0].text && s.cls === stops[0].cls) break; // wrapped
    stops.push(s);
  }

  // --- skip link actually moves past the nav ------------------------------------
  await page.goto(`${BASE}/${file}`, { waitUntil: "load" });
  await page.keyboard.press("Tab");
  const skipFocused = await page.evaluate(() => document.activeElement?.classList.contains("skip-link"));
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  const afterSkip = await page.evaluate(() => {
    const e = document.activeElement;
    return { inMain: !!e?.closest("main"), inNav: !!e?.closest("nav, header"),
             text: (e?.textContent || "").trim().slice(0, 30) };
  });

  R.a11y[file] = {
    axe, ...struct,
    keyboard: { stops: stops.length, firstIsSkip: stops[0]?.cls === "skip-link",
      missingRing: stops.filter((s) => !s.ring).map((s) => `${s.tag}.${s.cls} "${s.text}"`),
      offScreen: stops.filter((s) => !s.onScreen).length },
    skipLink: { focusedFirst: skipFocused, ...afterSkip },
  };

  await ctx.close();
}

/* reachability: breadth-first crawl from the homepage */
const seen = new Set(["index.html"]), queue = ["index.html"];
while (queue.length) for (const n of R.graph[queue.shift()] || []) if (!seen.has(n)) { seen.add(n); queue.push(n); }
R.unreachable = PAGES.filter((p) => !seen.has(p));

/* external links */
for (const [url, v] of externalLinks) R.external.push({ url, text: v.text, pages: [...v.pages], status: await fetchStatus(url) });

/* ======================================================================== */
/* 3. RESPONSIVE                                                             */
/* ======================================================================== */
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const file of PAGES) {
    await page.goto(`${BASE}/${file}`, { waitUntil: "load" });
    await page.waitForTimeout(250);
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const wide = [...document.querySelectorAll("body *")].filter((e) => {
        const r = e.getBoundingClientRect(); return r.right > de.clientWidth + 1 && r.width > 0;
      }).slice(0, 3).map((e) => e.tagName.toLowerCase() + (e.className ? "." + e.className.toString().split(" ")[0] : ""));
      const t = document.querySelector(".nav__toggle");
      return { overflow: de.scrollWidth - de.clientWidth, tooWide: wide,
        navMode: t && getComputedStyle(t).display !== "none" ? "menu button" : "link row",
        bodyPx: parseFloat(getComputedStyle(document.body).fontSize) };
    });

    // screenshot the resting page before any interaction changes focus or state
    if (SHOT_PAGES.includes(file)) {
      await page.screenshot({ path: path.join(SHOT_DIR, `${file.replace(".html", "")}-${width}.jpg`),
        type: "jpeg", quality: 72 });
    }

    // menu behaviour, where the collapsed menu is in use
    if (m.navMode === "menu button") {
      const t = page.locator(".nav__toggle");
      const tb = await t.boundingBox();
      await t.click();
      const open = await page.evaluate(() => ({
        expanded: document.querySelector(".nav__toggle").getAttribute("aria-expanded"),
        listShown: getComputedStyle(document.querySelector(".nav__list")).display !== "none",
        label: document.querySelector(".nav__toggle").textContent.trim(),
        smallestLinkPx: Math.min(...[...document.querySelectorAll(".nav__link")].map((a) => a.getBoundingClientRect().height)),
      }));
      await page.keyboard.press("Escape");
      const closed = await page.evaluate(() => ({
        expanded: document.querySelector(".nav__toggle").getAttribute("aria-expanded"),
        focusOnToggle: document.activeElement === document.querySelector(".nav__toggle"),
      }));
      m.menu = { toggleH: Math.round(tb.height), toggleW: Math.round(tb.width), open, closed };
    }

    (R.resp[file] ||= {})[width] = m;
  }
  await ctx.close();
}

/* ======================================================================== */
/* 4. CONTENT                                                                */
/* ======================================================================== */
const syllables = (w) => {
  w = w.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  return Math.max(1, (w.match(/[aeiouy]{1,2}/g) || []).length);
};
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const file of PAGES) {
    await page.goto(`${BASE}/${file}`, { waitUntil: "load" });
    const text = await page.innerText("main");
    const prose = await page.$$eval("main p, main li, main dd", (els) => els
      .filter((e) => !e.closest(".margin-note, .byline, .figure__credit, .figure__num, .era__label, .opener__kicker, .pagehead__num, .readnext"))
      .map((e) => e.innerText.replace(/\s+/g, " ").trim()).filter(Boolean));
    const proseText = prose.join(" ");
    const words = proseText.match(/[A-Za-z][A-Za-z'’-]*/g) || [];
    const sentenceList = prose.flatMap((b) => b.split(/(?<=[.!?])\s+/)).filter((x) => x.split(/\s+/).length > 2);
    const sentences = Math.max(1, sentenceList.length);
    const longSentences = sentenceList.filter((x) => x.split(/\s+/).length > 30);
    const syl = words.reduce((n, w) => n + syllables(w), 0);
    const flesch = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syl / Math.max(1, words.length));
    R.content[file] = {
      words: (text.match(/[A-Za-z][A-Za-z'’-]*/g) || []).length,
      placeholders: [...new Set((text.match(/not yet written|lorem ipsum|\bTODO\b|\bTBC\b|placeholder/gi) || []).map((s) => s.toLowerCase()))],
      repeated: [...new Set((text.match(/\b(\w+)\s+\1\b/gi) || []).filter((s) => !/^(that that|had had)$/i.test(s)))],
      flesch: Math.round(flesch), long: longSentences.length,
      longSamples: longSentences.map((x) => x.slice(0, 90) + (x.length > 90 ? "…" : "")),
      avgSentence: +(words.length / sentences).toFixed(1),
    };
  }
  await ctx.close();
}

const chromeVersion = browser.version();
await browser.close();
server.close();

/* ======================================================================== */
/* REPORT                                                                    */
/* ======================================================================== */
const tick = (ok) => (ok ? "PASS" : "**FAIL**");
const L = [];
const push = (...a) => L.push(...a);
const now = new Date();
const stamp = now.toLocaleString("en-NZ", { timeZone: "Pacific/Auckland", dateStyle: "medium", timeStyle: "short" });

const fFail = PAGES.filter((p) => { const f = R.func[p];
  return f.status !== 200 || f.consoleErrors.length || f.localFailures.length || f.broken.length || f.current !== 1; });
const headerVariants = Object.keys(R.shared.header).length, footerVariants = Object.keys(R.shared.footer).length;
const sharedOk = headerVariants === 1 && footerVariants === 1;
const extBad = R.external.filter((e) => typeof e.status === "number" && e.status >= 400);
const extUnverified = R.external.filter((e) => typeof e.status !== "number");
const aFail = PAGES.filter((p) => { const a = R.a11y[p];
  return a.axe.violations.length || a.h1 !== 1 || a.headingSkips.length || a.imagesNoAlt ||
    !a.keyboard.firstIsSkip || a.keyboard.missingRing.length || !a.skipLink.inMain; });
const rFail = PAGES.filter((p) => WIDTHS.some((w) => { const m = R.resp[p][w];
  return m.overflow > 0 || (m.menu && (m.menu.open.expanded !== "true" || !m.menu.open.listShown ||
    m.menu.closed.expanded !== "false" || !m.menu.closed.focusOnToggle || m.menu.toggleH < 44 || m.menu.toggleW < 44)); }));
const cFail = PAGES.filter((p) => R.content[p].placeholders.length || R.content[p].repeated.length);

push(`# Test report`, "",
  `Generated by \`tests/site-check.mjs\` on **${stamp}** (NZ time).`, "",
  `Browser: Chromium ${chromeVersion} (headless) · Accessibility engine: axe-core ${AXE_VERSION} · Pages tested: ${PAGES.length}`, "",
  "| Category | Result | Pages with problems |", "|---|---|---|",
  `| 1. Functionality | ${tick(!fFail.length && !R.unreachable.length && !extBad.length && sharedOk)} | ${[...fFail, ...R.unreachable.map((u) => u + " (unreachable)")].join(", ") || "—"}${extBad.length ? ` · ${extBad.length} external link(s)` : ""} |`,
  `| 2. Usability & accessibility | ${tick(!aFail.length)} | ${aFail.join(", ") || "—"} |`,
  `| 3. Responsive | ${tick(!rFail.length)} | ${rFail.join(", ") || "—"} |`,
  `| 4. Content | ${tick(!cFail.length)} | ${cFail.join(", ") || "—"} |`, "",
  "> Automated checks cannot cover everything. Cross-browser testing in Safari and Firefox,",
  "> screen-reader testing, and judging whether the writing is clear still need a person.", "");

push("---", "", "## 1. Functionality", "",
  "Every page is loaded and every internal link on it is requested. Console errors and failed",
  "same-origin requests are recorded. The menu is tested separately under Responsive.", "",
  "| Page | HTTP | Internal links | Images | Broken | Console errors | Nav items | Active item |",
  "|---|---|---|---|---|---|---|---|");
for (const p of PAGES) { const f = R.func[p];
  push(`| ${p} | ${f.status} | ${f.internalLinks} | ${f.images} | ${f.broken.length ? "**" + f.broken.length + "**" : 0} | ${f.consoleErrors.length ? "**" + f.consoleErrors.length + "**" : 0} | ${f.navLinks} | ${f.current === 1 ? f.currentHref : "**" + f.current + "**"} |`); }
push("", `**Shared components:** ${sharedOk ? `the header and footer are identical on all ${PAGES.length} pages, apart from which navigation item is marked current.` : `**the header has ${headerVariants} different versions and the footer ${footerVariants} across the site** — ` + [...Object.values(R.shared.header), ...Object.values(R.shared.footer)].filter((g) => g.length < PAGES.length).map((g) => g.join(", ")).join(" / ")}`);
push("", `**Reachability:** ${R.unreachable.length ? "**not reachable from the homepage: " + R.unreachable.join(", ") + "**" : `all ${PAGES.length} pages can be reached by following links from the homepage.`}`, "");
const allBroken = PAGES.flatMap((p) => R.func[p].broken.map((b) => `- ${p} → ${b}`));
const allErr = PAGES.flatMap((p) => [...R.func[p].consoleErrors, ...R.func[p].localFailures].map((b) => `- ${p}: ${b}`));
if (allBroken.length) push("**Broken links:**", "", ...allBroken, "");
if (allErr.length) push("**Errors:**", "", ...allErr, "");
const third = [...new Set(PAGES.flatMap((p) => R.func[p].thirdPartyFailures))];
if (third.length) push("**Third-party requests that failed** (not counted as failures — usually no network):", "", ...third.map((t) => "- " + t), "");
push("### External links", "", "| Status | Link text | URL | Found on |", "|---|---|---|---|");
for (const e of R.external.sort((a, b) => String(a.status).localeCompare(String(b.status))))
  push(`| ${e.status === 200 ? 200 : typeof e.status === "number" ? "**" + e.status + "**" : "unverified — no connection"} | ${e.text} | ${e.url.length > 60 ? e.url.slice(0, 57) + "…" : e.url} | ${e.pages.length > 3 ? e.pages.length + " pages" : e.pages.join(", ")} |`);
if (extUnverified.length) push("", `${extUnverified.length} external link(s) could not be reached from the test machine (network error rather than an HTTP error status), so they are reported as unverified rather than broken. Re-run with a working connection to confirm them.`);
push("");

push("---", "", "## 2. Usability & accessibility", "",
  `**Automated audit:** axe-core ${AXE_VERSION} against WCAG 2.0, 2.1 and 2.2 at levels A and AA.`, "",
  "**Keyboard walk:** the page is navigated with the Tab key alone, from the top. Each stop is",
  "checked for a visible focus indicator. The skip link is then activated to confirm the next",
  "Tab lands inside the main content rather than back in the navigation.", "",
  "| Page | WCAG violations | Rules passed | Needs review | h1 | Heading skips | Images / no alt | Tab stops | First stop is skip link | Focus ring on every stop | Skip link works |",
  "|---|---|---|---|---|---|---|---|---|---|---|");
for (const p of PAGES) { const a = R.a11y[p];
  push(`| ${p} | ${a.axe.violations.length ? "**" + a.axe.violations.length + "**" : 0} | ${a.axe.passes} | ${a.axe.incomplete.length} | ${a.h1} | ${a.headingSkips.length ? "**" + a.headingSkips.join(" ") + "**" : "none"} | ${a.images} / ${a.imagesNoAlt} | ${a.keyboard.stops} | ${a.keyboard.firstIsSkip ? "yes" : "**no**"} | ${a.keyboard.missingRing.length ? "**" + a.keyboard.missingRing.length + " missing**" : "yes"} | ${a.skipLink.inMain ? "yes" : "**no**"} |`); }
push("");
const viol = PAGES.flatMap((p) => R.a11y[p].axe.violations.map((v) => `- **${p}** — \`${v.id}\` (${v.impact}, ${v.nodes} element${v.nodes > 1 ? "s" : ""}): ${v.help}. e.g. \`${v.targets[0]}\``));
if (viol.length) push("**WCAG violations:**", "", ...viol, "");
const rings = PAGES.flatMap((p) => R.a11y[p].keyboard.missingRing.map((m) => `- ${p}: ${m}`));
if (rings.length) push("**Focus stops with no visible indicator:**", "", ...rings, "");
const inc = {}; PAGES.forEach((p) => R.a11y[p].axe.incomplete.forEach((v) => { (inc[v.id] ||= { help: v.help, pages: [] }).pages.push(p); }));
if (Object.keys(inc).length) push("**Flagged for manual review** (axe could not decide automatically):", "",
  ...Object.entries(inc).map(([id, v]) => `- \`${id}\` — ${v.help} (${v.pages.length} page${v.pages.length > 1 ? "s" : ""})`), "");
const bp = {}; PAGES.forEach((p) => R.a11y[p].axe.bestPractice.forEach((v) => { (bp[v.id] ||= { help: v.help, pages: [] }).pages.push(p); }));
if (Object.keys(bp).length) push("**Best-practice advisories** (not WCAG failures):", "",
  ...Object.entries(bp).map(([id, v]) => `- \`${id}\` — ${v.help} (${v.pages.join(", ")})`), "");

push("---", "", "## 3. Responsive", "",
  `Each page is loaded at ${WIDTHS.join(" / ")} px wide (phone / tablet / desktop) and checked for`,
  "horizontal scrolling. Where the collapsed menu is in use, it is opened with a click, checked,",
  "and closed with Escape, confirming focus returns to the button. The menu button must be at least",
  "44×44px: it is the only way into the navigation on a phone, so it is held to the comfortable",
  "touch-target size rather than the WCAG 2.2 minimum of 24px.", "",
  `| Page | ${WIDTHS.map((w) => w + "px").join(" | ")} |`, `|---|${WIDTHS.map(() => "---").join("|")}|`);
for (const p of PAGES) push(`| ${p} | ${WIDTHS.map((w) => { const m = R.resp[p][w];
  return (m.overflow > 0 ? `**overflows ${m.overflow}px**` : "fits") + ` · ${m.navMode}`; }).join(" | ")} |`);
push("");
const mm = R.resp["index.html"][375].menu;
if (mm) push(`**Menu at 375px** (homepage): button ${mm.toggleW}×${mm.toggleH}px · opens: aria-expanded=${mm.open.expanded}, list visible=${mm.open.listShown}, label "${mm.open.label}" · smallest menu link ${Math.round(mm.open.smallestLinkPx)}px tall · Escape closes: aria-expanded=${mm.closed.expanded}, focus returned to button=${mm.closed.focusOnToggle}`, "");
const over = PAGES.flatMap((p) => WIDTHS.filter((w) => R.resp[p][w].overflow > 0).map((w) => `- ${p} at ${w}px: ${R.resp[p][w].overflow}px too wide — ${R.resp[p][w].tooWide.join(", ")}`));
if (over.length) push("**Overflow details:**", "", ...over, "");
push(`**Screenshots** (in \`docs/testing/screenshots/${SHOT_SUB}/\`):`, "",
  ...SHOT_PAGES.map((p) => `- ${p}: ${WIDTHS.map((w) => `[${w}px](screenshots/${SHOT_SUB}/${p.replace(".html", "")}-${w}.jpg)`).join(" · ")}`), "");

push("---", "", "## 4. Content", "",
  "Checks for text left over from development and accidentally repeated words. Readability is",
  "the Flesch Reading Ease score, which is approximate: syllables are estimated, not counted.",
  "60–70 is plain English; 50–60 is fairly difficult (typical of quality journalism); below 50 is difficult.", "",
  "Readability is measured on running prose only (paragraphs, list items, definitions) — headings,",
  "labels and table cells are excluded because they have no full stops and would distort sentence length.", "",
  "| Page | Words | Avg. sentence | Sentences over 30 words | Flesch | Leftover placeholder text | Repeated words |", "|---|---|---|---|---|---|---|");
for (const p of PAGES) { const c = R.content[p];
  push(`| ${p} | ${c.words} | ${c.avgSentence} | ${c.long} | ${c.flesch} | ${c.placeholders.length ? "**" + c.placeholders.join(", ") + "**" : "none"} | ${c.repeated.length ? "**" + c.repeated.join(", ") + "**" : "none"} |`); }
const longAll = PAGES.flatMap((p) => R.content[p].longSamples.map((x) => `- ${p}: "${x}"`));
if (longAll.length) push("", "**Sentences over 30 words** (candidates for splitting):", "", ...longAll);
push("", "> Factual accuracy and spelling are checked by hand — see `docs/testing/content-review.md`.", "");

fs.writeFileSync(REPORT, L.join("\n"));
const failing = (sharedOk ? 0 : 1) + fFail.length + aFail.length + rFail.length + cFail.length + R.unreachable.length + extBad.length;
console.log(`Report: ${path.relative(ROOT, REPORT)}`);
console.log(`Functionality ${fFail.length || R.unreachable.length || extBad.length || !sharedOk ? "FAIL" : "pass"} · Accessibility ${aFail.length ? "FAIL" : "pass"} · Responsive ${rFail.length ? "FAIL" : "pass"} · Content ${cFail.length ? "FAIL" : "pass"}`);
process.exit(failing ? 1 : 0);
