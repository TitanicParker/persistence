import { validateContent } from '../src/lib/content/validation';

try {
  const report = validateContent();
  console.log('Content validation passed');
  console.log(`Monograph: ${report.monograph.parts} parts; ${report.monograph.readingUnits} reading units; ${report.monograph.duplicateSlugs} duplicate slugs`);
  console.log(`Atlas: ${report.atlas.cells}/54 cells; ${report.atlas.tupleCoverage}/54 coordinate tuples; ${report.atlas.duplicateTuples} duplicate tuples; ${report.atlas.missingNumbers.length} missing numbers`);
  console.log(`Expositions: ${report.expositions.cells}/54 cells; ${report.expositions.mismatches.length} atlas mismatches`);
  console.log(`Glossary: ${report.glossary.terms} terms; ${report.glossary.duplicateSlugs} duplicate slugs; ${report.glossary.startingUnresolvedReferences} starting unresolved; ${report.glossary.resolvedReferences.length} safely normalized; ${report.glossary.unresolvedReferences.length} deliberately unresolved`);
  for (const [category, count] of Object.entries(report.glossary.unresolvedByCategory)) console.log(`  Glossary unresolved ${category}: ${count}`);
  for (const essay of report.essays) console.log(`Essay ${essay.slug}: ${essay.sections} sections`);
  if (report.glossary.resolvedReferences.length) {
    console.log('Glossary references safely normalized without alias guessing:');
    for (const ref of report.glossary.resolvedReferences) console.log(`  - ${ref}`);
  }
  if (report.glossary.unresolvedReferences.length) {
    console.log('Glossary unresolved explicit references (classified, not guessed):');
    for (const ref of report.glossary.unresolvedReferences) console.log(`  - ${ref}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
