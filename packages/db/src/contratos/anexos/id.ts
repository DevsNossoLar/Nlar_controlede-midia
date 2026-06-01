import { parseContratoId } from '../id'

export function parseContratoAnexoId(value: string | number): number | null {
  return parseContratoId(value)
}

export { parseContratoId }
