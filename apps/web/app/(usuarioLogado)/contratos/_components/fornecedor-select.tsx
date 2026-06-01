"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useDebouncedValue } from "../_hooks/use-debounced-value";
import { useFornecedorSearch } from "../_hooks/use-fornecedor-search";
import { buscarFornecedorPorCodigo } from "../_services/fornecedor.service";
import type { FornecedorOption } from "../_types/fornecedor.type";
import { formatarFornecedor } from "../_utils/contrato-format";
import {
  codigosEquivalentes,
  manterCacheOpcoesFornecedor,
  normalizarCodigo,
} from "../_utils/entity-select";
import {
  mensagemBuscaMinima,
  podeBuscar,
  SEARCH_DEBOUNCE_MS,
} from "../_utils/search";

type FornecedorSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
};

function encontrarFornecedorPorEntrada(
  entrada: string,
  options: FornecedorOption[],
  cache: Map<string, FornecedorOption>,
): FornecedorOption | null {
  const texto = normalizarCodigo(entrada);
  if (!texto) return null;

  const lista = [...cache.values(), ...options];

  const porCodigo = lista.find((option) => codigosEquivalentes(option.codFor, texto));
  if (porCodigo) return porCodigo;

  const porRotulo = lista.find((option) => formatarFornecedor(option) === texto);
  if (porRotulo) return porRotulo;

  const textoMinusculo = texto.toLowerCase();
  return (
    lista.find(
      (option) =>
        option.nomeFor?.trim().toLowerCase() === textoMinusculo ||
        option.nomeFantasia?.trim().toLowerCase() === textoMinusculo,
    ) ?? null
  );
}

export function FornecedorSelect({
  value,
  onChange,
  label = "Fornecedor",
  disabled,
  required,
  error,
}: FornecedorSelectProps) {
  const inputId = useId();
  const listId = `${inputId}-fornecedores`;
  const [inputValue, setInputValue] = useState(value);
  const previousValue = useRef(value);
  const opcoesConhecidas = useRef<Map<string, FornecedorOption>>(new Map());
  const debouncedSearch = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);
  const { options, loading, erro } = useFornecedorSearch(
    debouncedSearch,
    value || undefined,
  );

  const hint = mensagemBuscaMinima(inputValue);
  const aguardandoPausa =
    podeBuscar(inputValue) && inputValue.trim() !== debouncedSearch.trim();

  const selected = useMemo(() => {
    const cod = normalizarCodigo(value);
    if (!cod) return null;

    return (
      options.find((option) => codigosEquivalentes(option.codFor, cod)) ??
      opcoesConhecidas.current.get(cod) ??
      null
    );
  }, [options, value]);

  useEffect(() => {
    manterCacheOpcoesFornecedor(opcoesConhecidas.current, options);
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

  function confirmarSelecao(fornecedor: FornecedorOption) {
    const cod = normalizarCodigo(fornecedor.codFor);
    opcoesConhecidas.current.set(cod, fornecedor);
    setInputValue(cod);
    onChange(cod);
  }

  function handleChange(nextValue: string) {
    setInputValue(nextValue);

    if (!nextValue.trim()) {
      onChange("");
      return;
    }

    const encontrado = encontrarFornecedorPorEntrada(
      nextValue,
      options,
      opcoesConhecidas.current,
    );
    if (encontrado) {
      confirmarSelecao(encontrado);
    }
  }

  async function handleBlur() {
    const texto = inputValue.trim();
    if (!texto) {
      onChange("");
      return;
    }

    const encontrado = encontrarFornecedorPorEntrada(
      texto,
      options,
      opcoesConhecidas.current,
    );
    if (encontrado) {
      confirmarSelecao(encontrado);
      return;
    }

    if (value && codigosEquivalentes(texto, value)) {
      setInputValue(normalizarCodigo(value));
      return;
    }

    if (/^\d+$/.test(texto)) {
      try {
        const fornecedor = await buscarFornecedorPorCodigo(texto);
        if (fornecedor) {
          confirmarSelecao(fornecedor);
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
        placeholder="Min. 2 caracteres (nome) ou codigo"
        disabled={disabled}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.codFor} value={option.codFor}>
            {formatarFornecedor(option)}
          </option>
        ))}
      </datalist>
      {value ? (
        <span className="text-xs text-(--Text)/60">
          Selecionado: {formatarFornecedor(selected, value)}
        </span>
      ) : null}
      {hint ? <span className="text-xs text-(--Text)/55">{hint}</span> : null}
      {aguardandoPausa ? (
        <span className="text-xs text-(--Text)/55">Aguardando voce terminar de digitar...</span>
      ) : null}
      {loading ? <span className="text-xs text-(--Text)/55">Buscando fornecedores...</span> : null}
      {erro ? <span className="text-xs text-red-600">{erro}</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
