import {
  ContratosRepository,
  LancamentoFinanceiroAnexosRepository,
  LancamentoFinanceiroRepository,
  decodeParcelaRef,
} from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { parseCreateLancamentoFinanceiroAnexo } from "@/lib/schemas/lancamento-financeiro-anexo.schema";
import { parseContratoIdParam } from "../../../../_utils";

const contratosRepository = new ContratosRepository();
const lancamentosRepository = new LancamentoFinanceiroRepository();
const anexosRepository = new LancamentoFinanceiroAnexosRepository();

type RouteContext = {
  params: Promise<{ id: string; parcelaRef: string }>;
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
    criadoPor: anexo.criadoPor,
    criadoEm: anexo.criadoEm.toISOString(),
    atualizadoEm: anexo.atualizadoEm?.toISOString() ?? null,
  };
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

    const { id, parcelaRef } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const ref = decodeParcelaRef(decodeURIComponent(parcelaRef));
    if (!ref) {
      return Response.json({ message: "Referencia da parcela invalida." }, { status: 400 });
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

    const { id, parcelaRef } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const ref = decodeParcelaRef(decodeURIComponent(parcelaRef));
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
