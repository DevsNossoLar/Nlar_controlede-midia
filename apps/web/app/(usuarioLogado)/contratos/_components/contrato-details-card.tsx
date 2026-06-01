"use client";

import type { Contrato } from "../_types/contrato.type";
import {
  formatarData,
  formatarDataHora,
  formatarCondicaoPagamento,
  formatarFormaPagamento,
  formatarFornecedor,
  formatarLoja,
  formatarMoeda,
  TIPO_CONTRATO_LABEL,
} from "../_utils/contrato-format";
import { ContratoAnexos } from "./contrato-anexos";
import { ContratoStatusBadge } from "./contrato-status-badge";

type ContratoDetailsCardProps = {
  contrato: Contrato;
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-(--Text)/10 bg-white/65 p-3">
      <dt className="text-xs font-semibold uppercase text-(--Text)/50">{label}</dt>
      <dd className="mt-1 break-words text-sm text-(--Text)">{value}</dd>
    </div>
  );
}

export function ContratoDetailsCard({ contrato }: ContratoDetailsCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-md border border-(--Text)/12 bg-white/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{contrato.titulo}</h2>
            <p className="mt-1 max-w-3xl text-sm text-(--Text)/65">
              {contrato.descricao ?? "-"}
            </p>
          </div>
          <ContratoStatusBadge status={contrato.status} dataFim={contrato.dataFim} />
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem
            label="Fornecedor"
            value={formatarFornecedor(contrato.fornecedor, contrato.codFor)}
          />
          <DetailItem label="Loja" value={formatarLoja(contrato.loja, contrato.codLoja)} />
          <DetailItem label="Tipo" value={TIPO_CONTRATO_LABEL[contrato.tipoContrato]} />
          <DetailItem label="Num. previsao" value={contrato.numPrevisao ?? "-"} />
          <DetailItem label="Num. cotacao" value={contrato.numCotacao ?? "-"} />
          <DetailItem label="Data inicio" value={formatarData(contrato.dataInicio)} />
          <DetailItem label="Data fim" value={formatarData(contrato.dataFim)} />
          <DetailItem label="Valor total" value={formatarMoeda(contrato.valorTotal)} />
          <DetailItem label="Valor mensal" value={formatarMoeda(contrato.valorMensal)} />
          <DetailItem
            label="Condicao pgto."
            value={formatarCondicaoPagamento(
              contrato.condicaoPagamento,
              contrato.codCondicaoPagamento,
            )}
          />
          <DetailItem
            label="Forma pgto."
            value={formatarFormaPagamento(contrato.formaPagamento, contrato.codFormaPagamento)}
          />
          <DetailItem
            label="Dia vencimento"
            value={contrato.diaVencimentoPadrao ? String(contrato.diaVencimentoPadrao) : "-"}
          />
          <DetailItem label="Criado por" value={contrato.criadoPor ?? "-"} />
          <DetailItem label="Criado em" value={formatarDataHora(contrato.criadoEm)} />
          <DetailItem label="Atualizado em" value={formatarDataHora(contrato.atualizadoEm)} />
        </dl>

        {contrato.observacao ? (
          <div className="mt-4 rounded-md border border-(--Text)/10 bg-white/65 p-3">
            <h3 className="text-sm font-semibold">Observacao</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-(--Text)/75">
              {contrato.observacao}
            </p>
          </div>
        ) : null}
      </section>

      <ContratoAnexos contratoId={contrato.id} />
    </div>
  );
}
