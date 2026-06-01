"use client";

import type { Contrato } from "../_types/contrato.type";
import {
  formatarData,
  formatarCondicaoPagamento,
  formatarFormaPagamento,
  formatarFornecedor,
  formatarLoja,
  formatarMoeda,
  TIPO_CONTRATO_LABEL,
} from "../_utils/contrato-format";
import { ContratoActions } from "./contrato-actions";
import { ContratoStatusBadge } from "./contrato-status-badge";

type ContratosTableProps = {
  contratos: Contrato[];
  loading?: boolean;
  onCancel: (contrato: Contrato) => void;
  onClose: (contrato: Contrato) => void;
};

export function ContratosTable({
  contratos,
  loading,
  onCancel,
  onClose,
}: ContratosTableProps) {
  return (
    <div className="overflow-auto rounded-md border border-(--Text)/12 bg-white/80">
      <table className="w-full min-w-[1160px] text-sm">
        <thead>
          <tr className="border-b border-(--Text)/10 bg-zinc-50/90">
            <th className="p-3 text-left font-semibold">Contrato</th>
            <th className="p-3 text-left font-semibold">Fornecedor</th>
            <th className="p-3 text-left font-semibold">Loja</th>
            <th className="p-3 text-left font-semibold">Tipo</th>
            <th className="p-3 text-left font-semibold">Periodo</th>
            <th className="p-3 text-left font-semibold">Pagamento</th>
            <th className="p-3 text-left font-semibold">Valor</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {contratos.map((contrato) => (
            <tr key={contrato.id} className="border-b border-(--Text)/8 last:border-0">
              <td className="p-3 align-top">
                <div className="font-semibold text-(--Text)">{contrato.titulo}</div>
                <div className="mt-1 max-w-64 truncate text-xs text-(--Text)/60">
                  {contrato.descricao ?? "-"}
                </div>
              </td>
              <td className="p-3 align-top">{formatarFornecedor(contrato.fornecedor, contrato.codFor)}</td>
              <td className="p-3 align-top">{formatarLoja(contrato.loja, contrato.codLoja)}</td>
              <td className="p-3 align-top">{TIPO_CONTRATO_LABEL[contrato.tipoContrato]}</td>
              <td className="p-3 align-top">
                {formatarData(contrato.dataInicio)} ate {formatarData(contrato.dataFim)}
              </td>
              <td className="p-3 align-top">
                <div>{formatarCondicaoPagamento(contrato.condicaoPagamento, contrato.codCondicaoPagamento)}</div>
                <div className="mt-1 text-xs text-(--Text)/60">
                  {formatarFormaPagamento(contrato.formaPagamento, contrato.codFormaPagamento)}
                </div>
              </td>
              <td className="p-3 align-top">
                <div>{formatarMoeda(contrato.valorTotal)}</div>
                {contrato.recorrente ? (
                  <div className="text-xs text-(--Text)/60">
                    Mensal {formatarMoeda(contrato.valorMensal)}
                  </div>
                ) : null}
              </td>
              <td className="p-3 align-top">
                <ContratoStatusBadge status={contrato.status} dataFim={contrato.dataFim} />
              </td>
              <td className="p-3 align-top">
                <ContratoActions contrato={contrato} onCancel={onCancel} onClose={onClose} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading ? <div className="p-4 text-sm text-(--Text)/65">Carregando contratos...</div> : null}
      {!loading && contratos.length === 0 ? (
        <div className="p-6 text-sm text-(--Text)/65">
          Nenhum contrato encontrado para os filtros atuais.
        </div>
      ) : null}
    </div>
  );
}
