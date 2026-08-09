import type { GlossaryTerm } from './types';
import { readSource, span } from './source';
import { assertUniqueSlugs, slugify } from './slugs';

export const GLOSSARY_SOURCE = 'constraint_grammar_exhaustive_glossary.md';
const FIELD_PREFIXES = ['**Preferred status:**', '**Definition.**', '**Function in the theory.**', '**Distinguish from.**', '**Relations.**'];

export function parseGlossary(): GlossaryTerm[] {
  const { lines } = readSource(GLOSSARY_SOURCE);
  let category = '';
  const starts: { index: number; term: string; category: string }[] = [];
  lines.forEach((line, index) => {
    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) category = line.replace(/^##\s+/, '').trim();
    if (/^###\s+/.test(line)) starts.push({ index, term: line.replace(/^###\s+/, '').trim(), category });
  });
  const terms = starts.map((start, idx) => {
    const end = idx + 1 < starts.length ? starts[idx + 1].index - 1 : lines.length - 1;
    const slice = lines.slice(start.index + 1, end + 1);
    const value = (prefix: string) => {
      const at = slice.findIndex((l) => l.startsWith(prefix));
      if (at < 0) throw new Error(`Glossary '${start.term}': missing ${prefix}`);
      let text = slice[at].slice(prefix.length).trim();
      for (let i = at + 1; i < slice.length && slice[i].trim() && !FIELD_PREFIXES.some((p) => slice[i].startsWith(p)); i++) text += ` ${slice[i].trim()}`;
      return text;
    };
    const relationsRaw = value('**Relations.**');
    const relations = relationsRaw.replace(/^See\s+/i, '').split(';').map((s) => s.trim()).filter(Boolean);
    return {
      term: start.term,
      slug: slugify(start.term),
      preferredStatus: value('**Preferred status:**'),
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
