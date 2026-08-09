import fs from 'node:fs';
import path from 'node:path';
import type { SourceSpan } from './types';

export const ROOT = process.cwd();

export function readSource(file: string): { text: string; lines: string[] } {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) throw new Error(`Missing canonical source: ${file}`);
  const text = fs.readFileSync(full, 'utf8').replace(/\r\n?/g, '\n');
  return { text, lines: text.split('\n') };
}

export function span(pathname: string, startLine: number, endLine: number): SourceSpan {
  return { path: pathname, startLine, endLine };
}

export function cleanInlineMarkdown(value: string): string {
  return value.trim().replace(/^\*\*(.*)\*\*$/s, '$1').trim();
}
