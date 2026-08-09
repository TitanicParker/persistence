import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = '/persistence/';

for (let year = 6; year <= 18; year += 1) {
  const path = resolve(`dist/five-year-old/${year}/index.html`);
  if (!existsSync(path)) throw new Error(`Missing generated developmental page: ${path}`);

  let html = readFileSync(path, 'utf8');
  const navNeedle = `<nav aria-label="Publication"><a href="${BASE}five-year-old/">Five-Year gateway</a>`;
  if (!html.includes(navNeedle)) throw new Error(`Year ${year}: publication nav marker not found`);
  html = html.replace(
    navNeedle,
    `<nav aria-label="Publication"><a href="${BASE}wordless/">Wordless</a><a href="${BASE}five-year-old/">Five-Year gateway</a>`,
  );

  const footerNeedle = `<p><a href="${BASE}rights/">Rights & Permissions</a></p>`;
  if (!html.includes(footerNeedle)) throw new Error(`Year ${year}: footer marker not found`);
  html = html.replace(
    footerNeedle,
    `<p><a href="${BASE}wordless/">Wordless table of contents</a> · <a href="${BASE}rights/">Rights & Permissions</a></p>`,
  );

  writeFileSync(path, html);
}

console.log('Added Wordless navigation to developmental editions 6-18');
