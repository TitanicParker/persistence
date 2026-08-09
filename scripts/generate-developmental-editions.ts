import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { marked } from 'marked';

const MASTER = resolve('developmental_editions_working_master.md');
const DIST = resolve('dist/five-year-old');
const BASE = '/persistence/';
const SITE = 'https://titanicparker.github.io/persistence/';

const yearNames = new Map<number, string>([
  [6, 'Six'], [7, 'Seven'], [8, 'Eight'], [9, 'Nine'], [10, 'Ten'], [11, 'Eleven'],
  [12, 'Twelve'], [13, 'Thirteen'], [14, 'Fourteen'], [15, 'Fifteen'], [16, 'Sixteen'],
  [17, 'Seventeen'], [18, 'Eighteen'],
]);

const publicationCss = `
<style id="constraint-grammar-publication-shell">
.cg-publication-shell{font-family:ui-sans-serif,system-ui,sans-serif;background:#f7f5ef;color:#171714;border-bottom:1px solid #d8d3c8;padding:.7rem max(1rem,calc((100vw - 1180px)/2));display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:.78rem;line-height:1.4;position:relative;z-index:20}
.cg-publication-shell a{color:inherit;text-decoration-thickness:.08em;text-underline-offset:.18em}.cg-publication-shell strong{letter-spacing:.04em;text-transform:uppercase}.cg-publication-shell nav{display:flex;gap:1rem;flex-wrap:wrap}.cg-edition-status{color:#68645d}.cg-publication-footer{font-family:ui-sans-serif,system-ui,sans-serif;background:#f7f5ef;color:#68645d;border-top:1px solid #d8d3c8;padding:1.5rem max(1rem,calc((100vw - 1180px)/2));font-size:.78rem;line-height:1.6}.cg-publication-footer p{margin:.25rem 0}.cg-publication-footer a{color:inherit}
@media(max-width:600px){.cg-publication-shell{align-items:flex-start;flex-direction:column;gap:.55rem}.cg-publication-shell nav{gap:.9rem}.cg-publication-shell a{min-height:2.75rem;display:inline-flex;align-items:center}.cg-edition-status{font-size:.72rem}}
</style>`;

const readingCss = `
<style id="developmental-reading-path">
:root{--paper:#fffdf8;--ink:#1c1c19;--muted:#68645d;--rule:#ddd7cb;--soft:#f4f0e8;--accent:#2f5d50;--wide:760px}
*{box-sizing:border-box}html{font-size:18px;background:var(--paper);color:var(--ink)}body{margin:0;font-family:Georgia,'Times New Roman',serif;line-height:1.72;background:var(--paper)}main{width:min(calc(100% - 2rem),var(--wide));margin:0 auto;padding:4rem 0 6rem}header{margin-bottom:3rem;padding-bottom:2rem;border-bottom:1px solid var(--rule)}.eyebrow{font:700 .72rem/1.4 system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}h1,h2,h3,h4{line-height:1.08;letter-spacing:-.025em}h1{font-size:clamp(2.6rem,7vw,5rem);margin:.5rem 0 1.2rem}h2{font-size:clamp(1.8rem,4vw,2.6rem);margin:3.5rem 0 1rem}h3{font-size:1.3rem;margin:2.4rem 0 .7rem}h4{font-size:1.1rem;margin:2rem 0 .6rem}p,li{max-width:72ch}strong{font-weight:700}blockquote{margin:1.7rem 0;padding:1.1rem 1.2rem;background:var(--soft);border-left:4px solid var(--accent)}blockquote p{margin:.2rem 0}.sequence-nav{display:flex;justify-content:space-between;gap:1rem;margin:3.5rem 0 0;padding-top:1.5rem;border-top:1px solid var(--rule);font:700 .8rem/1.4 system-ui,sans-serif}.sequence-nav a{color:inherit;text-underline-offset:.2em}.sequence-nav .next{text-align:right;margin-left:auto}.sequence-note{font:.82rem/1.55 system-ui,sans-serif;color:var(--muted);margin:1rem 0 2.5rem}.final-line{font-size:1.25rem;margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--rule)}a{color:inherit}@media(max-width:640px){html{font-size:17px}main{padding-top:2rem}h1{font-size:2.7rem}.sequence-nav{flex-direction:column}.sequence-nav .next{text-align:left;margin-left:0}}
</style>`;

const gate = `<section class="cg-rights-gate" id="cg-rights-gate" aria-labelledby="cg-rights-gate-title"><div class="cg-rights-gate__panel"><p class="cg-rights-gate__eyebrow">Copyright & rights notice</p><h1 id="cg-rights-gate-title">Before entering this publication</h1><p class="cg-rights-gate__copyright">Copyright © 9 August 2026 Liam Moloney. All Rights Reserved.</p><p>This publication is publicly viewable but has not been released under an open-source, Creative Commons, or other general reuse license.</p><p>By selecting the acknowledgement below, you confirm that the copyright and rights status of this publication has been brought to your attention. This acknowledgement does not itself grant any license or permission to reproduce, adapt, redistribute, publish, sublicense, sell, or create derivative works.</p><div class="cg-rights-gate__actions"><button class="cg-rights-gate__button" type="button" data-cg-rights-acknowledge>I acknowledge the Rights & Permissions notice — Enter publication</button><a href="${BASE}rights/">Read Copyright, Rights & Permissions</a></div><p class="cg-rights-gate__note">Acknowledgement is stored only in this browser and may be requested again if the notice changes.</p></div></section>`;

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function markerFor(year: number): string {
  const name = yearNames.get(year);
  if (!name) throw new Error(`Missing year name for ${year}`);
  return `# Draft: The ${name}-Year-Old Edition`;
}

function extractYear(master: string, year: number): { title: string; markdown: string } {
  const startMarker = markerFor(year);
  const start = master.indexOf(startMarker);
  if (start === -1) throw new Error(`Missing developmental edition marker: ${startMarker}`);

  const contentStart = start + startMarker.length;
  const nextMarker = year < 18 ? markerFor(year + 1) : null;
  const next = nextMarker ? master.indexOf(nextMarker, contentStart) : master.length;
  if (next === -1) throw new Error(`Missing next developmental edition marker after Year ${year}`);

  let section = master.slice(contentStart, next).trim();
  const auditMarker = `# Year ${year} Draft Audit`;
  const audit = section.indexOf(auditMarker);
  if (audit !== -1) section = section.slice(0, audit).trim();

  if (year === 18) {
    section = section.replace(/\n### Final publication audit[\s\S]*?\n### The completed ascent\n/, '\n### The completed ascent\n');
  }

  const titleMatch = section.match(/^##\s+(.+)$/m);
  if (!titleMatch) throw new Error(`Year ${year}: missing essay title`);
  const title = titleMatch[1].trim();
  section = section.replace(titleMatch[0], '').trim();

  return { title, markdown: section };
}

function sequenceNav(year: number): string {
  const previousHref = year === 6 ? `${BASE}five-year-old/` : `${BASE}five-year-old/${year - 1}/`;
  const previousLabel = year === 6 ? '← Return to the Five-Year-Old Edition' : `← The ${year - 1}-Year-Old Edition`;
  const next = year < 18
    ? `<a class="next" href="${BASE}five-year-old/${year + 1}/">Continue to the ${year + 1}-Year-Old Edition →</a>`
    : '';
  return `<nav class="sequence-nav" aria-label="Developmental reading sequence"><a href="${previousHref}">${previousLabel}</a>${next}</nav>`;
}

if (!existsSync(MASTER)) throw new Error('Missing developmental_editions_working_master.md');
const master = readFileSync(MASTER, 'utf8');

for (let year = 6; year <= 18; year += 1) {
  const { title, markdown } = extractYear(master, year);
  let article = await marked.parse(markdown, { gfm: true });
  if (year === 18) {
    article = article.replace(
      '<p>And, of course, we knew all along that you were never five.</p>',
      '<p class="final-line">And, of course, we knew all along that you were never five.</p>',
    );
  }

  const yearName = yearNames.get(year)!;
  const canonical = `${SITE}five-year-old/${year}/`;
  const description = `The ${yearName}-Year-Old Edition: a continuing developmental explanation of the Constraint Grammar of Completed Intelligibility.`;
  const shell = `<div class="cg-publication-shell" role="banner"><div><strong><a href="${BASE}">Constraint Grammar</a></strong><div class="cg-edition-status">Derived explanatory sequence · The ${yearName}-Year-Old Edition</div></div><nav aria-label="Publication"><a href="${BASE}five-year-old/">Five-Year gateway</a><a href="${BASE}rights/">Rights</a></nav></div>`;
  const footer = `<footer class="cg-publication-footer"><p><strong>Copyright © 9 August 2026 Liam Moloney. All Rights Reserved.</strong></p><p><strong>Constraint Grammar of Completed Intelligibility</strong> · The ${yearName}-Year-Old Edition</p><p>This page is generated from the single developmental editorial master and is derived explanatory material, not canonical theory.</p><p><a href="${BASE}rights/">Rights & Permissions</a></p></footer>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${escapeAttribute(description)}">
<meta name="robots" content="noindex,follow">
<title>The ${yearName}-Year-Old Edition — Constraint Grammar of Completed Intelligibility</title>
${publicationCss}
${readingCss}
<link rel="stylesheet" href="${BASE}rights-gate.css">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="${BASE}favicon.svg" type="image/svg+xml">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Constraint Grammar of Completed Intelligibility">
<meta property="og:title" content="The ${yearName}-Year-Old Edition — Constraint Grammar of Completed Intelligibility">
<meta property="og:description" content="${escapeAttribute(description)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
</head>
<body>
${gate}${shell}
<main>
<header>
<p class="eyebrow">The ${yearName}-Year-Old Edition</p>
<h1>${title}</h1>
<p class="sequence-note">A continuation of the Five-Year-Old Edition. The explanation is becoming more precise without changing the theory underneath it.</p>
</header>
${article}
${sequenceNav(year)}
</main>
${footer}
<script src="${BASE}rights-gate.js" defer></script>
</body>
</html>`;

  const destination = resolve(DIST, String(year), 'index.html');
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, html);
  console.log(`Published developmental edition Year ${year} -> dist/five-year-old/${year}/index.html`);
}
