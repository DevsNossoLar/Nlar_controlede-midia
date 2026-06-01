export function normalizarCodigo(value: string): string {
  return value.trim();
}

export function codigosEquivalentes(a: string, b: string): boolean {
  const left = normalizarCodigo(a);
  const right = normalizarCodigo(b);
  if (!left || !right) return false;
  if (left === right) return true;

  if (/^\d+$/.test(left) && /^\d+$/.test(right)) {
    return Number(left) === Number(right);
  }

  return false;
}

export function manterCacheOpcoes<T extends { codLoja: string }>(
  cache: Map<string, T>,
  options: T[],
): void {
  for (const option of options) {
    cache.set(normalizarCodigo(option.codLoja), option);
  }
}

export function manterCacheOpcoesFornecedor<T extends { codFor: string }>(
  cache: Map<string, T>,
  options: T[],
): void {
  for (const option of options) {
    cache.set(normalizarCodigo(option.codFor), option);
  }
}
