import {
  buscarLojas,
  SEARCH_MIN_CODE_LENGTH,
  SEARCH_MIN_TEXT_LENGTH,
} from '@repo/db';
import { tokenAtivo } from '@/utils/tokenAtivo';

type LojaRow = {
  codLoja?: string | number | null;
  empresa?: string | null;
};

type LojaResponse = {
  codLoja: string;
  empresa: string | null;
};

function normalizarLoja(row: LojaRow): LojaResponse {
  return {
    codLoja: String(row.codLoja ?? ''),
    empresa: row.empresa ?? null,
  };
}

function parseBuscaLoja(searchParams: URLSearchParams): {
  params: { q?: string; codLoja?: string };
  error?: string;
} {
  const codLoja = searchParams.get('codLoja')?.trim();
  const q = searchParams.get('q')?.trim();

  if (codLoja) {
    if (codLoja.length < SEARCH_MIN_CODE_LENGTH) {
      return { params: {}, error: 'Informe ao menos 1 digito do codigo da loja.' };
    }
    return { params: { codLoja } };
  }

  if (!q) {
    return { params: {}, error: 'Informe um termo de busca (minimo 2 caracteres).' };
  }

  if (/^\d+$/.test(q)) {
    if (q.length < SEARCH_MIN_CODE_LENGTH) {
      return { params: {}, error: 'Informe ao menos 1 digito do codigo da loja.' };
    }
    return { params: { codLoja: q } };
  }

  if (q.length < SEARCH_MIN_TEXT_LENGTH) {
    return { params: {}, error: 'Informe ao menos 2 caracteres para buscar por empresa.' };
  }

  return { params: { q } };
}

export async function GET(request: Request) {
  try {
    const token = await tokenAtivo();

    if (token.valido === false) {
      return Response.json(
        { message: 'Token de acesso invalido ou expirado.' },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const parsed = parseBuscaLoja(url.searchParams);

    if (parsed.error) {
      return Response.json({ message: parsed.error }, { status: 400 });
    }

    const lojas = (await buscarLojas(parsed.params))
      .map(normalizarLoja)
      .filter((loja) => loja.codLoja);

    return Response.json(lojas, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: 'Erro ao buscar lojas',
        error: error instanceof Error ? error.message : 'erro desconhecido',
      },
      { status: 500 },
    );
  }
}
