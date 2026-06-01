import { getCondicoesPagamentoPrazo } from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";

type CondicaoPagamentoRow = {
  CodCondicaoPgto?: string | number | null;
  Descricao?: string | null;
};

function normalizarCondicaoPagamento(row: CondicaoPagamentoRow) {
  return {
    codCondicaoPagamento: String(row.CodCondicaoPgto ?? ""),
    descricao: row.Descricao ?? "",
  };
}

export async function GET() {
  try {
    const token = await tokenAtivo();

    if (token.valido === false) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    const condicoes = (await getCondicoesPagamentoPrazo())
      .map(normalizarCondicaoPagamento)
      .filter((condicao) => condicao.codCondicaoPagamento);

    return Response.json(condicoes, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Erro ao buscar condicoes de pagamento.",
        error: error instanceof Error ? error.message : "erro desconhecido",
      },
      { status: 500 },
    );
  }
}
