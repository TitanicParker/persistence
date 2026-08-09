import type { AtlasCell } from './types';
import { cleanInlineMarkdown, readSource, span } from './source';
import { assertUniqueSlugs, numberedSlug } from './slugs';

export const ATLAS_SOURCE = 'coordinate_forced_atlas.md';
const ALLOWED_STRENGTHS = new Set(['Near-determinate', 'Tightly constrained', 'Open realization']);

function splitTableRow(line: string): string[] {
  if (!line.trim().startsWith('|') || !line.trim().endsWith('|')) throw new Error(`Atlas malformed table row: ${line}`);
  const cells: string[] = [];
  let current = '';
  let escaped = false;
  for (const ch of line.trim().slice(1, -1)) {
    if (escaped) { current += ch; escaped = false; continue; }
    if (ch === '\\') { current += ch; escaped = true; continue; }
    if (ch === '|') { cells.push(current.trim()); current = ''; }
    else current += ch;
  }
  cells.push(current.trim());
  return cells;
}

export function parseAtlas(): AtlasCell[] {
  const { lines } = readSource(ATLAS_SOURCE);
  const heading = lines.findIndex((line) => line.trim() === '## The 54 Coordinate-Generated Forms');
  if (heading < 0) throw new Error('Atlas: missing 54-form table heading');
  const headerLine = lines.findIndex((line, i) => i > heading && line.startsWith('| # |'));
  if (headerLine < 0) throw new Error('Atlas: missing canonical table header');

  const records: AtlasCell[] = [];
  for (let i = headerLine + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (!line.trim().startsWith('|')) break;
    const cells = splitTableRow(line).map(cleanInlineMarkdown);
    if (cells.length !== 13) throw new Error(`Atlas line ${i + 1}: expected 13 columns, found ${cells.length}`);
    const number = Number(cells[0]);
    if (!Number.isInteger(number)) throw new Error(`Atlas line ${i + 1}: invalid cell number '${cells[0]}'`);
    const strength = cells[12];
    if (!ALLOWED_STRENGTHS.has(strength)) throw new Error(`Atlas cell ${number}: invalid constraint strength '${strength}'`);
    records.push({
      number,
      slug: numberedSlug(number, cells[3]),
      companionUtterance: cells[1],
      coordinateGeneratedForm: cells[2],
      canonicalCrystallization: cells[3],
      transformationPattern: cells[4],
      completionTopology: cells[5],
      persistenceMode: cells[6],
      generativeMovement: cells[7],
      examples: [cells[8], cells[9], cells[10]],
      coordinateForcedSentence: cells[11],
      constraintStrength: strength,
      source: span(ATLAS_SOURCE, i + 1, i + 1),
    });
  }
  assertUniqueSlugs(records, 'Atlas');
  return records;
}
