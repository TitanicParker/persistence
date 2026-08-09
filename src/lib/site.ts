const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

export function publicationPath(path = ''): string {
  const normalized = path.replace(/^\/+/, '');
  return normalized ? `${base}${normalized}` : base;
}
