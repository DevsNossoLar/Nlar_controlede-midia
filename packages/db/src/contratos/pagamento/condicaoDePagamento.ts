import { db } from '../../conexao/config';
import { dbConnection } from '../../conexao/dbConnection';

export type CondicaoPagamentoPrazo = {
  CodCondicaoPgto: number;
  Descricao: string;
};

export async function getCondicoesPagamentoPrazo() {
  await dbConnection();

  const condicoes = await db<CondicaoPagamentoPrazo>(
    db.raw('CondicaoPagamento WITH (NOLOCK)')
  )
    .select('CodCondicaoPgto')
    .select(
      db.raw(`
        CASE 
          WHEN CodCondicaoPgto = 0 THEN 'À VISTA' 
          ELSE 'À PRAZO' 
        END AS Descricao
      `)
    )
    .where('Descontinuado', 0)
    .whereIn('CodCondicaoPgto', [0, 16])
    .orderBy('Descricao', 'asc');

  return condicoes;
}