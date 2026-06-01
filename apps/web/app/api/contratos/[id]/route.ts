import { ContratosRepository } from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { parseUpdateContrato } from "@/lib/schemas/contrato.schema";
import { enriquecerContrato, parseContratoIdParam } from "../_utils";

const repository = new ContratosRepository();

type RouteContext = {
  params: Promise<{ id: string }>;
};

function statusByMessage(message: string): number {
  return message.includes("invalido") || message.includes("obrigatorio") ? 400 : 500;
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

    const enriched = await enriquecerContrato(contrato);
    return Response.json(enriched, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Erro ao buscar contrato.",
        error: error instanceof Error ? error.message : "erro desconhecido",
      },
      { status: 500 },
    );
  }
}

async function updateContrato(request: Request, { params }: RouteContext) {
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

    const body = await request.json();
    const input = parseUpdateContrato(body);
    const updated = await repository.update(contratoId, input);

    if (!updated) {
      return Response.json({ message: "Contrato nao encontrado." }, { status: 404 });
    }

    const enriched = await enriquecerContrato(updated);
    return Response.json(enriched, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    return Response.json(
      { message: "Erro ao atualizar contrato.", error: message },
      { status: statusByMessage(message) },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  return updateContrato(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return updateContrato(request, context);
}
