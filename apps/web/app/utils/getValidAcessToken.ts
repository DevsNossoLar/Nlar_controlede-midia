import 'server-only';

import { cookies } from 'next/headers';
import { readSecret } from '@/services/readSecret';

function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    const payloadBase64 = parts[1];

    if (!payloadBase64) return true;

    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf-8')
    ) as { exp?: number };

    if (!payload?.exp) return true;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds + 30;
  } catch {
    return true;
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (token && !isJwtExpired(token)) return token;
  if (!refreshToken) return null;

  const serviceAuth = readSecret('NLAR_AUTH', { required: true }).replace(/\/$/, '');

  try {
    const refreshRes = await fetch(`${serviceAuth}/autenticar/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: 'no-store',
    });

    if (!refreshRes.ok) return null;

    const data = await refreshRes.json();
    return typeof data?.access_token === 'string' ? data.access_token : null;
  } catch (err: unknown) {
    console.error('❌ Falha ao chamar refresh no SERVICE_AUTH:', serviceAuth, err);
    return null;
  }
}