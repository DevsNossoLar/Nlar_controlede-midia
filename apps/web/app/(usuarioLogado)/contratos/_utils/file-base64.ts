const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
};

export function normalizarBase64(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const [, payload] = trimmed.split(",");
  return (payload ?? trimmed).replace(/\s/g, "");
}

export function inferirMimeType(mimeType: string, nomeOriginal: string): string {
  if (mimeType && mimeType !== "application/octet-stream") return mimeType;

  const ext = nomeOriginal.split(".").pop()?.toLowerCase();
  if (ext && MIME_BY_EXT[ext]) return MIME_BY_EXT[ext];

  return mimeType || "application/octet-stream";
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
  const clean = normalizarBase64(base64);
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

export function abrirArquivoBase64(
  base64: string,
  mimeType: string,
  nomeOriginal: string,
): void {
  const resolvedMime = inferirMimeType(mimeType, nomeOriginal);
  const blob = base64ToBlob(base64, resolvedMime);
  const url = URL.createObjectURL(blob);

  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(normalizarBase64(result));
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatarTamanhoArquivo(bytes: number | null | undefined): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) return "-";

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
