/** Identifica status equivalente a “concluído” (várias grafias no banco). */
export function isChamadoConcluidoStatus(status: string | undefined | null): boolean {
  if (status == null || String(status).trim() === '') return false;
  const s = String(status)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return s === 'concluido';
}
