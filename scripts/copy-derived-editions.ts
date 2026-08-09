import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const editions = [
  { source: 'constraint_grammar_laymans_edition.html', destination: 'dist/layman/index.html', route: 'layman/', label: 'Derived explanatory essay · Layman’s Edition' },
  { source: 'constraint_grammar_five_year_old_edition.html', destination: 'dist/five-year-old/index.html', route: 'five-year-old/', label: 'Derived explanatory essay · Five-Year-Old Edition' },
  { source: 'constraint_grammar_vc_investment_memo.html', destination: 'dist/venture/index.html', route: 'venture/', label: 'Derived strategic interpretation · Venture Edition' },
  { source: 'constraint_grammar_if_mainstream.html', destination: 'dist/mainstream/index.html', route: 'mainstream/', label: 'Derived consequences essay' },
] as const;

const publicationCss = `
<style id="constraint-grammar-publication-shell">
.cg-publication-shell{font-family:ui-sans-serif,system-ui,sans-serif;background:#f7f5ef;color:#171714;border-bottom:1px solid #d8d3c8;padding:.7rem max(1rem,calc((100vw - 1180px)/2));display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:.78rem;line-height:1.4;position:relative;z-index:20}
.cg-publication-shell a{color:inherit;text-decoration-thickness:.08em;text-underline-offset:.18em}.cg-publication-shell strong{letter-spacing:.04em;text-transform:uppercase}.cg-publication-shell nav{display:flex;gap:1rem;flex-wrap:wrap}.cg-edition-status{color:#68645d}.cg-publication-footer{font-family:ui-sans-serif,system-ui,sans-serif;background:#f7f5ef;color:#68645d;border-top:1px solid #d8d3c8;padding:1.5rem max(1rem,calc((100vw - 1180px)/2));font-size:.78rem;line-height:1.6}.cg-publication-footer p{margin:.25rem 0}.cg-publication-footer a{color:inherit}
.cg-developmental-gateway{position:relative;overflow:hidden;margin:3.5rem 0 .25rem;padding:1.7rem 1.8rem 1.8rem;background:linear-gradient(145deg,#f5f1e9 0%,#fffdf8 78%);border:1px solid #d8d3c8;border-radius:18px;box-shadow:0 12px 30px rgba(28,28,25,.055)}.cg-developmental-gateway:before{content:"";position:absolute;inset:0 auto 0 0;width:5px;background:#2f5d50}.cg-developmental-gateway p{margin:.45rem 0;max-width:42rem}.cg-developmental-gateway h2{margin:.25rem 0 .7rem;font-size:clamp(1.7rem,3.2vw,2.35rem)}.cg-developmental-gateway__eyebrow{font:700 .7rem/1.4 ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#68645d}.cg-developmental-gateway__link{display:inline-flex;align-items:center;gap:.45rem;margin-top:1rem;padding:.72rem .95rem;border:1px solid #bdb6aa;border-radius:999px;font:700 .82rem/1.2 ui-sans-serif,system-ui,sans-serif;text-decoration:none;transition:transform .15s ease,background .15s ease}.cg-developmental-gateway__link:hover{background:#ece7dc;transform:translateY(-1px)}.cg-developmental-gateway__link:focus-visible{outline:3px solid #2f5d50;outline-offset:3px}
@media(max-width:600px){.cg-publication-shell{align-items:flex-start;flex-direction:column;gap:.55rem}.cg-publication-shell nav{gap:.9rem}.cg-publication-shell a{min-height:2.75rem;display:inline-flex;align-items:center}.cg-edition-status{font-size:.72rem}.cg-developmental-gateway{padding:1.45rem 1.35rem 1.5rem;border-radius:14px}.cg-developmental-gateway__link{min-height:2.75rem}}
</style>`;

const gate = `<section class="cg-rights-gate" id="cg-rights-gate" aria-labelledby="cg-rights-gate-title"><div class="cg-rights-gate__panel"><p class="cg-rights-gate__eyebrow">Copyright & rights notice</p><h1 id="cg-rights-gate-title">Before entering this publication</h1><p class="cg-rights-gate__copyright">Copyright © 9 August 2026 Liam Moloney. All Rights Reserved.</p><p>This publication is publicly viewable but has not been released under an open-source, Creative Commons, or other general reuse license.</p><p>By selecting the acknowledgement below, you confirm that the copyright and rights status of this publication has been brought to your attention. This acknowledgement does not itself grant any license or permission to reproduce, adapt, redistribute, publish, sublicense, sell, or create derivative works.</p><div class="cg-rights-gate__actions"><button class="cg-rights-gate__button" type="button" data-cg-rights-acknowledge>I acknowledge the Rights & Permissions notice — Enter publication</button><a href="/persistence/rights/">Read Copyright, Rights & Permissions</a></div><p class="cg-rights-gate__note">Acknowledgement is stored only in this browser and may be requested again if the notice changes.</p></div></section>`;

const developmentalGateway = `<section class="cg-developmental-gateway" aria-labelledby="cg-developmental-gateway-title"><p class="cg-developmental-gateway__eyebrow">There is another step</p><h2 id="cg-developmental-gateway-title">Keep going.</h2><p>You do not need to leave this explanation behind. The same ideas can become a little more exact while everything you have understood so far stays with you.</p><a class="cg-developmental-gateway__link" href="/persistence/five-year-old/6/">Continue the explanation <span aria-hidden="true">→</span></a></section>`;

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

for (const edition of editions) {
  const sourcePath = resolve(edition.source);
  const destinationPath = resolve(edition.destination);
  if (!existsSync(sourcePath)) throw new Error(`Missing derived edition source: ${edition.source}`);

  let html = readFileSync(sourcePath, 'utf8');
  const canonical = `https://titanicparker.github.io/persistence/${edition.route}`;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() ?? 'Constraint Grammar of Completed Intelligibility';
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] ?? 'A derived interpretation of the Constraint Grammar of Completed Intelligibility.';
  const socialImage = 'https://titanicparker.github.io/persistence/social-preview.svg';
  const metadata = `${publicationCss}\n<link rel="stylesheet" href="/persistence/rights-gate.css">\n<link rel="canonical" href="${canonical}">\n<link rel="icon" href="/persistence/favicon.svg" type="image/svg+xml">\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="Constraint Grammar of Completed Intelligibility">\n<meta property="og:title" content="${escapeAttribute(title)}">\n<meta property="og:description" content="${escapeAttribute(description)}">\n<meta property="og:url" content="${canonical}">\n<meta property="og:image" content="${socialImage}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${escapeAttribute(title)}">\n<meta name="twitter:description" content="${escapeAttribute(description)}">\n<meta name="twitter:image" content="${socialImage}">`;
  if (!html.includes('</head>')) throw new Error(`${edition.source}: missing </head>`);
  html = html.replace('</head>', `${metadata}\n</head>`);

  const shell = `<div class="cg-publication-shell" role="banner"><div><strong><a href="/persistence/">Constraint Grammar</a></strong><div class="cg-edition-status">${edition.label}</div></div><nav aria-label="Publication"><a href="/persistence/">Home</a><a href="/persistence/theory/">Formal theory</a><a href="/persistence/research-status/">Research status</a><a href="/persistence/about/">About</a><a href="/persistence/rights/">Rights</a></nav></div>`;
  html = html.replace(/<body([^>]*)>/i, `<body$1>${gate}${shell}`);

  if (edition.route === 'five-year-old/') {
    if (!html.includes('</main>')) throw new Error(`${edition.source}: missing </main>`);
    html = html.replace('</main>', `${developmentalGateway}\n</main>`);
  }

  const footer = `<footer class="cg-publication-footer"><p><strong>Copyright © 9 August 2026 Liam Moloney. All Rights Reserved.</strong></p><p><strong>Constraint Grammar of Completed Intelligibility</strong> · ${edition.label}</p><p>This essay is a derived interpretation of the same framework. The canonical theory, structural atlas, explanatory companion, and glossary remain distinct source documents.</p><p><a href="/persistence/rights/">Rights & Permissions</a> · <a href="/persistence/about/">Publication provenance and citation guidance</a></p></footer><script src="/persistence/rights-gate.js" defer></script>`;
  if (!html.includes('</body>')) throw new Error(`${edition.source}: missing </body>`);
  html = html.replace('</body>', `${footer}\n</body>`);

  mkdirSync(dirname(destinationPath), { recursive: true });
  writeFileSync(destinationPath, html);
  console.log(`Published ${edition.source} -> ${edition.destination} with publication shell and rights gate`);
}
