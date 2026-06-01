import {
  LANCAMENTO_ANEXO_MAX_BYTES,
  LANCAMENTO_ANEXO_TIPOS,
  type LancamentoAnexoTipo,
} from "@repo/db";

export type CreateLancamentoFinanceiroAnexoBody = {
  tipo?: LancamentoAnexoTipo;
  nome_original: string;
  mime_type: string;
  tamanho_bytes?: number | null;
  arquivo_base64: string;
  valor?: number;
  num_previsao?: string | null;
  cod_loja?: string | null;
  data_vencimento?: string | null;
};

function isTipoAnexoValido(value: string): value is LancamentoAnexoTipo {
  return (LANCAMENTO_ANEXO_TIPOS as readonly string[]).includes(value);
}

export function parseCreateLancamentoFinanceiroAnexo(
  body: unknown,
): CreateLancamentoFinanceiroAnexoBody {
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

  let tipo: LancamentoAnexoTipo | undefined;
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
      if (tamanho_bytes > LANCAMENTO_ANEXO_MAX_BYTES) {
        throw new Error("Arquivo excede o limite de 5MB.");
      }
    }
  }

  let valor: number | undefined;
  if (typeof data.valor !== "undefined" && data.valor !== null && data.valor !== "") {
    if (typeof data.valor !== "number" || !Number.isFinite(data.valor)) {
      throw new Error("valor invalido.");
    }
    valor = data.valor;
  }

  let num_previsao: string | null | undefined;
  if (typeof data.num_previsao !== "undefined") {
    num_previsao =
      data.num_previsao === null || data.num_previsao === ""
        ? null
        : String(data.num_previsao);
  }

  let cod_loja: string | null | undefined;
  if (typeof data.cod_loja !== "undefined") {
    cod_loja =
      data.cod_loja === null || data.cod_loja === "" ? null : String(data.cod_loja);
  }

  let data_vencimento: string | null | undefined;
  if (typeof data.data_vencimento !== "undefined") {
    data_vencimento =
      data.data_vencimento === null || data.data_vencimento === ""
        ? null
        : String(data.data_vencimento);
  }

  return {
    tipo,
    nome_original: data.nome_original.trim(),
    mime_type: data.mime_type.trim(),
    tamanho_bytes,
    arquivo_base64: data.arquivo_base64,
    valor,
    num_previsao,
    cod_loja,
    data_vencimento,
  };
}
