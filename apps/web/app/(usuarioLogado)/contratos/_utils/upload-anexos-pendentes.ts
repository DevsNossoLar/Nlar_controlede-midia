import { enviarAnexoContrato } from "../_services/contrato-anexo.service";
import type { ContratoAnexoPendente } from "../_types/contrato-anexo.type";
import { fileToBase64 } from "./file-base64";

export async function uploadAnexosPendentes(
  contratoId: number,
  anexos: ContratoAnexoPendente[],
): Promise<void> {
  for (const anexo of anexos) {
    const base64 = await fileToBase64(anexo.file);

    await enviarAnexoContrato(contratoId, {
      tipo: anexo.tipo,
      nome_original: anexo.file.name,
      mime_type: anexo.file.type || "application/octet-stream",
      tamanho_bytes: anexo.file.size,
      arquivo_base64: base64,
    });
  }
}
