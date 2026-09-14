import { NextRequest, NextResponse } from 'next/server';
import { tokenAtivo } from '@/utils/tokenAtivo';
import { logger } from '@/lib/logger';
import { NotificacaoGlobalService } from '@/services/notificacao-global-service';

/** POST /api/notificacoes-globais/marcar-lida — grava leitura da última notificação no banco */
export async function POST(_request: NextRequest) {
  try {
    const token = await tokenAtivo();
    if (!token.valido || token.codFunc == null) {
      return NextResponse.json(
        { message: 'Token de acesso invalido ou expirado.' },
        { status: 401 },
      );
    }

    const body = await _request.json().catch(() => ({}));
    const notificacaoId = Number(body?.id);

    if (!Number.isInteger(notificacaoId) || notificacaoId <= 0) {
      return NextResponse.json({ success: true, ok: true, notificacaoId: null });
    }

    const result = await NotificacaoGlobalService.marcarComoLida(
      token.codFunc,
      notificacaoId,
    );
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    logger.error('Erro em POST /api/notificacoes-globais/marcar-lida:', error);
    return NextResponse.json(
      { message: 'Erro ao marcar notificação como lida' },
      { status: 500 },
    );
  }
}
