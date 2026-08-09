import type { ContentBlock, Exposition } from './types';
import { readSource, span } from './source';
import { numberedSlug } from './slugs';

export const EXPOSITIONS_SOURCE = 'constraint_grammar_54_plain_language_expositions_final.txt';

function required(line: string | undefined, prefix: string, cell: number): string {
  if (!line?.startsWith(prefix)) throw new Error(`Expositions cell ${cell}: expected '${prefix}'`);
  return line.slice(prefix.length).trim().replace(/^"|"$/g, '');
}

export function parseExpositions(): Exposition[] {
  const { lines } = readSource(EXPOSITIONS_SOURCE);
  const starts: { number: number; index: number }[] = [];
  lines.forEach((line, index) => {
    const match = /^CELL\s+(\d+)\s*$/.exec(line.trim());
    if (match) starts.push({ number: Number(match[1]), index });
  });
  if (!starts.length) throw new Error('Expositions: no CELL boundaries found');

  return starts.map((start, idx) => {
    const endIndex = idx + 1 < starts.length ? starts[idx + 1].index - 1 : lines.length - 1;
    let p = start.index + 1;
    while (p <= endIndex && !lines[p].trim()) p++;
    const coordinate = lines[p]?.trim().split('/').map((v) => v.trim());
    if (!coordinate || coordinate.length !== 3) throw new Error(`Expositions cell ${start.number}: malformed coordinate triple`);
    p++;
    while (p <= endIndex && !lines[p].trim()) p++;
    const generated = required(lines[p], 'Coordinate-generated form:', start.number); p++;
    while (p <= endIndex && !lines[p].trim()) p++;
    const canonical = required(lines[p], 'Canonical crystallization:', start.number); p++;
    while (p <= endIndex && !lines[p].trim()) p++;
    const utterance = required(lines[p], 'Companion utterance:', start.number); p++;
    while (p <= endIndex && !lines[p].trim()) p++;
    const strength = required(lines[p], 'Constraint strength:', start.number); p++;
    while (p <= endIndex && !lines[p].trim()) p++;

    const bodyStart = p;
    const rawLines = lines.slice(bodyStart, endIndex + 1);
    while (rawLines.length && !rawLines[rawLines.length - 1].trim()) rawLines.pop();
    const blocks: ContentBlock[] = [];
    let blockStart = 0;
    for (let i = 0; i <= rawLines.length; i++) {
      if (i === rawLines.length || !rawLines[i].trim()) {
        if (i > blockStart) {
          blocks.push({
            raw: rawLines.slice(blockStart, i).join('\n'),
            source: span(EXPOSITIONS_SOURCE, bodyStart + blockStart + 1, bodyStart + i),
          });
        }
        blockStart = i + 1;
      }
    }

    return {
      number: start.number,
      slug: numberedSlug(start.number, canonical),
      transformationPattern: coordinate[0],
      completionTopology: coordinate[1],
      persistenceMode: coordinate[2],
      coordinateGeneratedForm: generated,
      canonicalCrystallization: canonical,
      companionUtterance: utterance,
      constraintStrength: strength,
      body: blocks,
      rawBody: rawLines.join('\n'),
      source: span(EXPOSITIONS_SOURCE, start.index + 1, endIndex + 1),
    };
  });
}
