import {
  LancamentoFinanceiroAnexosRepository,
  LancamentoFinanceiroRepository,
  decodeParcelaRef,
} from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { parseContratoIdParam } from "../../../../../_utils";

const lancamentosRepository = new LancamentoFinanceiroRepository();
const anexosRepository = new LancamentoFinanceiroAnexosRepository();

type RouteContext = {
  params: Promise<{ id: string; parcelaRef: string; anexoId: string }>;
};

function statusByMessage(message: string): number {
  const lower = message.toLowerCase();
  if (lower.includes("nao encontrado")) return 404;
  return 500;
}

async function resolverLancamentoId(
  contratoId: number,
  parcelaRefEncoded: string,
): Promise<number | null> {
  const ref = decodeParcelaRef(decodeURIComponent(parcelaRefEncoded));
  if (!ref) return null;

  const lancamento = await lancamentosRepository.findByParcela(
    contratoId,
    ref.origem,
    ref.erpChave,
  );

  return lancamento?.id ?? null;
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

    const { id, parcelaRef, anexoId } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const lancamentoId = await resolverLancamentoId(contratoId, parcelaRef);
    if (lancamentoId === null) {
      return Response.json({ message: "Parcela nao encontrada." }, { status: 404 });
    }

    const anexo = await anexosRepository.findById(contratoId, lancamentoId, anexoId);

    if (!anexo) {
      return Response.json({ message: "Anexo nao encontrado." }, { status: 404 });
    }

    return Response.json(
      {
        id: anexo.id,
        lancamentoFinanceiroId: anexo.lancamentoFinanceiroId,
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

    const { id, parcelaRef, anexoId } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const lancamentoId = await resolverLancamentoId(contratoId, parcelaRef);
    if (lancamentoId === null) {
      return Response.json({ message: "Parcela nao encontrada." }, { status: 404 });
    }

    const removed = await anexosRepository.delete(contratoId, lancamentoId, anexoId);

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
