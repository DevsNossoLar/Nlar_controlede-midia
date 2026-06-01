export function calcularPeriodoMensal(ano: number, mes: number): { inicio: string; fim: string } {
  const mesNormalizado = Math.min(12, Math.max(1, Math.floor(mes)))
  const anoNormalizado = Math.floor(ano)

  const inicio = `${anoNormalizado}-${String(mesNormalizado).padStart(2, '0')}-01`

  const proximoMes = mesNormalizado === 12 ? 1 : mesNormalizado + 1
  const proximoAno = mesNormalizado === 12 ? anoNormalizado + 1 : anoNormalizado
  const fim = `${proximoAno}-${String(proximoMes).padStart(2, '0')}-01`

  return { inicio, fim }
}

export function serializarData(value: Date | string | null | undefined): string | null {
  if (value === null || value === undefined) return null
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}
