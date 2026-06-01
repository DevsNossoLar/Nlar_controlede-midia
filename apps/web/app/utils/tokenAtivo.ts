import { getValidAccessToken } from "./getValidAcessToken";
import { validarToken } from "./server";

interface TokenAtivoResponse {
  valido: boolean;
  codFunc: number | null;
}

export async function tokenAtivo(): Promise<TokenAtivoResponse> {
  const token = await getValidAccessToken();

  if (!token) {
    return { valido: false, codFunc: null };
  }

  const tokenValido = await validarToken(token);

  if (tokenValido === false) {
    return { valido: false, codFunc: null };
  }

  const codFunc = extrairCodFuncionario(token);

  if (codFunc === null) {
    return { valido: false, codFunc: null };
  }


  return {
    valido: true,
    codFunc,
  };
}

function extrairCodFuncionario(token: string): number | null {
  try {
    const [, payloadBase64] = token.split(".");

    if (!payloadBase64) {
      return null;
    }

    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf-8");

    const payload = JSON.parse(payloadJson) as {
      codFuncionario?: string | number;
      codFunc?: string | number;
      sub?: string | number;
    };

    const codFuncionario = Number(
      payload.codFuncionario ?? payload.codFunc ?? payload.sub
    );

    if (!Number.isFinite(codFuncionario) || codFuncionario <= 0) {
      return null;
    }

    return codFuncionario;
  } catch {
    return null;
  }
}