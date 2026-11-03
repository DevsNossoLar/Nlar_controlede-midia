import {
  ContratosRepository,
  LancamentoFinanceiroRepository,
  getParcelasContrato,
} from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { parseParcelaObservacao } from "@/lib/schemas/parcela-observacao.schema";
import { parseContratoIdParam } from "../../../_utils";
import { parseParcelaQuery } from "../_parcela-query";

const contratosRepository = new ContratosRepository();
const lancamentosRepository = new LancamentoFinanceiroRepository();

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json({ message: "Token de acesso invalido ou expirado." }, { status: 401 });
    }

    const contratoId = parseContratoIdParam((await params).id);
    const ref = parseParcelaQuery(new URL(request.url).searchParams);
    if (contratoId === null || !ref) {
      return Response.json({ message: "Referencia da parcela invalida." }, { status: 400 });
    }

    let observacao: string | null;
    try {
      observacao = parseParcelaObservacao(await request.json());
    } catch (error) {
      return Response.json(
        { message: error instanceof SyntaxError ? "JSON invalido." : (error as Error).message },
        { status: 400 },
      );
    }

    const contrato = await contratosRepository.findById(contratoId);
    if (!contrato) {
      return Response.json({ message: "Contrato nao encontrado." }, { status: 404 });
    }

    const numPrevisao = Number(contrato.numPrevisao);
    const codLoja = Number(contrato.codLoja);
    if (!Number.isFinite(numPrevisao) || numPrevisao <= 0 || !Number.isFinite(codLoja) || codLoja <= 0) {
      return Response.json({ message: "Previsao ou loja do contrato invalida." }, { status: 400 });
    }

    // Confere a parcela no ERP por SELECT e usa os valores do servidor.
    const parcelas = await getParcelasContrato(numPrevisao, codLoja);
    const parcela = parcelas.find((item) => item.origem === ref.origem && item.erpChave === ref.erpChave);
    if (!parcela) {
      return Response.json({ message: "Parcela nao encontrada neste contrato." }, { status: 404 });
    }

    // A gravacao ocorre somente na tabela propria do modulo, ao salvar na interface.
    const lancamento = await lancamentosRepository.findOrCreate({
      contratoId,
      origem: parcela.origem,
      erpChave: parcela.erpChave,
      numPrevisao: String(parcela.numPrevisao),
      codLoja: String(parcela.codLoja),
      valor: parcela.valorParcela,
      dataVencimento: parcela.vencimento,
      criadoPor: String(token.codFunc ?? ""),
    });
    await lancamentosRepository.updateObservacao(contratoId, lancamento.id, observacao);
    return Response.json({ observacao });
  } catch (error) {
    return Response.json(
      {
        message: "Erro ao salvar observacao da parcela.",
        error: error instanceof Error ? error.message : "erro desconhecido",
      },
      { status: 500 },
    );
  }
}
