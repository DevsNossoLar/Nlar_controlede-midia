import {
  apenasDigitos,
  buscarFornecedores,
  ehBuscaPorDocumento,
  SEARCH_MIN_CODE_LENGTH,
  SEARCH_MIN_DOCUMENTO_LENGTH,
  SEARCH_MIN_TEXT_LENGTH,
} from '@repo/db';
import { tokenAtivo } from '@/utils/tokenAtivo';

type FornecedorRow = {
  codFor?: string | number | null;
  nomeFor?: string | null;
  nomeFantasia?: string | null;
  NomeFantasia?: string | null;
  CGC?: string | null;
};

type FornecedorResponse = {
  codFor: string;
  nomeFor: string | null;
  nomeFantasia: string | null;
  NomeFantasia: string | null;
  cgc: string | null;
};

function normalizarFornecedor(row: FornecedorRow): FornecedorResponse {
  const nomeFantasia = row.nomeFantasia ?? row.NomeFantasia ?? null;

  return {
    codFor: String(row.codFor ?? ''),
    nomeFor: row.nomeFor ?? null,
    nomeFantasia,
    NomeFantasia: nomeFantasia,
    cgc: row.CGC?.trim() || null,
  };
}

function parseBuscaFornecedor(searchParams: URLSearchParams): {
  params: { q?: string; codFor?: string; documento?: string };
  error?: string;
} {
  const documento = searchParams.get('documento')?.trim();
  const codFor = searchParams.get('codFor')?.trim();
  const q = searchParams.get('q')?.trim();

  if (documento) {
    if (apenasDigitos(documento).length < SEARCH_MIN_DOCUMENTO_LENGTH) {
      return { params: {}, error: 'Informe ao menos 11 digitos do CPF/CNPJ.' };
    }
    return { params: { documento } };
  }

  if (codFor) {
    if (codFor.length < SEARCH_MIN_CODE_LENGTH) {
      return { params: {}, error: 'Informe ao menos 1 digito do codigo do fornecedor.' };
    }
    return { params: { codFor } };
  }

  if (!q) {
    return { params: {}, error: 'Informe um termo de busca (minimo 2 caracteres).' };
  }

  if (ehBuscaPorDocumento(q)) {
    return { params: { documento: q } };
  }

  if (/^\d+$/.test(q)) {
    if (q.length < SEARCH_MIN_CODE_LENGTH) {
      return { params: {}, error: 'Informe ao menos 1 digito do codigo do fornecedor.' };
    }
    return { params: { codFor: q } };
  }

  if (q.length < SEARCH_MIN_TEXT_LENGTH) {
    return { params: {}, error: 'Informe ao menos 2 caracteres para buscar por nome.' };
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
    const parsed = parseBuscaFornecedor(url.searchParams);

    if (parsed.error) {
      return Response.json({ message: parsed.error }, { status: 400 });
    }

    const fornecedores = (await buscarFornecedores(parsed.params))
      .map(normalizarFornecedor)
      .filter((fornecedor) => fornecedor.codFor);

    return Response.json(fornecedores, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: 'Erro ao buscar fornecedores',
        error: error instanceof Error ? error.message : 'erro desconhecido',
      },
      { status: 500 },
    );
  }
}
