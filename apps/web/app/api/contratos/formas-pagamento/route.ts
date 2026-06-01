import { getFormasDePagamento } from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";

type FormaPagamentoRow = {
  CodFormaPgto?: string | number | null;
  DescricaoFormaPagamento?: string | null;
};

function normalizarFormaPagamento(row: FormaPagamentoRow) {
  return {
    codFormaPagamento: String(row.CodFormaPgto ?? ""),
    descricao: row.DescricaoFormaPagamento ?? "",
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

    const formas = (await getFormasDePagamento())
      .map(normalizarFormaPagamento)
      .filter((forma) => forma.codFormaPagamento);

    return Response.json(formas, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Erro ao buscar formas de pagamento.",
        error: error instanceof Error ? error.message : "erro desconhecido",
      },
      { status: 500 },
    );
  }
}
