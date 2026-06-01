export function useUserImage(imagemUsuario: unknown) {
  const imagem = imagemUsuario;

  if (!imagem) return null;


  if (typeof imagem === "string") {
    return `data:image/jpeg;base64,${imagem}`;
  }

  if (
    typeof imagem === "object" &&
    imagem !== null &&
    "data" in imagem &&
    Array.isArray((imagem as { data: unknown }).data)
  ) {
    try {
      const bytes = (imagem as { data: number[] }).data;
      const binary = String.fromCharCode(...new Uint8Array(bytes));
      return `data:image/jpeg;base64,${btoa(binary)}`;
    } catch (error) {
      console.error("Erro ao processar binário da imagem:", error);
      return null;
    }
  }

  return null;
}