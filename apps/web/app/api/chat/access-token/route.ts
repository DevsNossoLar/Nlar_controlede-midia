import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/utils/getValidAcessToken';

export async function GET() {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json(
      { erro: 'Sessão inválida ou expirada.' },
      { status: 401 }
    );
  }
  return NextResponse.json({ token });
}
