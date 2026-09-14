/* 012 — Adiciona tipo nota_fiscal nos anexos de parcela */

IF OBJECT_ID('dbo.NS_controle_de_midia_lancamento_financeiro_anexos', 'U') IS NOT NULL
BEGIN
  IF EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_ns_midia_lancamento_anexo_tipo'
      AND parent_object_id = OBJECT_ID('dbo.NS_controle_de_midia_lancamento_financeiro_anexos')
  )
  BEGIN
    ALTER TABLE dbo.NS_controle_de_midia_lancamento_financeiro_anexos
      DROP CONSTRAINT CK_ns_midia_lancamento_anexo_tipo;
  END;

  ALTER TABLE dbo.NS_controle_de_midia_lancamento_financeiro_anexos
    ADD CONSTRAINT CK_ns_midia_lancamento_anexo_tipo CHECK (
      tipo IN ('comprovante', 'boleto', 'nota_fiscal', 'outro')
    );
END;
