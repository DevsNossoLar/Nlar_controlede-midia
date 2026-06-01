import { ContratoAnexosRepository, ContratosRepository } from "@repo/db";
import { tokenAtivo } from "@/utils/tokenAtivo";
import { parseCreateContratoAnexo } from "@/lib/schemas/contrato-anexo.schema";
import { parseContratoIdParam } from "../../_utils";

const contratosRepository = new ContratosRepository();
const anexosRepository = new ContratoAnexosRepository();

type RouteContext = {
  params: Promise<{ id: string }>;
};

function statusByMessage(message: string): number {
  const lower = message.toLowerCase();
  if (lower.includes("nao encontrado")) return 404;
  if (
    lower.includes("invalido") ||
    lower.includes("obrigatorio") ||
    lower.includes("limite") ||
    lower.includes("excede")
  ) {
    return 400;
  }
  return 500;
}

function serializeAnexo(anexo: {
  id: number;
  contratoId: number;
  tipo: string;
  nomeOriginal: string;
  mimeType: string;
  tamanhoBytes: number | null;
  criadoPor: string | null;
  criadoEm: Date;
  atualizadoEm: Date | null;
}) {
  return {
    id: anexo.id,
    contratoId: anexo.contratoId,
    tipo: anexo.tipo,
    nomeOriginal: anexo.nomeOriginal,
    mimeType: anexo.mimeType,
    tamanhoBytes: anexo.tamanhoBytes,
    criadoPor: anexo.criadoPor,
    criadoEm: anexo.criadoEm.toISOString(),
    atualizadoEm: anexo.atualizadoEm?.toISOString() ?? null,
  };
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

    const contrato = await contratosRepository.findById(contratoId);
    if (!contrato) {
      return Response.json({ message: "Contrato nao encontrado." }, { status: 404 });
    }

    const anexos = await anexosRepository.listByContratoId(contratoId);
    return Response.json(anexos.map(serializeAnexo), { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Erro ao listar anexos do contrato.",
        error: error instanceof Error ? error.message : "erro desconhecido",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: RouteContext) {
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
    const parsed = parseCreateContratoAnexo(body);

    const created = await anexosRepository.create({
      contratoId,
      tipo: parsed.tipo,
      nomeOriginal: parsed.nome_original,
      mimeType: parsed.mime_type,
      tamanhoBytes: parsed.tamanho_bytes,
      arquivoBase64: parsed.arquivo_base64,
      criadoPor: String(token.codFunc ?? ""),
    });

    return Response.json(serializeAnexo(created), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    return Response.json(
      { message: "Erro ao enviar anexo.", error: message },
      { status: statusByMessage(message) },
    );
  }
}
