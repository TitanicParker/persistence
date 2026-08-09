import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(raw: string): string {
  return marked.parse(raw, { async: false }) as string;
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
