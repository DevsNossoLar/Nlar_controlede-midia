"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useDebouncedValue } from "../_hooks/use-debounced-value";
import { useLojaSearch } from "../_hooks/use-loja-search";
import { buscarLojaPorCodigo } from "../_services/loja.service";
import type { LojaOption } from "../_types/loja.type";
import { formatarLoja } from "../_utils/contrato-format";
import {
  codigosEquivalentes,
  manterCacheOpcoes,
  normalizarCodigo,
} from "../_utils/entity-select";
import {
  mensagemBuscaMinima,
  podeBuscar,
  SEARCH_DEBOUNCE_MS,
} from "../_utils/search";

type LojaSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
};

function encontrarLojaPorEntrada(
  entrada: string,
  options: LojaOption[],
  cache: Map<string, LojaOption>,
): LojaOption | null {
  const texto = normalizarCodigo(entrada);
  if (!texto) return null;

  const lista = [...cache.values(), ...options];

  const porCodigo = lista.find((option) => codigosEquivalentes(option.codLoja, texto));
  if (porCodigo) return porCodigo;

  const porRotulo = lista.find((option) => formatarLoja(option) === texto);
  if (porRotulo) return porRotulo;

  const textoMinusculo = texto.toLowerCase();
  return (
    lista.find((option) => option.empresa?.trim().toLowerCase() === textoMinusculo) ?? null
  );
}

export function LojaSelect({
  value,
  onChange,
  label = "Loja",
  disabled,
  required,
  error,
}: LojaSelectProps) {
  const inputId = useId();
  const listId = `${inputId}-lojas`;
  const [inputValue, setInputValue] = useState(value);
  const previousValue = useRef(value);
  const opcoesConhecidas = useRef<Map<string, LojaOption>>(new Map());
  const debouncedSearch = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);
  const { options, loading, erro } = useLojaSearch(debouncedSearch, value || undefined);

  const hint = mensagemBuscaMinima(inputValue);
  const aguardandoPausa =
    podeBuscar(inputValue) && inputValue.trim() !== debouncedSearch.trim();

  const selected = useMemo(() => {
    const cod = normalizarCodigo(value);
    if (!cod) return null;

    return (
      options.find((option) => codigosEquivalentes(option.codLoja, cod)) ??
      opcoesConhecidas.current.get(cod) ??
      null
    );
  }, [options, value]);

  useEffect(() => {
    manterCacheOpcoes(opcoesConhecidas.current, options);
  }, [options]);

  useEffect(() => {
    if (value && !codigosEquivalentes(previousValue.current, value)) {
      setInputValue(value);
    }
    if (!value && previousValue.current) {
      setInputValue("");
    }
    previousValue.current = value;
  }, [value]);

  function confirmarSelecao(loja: LojaOption) {
    const cod = normalizarCodigo(loja.codLoja);
    opcoesConhecidas.current.set(cod, loja);
    setInputValue(cod);
    onChange(cod);
  }

  function handleChange(nextValue: string) {
    setInputValue(nextValue);

    if (!nextValue.trim()) {
      onChange("");
      return;
    }

    const encontrada = encontrarLojaPorEntrada(nextValue, options, opcoesConhecidas.current);
    if (encontrada) {
      confirmarSelecao(encontrada);
    }
  }

  async function handleBlur() {
    const texto = inputValue.trim();
    if (!texto) {
      onChange("");
      return;
    }

    const encontrada = encontrarLojaPorEntrada(texto, options, opcoesConhecidas.current);
    if (encontrada) {
      confirmarSelecao(encontrada);
      return;
    }

    if (value && codigosEquivalentes(texto, value)) {
      setInputValue(normalizarCodigo(value));
      return;
    }

    if (/^\d+$/.test(texto)) {
      try {
        const loja = await buscarLojaPorCodigo(texto);
        if (loja) {
          confirmarSelecao(loja);
          return;
        }
      } catch {
        // mantem texto para o usuario corrigir
      }
    }

    if (value) {
      setInputValue(normalizarCodigo(value));
      return;
    }

    onChange("");
  }

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-(--Text)/85">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
        list={listId}
        value={inputValue}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={() => void handleBlur()}
        placeholder="Min. 2 caracteres (empresa) ou codigo"
        disabled={disabled}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.codLoja} value={option.codLoja}>
            {formatarLoja(option)}
          </option>
        ))}
      </datalist>
      {value ? (
        <span className="text-xs text-(--Text)/60">
          Selecionado: {formatarLoja(selected, value)}
        </span>
      ) : null}
      {hint ? <span className="text-xs text-(--Text)/55">{hint}</span> : null}
      {aguardandoPausa ? (
        <span className="text-xs text-(--Text)/55">Aguardando voce terminar de digitar...</span>
      ) : null}
      {loading ? <span className="text-xs text-(--Text)/55">Buscando lojas...</span> : null}
      {erro ? <span className="text-xs text-red-600">{erro}</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
