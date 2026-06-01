import type { ParcelaOrigem } from './types'

export type ParcelaRefPayload = {
  origem: ParcelaOrigem
  erpChave: string
}

export function encodeParcelaRef(origem: ParcelaOrigem, erpChave: string): string {
  const payload = JSON.stringify({ origem, erpChave })
  return Buffer.from(payload, 'utf8').toString('base64url')
}

export function decodeParcelaRef(parcelaRef: string): ParcelaRefPayload | null {
  try {
    const trimmed = parcelaRef.trim()
    let json: string

    try {
      json = Buffer.from(trimmed, 'base64url').toString('utf8')
    } catch {
      const normalized = trimmed.replace(/-/g, '+').replace(/_/g, '/')
      const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
      json = Buffer.from(padded, 'base64').toString('utf8')
    }

    const data = JSON.parse(json) as Record<string, unknown>
    const origem = data.origem
    const erpChave = data.erpChave

    if (origem !== 'ABERTO' && origem !== 'PAGO') return null
    if (typeof erpChave !== 'string' || !erpChave.trim()) return null

    return { origem, erpChave: erpChave.trim() }
  } catch {
    return null
  }
}
