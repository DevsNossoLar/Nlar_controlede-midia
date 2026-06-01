export type ContratoAnexoTipo =
  | "contrato"
  | "proposta"
  | "aditivo"
  | "aprovacao"
  | "documento"
  | "outro";

export type ContratoAnexo = {
  id: number;
  contratoId: number;
  tipo: ContratoAnexoTipo;
  nomeOriginal: string;
  mimeType: string;
  tamanhoBytes: number | null;
  criadoPor: string | null;
  criadoEm: string;
  atualizadoEm: string | null;
};

export type ContratoAnexoCompleto = ContratoAnexo & {
  arquivoBase64: string;
};

export type UploadContratoAnexoPayload = {
  tipo?: ContratoAnexoTipo;
  nome_original: string;
  mime_type: string;
  tamanho_bytes: number;
  arquivo_base64: string;
};

export const CONTRATO_ANEXO_TIPO_LABEL: Record<ContratoAnexoTipo, string> = {
  contrato: "Contrato",
  proposta: "Proposta",
  aditivo: "Aditivo",
  aprovacao: "Aprovacao",
  documento: "Documento",
  outro: "Outro",
};

export const CONTRATO_ANEXO_TIPOS: ContratoAnexoTipo[] = [
  "contrato",
  "proposta",
  "aditivo",
  "aprovacao",
  "documento",
  "outro",
];

export const CONTRATO_ANEXO_MAX_ARQUIVOS = 10;
export const CONTRATO_ANEXO_MAX_BYTES = 5 * 1024 * 1024;

export type ContratoAnexoPendente = {
  id: string;
  file: File;
  tipo: ContratoAnexoTipo;
};
