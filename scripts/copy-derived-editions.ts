import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const editions = [
  ['constraint_grammar_laymans_edition.html', 'dist/layman/index.html'],
  ['constraint_grammar_vc_investment_memo.html', 'dist/venture/index.html'],
  ['constraint_grammar_if_mainstream.html', 'dist/mainstream/index.html'],
] as const;

for (const [source, destination] of editions) {
  const sourcePath = resolve(source);
  const destinationPath = resolve(destination);
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing derived edition source: ${source}`);
  }
  mkdirSync(dirname(destinationPath), { recursive: true });
  copyFileSync(sourcePath, destinationPath);
  console.log(`Published ${source} -> ${destination}`);
}
