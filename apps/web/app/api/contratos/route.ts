import { ContratosRepository } from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import {
  parseCreateContrato,
  parseListContratosFilters,
} from "@/lib/schemas/contrato.schema";
import { enriquecerContrato, enriquecerContratosResult } from "./_utils";

const repository = new ContratosRepository();

function statusByMessage(message: string): number {
  return message.includes("invalido") || message.includes("obrigatorio") ? 400 : 500;
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
    const filters = parseListContratosFilters(url.searchParams);
    const result = await repository.list(filters);
    const enriched = await enriquecerContratosResult(result);

    return Response.json(enriched, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    return Response.json(
      { message: "Erro ao listar contratos.", error: message },
      { status: statusByMessage(message) },
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const bodyRecord = typeof body === "object" && body !== null ? body : {};
    const input = parseCreateContrato({
      ...bodyRecord,
      criadoPor:
        "criadoPor" in bodyRecord
          ? (bodyRecord as Record<string, unknown>).criadoPor
          : String(token.codFunc ?? ""),
    });

    const created = await repository.create(input);
    const enriched = await enriquecerContrato(created);

    return Response.json(enriched, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    return Response.json(
      { message: "Erro ao criar contrato.", error: message },
      { status: statusByMessage(message) },
    );
  }
}
