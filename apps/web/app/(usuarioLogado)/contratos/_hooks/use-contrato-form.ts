"use client";

import { useEffect, useState } from "react";
import {
  hasContratoFormErrors,
  validarContratoForm,
  type ContratoFormErrors,
} from "../_schemas/contrato.schema";
import type { ContratoFormValues } from "../_types/contrato.type";
import { CONTRATO_FORM_INICIAL } from "../_utils/contrato.mapper";

export function useContratoForm(initialValues?: ContratoFormValues) {
  const [values, setValues] = useState<ContratoFormValues>(
    initialValues ?? CONTRATO_FORM_INICIAL,
  );
  const [errors, setErrors] = useState<ContratoFormErrors>({});

  useEffect(() => {
    if (initialValues) setValues(initialValues);
  }, [initialValues]);

  function setField<K extends keyof ContratoFormValues>(
    key: K,
    value: ContratoFormValues[K],
  ) {
    if (key === "recorrente") return;

    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validar(): boolean {
    const nextErrors = validarContratoForm(values);
    setErrors(nextErrors);
    return !hasContratoFormErrors(nextErrors);
  }

  return {
    values,
    errors,
    setField,
    setValues,
    validar,
  };
}
