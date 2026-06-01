import { db } from '../../conexao/config';
import { dbConnection } from '../../conexao/dbConnection';
import type { ParcelaOrigem } from '../lancamentos/types';

/** ERP (contasapagar_tab, PrevisaoCompraBaixas, ENTRADAS, Fornecedores): somente SELECT — ver shared/erp-readonly.ts */

export type Parcela = {
  tipoParcela: ParcelaOrigem;
  numPrevisao: number;
  codLoja: number;
  valorParcela: number;
  vencimento: string | null;
  erpChave: string;
  origem: ParcelaOrigem;
};

type ParcelaRow = {
  TipoParcela?: string;
  tipoParcela?: string;
  NumPrevisao?: number | string;
  numPrevisao?: number | string;
  CodLoja?: number | string;
  codLoja?: number | string;
  ValorParcela?: number | string;
  valorParcela?: number | string;
  Vencimento?: Date | string | null;
  vencimento?: Date | string | null;
  erpChave?: string;
  ErpChave?: string;
  origem?: string;
  Origem?: string;
};

function serializarVencimento(value: Date | string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function normalizarParcela(row: ParcelaRow): Parcela {
  const tipoParcela = String(row.TipoParcela ?? row.tipoParcela ?? '') as ParcelaOrigem;
  const origem = (row.origem ?? row.Origem ?? tipoParcela) as ParcelaOrigem;

  return {
    tipoParcela,
    numPrevisao: Number(row.NumPrevisao ?? row.numPrevisao),
    codLoja: Number(row.CodLoja ?? row.codLoja),
    valorParcela: Number(row.ValorParcela ?? row.valorParcela),
    vencimento: serializarVencimento(row.Vencimento ?? row.vencimento),
    erpChave: String(row.erpChave ?? row.ErpChave ?? ''),
    origem,
  };
}

export async function getParcelasContrato(numPrevisao: number, codLoja: number): Promise<Parcela[]> {
  await dbConnection();

  const parcelasAbertas = db('contasapagar_tab as CAP')
    .withSchema('dbo')
    .select([
      db.raw("'ABERTO' AS TipoParcela"),
      db.raw("'ABERTO' AS origem"),
      'CAP.NumPrevisao',
      'CAP.CodLoja',
      db.raw('CAP.ValorDoc AS ValorParcela'),
      'CAP.Vencimento',
      db.raw(
        "CONCAT('ABERTO:', CAP.COD_ENTRADA, ':', CONVERT(VARCHAR(10), CAP.Vencimento, 23)) AS erpChave",
      ),
    ])
    .leftJoin('ENTRADAS as E', 'E.Cod_Entrada', 'CAP.COD_ENTRADA')
    .leftJoin('Fornecedores as F', 'F.CodFor', 'CAP.CodFor')
    .where('CAP.NumPrevisao', numPrevisao)
    .andWhere('CAP.CodLoja', codLoja);

  const parcelasPagas = db('PrevisaoCompraBaixas as PCB')
    .withSchema('dbo')
    .select([
      db.raw("'PAGO' AS TipoParcela"),
      db.raw("'PAGO' AS origem"),
      'PCB.NumPrevisao',
      'PCB.CodLoja',
      db.raw('PCB.ValorNota AS ValorParcela'),
      db.raw('NULL AS Vencimento'),
      db.raw(
        "CONCAT('PAGO:', PCB.NumPrevisao, ':', PCB.CodLoja, ':', CAST(PCB.ValorNota AS VARCHAR(32))) AS erpChave",
      ),
    ])
    .where('PCB.NumPrevisao', numPrevisao)
    .andWhere('PCB.CodLoja', codLoja);

  const parcelasRaw = await db.unionAll([parcelasAbertas, parcelasPagas], true);

  return (parcelasRaw as ParcelaRow[]).map(normalizarParcela);
}
