import { NextResponse } from "next/server";
import { getValidAccessToken } from "./getValidAcessToken";
import { readSecret } from '@/services/readSecret';

function pickStringField(obj: unknown, key: string): string | undefined {
  if (typeof obj !== 'object' || obj === null) return undefined;
  const v = (obj as Record<string, unknown>)[key];
  return typeof v === 'string' ? v : undefined;
}

/**
 * Helper para fazer requisições HTTP no servidor (API Routes)
 * 
 * Esta função é específica para uso em route.ts (Next.js Server Components)
 * - Adiciona token de autenticação automaticamente
 * - Trata erros de forma consistente
 * - Retorna NextResponse apropriadamente
 * 
 * @param url - URL completa do serviço externo
 * @param opcoes - Opções adicionais do fetch (method, body, headers extras, etc.)
 * @returns Promise com NextResponse contendo os dados ou erro
 * 
 * @example
 * ```typescript
 * // Em route.ts
 * export async function GET(req: NextRequest) {
 *   const url = `${process.env.SERVICE_DISPARO}/templates/whatsapp`;
 *   return await fazerRequisicaoServidor(url, { method: 'GET' });
 * }
 * ```
 */
export async function fazerRequisicaoServidor(url: string, opcoes?: RequestInit): Promise<NextResponse> {
  // Buscar token de autenticação
  const token = await getValidAccessToken();

  if (!token) {
    return NextResponse.json(
      { erro: "Token inválido ou expirado." },
      { status: 401 }
    );
  }

  try {
    const metodo = opcoes?.method || "GET";

    // Fazer requisição para o serviço externo
    const resposta = await fetch(url, {
      ...opcoes,
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(opcoes?.headers || {}),
      },
      cache: "no-store",
    });

    // Ler resposta como texto primeiro (para poder fazer parse manual se necessário)
    const texto = await resposta.text();

    // Tentar fazer parse do JSON
    let dados: unknown;
    try {
      dados = texto ? JSON.parse(texto) : null;
    } catch {
      // Se não conseguir fazer parse, usar o texto como está
      dados = texto;
    }

    // Se a resposta não foi OK, retornar erro
    if (!resposta.ok) {
      const mensagemErro =
        pickStringField(dados, 'erro') ||
        pickStringField(dados, 'message') ||
        pickStringField(dados, 'error') ||
        texto ||
        `HTTP ${resposta.status}`;

      return NextResponse.json(
        { erro: mensagemErro, detalhe: dados },
        { status: resposta.status }
      );
    }

    // Retornar resposta bem-sucedida
    return NextResponse.json(dados, { status: resposta.status });
  } catch (erro: unknown) {
    // Erro de rede ou outro erro inesperado
    console.error("❌ Erro ao fazer requisição no servidor:", { url }, erro);

    const mensagemErro = erro instanceof Error ? erro.message : "Erro interno no servidor.";
    return NextResponse.json({ erro: mensagemErro }, { status: 500 });
  }
}

/**
 * Versão simplificada que retorna apenas os dados (sem NextResponse)
 * Útil quando você precisa processar os dados antes de retornar
 * 
 * @param url - URL completa do serviço externo
 * @param opcoes - Opções adicionais do fetch
 * @returns Promise com os dados parseados
 * @throws Error se a requisição falhar
 */
export async function fazerRequisicaoServidorDados<T = unknown>(
  url: string,
  opcoes?: RequestInit
): Promise<T> {
  const token = await getValidAccessToken();

  if (!token) {
    throw new Error("Token inválido ou expirado.");
  }

  const resposta = await fetch(url, {
    ...opcoes,
    method: opcoes?.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opcoes?.headers || {}),
    },
    cache: "no-store",
  });

  const texto = await resposta.text();
  let dados: unknown;

  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = texto;
  }

  if (!resposta.ok) {
    const mensagem =
      pickStringField(dados, 'erro') ||
      pickStringField(dados, 'message') ||
      pickStringField(dados, 'error') ||
      texto ||
      `HTTP ${resposta.status}`;
    throw new Error(mensagem);
  }

  return dados as T;
}

/**
 * Versão que não requer token de autenticação
 * Útil para endpoints públicos como autenticação, registro, etc.
 * 
 * @param url - URL completa do serviço externo
 * @param opcoes - Opções adicionais do fetch
 * @returns Promise com os dados parseados
 * @throws Error se a requisição falhar
 * 
 * @example
 * ```typescript
 * // Em route.ts de autenticação
 * export async function POST(req: NextRequest) {
 *   const body = await req.json();
 *   const dados = await fazerRequisicaoServidorSemToken(
 *     `${process.env.SERVICE_AUTH}/autenticar`,
 *     { method: 'POST', body: JSON.stringify(body) }
 *   );
 *   // Processar dados e retornar...
 * }
 * ```
 */
export async function fazerRequisicaoServidorSemToken<T = unknown>(
  url: string,
  opcoes?: RequestInit
): Promise<T> {
  try {
    // Detectar se o body é ArrayBuffer (FormData) - nesse caso, não adicionar Content-Type
    // (o Content-Type com boundary será definido pelo fetch automaticamente)
    const isBinaryBody = opcoes?.body instanceof ArrayBuffer;

    const resposta = await fetch(url, {
      ...opcoes,
      method: opcoes?.method || "GET",
      headers: {
        // Só adicionar Content-Type se não for body binário (ArrayBuffer/FormData)
        ...(isBinaryBody ? {} : { "Content-Type": "application/json" }),
        ...(opcoes?.headers || {}),
      },
      cache: "no-store",
    });

    const texto = await resposta.text();
    let dados: unknown;

    try {
      dados = texto ? JSON.parse(texto) : null;
    } catch {
      dados = texto;
    }

    if (!resposta.ok) {
      const mensagem =
        pickStringField(dados, 'erro') ||
        pickStringField(dados, 'message') ||
        pickStringField(dados, 'error') ||
        texto ||
        `HTTP ${resposta.status}`;
      throw new Error(mensagem);
    }

    return dados as T;
  } catch (erro: unknown) {
    console.error("❌ Erro ao fazer requisição no servidor (sem token):", { url }, erro);
    throw erro;
  }
}

export async function validarToken(token:string): Promise<boolean> {

  const serviceAuth = readSecret('NLAR_AUTH', { required: true }).replace(/\/$/, '');

  const validarToken = await fetch(`${serviceAuth}/autenticar/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });

  if (!validarToken.ok) {
    return false;
  }

  return true;
}
