export const SEARCH_MIN_TEXT_LENGTH = 2;
export const SEARCH_MIN_CODE_LENGTH = 1;

/** Aguarda o usuario parar de digitar antes de disparar a busca na API */
export const SEARCH_DEBOUNCE_MS = 500;

export function podeBuscar(termo: string): boolean {
  const query = termo.trim();
  if (!query) return false;
  if (/^\d+$/.test(query)) return query.length >= SEARCH_MIN_CODE_LENGTH;
  return query.length >= SEARCH_MIN_TEXT_LENGTH;
}

export function mensagemBuscaMinima(termo: string): string | null {
  const query = termo.trim();
  if (!query) return null;
  if (/^\d+$/.test(query)) {
    return query.length < SEARCH_MIN_CODE_LENGTH
      ? "Digite ao menos 1 digito do codigo."
      : null;
  }
  return query.length < SEARCH_MIN_TEXT_LENGTH
    ? "Digite ao menos 2 caracteres para buscar."
    : null;
}
