import { db, dbConnection } from '@repo/db';
import { logger } from '@/lib/logger';
import { isChamadoConcluidoStatus } from '@/lib/chamado-status';

import {
  SQL_S_ORIGEM_CHAT,
  SQL_S_PRECISA_AVALIAR,
  SQL_S_PRECISA_AVALIAR_BLOQUEANTE,
} from '@/lib/chamado-avaliacao-sql';

export interface PendenteAvaliacao {
  id: number;
  assunto: string;
  dataSolicitacao: string;
  status: string;
  origemChat: boolean;
}

type PendenteAvaliacaoRow = Omit<
  PendenteAvaliacao,
  'dataSolicitacao' | 'origemChat'
> & {
  dataSolicitacao: unknown;
  origemChat?: number | boolean;
};

export interface RegistrarAvaliacaoInput {
  codFunc: number;
  solicitacaoId: number;
  foiAtendida: boolean;
  nota?: number | null;
  observacaoAtendimento?: string | null;
  motivoNaoAtendimento?: string | null;
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

export class AvaliacaoChamadoService {
  /**
   * Bloqueia novo chamado somente se houver avaliação pendente de chamado
   * que NÃO veio do chat (origem:chat).
   */
  static async temConcluidoSemAvaliacao(codFunc: number): Promise<boolean> {
    const rows = await queryRows<{ precisaAvaliar: number }>(
      `
        SELECT
          CASE
            WHEN EXISTS (
              SELECT 1
              FROM Nlar_Chamados_Solicitacoes AS s
              WHERE s.CodFunc = ?
                AND ${SQL_S_PRECISA_AVALIAR_BLOQUEANTE}
            )
            THEN 1
            ELSE 0
          END AS precisaAvaliar;
      `,
      [codFunc],
    );
    return Number(rows[0]?.precisaAvaliar) === 1;
  }

  /**
   * Chamados concluídos que exigem avaliação.
   * Por padrão retorna só os que bloqueiam novo chamado (exclui origem chat).
   */
  static async listarPendentes(
    codFunc: number,
    options?: { incluirOrigemChat?: boolean },
  ): Promise<PendenteAvaliacao[]> {
    const incluirOrigemChat = options?.incluirOrigemChat === true;
    const rows = await queryRows<PendenteAvaliacaoRow>(
      `
        SELECT
          s.ID AS id,
          s.Assunto AS assunto,
          s.DataSolicitacao AS dataSolicitacao,
          s.Status AS status,
          CASE
            WHEN ${SQL_S_ORIGEM_CHAT}
            THEN 1
            ELSE 0
          END AS origemChat
        FROM Nlar_Chamados_Solicitacoes s
        WHERE s.CodFunc = ?
          AND ${incluirOrigemChat ? SQL_S_PRECISA_AVALIAR : SQL_S_PRECISA_AVALIAR_BLOQUEANTE}
        ORDER BY s.ID DESC
      `,
      [codFunc],
    );

    return rows.map((row) => {
      const raw = row.dataSolicitacao;
      const dataSolicitacao =
        raw != null &&
        typeof raw === 'object' &&
        'getTime' in raw &&
        typeof (raw as Date).getTime === 'function'
          ? (raw as Date).toISOString()
          : String(row.dataSolicitacao);
      return {
        ...row,
        dataSolicitacao,
        origemChat: row.origemChat === true || row.origemChat === 1,
      };
    });
  }

  static async registrar(input: RegistrarAvaliacaoInput): Promise<{ id: number }> {
    const {
      codFunc,
      solicitacaoId,
      foiAtendida,
      nota,
      observacaoAtendimento,
      motivoNaoAtendimento,
    } = input;

    const chk = await queryRows<{
      ID: number;
      CodFunc: number;
      Status: string;
      DataConclusao: unknown;
    }>(
      `
        SELECT ID, CodFunc, Status, DataConclusao
        FROM Nlar_Chamados_Solicitacoes
        WHERE ID = ?
      `,
      [solicitacaoId],
    );

    if (!chk.length) {
      throw Object.assign(new Error('Solicitação não encontrada'), { statusCode: 404 });
    }

    const sol = chk[0]!;
    if (Number(sol.CodFunc) !== codFunc) {
      throw Object.assign(new Error('Sem permissão para avaliar este chamado'), { statusCode: 403 });
    }
    if (!isChamadoConcluidoStatus(sol.Status)) {
      throw Object.assign(new Error('Só é possível avaliar chamados concluídos'), { statusCode: 400 });
    }

    const dc = sol.DataConclusao;

    if (foiAtendida) {
      const n = nota != null ? Number(nota) : NaN;
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        throw Object.assign(new Error('Informe uma nota de 1 a 5 estrelas'), { statusCode: 400 });
      }
    } else {
      const m = (motivoNaoAtendimento || '').trim();
      if (m.length < 10) {
        throw Object.assign(
          new Error('Descreva o motivo com pelo menos 10 caracteres'),
          { statusCode: 400 },
        );
      }
    }

    /** Com várias linhas por solicitação: sempre INSERT; motivos e histórico não são sobrescritos. */
    if (foiAtendida) {
      if (dc != null && dc !== undefined) {
        const dup = await queryRows<{ x: number }>(
          `
            SELECT 1 AS x FROM Nlar_Chamados_Avaliacoes av
            WHERE av.SolicitacaoId = ?
              AND av.FoiAtendida = 1
              AND av.DataAvaliacao >= ?
          `,
          [solicitacaoId, dc instanceof Date ? dc : new Date(dc as string)],
        );
        if (dup.length) {
          throw Object.assign(
            new Error('Já existe avaliação positiva para esta conclusão do chamado'),
            { statusCode: 409 },
          );
        }
      } else {
        const dup = await queryRows<{ x: number }>(
          `
            SELECT 1 AS x FROM Nlar_Chamados_Avaliacoes av
            WHERE av.SolicitacaoId = ? AND av.FoiAtendida = 1
          `,
          [solicitacaoId],
        );
        if (dup.length) {
          throw Object.assign(
            new Error('Já existe avaliação positiva para este chamado'),
            { statusCode: 409 },
          );
        }
      }
    }

    const ins = await queryRows<{ id: number }>(
      `
        INSERT INTO Nlar_Chamados_Avaliacoes (
          SolicitacaoId, CodFunc, FoiAtendida, Nota, ObservacaoAtendimento, MotivoNaoAtendimento
        )
        OUTPUT INSERTED.ID AS id
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        solicitacaoId,
        codFunc,
        foiAtendida ? 1 : 0,
        foiAtendida ? (nota ?? null) : null,
        observacaoAtendimento ? String(observacaoAtendimento).trim() || null : null,
        !foiAtendida ? String(motivoNaoAtendimento).trim() : null,
      ],
    );

    const newId = ins[0]?.id;

    if (newId == null) {
      logger.error('Falha ao gravar avaliação — sem OUTPUT');
      throw Object.assign(new Error('Erro ao salvar avaliação'), { statusCode: 500 });
    }

    return { id: newId };
  }

  /**
   * Reabre chamado após avaliação negativa (FoiAtendida = 0).
   * Atualiza status para aberto e registra colunas de reabertura por avaliação.
   */
  static async reabrirAposAvaliacaoNegativa(
    codFunc: number,
    solicitacaoId: number,
  ): Promise<{ ok: true }> {
    const chk = await queryRows<{
      ID: number;
      Status: string;
      FoiAtendida: number | boolean | null;
    }>(
      `
        SELECT s.ID, s.Status, a.FoiAtendida
        FROM Nlar_Chamados_Solicitacoes s
        OUTER APPLY (
          SELECT TOP 1 av.FoiAtendida
          FROM Nlar_Chamados_Avaliacoes av
          WHERE av.SolicitacaoId = s.ID
          ORDER BY av.DataAvaliacao DESC, av.ID DESC
        ) a
        WHERE s.ID = ? AND s.CodFunc = ?
      `,
      [solicitacaoId, codFunc],
    );

    if (!chk.length) {
      throw Object.assign(new Error('Chamado ou avaliação não encontrada'), { statusCode: 404 });
    }

    const row = chk[0]!;
    if (row.FoiAtendida == null) {
      throw Object.assign(new Error('Nenhuma avaliação encontrada para este chamado'), {
        statusCode: 400,
      });
    }
    const foiAtendida = row.FoiAtendida === true || row.FoiAtendida === 1;
    if (foiAtendida) {
      throw Object.assign(new Error('Reabertura só é permitida após avaliação negativa'), {
        statusCode: 400,
      });
    }

    if (!isChamadoConcluidoStatus(row.Status)) {
      throw Object.assign(
        new Error('Este chamado não está concluído ou já foi reaberto'),
        { statusCode: 400 },
      );
    }

    await queryRows(
      `
        UPDATE Nlar_Chamados_Solicitacoes
        SET
          Status = N'reaberto',
          DataConclusao = NULL,
          DataReaberturaPorAvaliacao = GETDATE(),
          ReaberturasPorAvaliacaoQtd = ISNULL(ReaberturasPorAvaliacaoQtd, 0) + 1
        WHERE ID = ? AND CodFunc = ?
      `,
      [solicitacaoId, codFunc],
    );

    return { ok: true };
  }

  /**
   * Após avaliação negativa com motivo: usuário opta por não reabrir.
   * Atualiza a última avaliação negativa do fechamento atual para FoiAtendida = 1 e nota máxima (5),
   * liberando pendência (MotivoNaoAtendimento permanece para auditoria).
   */
  static async encerrarInsatisfacaoSemReabrir(
    codFunc: number,
    solicitacaoId: number,
  ): Promise<{ id: number }> {
    const chk = await queryRows<{
      ID: number;
      CodFunc: number;
      Status: string;
      DataConclusao: unknown;
    }>(
      `
        SELECT ID, CodFunc, Status, DataConclusao
        FROM Nlar_Chamados_Solicitacoes
        WHERE ID = ?
      `,
      [solicitacaoId],
    );

    if (!chk.length) {
      throw Object.assign(new Error('Solicitação não encontrada'), { statusCode: 404 });
    }

    const sol = chk[0]!;
    if (Number(sol.CodFunc) !== codFunc) {
      throw Object.assign(new Error('Sem permissão para esta solicitação'), { statusCode: 403 });
    }
    if (!isChamadoConcluidoStatus(sol.Status)) {
      throw Object.assign(
        new Error('Só é possível encerrar avaliação em chamados concluídos'),
        { statusCode: 400 },
      );
    }

    const dc = sol.DataConclusao;

    let dup: { x: number }[];
    if (dc != null && dc !== undefined) {
      dup = await queryRows<{ x: number }>(
        `
          SELECT 1 AS x FROM Nlar_Chamados_Avaliacoes av
          WHERE av.SolicitacaoId = ?
            AND av.FoiAtendida = 1
            AND av.DataAvaliacao >= ?
        `,
        [solicitacaoId, dc instanceof Date ? dc : new Date(dc as string)],
      );
    } else {
      dup = await queryRows<{ x: number }>(
        `
          SELECT 1 AS x FROM Nlar_Chamados_Avaliacoes av
          WHERE av.SolicitacaoId = ? AND av.FoiAtendida = 1
        `,
        [solicitacaoId],
      );
    }
    if (dup.length) {
      throw Object.assign(
        new Error('Esta avaliação já foi encerrada para o fechamento atual'),
        { statusCode: 409 },
      );
    }

    let upd: { id: number }[];
    if (dc != null && dc !== undefined) {
      upd = await queryRows<{ id: number }>(
        `
          UPDATE a
          SET
            a.FoiAtendida = 1,
            a.Nota = 5,
            a.DataAvaliacao = GETDATE()
          OUTPUT INSERTED.ID AS id
          FROM Nlar_Chamados_Avaliacoes a
          WHERE a.ID = (
            SELECT TOP 1 av.ID
            FROM Nlar_Chamados_Avaliacoes av
            WHERE av.SolicitacaoId = ?
              AND av.FoiAtendida = 0
              AND av.DataAvaliacao >= ?
            ORDER BY av.DataAvaliacao DESC, av.ID DESC
          )
        `,
        [solicitacaoId, dc instanceof Date ? dc : new Date(dc as string)],
      );
    } else {
      upd = await queryRows<{ id: number }>(
        `
          UPDATE a
          SET
            a.FoiAtendida = 1,
            a.Nota = 5,
            a.DataAvaliacao = GETDATE()
          OUTPUT INSERTED.ID AS id
          FROM Nlar_Chamados_Avaliacoes a
          WHERE a.ID = (
            SELECT TOP 1 av.ID
            FROM Nlar_Chamados_Avaliacoes av
            WHERE av.SolicitacaoId = ? AND av.FoiAtendida = 0
            ORDER BY av.DataAvaliacao DESC, av.ID DESC
          )
        `,
        [solicitacaoId],
      );
    }

    const id = upd[0]?.id;
    if (id == null) {
      throw Object.assign(
        new Error('Não há avaliação negativa recente para concluir sem reabertura'),
        { statusCode: 400 },
      );
    }

    return { id: Number(id) };
  }
}
