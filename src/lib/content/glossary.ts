import type { GlossaryTerm } from './types';
import { readSource, span } from './source';
import { assertUniqueSlugs, glossarySlug } from './slugs';

export const GLOSSARY_SOURCE = 'constraint_grammar_exhaustive_glossary.md';
const FIELD_PREFIXES = ['**Preferred status:**', '**Definition.**', '**Function in the theory.**', '**Distinguish from.**', '**Relations.**'];

export function parseGlossary(): GlossaryTerm[] {
  const { lines } = readSource(GLOSSARY_SOURCE);
  let category = '';
  const headings: { index: number; term: string; category: string }[] = [];
  lines.forEach((line, index) => {
    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) category = line.replace(/^##\s+/, '').trim();
    if (/^###\s+/.test(line)) headings.push({ index, term: line.replace(/^###\s+/, '').trim(), category });
  });

  // Only headings that explicitly carry the glossary's structured field schema
  // are GlossaryTerm records. The source also contains terminological-discipline
  // subheads such as "Opening / opening" that are prose rules, not term records.
  // We preserve that distinction instead of synthesizing fields the source omits.
  const starts = headings.filter((heading) => {
    const nextHeading = headings.find((candidate) => candidate.index > heading.index)?.index ?? lines.length;
    return lines.slice(heading.index + 1, nextHeading).some((line) => line.startsWith('**Preferred status:**'));
  });

  const terms = starts.map((start) => {
    const headingPosition = headings.findIndex((heading) => heading.index === start.index);
    const end = headingPosition + 1 < headings.length ? headings[headingPosition + 1].index - 1 : lines.length - 1;
    const slice = lines.slice(start.index + 1, end + 1);
    const value = (prefix: string) => {
      const at = slice.findIndex((l) => l.startsWith(prefix));
      if (at < 0) throw new Error(`Glossary '${start.term}': missing ${prefix}`);
      let text = slice[at].slice(prefix.length).trim();
      for (let i = at + 1; i < slice.length && slice[i].trim() && !FIELD_PREFIXES.some((p) => slice[i].startsWith(p)); i++) text += ` ${slice[i].trim()}`;
      return text;
    };
    const preferredStatus = value('**Preferred status:**');
    const relationsRaw = value('**Relations.**');
    const relations = relationsRaw.replace(/^See\s+/i, '').split(';').map((s) => s.trim()).filter(Boolean);
    return {
      term: start.term,
      slug: glossarySlug(start.term, preferredStatus),
      preferredStatus,
      definition: value('**Definition.**'),
      functionInTheory: value('**Function in the theory.**'),
      distinguishFrom: value('**Distinguish from.**'),
      relations,
      relationsRaw,
      category: start.category,
      source: span(GLOSSARY_SOURCE, start.index + 1, end + 1),
    };
  });
  assertUniqueSlugs(terms, 'Glossary');
  return terms;
}
