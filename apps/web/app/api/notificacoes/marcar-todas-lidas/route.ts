import { tokenAtivo } from "@/utils/tokenAtivo";

export async function POST() {
  try {
    const token = await tokenAtivo();
    if (!token.valido) {
      return Response.json(
        { message: "Token de acesso invalido ou expirado." },
        { status: 401 },
      );
    }

    // Stub: este app ainda nao integra notificacoes de Chamados.
    return Response.json({ ok: true, rowsAffected: 0 }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Erro ao marcar notificacoes como lidas.",
        error: error instanceof Error ? error.message : "erro desconhecido",
      },
      { status: 500 },
    );
  }
}
