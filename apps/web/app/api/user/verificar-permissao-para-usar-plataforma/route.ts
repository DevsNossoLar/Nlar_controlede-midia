import { fazerRequisicaoServidor } from '@/utils/server';
import { readSecret } from '@/services/readSecret';

export async function GET() {
  const userUrl = readSecret('NLAR_USER', { required: true }).replace(/\/$/, '');
  const idService = readSecret('X_Service-id', { required: true });

  const url = `${userUrl}/services/verificated-permission-service`;

  return await fazerRequisicaoServidor(url, {
    method: 'GET',
    headers: {
      'x-service-id': idService,
    },
  });
}
