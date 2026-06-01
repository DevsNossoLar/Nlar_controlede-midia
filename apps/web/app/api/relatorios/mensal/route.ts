import {
  CONTRATO_TIPOS,
  LancamentoFinanceiroRepository,
  calcularPeriodoMensal,
  listParcelasAbertasPorMes,
  listParcelasPagasPorMes,
  resumoPrevistoPorTipo,
} from "@repo/db";
import type {
  RelatorioMensalParcela,
  RelatorioMensalResumoTipo,
  RelatorioMensalResult,
  RelatorioMensalSituacao,
} from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { parseRelatorioMensalFilters } from "@/lib/schemas/relatorio-mensal.schema";
import type { TipoContrato } from "@/(usuarioLogado)/contratos/_types/contrato.type";

const lancamentosRepository = new LancamentoFinanceiroRepository();

type RelatorioMensalParcelaBase = Omit<RelatorioMensalParcela, "quantidadeAnexos">;

function statusByMessage(message: string): number {
  const lower = message.toLowerCase();
  if (lower.includes("invalido")) return 400;
  return 500;
}

function agruparPorTipo(
  parcelas: RelatorioMensalParcelaBase[],
  situacao: "ABERTO" | "PAGO",
): Map<TipoContrato, { valor: number; quantidade: number }> {
  const mapa = new Map<TipoContrato, { valor: number; quantidade: number }>();

  for (const parcela of parcelas) {
    if (parcela.situacao !== situacao) continue;
    const atual = mapa.get(parcela.tipoContrato) ?? { valor: 0, quantidade: 0 };
    mapa.set(parcela.tipoContrato, {
      valor: atual.valor + parcela.valorParcela,
      quantidade: atual.quantidade + 1,
    });
  }

  return mapa;
}

async function enriquecerQuantidadeAnexos(
  parcelas: RelatorioMensalParcelaBase[],
): Promise<RelatorioMensalParcela[]> {
  const contratoIds = [...new Set(parcelas.map((parcela) => parcela.contratoId))];
  const contagensPorContrato = new Map<number, Map<string, number>>();

  await Promise.all(
    contratoIds.map(async (contratoId) => {
      const contagens = await lancamentosRepository.countAnexosByContrato(contratoId);
      const mapaChaves = new Map(
        contagens.map((item) => [`${item.origem}:${item.erpChave}`, item.quantidade]),
      );
      contagensPorContrato.set(contratoId, mapaChaves);
    }),
  );

  return parcelas.map((parcela) => {
    const mapaChaves = contagensPorContrato.get(parcela.contratoId);
    return {
      ...parcela,
      quantidadeAnexos: mapaChaves?.get(`${parcela.situacao}:${parcela.erpChave}`) ?? 0,
    };
  });
}

function montarPorTipo(
  parcelas: RelatorioMensalParcelaBase[],
  previstoPorTipo: Awaited<ReturnType<typeof resumoPrevistoPorTipo>>,
): RelatorioMensalResumoTipo[] {
  const aPagarMap = agruparPorTipo(parcelas, "ABERTO");
  const pagoMap = agruparPorTipo(parcelas, "PAGO");
  const previstoMap = new Map(
    previstoPorTipo.map((item) => [item.tipoContrato, item]),
  );
  const tipos = new Set<TipoContrato>([
    ...CONTRATO_TIPOS,
    ...parcelas.map((parcela) => parcela.tipoContrato),
    ...previstoPorTipo.map((item) => item.tipoContrato),
  ]);

  return [...tipos]
    .map((tipoContrato) => {
      const aPagarInfo = aPagarMap.get(tipoContrato);
      const pagoInfo = pagoMap.get(tipoContrato);
      const previstoInfo = previstoMap.get(tipoContrato);

      return {
        tipoContrato,
        aPagar: aPagarInfo?.valor ?? 0,
        pago: pagoInfo?.valor ?? 0,
        previsto: previstoInfo?.previsto ?? 0,
        quantidadeParcelasAbertas: aPagarInfo?.quantidade ?? 0,
        quantidadeParcelasPagas: pagoInfo?.quantidade ?? 0,
        quantidadeContratos: previstoInfo?.quantidadeContratos ?? 0,
      };
    })
    .filter(
      (item) =>
        item.aPagar > 0 ||
        item.pago > 0 ||
        item.previsto > 0 ||
        item.quantidadeParcelasAbertas > 0 ||
        item.quantidadeParcelasPagas > 0 ||
        item.quantidadeContratos > 0,
    )
    .sort(
      (a, b) =>
        b.aPagar + b.pago + b.previsto - (a.aPagar + a.pago + a.previsto) ||
        b.previsto - a.previsto,
    );
}

function ordenarParcelas(parcelas: RelatorioMensalParcela[]): RelatorioMensalParcela[] {
  return [...parcelas].sort((a, b) => {
    const dataCmp = a.dataReferencia.localeCompare(b.dataReferencia);
    if (dataCmp !== 0) return dataCmp;
    return a.titulo.localeCompare(b.titulo);
  });
}

function filtrarParcelasPorSituacao(
  abertas: RelatorioMensalParcelaBase[],
  pagas: RelatorioMensalParcelaBase[],
  situacao: RelatorioMensalSituacao,
): RelatorioMensalParcelaBase[] {
  if (situacao === "aberto") return abertas;
  if (situacao === "pago") return pagas;
  return [...abertas, ...pagas];
}

export async function GET(request: Request) {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const filtros = parseRelatorioMensalFilters(url.searchParams);
    const { inicio, fim } = calcularPeriodoMensal(filtros.ano, filtros.mes);

    const dbFiltros = {
      ano: filtros.ano,
      mes: filtros.mes,
      codLoja: filtros.codLoja,
    };

    const [abertasBase, pagasBase, previstoPorTipo] = await Promise.all([
      listParcelasAbertasPorMes(dbFiltros),
      listParcelasPagasPorMes(dbFiltros),
      resumoPrevistoPorTipo(dbFiltros),
    ]);

    const todasParcelasBase = [...abertasBase, ...pagasBase];
    const porTipo = montarPorTipo(todasParcelasBase, previstoPorTipo);

    const parcelasBase = filtrarParcelasPorSituacao(
      abertasBase,
      pagasBase,
      filtros.situacao as RelatorioMensalSituacao,
    );
    const parcelas = ordenarParcelas(await enriquecerQuantidadeAnexos(parcelasBase));

    const abertas = abertasBase;
    const pagas = pagasBase;

    const totais = {
      aPagar: abertas.reduce((acc, parcela) => acc + parcela.valorParcela, 0),
      pago: pagas.reduce((acc, parcela) => acc + parcela.valorParcela, 0),
      previsto: previstoPorTipo.reduce((acc, item) => acc + item.previsto, 0),
      quantidadeParcelasAbertas: abertas.length,
      quantidadeParcelasPagas: pagas.length,
    };

    const result: RelatorioMensalResult = {
      periodo: {
        ano: filtros.ano,
        mes: filtros.mes,
        inicio,
        fim,
      },
      filtros: {
        codLoja: filtros.codLoja,
        situacao: filtros.situacao as RelatorioMensalSituacao,
      },
      totais,
      porTipo,
      parcelas,
    };

    return Response.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    return Response.json(
      { message: "Erro ao gerar relatorio mensal.", error: message },
      { status: statusByMessage(message) },
    );
  }
}
