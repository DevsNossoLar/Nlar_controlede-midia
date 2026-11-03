export const PARCELA_OBSERVACAO_MAX_LENGTH = 2000;

export function parseParcelaObservacao(body: unknown): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Corpo da requisicao invalido.");
  }

  const { observacao } = body as Record<string, unknown>;
  if (observacao !== null && typeof observacao !== "string") {
    throw new Error("Observacao invalida: informe um texto ou null.");
  }
  if (typeof observacao === "string" && observacao.length > PARCELA_OBSERVACAO_MAX_LENGTH) {
    throw new Error(`Observacao excede o limite de ${PARCELA_OBSERVACAO_MAX_LENGTH} caracteres.`);
  }
  return observacao?.trim() || null;
}
