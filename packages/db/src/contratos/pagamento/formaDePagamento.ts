import { db } from '../../conexao/config';
import { dbConnection } from '../../conexao/dbConnection';

export type FormaDePagamento = {
  CodFormaPgto: number;
  DescricaoFormaPagamento: string;
};

export async function getFormasDePagamento() {
  await dbConnection();

  const query = db<FormaDePagamento>('FormaPagamento')
    .select('CodFormaPgto', 'DescricaoFormaPagamento')
    .where('Usar_PrevisaoCompra', 1)
    .whereIn('CodFormaPgto', [1, 4, 5, 76, 129])
    .orderBy('DescricaoFormaPagamento');

  return query;
}
