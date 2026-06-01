const RAW_BASE = '/controle-de-midias';

/** Prefixa basePath para fetch e href. Não use com router.push/replace — o Next já aplica o basePath. */
export function withBasePath(path: string): string {
  const base = RAW_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  if (base && (p === base || p.startsWith(`${base}/`))) return p;
  return base ? `${base}${p}` : p;
}