export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’'“”"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
