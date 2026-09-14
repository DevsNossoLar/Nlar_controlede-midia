import {
  ContratosRepository,
  LancamentoFinanceiroAnexosRepository,
  LancamentoFinanceiroRepository,
} from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { parseCreateLancamentoFinanceiroAnexo } from "@/lib/schemas/lancamento-financeiro-anexo.schema";
import { parseContratoIdParam } from "../../../_utils";
import { parseParcelaQuery, type ParcelaQueryRef } from "../_parcela-query";

const contratosRepository = new ContratosRepository();
const lancamentosRepository = new LancamentoFinanceiroRepository();
const anexosRepository = new LancamentoFinanceiroAnexosRepository();

type RouteContext = {
  params: Promise<{ id: string }>;
};

function statusByMessage(message: string): number {
  const lower = message.toLowerCase();
  if (lower.includes("nao encontrado")) return 404;
  if (
    lower.includes("invalido") ||
    lower.includes("obrigatorio") ||
    lower.includes("limite") ||
    lower.includes("excede")
  ) {
    return 400;
  }
  return 500;
}

function serializeAnexo(anexo: {
  id: number;
  lancamentoFinanceiroId: number;
  tipo: string;
  nomeOriginal: string;
  mimeType: string;
  tamanhoBytes: number | null;
  numeroNfe: string | null;
  criadoPor: string | null;
  criadoEm: Date;
  atualizadoEm: Date | null;
}) {
  return {
    id: anexo.id,
    lancamentoFinanceiroId: anexo.lancamentoFinanceiroId,
    tipo: anexo.tipo,
    nomeOriginal: anexo.nomeOriginal,
    mimeType: anexo.mimeType,
    tamanhoBytes: anexo.tamanhoBytes,
    numeroNfe: anexo.numeroNfe,
    criadoPor: anexo.criadoPor,
    criadoEm: anexo.criadoEm.toISOString(),
    atualizadoEm: anexo.atualizadoEm?.toISOString() ?? null,
  };
}

async function resolverLancamentoId(
  contratoId: number,
  ref: ParcelaQueryRef,
): Promise<number | null> {
  const lancamento = await lancamentosRepository.findByParcela(
    contratoId,
    ref.origem,
    ref.erpChave,
  );

  return lancamento?.id ?? null;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const url = new URL(request.url);
    const ref = parseParcelaQuery(url.searchParams);
    if (!ref) {
      return Response.json({ message: "Referencia da parcela invalida." }, { status: 400 });
    }

    const anexoId = url.searchParams.get("anexoId")?.trim();

    if (anexoId) {
      const lancamentoId = await resolverLancamentoId(contratoId, ref);
      if (lancamentoId === null) {
        return Response.json({ message: "Parcela nao encontrada." }, { status: 404 });
      }

      const anexo = await anexosRepository.findById(contratoId, lancamentoId, anexoId);
      if (!anexo) {
        return Response.json({ message: "Anexo nao encontrado." }, { status: 404 });
      }

      return Response.json(
        {
          ...serializeAnexo(anexo),
          arquivoBase64: anexo.arquivoBase64,
        },
        { status: 200 },
      );
    }

    const contrato = await contratosRepository.findById(contratoId);
    if (!contrato) {
      return Response.json({ message: "Contrato nao encontrado." }, { status: 404 });
    }

    const lancamento = await lancamentosRepository.findByParcela(
      contratoId,
      ref.origem,
      ref.erpChave,
    );

    if (!lancamento) {
      return Response.json([], { status: 200 });
    }

    const anexos = await anexosRepository.listByLancamentoId(contratoId, lancamento.id);
    return Response.json(anexos.map(serializeAnexo), { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Erro ao listar anexos da parcela.",
        error: error instanceof Error ? error.message : "erro desconhecido",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const url = new URL(request.url);
    const ref = parseParcelaQuery(url.searchParams);
    if (!ref) {
      return Response.json({ message: "Referencia da parcela invalida." }, { status: 400 });
    }

    const contrato = await contratosRepository.findById(contratoId);
    if (!contrato) {
      return Response.json({ message: "Contrato nao encontrado." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = parseCreateLancamentoFinanceiroAnexo(body);

    let lancamento = await lancamentosRepository.findByParcela(
      contratoId,
      ref.origem,
      ref.erpChave,
    );

    if (!lancamento) {
      const valor = parsed.valor;
      if (valor === undefined || !Number.isFinite(valor)) {
        return Response.json(
          { message: "valor obrigatorio para registrar a parcela no primeiro anexo." },
          { status: 400 },
        );
      }

      lancamento = await lancamentosRepository.findOrCreate({
        contratoId,
        origem: ref.origem,
        erpChave: ref.erpChave,
        numPrevisao: parsed.num_previsao ?? contrato.numPrevisao,
        codLoja: parsed.cod_loja ?? contrato.codLoja,
        valor,
        dataVencimento: parsed.data_vencimento,
        criadoPor: String(token.codFunc ?? ""),
      });
    }

    const created = await anexosRepository.create({
      lancamentoFinanceiroId: lancamento.id,
      contratoId,
      tipo: parsed.tipo,
      nomeOriginal: parsed.nome_original,
      mimeType: parsed.mime_type,
      tamanhoBytes: parsed.tamanho_bytes,
      arquivoBase64: parsed.arquivo_base64,
      numeroNfe: parsed.numero_nfe,
      criadoPor: String(token.codFunc ?? ""),
    });

    return Response.json(serializeAnexo(created), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    return Response.json(
      { message: "Erro ao enviar anexo da parcela.", error: message },
      { status: statusByMessage(message) },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const url = new URL(request.url);
    const ref = parseParcelaQuery(url.searchParams);
    if (!ref) {
      return Response.json({ message: "Referencia da parcela invalida." }, { status: 400 });
    }

    const anexoId = url.searchParams.get("anexoId")?.trim();
    if (!anexoId) {
      return Response.json({ message: "anexoId obrigatorio." }, { status: 400 });
    }

    const lancamentoId = await resolverLancamentoId(contratoId, ref);
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
