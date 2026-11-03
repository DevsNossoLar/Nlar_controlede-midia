export const SEARCH_MIN_TEXT_LENGTH = 2;
export const SEARCH_MIN_CODE_LENGTH = 1;
export const SEARCH_MIN_DOCUMENTO_LENGTH = 11;

/** Aguarda o usuario parar de digitar antes de disparar a busca na API */
export const SEARCH_DEBOUNCE_MS = 500;

export function apenasDigitos(value: string): string {
  return value.replace(/\D/g, "");
}

/** O ERP pode gravar o documento sem os zeros a esquerda (ou o usuario digitar sem eles). */
export function documentoSemZerosAEsquerda(value: string): string {
  return apenasDigitos(value).replace(/^0+/, "");
}

/** CPF/CNPJ com ou sem mascara; abaixo de 11 digitos a busca numerica e por codigo. */
export function ehBuscaPorDocumento(termo: string): boolean {
  const query = termo.trim();
  if (!/^[\d.\-/\s]+$/.test(query)) return false;
  return apenasDigitos(query).length >= SEARCH_MIN_DOCUMENTO_LENGTH;
}

export function podeBuscar(termo: string): boolean {
  const query = termo.trim();
  if (!query) return false;
  if (ehBuscaPorDocumento(query)) return true;
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
