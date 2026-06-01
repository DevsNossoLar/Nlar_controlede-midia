/* 011 — Lancamentos por parcela + anexos (comprovantes) */

IF OBJECT_ID('dbo.NS_controle_de_midia_lancamento_financeiros', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.NS_controle_de_midia_lancamento_financeiros (
    id INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,

    contrato_id INT NOT NULL,

    origem NVARCHAR(10) NOT NULL
      CONSTRAINT CK_ns_midia_lancamento_origem CHECK (origem IN ('ABERTO', 'PAGO')),

    erp_chave NVARCHAR(120) NOT NULL,

    num_previsao NVARCHAR(60) NULL,
    cod_loja NVARCHAR(36) NULL,

    valor DECIMAL(18, 2) NOT NULL,
    data_vencimento DATE NULL,

    created_by NVARCHAR(36) NULL,

    created_at DATETIME2 NOT NULL
      CONSTRAINT DF_ns_midia_lancamento_created_at DEFAULT SYSUTCDATETIME(),

    updated_at DATETIME2 NULL,

    CONSTRAINT FK_ns_midia_lancamento_contrato FOREIGN KEY (contrato_id)
      REFERENCES dbo.NS_controle_de_midia_contratos(id)
      ON DELETE NO ACTION,

    CONSTRAINT UQ_ns_midia_lancamento_parcela UNIQUE (contrato_id, origem, erp_chave)
  );

  CREATE INDEX idx_ns_midia_lancamento_contrato
    ON dbo.NS_controle_de_midia_lancamento_financeiros(contrato_id);
END;

IF OBJECT_ID('dbo.NS_controle_de_midia_lancamento_financeiro_anexos', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.NS_controle_de_midia_lancamento_financeiro_anexos (
    id INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,

    lancamento_financeiro_id INT NOT NULL,

    tipo NVARCHAR(30) NOT NULL
      CONSTRAINT CK_ns_midia_lancamento_anexo_tipo CHECK (
        tipo IN ('comprovante', 'boleto', 'outro')
      ),

    nome_original NVARCHAR(255) NOT NULL,
    mime_type NVARCHAR(120) NOT NULL,
    tamanho_bytes BIGINT NULL,
    arquivo_base64 NVARCHAR(MAX) NOT NULL,

    created_by NVARCHAR(36) NULL,

    created_at DATETIME2 NOT NULL
      CONSTRAINT DF_ns_midia_lancamento_anexo_created_at DEFAULT SYSUTCDATETIME(),

    updated_at DATETIME2 NULL,

    CONSTRAINT FK_ns_midia_lancamento_anexo_lancamento FOREIGN KEY (lancamento_financeiro_id)
      REFERENCES dbo.NS_controle_de_midia_lancamento_financeiros(id)
      ON DELETE NO ACTION
  );

  CREATE INDEX idx_ns_midia_lancamento_anexo_lancamento
    ON dbo.NS_controle_de_midia_lancamento_financeiro_anexos(lancamento_financeiro_id);
END;
