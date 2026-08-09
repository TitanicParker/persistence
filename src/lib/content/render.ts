import { marked } from 'marked';
import { slugify } from './slugs';

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(raw: string): string {
  const rendered = marked.parse(raw, { async: false }) as string;
  const seen = new Map<string, number>();
  return rendered.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (_whole, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    const base = slugify(text) || 'section';
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
}

export function monographBodyToMarkdown(raw: string): string {
  const lines = raw.split('\n');
  if (/^\d+\.\s+/.test(lines[0] ?? '')) lines.shift();
  return lines.map((line) => {
    if (/^\d+\.\d+(?:\.\d+)?\s+/.test(line.trim())) return `### ${line.trim()}`;
    if (/^PART\s+[IVXLCDM]+$/.test(line.trim())) return `## ${line.trim()}`;
    return line;
  }).join('\n');
}

export function renderPlainBlocks(blocks: string[]): string {
  return blocks.map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`).join('\n');
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
