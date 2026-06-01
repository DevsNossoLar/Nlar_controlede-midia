import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readSecret } from '@/services/readSecret';

const BASE_PATH = '/';

function getLoginServiceUrl(): string {
  const url = readSecret('NLAR_HOMEPAGE', { required: false }).trim();
  return url || BASE_PATH;
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const serviceAuth = readSecret('NLAR_AUTH', { required: true }).replace(/\/$/, '');

    const response = await fetch(`${serviceAuth}/autenticar/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  /** Evita “pingue-pongue”: login → portal → sem permissão → /acesso-negado → middleware manda de volta ao login com a mesma URL do app. */
  if (pathname.endsWith('/acesso-negado')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!token && !refreshToken) {
    const loginUrl = getLoginServiceUrl();

    return NextResponse.redirect(
      loginUrl.startsWith('http')
        ? loginUrl
        : new URL(loginUrl, request.url).toString()
    );
  }

  if (!token && refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken);

    if (newAccessToken) {
      const response = NextResponse.next();
      const cookieSecure = request.nextUrl.protocol === 'https:';

      response.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 15,
        path: BASE_PATH,
        sameSite: 'lax',
        secure: cookieSecure,
      });

      return response;
    }

    const loginUrl = getLoginServiceUrl();
    const redirectUrl = loginUrl.startsWith('http')
      ? loginUrl
      : new URL(loginUrl, request.url).toString();

    const loginResponse = NextResponse.redirect(redirectUrl);
    loginResponse.cookies.delete('refresh_token');
    loginResponse.cookies.delete('access_token');

    return loginResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};