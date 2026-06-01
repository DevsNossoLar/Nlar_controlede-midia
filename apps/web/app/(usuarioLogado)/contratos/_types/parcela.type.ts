export type ParcelaContrato = {
  tipoParcela: string;
  origem: "ABERTO" | "PAGO";
  numPrevisao: number;
  codLoja: number;
  valorParcela: number;
  vencimento: string | null;
  erpChave: string;
  quantidadeAnexos: number;
};
