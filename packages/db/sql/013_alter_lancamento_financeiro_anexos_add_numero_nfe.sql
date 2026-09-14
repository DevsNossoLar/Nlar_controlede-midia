/* 013 — Adiciona numero da NF-e nos anexos de parcela (tipo nota_fiscal) */

IF OBJECT_ID('dbo.NS_controle_de_midia_lancamento_financeiro_anexos', 'U') IS NOT NULL
BEGIN
  IF COL_LENGTH('dbo.NS_controle_de_midia_lancamento_financeiro_anexos', 'numero_nfe') IS NULL
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_lancamento_financeiro_anexos
      ADD numero_nfe NVARCHAR(20) NULL;
  END;
END;
