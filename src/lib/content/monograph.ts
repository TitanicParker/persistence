import type { Chapter } from './types';
import { readSource, span } from './source';
import { assertUniqueSlugs, slugify } from './slugs';

export const MONOGRAPH_SOURCE = 'constraint_grammar_of_completed_intelligibility_final_monograph.txt';

export function parseMonograph(): { title: string; subtitle: string; parts: string[]; chapters: Chapter[] } {
  const { lines } = readSource(MONOGRAPH_SOURCE);
  const title = lines[0]?.trim();
  const subtitle = lines[1]?.trim();
  if (!title || !subtitle) throw new Error('Monograph: missing title/subtitle');

  const partAt = new Map<number, { label: string; title: string }>();
  const parts: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^PART\s+[IVXLCDM]+\s*$/.test(lines[i].trim())) {
      const label = lines[i].trim();
      const partTitle = lines[i + 1]?.trim();
      if (!partTitle) throw new Error(`Monograph line ${i + 1}: part lacks title`);
      partAt.set(i, { label, title: partTitle });
      parts.push(`${label}: ${partTitle}`);
    }
  }

  const starts: { index: number; number: number | null; title: string }[] = [];
  const partIndexes = [...partAt.keys()].sort((a, b) => a - b);
  const firstPartIndex = partIndexes[0];
  if (firstPartIndex == null) throw new Error('Monograph: no PART boundaries found');
  starts.push({ index: 3, number: null, title: 'Abstract and orientation' });
  lines.forEach((line, index) => {
    const match = /^(\d+)\.\s+(.+)$/.exec(line.trim());
    if (match) starts.push({ index, number: Number(match[1]), title: match[2].trim() });
  });
  if (starts.length < 2) throw new Error('Monograph: no numbered chapter boundaries found');

  const chapters: Chapter[] = [];
  for (let s = 0; s < starts.length; s++) {
    const start = starts[s];
    const nextChapterIndex = s + 1 < starts.length ? starts[s + 1].index : lines.length;
    const nextPartIndex = partIndexes.find((idx) => idx > start.index) ?? lines.length;
    let end = Math.min(nextChapterIndex, nextPartIndex) - 1;
    if (start.number == null) end = firstPartIndex - 1;
    while (end >= start.index && !lines[end].trim()) end--;

    let activePart: { label: string; title: string } | null = null;
    for (const [idx, value] of partAt) if (idx <= start.index) activePart = value;
    const raw = lines.slice(start.index, end + 1).join('\n').trim();
    chapters.push({
      kind: 'chapter', number: start.number, title: start.title,
      slug: start.number == null ? 'orientation' : `${String(start.number).padStart(2, '0')}-${slugify(start.title)}`,
      part: activePart?.label ?? null, partTitle: activePart?.title ?? null, raw,
      source: span(MONOGRAPH_SOURCE, start.index + 1, end + 1), previousSlug: null, nextSlug: null,
    });
  }
  assertUniqueSlugs(chapters, 'Monograph');
  chapters.forEach((chapter, i) => {
    chapter.previousSlug = chapters[i - 1]?.slug ?? null;
    chapter.nextSlug = chapters[i + 1]?.slug ?? null;
  });
  return { title, subtitle, parts, chapters };
}
