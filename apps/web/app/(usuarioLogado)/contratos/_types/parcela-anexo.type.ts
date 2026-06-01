export type ParcelaAnexoTipo = "comprovante" | "boleto" | "outro";

export type ParcelaAnexo = {
  id: number;
  lancamentoFinanceiroId: number;
  tipo: ParcelaAnexoTipo;
  nomeOriginal: string;
  mimeType: string;
  tamanhoBytes: number | null;
  criadoPor: string | null;
  criadoEm: string;
  atualizadoEm: string | null;
};

export type ParcelaAnexoCompleto = ParcelaAnexo & {
  arquivoBase64: string;
};

export type UploadParcelaAnexoPayload = {
  tipo?: ParcelaAnexoTipo;
  nome_original: string;
  mime_type: string;
  tamanho_bytes: number;
  arquivo_base64: string;
  valor: number;
  num_previsao?: string | null;
  cod_loja?: string | null;
  data_vencimento?: string | null;
};

export const PARCELA_ANEXO_TIPO_LABEL: Record<ParcelaAnexoTipo, string> = {
  comprovante: "Comprovante",
  boleto: "Boleto",
  outro: "Outro",
};

export const PARCELA_ANEXO_TIPOS: ParcelaAnexoTipo[] = ["comprovante", "boleto", "outro"];

export const PARCELA_ANEXO_MAX_ARQUIVOS = 10;
export const PARCELA_ANEXO_MAX_BYTES = 5 * 1024 * 1024;
