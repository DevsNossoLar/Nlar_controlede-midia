/**
 * Garante basePath em src locais (ex.: /selo.svg do ui-theme).
 * @param {{ src: string, width: number, quality?: number }} params
 */
export default function imageLoader({ src, width, quality }) {
  if (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  const basePath = "/controle-de-midias";
  const path = src.startsWith(basePath)
    ? src
    : `${basePath}${src.startsWith("/") ? src : `/${src}`}`;

  const q = quality || 75;
  return `${path}?w=${width}&q=${q}`;
}
