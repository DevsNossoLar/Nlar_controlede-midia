import { ContratosRepository } from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { enriquecerContrato, parseContratoIdParam } from "../../_utils";

const repository = new ContratosRepository();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_: Request, { params }: RouteContext) {
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

    const updated = await repository.close(contratoId);
    if (!updated) {
      return Response.json({ message: "Contrato nao encontrado." }, { status: 404 });
    }

    const enriched = await enriquecerContrato(updated);
    return Response.json(enriched, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    const status = message.includes("Contrato") ? 400 : 500;
    return Response.json(
      { message: "Erro ao encerrar contrato.", error: message },
      { status },
    );
  }
}
