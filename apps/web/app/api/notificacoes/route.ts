import { tokenAtivo } from "@/utils/tokenAtivo";

export async function GET() {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    // Stub: este app ainda nao integra notificacoes de Chamados.
    return Response.json([], { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Erro ao listar notificacoes.",
        error: error instanceof Error ? error.message : "erro desconhecido",
      },
      { status: 500 },
    );
  }
}

export async function PUT() {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Erro ao atualizar notificacao.",
        error: error instanceof Error ? error.message : "erro desconhecido",
      },
      { status: 500 },
    );
  }
}
