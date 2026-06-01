import {
  ContratosRepository,
  LancamentoFinanceiroRepository,
  getParcelasContrato,
  type Parcela,
} from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { parseContratoIdParam } from "../../_utils";

const repository = new ContratosRepository();
const lancamentosRepository = new LancamentoFinanceiroRepository();

type RouteContext = {
  params: Promise<{ id: string }>;
};

function serializarVencimento(value: Date | string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function normalizarParcela(parcela: Parcela) {
  return {
    tipoParcela: parcela.tipoParcela,
    origem: parcela.origem,
    numPrevisao: parcela.numPrevisao,
    codLoja: parcela.codLoja,
    valorParcela: parcela.valorParcela,
    vencimento: serializarVencimento(parcela.vencimento),
    erpChave: parcela.erpChave,
    quantidadeAnexos: 0,
  };
}

function parseNumeroPositivo(value: string | null | undefined, label: string): number | null {
  if (!value?.trim()) return null;
  const numero = Number(value.trim());
  if (!Number.isFinite(numero) || numero <= 0) {
    throw new Error(`${label} invalido.`);
  }
  return numero;
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

    const { id } = await params;
    const contratoId = parseContratoIdParam(id);
    if (contratoId === null) {
      return Response.json({ message: "Id do contrato invalido." }, { status: 400 });
    }

    const contrato = await repository.findById(contratoId);
    if (!contrato) {
      return Response.json({ message: "Contrato nao encontrado." }, { status: 404 });
    }

    const numPrevisao = parseNumeroPositivo(contrato.numPrevisao, "Numero de previsao");
    const codLoja = parseNumeroPositivo(contrato.codLoja, "Codigo da loja");

    if (numPrevisao === null) {
      return Response.json(
        { message: "Contrato sem numero de previsao para consultar parcelas." },
        { status: 400 },
      );
    }

    if (codLoja === null) {
      return Response.json(
        { message: "Contrato sem loja valida para consultar parcelas." },
        { status: 400 },
      );
    }

    const [parcelasRaw, contagens] = await Promise.all([
      getParcelasContrato(numPrevisao, codLoja),
      lancamentosRepository.countAnexosByContrato(contratoId),
    ]);

    const contagensPorChave = new Map(
      contagens.map((item) => [`${item.origem}:${item.erpChave}`, item.quantidade]),
    );

    const parcelas = parcelasRaw.map((parcela) => {
      const base = normalizarParcela(parcela);
      const chave = `${parcela.origem}:${parcela.erpChave}`;
      return {
        ...base,
        quantidadeAnexos: contagensPorChave.get(chave) ?? 0,
      };
    });

    return Response.json(parcelas, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    const status = message.includes("invalido") ? 400 : 500;

    return Response.json(
      { message: "Erro ao buscar parcelas do contrato.", error: message },
      { status },
    );
  }
}
