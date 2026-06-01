// app/api/me/route.ts
import { fazerRequisicaoServidor } from '@/utils/server';
import { readSecret } from '@/services/readSecret';

export async function GET() {
  const serviceUser = readSecret('NLAR_USER', { required: true });
  return await fazerRequisicaoServidor(`${serviceUser}/users/me`, { method: 'GET' });
}