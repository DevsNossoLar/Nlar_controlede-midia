import { ContratoAnexosRepository } from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { parseContratoIdParam } from "../../../_utils";

const anexosRepository = new ContratoAnexosRepository();

type RouteContext = {
  params: Promise<{ id: string; anexoId: string }>;
};

function statusByMessage(message: string): number {
  const lower = message.toLowerCase();
  if (lower.includes("nao encontrado")) return 404;
  return 500;
}

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    const { id, anexoId } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const anexo = await anexosRepository.findById(contratoId, anexoId);

    if (!anexo) {
      return Response.json({ message: "Anexo nao encontrado." }, { status: 404 });
    }

    return Response.json(
      {
        id: anexo.id,
        contratoId: anexo.contratoId,
        tipo: anexo.tipo,
        nomeOriginal: anexo.nomeOriginal,
        mimeType: anexo.mimeType,
        tamanhoBytes: anexo.tamanhoBytes,
        arquivoBase64: anexo.arquivoBase64,
        criadoPor: anexo.criadoPor,
        criadoEm: anexo.criadoEm.toISOString(),
        atualizadoEm: anexo.atualizadoEm?.toISOString() ?? null,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    return Response.json(
      { message: "Erro ao buscar anexo.", error: message },
      { status: statusByMessage(message) },
    );
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    const { id, anexoId } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const removed = await anexosRepository.delete(contratoId, anexoId);

    if (!removed) {
      return Response.json({ message: "Anexo nao encontrado." }, { status: 404 });
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    return Response.json(
      { message: "Erro ao remover anexo.", error: message },
      { status: statusByMessage(message) },
    );
  }
}
