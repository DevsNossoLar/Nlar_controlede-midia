import { NextRequest, NextResponse } from 'next/server';
import { tokenAtivo } from '@/utils/tokenAtivo';
import { logger } from '@/lib/logger';
import { NotificacaoGlobalService } from '@/services/notificacao-global-service';

/** GET /api/notificacoes-globais/estado — última notificação global e se o usuário já leu */
export async function GET(_request: NextRequest) {
  try {
    const token = await tokenAtivo();
    if (!token.valido || token.codFunc == null) {
      return NextResponse.json(
        { message: 'Token de acesso invalido ou expirado.' },
        { status: 401 },
      );
    }

    const idParam = _request.nextUrl.searchParams.get('id');
    const notificacaoId = Number(idParam);

    if (!idParam || !Number.isInteger(notificacaoId) || notificacaoId <= 0) {
      return NextResponse.json({
        temNotificacao: false,
        notificacao: null,
        lida: true,
      });
    }

    const estado = await NotificacaoGlobalService.getEstadoParaUsuario(
      token.codFunc,
      notificacaoId,
    );
    return NextResponse.json(estado);
  } catch (error) {
    logger.error('Erro em GET /api/notificacoes-globais/estado:', error);
    return NextResponse.json(
      { message: 'Erro ao consultar notificação global' },
      { status: 500 },
    );
  }
}
