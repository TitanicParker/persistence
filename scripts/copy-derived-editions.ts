import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const editions = [
  {
    source: 'constraint_grammar_laymans_edition.html',
    destination: 'dist/layman/index.html',
    route: 'layman/',
    label: 'Derived explanatory essay · Layman’s Edition',
  },
  {
    source: 'constraint_grammar_vc_investment_memo.html',
    destination: 'dist/venture/index.html',
    route: 'venture/',
    label: 'Derived strategic interpretation · Venture Edition',
  },
  {
    source: 'constraint_grammar_if_mainstream.html',
    destination: 'dist/mainstream/index.html',
    route: 'mainstream/',
    label: 'Derived consequences essay',
  },
] as const;

const publicationCss = `
<style id="constraint-grammar-publication-shell">
.cg-publication-shell{font-family:ui-sans-serif,system-ui,sans-serif;background:#f7f5ef;color:#171714;border-bottom:1px solid #d8d3c8;padding:.7rem max(1rem,calc((100vw - 1180px)/2));display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:.78rem;line-height:1.4;position:relative;z-index:20}
.cg-publication-shell a{color:inherit;text-decoration-thickness:.08em;text-underline-offset:.18em}.cg-publication-shell strong{letter-spacing:.04em;text-transform:uppercase}.cg-publication-shell nav{display:flex;gap:1rem;flex-wrap:wrap}.cg-edition-status{color:#68645d}.cg-publication-footer{font-family:ui-sans-serif,system-ui,sans-serif;background:#f7f5ef;color:#68645d;border-top:1px solid #d8d3c8;padding:1.5rem max(1rem,calc((100vw - 1180px)/2));font-size:.78rem;line-height:1.6}.cg-publication-footer p{margin:.25rem 0}.cg-publication-footer a{color:inherit}
@media(max-width:600px){.cg-publication-shell{align-items:flex-start;flex-direction:column;gap:.55rem}.cg-publication-shell nav{gap:.9rem}.cg-publication-shell a{min-height:2.75rem;display:inline-flex;align-items:center}.cg-edition-status{font-size:.72rem}}
</style>`;

for (const edition of editions) {
  const sourcePath = resolve(edition.source);
  const destinationPath = resolve(edition.destination);
  if (!existsSync(sourcePath)) throw new Error(`Missing derived edition source: ${edition.source}`);

  let html = readFileSync(sourcePath, 'utf8');
  const canonical = `https://titanicparker.github.io/persistence/${edition.route}`;
  const metadata = `${publicationCss}\n<link rel="canonical" href="${canonical}">\n<meta property="og:site_name" content="Constraint Grammar of Completed Intelligibility">\n<meta property="og:url" content="${canonical}">\n<meta name="twitter:card" content="summary">`;
  if (!html.includes('</head>')) throw new Error(`${edition.source}: missing </head>`);
  html = html.replace('</head>', `${metadata}\n</head>`);

  const shell = `<div class="cg-publication-shell" role="banner"><div><strong><a href="/persistence/">Constraint Grammar</a></strong><div class="cg-edition-status">${edition.label}</div></div><nav aria-label="Publication"><a href="/persistence/">Home</a><a href="/persistence/theory/">Formal theory</a><a href="/persistence/research-status/">Research status</a><a href="/persistence/about/">About</a></nav></div>`;
  html = html.replace(/<body([^>]*)>/i, `<body$1>${shell}`);

  const footer = `<footer class="cg-publication-footer"><p><strong>Constraint Grammar of Completed Intelligibility</strong> · ${edition.label}</p><p>This essay is a derived interpretation of the same framework. The canonical theory, structural atlas, explanatory companion, and glossary remain distinct source documents.</p><p><a href="/persistence/about/">Publication provenance and citation guidance</a></p></footer>`;
  if (!html.includes('</body>')) throw new Error(`${edition.source}: missing </body>`);
  html = html.replace('</body>', `${footer}\n</body>`);

  mkdirSync(dirname(destinationPath), { recursive: true });
  writeFileSync(destinationPath, html);
  console.log(`Published ${edition.source} -> ${edition.destination} with publication shell`);
}
