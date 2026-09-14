/**
 * Predicado T-SQL para a linha de solicitação `s` estar concluída.
 * Usar apenas em queries que já têm alias `s` em Nlar_Chamados_Solicitacoes.
 */
export const SQL_S_STATUS_CONCLUIDO = `(
  LOWER(LTRIM(RTRIM(ISNULL(s.Status, N'')))) = N'concluido'
  OR s.Status = N'Concluído'
)`;

/**
 * Concluído e ainda “pendente”: falta avaliação POSITIVA (FoiAtendida = 1) para o fechamento atual.
 * Avaliação negativa (0) não encerra a pendência. Não é “todo concluído” — só os que ainda não tiveram positiva no ciclo.
 * Alias da solicitação: `s`.
 */
export const SQL_S_PRECISA_AVALIAR = `(
  ${SQL_S_STATUS_CONCLUIDO}
  AND (
    (
      s.DataConclusao IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM Nlar_Chamados_Avaliacoes av
        WHERE av.SolicitacaoId = s.ID
          AND av.FoiAtendida = 1
          AND av.DataAvaliacao >= s.DataConclusao
      )
    )
    OR (
      s.DataConclusao IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM Nlar_Chamados_Avaliacoes av
        WHERE av.SolicitacaoId = s.ID
          AND av.FoiAtendida = 1
      )
    )
  )
)`;

/**
 * Chamado marcado como criado pelo chat em ObservacoesAutorizacao.
 * Alias da solicitação: `s`.
 */
export const SQL_S_ORIGEM_CHAT = `(
  LOWER(ISNULL(s.ObservacoesAutorizacao, N'')) LIKE N'%origem:chat%'
)`;

/**
 * Pendência que bloqueia abertura de novo chamado: precisa avaliar e NÃO veio do chat.
 * Alias da solicitação: `s`.
 */
export const SQL_S_PRECISA_AVALIAR_BLOQUEANTE = `(
  ${SQL_S_PRECISA_AVALIAR}
  AND NOT ${SQL_S_ORIGEM_CHAT}
)`;
