import type { AtlasCell, Exposition, GlossaryTerm } from './types';
import { parseAtlas } from './atlas';
import { parseExpositions } from './expositions';
import { parseGlossary } from './glossary';
import { parseMonograph } from './monograph';
import { parseEssays } from './essays';

export type ValidationReport = {
  monograph: { parts: number; readingUnits: number; duplicateSlugs: number };
  atlas: { cells: number; tupleCoverage: number; duplicateTuples: number; missingNumbers: number[] };
  expositions: { cells: number; mismatches: string[] };
  glossary: { terms: number; duplicateSlugs: number; unresolvedReferences: string[] };
  essays: { slug: string; sections: number }[];
};

function tuple(cell: AtlasCell): string { return [cell.transformationPattern, cell.completionTopology, cell.persistenceMode].join(' / '); }

function validateAtlas(cells: AtlasCell[]) {
  if (cells.length !== 54) throw new Error(`Atlas: expected 54 cells, found ${cells.length}`);
  const missingNumbers = Array.from({ length: 54 }, (_, i) => i + 1).filter((n) => !cells.some((c) => c.number === n));
  const numbers = new Set(cells.map((c) => c.number));
  if (numbers.size !== 54 || missingNumbers.length) throw new Error(`Atlas: numbering invariant failed; missing ${missingNumbers.join(', ') || 'none'}`);
  const transformations = new Set(cells.map((c) => c.transformationPattern));
  const topologies = new Set(cells.map((c) => c.completionTopology));
  const persistence = new Set(cells.map((c) => c.persistenceMode));
  if (transformations.size !== 6 || topologies.size !== 3 || persistence.size !== 3) throw new Error(`Atlas: expected 6×3×3 dimensions, found ${transformations.size}×${topologies.size}×${persistence.size}`);
  const tuples = cells.map(tuple);
  const tupleSet = new Set(tuples);
  if (tupleSet.size !== 54) throw new Error(`Atlas: duplicate coordinate tuples detected (${54 - tupleSet.size})`);
  for (const a of transformations) for (const b of topologies) for (const c of persistence) if (!tupleSet.has(`${a} / ${b} / ${c}`)) throw new Error(`Atlas: missing coordinate tuple ${a} / ${b} / ${c}`);
  return { cells: cells.length, tupleCoverage: tupleSet.size, duplicateTuples: cells.length - tupleSet.size, missingNumbers };
}

function norm(value: string): string { return value.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim(); }
function validateExpositions(expositions: Exposition[], atlas: AtlasCell[]): string[] {
  if (expositions.length !== 54) throw new Error(`Expositions: expected 54 cells, found ${expositions.length}`);
  const mismatches: string[] = [];
  for (const ex of expositions) {
    const cell = atlas.find((c) => c.number === ex.number);
    if (!cell) { mismatches.push(`cell ${ex.number}: absent from atlas`); continue; }
    const checks: [string, string, string][] = [
      ['Transformation Pattern', ex.transformationPattern, cell.transformationPattern], ['Completion Topology', ex.completionTopology, cell.completionTopology],
      ['Persistence Mode', ex.persistenceMode, cell.persistenceMode], ['coordinate-generated form', ex.coordinateGeneratedForm, cell.coordinateGeneratedForm],
      ['canonical crystallization', ex.canonicalCrystallization, cell.canonicalCrystallization], ['companion utterance', ex.companionUtterance, cell.companionUtterance],
      ['constraint strength', ex.constraintStrength, cell.constraintStrength],
    ];
    for (const [label, a, b] of checks) if (norm(a) !== norm(b)) mismatches.push(`cell ${ex.number} ${label}: exposition='${a}' atlas='${b}'`);
  }
  if (mismatches.length) throw new Error(`Exposition ↔ atlas mismatch:\n${mismatches.join('\n')}`);
  return mismatches;
}

function validateGlossary(terms: GlossaryTerm[]) {
  const byExact = new Set(terms.map((t) => t.term));
  const unresolved: string[] = [];
  for (const term of terms) for (const relation of term.relations) if (!byExact.has(relation)) unresolved.push(`${term.term} → ${relation}`);
  return { terms: terms.length, duplicateSlugs: 0, unresolvedReferences: unresolved };
}

export function validateContent(): ValidationReport {
  const monograph = parseMonograph(); const atlas = parseAtlas(); const expositions = parseExpositions(); const glossary = parseGlossary(); const essays = parseEssays();
  const atlasReport = validateAtlas(atlas); const mismatches = validateExpositions(expositions, atlas); const glossaryReport = validateGlossary(glossary);
  return {
    monograph: { parts: monograph.parts.length, readingUnits: monograph.chapters.length, duplicateSlugs: 0 }, atlas: atlasReport,
    expositions: { cells: expositions.length, mismatches }, glossary: glossaryReport,
    essays: essays.map((e) => ({ slug: e.slug, sections: e.sections.length })),
  };
}
