export type RelatorioMensalSituacao = "aberto" | "pago" | "ambos";

export type RelatorioMensalQueryParams = {
  ano: number;
  mes: number;
  codLoja: string | null;
  situacao: RelatorioMensalSituacao;
};

const SITUACOES_VALIDAS = new Set<RelatorioMensalSituacao>(["aberto", "pago", "ambos"]);

function parsePositiveInt(value: string | null, field: string): number | null {
  if (!value?.trim()) return null;
  const numero = Number(value.trim());
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new Error(`${field} invalido.`);
  }
  return numero;
}

export function parseRelatorioMensalFilters(
  params: URLSearchParams,
): RelatorioMensalQueryParams {
  const agora = new Date();
  const anoDefault = agora.getFullYear();
  const mesDefault = agora.getMonth() + 1;

  const ano = parsePositiveInt(params.get("ano"), "Ano") ?? anoDefault;
  const mes = parsePositiveInt(params.get("mes"), "Mes") ?? mesDefault;

  if (mes > 12) {
    throw new Error("Mes invalido.");
  }

  const codLojaRaw = params.get("codLoja")?.trim();
  const codLoja = codLojaRaw ? codLojaRaw : null;

  const situacaoRaw = (params.get("situacao")?.trim().toLowerCase() ?? "aberto") as RelatorioMensalSituacao;
  if (!SITUACOES_VALIDAS.has(situacaoRaw)) {
    throw new Error("Situacao invalida.");
  }

  return { ano, mes, codLoja, situacao: situacaoRaw };
}
