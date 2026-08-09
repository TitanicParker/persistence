import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  acknowledgementText,
  copyrightLine,
  permissionInvitation,
  personalStudyPermission,
  portableKnowledgeNotice,
  publicAccessAndReuse,
  rightsBoundaryNotice,
  rightsLead,
} from '../src/lib/rights';

const destination = resolve('dist/constraint-grammar-portable-knowledge-edition.txt');
const canonicalUrl = 'https://titanicparker.github.io/persistence/';
const repositoryUrl = 'https://github.com/TitanicParker/persistence';
const publicationVersion = '0.2.0';
const publicationDate = '9 August 2026';

const sources = [
  { label: 'MATURE MONOGRAPH', status: 'CANONICAL THEORY', file: 'constraint_grammar_of_completed_intelligibility_final_monograph.txt' },
  { label: '54-CELL STRUCTURAL ATLAS', status: 'CANONICAL STRUCTURAL ATLAS', file: 'coordinate_forced_atlas.md' },
  { label: 'FIFTY-FOUR PLAIN-LANGUAGE EXPOSITIONS', status: 'CANONICAL EXPLANATORY COMPANION', file: 'constraint_grammar_54_plain_language_expositions_final.txt' },
  { label: 'EXHAUSTIVE GLOSSARY AND TERMINOLOGICAL REFERENCE', status: 'AUTHORITATIVE GLOSSARY', file: 'constraint_grammar_exhaustive_glossary.md' },
  { label: 'INTELLECTUAL HISTORY', status: 'HISTORICAL RECONSTRUCTION', file: 'constraint_grammar_from_sentence_resolution_to_constraint_grammar_intellectual_transformation.md' },
  { label: 'ACADEMIC DISCIPLINARY POSITIONING', status: 'ACADEMIC POSITIONING', file: 'constraint_grammar_academic_disciplinary_positioning.md' },
] as const;

const derivedSources = [
  { label: 'LAYMAN’S EDITION', status: 'DERIVED EXPLANATORY ESSAY', file: 'constraint_grammar_laymans_edition.html' },
  { label: 'FIVE-YEAR-OLD EDITION', status: 'DERIVED EXPLANATORY ESSAY', file: 'constraint_grammar_five_year_old_edition.html' },
  { label: 'VENTURE EDITION / VC INVESTMENT MEMO', status: 'DERIVED STRATEGIC INTERPRETATION', file: 'constraint_grammar_vc_investment_memo.html' },
  { label: 'MAINSTREAM CONSEQUENCES ESSAY', status: 'DERIVED CONSEQUENCES ESSAY', file: 'constraint_grammar_if_mainstream.html' },
] as const;

function divider(title: string, status: string, source?: string): string {
  const lines = ['', '================================================================', title, `SOURCE STATUS: ${status}`];
  if (source) lines.push(`SOURCE FILE: ${source}`);
  lines.push('================================================================', rightsBoundaryNotice, '');
  return lines.join('\n');
}

function decodeEntities(text: string): string {
  return text.replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&#x27;/gi, "'")
    .replace(/&#x2019;/gi, '’').replace(/&#8217;/gi, '’').replace(/&#x2014;/gi, '—').replace(/&#8212;/gi, '—');
}

function htmlToText(html: string): string {
  const withoutNonContent = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '');
  const blockSeparated = withoutNonContent.replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(p|div|section|article|header|footer|nav|aside|main|li|h[1-6]|blockquote|tr|table)>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '- ').replace(/<h1\b[^>]*>/gi, '\n# ').replace(/<h2\b[^>]*>/gi, '\n## ')
    .replace(/<h3\b[^>]*>/gi, '\n### ').replace(/<[^>]+>/g, ' ');
  return decodeEntities(blockSeparated).replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function readText(file: string): string { return readFileSync(resolve(file), 'utf8').replace(/\r\n/g, '\n').trim(); }
function renderedMainText(file: string): string {
  const html = readText(file);
  return htmlToText(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html);
}

const rightsText = [copyrightLine, '', ...rightsLead, '', 'LIMITED PERSONAL-STUDY PERMISSION', ...personalStudyPermission,
  '', 'PERMISSION ENQUIRIES FOR BROADER USE', ...permissionInvitation, '', 'PUBLIC ACCESS AND REUSE', ...publicAccessAndReuse,
  '', 'ACKNOWLEDGEMENT', ...acknowledgementText].join('\n\n');

const introduction = [
  'CONSTRAINT GRAMMAR OF COMPLETED INTELLIGIBILITY', 'PORTABLE KNOWLEDGE EDITION', '',
  `Publication version: ${publicationVersion}`, `Publication date: ${publicationDate}`, `Canonical publication: ${canonicalUrl}`, `Repository: ${repositoryUrl}`, '',
  'PURPOSE OF THIS EDITION', ...portableKnowledgeNotice, '',
  'A SUGGESTED WAY TO USE THIS FILE WITH A GPT OR OTHER AI TOOL',
  'Upload this TXT file as reference material, then ask about the theory in whatever order helps you understand it. You can ask for explanations of unfamiliar terms, compare two coordinates, trace a concept through the monograph and glossary, test your own interpretation, ask for examples, or move between child-level, lay, and formal descriptions. You do not need to follow the website’s reading order.',
  'When an AI answer matters, ask it to identify which source section or document status it is relying on. The AI may explain or discuss the work, but the canonical source text in this file remains the governing reference.', '',
  'SOURCE HIERARCHY',
  '1. Canonical theory — mature monograph.', '2. Canonical structural atlas — 54 coordinate-generated positions.',
  '3. Canonical explanatory companion — 54 plain-language expositions.', '4. Authoritative glossary — mature terminology and distinctions.',
  '5. Supporting historical reconstruction and academic positioning.',
  '6. Research-status and provenance pages — editorial context about claims, evidence, versioning, and source hierarchy.',
  '7. Derived Five-Year-Old, Layman, Venture, and Mainstream essays — interpretations of the same framework, not substitute canonical sources.', '',
  'GOVERNING DISTINCTION', 'Coordinate-generated form → canonical crystallization → concrete manifestation.', '',
  'COPYRIGHT, RIGHTS & PERMISSIONS', rightsText,
].join('\n\n');

const parts: string[] = [introduction];
for (const source of sources) { parts.push(divider(source.label, source.status, source.file)); parts.push(readText(source.file)); }
parts.push(divider('RESEARCH STATUS AND CLAIMS BOUNDARY', 'EDITORIAL SYNTHESIS', 'generated from /research-status/'));
parts.push(renderedMainText('dist/research-status/index.html'));
parts.push(divider('ABOUT, PROVENANCE, AND CITATION GUIDANCE', 'PUBLICATION PROVENANCE', 'generated from /about/'));
parts.push(renderedMainText('dist/about/index.html'));
for (const source of derivedSources) { parts.push(divider(source.label, source.status, source.file)); parts.push(htmlToText(readText(source.file))); }
parts.push(['', '================================================================', 'END OF PORTABLE KNOWLEDGE EDITION', '================================================================', copyrightLine,
  'For any use beyond the limited personal-study permission stated at the beginning of this file, seek prior written permission from the copyright holder.',
  `Canonical publication: ${canonicalUrl}`, `Repository: ${repositoryUrl}`, ''].join('\n'));

const output = parts.join('\n').replace(/\n{4,}/g, '\n\n\n').trimEnd() + '\n';
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, output, 'utf8');
console.log(`Portable Knowledge Edition: ${output.split(/\s+/).filter(Boolean).length.toLocaleString()} words; ${Buffer.byteLength(output, 'utf8').toLocaleString()} bytes -> dist/constraint-grammar-portable-knowledge-edition.txt`);
