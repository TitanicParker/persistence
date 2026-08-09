import { parseMonograph } from '../lib/content/monograph';
import { parseAtlas } from '../lib/content/atlas';
import { parseExpositions } from '../lib/content/expositions';
import { parseGlossary } from '../lib/content/glossary';

export const prerender = true;

export function GET() {
  const base = 'https://titanicparker.github.io/persistence/';
  const routes = new Set<string>([
    '', 'theory/', 'atlas/', 'forms/', 'glossary/', 'history/', 'academic/',
    'layman/', 'venture/', 'mainstream/', 'research-status/', 'about/', 'search/',
  ]);
  for (const chapter of parseMonograph().chapters) routes.add(`theory/${chapter.slug}/`);
  for (const cell of parseAtlas()) routes.add(`atlas/${cell.slug}/`);
  for (const form of parseExpositions()) routes.add(`forms/${form.slug}/`);
  for (const term of parseGlossary()) routes.add(`glossary/${term.slug}/`);

  const body = [...routes]
    .map((route) => `  <url><loc>${base}${route}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
