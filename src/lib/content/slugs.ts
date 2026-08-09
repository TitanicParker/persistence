export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’'“”"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EXPLICIT_GLOSSARY_SLUGS = new Map<string, string>([
  ['Opening\u0000Primitive', 'opening-transformation-pattern'],
  ['opening\u0000Historical', 'opening-historical-phase'],
]);

export function glossarySlug(term: string, preferredStatus: string): string {
  return EXPLICIT_GLOSSARY_SLUGS.get(`${term}\u0000${preferredStatus}`) ?? slugify(term);
}

export function numberedSlug(number: number, label: string): string {
  return `${String(number).padStart(2, '0')}-${slugify(label)}`;
}

export function assertUniqueSlugs(items: { slug: string }[], label: string): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) throw new Error(`${label}: duplicate slug: ${item.slug}`);
    seen.add(item.slug);
  }
}
