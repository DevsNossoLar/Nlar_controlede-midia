import { parsePositiveIntId } from '../shared/id'

export function parseContratoId(value: string | number): number | null {
  return parsePositiveIntId(value)
}
