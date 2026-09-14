import { db, dbConnection } from '@repo/db';
import { logger } from '@/lib/logger';

export interface NotificacaoGlobalPayload {
  id: number;
  titulo: string;
  mensagem: string | null;
  dataCriacao: string;
}

export interface EstadoNotificacaoGlobal {
  temNotificacao: boolean;
  notificacao: NotificacaoGlobalPayload | null;
  lida: boolean;
}

const TABELA_NOTIFICACOES_GLOBAIS = 'SIM_Chamados_Notificacoes_Globais';
const TABELA_NOTIFICACOES_GLOBAIS_LEITURAS = 'SIM_Chamados_Notificacoes_Globais_Leituras';

const ESTADO_VAZIO: EstadoNotificacaoGlobal = {
  temNotificacao: false,
  notificacao: null,
  lida: true,
};

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const message = String((error as { message?: string }).message || '');
  const number = Number((error as { number?: number }).number);
  // 208 = Invalid object name
  return number === 208 || /Invalid object name/i.test(message);
}

function rowsOf<T>(result: unknown): T[] {
  if (Array.isArray(result)) {
    if (result.length > 0 && Array.isArray(result[0])) {
      return result[0] as T[];
    }
    if (
      result.length === 0 ||
      (typeof result[0] === 'object' && result[0] !== null && !Array.isArray(result[0]))
    ) {
      return result as T[];
    }
  }
  if (
    result &&
    typeof result === 'object' &&
    Array.isArray((result as { recordset?: unknown }).recordset)
  ) {
    return (result as { recordset: T[] }).recordset;
  }
  return [];
}

type SqlBinding = string | number | boolean | Date | null | Buffer;

async function queryRows<T>(sql: string, bindings: SqlBinding[] = []): Promise<T[]> {
  await dbConnection();
  const result = await db.raw(sql, bindings);
  return rowsOf<T>(result);
}

export class NotificacaoGlobalService {
  /**
   * Notificação global por ID e se o funcionário já registrou leitura.
   */
  static async getEstadoParaUsuario(
    codFunc: number,
    notificacaoId: number,
  ): Promise<EstadoNotificacaoGlobal> {
    try {
      const target = await queryRows<{
        id: number;
        titulo: string;
        mensagem: string | null;
        dataCriacao: unknown;
      }>(
        `
        SELECT
          ID AS id,
          Titulo AS titulo,
          Mensagem AS mensagem,
          DataCriacao AS dataCriacao
        FROM ${TABELA_NOTIFICACOES_GLOBAIS}
        WHERE ID = ?
      `,
        [notificacaoId],
      );

      if (!target.length) {
        return ESTADO_VAZIO;
      }

      const row = target[0]!;
      const readCheck = await queryRows<{ ok: number }>(
        `
          SELECT 1 AS ok
          FROM ${TABELA_NOTIFICACOES_GLOBAIS_LEITURAS}
          WHERE CodFunc = ? AND NotificacaoGlobalId = ?
        `,
        [codFunc, row.id],
      );

      const lida = readCheck.length > 0;
      const dataCriacao =
        row.dataCriacao instanceof Date
          ? row.dataCriacao.toISOString()
          : String(row.dataCriacao);

      return {
        temNotificacao: true,
        notificacao: {
          id: row.id,
          titulo: row.titulo,
          mensagem: row.mensagem ?? null,
          dataCriacao,
        },
        lida,
      };
    } catch (error) {
      if (isMissingTableError(error)) {
        logger.warn(
          'Tabelas de notificação global ausentes. Execute sql/sim-chamados-notificacoes-globais.sql',
          error,
        );
        return ESTADO_VAZIO;
      }
      throw error;
    }
  }

  /**
   * Registra leitura da notificação global informada para o funcionário (idempotente).
   */
  static async marcarComoLida(
    codFunc: number,
    notificacaoId: number,
  ): Promise<{ ok: boolean; notificacaoId: number | null }> {
    try {
      const target = await queryRows<{ id: number }>(
        `
        SELECT ID AS id
        FROM ${TABELA_NOTIFICACOES_GLOBAIS}
        WHERE ID = ?
      `,
        [notificacaoId],
      );

      if (!target.length) {
        return { ok: true, notificacaoId: null };
      }

      const existingNotificationId = target[0]!.id;

      await queryRows(
        `
          IF NOT EXISTS (
            SELECT 1 FROM ${TABELA_NOTIFICACOES_GLOBAIS_LEITURAS}
            WHERE CodFunc = ? AND NotificacaoGlobalId = ?
          )
          INSERT INTO ${TABELA_NOTIFICACOES_GLOBAIS_LEITURAS} (CodFunc, NotificacaoGlobalId)
          VALUES (?, ?)
        `,
        [codFunc, existingNotificationId, codFunc, existingNotificationId],
      );

      return { ok: true, notificacaoId: existingNotificationId };
    } catch (error) {
      if (isMissingTableError(error)) {
        logger.warn(
          'Tabelas de notificação global ausentes ao marcar leitura. Execute sql/sim-chamados-notificacoes-globais.sql',
          error,
        );
        return { ok: true, notificacaoId: null };
      }
      logger.error('Erro ao registrar leitura de notificação global:', error);
      throw error;
    }
  }
}
