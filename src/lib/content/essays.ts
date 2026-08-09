import type { Essay, EssaySection } from './types';
import { readSource, span } from './source';
import { slugify } from './slugs';

const SOURCES = {
  history: 'constraint_grammar_from_sentence_resolution_to_constraint_grammar_intellectual_transformation.md',
  academic: 'constraint_grammar_academic_disciplinary_positioning.md',
} as const;

export function parseEssay(kind: keyof typeof SOURCES): Essay {
  const file = SOURCES[kind];
  const { lines, text } = readSource(file);
  const headings = lines.map((line, index) => ({ line, index })).filter(({ line }) => /^#{1,6}\s+/.test(line));
  if (!headings.length) throw new Error(`${kind}: no Markdown headings found`);
  const title = headings[0].line.replace(/^#+\s+/, '').trim();
  const subtitleHeading = headings.find((h) => h.index > headings[0].index && /^##\s+/.test(h.line));
  const subtitle = subtitleHeading && subtitleHeading.index < 5 ? subtitleHeading.line.replace(/^##\s+/, '').trim() : null;
  const seen = new Set<string>();
  const sections: EssaySection[] = headings.slice(1).map(({ line, index }) => {
    const level = line.match(/^#+/)![0].length;
    const headingTitle = line.replace(/^#+\s+/, '').trim();
    const slug = slugify(headingTitle);
    if (seen.has(slug)) throw new Error(`${kind}: duplicate heading slug '${slug}'`);
    seen.add(slug);
    return { level, title: headingTitle, slug, startLine: index + 1 };
  });
  return { title, subtitle, slug: kind, raw: text, sections, source: span(file, 1, lines.length) };
}

export function parseEssays(): Essay[] { return [parseEssay('history'), parseEssay('academic')]; }
