import { mkdirSync, writeFileSync } from 'node:fs';
import { parseMonograph } from '../src/lib/content/monograph';
import { parseAtlas } from '../src/lib/content/atlas';
import { parseExpositions } from '../src/lib/content/expositions';
import { parseGlossary } from '../src/lib/content/glossary';
import { parseEssay } from '../src/lib/content/essays';

type SearchRecord = {
  title: string;
  kind: string;
  path: string;
  detail: string;
};

const records: SearchRecord[] = [];

for (const chapter of parseMonograph().chapters) {
  records.push({
    title: chapter.title,
    kind: 'Theory chapter',
    path: `theory/${chapter.slug}/`,
    detail: chapter.partTitle ?? 'Formal theory',
  });
}

for (const cell of parseAtlas()) {
  records.push({
    title: cell.canonicalCrystallization,
    kind: 'Atlas cell',
    path: `atlas/${cell.slug}/`,
    detail: `${cell.transformationPattern} · ${cell.completionTopology} · ${cell.persistenceMode} · ${cell.coordinateGeneratedForm}`,
  });
}

for (const exposition of parseExpositions()) {
  records.push({
    title: exposition.canonicalCrystallization,
    kind: 'Form exposition',
    path: `forms/${exposition.slug}/`,
    detail: `${exposition.transformationPattern} · ${exposition.completionTopology} · ${exposition.persistenceMode} · ${exposition.coordinateGeneratedForm}`,
  });
}

for (const term of parseGlossary()) {
  records.push({
    title: term.term,
    kind: 'Glossary term',
    path: `glossary/${term.slug}/`,
    detail: `${term.category} · ${term.definition}`,
  });
}

for (const kind of ['history', 'academic'] as const) {
  const essay = parseEssay(kind);
  records.push({ title: essay.title, kind: kind === 'history' ? 'Intellectual history' : 'Academic positioning', path: `${kind}/`, detail: essay.subtitle ?? '' });
  for (const section of essay.sections) {
    records.push({
      title: section.title,
      kind: kind === 'history' ? 'History section' : 'Academic section',
      path: `${kind}/#${section.slug}`,
      detail: essay.title,
    });
  }
}

records.push(
  { title: 'Research Status', kind: 'Publication guide', path: 'research-status/', detail: 'Claims boundary: demonstrated structure, open hypotheses, evidence, and falsification.' },
  { title: 'About the Publication', kind: 'Publication guide', path: 'about/', detail: 'Source hierarchy, provenance, version, repository, and citation guidance.' },
);

mkdirSync('public', { recursive: true });
writeFileSync('public/search-index.json', `${JSON.stringify(records)}\n`);
console.log(`Search index: ${records.length} records`);
