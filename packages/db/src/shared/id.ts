/**
 * Padrao de IDs do modulo controle de midia:
 * - Chaves primarias e FKs entre tabelas do modulo: INT IDENTITY (1, 2, 3...)
 * - Codigos de fornecedor/loja/usuario: NVARCHAR (codFor, codLoja, created_by)
 */
export function parsePositiveIntId(value: string | number): number | null {
  const id = typeof value === 'number' ? value : Number(String(value).trim())

  if (!Number.isInteger(id) || id < 1) {
    return null
  }

  return id
}
