/** Define `secure` nos cookies conforme a URL pública do app (HTTPS → true). */
export function cookieSecureForPublicUrl(publicUrl: string): boolean {
  try {
    return new URL(publicUrl).protocol === 'https:';
  } catch {
    return false;
  }
}
