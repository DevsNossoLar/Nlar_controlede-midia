import {
  contratoEnum,
  CONTRATO_TIPOS,
  normalizarTipoContrato,
  statusContratoEnum,
  type AtualizarContratoInput,
  type CriarContratoInput,
  type ListContratosFilters,
} from "@repo/db";

const TIPOS_CONTRATO_VALIDOS = new Set<string>(CONTRATO_TIPOS);
const STATUS_CONTRATO_VALIDOS = new Set<string>([
  ...Object.values(statusContratoEnum),
  "vencido",
]);
const ORDER_BY_VALIDOS = new Set<string>([
  "titulo",
  "dataInicio",
  "dataFim",
  "valorTotal",
  "createdAt",
]);
const ORDER_DIR_VALIDOS = new Set<string>(["asc", "desc"]);

function asRecord(body: unknown): Record<string, unknown> {
  if (typeof body !== "object" || body === null) {
    throw new Error("Body invalido.");
  }

  return body as Record<string, unknown>;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function optionalText(value: unknown, field: string): string | null | undefined {
  if (typeof value === "undefined") return undefined;
  if (value === null) return null;
  if (typeof value !== "string") throw new Error(`${field} invalido.`);
  const text = value.trim();
  return text ? text : null;
}

function requiredText(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} obrigatorio.`);
  }

  return value.trim();
}

function optionalNumber(value: unknown, field: string): number | null | undefined {
  if (typeof value === "undefined") return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${field} invalido.`);
  }

  return value;
}

function optionalInteger(value: unknown, field: string): number | null | undefined {
  if (typeof value === "undefined") return undefined;
  if (value === null || value === "") return null;

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${field} invalido.`);
  }

  return parsed;
}

function requiredPaymentCode(value: unknown, field: string): number {
  const parsed = optionalInteger(value, field);
  if (typeof parsed === "undefined" || parsed === null) {
    throw new Error(`${field} obrigatorio.`);
  }

  return parsed;
}

function optionalBoolean(value: unknown, field: string): boolean | undefined {
  if (typeof value === "undefined") return undefined;
  if (typeof value !== "boolean") throw new Error(`${field} invalido.`);
  return value;
}

function optionalDay(value: unknown): number | null | undefined {
  const parsed = optionalNumber(value, "diaVencimentoPadrao");
  if (typeof parsed === "undefined" || parsed === null) return parsed;

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 31) {
    throw new Error("diaVencimentoPadrao invalido.");
  }

  return parsed;
}

function parseTipoContrato(value: unknown): contratoEnum {
  if (typeof value === "undefined" || value === null || value === "") {
    return contratoEnum.DIVERSOS;
  }
  if (typeof value !== "string") {
    throw new Error("tipoContrato invalido.");
  }

  const tipo = normalizarTipoContrato(value);
  if (!tipo || !TIPOS_CONTRATO_VALIDOS.has(tipo)) {
    throw new Error("tipoContrato invalido.");
  }

  return tipo;
}

function parseStatusContrato(value: unknown): statusContratoEnum | undefined {
  if (typeof value === "undefined" || value === null || value === "") return undefined;
  if (typeof value !== "string" || !Object.values(statusContratoEnum).includes(value as statusContratoEnum)) {
    throw new Error("status invalido.");
  }

  return value as statusContratoEnum;
}

export function parseCreateContrato(body: unknown): CriarContratoInput {
  const data = asRecord(body);
  const dataInicio = data.dataInicio;
  const dataFim = optionalText(data.dataFim, "dataFim");

  if (!isIsoDate(dataInicio)) {
    throw new Error("dataInicio invalida.");
  }

  if (dataFim && !isIsoDate(dataFim)) {
    throw new Error("dataFim invalida.");
  }

  if (dataFim && dataFim < dataInicio) {
    throw new Error("dataFim nao pode ser menor que dataInicio.");
  }

  return {
    codFor: requiredText(data.codFor, "codFor"),
    codLoja: requiredText(data.codLoja, "codLoja"),
    titulo: requiredText(data.titulo, "titulo"),
    descricao: optionalText(data.descricao, "descricao") ?? null,
    tipoContrato: parseTipoContrato(data.tipoContrato),
    numPrevisao: optionalText(data.numPrevisao, "numPrevisao") ?? null,
    numCotacao: optionalText(data.numCotacao, "numCotacao") ?? null,
    valorTotal: optionalNumber(data.valorTotal, "valorTotal") ?? null,
    valorMensal: optionalNumber(data.valorMensal, "valorMensal") ?? null,
    codCondicaoPagamento: requiredPaymentCode(
      data.codCondicaoPagamento,
      "condicaoPagamento",
    ),
    codFormaPagamento: requiredPaymentCode(data.codFormaPagamento, "formaPagamento"),
    dataInicio,
    dataFim,
    recorrente: optionalBoolean(data.recorrente, "recorrente") ?? false,
    diaVencimentoPadrao: optionalDay(data.diaVencimentoPadrao) ?? null,
    observacao: optionalText(data.observacao, "observacao") ?? null,
    criadoPor: optionalText(data.criadoPor, "criadoPor") ?? null,
  };
}

export function parseUpdateContrato(body: unknown): AtualizarContratoInput {
  const data = asRecord(body);
  const input: AtualizarContratoInput = {};

  if (typeof data.codFor !== "undefined") input.codFor = requiredText(data.codFor, "codFor");
  if (typeof data.codLoja !== "undefined") input.codLoja = requiredText(data.codLoja, "codLoja");
  if (typeof data.titulo !== "undefined") input.titulo = requiredText(data.titulo, "titulo");
  if (typeof data.descricao !== "undefined") input.descricao = optionalText(data.descricao, "descricao") ?? null;
  if (typeof data.numPrevisao !== "undefined") input.numPrevisao = optionalText(data.numPrevisao, "numPrevisao") ?? null;
  if (typeof data.numCotacao !== "undefined") input.numCotacao = optionalText(data.numCotacao, "numCotacao") ?? null;
  if (typeof data.tipoContrato !== "undefined") input.tipoContrato = parseTipoContrato(data.tipoContrato);
  if (typeof data.valorTotal !== "undefined") input.valorTotal = optionalNumber(data.valorTotal, "valorTotal") ?? null;
  if (typeof data.valorMensal !== "undefined") input.valorMensal = optionalNumber(data.valorMensal, "valorMensal") ?? null;
  if (typeof data.codCondicaoPagamento !== "undefined") {
    input.codCondicaoPagamento = optionalInteger(
      data.codCondicaoPagamento,
      "condicaoPagamento",
    ) ?? null;
  }
  if (typeof data.codFormaPagamento !== "undefined") {
    input.codFormaPagamento = optionalInteger(data.codFormaPagamento, "formaPagamento") ?? null;
  }
  if (typeof data.dataInicio !== "undefined") {
    if (!isIsoDate(data.dataInicio)) throw new Error("dataInicio invalida.");
    input.dataInicio = data.dataInicio;
  }
  if (typeof data.dataFim !== "undefined") {
    const dataFim = optionalText(data.dataFim, "dataFim");
    if (dataFim && !isIsoDate(dataFim)) throw new Error("dataFim invalida.");
    input.dataFim = dataFim ?? null;
  }
  if (typeof data.recorrente !== "undefined") input.recorrente = optionalBoolean(data.recorrente, "recorrente");
  if (typeof data.diaVencimentoPadrao !== "undefined") input.diaVencimentoPadrao = optionalDay(data.diaVencimentoPadrao) ?? null;
  if (typeof data.observacao !== "undefined") input.observacao = optionalText(data.observacao, "observacao") ?? null;
  if (typeof data.status !== "undefined") input.status = parseStatusContrato(data.status);

  if (input.dataInicio && input.dataFim && input.dataFim < input.dataInicio) {
    throw new Error("dataFim nao pode ser menor que dataInicio.");
  }

  return input;
}

export function parseListContratosFilters(searchParams: URLSearchParams): ListContratosFilters {
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? searchParams.get("per_page") ?? "20");
  const status = searchParams.get("status") ?? undefined;
  const tipoContrato = searchParams.get("tipoContrato") ?? undefined;
  const orderBy = searchParams.get("orderBy") ?? undefined;
  const orderDir = searchParams.get("orderDir") ?? undefined;

  if (status && !STATUS_CONTRATO_VALIDOS.has(status)) throw new Error("status invalido.");
  if (tipoContrato && !TIPOS_CONTRATO_VALIDOS.has(tipoContrato)) throw new Error("tipoContrato invalido.");
  if (orderBy && !ORDER_BY_VALIDOS.has(orderBy)) throw new Error("orderBy invalido.");
  if (orderDir && !ORDER_DIR_VALIDOS.has(orderDir)) throw new Error("orderDir invalido.");

  return {
    codFor: searchParams.get("codFor") || undefined,
    codLoja: searchParams.get("codLoja") || undefined,
    tipoContrato: tipoContrato as ListContratosFilters["tipoContrato"],
    status: status as ListContratosFilters["status"],
    dataInicio: searchParams.get("dataInicio") || searchParams.get("data_inicio") || undefined,
    dataFim: searchParams.get("dataFim") || searchParams.get("data_fim") || undefined,
    search: searchParams.get("search") || searchParams.get("q") || undefined,
    orderBy: orderBy as ListContratosFilters["orderBy"],
    orderDir: orderDir as ListContratosFilters["orderDir"],
    page: Number.isFinite(page) ? page : 1,
    perPage: Number.isFinite(perPage) ? perPage : 20,
  };
}
