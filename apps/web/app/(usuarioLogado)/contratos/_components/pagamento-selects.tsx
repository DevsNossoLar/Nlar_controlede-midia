"use client";

import { usePagamentoOptions } from "../_hooks/use-pagamento-options";

type PagamentoSelectsProps = {
  codCondicaoPagamento: string;
  codFormaPagamento: string;
  onCondicaoChange: (value: string) => void;
  onFormaChange: (value: string) => void;
  condicaoError?: string;
  formaError?: string;
};

export function PagamentoSelects({
  codCondicaoPagamento,
  codFormaPagamento,
  onCondicaoChange,
  onFormaChange,
  condicaoError,
  formaError,
}: PagamentoSelectsProps) {
  const { condicoes, formas, loading, erro } = usePagamentoOptions();

  return (
    <>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Condicao de pagamento *</span>
        <select
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={codCondicaoPagamento}
          onChange={(event) => onCondicaoChange(event.target.value)}
          disabled={loading}
        >
          <option value="">Selecione</option>
          {condicoes.map((condicao) => (
            <option
              key={condicao.codCondicaoPagamento}
              value={condicao.codCondicaoPagamento}
            >
              {condicao.codCondicaoPagamento} - {condicao.descricao}
            </option>
          ))}
        </select>
        {condicaoError ? <span className="text-xs text-red-600">{condicaoError}</span> : null}
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Forma de pagamento *</span>
        <select
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={codFormaPagamento}
          onChange={(event) => onFormaChange(event.target.value)}
          disabled={loading}
        >
          <option value="">Selecione</option>
          {formas.map((forma) => (
            <option key={forma.codFormaPagamento} value={forma.codFormaPagamento}>
              {forma.codFormaPagamento} - {forma.descricao}
            </option>
          ))}
        </select>
        {formaError ? <span className="text-xs text-red-600">{formaError}</span> : null}
        {erro ? <span className="text-xs text-red-600">{erro}</span> : null}
      </label>
    </>
  );
}
