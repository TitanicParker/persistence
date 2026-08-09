import type { GlossaryTerm } from './types';

export type GlossaryResolutionCategory = 'exact' | 'punctuation/case mismatch' | 'legacy term';

export function normalizeGlossaryReference(value: string): string {
  return value
    .replace(/\s+\(legacy\)$/i, '')
    .replace(/[.;:,]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();
}

export function resolveGlossaryReference(reference: string, terms: GlossaryTerm[]): { term: GlossaryTerm; category: GlossaryResolutionCategory } | null {
  const exact = terms.find((term) => term.term === reference);
  if (exact) return { term: exact, category: 'exact' };

  const normalized = normalizeGlossaryReference(reference);
  const candidates = terms.filter((term) => normalizeGlossaryReference(term.term) === normalized);
  if (candidates.length !== 1) return null;
  return {
    term: candidates[0],
    category: /\(legacy\)$/i.test(reference) ? 'legacy term' : 'punctuation/case mismatch',
  };
}
