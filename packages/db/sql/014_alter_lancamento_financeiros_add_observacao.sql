/* 014 - Observacao por parcela. Executar manualmente antes de usar a funcionalidade.
   Altera somente a tabela do modulo; nenhuma tabela do ERP e modificada. */

IF OBJECT_ID('dbo.NS_controle_de_midia_lancamento_financeiros', 'U') IS NULL
BEGIN
  THROW 50000, 'Tabela de lancamentos ausente. Aplique o script 011 primeiro.', 1;
END;

IF COL_LENGTH('dbo.NS_controle_de_midia_lancamento_financeiros', 'observacao') IS NULL
BEGIN
  ALTER TABLE dbo.NS_controle_de_midia_lancamento_financeiros
    ADD observacao NVARCHAR(2000) NULL;
END;
