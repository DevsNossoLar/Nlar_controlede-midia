export type FornecedorOption = {
  codFor: string;
  nomeFor: string | null;
  nomeFantasia: string | null;
  NomeFantasia?: string | null;
  /** CPF/CNPJ como gravado no ERP (pode vir com ou sem mascara). */
  cgc?: string | null;
};
