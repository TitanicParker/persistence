import { describe, expect, test } from 'vitest';
import { parseAtlas } from '../src/lib/content/atlas';
import { parseExpositions } from '../src/lib/content/expositions';
import { parseGlossary } from '../src/lib/content/glossary';
import { parseMonograph } from '../src/lib/content/monograph';
import { numberedSlug, slugify, assertUniqueSlugs } from '../src/lib/content/slugs';
import { validateContent } from '../src/lib/content/validation';

describe('publication content invariants', () => {
  test('atlas has exactly 54 unique Cartesian positions', () => {
    const cells = parseAtlas();
    expect(cells).toHaveLength(54);
    expect(new Set(cells.map((c) => `${c.transformationPattern}|${c.completionTopology}|${c.persistenceMode}`)).size).toBe(54);
  });

  test('expositions have exactly 54 records and match atlas metadata', () => {
    expect(parseExpositions()).toHaveLength(54);
    expect(() => validateContent()).not.toThrow();
  });

  test('slugging is deterministic and numbered cell slugs are stable', () => {
    expect(slugify('Completion Topology')).toBe('completion-topology');
    expect(numberedSlug(1, 'Focal mark')).toBe('01-focal-mark');
  });

  test('duplicate slugs fail loudly', () => {
    expect(() => assertUniqueSlugs([{ slug: 'same' }, { slug: 'same' }], 'test')).toThrow(/duplicate slug/);
  });

  test('glossary extracts structured fields', () => {
    const term = parseGlossary().find((t) => t.term === 'completed intelligibility');
    expect(term).toBeTruthy();
    expect(term?.preferredStatus).toBeTruthy();
    expect(term?.definition).toMatch(/sufficiently determinate/i);
    expect(term?.functionInTheory).toBeTruthy();
    expect(term?.distinguishFrom).toBeTruthy();
  });

  test('monograph recognizes parts and numbered reading units', () => {
    const monograph = parseMonograph();
    expect(monograph.parts.length).toBeGreaterThan(1);
    expect(monograph.chapters.some((chapter) => chapter.number === 1 && chapter.title === 'The object of study')).toBe(true);
  });
});
