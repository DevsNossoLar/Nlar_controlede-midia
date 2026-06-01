import {
  CONTRATO_ANEXO_MAX_BYTES,
  CONTRATO_ANEXO_TIPOS,
  type ContratoAnexoTipo,
} from "@repo/db";

export type CreateContratoAnexoBody = {
  tipo?: ContratoAnexoTipo;
  nome_original: string;
  mime_type: string;
  tamanho_bytes?: number | null;
  arquivo_base64: string;
};

function isTipoAnexoValido(value: string): value is ContratoAnexoTipo {
  return (CONTRATO_ANEXO_TIPOS as readonly string[]).includes(value);
}

export function parseCreateContratoAnexo(body: unknown): CreateContratoAnexoBody {
  if (typeof body !== "object" || body === null) {
    throw new Error("Body invalido.");
  }

  const data = body as Record<string, unknown>;

  if (typeof data.nome_original !== "string" || !data.nome_original.trim()) {
    throw new Error("nome_original obrigatorio.");
  }

  if (typeof data.mime_type !== "string" || !data.mime_type.trim()) {
    throw new Error("mime_type obrigatorio.");
  }

  if (typeof data.arquivo_base64 !== "string" || !data.arquivo_base64.trim()) {
    throw new Error("arquivo_base64 obrigatorio.");
  }

  let tipo: ContratoAnexoTipo | undefined;
  if (typeof data.tipo !== "undefined" && data.tipo !== null && data.tipo !== "") {
    if (typeof data.tipo !== "string" || !isTipoAnexoValido(data.tipo)) {
      throw new Error("tipo de anexo invalido.");
    }
    tipo = data.tipo;
  }

  let tamanho_bytes: number | null | undefined;
  if (typeof data.tamanho_bytes !== "undefined") {
    if (data.tamanho_bytes === null || data.tamanho_bytes === "") {
      tamanho_bytes = null;
    } else if (typeof data.tamanho_bytes !== "number" || !Number.isFinite(data.tamanho_bytes)) {
      throw new Error("tamanho_bytes invalido.");
    } else {
      tamanho_bytes = data.tamanho_bytes;
      if (tamanho_bytes > CONTRATO_ANEXO_MAX_BYTES) {
        throw new Error("Arquivo excede o limite de 5MB.");
      }
    }
  }

  return {
    tipo,
    nome_original: data.nome_original.trim(),
    mime_type: data.mime_type.trim(),
    tamanho_bytes,
    arquivo_base64: data.arquivo_base64,
  };
}
