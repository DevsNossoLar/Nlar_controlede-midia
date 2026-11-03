export const SEARCH_RESULT_LIMIT = 50;

export const SEARCH_MIN_TEXT_LENGTH = 2;

export const SEARCH_MIN_CODE_LENGTH = 1;

/** CPF tem 11 digitos; abaixo disso a busca numerica e tratada como codigo. */
export const SEARCH_MIN_DOCUMENTO_LENGTH = 11;

export function apenasDigitos(value: string): string {
  return value.replace(/\D/g, '');
}

/** O ERP pode gravar o documento sem os zeros a esquerda (ou o usuario digitar sem eles). */
export function documentoSemZerosAEsquerda(value: string): string {
  return apenasDigitos(value).replace(/^0+/, '');
}

/** Aceita CPF/CNPJ com ou sem mascara (pontos, traco, barra). */
export function ehBuscaPorDocumento(value: string): boolean {
  const termo = value.trim();
  if (!/^[\d.\-/\s]+$/.test(termo)) return false;
  return apenasDigitos(termo).length >= SEARCH_MIN_DOCUMENTO_LENGTH;
}
